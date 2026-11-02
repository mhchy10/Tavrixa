
import { useEffect, useRef, useState } from "react";
import {
  CandlestickSeries,
  ColorType,
  createChart,
  HistogramSeries,
  LineSeries,
  type UTCTimestamp,
} from "lightweight-charts";

import {
  getMLPrediction,
  getMLHistory,
  getMLBacktest,
  getMLMetrics,
  getMLCompanyPerformance,
  type StockPrediction,
  type StockHistory,
  type BacktestResponse,
  type ModelMetrics,
  type CompanyPerformanceResponse,

  getNiftyPrediction,
  getNiftyRelationships,
  getNiftyMetrics,
  getNiftyBacktest,
  type NiftyPrediction,
  type NiftyRelationshipsResponse,
  type NiftyMetrics,
  type NiftyBacktestResponse,
} from "./lib/mlApi";


// ---------------------------------------
// STOCKS
// ---------------------------------------

const stocks = [
  { ticker: "M&M.NS", name: "Mahindra & Mahindra" },
  { ticker: "MARUTI.NS", name: "Maruti Suzuki" },
  { ticker: "BAJAJ-AUTO.NS", name: "Bajaj Auto" },
  { ticker: "EICHERMOT.NS", name: "Eicher Motors" },
  { ticker: "TVSMOTOR.NS", name: "TVS Motor" },
  { ticker: "MOTHERSON.NS", name: "Samvardhana Motherson" },
  { ticker: "HEROMOTOCO.NS", name: "Hero MotoCorp" },
  { ticker: "TMPV.NS", name: "Tata Motors Passenger Vehicles" },
  { ticker: "BHARATFORG.NS", name: "Bharat Forge" },
  { ticker: "ASHOKLEY.NS", name: "Ashok Leyland" },
];

// ---------------------------------------
// HELPERS
// ---------------------------------------

const percent = (value: number) => `${(value * 100).toFixed(2)}%`;

const decimal = (value: number) => value.toFixed(4);

const chartTime = (date: string) =>
  Math.floor(new Date(date).getTime() / 1000) as UTCTimestamp;


const SMA_OPTIONS = [
  { period: 5, color: "#22d3ee" },
  { period: 10, color: "#60a5fa" },
  { period: 20, color: "#a78bfa" },
  { period: 50, color: "#fbbf24" },
  { period: 100, color: "#fb7185" },
];


