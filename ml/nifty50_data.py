
import yfinance as yf
import pandas as pd
from pathlib import Path

# Project directories
BASE_DIR = Path(__file__).resolve().parent
DATA_DIR = BASE_DIR / "data"
DATA_DIR.mkdir(exist_ok=True)

print("Downloading Nifty 50 historical data...\n")

try:
    df = yf.download(
        "^NSEI",
        period="2y",
        interval="1d",
        auto_adjust=False,
        progress=False,
        threads=False
    )

    if df.empty:
        raise ValueError("No Nifty 50 data received.")

    # Handle Yahoo Finance MultiIndex columns
    if isinstance(df.columns, pd.MultiIndex):
        for level in range(df.columns.nlevels):
            values = df.columns.get_level_values(level)
            if "Close" in values:
                df.columns = values
                break

    df = df.reset_index()

    # Standardize date column
    date_column = "Date" if "Date" in df.columns else "Datetime"
    df = df.rename(columns={date_column: "Date"})

    # Remove timezone information if present
    df["Date"] = pd.to_datetime(df["Date"])
    if df["Date"].dt.tz is not None:
        df["Date"] = df["Date"].dt.tz_localize(None)

    # Keep available market columns
    market_columns = [
        "Date", "Open", "High", "Low",
        "Close", "Adj Close", "Volume"
    ]

    available_columns = [
        col for col in market_columns if col in df.columns
    ]

    df = df[available_columns]
    df = df.drop_duplicates(subset=["Date"])
    df = df.sort_values("Date").reset_index(drop=True)

    # Save dataset
    output_file = DATA_DIR / "nifty50_history.csv"
    df.to_csv(output_file, index=False)

    print("NIFTY 50 DATA COLLECTION COMPLETED")
    print(f"Total records: {len(df)}")
    print(f"Date range: {df['Date'].min()} to {df['Date'].max()}")
    print(f"Available columns: {list(df.columns)}")
    print(f"Saved to: {output_file}")

    print("\nFirst five records:")
    print(df.head())

    print("\nMissing values:")
    print(df.isnull().sum())

except Exception as error:
    print(f"ERROR: {error}")
