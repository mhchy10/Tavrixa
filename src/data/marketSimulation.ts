import { stockCatalogue } from './stockCatalogue'
export type SimulatedStock = {
  symbol: string
  name: string
  price: number
  change: number
  sector: string
  marketCap: string
  marketCapValue: number
  pe: number
}

export type SimulatedCandle = {
  time: number
  open: number
  high: number
  low: number
  close: number
}


const baselinePrices = new Map(
  stockCatalogue.map((seed) => [seed.symbol, seed.price])
)

const market = new Map<string, SimulatedStock>()
for (const seed of  stockCatalogue) {
  market.set(seed.symbol, { ...seed, price: seed.price, change: 0 })
}

const listeners = new Set<() => void>()
const history = new Map<string, SimulatedCandle[]>()

function initializeHistory() {
  const now = Math.floor(Date.now() / 60_000) * 60

  for (const stock of market.values()) {
    if (history.has(stock.symbol)) continue

    const candles: SimulatedCandle[] = []
    const count = 180
    const step = 24 * 60 * 60
    const basePrice = stock.price

    // Each stock gets its own repeatable random sequence.
    let seed = 0
    for (let i = 0; i < stock.symbol.length; i++) {
      seed = (seed * 31 + stock.symbol.charCodeAt(i)) >>> 0
    }

    const random = () => {
      seed = (seed * 1664525 + 1013904223) >>> 0
      return seed / 4294967296
    }

    let previousClose =
      basePrice * (0.88 + random() * 0.20)

    let trend = (random() - 0.5) * 0.001
    let volatility = 0.008 + random() * 0.012

    for (let i = 0; i < count; i++) {
      const open = previousClose

      // Trends and volatility change irregularly over time.
      if (i % 12 === 0) {
        trend = (random() - 0.5) * 0.002
        volatility = 0.005 + random() * 0.020
      }

      const shock =
        random() < 0.045
          ? (random() - 0.5) * volatility * 5
          : 0

      const dailyReturn =
        trend +
        (random() + random() + random() - 1.5) *
          volatility +
        shock

      const close = Math.max(
        0.01,
        open * (1 + dailyReturn),
      )

      const upperWick =
        open * volatility * random() * 0.8

      const lowerWick =
        open * volatility * random() * 0.8

      candles.push({
        time: now - (count - 1 - i) * step,
        open,
        high: Math.max(open, close) + upperWick,
        low: Math.max(
          0.01,
          Math.min(open, close) - lowerWick,
        ),
        close,
      })

      previousClose = close
    }

    // Align the last candle with the current simulated price.
    const scale = stock.price / candles[candles.length - 1].close

    for (const candle of candles) {
      candle.open *= scale
      candle.high *= scale
      candle.low *= scale
      candle.close *= scale
    }

    history.set(stock.symbol, candles)
  }
}



let timer: ReturnType<typeof setInterval> | undefined

function notify() {
  listeners.forEach((listener) => listener())
}

function tick() {
  for (const stock of market.values()) {
    // Deterministic, small movements; not genuine market prices.
    const movement = (Math.random() - 0.5) * 0.0016
    const previousPrice = stock.price
    stock.price = Math.max(0.01, previousPrice * (1 + movement))
   stock.change =
  ((stock.price / baselinePrices.get(stock.symbol)!) - 1) * 100

    const now = Math.floor(Date.now() / 1000)
    const candleTime = now - (now % 60)
    const candles = history.get(stock.symbol) ?? []

   if (candles.length === 0) {
  const seedPrice = baselinePrices.get(stock.symbol) ?? previousPrice

  candles.push({
    time: candleTime - 60,
    open: seedPrice,
    high: seedPrice,
    low: seedPrice,
    close: seedPrice,
  })
}
    const last = candles[candles.length - 1]

    if (last && last.time === candleTime) {
      last.close = stock.price
      last.high = Math.max(last.high, stock.price)
      last.low = Math.min(last.low, stock.price)
    } else {
      candles.push({
        time: candleTime,
        open: previousPrice,
        high: Math.max(previousPrice, stock.price),
        low: Math.min(previousPrice, stock.price),
        close: stock.price,
      })
    }

    if (candles.length > 1440) candles.shift()
    history.set(stock.symbol, candles)
  }

  notify()
}

export function startMarketSimulation() {
  initializeHistory()
  if (timer) return
  timer = setInterval(tick, 1000)
}

export function subscribeToMarket(listener: () => void) {
  listeners.add(listener)
  startMarketSimulation()

  return () => {
    listeners.delete(listener)
    if (listeners.size === 0 && timer) {
      clearInterval(timer)
      timer = undefined
    }
  }
}

export function getSimulatedStocks(): SimulatedStock[] {
  return Array.from(market.values()).map((stock) => ({ ...stock }))
}

export function getSimulatedStock(symbol: string): SimulatedStock | undefined {
  const stock = market.get(symbol)
  return stock ? { ...stock } : undefined
}

export function getSimulatedCandles(symbol: string): SimulatedCandle[] {
  return (history.get(symbol) ?? []).map((candle) => ({ ...candle }))
}
