import os
import math
import pandas as pd
import numpy as np
from datetime import datetime
from sklearn.model_selection import train_test_split
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score, accuracy_score, precision_score, recall_score, f1_score
import torch
from transformers import AutoTokenizer, AutoModelForSequenceClassification, AutoConfig, Trainer, TrainingArguments, BertForSequenceClassification, EarlyStoppingCallback, TrainerCallback, DataCollatorWithPadding

print(f"GPU Available: {torch.cuda.is_available()}")
print(f"GPU Name: {torch.cuda.get_device_name(0) if torch.cuda.is_available() else 'N/A'}")

if torch.cuda.is_available():
    print(f"GPU Memory Allocated: {torch.cuda.memory_allocated(0)/1024**3:.2f} GB")
    print(f"GPU Memory Reserved: {torch.cuda.memory_reserved(0)/1024**3:.2f} GB")

start_year = 2006 # No 2005 for simplicity
end_year   = 2024

years = [2008, 2009, 2010, 2020, 2021, 2022]

dfs = []

for year in years:
    for month in range(1,13):
        path = f"/kaggle/input/comments/data/sampled_comments/RC_{year}-{month:02d}.csv"
        try:
            df = pd.read_csv(path, header=None).head(5000)
        except FileNotFoundError:
            # skip missing months
            continue

        df.columns = ["subreddit","subreddit_id","body","date_created_utc"]
        file_year = pd.to_datetime(df["date_created_utc"], unit="s").dt.year
        df["year"] = file_year.apply(lambda x: "2008-2010" if x in [2008, 2009, 2010] else "2020-2022")

        dfs.append(df)
        
    print(f"  Loaded {year}")

# final concatenated DF
final_df = pd.concat(dfs, ignore_index=True)

final_df = final_df[final_df["body"] != "[deleted]"]

final_df['label'] = final_df['year']

print(final_df.head(20))
final_df.to_csv('/kaggle/working/test.csv', index=False)

# -------------- Training Splits -------------- 
train_df, temp_df = train_test_split(
    final_df, 
    test_size=0.2, 
    stratify=final_df['label'], 
    random_state=42
)

val_df, test_df = train_test_split(
    temp_df, 
    test_size=0.5,
    stratify=temp_df['label'], 
    random_state=42
)

# Map string labels to integers AFTER splitting
label_map = {"2008-2010": 0, "2020-2022": 1}
train_df = train_df.copy()
val_df = val_df.copy()
test_df = test_df.copy()

train_df['label'] = train_df['year'].map(label_map)
val_df['label'] = val_df['year'].map(label_map)
test_df['label'] = test_df['year'].map(label_map)

print(f"Train size: {len(train_df):,} ({len(train_df)/len(final_df)*100:.1f}%)")
print(f"Val size:   {len(val_df):,} ({len(val_df)/len(final_df)*100:.1f}%)")
print(f"Test size:  {len(test_df):,} ({len(test_df)/len(final_df)*100:.1f}%)\n")

# -------------- Tokenization --------------
model_name = "roberta-base" # Also try microsoft/deberta-v3-base Changed from distilbert to roberta because better for reddit comments
tokenizer = AutoTokenizer.from_pretrained(model_name)

def preprocess(texts, max_length=256):
    return tokenizer(
        texts, 
        truncation=True, 
        padding="max_length", # Each batch padded to longest insteadof max_length
        max_length=max_length,
        return_tensors=None
        ) 

train_texts = train_df['body'].fillna("").astype(str).tolist()
val_texts   = val_df['body'].fillna("").astype(str).tolist()
test_texts  = test_df['body'].fillna("").astype(str).tolist()

train_enc = preprocess(train_texts)
val_enc   = preprocess(val_texts)
test_enc  = preprocess(test_texts)

# -------------- Dataset Class --------------

class RedditDataset(torch.utils.data.Dataset):
    def __init__(self, encodings, labels):
        self.encodings = encodings
        self.labels = labels

    def __len__(self): 
        return len(self.labels)

    def __getitem__(self, idx):
        item = {k: torch.tensor(v[idx]) for k,v in self.encodings.items()}
        item['labels'] = torch.tensor(int(self.labels[idx]), dtype=torch.long)
        return item

train_dataset = RedditDataset(train_enc, train_df['label'].tolist())
val_dataset   = RedditDataset(val_enc, val_df['label'].tolist())
test_dataset  = RedditDataset(test_enc,  test_df['label'].tolist())

