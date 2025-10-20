#Uses only the 2013 and 2024 January reddit csv files

import os
import math
import pandas as pd
import numpy as np
from datetime import datetime
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score, f1_score, classification_report
import torch
from transformers import AutoTokenizer, AutoModel, AutoConfig, Trainer, TrainingArguments, BertForSequenceClassification

keep_years = [2013,2024]

df1 = pd.read_csv("RC_2013-01.csv", header=None).head(1000)
df1.columns = ["subreddit","subreddit_id","body","date_created_utc"]
df1["year"] = pd.to_datetime(df1["date_created_utc"], unit="s").dt.year

df2 = pd.read_csv("RC_2024-01.csv", header=None).head(1000)
df2.columns = ["subreddit","subreddit_id","body","date_created_utc"]
df2["year"] = pd.to_datetime(df2["date_created_utc"], unit="s").dt.year

final_df = pd.concat([df2, df1], ignore_index=True)
final_df['label'] = final_df['year'].apply(lambda y: keep_years.index(y))

train_df, test_df = train_test_split(final_df, test_size=0.1, stratify=final_df['label'], random_state=42)

# -------------- Tokenization --------------
model_name = "distilbert-base-uncased"
tokenizer = AutoTokenizer.from_pretrained(model_name)

def preprocess(texts, max_length=128):
    return tokenizer(texts, truncation=True, padding='max_length', max_length=max_length)

train_texts = train_df['body'].tolist()
test_texts  = test_df['body'].tolist()
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
        item['labels'] = torch.tensor(int(self.labels[idx]))
        return item

train_dataset = RedditDataset(train_enc, train_df['label'].tolist())
test_dataset  = RedditDataset(test_enc,  test_df['label'].tolist())

# -------------- Model --------------
num_labels = 2
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
    metric_for_best_model="eval_accuracy",
    save_total_limit=2,
    fp16=torch.cuda.is_available()
)

# -------------- Metrics --------------
def compute_metrics(eval_pred):
    logits, labels = eval_pred
    preds = np.argmax(logits, axis=-1)
    acc = accuracy_score(labels, preds)
    f1 = f1_score(labels, preds, average='macro')
    return {"accuracy": acc, "macro_f1": f1}

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
preds = np.argmax(preds_output.predictions, axis=-1)
print("Accuracy:", accuracy_score(test_df['label'], preds))
print("Classification report (per-year):")
print(classification_report(test_df['label'], preds, target_names=[str(y) for y in keep_years]))

# Save model & tokenizer
trainer.save_model("./reddit_year_model")
tokenizer.save_pretrained("./reddit_year_model")