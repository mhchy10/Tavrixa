
import yfinance as yf
import pandas as pd
from pathlib import Path

# Project directories
BASE_DIR = Path(__file__).resolve().parent
DATA_DIR = BASE_DIR / "data"
DATA_DIR.mkdir(exist_ok=True)

# Selected Nifty 50 automobile stocks
stocks = {
    "M&M.NS": "Mahindra & Mahindra",
    "MARUTI.NS": "Maruti Suzuki",
    "BAJAJ-AUTO.NS": "Bajaj Auto",
    "EICHERMOT.NS": "Eicher Motors",
    "TVSMOTOR.NS": "TVS Motor",
    "MOTHERSON.NS": "Samvardhana Motherson",
    "HEROMOTOCO.NS": "Hero MotoCorp",
    "TMPV.NS": "Tata Motors Passenger Vehicles",
    "BHARATFORG.NS": "Bharat Forge",
    "ASHOKLEY.NS": "Ashok Leyland"
}

all_data = []

print("Starting historical stock data collection...\n")

for ticker, company in stocks.items():
    print(f"Downloading {company} ({ticker})...")

    try:
        df = yf.download(
            ticker,
            period="2y",
            interval="1d",
            auto_adjust=False,
            progress=False,
            threads=False
        )

        if df.empty:
            print(f"WARNING: No data received for {ticker}\n")
            continue

        # Handle Yahoo Finance MultiIndex columns
        if isinstance(df.columns, pd.MultiIndex):
            for level in range(df.columns.nlevels):
                values = df.columns.get_level_values(level)
                if "Open" in values:
                    df.columns = values
                    break

        df = df.reset_index()

        # Standardize date column
        date_column = "Date" if "Date" in df.columns else "Datetime"
        df = df.rename(columns={date_column: "Date"})

        # Add company information
        df["Ticker"] = ticker
        df["Company"] = company
        df["Sector"] = "Automobile"

        all_data.append(df)

        print(f"Downloaded {len(df)} records successfully.\n")

    except Exception as error:
        print(f"ERROR downloading {ticker}: {error}\n")

# Combine all stocks
if all_data:
    final_data = pd.concat(all_data, ignore_index=True)

    final_data["Date"] = pd.to_datetime(final_data["Date"])
    final_data = final_data.sort_values(
        ["Ticker", "Date"]
    ).reset_index(drop=True)

    # Remove duplicate stock-date records
    final_data = final_data.drop_duplicates(
        subset=["Ticker", "Date"]
    )

    # Save dataset
    output_file = DATA_DIR / "market_history.csv"
    final_data.to_csv(output_file, index=False)

    print("\nDATA COLLECTION COMPLETED")
    print(f"Total records: {len(final_data)}")
    print(f"Companies collected: {final_data['Ticker'].nunique()}")
    print(f"Saved to: {output_file}")

    print("\nRecords per company:")
    print(final_data.groupby("Company").size())

    print("\nMissing values:")
    print(final_data.isnull().sum())

else:
    print("No stock data was collected. Please check your internet connection.")
