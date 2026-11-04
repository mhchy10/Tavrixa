
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


export interface NiftyPrediction {
  prediction_status: string;
  input_date: string;
  target_date: string;
  actual_return: number;
  predicted_return: number;
  baseline_prediction: number;
  actual_return_percent: number;
  predicted_return_percent: number;
  note: string;
}

export interface NiftyStockRelationship {
  Ticker: string;
  Standardized_Coefficient: number;
  Train_Period_Correlation: number;
  Relationship: "Positive" | "Negative";
  Absolute_Coefficient: number;
}

export interface NiftyRelationshipsResponse {
  total_stocks: number;
  data: NiftyStockRelationship[];
}

export interface NiftyMetrics {
  model: string;
  input_features: string[];
  target: string;
  split: string;
  total_records: number;
  training_records: number;
  testing_records: number;
  training_start: string;
  training_end: string;
  testing_input_start: string;
  testing_target_end: string;
  model_metrics: {
    MAE: number;
    RMSE: number;
    R2: number;
  };
  baseline_metrics: {
    MAE: number;
    RMSE: number;
    R2: number;
  };
}


export interface NiftyBacktestRecord {
  Input_Date: string;
  Target_Date: string;
  Actual_Nifty_Return: number;
  Predicted_Nifty_Return: number;
  Baseline_Prediction: number;
}

export interface NiftyBacktestResponse {
  records: number;
  data: NiftyBacktestRecord[];
}


export interface NiftyDailyRecord {
  input_date: string;
  target_date: string | null;
  predicted_return: number;
  actual_return: number | null;
  prediction_error: number | null;
  model_version: string;
  status: "awaiting_actual" | "actual_recorded";
  created_at: string;
  updated_at: string;
}

export interface NiftyDailyResponse {
  latest: NiftyDailyRecord | null;
  history: NiftyDailyRecord[];
  total: number;
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



export const getNiftyPrediction = () =>
  apiRequest<NiftyPrediction>("/api/nifty50/predict");

export const getNiftyRelationships = () =>
  apiRequest<NiftyRelationshipsResponse>(
    "/api/nifty50/relationships"
  );

export const getNiftyMetrics = () =>
  apiRequest<NiftyMetrics>("/api/nifty50/metrics");

export const getNiftyBacktest = (limit = 100) =>
  apiRequest<NiftyBacktestResponse>(
    `/api/nifty50/backtest?limit=${limit}`
  );

  
export const getNiftyDailyPredictions = (limit = 30) =>
  apiRequest<NiftyDailyResponse>(
    `/api/nifty50/daily?limit=${limit}`
  );
