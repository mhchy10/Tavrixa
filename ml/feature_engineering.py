
import pandas as pd
from pathlib import Path

# File locations
BASE_DIR = Path(__file__).resolve().parent
DATA_DIR = BASE_DIR / "data"

INPUT_FILE = DATA_DIR / "market_history.csv"
OUTPUT_FILE = DATA_DIR / "model_dataset.csv"

# Load historical data
df = pd.read_csv(INPUT_FILE)
df["Date"] = pd.to_datetime(df["Date"])

df = df.sort_values(["Ticker", "Date"]).copy()

# Ensure numerical columns
numeric_columns = [
    "Open", "High", "Low", "Close", "Adj Close", "Volume"
]

for col in numeric_columns:
    df[col] = pd.to_numeric(df[col], errors="coerce")

# Calculate features separately for each stock
def create_features(group):

    group = group.sort_values("Date").copy()

    price = group["Adj Close"]
    daily_return = price.pct_change()

    # Returns
    group["daily_return"] = daily_return
    group["return_5d"] = price.pct_change(5)

    # Daily moving averages
    ma_5 = price.rolling(5).mean()
    ma_20 = price.rolling(20).mean()
    ma_50 = price.rolling(50).mean()

    # Relative distance from moving averages
    group["ma_5_gap"] = price / ma_5 - 1
    group["ma_20_gap"] = price / ma_20 - 1
    group["ma_50_gap"] = price / ma_50 - 1

    # Volatility
    group["volatility_5d"] = daily_return.rolling(5).std()
    group["volatility_20d"] = daily_return.rolling(20).std()

    # Trading activity and price range
    group["volume_change"] = group["Volume"].pct_change()
    group["intraday_range"] = (
        group["High"] - group["Low"]
    ) / group["Close"]

    # Next trading day's prediction targets
    group["next_day_return"] = daily_return.shift(-1)

    group["next_day_direction"] = (
        group["next_day_return"] > 0
    ).astype(int)

    return group


# Apply feature calculations to all stocks
featured = pd.concat(
    [create_features(group) for _, group in df.groupby("Ticker", sort=False)],
    ignore_index=True
)

# Calculate equalweighted return of our selected stock basket
# This is a sector proxy, not the official Nifty Auto index.
basket_return = (
    featured.groupby("Date")["daily_return"]
    .mean()
    .rename("basket_return")
)

featured = featured.merge(
    basket_return,
    on="Date",
    how="left"
)

# Remove rows without sufficient historical data or a target
featured = featured.replace([float("inf"), float("-inf")], pd.NA)

featured = featured.dropna().reset_index(drop=True)

# Save ml-ready dataset
featured.to_csv(OUTPUT_FILE, index=False)

# Summary
print("FEATURE ENGINEERING COMPLETED")
print("--------------------------------")
print("Total usable records:", len(featured))
print("Companies:", featured["Ticker"].nunique())
print("Saved to:", OUTPUT_FILE)

print("\nRecords per company:")
print(featured.groupby("Company").size())

print("\nFeatures created:")
print([
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
])

print("\nUP/DOWN target distribution:")
print(featured["next_day_direction"].value_counts())

print("\nRemaining missing values:")
print(featured.isnull().sum().sum())
