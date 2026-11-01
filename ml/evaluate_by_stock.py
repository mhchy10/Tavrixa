
import pandas as pd
import numpy as np

from pathlib import Path
from sklearn.metrics import (
    mean_absolute_error,
    mean_squared_error,
    r2_score,
    accuracy_score,
    f1_score,
    roc_auc_score
)

BASE_DIR = Path(__file__).resolve().parent

DATA_FILE = BASE_DIR / "data" / "model_dataset.csv"
PREDICTION_FILE = BASE_DIR / "data" / "model_predictions.csv"

OUTPUT_FILE = BASE_DIR / "data" / "stockwise_evaluation.csv"

df = pd.read_csv(DATA_FILE)
pred = pd.read_csv(PREDICTION_FILE)

df["Date"] = pd.to_datetime(df["Date"])
pred["Date"] = pd.to_datetime(pred["Date"])

# Recreate the same chronological training split
unique_dates = sorted(df["Date"].unique())
split_date = unique_dates[int(len(unique_dates) * 0.80)]

train = df[df["Date"] < split_date]

results = []

for ticker in pred["Ticker"].unique():

    actual = pred[pred["Ticker"] == ticker].copy()
    training = train[train["Ticker"] == ticker]

    y_reg = actual["next_day_return"]
    pred_reg = actual["predicted_next_day_return"]

    y_cls = actual["next_day_direction"]
    pred_cls = actual["predicted_direction"]

    # Per-stock training baselines
    baseline_return = training["next_day_return"].mean()
    baseline_direction = int(
        training["next_day_direction"].mode().iloc[0]
    )

    baseline_reg = np.full(len(actual), baseline_return)
    baseline_cls = np.full(len(actual), baseline_direction)

    results.append({
        "Ticker": ticker,
        "Company": actual["Company"].iloc[0],
        "Test Records": len(actual),

        "MLR MAE": mean_absolute_error(y_reg, pred_reg),
        "MLR RMSE": np.sqrt(mean_squared_error(y_reg, pred_reg)),
        "MLR R2": r2_score(y_reg, pred_reg),

        "Regression Baseline MAE": mean_absolute_error(
            y_reg, baseline_reg
        ),

        "Logistic Accuracy": accuracy_score(y_cls, pred_cls),
        "Logistic F1": f1_score(y_cls, pred_cls, zero_division=0),

        "Classification Baseline Accuracy": accuracy_score(
            y_cls, baseline_cls
        ),

        "ROC AUC": (
            roc_auc_score(
                y_cls, actual["predicted_up_probability"]
            )
            if y_cls.nunique() == 2 else np.nan
        )
    })

result_df = pd.DataFrame(results)

result_df.to_csv(OUTPUT_FILE, index=False)

print("\nSTOCK-WISE MODEL EVALUATION")
print("---------------------------")
print(result_df.round(4).to_string(index=False))

print("\nSaved to:", OUTPUT_FILE)
