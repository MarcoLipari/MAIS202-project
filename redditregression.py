import os
import math
import pandas as pd
import numpy as np
from datetime import datetime
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score, f1_score, classification_report
import torch
from transformers import AutoTokenizer, AutoModel, AutoConfig, Trainer, TrainingArguments, BertForSequenceClassification

start_year = 2006 # No 2005 for simplicity
end_year   = 2024

dfs = []

for year in range(start_year, end_year+1):
    for month in range(1,13):
        path = f"data/sampled_comments/RC_{year}-{month:02d}.csv"
        try:
            df = pd.read_csv(path, header=None).head(100)
        except FileNotFoundError:
            # skip missing months
            continue

        df.columns = ["subreddit","subreddit_id","body","date_created_utc"]
        df["year"] = pd.to_datetime(df["date_created_utc"], unit="s").dt.year
        dfs.append(df)

# final concatenated DF
final_df = pd.concat(dfs, ignore_index=True)

keep_years = [ x + 2006 for x in range(0, 19)]

final_df['label'] = final_df['year'].apply(lambda y: keep_years.index(y))

train_df, test_df = train_test_split(final_df, test_size=0.1, stratify=final_df['label'], random_state=42)

# -------------- Tokenization --------------
model_name = "distilbert-base-uncased"
tokenizer = AutoTokenizer.from_pretrained(model_name)

def preprocess(texts, max_length=128):
    return tokenizer(texts, truncation=True, padding='max_length', max_length=max_length)

train_texts = train_df['body'].fillna("").astype(str).tolist()
test_texts  = test_df['body'].fillna("").astype(str).tolist()
train_enc = preprocess(train_texts)
test_enc  = preprocess(test_texts)

import torch
class RedditDataset(torch.utils.data.Dataset):
    def __init__(self, encodings, labels):
        self.encodings = encodings
        self.labels = labels
    def __len__(self): return len(self.labels)
    def __getitem__(self, idx):
        item = {k: torch.tensor(v[idx]) for k,v in self.encodings.items()}
        item['labels'] = torch.tensor(float(self.labels[idx]))
        return item

train_dataset = RedditDataset(train_enc, train_df['label'].tolist())
test_dataset  = RedditDataset(test_enc,  test_df['label'].tolist())

# -------------- Model --------------
num_labels = 1
model = BertForSequenceClassification.from_pretrained("distilbert-base-uncased", num_labels=num_labels)

# -------------- Training arguments --------------
training_args = TrainingArguments(
    output_dir="./reddit_year_model",
    num_train_epochs=3,
    per_device_train_batch_size=32,
    per_device_eval_batch_size=64,
    eval_strategy="epoch",
    save_strategy="epoch",
    logging_strategy="epoch",
    load_best_model_at_end=True,
    metric_for_best_model="mse",
    save_total_limit=2,
    fp16=torch.cuda.is_available(),
    greater_is_better=False,
    learning_rate=2e-5,
    weight_decay=0.01,
)

# -------------- Metrics --------------
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score

def compute_metrics(eval_pred):
    logits, labels = eval_pred
    preds = logits.squeeze(-1)  # shape (batch,)
    mse = mean_squared_error(labels, preds)
    mae = mean_absolute_error(labels, preds)
    r2  = r2_score(labels, preds)
    return {"mse": mse, "mae": mae, "r2": r2}

trainer = Trainer(
    model=model,
    args=training_args,
    train_dataset=train_dataset,
    eval_dataset=test_dataset,
    compute_metrics=compute_metrics
)

# -------------- Train --------------
trainer.train()

# -------------- Evaluate and detailed report --------------
preds_output = trainer.predict(test_dataset)
preds = preds_output.predictions.squeeze(-1)

print("MAE:", mean_absolute_error(test_df['label'], preds))
print("MSE:", mean_squared_error(test_df['label'], preds))
print("R2 :", r2_score(test_df['label'], preds))

# Save model & tokenizer
trainer.save_model("./reddit_year_model")
tokenizer.save_pretrained("./reddit_year_model")
