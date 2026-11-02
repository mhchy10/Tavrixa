
import json
import joblib
import numpy as np
import pandas as pd

from pathlib import Path
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import StandardScaler
from sklearn.linear_model import LinearRegression
from sklearn.dummy import DummyRegressor
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score

BASE_DIR = Path(__file__).resolve().parent
DATA_DIR = BASE_DIR / "data"
MODELS_DIR = BASE_DIR / "models"
MODELS_DIR.mkdir(exist_ok=True)

# Load the engineered dataset
dataset = pd.read_csv(
    DATA_DIR / "nifty50_impact_dataset.csv",
    index_col="Date",
    parse_dates=True
)

dataset["Target_Date"] = pd.to_datetime(dataset["Target_Date"])

# Only the ten automobile stocks are model inputs.
# Nifty_Return is deliberately excluded to avoid using the index's
# current-day return as an additional prediction input.
stock_columns = [
    "ASHOKLEY.NS",
    "BAJAJ-AUTO.NS",
    "BHARATFORG.NS",
    "EICHERMOT.NS",
    "HEROMOTOCO.NS",
    "M&M.NS",
    "MARUTI.NS",
    "MOTHERSON.NS",
    "TMPV.NS",
    "TVSMOTOR.NS"
]

X = dataset[stock_columns]
y = dataset["Target_Nifty_Return"]

# Chronological 80:20 split (no random shuffling)
split_index = int(len(dataset) * 0.80)

X_train = X.iloc[:split_index]
X_test = X.iloc[split_index:]

y_train = y.iloc[:split_index]
y_test = y.iloc[split_index:]

# Standardized multiple linear regression
model = Pipeline([
    ("scaler", StandardScaler()),
    ("regression", LinearRegression())
])

model.fit(X_train, y_train)
predictions = model.predict(X_test)

# Mean-return baseline for comparison
baseline = DummyRegressor(strategy="mean")
baseline.fit(X_train, y_train)
baseline_predictions = baseline.predict(X_test)

# Evaluation metrics
model_metrics = {
    "MAE": float(mean_absolute_error(y_test, predictions)),
    "RMSE": float(np.sqrt(mean_squared_error(y_test, predictions))),
    "R2": float(r2_score(y_test, predictions))
}

baseline_metrics = {
    "MAE": float(mean_absolute_error(y_test, baseline_predictions)),
    "RMSE": float(np.sqrt(mean_squared_error(y_test, baseline_predictions))),
    "R2": float(r2_score(y_test, baseline_predictions))
}

# Individual stock relationships, calculated on training data only
coefficients = model.named_steps["regression"].coef_
correlations = X_train.corrwith(y_train)

relationships = pd.DataFrame({
    "Ticker": stock_columns,
    "Standardized_Coefficient": coefficients,
    "Train_Period_Correlation": [
        correlations[ticker] for ticker in stock_columns
    ]
})

relationships["Relationship"] = np.where(
    relationships["Standardized_Coefficient"] >= 0,
    "Positive",
    "Negative"
)

relationships["Absolute_Coefficient"] = (
    relationships["Standardized_Coefficient"].abs()
)

relationships = relationships.sort_values(
    "Absolute_Coefficient",
    ascending=False
)

relationships.to_csv(
    DATA_DIR / "nifty50_stock_relationships.csv",
    index=False
)

# Save test predictions with both input and target dates
prediction_results = pd.DataFrame({
    "Input_Date": X_test.index,
    "Target_Date": dataset.loc[X_test.index, "Target_Date"].values,
    "Actual_Nifty_Return": y_test.values,
    "Predicted_Nifty_Return": predictions,
    "Baseline_Prediction": baseline_predictions
})

prediction_results.to_csv(
    DATA_DIR / "nifty50_predictions.csv",
    index=False
)

# Save the trained model
joblib.dump(
    model,
    MODELS_DIR / "nifty50_regression.joblib"
)

# Save evaluation information
results = {
    "model": "Multiple Linear Regression",
    "input_features": stock_columns,
    "target": "Next trading session Nifty 50 return",
    "split": "Chronological 80:20",
    "total_records": len(dataset),
    "training_records": len(X_train),
    "testing_records": len(X_test),
    "training_start": str(X_train.index.min().date()),
    "training_end": str(X_train.index.max().date()),
    "testing_input_start": str(X_test.index.min().date()),
    "testing_target_end": str(dataset.loc[X_test.index[-1], "Target_Date"].date()),
    "model_metrics": model_metrics,
    "baseline_metrics": baseline_metrics
}

with open(DATA_DIR / "nifty50_model_metrics.json", "w") as file:
    json.dump(results, file, indent=4)

# Display results
print("\nNIFTY 50 REGRESSION TRAINING COMPLETED")
print("=" * 45)

print(f"Total records: {len(dataset)}")
print(f"Training records: {len(X_train)}")
print(f"Testing records: {len(X_test)}")

print("\nMODEL PERFORMANCE")
for metric, value in model_metrics.items():
    print(f"{metric}: {value:.6f}")

print("\nBASELINE PERFORMANCE")
for metric, value in baseline_metrics.items():
    print(f"{metric}: {value:.6f}")

print("\nINDIVIDUAL STOCK RELATIONSHIPS")
print(relationships.to_string(index=False))

print("\nFILES SAVED:")
print("- ml/models/nifty50_regression.joblib")
print("- ml/data/nifty50_model_metrics.json")
print("- ml/data/nifty50_predictions.csv")
print("- ml/data/nifty50_stock_relationships.csv")
