import os
import math
import pandas as pd
import numpy as np
from datetime import datetime
from sklearn.model_selection import train_test_split
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score
import torch
from transformers import AutoTokenizer, AutoModelForSequenceClassification, AutoConfig, Trainer, TrainingArguments, BertForSequenceClassification, EarlyStoppingCallback

start_year = 2006 # No 2005 for simplicity
end_year   = 2024

dfs = []

for year in range(start_year, end_year+1):
    for month in range(1,13):
        path = f"data/sampled_comments/RC_{year}-{month:02d}.csv"
        try:
            df = pd.read_csv(path, header=None).head(10)
        except FileNotFoundError:
            # skip missing months
            continue

        df.columns = ["subreddit","subreddit_id","body","date_created_utc"]
        df["year"] = pd.to_datetime(df["date_created_utc"], unit="s").dt.year
        dfs.append(df)
        
    print(f"  Loaded {year}")

# final concatenated DF
final_df = pd.concat(dfs, ignore_index=True)

keep_years = [ x + 2006 for x in range(0, 19)]

final_df['label'] = final_df['year'].apply(lambda y: keep_years.index(y))

# -------------- Training Splits -------------- 
# 80% train, 10% val, 10% test
train_df, temp_df = train_test_split(
    final_df, 
    test_size=0.2, 
    stratify=final_df['label'], 
    random_state=42
)

val_df, test_df = train_test_split(
    temp_df, 
    test_size=0.5,  # 50% of 20% = 10% of total
    stratify=temp_df['label'], 
    random_state=42
)

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
        padding='longest', # Each batch padded to longest insteadof max_length
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
        item['labels'] = torch.tensor(float(self.labels[idx]), dtype=torch.float)
        return item

train_dataset = RedditDataset(train_enc, train_df['label'].tolist())
val_dataset   = RedditDataset(val_enc, val_df['label'].tolist())
test_dataset  = RedditDataset(test_enc,  test_df['label'].tolist())

# -------------- Model --------------

print("Loading model...")
config = AutoConfig.from_pretrained(model_name)
config.num_labels = 1
config.problem_type = "regression"

model = AutoModelForSequenceClassification.from_pretrained(
    model_name,
    config=config,
)

# Explicitly move model to GPU if available
if torch.cuda.is_available():
    model.to('cuda')

print(f"Model device: {model.device}")
# -------------- Training arguments --------------
training_args = TrainingArguments(
    output_dir="./reddit_year_model",
    num_train_epochs=3,
    per_device_train_batch_size=8, # Change to 32 for final training
    per_device_eval_batch_size=16, # Change to 64 for final training
    eval_strategy="epoch",
    save_strategy="epoch",
    logging_strategy="steps",
    logging_steps=500,
    load_best_model_at_end=True,
    metric_for_best_model="mse",
    greater_is_better=False,
    save_total_limit=2,
    # Optimize for GPU
    #fp16=torch.cuda.is_available(),
    learning_rate=2e-5,
    weight_decay=0.01,
    warmup_ratio=0.1,

)

# -------------- Metrics --------------

def compute_metrics(eval_pred):
    logits, labels = eval_pred
    preds = logits.squeeze(-1)  # shape (batch,)
    preds_clipped = np.clip(preds, 0, len(keep_years) - 1)

    mse = mean_squared_error(labels, preds)
    mae = mean_absolute_error(labels, preds)
    rmse = np.sqrt(mse)
    r2  = r2_score(labels, preds)
    
    off_by_1 = np.mean(np.abs(preds_clipped - labels) <= 1)
    off_by_2 = np.mean(np.abs(preds_clipped - labels) <= 2)
    
    return {
        "mse": mse,
        "mae": mae,
        "rmse": rmse,
        "r2": r2,
        "off_by_1_acc": off_by_1,
        "off_by_2_acc": off_by_2
    }

trainer = Trainer(
    model=model,
    args=training_args,
    train_dataset=train_dataset,
    eval_dataset=val_dataset,
    compute_metrics=compute_metrics,
    callbacks=[EarlyStoppingCallback(early_stopping_patience=2)]
)

# -------------- Train --------------
print("\nStarting training...")
trainer.train()

# -------------- Evaluate and detailed report --------------
print("\n" + "="*50)
print("Final Evaluation on Test Set")
print("\n" + "="*50)

preds_output = trainer.predict(test_dataset)
preds = preds_output.predictions.squeeze(-1)
preds_clipped = np.clip(preds, 0, len(keep_years) - 1)

# Convert back to actual years for interpretability
actual_years = test_df['year'].values
predicted_years = [keep_years[int(round(p))] for p in preds_clipped]

print(f"\nMAE:  {mean_absolute_error(test_df['label'], preds_clipped):.3f} years")
print(f"RMSE: {np.sqrt(mean_squared_error(test_df['label'], preds_clipped)):.3f} years")
print(f"R²:   {r2_score(test_df['label'], preds_clipped):.3f}")

off_by_1 = np.mean(np.abs(preds_clipped - test_df['label'].values) <= 1)
off_by_2 = np.mean(np.abs(preds_clipped - test_df['label'].values) <= 2)
print(f"\nOff-by-1 year accuracy: {off_by_1:.1%}")
print(f"Off-by-2 year accuracy: {off_by_2:.1%}")

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

# Save model & tokenizer
trainer.save_model("./reddit_year_model")
tokenizer.save_pretrained("./reddit_year_model")
