
import pandas as pd
import matplotlib.pyplot as plt
from pathlib import Path
from sklearn.metrics import ConfusionMatrixDisplay, confusion_matrix

BASE_DIR = Path(__file__).resolve().parent
DATA_DIR = BASE_DIR / "data"
OUTPUT_DIR = BASE_DIR / "visualizations"

OUTPUT_DIR.mkdir(exist_ok=True)

pred = pd.read_csv(DATA_DIR / "model_predictions.csv")
stockwise = pd.read_csv(DATA_DIR / "stockwise_evaluation.csv")

# -----------------------------------
# 1. ACTUAL VS PREDICTED RETURNS
# -----------------------------------

plt.figure(figsize=(9, 6))

plt.scatter(
    pred["next_day_return"] * 100,
    pred["predicted_next_day_return"] * 100,
    alpha=0.35
)

plt.axline((0, 0), slope=1, linestyle="--")

plt.xlabel("Actual Next-Day Return (%)")
plt.ylabel("Predicted Next-Day Return (%)")
plt.title("Multiple Linear Regression: Actual vs Predicted Returns")
plt.grid(alpha=0.25)
plt.tight_layout()

plt.savefig(
    OUTPUT_DIR / "actual_vs_predicted_returns.png",
    dpi=200
)
plt.close()

# -----------------------------------
# 2. LOGISTIC REGRESSION CONFUSION MATRIX
# -----------------------------------

cm = confusion_matrix(
    pred["next_day_direction"],
    pred["predicted_direction"],
    labels=[0, 1]
)

display = ConfusionMatrixDisplay(
    confusion_matrix=cm,
    display_labels=["DOWN", "UP"]
)

display.plot()
plt.title("Logistic Regression Confusion Matrix")
plt.tight_layout()

plt.savefig(
    OUTPUT_DIR / "confusion_matrix.png",
    dpi=200
)
plt.close()

# -----------------------------------
# 3. COMPANY-WISE ACCURACY COMPARISON
# -----------------------------------

stockwise = stockwise.sort_values("Logistic Accuracy")

x = range(len(stockwise))
width = 0.38

plt.figure(figsize=(12, 6))

plt.bar(
    [i - width / 2 for i in x],
    stockwise["Logistic Accuracy"] * 100,
    width,
    label="Logistic Regression"
)

plt.bar(
    [i + width / 2 for i in x],
    stockwise["Classification Baseline Accuracy"] * 100,
    width,
    label="Baseline"
)

plt.xticks(
    list(x),
    stockwise["Company"],
    rotation=40,
    ha="right"
)

plt.ylabel("Accuracy (%)")
plt.title("Company-Wise Classification Accuracy vs Baseline")
plt.legend()
plt.grid(axis="y", alpha=0.25)
plt.tight_layout()

plt.savefig(
    OUTPUT_DIR / "company_wise_accuracy.png",
    dpi=200
)
plt.close()

print("VISUALIZATIONS GENERATED")
print("------------------------")
print("1. actual_vs_predicted_returns.png")
print("2. confusion_matrix.png")
print("3. company_wise_accuracy.png")
print("\nSaved in:", OUTPUT_DIR)
