from datetime import datetime, time
from zoneinfo import ZoneInfo


import os
import joblib
import yfinance as yf
import pandas as pd

from pathlib import Path
from supabase import create_client

# ---------------------------------------
# CONFIGURATION
# ---------------------------------------

BASE_DIR = Path(__file__).resolve().parent
MODEL_FILE = BASE_DIR / "models" / "nifty50_regression.joblib"

TABLE = "nifty50_daily_predictions"
MODEL_VERSION = "nifty50_mlr_v1"

STOCK_COLUMNS = [
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

# ---------------------------------------
# SUPABASE CONNECTION
# ---------------------------------------

def get_supabase():

    url = os.getenv("SUPABASE_URL")
    key = os.getenv("SUPABASE_SERVICE_ROLE_KEY")

    if not url or not key:
        raise RuntimeError(
            "Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY"
        )

    return create_client(url, key)


# ---------------------------------------
# MARKET DATA HELPERS
# ---------------------------------------

def get_price_series(ticker, period="1mo", column="Adj Close"):

    df = yf.download(
        ticker,
        period=period,
        interval="1d",
        auto_adjust=False,
        progress=False,
        threads=False
    )

    if df.empty:
        raise RuntimeError(f"No market data received for {ticker}")

    if isinstance(df.columns, pd.MultiIndex):

        matching = [
            col for col in df.columns
            if column in col
        ]

        if not matching:
            raise RuntimeError(
                f"{column} unavailable for {ticker}"
            )

        prices = df[matching[0]]

    else:

        if column not in df.columns:
            raise RuntimeError(
                f"{column} unavailable for {ticker}"
            )

        prices = df[column]

    dates = pd.DatetimeIndex(pd.to_datetime(prices.index))

    if dates.tz is not None:
        dates = dates.tz_localize(None)

    prices.index = dates.normalize()

    return prices.dropna().sort_index()


# ---------------------------------------
# COLLECT LATEST AUTOMOBILE STOCK RETURNS
# ---------------------------------------
def get_latest_stock_returns():
    returns = {}

    for ticker in STOCK_COLUMNS:
        prices = get_price_series(ticker)
        returns[ticker] = prices.pct_change().dropna()

    dataset = pd.DataFrame(returns).dropna()

    if dataset.empty:
        raise RuntimeError("No common trading date found across all 10 stocks")

    input_date = dataset.index[-1]

    # Confirm Nifty 50 has data for the same completed session.
    nifty_prices = get_price_series("^NSEI", period="1mo", column="Close")
    nifty_date = nifty_prices.index[-1]

    if input_date != nifty_date:
        raise RuntimeError(
            f"Stock and Nifty dates do not match: {input_date.date()} vs {nifty_date.date()}"
        )

    latest = dataset.loc[[input_date], STOCK_COLUMNS]
    return input_date, latest


# ---------------------------------------
# GENERATE AND SAVE DAILY PREDICTION
# ---------------------------------------

def generate_daily_prediction(supabase):

    input_date, features = get_latest_stock_returns()

    date_string = input_date.strftime("%Y-%m-%d")

    # Prevent duplicate daily predictions
    existing = (
        supabase.table(TABLE)
        .select("input_date")
        .eq("input_date", date_string)
        .execute()
    )

    if existing.data:
        print(f"Prediction already exists for {date_string}")
        return

    model = joblib.load(MODEL_FILE)

    predicted_return = float(model.predict(features)[0])

    record = {
        "input_date": date_string,
        "predicted_return": predicted_return,
        "model_version": MODEL_VERSION,
        "status": "awaiting_actual"
    }

    supabase.table(TABLE).insert(record).execute()

    print("\nDAILY NIFTY PREDICTION SAVED")
    print(f"Input date: {date_string}")
    print(f"Predicted return: {predicted_return:.6f}")
    print(f"Predicted return (%): {predicted_return * 100:.4f}%")


# ---------------------------------------
# RECORD ACTUAL NIFTY RETURNS
# ---------------------------------------

def update_actual_returns(supabase):

    pending = (
        supabase.table(TABLE)
        .select("*")
        .eq("status", "awaiting_actual")
        .execute()
    ).data

    if not pending:
        print("No pending predictions to reconcile.")
        return

    nifty_prices = get_price_series(
        "^NSEI",
        period="1y",
        column="Close"
    )

    nifty_returns = nifty_prices.pct_change().dropna()

    updated = 0

    for record in pending:

        input_date = pd.Timestamp(record["input_date"])

        # Find the first actual Nifty session after input_date
        future_sessions = nifty_returns[
            nifty_returns.index > input_date
        ]

        if future_sessions.empty:
            continue

        target_date = future_sessions.index[0]

        actual_return = float(
            future_sessions.loc[target_date]
        )

        predicted_return = float(
            record["predicted_return"]
        )

        prediction_error = (
            actual_return - predicted_return
        )

        supabase.table(TABLE).update({
            "target_date": target_date.strftime("%Y-%m-%d"),
            "actual_return": actual_return,
            "prediction_error": prediction_error,
            "status": "actual_recorded"
        }).eq(
            "input_date",
            record["input_date"]
        ).eq(
            "status",
            "awaiting_actual"
        ).execute()

        updated += 1

        print(
            f"Reconciled {record['input_date']} -> "
            f"{target_date.date()}"
        )

    print(f"\nActual results recorded: {updated}")


# ---------------------------------------
# MAIN DAILY WORKFLOW
# ---------------------------------------

def run_daily_update():

    print("\nTAVRIXA NIFTY 50 DAILY UPDATE")
    print("=" * 40)


    india_now = datetime.now(ZoneInfo("Asia/Kolkata"))

    if india_now.time() < time(15, 45):
        raise RuntimeError(
            "Market may still be open. Run the daily update after 3:45 PM IST."
        )

    supabase = get_supabase()

    # First reconcile previous predictions
    update_actual_returns(supabase)

    # Then generate the latest prediction
    generate_daily_prediction(supabase)

    print("\nDaily update completed.")


if __name__ == "__main__":
    run_daily_update()
