
import pandas as pd
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent
DATA_DIR = BASE_DIR / "data"

stocks = pd.read_csv(DATA_DIR / "market_history.csv")
nifty = pd.read_csv(DATA_DIR / "nifty50_history.csv")

stocks["Date"] = pd.to_datetime(stocks["Date"]).dt.normalize()
nifty["Date"] = pd.to_datetime(nifty["Date"]).dt.normalize()

# Calculate individual stock returns
stocks = stocks.sort_values(["Ticker", "Date"])
stocks["Stock_Return"] = (
   stocks.groupby("Ticker")["Adj Close"].pct_change()
)

stock_returns = stocks.pivot(
    index="Date",
    columns="Ticker",
    values="Stock_Return"
)

# Calculate Nifty returns on the complete Nifty trading calendar
nifty = nifty.sort_values("Date")
nifty["Nifty_Return"] = nifty["Close"].pct_change()

# Target is the next actual Nifty trading session
nifty["Target_Nifty_Return"] = nifty["Nifty_Return"].shift(-1)
nifty["Target_Date"] = nifty["Date"].shift(-1)

# Join stock returns with the correctly aligned Nifty targets
nifty_data = nifty.set_index("Date")[
    ["Nifty_Return", "Target_Nifty_Return", "Target_Date"]
]

dataset = stock_returns.join(nifty_data, how="inner")
dataset = dataset.dropna()

output_file = DATA_DIR / "nifty50_impact_dataset.csv"
dataset.to_csv(output_file, index_label="Date")

print("NIFTY 50 FEATURE ENGINEERING COMPLETED")
print(f"Total records: {len(dataset)}")
print(f"Date range: {dataset.index.min()} to {dataset.index.max()}")
print("\nDataset columns:")
print(dataset.columns.tolist())
print("\nFirst five records:")
print(dataset[["Nifty_Return", "Target_Nifty_Return", "Target_Date"]].head())
print(f"\nSaved to: {output_file}")
