
import joblib
import json
import numpy as np
import pandas as pd

from pathlib import Path
from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware

# ---------------------------------------
# PATHS AND CONFIGURATION
# ---------------------------------------

BASE_DIR = Path(__file__).resolve().parent
DATA_DIR = BASE_DIR / "data"
MODEL_DIR = BASE_DIR / "models"

DATA_FILE = DATA_DIR / "market_history.csv"
PREDICTIONS_FILE = DATA_DIR / "model_predictions.csv"
PERFORMANCE_FILE = DATA_DIR / "stockwise_evaluation.csv"

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

# ---------------------------------------
# LOAD TRAINED MODELS AND METRICS
# ---------------------------------------

mlr_model = joblib.load(
    MODEL_DIR / "multiple_linear_regression.joblib"
)

logistic_model = joblib.load(
    MODEL_DIR / "logistic_regression.joblib"
)

with open(MODEL_DIR / "model_metrics.json") as file:
    metrics = json.load(file)

# ---------------------------------------
# FASTAPI APPLICATION
# ---------------------------------------

app = FastAPI(
    title="Tavrixa Quant Engine API",
    description="Automotive stock analysis and experimental ML predictions",
    version="1.1"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["GET"],
    allow_headers=["*"]
)

# ---------------------------------------
# DATA LOADING HELPERS
# ---------------------------------------

def load_market_history():

    if not DATA_FILE.exists():
        raise HTTPException(
            status_code=500,
            detail="Market history dataset not found"
        )

    df = pd.read_csv(DATA_FILE)

    df["Date"] = pd.to_datetime(df["Date"])

    numeric_columns = [
        "Open", "High", "Low", "Close", "Adj Close", "Volume"
    ]

    for col in numeric_columns:
        df[col] = pd.to_numeric(df[col], errors="coerce")

    return df.sort_values(["Ticker", "Date"]).copy()


def clean_records(df):

    df = df.replace([np.inf, -np.inf], np.nan)

    result = df.astype(object).where(
        pd.notna(df),
        None
    )

    return result.to_dict(orient="records")


# ---------------------------------------
# CALCULATE HISTORICAL FEATURES
# ---------------------------------------

def calculate_historical_features(df):

    def calculate_features(group):

        group = group.sort_values("Date").copy()

        price = group["Adj Close"]
        daily_return = price.pct_change()

        group["daily_return"] = daily_return
        group["return_5d"] = price.pct_change(5)

        ma_5 = price.rolling(5).mean()
        ma_20 = price.rolling(20).mean()
        ma_50 = price.rolling(50).mean()

        group["ma_5_gap"] = price / ma_5 - 1
        group["ma_20_gap"] = price / ma_20 - 1
        group["ma_50_gap"] = price / ma_50 - 1

        group["volatility_5d"] = daily_return.rolling(5).std()
        group["volatility_20d"] = daily_return.rolling(20).std()

        group["volume_change"] = group["Volume"].pct_change()

        group["intraday_range"] = (
            group["High"] - group["Low"]
        ) / group["Close"]

        return group

    featured = pd.concat(
        [
            calculate_features(group)
            for _, group in df.groupby("Ticker", sort=False)
        ],
        ignore_index=True
    )

    basket = (
        featured.groupby("Date")["daily_return"]
        .mean()
        .rename("basket_return")
    )

    featured = featured.merge(
        basket,
        on="Date",
        how="left"
    )

    featured.replace([np.inf, -np.inf], np.nan, inplace=True)

    return featured


def get_latest_features():

    df = load_market_history()

    featured = calculate_historical_features(df)

    featured = featured.dropna(subset=FEATURES)

    latest = (
        featured.sort_values("Date")
        .groupby("Ticker")
        .tail(1)
        .copy()
    )

    return latest


# ---------------------------------------
# BASIC API ROUTES
# ---------------------------------------

@app.get("/")
def home():

    return {
        "message": "Tavrixa Quant Engine API",
        "status": "running"
    }


@app.get("/api/health")
def health():

    return {"status": "healthy"}


@app.get("/api/stocks")
def stocks():

    df = load_market_history()

    companies = (
        df[["Ticker", "Company"]]
        .drop_duplicates()
        .sort_values("Company")
    )

    return clean_records(companies)