# -------------- Model --------------

print("Loading model...")
config = AutoConfig.from_pretrained(model_name)
config.num_labels = 2
config.problem_type = "single_label_classification"

model = AutoModelForSequenceClassification.from_pretrained(model_name,config=config)

# Explicitly move model to GPU if available
if torch.cuda.is_available():
    model = model.to('cuda')

# Check device by inspecting a parameter
device = next(model.parameters()).device
print(f"Model device: {device}")

# -------------- Training arguments --------------
training_args = TrainingArguments(report_to="none",
                                  disable_tqdm=False,
                                  output_dir="/kaggle/working/reddit_year_model",
                                  num_train_epochs=3,
                                  per_device_train_batch_size=32,
                                  per_device_eval_batch_size=64,
                                  eval_strategy="epoch",
                                  save_strategy="epoch",
                                  logging_strategy="steps",
                                  logging_steps=200,
                                  logging_first_step=True,
                                  load_best_model_at_end=True,
                                  greater_is_better=False,
                                  save_total_limit=2,
                                  fp16=torch.cuda.is_available(),
                                  learning_rate=2e-5,
                                  weight_decay=0.01,
                                  warmup_ratio=0.1,
                                  dataloader_num_workers=2,
                                  dataloader_pin_memory=True)
# -------------- Metrics --------------

def compute_metrics(eval_pred):
    logits, labels = eval_pred
    preds = logits.argmax(axis=-1)

    acc = accuracy_score(labels, preds)
    prec = precision_score(labels, preds)
    rec = recall_score(labels, preds)
    f1 = f1_score(labels, preds)
    
    return {
        "acc": acc,
        "prec": prec,
        "rec": rec,
        "f1": f1}

# Callbacks in case of timeout
class ProgressCallback(TrainerCallback):
    def on_epoch_end(self, args, state, control, **kwargs):
        print(f"Epoch {state.epoch} completed")
        if torch.cuda.is_available():
            torch.cuda.empty_cache()

data_collator = DataCollatorWithPadding(tokenizer)

trainer = Trainer(
model=model,
args=training_args,
train_dataset=train_dataset,
eval_dataset=val_dataset,
compute_metrics=compute_metrics,
callbacks=[EarlyStoppingCallback(early_stopping_patience=2), ProgressCallback()],
data_collator=data_collator
)

# -------------- Train --------------
print("\nStarting training...")
trainer.train()

# -------------- Evaluate and detailed report --------------
preds_output = trainer.predict(test_dataset)
preds = preds_output.predictions.argmax(axis=-1)

label_years = ["2008-2010", "2020-2022"]

# Get actual labels (integers) and convert predictions back to year ranges
actual_labels = test_df['label'].values
predicted_years = [label_years[p] for p in preds]
actual_years = [label_years[a] for a in actual_labels]

print(f"\nAccuracy:  {accuracy_score(actual_labels, preds):.3f}")
print(f"Precision: {precision_score(actual_labels, preds):.3f}")
print(f"Recall:    {recall_score(actual_labels, preds):.3f}")
print(f"F1:        {f1_score(actual_labels, preds):.3f}")

# Remove off-by metrics (not applicable for binary classification)

# Sample predictions
print("\n" + "="*50)
print("Sample Predictions (first 10)")
print("="*50)
for i in range(min(10, len(test_df))):
    actual = actual_years[i]
    pred = predicted_years[i]
    text = test_texts[i][:80] + "..." if len(test_texts[i]) > 80 else test_texts[i]
    print(f"\nActual: {actual} | Predicted: {pred}")
    print(f"Text: {text}")

# Save results
results_df = pd.DataFrame({
    'actual_year': actual_years,
    'predicted_year': predicted_years,
    'text_sample': [t[:100] for t in test_texts]
})
results_df.to_csv('/kaggle/working/predictions.csv', index=False)

# Save only classification metrics
metrics = {
    'accuracy': accuracy_score(actual_labels, preds),
    'precision': precision_score(actual_labels, preds),
    'recall': recall_score(actual_labels, preds),
    'f1': f1_score(actual_labels, preds)
}
with open('/kaggle/working/metrics.txt', 'w') as f:
    for k, v in metrics.items():
        f.write(f"{k}: {v:.4f}\n")

