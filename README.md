
# Reddit Comment Year Classification

## Problem statement
This project aims to develop a machine learning model capable of estimating the time period during which a Reddit comment was written, based solely on its text.

Reddit language evolves dramatically over time. Slang, memes, tone, formatting, punctuation patterns, and cultural references all change year to year. This model will be able to predict the date a reddit comment belongs to based on its linguistic features.


## Data

- We used the publicly available Reddit monthly comment dumps from June 2005 till December 2024 provided on Academic Torrents: [https://academictorrents.com/details/ba051999301b109eab37d16f027b3f49ade2de13](https://academictorrents.com/details/ba051999301b109eab37d16f027b3f49ade2de13)
- We then used a bash script to clean the data into monthly CSV files `data/commentcleaner` 

# Models and Approach

## Linear regression: `redditregression.py`
- Large dataset needed for accuracy.
- Long training time.
- Performance plateaued, not improving enough to justify continued training.
- mse: 19

## Multi-class Classification: `2binclassifier.py`
- We used a multi-class classification model where every comment is assigned to a time interval (bin).
- Faster training.
- Better accuracy.
- Less sensitivity to noise.
- Smaller dataset requirements.

## Results

|Model Type            | # bins  |Accuracy | Comments|
|----------------------|---------|--------|-----------|
|Linear Regression     |  None   |MSE = 19| Too slow + requires a lot of data|
|Multi-class classifier|   2     |~ 85%| Best in terms of accuracy and speed|
|Multi-class classifier|   3     |~ 60%| Needs more epochs for better accuracy|
|Multi-class classifier|   4     |~ 53%| Needs more data for better accuracy|



## Final Model: `redditwebsite/model-2bin`
- RoBERTa-base
- 2-bin classifier (2008-2010, 2020-2022)
- Epochs = 3
- Learning rate = 2e-5
- Accuracy: 85.3%
- Precision: 87.3%
- F1: 85.5$ 