// ---------------------------------------
// HISTORICAL PRICE CHART
// ---------------------------------------
function HistoricalChart({ history }: { history: StockHistory }) {
  const chartRef = useRef<HTMLDivElement>(null);

  const [selectedRange, setSelectedRange] = useState("1Y");
  const [selectedSMAs, setSelectedSMAs] = useState<number[]>([
  5, 20, 50,
]);

  const ranges = [
    { label: "1M", days: 22 },
    { label: "3M", days: 66 },
    { label: "6M", days: 126 },
    { label: "1Y", days: 252 },
    { label: "2Y", days: 504 },
    { label: "All", days: Infinity },
  ];

  const selectedDays =
    ranges.find((range) => range.label === selectedRange)?.days ??
    252;

  const visibleHistory =
    selectedDays === Infinity
      ? history.history
      : history.history.slice(-selectedDays);

  useEffect(() => {
    const container = chartRef.current;
    if (!container || !history.history.length) return;

    const chart = createChart(container, {
      autoSize: true,
      height: 380,
      layout: {
        background: {
          type: ColorType.Solid,
          color: "#0e1623",
        },
        textColor: "#94a3b8",
        fontFamily: "Inter, sans-serif",
      },
      grid: {
        vertLines: { color: "rgba(148,163,184,0.05)" },
        horzLines: { color: "rgba(148,163,184,0.08)" },
      },
      rightPriceScale: {
        borderColor: "rgba(148,163,184,0.15)",
      },
      timeScale: {
        borderColor: "rgba(148,163,184,0.15)",
        timeVisible: false,
      },
    });

    container.style.cursor = "crosshair";

   const candles = visibleHistory.map((row) => ({
      time: chartTime(row.Date),
      open: row.Open,
      high: row.High,
      low: row.Low,
      close: row.Close,
    }));

    const candleSeries = chart.addSeries(CandlestickSeries, {
      upColor: "#34d399",
      downColor: "#fb7185",
      borderUpColor: "#34d399",
      borderDownColor: "#fb7185",
      wickUpColor: "#34d399",
      wickDownColor: "#fb7185",
    });

    candleSeries.setData(candles);

   const visibleDates = new Set(
  visibleHistory.map((row) => row.Date)
);

const movingAverages = SMA_OPTIONS.filter(({ period }) =>
  selectedSMAs.includes(period)
);

movingAverages.forEach(({ period, color }) => {
  const series = chart.addSeries(LineSeries, {
    color,
    lineWidth: 2,
    priceLineVisible: false,
    lastValueVisible: false,
  });

  const smaData = history.history.flatMap((row, index) => {
    if (index + 1 < period || !visibleDates.has(row.Date)) {
      return [];
    }

    const window = history.history.slice(
      index - period + 1,
      index + 1
    );

    const average =
      window.reduce(
        (sum, item) => sum + item["Adj Close"],
        0
      ) / period;

    return [{
      time: chartTime(row.Date),
      value: average,
    }];
  });

  series.setData(smaData);
});


    // Volume histogram uses a separate price scale.
    const volumeSeries = chart.addSeries(
      HistogramSeries,
      {
        priceFormat: { type: "volume" },
        priceScaleId: "volume",
        lastValueVisible: false,
        priceLineVisible: false,
      }
    );

   volumeSeries.setData(
  visibleHistory.map((row) => ({
        time: chartTime(row.Date),
        value: row.Volume,
        color:
          row.Close >= row.Open
            ? "rgba(52,211,153,0.35)"
            : "rgba(251,113,133,0.35)",
      }))
    );

    chart.priceScale("volume").applyOptions({
      scaleMargins: {
        top: 0.82,
        bottom: 0,
      },
    });

    chart.timeScale().fitContent();

    return () => chart.remove();
 }, [history, visibleHistory, selectedSMAs]);

 return (
  <div>
    <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
      <div className="flex flex-wrap items-center gap-1 rounded-lg bg-white/[0.04] p-1">
        {ranges.map((range) => (
          <button
            key={range.label}
            onClick={() => setSelectedRange(range.label)}
            className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
              selectedRange === range.label
                ? "bg-cyan-400/15 text-cyan-400"
                : "text-slate-400 hover:bg-white/[0.05] hover:text-white"
            }`}
          >
            {range.label}
          </button>
        ))}
      </div>
    </div>

    <div className="mb-3 flex flex-wrap items-center gap-2">
  <span className="mr-1 text-[11px] text-slate-500">
    Moving averages
  </span>

  {SMA_OPTIONS.map(({ period, color }) => {
    const active = selectedSMAs.includes(period);

    return (
      <button
        key={period}
        onClick={() =>
          setSelectedSMAs((current) =>
            active
              ? current.filter((item) => item !== period)
              : [...current, period].sort((a, b) => a - b)
          )
        }
        className={`rounded-md border px-2.5 py-1 text-[11px] font-medium transition-colors ${
          active
            ? "border-white/15 bg-white/[0.07]"
            : "border-white/[0.05] text-slate-500 hover:text-slate-300"
        }`}
        style={active ? { color } : undefined}
      >
        SMA {period}
      </button>
    );
  })}
</div>

   <div className="mb-3 flex flex-wrap gap-4 text-xs">
  {SMA_OPTIONS.filter(({ period }) =>
    selectedSMAs.includes(period)
  ).map(({ period, color }) => (
    <span key={period} style={{ color }}>
      ● SMA {period}
    </span>
  ))}

  <span className="text-slate-400">● Volume</span>
</div>
      <div ref={chartRef} className="w-full" />
    </div>
  );
}

// ---------------------------------------
// ACTUAL VS PREDICTED RETURN CHART
// ---------------------------------------

function BacktestChart({ result }: { result: BacktestResponse }) {
  const chartRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = chartRef.current;
    if (!container || !result.data.length) return;

    const chart = createChart(container, {
      autoSize: true,
      height: 300,
      layout: {
        background: {
          type: ColorType.Solid,
          color: "#0e1623",
        },
        textColor: "#94a3b8",
        fontFamily: "Inter, sans-serif",
      },
      grid: {
        vertLines: { color: "rgba(148,163,184,0.05)" },
        horzLines: { color: "rgba(148,163,184,0.08)" },
      },
      rightPriceScale: {
        borderColor: "rgba(148,163,184,0.15)",
      },
      timeScale: {
        borderColor: "rgba(148,163,184,0.15)",
      },
    });

    const actualSeries = chart.addSeries(LineSeries, {
      color: "#34d399",
      lineWidth: 2,
      title: "Actual",
      priceLineVisible: false,
    });

    const predictedSeries = chart.addSeries(LineSeries, {
      color: "#a78bfa",
      lineWidth: 2,
      title: "Predicted",
      priceLineVisible: false,
    });

    actualSeries.setData(
      result.data.map((row) => ({
        time: chartTime(row.Date),
        value: row.next_day_return * 100,
      }))
    );

    predictedSeries.setData(
      result.data.map((row) => ({
        time: chartTime(row.Date),
        value: row.predicted_next_day_return * 100,
      }))
    );

    chart.timeScale().fitContent();

    return () => chart.remove();
  }, [result]);

  return (
    <div>
      <div className="mb-3 flex gap-5 text-xs">
        <span className="text-emerald-400">● Actual return</span>
        <span className="text-violet-400">● Predicted return</span>
      </div>
      <div ref={chartRef} className="w-full" />
    </div>
  );
}



function NiftyBacktestChart({
  result,
}: {
  result: NiftyBacktestResponse;
}) {
  const chartRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = chartRef.current;
    if (!container || !result.data.length) return;

    const chart = createChart(container, {
      autoSize: true,
      height: 300,
      layout: {
        background: {
          type: ColorType.Solid,
          color: "#0e1623",
        },
        textColor: "#94a3b8",
        fontFamily: "Inter, sans-serif",
      },
      grid: {
        vertLines: { color: "rgba(148,163,184,0.05)" },
        horzLines: { color: "rgba(148,163,184,0.08)" },
      },
      rightPriceScale: {
        borderColor: "rgba(148,163,184,0.15)",
      },
      timeScale: {
        borderColor: "rgba(148,163,184,0.15)",
      },
    });

    const actualSeries = chart.addSeries(LineSeries, {
      color: "#34d399",
      lineWidth: 2,
      title: "Actual",
      priceLineVisible: false,
    });

    const predictedSeries = chart.addSeries(LineSeries, {
      color: "#a78bfa",
      lineWidth: 2,
      title: "Predicted",
      priceLineVisible: false,
    });

    actualSeries.setData(
      result.data.map((row) => ({
        time: chartTime(row.Target_Date),
        value: row.Actual_Nifty_Return * 100,
      }))
    );

    predictedSeries.setData(
      result.data.map((row) => ({
        time: chartTime(row.Target_Date),
        value: row.Predicted_Nifty_Return * 100,
      }))
    );

    chart.timeScale().fitContent();

    return () => chart.remove();
  }, [result]);

  return (
    <div>
      <div className="mb-3 flex gap-5 text-xs">
        <span className="text-emerald-400">● Actual Nifty return</span>
        <span className="text-violet-400">● Predicted Nifty return</span>
      </div>
      <div ref={chartRef} className="w-full" />
    </div>
  );
}


// ---------------------------------------
// REUSABLE METRIC CARD
// ---------------------------------------

function MetricCard({
  label,
  value,
  description,
}: {
  label: string;
  value: string;
  description?: string;
}) {
  return (
    <div className="rounded-xl border border-white/[0.07] bg-white/[0.025] p-4">
      <p className="text-xs text-slate-400">{label}</p>
      <p className="mt-2 text-2xl font-semibold text-white">{value}</p>
      {description && (
        <p className="mt-1 text-[11px] text-slate-500">{description}</p>
      )}
    </div>
  );
}

// ---------------------------------------
// MAIN DASHBOARD
// ---------------------------------------

export default function AutomotiveML() {
  const [ticker, setTicker] = useState("MARUTI.NS");

  const [prediction, setPrediction] =
    useState<StockPrediction | null>(null);

  const [history, setHistory] =
    useState<StockHistory | null>(null);

  const [backtest, setBacktest] =
    useState<BacktestResponse | null>(null);

  const [metrics, setMetrics] =
    useState<ModelMetrics | null>(null);

  const [performance, setPerformance] =
    useState<CompanyPerformanceResponse | null>(null);

    // Nifty 50 impact analysis
  const [niftyPrediction, setNiftyPrediction] =
    useState<NiftyPrediction | null>(null);

  const [niftyRelationships, setNiftyRelationships] =
    useState<NiftyRelationshipsResponse | null>(null);

  const [niftyMetrics, setNiftyMetrics] =
    useState<NiftyMetrics | null>(null);

  const [niftyBacktest, setNiftyBacktest] =
    useState<NiftyBacktestResponse | null>(null);

  const [niftyLoading, setNiftyLoading] = useState(true);
  const [niftyError, setNiftyError] = useState("");  

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Load overall model results once.
  useEffect(() => {
    let active = true;

    async function loadDashboard() {
      try {
        const [metricData, performanceData] = await Promise.all([
          getMLMetrics(),
          getMLCompanyPerformance(),
        ]);

        if (active) {
          setMetrics(metricData);
          setPerformance(performanceData);
        }
      } catch {
        if (active) {
          setError("Unable to load model evaluation data.");
        }
      }
    }

    loadDashboard();

    return () => {
      active = false;
    };
  }, []);


    // Load Nifty 50 impact analysis once.
  useEffect(() => {
    let active = true;

    async function loadNiftyAnalysis() {
      try {
        const [
          predictionData,
          relationshipData,
          metricsData,
          backtestData,
        ] = await Promise.all([
          getNiftyPrediction(),
          getNiftyRelationships(),
          getNiftyMetrics(),
          getNiftyBacktest(99),
        ]);

        if (active) {
          setNiftyPrediction(predictionData);
          setNiftyRelationships(relationshipData);
          setNiftyMetrics(metricsData);
          setNiftyBacktest(backtestData);
        }
      } catch (error) {
        console.error("Nifty 50 analysis error:", error);

        if (active) {
          setNiftyError(
            "Unable to load Nifty 50 impact analysis."
          );
        }
      } finally {
        if (active) setNiftyLoading(false);
      }
    }

    loadNiftyAnalysis();

    return () => {
      active = false;
    };
  }, []);

  // Load selected company's prediction and historical data.
  useEffect(() => {
    let active = true;

    async function loadStockData() {
      setLoading(true);
      setError("");

      try {
       const [predictionData, historyData, backtestData] =
  await Promise.all([
    getMLPrediction(ticker),
    getMLHistory(ticker, 2000),
    getMLBacktest(ticker, 200),
  ]);

        if (active) {
          setPrediction(predictionData);
          setHistory(historyData);
          setBacktest(backtestData);
        }
      } catch {
        if (active) {
          setPrediction(null);
          setHistory(null);
          setBacktest(null);
          setError(
            "Unable to load stock data. Check that the Python API is running."
          );
        }
      } finally {
        if (active) setLoading(false);
      }
    }

    loadStockData();

    return () => {
      active = false;
    };
  }, [ticker]);

  const logistic = metrics?.logistic_regression.model;
  const regression = metrics?.multiple_linear_regression.model;
  const matrix = logistic?.["Confusion Matrix"];

  return (
    <div className="space-y-6">

      {/* HEADER */}

      <div>
        <h1 className="text-2xl font-bold text-white">
          Automotive ML Intelligence
        </h1>
        <p className="mt-1 text-sm text-slate-400">
          Historical analysis, machine learning predictions and model evaluation
          across 10 automobile companies.
        </p>
      </div>

      {/* STOCK SELECTOR */}

      <section className="rounded-xl border border-white/[0.07] bg-white/[0.025] p-5">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="font-semibold text-white">Stock Analysis</h2>
            <p className="mt-1 text-xs text-slate-400">
              Select a company to explore its historical data and prediction.
            </p>
          </div>

          <select
            value={ticker}
            onChange={(e) => setTicker(e.target.value)}
            className="min-w-[220px] rounded-lg border border-white/10 bg-[#0e1623] p-3 text-sm text-white outline-none"
          >
            {stocks.map((stock) => (
              <option
                key={stock.ticker}
                value={stock.ticker}
                className="bg-[#0e1623] text-white"
              >
                {stock.name}
              </option>
            ))}
          </select>
        </div>

        {loading && (
          <p className="mt-4 text-sm text-cyan-400">
            Loading stock analysis...
          </p>
        )}

        {error && (
          <p className="mt-4 text-sm text-red-400">{error}</p>
        )}
      </section>

      {/* PREDICTION RESULTS */}

      {prediction && !loading && (
        <section className="space-y-4">
          <div>
            <h2 className="text-lg font-semibold text-white">
              Machine Learning Prediction
            </h2>
            <p className="mt-1 text-xs text-slate-400">
              {prediction.company} · {prediction.ticker} · Data through{" "}
              {prediction.data_as_of}
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <MetricCard
              label="MLR Predicted Return"
              value={`${prediction.predicted_return_percent.toFixed(4)}%`}
              description="Experimental next-day estimate"
            />

            <MetricCard
              label="Predicted Direction"
              value={prediction.predicted_direction}
              description="Logistic Regression"
            />

            <MetricCard
              label="UP Probability"
              value={percent(prediction.up_probability)}
            />

            <MetricCard
              label="DOWN Probability"
              value={percent(prediction.down_probability)}
            />
          </div>

          <p className="text-xs text-slate-500">{prediction.note}</p>
        </section>
      )}

      {/* HISTORICAL PRICE CHART */}

      {history && !loading && (
       <section className="quant-chart-panel rounded-xl border border-white/[0.07] bg-[#0e1623] p-4 sm:p-5">
          <div className="mb-4">
            <h2 className="font-semibold text-white">
              Historical Price & Moving Averages
            </h2>
            <p className="mt-1 text-xs text-slate-400">
              {history.company} · {history.records} trading sessions · Through{" "}
              {history.data_as_of}
            </p>
          </div>

          <HistoricalChart history={history} />

          <p className="mt-3 text-[10px] text-slate-500">
            Historical OHLC prices with 5, 20 and 50-day simple moving
            averages. Volume is displayed in the lower chart region.
          </p>
        </section>
      )}

      {/* BACKTEST CHART */}

      {backtest && !loading && (
        <section className="quant-chart-panel rounded-xl border border-white/[0.07] bg-[#0e1623] p-4 sm:p-5">
          <div className="mb-4">
            <h2 className="font-semibold text-white">
              Actual vs Predicted Returns
            </h2>
            <p className="mt-1 text-xs text-slate-400">
              Historical test-set comparison for {ticker}
            </p>
          </div>

          <BacktestChart result={backtest} />

          <p className="mt-3 text-[10px] text-slate-500">
            Comparison of actual next-day returns against model estimates
            on the chronological test dataset.
          </p>
        </section>
      )}


      

      {/* OVERALL MODEL PERFORMANCE */}

      {metrics && (
        <section className="space-y-4">
          <div>
            <h2 className="quant-section-heading text-lg font-semibold text-slate-900 dark:text-white">
              Model Evaluation
            </h2>
           <p className="mt-1 text-xs text-slate-600 dark:text-slate-400">
              Overall performance on unseen chronological test data.
            </p>
          </div>

          <div>
            <h3 className="mb-3text-sm font-medium text-slate-700 dark:text-slate-300">
              Logistic Regression
            </h3>

            <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
              <MetricCard
                label="Accuracy"
                value={percent(logistic!.Accuracy)}
              />
              <MetricCard
                label="Precision"
                value={percent(logistic!.Precision)}
              />
              <MetricCard
                label="Recall"
                value={percent(logistic!.Recall)}
              />
              <MetricCard
                label="F1 Score"
                value={percent(logistic!.F1)}
              />
            </div>
          </div>

          <div>
            <h3 className="mb-3 text-sm font-medium text-slate-700 dark:text-slate-300">
              Multiple Linear Regression
            </h3>

            <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
              <MetricCard
                label="MAE"
                value={decimal(regression!.MAE)}
              />
              <MetricCard
                label="MSE"
                value={decimal(regression!.MSE)}
              />
              <MetricCard
                label="RMSE"
                value={decimal(regression!.RMSE)}
              />
              <MetricCard
                label="R² Score"
                value={decimal(regression!.R2)}
              />
            </div>
          </div>

          {/* CONFUSION MATRIX */}

          {matrix && (
            <div className="rounded-xl border border-white/[0.07] bg-white/[0.025] p-5">
              <h3 className="font-semibold text-white">
                Logistic Regression · Confusion Matrix
              </h3>

              <p className="mt-1 text-xs text-slate-400">
                Actual classes compared with predicted classes.
              </p>

              <div className="mx-auto mt-5 max-w-md">
                <p className="mb-2 text-center text-xs text-slate-400">
                  Predicted
                </p>

                <div className="grid grid-cols-[75px_1fr_1fr] gap-2 text-center">
                  <div />
                  <p className="text-xs text-slate-400">DOWN</p>
                  <p className="text-xs text-slate-400">UP</p>

                  <div className="flex items-center justify-center text-xs text-slate-400">
                    DOWN
                  </div>

                  <div className="rounded-lg border border-emerald-400/20 bg-emerald-400/10 p-4">
                    <p className="text-xl font-bold text-emerald-400">
                      {matrix[0][0]}
                    </p>
                    <p className="mt-1 text-[10px] text-slate-400">
                      Correct
                    </p>
                  </div>

                  <div className="rounded-lg border border-red-400/20 bg-red-400/10 p-4">
                    <p className="text-xl font-bold text-red-400">
                      {matrix[0][1]}
                    </p>
                    <p className="mt-1 text-[10px] text-slate-400">
                      Incorrect
                    </p>
                  </div>

                  <div className="flex items-center justify-center text-xs text-slate-400">
                    UP
                  </div>

                  <div className="rounded-lg border border-red-400/20 bg-red-400/10 p-4">
                    <p className="text-xl font-bold text-red-400">
                      {matrix[1][0]}
                    </p>
                    <p className="mt-1 text-[10px] text-slate-400">
                      Incorrect
                    </p>
                  </div>

                  <div className="rounded-lg border border-emerald-400/20 bg-emerald-400/10 p-4">
                    <p className="text-xl font-bold text-emerald-400">
                      {matrix[1][1]}
                    </p>
                    <p className="mt-1 text-[10px] text-slate-400">
                      Correct
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </section>
      )}

      {/* COMPANY PERFORMANCE */}

      {performance && (
        <section className="rounded-xl border border-white/[0.07] bg-white/[0.025] p-4 sm:p-5">
          <div className="mb-4">
            <h2 className="quant-section-heading font-semibold text-slate-900 dark:text-white">
              Company-wise Model Performance
            </h2>
           <p className="mt-1 text-xs text-slate-600 dark:text-slate-400">
              Logistic Regression results across the 10 automobile companies.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[700px] text-left text-xs">
              <thead>
                <tr className="border-b border-white/10 text-slate-400">
                  <th className="px-3 py-3 font-medium">Company</th>
                  <th className="px-3 py-3 font-medium">Test Records</th>
                  <th className="px-3 py-3 font-medium">Accuracy</th>
                  <th className="px-3 py-3 font-medium">F1 Score</th>
                  <th className="px-3 py-3 font-medium">ROC-AUC</th>
                  <th className="px-3 py-3 font-medium">MLR R²</th>
                </tr>
              </thead>

              <tbody>
                {performance.data.map((company) => (
                  <tr
                    key={company.Ticker}
                    className="border-b border-white/[0.05] text-slate-300"
                  >
                    <td className="px-3 py-3 font-medium text-white">
                      {company.Company}
                    </td>
                    <td className="px-3 py-3">
                      {company["Test Records"]}
                    </td>
                    <td className="px-3 py-3">
                      {percent(company["Logistic Accuracy"])}
                    </td>
                    <td className="px-3 py-3">
                      {percent(company["Logistic F1"])}
                    </td>
                    <td className="px-3 py-3">
                      {decimal(company["ROC AUC"])}
                    </td>
                    <td className="px-3 py-3">
                      {decimal(company["MLR R2"])}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {/* DATASET INFORMATION */}

      {metrics && (
        <section className="rounded-xl border border-white/[0.07] bg-white/[0.025] p-5">
          <h2 className="quant-section-heading font-semibold text-slate-900 dark:text-white">
            Research Dataset
          </h2>

          <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-4">
            <MetricCard
              label="Companies"
              value={String(metrics.companies)}
            />
            <MetricCard
              label="Total Records"
              value={metrics.total_records.toLocaleString()}
            />
            <MetricCard
              label="Training Records"
              value={metrics.training_records.toLocaleString()}
            />
            <MetricCard
              label="Testing Records"
              value={metrics.testing_records.toLocaleString()}
            />
          </div>

          <p className="mt-4 text-xs text-slate-600 dark:text-slate-400">
            Chronological 80/20 training and testing split. Test period
            begins {metrics.test_start_date}. Basket return represents
            the equal-weight basket of the selected automobile stocks.
          </p>
        </section>
      )}


      
      {/* NIFTY 50 IMPACT ANALYSIS */}

      <section className="space-y-5">
        <div>
          <h2 className="quant-section-heading text-xl font-bold text-slate-900 dark:text-white">
            Nifty 50 Impact Analysis
          </h2>
         <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
            Examining the relationship between returns of 10 selected
            automobile stocks and the next trading session's Nifty 50 return.
          </p>
        </div>

        {niftyLoading && (
          <p className="text-sm text-cyan-400">
            Loading Nifty 50 analysis...
          </p>
        )}

        {niftyError && (
          <p className="text-sm text-red-400">{niftyError}</p>
        )}

        {!niftyLoading && niftyPrediction && (
          <>
            <div className="rounded-xl border border-amber-400/20 bg-amber-400/[0.04] p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-amber-400">
                Historical out-of-sample prediction · Not a live forecast
              </p>

              <p className="mt-2 text-sm text-slate-300">
                Automobile-stock inputs from {niftyPrediction.input_date}
                {" "}were used to estimate the Nifty 50 return for{" "}
                {niftyPrediction.target_date}.
              </p>

              <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
                <MetricCard
                  label="Actual Nifty Return"
                  value={`${niftyPrediction.actual_return_percent.toFixed(4)}%`}
                  description="Observed market return"
                />

                <MetricCard
                  label="MLR Predicted Return"
                  value={`${niftyPrediction.predicted_return_percent.toFixed(4)}%`}
                  description="Model estimate"
                />

                <MetricCard
                  label="Baseline Prediction"
                  value={`${(niftyPrediction.baseline_prediction * 100).toFixed(4)}%`}
                  description="Training-set mean return"
                />
              </div>
            </div>
          </>
        )}

        {niftyMetrics && (
          <div className="rounded-xl border border-white/[0.07] bg-white/[0.025] p-5">
            <h3 className="font-semibold text-white">
              Nifty 50 Regression Evaluation
            </h3>

            <p className="mt-1 text-xs text-slate-400">
              Multiple Linear Regression compared with a mean-return baseline.
              Chronological 80:20 split.
            </p>

            <div className="mt-4 grid grid-cols-2 gap-3 lg:grid-cols-3">
              <MetricCard
                label="Model MAE"
                value={decimal(niftyMetrics.model_metrics.MAE)}
              />
              <MetricCard
                label="Baseline MAE"
                value={decimal(niftyMetrics.baseline_metrics.MAE)}
              />
              <MetricCard
                label="Model RMSE"
                value={decimal(niftyMetrics.model_metrics.RMSE)}
              />
              <MetricCard
                label="Baseline RMSE"
                value={decimal(niftyMetrics.baseline_metrics.RMSE)}
              />
              <MetricCard
                label="Model R²"
                value={decimal(niftyMetrics.model_metrics.R2)}
              />
              <MetricCard
                label="Baseline R²"
                value={decimal(niftyMetrics.baseline_metrics.R2)}
              />
            </div>

            <p className="mt-4 text-xs leading-relaxed text-slate-400">
              The model has a slightly lower MAE than the baseline, but
              higher RMSE and a negative R². It therefore does not
              demonstrate reliable predictive improvement.
            </p>

            <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
              <MetricCard
                label="Dataset Records"
                value={String(niftyMetrics.total_records)}
              />
              <MetricCard
                label="Training Records"
                value={String(niftyMetrics.training_records)}
              />
              <MetricCard
                label="Testing Records"
                value={String(niftyMetrics.testing_records)}
              />
              <MetricCard
                label="Input Stocks"
                value={String(niftyMetrics.input_features.length)}
              />
            </div>
          </div>
        )}

        {niftyRelationships && (
          <div className="rounded-xl border border-white/[0.07] bg-white/[0.025] p-5">
            <h3 className="font-semibold text-white">
              Individual Stock Relationships
            </h3>

            <p className="mt-1 text-xs text-slate-400">
              Pearson correlation and standardized regression coefficients
              calculated on the training period.
            </p>

            <div className="mt-4 overflow-x-auto">
              <table className="w-full min-w-[620px] text-left text-xs">
                <thead>
                  <tr className="border-b border-white/10 text-slate-400">
                    <th className="px-3 py-3">Automobile Stock</th>
                    <th className="px-3 py-3">Correlation</th>
                    <th className="px-3 py-3">Std. Coefficient</th>
                    <th className="px-3 py-3">Relationship</th>
                  </tr>
                </thead>

                <tbody>
                  {niftyRelationships.data.map((item) => {
                    const company = stocks.find(
                      (stock) => stock.ticker === item.Ticker
                    );

                    return (
                      <tr
                        key={item.Ticker}
                        className="border-b border-white/[0.05] text-slate-300"
                      >
                        <td className="px-3 py-3">
                          <p className="font-medium text-white">
                            {company?.name ?? item.Ticker}
                          </p>
                          <p className="mt-1 text-[10px] text-slate-500">
                            {item.Ticker}
                          </p>
                        </td>

                        <td className="px-3 py-3 tabular-nums">
                          {item.Train_Period_Correlation.toFixed(4)}
                        </td>

                        <td className="px-3 py-3 tabular-nums">
                          {item.Standardized_Coefficient.toFixed(6)}
                        </td>

                        <td className={`px-3 py-3 font-medium ${
                          item.Relationship === "Positive"
                            ? "text-emerald-400"
                            : "text-red-400"
                        }`}>
                          {item.Relationship}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <p className="mt-3 text-[10px] leading-relaxed text-slate-500">
              These values describe statistical associations, not causation
              or actual Nifty 50 index contribution weights.
            </p>
          </div>
        )}

        {niftyBacktest && (
         <div className="quant-chart-panel rounded-xl border border-white/[0.07] bg-[#0e1623] p-4 sm:p-5">
            <div className="mb-4">
              <h3 className="font-semibold text-white">
                Nifty 50 · Actual vs Predicted
              </h3>
              <p className="mt-1 text-xs text-slate-400">
                Historical test-set results · {niftyBacktest.records} records
              </p>
            </div>

            <NiftyBacktestChart result={niftyBacktest} />

            <p className="mt-3 text-[10px] text-slate-500">
              Daily actual and predicted Nifty 50 returns across the
              chronological test period.
            </p>
          </div>
        )}
      </section>


      {/* DISCLAIMER */}

      <p className="rounded-lg border border-amber-400/10 bg-amber-400/[0.04] p-4 text-xs leading-relaxed text-slate-400">
        Research and educational use only. These models have limited
        predictive performance and are not investment recommendations.
        Historical data and experimental estimates should not be treated
        as live market prices or guaranteed future outcomes.
      </p>

    </div>
  );
}
