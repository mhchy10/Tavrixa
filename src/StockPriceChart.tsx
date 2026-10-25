
import { useEffect, useRef, useState } from 'react'
import {
  AreaSeries,
  CandlestickSeries,
  ColorType,
  createChart,
  LineSeries,
  type UTCTimestamp,
} from 'lightweight-charts'


import {
  subscribeToMarket,
  getSimulatedStock,
  getSimulatedCandles,
} from './data/marketSimulation'

type ChartMode = 'Candles' | 'Line' | 'Area'
type Timeframe = '1D' | '1W' | '1M' | '3M' | '1Y' | 'ALL'

type Candle = {
  time: UTCTimestamp
  open: number
  high: number
  low: number
  close: number
}

type Props = {
  symbol: string
  price: number
}


function makeDemoCandles(
  price: number,
  timeframe: Timeframe,
  symbol: string,
): Candle[] {
  const candles: Candle[] = []
  const now = Math.floor(Date.now() / 60_000) * 60

  const settings: Record<Timeframe, { count: number; step: number }> = {
    '1D': { count: 78, step: 5 * 60 },
    '1W': { count: 84, step: 60 * 60 },
    '1M': { count: 30, step: 24 * 60 * 60 },
    '3M': { count: 90, step: 24 * 60 * 60 },
    '1Y': { count: 52, step: 7 * 24 * 60 * 60 },
    ALL: { count: 180, step: 7 * 24 * 60 * 60 },
  }

  const { count, step } = settings[timeframe]

  let hash = 0
  for (let i = 0; i < symbol.length; i++) {
    hash = (hash * 31 + symbol.charCodeAt(i)) >>> 0
  }


const volatilityByTimeframe: Record<Timeframe, number> = {
  '1D': 0.0018,
  '1W': 0.004,
  '1M': 0.009,
  '3M': 0.014,
  '1Y': 0.025,
  ALL: 0.035,
}

const volatility = volatilityByTimeframe[timeframe]
  const values: number[] = []

  let level = price * (0.94 + (hash % 80) / 1000)



 
  // Seeded random generator: stable for each stock and timeframe.
  let seed = (hash ^ (count * 7919)) >>> 0

  const random = () => {
    seed = (seed * 1664525 + 1013904223) >>> 0
    return seed / 4294967296
  }

  let trendBias = 0
  let volatilityState = volatility

  for (let i = 0; i < count; i++) {
    // Let trends and volatility shift over time.
    if (i % Math.max(4, Math.floor(count / 9)) === 0) {
      trendBias = (random() - 0.5) * volatility * 0.9
      volatilityState = volatility * (0.45 + random() * 1.5)
    }

    const noise =
      (random() + random() + random() - 1.5) *
      volatilityState *
      2.2

    const shock =
      random() < 0.035
        ? (random() - 0.5) * volatilityState * 5
        : 0

    const change = trendBias + noise + shock

    level = Math.max(0.01, level * (1 + change))
    values.push(level)
  }




  const scale = price / values[values.length - 1]

  for (let i = 0; i < count; i++) {
    const previous = i === 0 ? values[i] : values[i - 1]
    const open = previous * scale
    const close = values[i] * scale
    const wick = price * (0.001 + ((hash + i * 17) % 10) / 5000)

    candles.push({
      time: (now - (count - 1 - i) * step) as UTCTimestamp,
      open,
      high: Math.max(open, close) + wick,
      low: Math.max(0.01, Math.min(open, close) - wick),
      close,
    })
  }

  return candles
}




export default function StockPriceChart({ symbol, price }: Props) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [mode, setMode] = useState<ChartMode>('Candles')
  const [timeframe, setTimeframe] = useState<Timeframe>('1M')
  const [isExpanded, setIsExpanded] = useState(false)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return
    container.style.cursor = 'crosshair'

    const chart = createChart(container, {
      autoSize: true,
      height: 340,
      layout: {
        background: {
          type: ColorType.Solid,
          color: '#0e1623',
        },
        textColor: '#94a3b8',
        fontFamily: 'Inter, sans-serif',
      },
      grid: {
        vertLines: { color: 'rgba(148,163,184,0.06)' },
        horzLines: { color: 'rgba(148,163,184,0.08)' },
      },
      rightPriceScale: {
        borderColor: 'rgba(148,163,184,0.15)',
      },
      timeScale: {
        borderColor: 'rgba(148,163,184,0.15)',
        timeVisible: true,
      },
      crosshair: {
        vertLine: {
          color: 'rgba(34,211,238,0.45)',
          width: 1,
          style: 2,
        },
        horzLine: {
          color: 'rgba(34,211,238,0.25)',
          width: 1,
          style: 2,
        },
      },
    })

const simulatedStock = getSimulatedStock(symbol)