# ---------------------------------------
# MODEL METRICS
# ---------------------------------------

@app.get("/api/metrics")
def get_metrics():

    return metrics


# ---------------------------------------
# HISTORICAL STOCK DATA + MOVING AVERAGES
# ---------------------------------------

@app.get("/api/history/{ticker}")
def get_stock_history(
    ticker: str,
    limit: int = Query(default=250, ge=50, le=2000)
):

    df = load_market_history()

    stock = df[
        df["Ticker"].str.upper() == ticker.upper()
    ].copy()

    if stock.empty:
        raise HTTPException(
            status_code=404,
            detail="Stock not found"
        )

    stock = stock.sort_values("Date").copy()

    price = stock["Adj Close"]

    stock["SMA_5"] = price.rolling(5).mean()
    stock["SMA_20"] = price.rolling(20).mean()
    stock["SMA_50"] = price.rolling(50).mean()

    stock["Date"] = stock["Date"].dt.strftime("%Y-%m-%d")

    columns = [
        "Date",
        "Open",
        "High",
        "Low",
        "Close",
        "Adj Close",
        "Volume",
        "SMA_5",
        "SMA_20",
        "SMA_50"
    ]

    result = stock[columns].tail(limit)

    return {
        "ticker": ticker.upper(),
        "company": stock["Company"].iloc[-1],
        "records": len(result),
        "data_as_of": stock["Date"].iloc[-1],
        "history": clean_records(result)
    }


# ---------------------------------------
# ACTUAL VS PREDICTED TEST RESULTS
# ---------------------------------------

@app.get("/api/backtest")
def get_backtest(
    ticker: str | None = None,
    limit: int = Query(default=500, ge=1, le=2000)
):

    if not PREDICTIONS_FILE.exists():
        raise HTTPException(
            status_code=500,
            detail="Model predictions dataset not found"
        )

    df = pd.read_csv(PREDICTIONS_FILE)

    if ticker:
        df = df[
            df["Ticker"].str.upper() == ticker.upper()
        ]

        if df.empty:
            raise HTTPException(
                status_code=404,
                detail="No backtest data found for this stock"
            )

    df["Date"] = pd.to_datetime(df["Date"])
    df = df.sort_values(["Date", "Ticker"]).tail(limit).copy()

    return {
        "records": len(df),
        "ticker": ticker.upper() if ticker else "ALL",
        "data": clean_records(df)
    }


# ---------------------------------------
# COMPANY-WISE MODEL PERFORMANCE
# ---------------------------------------

@app.get("/api/company-performance")
def get_company_performance():

    if not PERFORMANCE_FILE.exists():
        raise HTTPException(
            status_code=500,
            detail="Company performance dataset not found"
        )

    df = pd.read_csv(PERFORMANCE_FILE)

    df.columns = df.columns.str.strip()

    return {
        "companies": len(df),
        "data": clean_records(df)
    }


# ---------------------------------------
# INDIVIDUAL STOCK PREDICTION
# ---------------------------------------

@app.get("/api/predict/{ticker}")
def predict(ticker: str):

    latest = get_latest_features()

    stock = latest[
        latest["Ticker"].str.upper() == ticker.upper()
    ]

    if stock.empty:
        raise HTTPException(
            status_code=404,
            detail="Stock not found or insufficient historical data"
        )

    row = stock.iloc[-1]

    X = pd.DataFrame(
        [row[FEATURES].to_dict()],
        columns=FEATURES
    )

    predicted_return = float(mlr_model.predict(X)[0])

    probabilities = logistic_model.predict_proba(X)[0]

    up_probability = float(probabilities[1])

    direction = (
        "UP"
        if logistic_model.predict(X)[0] == 1
        else "DOWN"
    )

    return {
        "ticker": row["Ticker"],
        "company": row["Company"],
        "data_as_of": str(row["Date"].date()),
        "predicted_next_day_return": predicted_return,
        "predicted_return_percent": predicted_return * 100,
        "predicted_direction": direction,
        "up_probability": up_probability,
        "down_probability": float(probabilities[0]),
        "note": "Experimental model estimates based on historical data. Not investment advice."
    }
