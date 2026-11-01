
const API_BASE_URL = "https://tavrixa-quant-engine.onrender.com";
// ---------------------------------------
// TYPES
// ---------------------------------------

export interface StockPrediction {
  ticker: string;
  company: string;
  data_as_of: string;
  predicted_next_day_return: number;
  predicted_return_percent: number;
  predicted_direction: "UP" | "DOWN";
  up_probability: number;
  down_probability: number;
  note: string;
}

export interface StockInfo {
  Ticker: string;
  Company: string;
}

export interface HistoricalRecord {
  Date: string;
  Open: number;
  High: number;
  Low: number;
  Close: number;
  "Adj Close": number;
  Volume: number;
  SMA_5: number | null;
  SMA_20: number | null;
  SMA_50: number | null;
}

export interface StockHistory {
  ticker: string;
  company: string;
  records: number;
  data_as_of: string;
  history: HistoricalRecord[];
}

export interface BacktestRecord {
  Date: string;
  Ticker: string;
  Company: string;
  next_day_return: number;
  next_day_direction: number;
  predicted_next_day_return: number;
  predicted_direction: number;
  predicted_up_probability: number;
}

export interface BacktestResponse {
  records: number;
  ticker: string;
  data: BacktestRecord[];
}

export interface CompanyPerformance {
  Ticker: string;
  Company: string;
  "Test Records": number;
  "MLR MAE": number;
  "MLR RMSE": number;
  "MLR R2": number;
  "Regression Baseline MAE": number;
  "Logistic Accuracy": number;
  "Logistic F1": number;
  "Classification Baseline Accuracy": number;
  "ROC AUC": number;
}

export interface CompanyPerformanceResponse {
  companies: number;
  data: CompanyPerformance[];
}

export interface ModelMetrics {
  companies: number;
  total_records: number;
  training_records: number;
  testing_records: number;
  test_start_date: string;
  features: string[];
  multiple_linear_regression: {
    model: {
      MAE: number;
      MSE: number;
      RMSE: number;
      R2: number;
    };
    baseline: {
      MAE: number;
      RMSE: number;
      R2: number;
    };
  };
  logistic_regression: {
    model: {
      Accuracy: number;
      Precision: number;
      Recall: number;
      F1: number;
      "Confusion Matrix": number[][];
      ROC_AUC: number;
    };
    baseline: {
      Accuracy: number;
    };
  };
}

// ---------------------------------------
// API REQUEST HELPER
// ---------------------------------------

async function apiRequest<T>(endpoint: string): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${endpoint}`);

  if (!response.ok) {
    throw new Error(`API error: ${response.status}`);
  }

  return response.json();
}

// ---------------------------------------
// API FUNCTIONS
// ---------------------------------------

export const getMLHealth = () =>
  apiRequest<{ status: string }>("/api/health");

export const getMLStocks = () =>
  apiRequest<StockInfo[]>("/api/stocks");

export const getMLMetrics = () =>
  apiRequest<ModelMetrics>("/api/metrics");

export const getMLPrediction = (ticker: string) =>
  apiRequest<StockPrediction>(
    `/api/predict/${encodeURIComponent(ticker)}`
  );

export const getMLHistory = (ticker: string, limit = 250) =>
  apiRequest<StockHistory>(
    `/api/history/${encodeURIComponent(ticker)}?limit=${limit}`
  );

export const getMLBacktest = (ticker?: string, limit = 500) => {
  const params = new URLSearchParams({ limit: String(limit) });

  if (ticker) {
    params.set("ticker", ticker);
  }

  return apiRequest<BacktestResponse>(
    `/api/backtest?${params.toString()}`
  );
};

export const getMLCompanyPerformance = () =>
  apiRequest<CompanyPerformanceResponse>(
    "/api/company-performance"
  );
