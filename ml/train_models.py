
import json
import joblib
import numpy as np
import pandas as pd

from pathlib import Path
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import StandardScaler
from sklearn.linear_model import LinearRegression, LogisticRegression
from sklearn.dummy import DummyRegressor, DummyClassifier
from sklearn.metrics import (
    mean_absolute_error,
    mean_squared_error,
    r2_score,
    accuracy_score,
    precision_score,
    recall_score,
    f1_score,
    confusion_matrix,
    roc_auc_score
)

# --------------------------------------------------
# 1. PATHS AND DATA
# --------------------------------------------------

BASE_DIR = Path(__file__).resolve().parent
DATA_FILE = BASE_DIR / "data" / "model_dataset.csv"
MODEL_DIR = BASE_DIR / "models"

MODEL_DIR.mkdir(exist_ok=True)

df = pd.read_csv(DATA_FILE)
df["Date"] = pd.to_datetime(df["Date"])
df = df.sort_values("Date").reset_index(drop=True)

FEATURES = [
    "daily_return",
    "return_5d",
    "ma_5_gap",
    "ma_20_gap",
    "ma_50_gap",
    "volatility_5d",
    "volatility_20d",
    "volume_change",
    "intraday_range",
    "basket_return"
]

REGRESSION_TARGET = "next_day_return"
CLASSIFICATION_TARGET = "next_day_direction"

# --------------------------------------------------
# 2. CHRONOLOGICAL TRAIN / TEST SPLIT
# --------------------------------------------------

# Split by dates, not randomly.
# This prevents future dates from entering training.

unique_dates = sorted(df["Date"].unique())

split_index = int(len(unique_dates) * 0.80)
split_date = unique_dates[split_index]

train = df[df["Date"] < split_date].copy()
test = df[df["Date"] >= split_date].copy()

X_train = train[FEATURES]
X_test = test[FEATURES]

y_train_reg = train[REGRESSION_TARGET]
y_test_reg = test[REGRESSION_TARGET]

y_train_cls = train[CLASSIFICATION_TARGET]
y_test_cls = test[CLASSIFICATION_TARGET]

print("TRAIN / TEST SPLIT")
print("------------------")
print("Training records:", len(train))
print("Testing records:", len(test))
print("Test begins:", pd.Timestamp(split_date).date())

# --------------------------------------------------
# 3. MULTIPLE LINEAR REGRESSION
# --------------------------------------------------

mlr_model = Pipeline([
    ("scaler", StandardScaler()),
    ("model", LinearRegression())
])

mlr_model.fit(X_train, y_train_reg)

mlr_predictions = mlr_model.predict(X_test)

mlr_metrics = {
    "MAE": float(mean_absolute_error(y_test_reg, mlr_predictions)),
    "MSE": float(mean_squared_error(y_test_reg, mlr_predictions)),
    "RMSE": float(np.sqrt(mean_squared_error(y_test_reg, mlr_predictions))),
    "R2": float(r2_score(y_test_reg, mlr_predictions))
}

# Regression baseline: always predicts training mean.
reg_baseline = DummyRegressor(strategy="mean")
reg_baseline.fit(X_train, y_train_reg)

baseline_reg_predictions = reg_baseline.predict(X_test)

reg_baseline_metrics = {
    "MAE": float(mean_absolute_error(y_test_reg, baseline_reg_predictions)),
    "RMSE": float(np.sqrt(mean_squared_error(y_test_reg, baseline_reg_predictions))),
    "R2": float(r2_score(y_test_reg, baseline_reg_predictions))
}

joblib.dump(mlr_model, MODEL_DIR / "multiple_linear_regression.joblib")

# --------------------------------------------------
# 4. LOGISTIC REGRESSION
# --------------------------------------------------

logistic_model = Pipeline([
    ("scaler", StandardScaler()),
    ("model", LogisticRegression(max_iter=2000))
])

logistic_model.fit(X_train, y_train_cls)

cls_predictions = logistic_model.predict(X_test)
cls_probabilities = logistic_model.predict_proba(X_test)[:, 1]

logistic_metrics = {
    "Accuracy": float(accuracy_score(y_test_cls, cls_predictions)),
    "Precision": float(precision_score(y_test_cls, cls_predictions, zero_division=0)),
    "Recall": float(recall_score(y_test_cls, cls_predictions, zero_division=0)),
    "F1": float(f1_score(y_test_cls, cls_predictions, zero_division=0)),
    "Confusion Matrix": confusion_matrix(
        y_test_cls, cls_predictions
    ).tolist()
}

if y_test_cls.nunique() == 2:
    logistic_metrics["ROC_AUC"] = float(
        roc_auc_score(y_test_cls, cls_probabilities)
    )

# Classification baseline: always predicts majority class.
cls_baseline = DummyClassifier(strategy="most_frequent")
cls_baseline.fit(X_train, y_train_cls)

baseline_cls_predictions = cls_baseline.predict(X_test)

cls_baseline_metrics = {
    "Accuracy": float(accuracy_score(y_test_cls, baseline_cls_predictions))
}

joblib.dump(logistic_model, MODEL_DIR / "logistic_regression.joblib")

# --------------------------------------------------
# 5. SAVE TEST PREDICTIONS
# --------------------------------------------------

predictions = test[
    ["Date", "Ticker", "Company", REGRESSION_TARGET, CLASSIFICATION_TARGET]
].copy()

predictions["predicted_next_day_return"] = mlr_predictions
predictions["predicted_direction"] = cls_predictions
predictions["predicted_up_probability"] = cls_probabilities

predictions.to_csv(
    BASE_DIR / "data" / "model_predictions.csv",
    index=False
)

# --------------------------------------------------
# 6. SAVE EVALUATION METRICS
# --------------------------------------------------

results = {
    "companies": int(df["Ticker"].nunique()),
    "total_records": int(len(df)),
    "training_records": int(len(train)),
    "testing_records": int(len(test)),
    "test_start_date": str(pd.Timestamp(split_date).date()),
    "features": FEATURES,
    "multiple_linear_regression": {
        "model": mlr_metrics,
        "baseline": reg_baseline_metrics
    },
    "logistic_regression": {
        "model": logistic_metrics,
        "baseline": cls_baseline_metrics
    }
}

with open(MODEL_DIR / "model_metrics.json", "w") as file:
    json.dump(results, file, indent=4)

# --------------------------------------------------
# 7. DISPLAY RESULTS
# --------------------------------------------------

print("\nMULTIPLE LINEAR REGRESSION")
print("--------------------------")
for key, value in mlr_metrics.items():
    print(f"{key}: {value:.6f}")

print("\nREGRESSION BASELINE")
for key, value in reg_baseline_metrics.items():
    print(f"{key}: {value:.6f}")

print("\nLOGISTIC REGRESSION")
print("-------------------")
for key, value in logistic_metrics.items():
    print(f"{key}: {value}")

print("\nCLASSIFICATION BASELINE")
print(cls_baseline_metrics)

print("\nTRAINING COMPLETED")
print("------------------")
print("Models saved in:", MODEL_DIR)
print("Predictions saved in:", BASE_DIR / "data" / "model_predictions.csv")
print("Metrics saved in:", MODEL_DIR / "model_metrics.json")