const demoCandles = makeDemoCandles(
  simulatedStock?.price ?? price,
  timeframe,
  symbol,
)
const chartCandles: Candle[] = demoCandles


  
if (mode === 'Candles') {
  const series = chart.addSeries(CandlestickSeries, {
    upColor: '#34d399',
    downColor: '#fb7185',
    borderUpColor: '#34d399',
    borderDownColor: '#fb7185',
    wickUpColor: '#34d399',
    wickDownColor: '#fb7185',
  })

  series.setData(chartCandles)

  const unsubscribe = subscribeToMarket(() => {
    const latest = getSimulatedCandles(symbol).at(-1)
    if (latest) {
     series.update({
  ...latest,
time: chartCandles[chartCandles.length - 1].time,
})
    }
  })

  chart.timeScale().fitContent()
  return () => {
    unsubscribe()
    chart.remove()
  }
} else if (mode === 'Line') {
  const series = chart.addSeries(LineSeries, {
    color: '#22d3ee',
    lineWidth: 2,
    crosshairMarkerRadius: 3,
  })

  series.setData(
    chartCandles.map(({ time, close }) => ({ time, value: close }))
  )

  const unsubscribe = subscribeToMarket(() => {
    const latest = getSimulatedCandles(symbol).at(-1)
    if (latest) {
      series.update({
       time: latest.time as UTCTimestamp,
value: latest.close,
      })
    }
  })

  chart.timeScale().fitContent()
  return () => {
    unsubscribe()
    chart.remove()
  }
} else {
  const series = chart.addSeries(AreaSeries, {
    lineColor: '#22d3ee',
    topColor: 'rgba(34,211,238,0.28)',
    bottomColor: 'rgba(34,211,238,0.01)',
    lineWidth: 2,
  })

  series.setData(
    chartCandles.map(({ time, close }) => ({ time, value: close }))
  )

  const unsubscribe = subscribeToMarket(() => {
    const latest = getSimulatedCandles(symbol).at(-1)
    if (latest) {
      series.update({
      time: latest.time as UTCTimestamp,
value: latest.close,
      })
    }
  })

  chart.timeScale().fitContent()
  return () => {
    unsubscribe()
    chart.remove()
  }
}

  }, [symbol, mode, timeframe])

  return (
   <>
  {isExpanded && (
    <button
      type="button"
      aria-label="Close expanded chart"
      onClick={() => setIsExpanded(false)}
      className="fixed inset-0 z-40 cursor-default bg-black/80"
    />
  )}

  <div
    className={
      isExpanded
        ? 'fixed inset-3 z-50 flex flex-col overflow-hidden rounded-xl border border-cyan-300/20 bg-[#0e1623] shadow-2xl'
        : 'overflow-hidden rounded-xl border border-white/[0.06] bg-[#0e1623]'
    }
  >
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/[0.06] px-4 py-3">
        <div>
          <p className="text-sm font-semibold text-white">{symbol}</p>
          <p className="mt-1 text-[10px] text-amber-300">
            DEMO DATA · NOT LIVE
          </p>
        </div>

        <div className="flex items-center gap-1 rounded-lg border border-white/[0.08] bg-white/[0.025] p-1">
  {(['1D', '1W', '1M', '3M', '1Y', 'ALL'] as Timeframe[]).map((item) => (
    <button
      key={item}
      type="button"
      onClick={() => setTimeframe(item)}
      className={`cursor-pointer rounded-md px-2 py-1.5 text-xs transition ${
        timeframe === item
          ? 'bg-cyan-300 text-slate-950'
          : 'text-slate-400 hover:text-white'
      }`}
    >
      {item}
    </button>
  ))}
</div>

       <div className="flex items-center gap-1 rounded-lg border border-white/[0.08] bg-white/[0.025] p-1">
  {(['Candles', 'Line', 'Area'] as ChartMode[]).map((item) => (
    <button
      key={item}
      type="button"
      onClick={() => setMode(item)}
      className={`cursor-pointer rounded-md px-2.5 py-1.5 text-xs transition ${
        mode === item
          ? 'bg-cyan-300 text-slate-950'
          : 'text-slate-400 hover:text-white'
      }`}
    >
      {item}
    </button>
  ))}

  <button
    type="button"
    onClick={() => setIsExpanded(!isExpanded)}
    title={isExpanded ? 'Exit expanded view' : 'Expand chart'}
    aria-label={isExpanded ? 'Exit expanded view' : 'Expand chart'}
    className="cursor-pointer rounded-md px-2.5 py-1.5 text-sm text-slate-300 hover:bg-white/10 hover:text-white"
  >
    {isExpanded ? '✕' : '⛶'}
  </button>
</div>
      </div>

     <div
  ref={containerRef}
  className={isExpanded ? 'w-full flex-1 min-h-0' : 'w-full'}
/>

      <p className="border-t border-white/[0.06] px-4 py-3 text-[10px] text-slate-500">
        Illustrative price history. Genuine historical and live market data
        will be connected separately.
      </p>
        </div>
  </>
  )
}