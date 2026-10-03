# Wine Quality Predictor

A machine-learning web app that predicts how a wine would be rated from 11 physicochemical measurements such as acidity, sugar and alcohol.

**Live demo:** https://wine-quality-prediction-project-01.onrender.com

> The demo runs on a free hosting plan, so it sleeps after about 15 minutes without visitors. The first visit can take up to a minute to wake it up.

## Features

- Prediction page with 11 sliders and a result card (Poor, Average, Good, Excellent)
- Data Insights page: quality distribution and how each property correlates with quality
- Visualizations page: average alcohol, volatile acidity and sulphates by quality, plus feature importance
- Dataset page: preview of the cleaned data and a summary of each property
- About page and a light/dark theme toggle

## How it works

1. **Clean:** the Id column is dropped, duplicate rows are removed (1143 rows become 1018) and extreme values are capped using the IQR method.
2. **Split:** the data is divided 80% for training and 20% for testing.
3. **Train:** a Random Forest classifier with 300 trees learns from the training data.
4. **Predict:** the 11 values from the sliders go to the Flask backend, and the model returns a quality score.

## Model performance

Measured on the 20% of wines held out from training:

| Metric | Result |
|---|---|
| Exact score correct | about 48% |
| Within 1 point of the true score | about 91% |

Wine quality is hard to predict from chemistry alone. Scores 5 and 6 make up most of the dataset and look alike chemically, so the model is better at separating roughly good wines from roughly average ones than at predicting the exact score. A prediction is an estimate from measurements, not a tasting.

## Tech stack

- Python, Flask, Gunicorn
- scikit-learn, pandas, NumPy, joblib
- HTML, CSS and JavaScript (no external frameworks)
- Deployed on Render

## Project structure

```
app.py            Flask app: loads the model and serves the page
preprocess.py     Cleans the raw data and writes data/wine_clean.csv
train.py          Trains the Random Forest and saves models/wine_model.pkl
requirements.txt  Python dependencies
data/             WineQT.csv (raw) and wine_clean.csv (cleaned)
models/           Saved model files
templates/        index.html
static/           CSS and JavaScript
```

## Run it locally

1. Install Python 3 and download this repository (Code, then Download ZIP, or use `git clone`).
2. Open a terminal in the project folder and create a virtual environment:

   ```
   python -m venv venv
   venv\Scripts\activate
   ```

   On macOS or Linux, use `source venv/bin/activate` for the second line.

3. Install the dependencies:

   ```
   pip install -r requirements.txt
   ```

4. Start the app:

   ```
   python app.py
   ```

5. Open http://127.0.0.1:5000 in your browser.

To retrain the model, run `python preprocess.py` and then `python train.py`.

## Dataset

The Wine Quality (WineQT) dataset: physicochemical tests of wines, each with a quality score given by tasters.
