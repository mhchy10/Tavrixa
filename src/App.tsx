import AuthPage from './components/AuthPage'
import { supabase } from './lib/supabase'
import type { Session } from '@supabase/supabase-js'

import { stockCatalogue } from './data/stockCatalogue'
import { getCompanyResearch } from './data/companyResearch'
import {
  getSimulatedStocks,
   getSimulatedStock,
  subscribeToMarket,
} from './data/marketSimulation'

import MarketCore from './components/MarketCore'
import StockPriceChart from './StockPriceChart'
import { useState, useEffect } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import {
  Activity,
  ArrowDownRight,
  ArrowRight,
  ArrowUpRight,
  Bell,
  Bookmark,
  BriefcaseBusiness,
  CircleHelp,
  Compass,
  LayoutDashboard,
  Menu,
  Settings,
  Sparkles,
  Wallet,
  X,
  Search,
Newspaper,
BellRing,
ArrowLeftRight,
History,
ChartNoAxesCombined,
NotebookPen,
FlaskConical,
ChartPie,
Info,
Save 
} from 'lucide-react'


const navigation = [
  { label: 'Overview', icon: LayoutDashboard, group: 'Workspace' },

  { label: 'Discover Stocks', icon: Compass, group: 'Workspace' },
  { label: 'Stock Screener', icon: Search, group: 'Workspace' },
  { label: 'Market Intelligence', icon: Newspaper, group: 'Workspace' },

  { label: 'Watchlists', icon: Bookmark, group: 'My investing' },
  { label: 'Paper Trading', icon: ChartNoAxesCombined, group: 'My investing' },  
  { label: 'Alerts', icon: BellRing, group: 'My investing' },
  { label: 'Portfolio', icon: BriefcaseBusiness, group: 'My investing' },
  { label: 'Transactions', icon: ArrowLeftRight, group: 'My investing' },
  { label: 'Trade History', icon: History, group: 'My investing' },

  { label: 'Research & Compare', icon: ChartNoAxesCombined, group: 'Analysis' },
  { label: 'Investment Journal', icon: NotebookPen, group: 'Analysis' },

  { label: 'Trading Lab', icon: FlaskConical, group: 'Tools' },
 { label: 'Portfolio Analytics', icon: ChartPie, group: 'Tools' },
{ label: 'About Tavrixa', icon: Info, group: 'Tools' },
]



function Brand() {
  return (
    <div className="flex items-center gap-3">
     <div className="flex size-10 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-cyan-300/20 bg-[#0a0f1c]">
    <img
      src="/tavrixalogo.jpeg"
      alt="Tavrixa logo"
      className="size-full object-cover"
    />
  </div>
      <div>
        <div className="text-[15px] font-semibold tracking-[0.16em] text-white">
          Tavrixa
        </div>
        <div className="mt-0.5 text-[9px] font-medium tracking-[0.24em] text-slate-500">
          Clarity in every move
        </div>
      </div>
    </div>
  )
}

function Sidebar({
  active,
  onNavigate,
  onClose,
}: {
  active: string
  onNavigate: (label: string) => void
  onClose?: () => void
}) {
  return (
    <aside className="sticky top-0 flex h-screen w-[260px] shrink-0 flex-col overflow-hidden border-r border-white/[0.07] bg-[#0b1019]">
      <div className="flex h-[76px] items-center justify-between border-b border-white/[0.06] px-5">
        <Brand />
        {onClose && (
          <button
            onClick={onClose}
            aria-label="Close navigation"
            className="rounded-lg p-2 text-slate-400 hover:bg-white/[0.06] hover:text-white"
          >
            <X size={19} />
          </button>
        )}
      </div>

     
<div className="flex min-h-0 flex-1 flex-col px-4 pt-7">
  <nav className="min-h-0 flex-1 space-y-5 overflow-y-auto overscroll-contain pb-4">
    {['Workspace', 'My investing', 'Analysis', 'Tools'].map((group) => (
      <div key={group}>
        <p className="mb-3 px-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-600">
          {group}
        </p>

        <div className="space-y-1">
          {navigation
            .filter((item) => item.group === group)
            .map(({ label, icon: Icon }) => {
              const selected = active === label

              return (
                <button
                  key={label}
                  onClick={() => {
  onNavigate(label)
  onClose?.()
}}


className={`group flex w-full items-center gap-3 rounded-xl border px-3 py-3 text-left text-[13px] transition-all duration-300 ${
  selected
    ? label === 'Paper Trading'
      ? 'border-cyan-300/25 bg-gradient-to-r from-cyan-300/[0.12] to-violet-400/[0.10] text-cyan-100 shadow-[0_0_18px_rgba(34,211,238,0.10)]'
      : 'border-cyan-300/[0.12] bg-cyan-300/[0.08] text-cyan-200'
    : label === 'Paper Trading'
      ? 'border-violet-400/20 bg-violet-400/[0.05] text-slate-200 shadow-[inset_2px_0_0_rgba(167,139,250,0.65)] hover:bg-violet-400/[0.10] hover:text-white'
      : 'border-transparent text-slate-400 hover:bg-white/[0.04] hover:text-slate-100'
}`}



                >
                  <Icon size={18} strokeWidth={1.8} />
                  <span className="flex-1">{label}</span>
                  {selected && (
                    <span className="size-1.5 rounded-full bg-cyan-300" />
                  )}
                </button>
              )
            })}
        </div>
      </div>
    ))}
  </nav>
</div>


     
      <div className="shrink-0 space-y-1 border-t border-white/[0.06] p-4">
        <button
          onClick={() => {
            onNavigate('Settings')
            onClose?.()
          }}
          className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-[13px] text-slate-400 transition hover:bg-white/[0.04] hover:text-white"
        >
          <Settings size={17} />
          Settings
        </button>

        <button
          onClick={() => {
            onNavigate('Help & support')
            onClose?.()
          }}
          className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-[13px] text-slate-400 transition hover:bg-white/[0.04] hover:text-white"
        >
          <CircleHelp size={17} />
          Help &amp; support
        </button>

        <div className="mt-3 rounded-xl border border-white/[0.07] bg-white/[0.025] p-3">
          <p className="text-[11px] font-medium text-slate-300">
            Research with clarity.
          </p>
          <p className="mt-1 text-[10px] leading-relaxed text-slate-500">
            Understand the business before the price.
          </p>
        </div>
      </div>
    </aside>
  )
}

function Change({ value }: { value: number }) {
  const positive = value >= 0

  return (
    <span
      className={`inline-flex items-center gap-0.5 text-xs font-medium tabular-nums ${
        positive ? 'text-emerald-400' : 'text-rose-400'
      }`}
    >
      {positive ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
      {positive ? '+' : ''}
      {value.toFixed(2)}%
    </span>
  )
}



function DiscoverStocks({
  stocks,
  query,
  onQueryChange,
  onSelectStock,
}: {
  stocks: {
    symbol: string
    name: string
    price: string
    change: number
    sector: string
    marketCap: string
    pe: number
  }[]
  query: string
  onQueryChange: (value: string) => void
  onSelectStock: (symbol: string) => void
}) {

 
  const [category, setCategory] = useState('All stocks')
  const [sortBy, setSortBy] = useState('Default')

const featuredSymbols = [
  'RELIANCE',
  'TCS',
  'HDFCBANK',
  'ICICIBANK',
  'INFY',
  'BHARTIARTL',
  'ITC',
  'SBIN',
  'LT',
  'TRENT',
  'BEL',
  'ZOMATO',
  'TATAMOTORS',
  'SUNPHARMA',
  'MARUTI',
  'TATASTEEL',
]



const stockPool = query.trim()
  ? stocks
  : stocks.filter((stock) => featuredSymbols.includes(stock.symbol))



const results = stockPool    .filter((stock) =>
      `${stock.symbol} ${stock.name}`
        .toLowerCase()
        .includes(query.toLowerCase()),
    )
    .filter((stock) => {
      if (category === 'Gainers') return stock.change > 0
      if (category === 'Losers') return stock.change < 0
      return true
    })
    .sort((a, b) => {
      if (sortBy === 'Top gainers') return b.change - a.change
      if (sortBy === 'Top losers') return a.change - b.change
      if (sortBy === 'Name A–Z') return a.name.localeCompare(b.name)
      return 0
    })



  return (
    <div>
      <div className="mb-8">
    <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-cyan-300/[0.14] bg-cyan-300/[0.05] px-2.5 py-1.5 text-[10px] font-medium tracking-wide text-cyan-200 light-workspace-badge">
          <Compass size={12} />
          COMPANY DISCOVERY
        </div>

        <h1 className="text-2xl font-semibold tracking-tight text-white sm:text-3xl">
          Discover Stocks
        </h1>

        <p className="mt-2 max-w-xl text-sm leading-relaxed text-slate-500">
          Find companies to research. Start with the business, then examine
          its financials, valuation and risks.
        </p>
      </div>

      <div className="mb-6 rounded-2xl border border-white/[0.07] bg-[#0e141f] p-4 sm:p-5">
        <label className="mb-3 block text-xs font-medium text-slate-300">
          Search Companies
        </label>

        <div className="flex h-12 items-center gap-3 rounded-xl border border-white/[0.09] bg-white/[0.025] px-4 transition focus-within:border-cyan-300/40">
          <Search size={18} className="shrink-0 text-slate-500" />
          <input
            value={query}
            onChange={(event) => onQueryChange(event.target.value)}
            placeholder="Company name or ticker, e.g. TCS"
            className="stock-page-search min-w-0 flex-1 bg-transparent text-sm text-white outline-none placeholder:text-slate-600"
          />
          {query && (
            <button
              onClick={() => onQueryChange('')}
              className="text-xs text-slate-400 transition hover:text-white"
            >
              Clear
            </button>
          )}
        </div>

        <p className="mt-3 text-[11px] text-slate-500">
          Search the companies currently available in this demo.
        </p>
      </div>

     
<div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
  <div className="flex flex-wrap gap-2">
    {['All stocks', 'Gainers', 'Losers'].map((item) => (
      <button
        key={item}
        type="button"
        onClick={() => setCategory(item)}
        className={`rounded-xl border px-3 py-2 text-xs font-medium transition ${
          category === item
            ? 'border-cyan-300/40 bg-cyan-300/10 text-cyan-200'
            : 'border-white/[0.08] text-slate-400 hover:text-white'
        }`}
      >
        {item}
      </button>
    ))}
  </div>

  <div className="flex items-center gap-3">
    <p className="text-xs text-slate-500">
      {results.length} matching {results.length === 1 ? 'company' : 'companies'}
    </p>

    <select
      value={sortBy}
      onChange={(event) => setSortBy(event.target.value)}
      className="rounded-xl border border-white/[0.08] bg-[#0e141f] px-3 py-2.5 text-xs text-slate-300 outline-none focus:border-cyan-300/40"
    >
      <option value="Default">Default Order</option>
      <option value="Top gainers">Top Gainers</option>
      <option value="Top losers">Top Losers</option>
      <option value="Name A–Z">Name A–Z</option>
    </select>
  </div>
</div>

<div className="mb-4 flex items-center justify-between">
  <h2 className="text-sm font-semibold text-white">Companies</h2>
  <span className="rounded-lg border border-white/[0.07] px-3 py-2 text-[10px] text-slate-400">
   Illustrative Data
  </span>
</div>


      <div className="overflow-hidden rounded-2xl border border-white/[0.07] bg-[#0e141f]">
        {results.length === 0 ? (
          <div className="px-5 py-14 text-center">
            <Search size={24} className="mx-auto mb-3 text-slate-600" />
            <p className="text-sm font-medium text-slate-300">
              No companies found
            </p>
            <p className="mt-1 text-xs text-slate-500">
              Try another company name or ticker.
            </p>
          </div>
        ) : (
          results.map((stock, index) => (
            <motion.div
  key={stock.symbol}
  onClick={() => onSelectStock(stock.symbol)}
  role="button"
  tabIndex={0}
  initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.04 }}
              className="cursor-pointer grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 border-b border-white/[0.05] px-4 py-4 last:border-b-0 transition hover:bg-white/[0.025] sm:grid-cols-[minmax(0,1.8fr)_1fr_1fr] sm:px-5"
            >
              <div className="flex min-w-0 items-center gap-3">
                <div className="flex size-10 shrink-0 items-center justify-center rounded-xl border border-white/[0.07] bg-white/[0.035] text-[11px] font-semibold text-slate-300">
                  {stock.symbol.slice(0, 2)}
                </div>
                <div className="min-w-0">
                  <p className="truncate text-[13px] font-medium text-white">
                    {stock.symbol}
                  </p>
                  <p className="mt-1 truncate text-[11px] text-slate-500">
                    {stock.name}
                  </p>
                </div>
              </div>

              <div className="text-right">
                <p className="text-[13px] font-medium tabular-nums text-slate-200">
                  ₹{stock.price}
                </p>
                <div className="mt-1 sm:hidden">
                  <Change value={stock.change} />
                </div>
              </div>

              <div className="hidden text-right sm:block">
                <Change value={stock.change} />
              </div>
            </motion.div>
          ))
        )}

        <div className="flex items-center gap-2 border-t border-white/[0.06] px-4 py-3.5 text-[10px] leading-relaxed text-slate-600 sm:px-5">
          <Activity size={13} className="shrink-0" />
          Illustrative prices only — not live market data.
        </div>
      </div>
    </div>
  )
}


function StockDetail({
  stocks,
  symbol,
  onBack,
  watchlist,
  onToggleWatchlist,
  onBuy,
  onSell,
}: {
  stocks: {
    symbol: string
    name: string
    price: string
    change: number
    sector: string
    marketCap: string
    marketCapValue: number
    pe: number
  }[]
  symbol: string
  onBack: () => void
  watchlist: string[]
  onToggleWatchlist: (symbol: string) => void
  onBuy: () => void
  onSell: () => void
}) {

  const [tab, setTab] = useState('Overview')
  const stock = stocks.find((item) => item.symbol === symbol) ?? stocks[0]

  const tabs = ['Overview', 'Financials', 'Valuation', 'Risks']

  const handleTabChange = (nextTab: string) => {
  const currentScrollPosition = window.scrollY

  setTab(nextTab)

  requestAnimationFrame(() => {
    window.scrollTo({
      top: currentScrollPosition,
      behavior: 'auto',
    })
  })
}

  return (
    <motion.div
      key={stock.symbol}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className="stock-detail-page space-y-6"
    >
      <button
        onClick={onBack}
        className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-white"
      >
        <ArrowRight className="rotate-180" size={16} />
        Back to stocks
      </button>

      <section className="rounded-2xl border border-white/[0.08] bg-[#0e1623] p-5 sm:p-7">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex size-12 items-center justify-center rounded-xl border border-cyan-300/15 bg-cyan-300/[0.08] text-cyan-300">
              <Activity size={23} />
            </div>
            <div>
              <h1 className="text-xl font-semibold tracking-tight text-white sm:text-2xl">
                {stock.symbol}
              </h1>
              <p className="mt-1 text-sm text-slate-400">{stock.name}</p>
              <p className="mt-1 text-xs text-slate-500">NSE · Equity</p>
            </div>
          </div>

         <div className="flex w-full gap-3 sm:w-auto">
  <button
    type="button"
    onClick={onBuy}
    className="min-h-11 flex-1 rounded-xl bg-cyan-300 px-7 py-3 text-sm font-bold text-slate-950 shadow-lg shadow-cyan-300/10 transition hover:bg-cyan-200 sm:min-w-28 sm:flex-none"
  >
    Buy
  </button>

  <button
    type="button"
    onClick={onSell}
    className="min-h-11 flex-1 rounded-xl border border-rose-400/30 bg-rose-400/10 px-7 py-3 text-sm font-bold text-rose-300 transition hover:bg-rose-400/20 sm:min-w-28 sm:flex-none"
  >
    Sell
  </button>
</div>

         <button
  type="button"
  onClick={() => onToggleWatchlist(stock.symbol)}
  className="rounded-lg border border-white/10 px-3 py-2 text-sm text-slate-300 hover:border-cyan-300/30 hover:text-cyan-300"
>
  <Bookmark size={15} className="mr-2 inline" />
  {watchlist.includes(stock.symbol)
    ? 'Remove from watchlist'
    : 'Add to watchlist'}
</button>
        </div>

        <div className="mt-7">
          <div className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">
            ₹{stock.price}
          </div>
          <div
            className={`mt-2 flex items-center gap-1.5 text-sm font-medium ${
              stock.change >= 0 ? 'text-emerald-400' : 'text-rose-400'
            }`}
          >
            {stock.change >= 0 ? (
              <ArrowUpRight size={17} />
            ) : (
              <ArrowDownRight size={17} />
            )}
            {Math.abs(stock.change).toFixed(2)}% today
          </div>
          <p className="mt-2 text-xs text-slate-500">
            Illustrative demo data · Not live market prices
          </p>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {[
            ['Market', 'NSE'],
            ['Instrument', 'Equity'],
            ['Ticker', stock.symbol],
            ['Data status', 'Demo'],
          ].map(([label, value]) => (
            <div
              key={label}
              className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-3"
            >
              <p className="text-xs text-slate-500">{label}</p>
              <p className="mt-1.5 truncate text-sm font-medium text-slate-200">
                {value}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="space-y-5">
        <div className="overflow-x-auto border-b border-white/[0.08]">
          <div className="flex min-w-max gap-6">


       
{tabs.map((item) => (
  <button
    key={item}
    type="button"
    onClick={() => handleTabChange(item)}
    className={`relative py-3 text-sm font-medium ${
      tab === item
        ? 'text-cyan-300'
        : 'text-slate-500 hover:text-slate-200'
    }`}
  >
    {item}
    {tab === item && (
      <motion.div
        layoutId="stock-detail-tab"
        className="absolute inset-x-0 -bottom-px h-0.5 rounded-full bg-cyan-300"
      />
    )}
  </button>
))}


          </div>
        </div>

        {tab === 'Overview' && (
          <div className="grid gap-5 lg:grid-cols-[1.5fr_1fr]">
          <StockPriceChart
  symbol={stock.symbol}
  price={Number(stock.price.replace(/,/g, ''))}
/>

           
<div className="rounded-2xl border border-white/[0.08] bg-[#0e1623] p-5 sm:p-6">
  <div className="flex items-start justify-between gap-3">
    <div>
      <p className="text-xs font-medium uppercase tracking-wider text-cyan-300">
        SIMULATION SNAPSHOT
      </p>
      <h2 className="mt-2 text-base font-semibold text-white">
        Market Overview
      </h2>
    </div>
    <span className="rounded-full border border-cyan-300/20 bg-cyan-300/[0.07] px-2.5 py-1 text-[10px] text-cyan-200">
      Demo data
    </span>
  </div>

  <p className="mt-3 text-sm leading-6 text-slate-400">
    {stock.name} ({stock.symbol}) · {stock.sector}
  </p>

  <div className="mt-5 grid grid-cols-2 gap-3">
   <div className="rounded-xl border border-white/[0.06] bg-white/[0.025] p-3">
  <p className="text-xs text-slate-500">Market Cap</p>
  <p className="mt-2 text-sm font-semibold text-white">
    ₹{stock.marketCapValue.toLocaleString('en-IN', {
      maximumFractionDigits: 0,
    })} Cr
  </p>
  <p className="mt-1 text-xs text-cyan-300">
    {stock.marketCap} · Demo estimate
  </p>
</div>

    <div className="rounded-xl border border-white/[0.06] bg-white/[0.025] p-3">
  <p className="text-xs text-slate-500">P/E Ratio</p>
  <p className="mt-2 text-sm font-semibold text-white">
    {getCompanyResearch(stock.symbol).valuation.pe != null
      ? `${getCompanyResearch(stock.symbol).valuation.pe!.toFixed(2)}x`
      : '—'}
  </p>
  <p className="mt-1 text-xs text-cyan-300">
    Illustrative · Not verified
  </p>
</div>

    <div className="rounded-xl border border-white/[0.06] bg-white/[0.025] p-3">
      <p className="text-xs text-slate-500">Change</p>
      <p className={`mt-2 text-sm font-semibold ${
        stock.change >= 0 ? 'text-emerald-400' : 'text-rose-400'
      }`}>
        {stock.change > 0 ? '+' : ''}{stock.change.toFixed(2)}%
      </p>
    </div>

    
<div className="rounded-xl border border-white/[0.06] bg-white/[0.025] p-3">
  <p className="text-xs text-slate-500">Research Coverage</p>
  {(() => {
    const research = getCompanyResearch(stock.symbol)
    const hasFinancials =
      Object.keys(research.financials.annual).length > 0 ||
      Object.keys(research.financials.quarterly).length > 0
    const hasValuation = Object.values(research.valuation).some(
      (value) => value !== null,
    )
    const hasRisks = research.risks.length > 0

    return (
      <>
        <p className="mt-2 text-sm font-semibold text-white">
          {research.dataStatus === 'verified'
            ? 'Verified'
            : hasFinancials || hasValuation || hasRisks
              ? 'Demo data'
              : 'Not available'}
        </p>
        <p className="mt-1 text-xs text-slate-500">
          {hasFinancials || hasValuation || hasRisks
            ? 'Illustrative research only'
            : 'No research figures loaded'}
        </p>
      </>
    )
  })()}
</div>


  </div>

  <div className="mt-4 rounded-xl border border-white/[0.06] bg-white/[0.02] p-3">
    <p className="text-xs leading-5 text-slate-400">
      Prices and market movements are simulated. Market cap and valuation
      figures are illustrative unless independently verified. Research
      availability depends on the selected company.
    </p>
  </div>
</div>

          </div>
        )}

       
{tab === 'Financials' && (
  <FinancialsPanel symbol={stock.symbol} />
)}


       
{tab === 'Valuation' && (
  <ValuationPanel symbol={stock.symbol} />
)}

       {tab === 'Risks' && (
  <RisksPanel symbol={stock.symbol} />
)}
      </section>
    </motion.div>
  )
}


function FinancialsPanel({ symbol }: { symbol: string }) {
  const [period, setPeriod] = useState<'annual' | 'quarterly'>('annual')

  const research = getCompanyResearch(symbol)
  const statements = research?.financials[period] ?? {}
  const periods = Object.keys(statements).sort().reverse()

  const isDemo = research?.dataStatus !== 'verified'

 
const metrics = [
  { key: 'revenue', label: 'Revenue' },
  { key: 'operatingProfit', label: 'Operating profit (EBIT)' },
  { key: 'netProfit', label: 'Net profit' },
  { key: 'eps', label: 'Earnings per share (EPS)' },
  { key: 'totalAssets', label: 'Total assets' },
  { key: 'totalDebt', label: 'Total debt' },
  { key: 'operatingCashFlow', label: 'Operating cash flow' },
  { key: 'freeCashFlow', label: 'Free cash flow' },
  { key: 'operatingMargin', label: 'Operating margin (%)' },
  { key: 'netMargin', label: 'Net margin (%)' },
] as const


  const hasData = periods.some((date) =>
    metrics.some((metric) => statements[date]?.[metric.key] != null),
  )

  const formatValue = (value: number | null | undefined) =>
    value == null ? '—' : value.toLocaleString('en-IN', {
      maximumFractionDigits: 2,
    })

  return (
    <section className="space-y-5">
      {isDemo && (
        <div className="rounded-xl border border-amber-300/20 bg-amber-300/[0.05] p-4">
          <p className="text-sm font-semibold text-amber-200">
            SIMULATED DEMO DATA — NOT ACTUAL COMPANY RESULTS
          </p>
          <p className="mt-1 text-sm text-slate-400">
            Figures in this section are illustrative and are not verified financial
            statements. Do not use them to make investment decisions.
          </p>
        </div>
      )}

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h3 className="text-lg font-semibold text-white">
            Financial Statements
          </h3>
          <p className="mt-1 text-sm text-slate-400">
            {symbol} · {isDemo ? 'Illustrative financial data' : 'Verified financial data'}
          </p>
        </div>

        <div className="flex rounded-xl border border-white/10 bg-white/[0.03] p-1">
          <button
            onClick={() => setPeriod('annual')}
            className={`rounded-lg px-4 py-2 text-sm transition ${
              period === 'annual'
                ? 'bg-cyan-400/15 text-cyan-200'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Annual
          </button>
          <button
            onClick={() => setPeriod('quarterly')}
            className={`rounded-lg px-4 py-2 text-sm transition ${
              period === 'quarterly'
                ? 'bg-cyan-400/15 text-cyan-200'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Quarterly
          </button>
        </div>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-white/10">
        <table className="w-full min-w-[520px] text-sm">
          <thead className="bg-white/[0.03] text-left text-slate-400">
            <tr>
              <th className="px-4 py-3 font-medium">Metric</th>
              {periods.map((date) => (
                <th key={date} className="px-4 py-3 text-right font-medium">
                  {date}
                </th>
              ))}
              {!periods.length && (
                <th className="px-4 py-3 text-right font-medium">
                  Reported periods
                </th>
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-white/[0.06]">
            {metrics.map((metric) => (
              <tr key={metric.key}>
                <td className="px-4 py-3 text-slate-300">{metric.label}</td>
                {periods.map((date) => (
                  <td
                    key={date}
                    className="px-4 py-3 text-right tabular-nums text-slate-200"
                  >
                    {formatValue(statements[date]?.[metric.key])}
                  </td>
                ))}
                {!periods.length && (
                  <td className="px-4 py-3 text-right text-slate-500">
                    Unavailable
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {!hasData && (
        <div className="rounded-xl border border-white/10 bg-white/[0.02] p-4">
          <p className="text-sm font-medium text-slate-200">
            No {period} figures available
          </p>
          <p className="mt-1 text-sm text-slate-400">
            This stock has no figures for the selected period in the current
            research dataset.
          </p>
        </div>
      )}

      {hasData && (
        <p className="text-xs text-slate-500">
          {isDemo
            ? 'All figures are illustrative demo values, not reported company results.'
            : 'Verify reporting periods, units, and source disclosures before comparing companies.'}
        </p>
      )}
    </section>
  )
}

function ValuationPanel({ symbol }: { symbol: string }) {
  const research = getCompanyResearch(symbol)
  const valuation = research.valuation

  const groups = [
    {
      title: 'Valuation',
      metrics: [
        { key: 'pe', label: 'Price / Earnings (P/E)' },
        { key: 'pb', label: 'Price / Book (P/B)' },
        { key: 'evEbitda', label: 'EV / EBITDA' },
        { key: 'peg', label: 'PEG ratio' },
      ],
    },
    {
      title: 'Profitability',
      metrics: [
        { key: 'roe', label: 'Return on Equity (ROE)', suffix: '%' },
        { key: 'roce', label: 'Return on Capital (ROCE)', suffix: '%' },
        { key: 'operatingMargin', label: 'Operating margin', suffix: '%' },
        { key: 'netMargin', label: 'Net profit margin', suffix: '%' },
      ],
    },
    {
      title: 'Financial strength',
      metrics: [
        { key: 'debtEquity', label: 'Debt / Equity' },
        { key: 'interestCoverage', label: 'Interest coverage' },
        { key: 'currentRatio', label: 'Current ratio' },
        { key: 'freeCashFlow', label: 'Free cash flow' },
      ],
    },
  ] as const

  const hasData = Object.values(valuation).some(
    (value) => value !== null,
  )

  const isVerified = research.dataStatus === 'verified'
  const isDemo = hasData && !isVerified

  const formatValue = (value: number | null | undefined) =>
    value == null
      ? '—'
      : value.toLocaleString('en-IN', { maximumFractionDigits: 2 })

  return (
    <section className="space-y-5">
      <div>
        <h3 className="text-lg font-semibold text-white">
          Valuation & Financial Ratios
        </h3>
        <p className="mt-1 text-sm text-slate-400">
          {symbol} · Valuation, profitability and financial strength
        </p>
      </div>

      {isDemo && (
        <div className="rounded-xl border border-amber-300/20 bg-amber-300/[0.05] p-4">
          <p className="text-sm font-semibold text-amber-200">
            SIMULATED DEMO DATA
          </p>
          <p className="mt-1 text-sm leading-6 text-slate-400">
            These illustrative ratios are not verified company figures.
            Use them to explore the interface, not to make investment
            decisions or compare real companies.
          </p>
        </div>
      )}

      {groups.map((group) => (
        <section
          key={group.title}
          className="rounded-2xl border border-white/[0.08] bg-[#0e1623] p-5"
        >
          <h4 className="mb-4 font-semibold text-white">
            {group.title}
          </h4>

          <div className="grid gap-3 sm:grid-cols-2">
            {group.metrics.map((metric) => {
              const value =
                valuation[metric.key as keyof typeof valuation]

              return (
                <div
                  key={metric.key}
                  className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4"
                >
                  <p className="text-sm text-slate-400">
                    {metric.label}
                  </p>
                  <p className="mt-2 text-xl font-semibold tabular-nums text-white">
                    {formatValue(value)}
                    {'suffix' in metric ? metric.suffix : ''}
                  </p>
                </div>
              )
            })}
          </div>
        </section>
      ))}

      {!hasData && (
        <div className="rounded-xl border border-white/[0.08] bg-[#0e1623] p-4">
          <p className="text-sm font-medium text-white">
            No valuation figures available
          </p>
          <p className="mt-1 text-sm leading-6 text-slate-400">
            This stock's valuation profile has not been populated yet.
            Missing figures remain blank rather than being presented as
            verified or estimated company data.
          </p>
        </div>
      )}

      {hasData && (
        <p className="text-xs leading-5 text-slate-500">
          {isVerified
            ? 'Check reporting periods, units and calculation methods before comparing companies. A low ratio alone does not establish that a stock is undervalued.'
            : 'Demo figures are illustrative only. Verified reporting periods, units and calculation methods are required for meaningful company comparisons.'}
        </p>
      )}
    </section>
  )
}



function RisksPanel({ symbol }: { symbol: string }) {
  const research = getCompanyResearch(symbol)
  const risks = research.risks ?? []
  const [notes, setNotes] = useState('')

  const isVerified = research.dataStatus === 'verified'
  const hasDemoRisks = risks.length > 0 && !isVerified

  const categories = [
    {
      title: 'Business risks',
      description:
        'Competition, customer concentration, and business-model durability.',
    },
    {
      title: 'Financial risks',
      description:
        'Debt burden, cash-flow quality, liquidity, and working capital.',
    },
    {
      title: 'Governance risks',
      description:
        'Related-party transactions, auditor observations, and promoter pledging.',
    },
    {
      title: 'Industry risks',
      description:
        'Regulation, cyclicality, disruption, and changing market conditions.',
    },
  ]

  const riskLevelStyle: Record<string, string> = {
    Low: 'text-emerald-300 border-emerald-300/20 bg-emerald-300/[0.06]',
    Moderate: 'text-amber-300 border-amber-300/20 bg-amber-300/[0.06]',
    High: 'text-rose-300 border-rose-300/20 bg-rose-300/[0.06]',
    Unknown: 'text-slate-400 border-white/10 bg-white/[0.03]',
  }

  return (
    <div className="space-y-5">
      <section className="rounded-2xl border border-white/[0.08] bg-[#0e1623] p-5 sm:p-6">
        <p className="text-xs font-medium uppercase tracking-wider text-cyan-300">
          Research & due diligence
        </p>
        <h2 className="mt-2 text-xl font-semibold text-white">
          {symbol} risk review
        </h2>
        <p className="mt-2 text-sm leading-6 text-slate-400">
          Examine potential business, financial, governance, and industry risks.
          Risk scenarios are not confirmed findings unless independently verified.
        </p>
      </section>

      {hasDemoRisks && (
        <section className="rounded-xl border border-amber-300/20 bg-amber-300/[0.05] p-4">
          <p className="text-sm font-semibold text-amber-200">
            SIMULATED RISK SCENARIOS
          </p>
          <p className="mt-1 text-sm leading-6 text-slate-400">
            These illustrative examples are for demonstrating the research
            interface. They have not been established as actual risks for
            {` ${symbol}`}.
          </p>
        </section>
      )}

      {risks.length > 0 ? (
        <div className="grid gap-3 sm:grid-cols-2">
          {risks.map((risk, index) => (
            <section
              key={`${risk.category}-${index}`}
              className="rounded-2xl border border-white/[0.08] bg-[#0e1623] p-5"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h3 className="font-medium text-white">{risk.category}</h3>
                <span
                  className={`rounded-full border px-2.5 py-1 text-xs ${
                    riskLevelStyle[risk.level] ?? riskLevelStyle.Unknown
                  }`}
                >
                  {risk.level}
                </span>
              </div>

              <p className="mt-3 text-sm leading-6 text-slate-400">
                {risk.explanation}
              </p>

              {risk.source && (
                <p className="mt-3 text-xs text-slate-500">
                  Source: {risk.source}
                </p>
              )}
            </section>
          ))}
        </div>
      ) : (
        <section className="rounded-2xl border border-white/[0.08] bg-[#0e1623] p-5">
          <h3 className="font-medium text-white">
            Company-specific risk research unavailable
          </h3>
          <p className="mt-2 text-sm leading-6 text-slate-400">
            No risk profile is loaded for {symbol}. Use the checklist below
            to structure your investigation; these categories do not imply
            that the company has any particular risk.
          </p>
        </section>
      )}

      <div className="grid gap-3 sm:grid-cols-2">
        {categories.map((category) => (
          <section
            key={category.title}
            className="rounded-2xl border border-white/[0.08] bg-[#0e1623] p-5"
          >
            <h3 className="font-medium text-white">{category.title}</h3>
            <p className="mt-3 text-sm leading-6 text-slate-400">
              {category.description}
            </p>
            <p className="mt-4 border-t border-white/[0.06] pt-3 text-xs text-slate-500">
              Due-diligence checklist · Requires verification
            </p>
          </section>
        ))}
      </div>

      <section className="rounded-2xl border border-white/[0.08] bg-[#0e1623] p-5 sm:p-6">
        <h3 className="font-semibold text-white">Research notes</h3>
        <p className="mt-2 text-sm text-slate-400">
          Record questions and points to investigate about {symbol}.
        </p>
        <textarea
          value={notes}
          onChange={(event) => setNotes(event.target.value)}
          placeholder="What needs verification? What could weaken the investment thesis?"
          rows={5}
          className="mt-4 w-full resize-y rounded-xl border border-white/10 bg-[#0a101b] px-4 py-3 text-sm leading-6 text-slate-200 outline-none placeholder:text-slate-600 focus:border-cyan-300/40"
        />
        <p className="mt-2 text-xs text-slate-500">
          Notes are temporary and reset when this panel is remounted or the page reloads.
        </p>
      </section>
    </div>
  )
}



function StockScreener({
  stocks,
  onSelectStock,
}: {
  stocks: {
    symbol: string
    name: string
    price: string
    change: number
    sector: string
    marketCap: string
    marketCapValue: number
    pe: number
  }[]
  onSelectStock: (symbol: string) => void
}) {
 
 const [search, setSearch] = useState('')
const [direction, setDirection] = useState('all')
const [sector, setSector] = useState('all')
const [marketCap, setMarketCap] = useState('all')
const [maxPE, setMaxPE] = useState('')
const [sortBy, setSortBy] = useState('Default')
const [minPrice, setMinPrice] = useState('')
const [maxPrice, setMaxPrice] = useState('')

const featuredSymbols = [
  'HINDUNILVR', 'ASIANPAINT', 'TITAN', 'BAJFINANCE',
  'BAJAJFINSV', 'KOTAKBANK', 'AXISBANK', 'WIPRO',
  'HCLTECH', 'TECHM', 'POWERGRID', 'NTPC',
  'ONGC', 'COALINDIA', 'ULTRACEMCO', 'NESTLEIND',
]


const sectors = Array.from(
  new Set(stocks.map((stock) => stock.sector).filter(Boolean)),
).sort((a, b) => a.localeCompare(b))

const hasActiveCriteria =
  search.trim() !== '' ||
  direction !== 'all' ||
  sector !== 'all' ||
  marketCap !== 'all' ||
  maxPE !== '' ||
  sortBy !== 'Default' ||
  minPrice !== '' ||
  maxPrice !== ''

const stockPool = hasActiveCriteria
  ? stocks
  : stocks.filter((stock) => featuredSymbols.includes(stock.symbol))


const results = stockPool  .filter((stock) =>
    `${stock.symbol} ${stock.name}`
      .toLowerCase()
      .includes(search.toLowerCase()),
  )
  .filter((stock) => {
    if (direction === 'positive') return stock.change > 0
    if (direction === 'negative') return stock.change < 0
    return true
  })

  .filter((stock) => sector === 'all' || stock.sector === sector)
  .filter((stock) => marketCap === 'all' || stock.marketCap === marketCap)




.filter((stock) => {
  if (maxPE.trim() === '') return true

  const limit = Number(maxPE)

  if (!Number.isFinite(limit) || limit < 0) return true

  return stock.pe > 0 && stock.pe <= limit
})


.filter((stock) => {
  const price = Number(String(stock.price).replace(/,/g, ''))

  if (!Number.isFinite(price)) return false
  if (minPrice !== '' && price < Number(minPrice)) return false
  if (maxPrice !== '' && price > Number(maxPrice)) return false

  return true
})

  .sort((a, b) => {
  if (sortBy === 'Top Gainers') return b.change - a.change
  if (sortBy === 'Top Losers') return a.change - b.change
  if (sortBy === 'Name A–Z') return a.name.localeCompare(b.name)

if (sortBy === 'P/E: Low to High') {
  if (a.pe <= 0) return b.pe <= 0 ? 0 : 1
  if (b.pe <= 0) return -1
  return a.pe - b.pe
}

if (sortBy === 'P/E: High to Low') {
  if (a.pe <= 0) return b.pe <= 0 ? 0 : 1
  if (b.pe <= 0) return -1
  return b.pe - a.pe
}

  if (sortBy === 'Market Cap: High to Low') {
    return b.marketCapValue - a.marketCapValue
  }
  if (sortBy === 'Market Cap: Low to High') {
    return a.marketCapValue - b.marketCapValue
  }
  return 0
})


  return (
    <div>
      <div className="mb-8">
        <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-cyan-300/[0.14] bg-cyan-300/[0.05] px-2.5 py-1.5 text-[10px] font-medium tracking-wide text-cyan-200">
          <Activity size={12} />
          STOCK FILTERS
        </div>
        <h1 className="text-2xl font-semibold tracking-tight text-white sm:text-3xl">
          Stock Screener
        </h1>
        <p className="mt-2 max-w-xl text-sm leading-relaxed text-slate-500">
          Narrow down companies by name and daily price movement.
        </p>
      </div>

      <div className="mb-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div className="rounded-2xl border border-white/[0.07] bg-[#0e141f] p-4">
          <label className="mb-3 block text-xs font-medium text-slate-300">
            Company
          </label>
          <div className="flex h-11 items-center gap-3 rounded-xl border border-white/[0.08] bg-white/[0.025] px-3">
            <Search size={16} className="text-slate-500" />
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search name or ticker"
              className="stock-page-search min-w-0 flex-1 bg-transparent text-sm text-white outline-none placeholder:text-slate-600"
            />
          </div>
        </div>

        <div className="rounded-2xl border border-white/[0.07] bg-[#0e141f] p-4">
          <label className="mb-3 block text-xs font-medium text-slate-300">
            Daily Movement
          </label>
          <select
            value={direction}
            onChange={(event) => setDirection(event.target.value)}
            className="h-11 w-full rounded-xl border border-white/[0.08] bg-[#111827] px-3 text-sm text-slate-200 outline-none focus:border-cyan-300/40"
          >

            
            <option value="all">All Stocks</option>
            <option value="positive">Gaining Stocks</option>
            <option value="negative">Declining Stocks</option>
          </select>
        </div>

        

<div className="rounded-2xl border border-white/[0.07] bg-[#0e141f] p-4">
  <label className="mb-3 block text-xs font-medium text-slate-300">
    Market Capitalisation
  </label>
  <select
    value={marketCap}
    onChange={(event) => setMarketCap(event.target.value)}
    className="h-11 w-full rounded-xl border border-white/[0.08] bg-[#111827] px-3 text-sm text-slate-200 outline-none focus:border-cyan-300/40"
  >
  <option value="all">All Market Caps</option>
<option value="Large Cap">Large Cap</option>
<option value="Mid Cap">Mid Cap</option>
<option value="Small Cap">Small Cap</option>
  </select>
</div>

        
<div className="rounded-2xl border border-white/[0.07] bg-[#0e141f] p-4">
  <label className="mb-3 block text-xs font-medium text-slate-300">
    Sector
  </label>
  <select
    value={sector}
    onChange={(event) => setSector(event.target.value)}
    className="h-11 w-full rounded-xl border border-white/[0.08] bg-[#111827] px-3 text-sm text-slate-200 outline-none focus:border-cyan-300/40"
  >
   <option value="all">All Sectors</option>
{sectors.map((item) => (
  <option key={item} value={item}>
    {item}
  </option>
))}
  </select>
</div>

      </div>

      
<div className="mb-6 flex items-center justify-between gap-3 rounded-2xl border border-white/[0.07] bg-[#0e141f] p-4">
  <label htmlFor="screener-sort" className="text-xs font-medium text-slate-300">
    Sort results
  </label>
  <select
    id="screener-sort"
    value={sortBy}
    onChange={(event) => setSortBy(event.target.value)}
    className="max-w-[200px] rounded-xl border border-white/[0.08] bg-[#111827] px-3 py-2.5 text-xs text-slate-200 outline-none focus:border-cyan-300/40"
  >
    <option value="Default">Default Order</option>
    <option value="Top gainers">Top Gainers</option>
    <option value="Top losers">Top Losers</option>
    <option value="Name A–Z">Name A–Z</option>
    <option value="P/E: Low to High">P/E: Low to High</option>
<option value="P/E: High to Low">P/E: High to Low</option>
<option value="Market Cap: High to Low">Market Cap: High to Low</option>
<option value="Market Cap: Low to High">Market Cap: Low to High</option>
  </select>
</div>


     
<div className="mb-4">
  <h2 className="text-sm font-semibold text-white">
    Screening Results
  </h2>
  <p className="mt-1 text-xs text-slate-500">
    {results.length} companies match your filters
  </p>
</div>

<div className="mb-5 rounded-2xl border border-white/[0.07] bg-[#0e141f] p-3 sm:p-4">
 <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
    <div className="flex min-w-0 items-center gap-3 rounded-xl border border-white/10 bg-[#111827] px-3 py-3 focus-within:border-cyan-400/60">
      <label htmlFor="min-price" className="shrink-0 text-xs text-slate-400">
        Min ₹
      </label>
      <input
        id="min-price"
        type="number"
        placeholder="No Minimum"
        value={minPrice}
        onChange={(e) => setMinPrice(e.target.value)}
        min="0"
        className="w-full min-w-0 bg-transparent text-sm text-white outline-none placeholder:text-slate-500"
      />
    </div>

    <div className="flex min-w-0 items-center gap-3 rounded-xl border border-white/10 bg-[#111827] px-3 py-3 focus-within:border-cyan-400/60">
      <label htmlFor="max-price" className="shrink-0 text-xs text-slate-400">
        Max ₹
      </label>
      <input
        id="max-price"
        type="number"
        placeholder="No Maximum"
        value={maxPrice}
        onChange={(e) => setMaxPrice(e.target.value)}
        min="0"
        className="w-full min-w-0 bg-transparent text-sm text-white outline-none placeholder:text-slate-500"
      />
    </div>

    <div className="flex min-w-0 items-center gap-3 rounded-xl border border-white/10 bg-[#111827] px-3 py-3 focus-within:border-cyan-400/60">
      <label htmlFor="max-pe" className="shrink-0 text-xs text-slate-400">
        Max P/E
      </label>
      <input
        id="max-pe"
        type="number"
        placeholder="No Maximum"
        value={maxPE}
      onChange={(e) => {
  const value = e.target.value
  if (value === '' || Number(value) >= 0) {
    setMaxPE(value)
  }
}}
        min="0"
        step="0.1"
        className="w-full min-w-0 bg-transparent text-sm text-white outline-none placeholder:text-slate-500"
      />
    </div>
    <button
    type="button"
    onClick={() => {
      setSearch('')
      setDirection('all')
      setSector('all')
      setMarketCap('all')
      setSortBy('Default')
      setMinPrice('')
      setMaxPrice('')
      setMaxPE('')
    }}
    className="w-full rounded-xl border border-white/10 px-4 py-3 text-sm font-medium text-slate-300 transition hover:border-cyan-300/30 hover:bg-cyan-300/[0.05] hover:text-cyan-200"
  >
    Reset all filters
  </button>
  </div>
</div>










     
<div className="overflow-hidden rounded-2xl border border-white/[0.07] bg-[#0e141f]">
  {results.length === 0 ? (
    <div className="px-5 py-12 text-center text-sm text-slate-400">
      No companies match these filters.
    </div>
  ) : (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[620px] text-left">
        <thead>
          <tr className="border-b border-white/[0.07] bg-white/[0.02]">
            <th className="px-5 py-4 text-[10px] font-medium uppercase tracking-wider text-slate-500">
              Symbol
            </th>
            <th className="px-5 py-4 text-[10px] font-medium uppercase tracking-wider text-slate-500">
              Company
            </th>
            <th className="px-5 py-4 text-right text-[10px] font-medium uppercase tracking-wider text-slate-500">
              Price
            </th>
            <th className="px-5 py-4 text-right text-[10px] font-medium uppercase tracking-wider text-slate-500">
              Daily change
            </th>
            <th className="px-5 py-4 text-right text-[10px] font-medium uppercase tracking-wider text-slate-500">
              Action
            </th>
          </tr>
        </thead>

        <tbody>
          {results.map((stock) => (
            <tr
              key={stock.symbol}
              className="border-b border-white/[0.05] transition hover:bg-white/[0.025] last:border-b-0"
            >
              <td className="px-5 py-4">
                <span className="text-sm font-semibold text-cyan-300">
                  {stock.symbol}
                </span>
              </td>

              <td className="max-w-[240px] px-5 py-4">
                <span className="block truncate text-sm text-slate-300">
                  {stock.name}
                </span>
              </td>

              <td className="whitespace-nowrap px-5 py-4 text-right text-sm tabular-nums text-white">
                ₹{stock.price}
              </td>

              <td className="whitespace-nowrap px-5 py-4 text-right">
                <Change value={stock.change} />
              </td>

              <td className="px-5 py-4 text-right">
                <button
                  type="button"
                  onClick={() => onSelectStock(stock.symbol)}
                  className="rounded-lg border border-cyan-300/15 bg-cyan-300/[0.06] px-3 py-2 text-xs font-medium text-cyan-300 transition hover:border-cyan-300/40 hover:bg-cyan-300/10"
                >
                  Research
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )}

  <div className="border-t border-white/[0.06] px-4 py-3 text-[10px] text-slate-600 sm:px-5">
    Illustrative data only · Not live market data
  </div>
</div>






    </div>
  )
}


function Watchlists({
  stocks,
  watchlist,
  onToggleWatchlist,
  onSelectStock,
  onExplore,
}: {
  stocks: {
    symbol: string
    name: string
    price: string
    change: number
    sector: string
    marketCap: string
    pe: number
  }[]
  watchlist: string[]
  onToggleWatchlist: (symbol: string) => void
  onSelectStock: (symbol: string) => void
  onExplore: () => void
}) {
  
  const savedStocks = stocks.filter((stock) =>
    watchlist.includes(stock.symbol)
  )

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm text-cyan-300">YOUR RESEARCH</p>
        <h1 className="mt-2 text-3xl font-semibold text-white">
          Watchlists
        </h1>
        <p className="mt-2 text-sm text-slate-400">
          Keep your favourite companies close and track them in one place.
        </p>
      </div>

      <div className="rounded-2xl border border-white/10 bg-[#121a2e] p-5">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-sm text-slate-400">Saved Companies</p>
            <p className="mt-1 text-3xl font-semibold text-white">
              {savedStocks.length.toString().padStart(2, '0')}
            </p>
          </div>
          <Bookmark size={26} className="text-cyan-300" />
        </div>
      </div>

      {savedStocks.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-white/15 bg-[#121a2e]/60 px-6 py-12 text-center">
          <Bookmark
            size={32}
            className="mx-auto text-slate-500"
          />
          <h2 className="mt-4 text-lg font-medium text-white">
            Your watchlist is empty
          </h2>
          <p className="mx-auto mt-2 max-w-sm text-sm text-slate-400">
            Explore companies and add stocks you want to research later.
          </p>
          <button
            type="button"
            onClick={onExplore}
            className="mt-5 rounded-xl bg-cyan-300 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-200"
          >
            Discover stocks
          </button>
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-white/10 bg-[#121a2e]">
          <div className="border-b border-white/10 px-5 py-4">
            <h2 className="font-medium text-white">Saved Companies</h2>
          </div>

          {savedStocks.map((stock) => (
            <div
              key={stock.symbol}
              className="flex items-center justify-between gap-3 border-b border-white/5 px-5 py-4 last:border-b-0"
            >
              <button
                type="button"
                onClick={() => onSelectStock(stock.symbol)}
                className="min-w-0 flex-1 text-left"
              >
                <p className="font-medium text-white">
                  {stock.symbol}
                </p>
                <p className="mt-1 truncate text-sm text-slate-400">
                  {stock.name}
                </p>
              </button>

              <div className="text-right">
                <p className="font-medium text-white">
                  ₹{stock.price}
                </p>
                <p
                  className={`mt-1 text-sm ${
                    stock.change >= 0
                      ? 'text-emerald-400'
                      : 'text-rose-400'
                  }`}
                >
                  {stock.change > 0 ? '+' : ''}
                  {stock.change}%
                </p>
              </div>

              <button
                type="button"
                onClick={() => onToggleWatchlist(stock.symbol)}
                aria-label={`Remove ${stock.symbol} from watchlist`}
                className="ml-2 rounded-lg p-2 text-slate-400 transition hover:bg-rose-400/10 hover:text-rose-400"
              >
                <Bookmark size={18} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}



function ProfileSettings({
  profileName,
  setProfileName,
  profileEmail,
  onSignOut,
  onSaveProfile,
}: {
  profileName: string
  setProfileName: (name: string) => void
  profileEmail: string
  onClose: () => void
  onSignOut: () => Promise<void>
  onSaveProfile: () => Promise<void>
}) {


  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <p className="text-sm text-cyan-300">YOUR ACCOUNT</p>
        <h1 className="mt-2 text-3xl font-semibold text-white">
          Profile & Settings
        </h1>
        <p className="mt-2 text-sm text-slate-400">
          Personalise your Tavrixa workspace.
        </p>
      </div>

      <div className="rounded-2xl border border-white/10 bg-[#121a2e] p-6">
        <div className="flex items-center gap-4 border-b border-white/10 pb-6">
          <div className="flex size-14 items-center justify-center rounded-2xl border border-cyan-300/20 bg-cyan-300/10 text-xl font-semibold text-cyan-200">
            {profileName.trim().charAt(0).toUpperCase() || 'M'}
          </div>
          <div>
            <h2 className="text-lg font-medium text-white">
              Personal Profile
            </h2>
            <p className="text-sm text-slate-400">
              Manage your display details
            </p>
          </div>
        </div>

        <div className="mt-6 space-y-5">
          <div>
            <label className="mb-2 block text-sm text-slate-300">
              Name
            </label>
            <input
              value={profileName}
              onChange={(event) => setProfileName(event.target.value)}
              placeholder="Enter your display name"
              maxLength={40}
              className="w-full rounded-xl border border-white/10 bg-[#0b1019] px-4 py-3 text-sm text-white outline-none transition focus:border-cyan-300/40"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm text-slate-300">
              Email
            </label>


           <input
  type="email"
  value={profileEmail}
  readOnly
  placeholder="Your account email"
  className="w-full cursor-not-allowed rounded-xl border border-white/10 bg-[#0b1019] px-4 py-3 text-sm text-slate-400 outline-none"
/>
<p className="mt-2 text-xs text-slate-500">
  Your email address is linked to your Tavrixa sign-in account.
</p>

            
          </div>
        </div>



 
<div className="mt-6 flex items-center justify-between gap-3">
  <button
    type="button"
    onClick={() => void onSignOut()}
    className="rounded-xl border border-red-400/20 bg-red-400/[0.06] px-5 py-3 text-sm font-medium text-red-300 transition hover:bg-red-400/[0.12]"
  >
    Sign Out
  </button>

  <button
    type="button"
    onClick={() => void onSaveProfile()}
    className="flex items-center gap-2 rounded-xl bg-cyan-300 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-200"
  >
    <Save size={16} />
    Save
  </button>
</div>



      </div>
    </div>
  )
}



function AboutTavrixa() {
  const features = [
    {
      number: '01',
      title: 'Stock Research',
      description:
        'Explore companies, financial fundamentals, valuation metrics and business quality in one focused workspace.',
      icon: Search,
      accent: 'from-cyan-400/20 to-blue-500/5',
      glow: 'group-hover:shadow-cyan-400/10',
      label: 'DISCOVER',
    },
    {
      number: '02',
      title: 'Market Intelligence',
      description:
        'Connect market movements, sector trends and stock-level insights to build a clearer picture of the market.',
      icon: Activity,
      accent: 'from-violet-400/20 to-fuchsia-500/5',
      glow: 'group-hover:shadow-violet-400/10',
      label: 'UNDERSTAND',
    },
    {
      number: '03',
      title: 'Paper Trading',
      description:
        'Practise trade decisions with virtual capital, track positions and evaluate outcomes without risking real money.',
      icon: Wallet,
      accent: 'from-emerald-400/20 to-teal-500/5',
      glow: 'group-hover:shadow-emerald-400/10',
      label: 'SIMULATE',
    },
    {
      number: '04',
      title: 'Portfolio Analytics',
      description:
        'Examine allocation, performance and risk to better understand how individual decisions shape a portfolio.',
      icon: ChartNoAxesCombined,
      accent: 'from-amber-400/20 to-orange-500/5',
      glow: 'group-hover:shadow-amber-400/10',
      label: 'EVALUATE',
    },
  ]

  const technologyGroups = [
    {
      title: 'Frontend',
       status: 'LIVE',
      technologies: ['React', 'TypeScript', 'Vite', 'Tailwind CSS'],
    },
    {
      title: 'Interface & Visuals',
        status: 'ACTIVE',
      technologies: ['Lucide Icons', 'Motion', 'Three.js'],
    },
    {
      title: 'Backend & Database',
     status: 'CONNECTED',
      technologies: ['Supabase', 'PostgreSQL', 'Authentication'],
    },
    {
      title: 'Deployment',
      status: 'ONLINE',
      technologies: ['Production Hosting', 'Environment Configuration'],
    },
  ]

  const team = [
    { number: '01', name: 'Mehdi Hussain Choudhury', initials: 'MHC' },
    { number: '02', name: 'Eakbal Hussain Mozumdar', initials: 'EHM' },
    { number: '03', name: 'Afsar Uddin Laskar', initials: 'AUL' },
    { number: '04', name: 'Abu Numan Talukdar', initials: 'ANT' },
    { number: '05', name: 'Mufidul Hasan Barbhuiya', initials: 'MHB' },
  ]

  return (
 <div className="about-tavrixa mx-auto max-w-6xl space-y-10 pb-6">
      {/* HERO */}
      <section className="group relative isolate overflow-hidden rounded-3xl border border-cyan-300/15 bg-[#0b1220] p-7 sm:p-12">
        <div className="pointer-events-none absolute -right-20 -top-24 -z-10 size-80 rounded-full bg-cyan-400/[0.12] blur-[90px] transition duration-700 group-hover:bg-cyan-400/[0.18]" />
        <div className="pointer-events-none absolute -bottom-32 left-1/3 -z-10 size-72 rounded-full bg-violet-500/[0.08] blur-[90px]" />

        <div className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.28em] text-cyan-300 sm:text-xs">
          <span className="size-1.5 rounded-full bg-cyan-300 shadow-[0_0_12px_rgba(103,232,249,0.8)]" />
          THE TAVRIXA PROJECT
        </div>

       <h2 className="mt-3 text-4xl font-black tracking-[-0.06em] text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-sky-400 to-violet-400 drop-shadow-[0_0_28px_rgba(56,189,248,0.25)] sm:text-5xl lg:text-7xl">
  Tavrixa.
</h2>
        <p className="mt-3 text-sm font-medium tracking-[0.12em] text-slate-400 sm:text-base">
          Clarity in every move.
        </p>

        <p className="mt-6 max-w-2xl text-sm leading-7 text-slate-300 sm:text-base sm:leading-8">
          A student-developed stock research and investing platform concept
          bringing company analysis, market intelligence, simulated trading
          and portfolio insights into one connected workspace.
        </p>

        <div className="mt-8 flex flex-wrap items-center gap-3">
          <span className="inline-flex items-center gap-2 rounded-full border border-cyan-300/20 bg-cyan-300/[0.07] px-4 py-2 text-xs text-cyan-200">
            <span className="size-1.5 rounded-full bg-cyan-300" />
            Academic Project · 2026
          </span>
          <span className="rounded-full border border-white/[0.08] bg-white/[0.03] px-4 py-2 text-xs text-slate-400">
            Research · Simulate · Learn
          </span>
        </div>

        <div className="pointer-events-none absolute bottom-7 right-8 hidden select-none font-mono text-[10px] tracking-[0.35em] text-cyan-300/[0.12] sm:block">
          MHCx / 026
        </div>
      </section>

      {/* PURPOSE */}
     <section className="space-y-3">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-cyan-300">
            OUR DIRECTION
          </p>
                   <h2 className="mt-3 max-w-3xl text-3xl font-bold leading-tight tracking-[-0.04em] text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-200 to-cyan-300 sm:text-4xl lg:text-5xl">
            Research beyond the numbers.
          </h2>
          <div className="mt-4 h-1 w-16 rounded-full bg-gradient-to-r from-cyan-300 to-blue-500" />
        </div>

       <div className="mt-4 rounded-2xl border border-cyan-300/10 bg-gradient-to-br from-cyan-300/[0.06] via-white/[0.025] to-transparent p-5 sm:p-6">
  <p className="text-sm leading-7 text-slate-300">
    A price alone rarely tells the whole story. Tavrixa brings company
    fundamentals, valuation, market behaviour and portfolio simulation
    into one focused workspace — helping turn scattered information
    into more structured investment research.
  </p>
</div>
      </section>

      {/* FOUR FEATURE CARDS */}
      <section>
        <div className="mb-5 flex items-end justify-between gap-4">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.23em] text-slate-500">
              THE WORKSPACE
            </p>
           <h2 className="mt-3 max-w-3xl text-2xl font-bold leading-tight tracking-[-0.04em] text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-200 to-cyan-300 sm:text-3xl lg:text-4xl">
  Four parts. One perspective.
</h2>
<div className="mt-4 h-1 w-16 rounded-full bg-gradient-to-r from-cyan-300 to-blue-500" />
          </div>
          <span className="font-mono text-xs text-slate-600">01 — 04</span>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          {features.map((feature) => {
            const Icon = feature.icon

            return (
              <div
                key={feature.number}
                className={`group relative isolate overflow-hidden rounded-2xl border border-white/[0.08] bg-[#101827] p-5 transition-all duration-300 hover:-translate-y-1 hover:border-white/[0.16] hover:shadow-xl ${feature.glow} sm:p-6`}
              >
                <div
                  className={`pointer-events-none absolute -right-12 -top-16 -z-10 size-48 rounded-full bg-gradient-to-br ${feature.accent} opacity-60 blur-3xl transition duration-500 group-hover:scale-125 group-hover:opacity-100`}
                />

                <div className="flex items-start justify-between gap-3">
                  <div
                    className={`flex size-12 items-center justify-center rounded-xl border border-white/[0.08] bg-gradient-to-br ${feature.accent} text-white transition-transform duration-300 group-hover:scale-105`}
                  >
                    <Icon size={21} strokeWidth={1.7} />
                  </div>
                  <span className="font-mono text-xs text-slate-600">
                    {feature.number}
                  </span>
                </div>

                <p className="mt-6 text-[9px] font-semibold tracking-[0.23em] text-cyan-300/70">
                  {feature.label}
                </p>
                <h3 className="mt-2 text-lg font-semibold text-white">
                  {feature.title}
                </h3>
                <p className="mt-2 text-sm leading-6 text-slate-400">
                  {feature.description}
                </p>

                <div className="mt-5 h-px w-full bg-gradient-to-r from-white/[0.12] via-white/[0.04] to-transparent transition-colors group-hover:from-cyan-300/40" />
              </div>
            )
          })}
        </div>
      </section>

      {/* TECHNOLOGY */}
      <section className="relative overflow-hidden rounded-3xl border border-white/[0.08] bg-[#0e1523] p-6 sm:p-8">
        <div className="pointer-events-none absolute -right-20 -top-24 size-64 rounded-full bg-blue-500/[0.08] blur-[80px]" />

        <div className="relative">
          <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-cyan-300">
            UNDER THE HOOD
          </p>
         <h2 className="mt-3 text-xl font-semibold tracking-wide text-slate-200 sm:text-2xl">
  Powered by <span className="font-mono font-medium text-cyan-300">modern technology.</span>
</h2>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-400">
           Built with modern frontend technologies, immersive visualisation,
  data-driven research tools and a cloud-powered backend architecture.
          </p>

          <div className="mt-7 grid gap-3 sm:grid-cols-2">

            {technologyGroups.map((group) => (        
              <div
                key={group.title}
                className="rounded-2xl border border-white/[0.07] bg-white/[0.025] p-4 transition duration-300 hover:border-cyan-300/20 hover:bg-white/[0.04] sm:p-5"
              >
                <div className="flex items-center justify-between gap-3">
                  <h3 className="text-sm font-semibold text-slate-100">
                    {group.title}
                  </h3>
                  <span
                    className={`rounded-full border px-2 py-1 text-[9px] font-semibold tracking-wider ${
                     group.status === 'CONNECTED' || group.status === 'ONLINE'
  ? 'border-cyan-300/20 bg-cyan-300/[0.06] text-cyan-300'
  : 'border-emerald-300/15 bg-emerald-300/[0.06] text-emerald-300'
                    }`}
                  >
                    {group.status}
                  </span>
                </div>

                <div className="mt-4 flex flex-wrap gap-2">
                  {group.technologies.map((technology) => (
                    <span
                      key={technology}
                      className="rounded-lg border border-white/[0.07] bg-[#090f19] px-2.5 py-2 text-xs text-slate-300"
                    >
                      {technology}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* TEAM */}
    <section className="about-team relative overflow-hidden rounded-3xl border border-white/[0.08] bg-gradient-to-br from-[#111d2c] via-[#0e1625] to-[#0a101a] p-6 sm:p-8">
        <div className="pointer-events-none absolute -bottom-24 -left-20 size-64 rounded-full bg-cyan-400/[0.06] blur-[80px]" />

        <div className="relative mb-7 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-cyan-300">
              THE PEOPLE
            </p>
           <h2 className="mt-3 text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl">
  The Project <span className="text-cyan-300">Team.</span>
</h2>
            <p className="mt-2 text-sm text-slate-400">
              Built collaboratively by five BVoc IT students.
            </p>
          </div>

          <span className="w-fit rounded-full border border-white/[0.08] bg-white/[0.03] px-3 py-2 font-mono text-[10px] tracking-widest text-slate-400">
            TEAM C / 2026
          </span>
        </div>

        <div className="relative grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {team.map((member) => (
            <div
              key={member.number}
              className="group relative overflow-hidden rounded-2xl border border-white/[0.07] bg-[#0a111d]/80 p-5 transition-all duration-300 hover:-translate-y-1 hover:border-cyan-300/25 hover:bg-cyan-300/[0.025]"
            >
              <div className="pointer-events-none absolute -right-8 -top-8 size-24 rounded-full bg-cyan-300/[0.04] blur-2xl transition group-hover:bg-cyan-300/[0.12]" />

              <div className="flex items-center justify-between">
                <div className="flex size-12 items-center justify-center rounded-xl border border-cyan-300/20 bg-gradient-to-br from-cyan-300/15 to-blue-500/[0.03] font-mono text-xs font-bold tracking-wider text-cyan-200 transition group-hover:border-cyan-300/40">
                  {member.initials}
                </div>
                <span className="font-mono text-[10px] tracking-[0.2em] text-slate-600 group-hover:text-cyan-300/70">
                  / {member.number}
                </span>
              </div>

              <h3 className="relative mt-5 min-h-12 text-sm font-semibold leading-6 text-slate-100">
                {member.name}
              </h3>

              <div className="mt-4 h-px bg-gradient-to-r from-cyan-300/30 via-white/[0.05] to-transparent" />

              <p className="mt-3 text-[9px] uppercase tracking-[0.18em] text-slate-500">
                BVIT · Team C
              </p>
            </div>
          ))}
        </div>

        <p className="relative mt-6 text-center text-xs text-slate-500">
          NC College, Badarpur · Academic Project · 2026
        </p>
      </section>

      {/* DISCLOSURE */}
      <section className="rounded-2xl border border-amber-300/10 bg-amber-300/[0.025] p-5 sm:p-6">
        <div className="flex items-start gap-3">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-xl border border-amber-300/15 bg-amber-300/[0.05] text-amber-200">
            <span className="text-lg">ⓘ</span>
          </div>
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-amber-200/80">
              IMPORTANT INFORMATION
            </p>
            <h3 className="mt-2 font-semibold text-white">
              Educational use and data disclosure
            </h3>
            <p className="mt-3 text-xs leading-6 text-slate-400 sm:text-sm">
              Tavrixa is an academic stock research and portfolio simulation
              project, not a brokerage or investment advisory service. Market
              data, prices, analytics and research outputs may be simulated,
              delayed, incomplete or inaccurate. Paper trades and strategy
              calculations are hypothetical and do not represent actual
              transactions or guarantee future results. Information provided
              is for educational purposes only and is not personalized
              financial advice or a recommendation to buy or sell securities.
              Verify data independently before making investment decisions.
            </p>
          </div>
        </div>
      </section>

      {/* FOOTER + SUBTLE PERSONAL SIGNATURE */}
      <footer className="group relative pb-2 pt-2 text-center">
        <div className="mx-auto mb-4 h-px max-w-xs bg-gradient-to-r from-transparent via-white/10 to-transparent" />
        <p className="text-xs text-slate-500">
          Tavrixa <span className="text-cyan-300">·</span> Clarity in every move
        </p>
        <p className="mt-2 text-[10px] text-slate-600">
          An academic project by Team C · 2026
        </p>
        <p
          title="MHCx — maker's mark"
          className="mt-3 select-none font-mono text-[9px] tracking-[0.35em] text-cyan-300/[0.15] transition duration-500 group-hover:text-cyan-300/70"
        >
          MHCx · / 026
        </p>
      </footer>
    </div>
  )
}



function TavrixaSettings({
  theme,
  setTheme,
}: {
  theme: string
  setTheme: (value: string) => void
}) {
  const [tradeSound, setTradeSound] = useState(
    () => localStorage.getItem('tavrixa-trade-sound') !== 'false'
  )
  const [notifications, setNotifications] = useState(
    () => localStorage.getItem('tavrixa-notifications') !== 'false'
  )

  const saveTheme = (value: string) => {
  setTheme(value)
  localStorage.setItem('tavrixa-theme', value)
}

  const saveTradeSound = (value: boolean) => {
    setTradeSound(value)
    localStorage.setItem('tavrixa-trade-sound', String(value))
  }

  const saveNotifications = (value: boolean) => {
    setNotifications(value)
    localStorage.setItem('tavrixa-notifications', String(value))
  }

  return (
    <div className="mx-auto max-w-5xl space-y-8">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-300">
          PREFERENCES
        </p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-white">
          Settings
        </h1>
        <p className="mt-2 text-sm text-slate-400">
          Personalise your Tavrixa workspace.
        </p>
      </div>

      <section className="rounded-2xl border border-white/[0.08] bg-[#121a2e] p-6">
        <div className="flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-xl bg-cyan-300/[0.08] text-cyan-300">
            <Sparkles size={20} />
          </div>
          <div>
            <h2 className="font-semibold text-white">Appearance</h2>
            <p className="text-sm text-slate-400">
              Choose your preferred workspace theme.
            </p>
          </div>
        </div>

        <div className="mt-5 grid gap-3 sm:grid-cols-3">
          {[
            { value: 'dark', label: 'Dark', description: 'The current Tavrixa look', icon: 'moon' },
            { value: 'light', label: 'Light', description: 'A brighter workspace', icon: 'sun' },
            { value: 'system', label: 'System', description: 'Follow your device', icon: 'monitor' },
          ].map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => saveTheme(option.value)}
              className={`rounded-xl border p-4 text-left transition ${
                theme === option.value
                  ? 'border-cyan-300/40 bg-cyan-300/[0.07]'
                  : 'border-white/[0.08] bg-white/[0.02] hover:border-white/20'
              }`}
            >
              <span className="flex items-center justify-between">
                <span className="font-medium text-white">{option.label}</span>
                <span className={`size-3 rounded-full border ${
                  theme === option.value
                    ? 'border-cyan-300 bg-cyan-300'
                    : 'border-slate-500'
                }`} />
              </span>
              <span className="mt-2 block text-xs text-slate-400">
                {option.description}
              </span>
            </button>
          ))}
        </div>
        <p className="mt-3 text-xs text-slate-500">
          Theme selection is saved. Applying Light and System themes across the
          entire interface will be connected in a later step.
        </p>
      </section>

      <section className="rounded-2xl border border-white/[0.08] bg-[#121a2e] p-6">
        <h2 className="font-semibold text-white">Trading Preferences</h2>
        <p className="mt-1 text-sm text-slate-400">
          Adjust the feedback you receive when using paper trading.
        </p>

        <label className="mt-5 flex cursor-pointer items-center justify-between gap-4">
          <span>
            <span className="block text-sm font-medium text-slate-200">
              Trade Confirmation Sound
            </span>
            <span className="mt-1 block text-xs text-slate-500">
              Play a short tone after a successful order.
            </span>
          </span>
          <input
            type="checkbox"
            checked={tradeSound}
            onChange={(event) => saveTradeSound(event.target.checked)}
            className="size-5 accent-cyan-300"
          />
        </label>
      </section>

      <section className="rounded-2xl border border-white/[0.08] bg-[#121a2e] p-6">
        <h2 className="font-semibold text-white">Notifications</h2>
        <p className="mt-1 text-sm text-slate-400">
          Set your preference for in-app notifications.
        </p>

        <label className="mt-5 flex cursor-pointer items-center justify-between gap-4">
          <span>
            <span className="block text-sm font-medium text-slate-200">
              In-app Notifications
            </span>
            <span className="mt-1 block text-xs text-slate-500">
              Preference for app messages and notifications.
            </span>
          </span>
          <input
            type="checkbox"
            checked={notifications}
            onChange={(event) => saveNotifications(event.target.checked)}
            className="size-5 accent-cyan-300"
          />
        </label>
      </section>

      <section className="rounded-2xl border border-white/[0.08] bg-[#121a2e] p-6">
        <h2 className="font-semibold text-white">Data & Privacy</h2>
        <p className="mt-2 text-sm leading-6 text-slate-400">
          Your current paper-trading balance, holdings, trade history,
          watchlist and preferences are stored in this browser. They are
          not a shared account or a server-synchronised portfolio.
        </p>
        <div className="mt-4 rounded-xl border border-amber-300/15 bg-amber-300/[0.04] p-4">
         <p className="demonstration-data-title text-sm font-medium text-amber-200">
  Demonstration Data
</p>
          <p className="mt-1 text-xs leading-5 text-slate-400">
            Stock prices are illustrative and are not live market quotes.
            Paper trading does not place real orders.
          </p>
        </div>
      </section>
    </div>
  )
}



function PaperTrading({
  userId,
  initialSymbol = 'RELIANCE',
}: {
  userId: string
  initialSymbol?: string
  initialSide?: 'BUY' | 'SELL'
}) {



  type Holding = {
    symbol: string
    name: string
    quantity: number
    avgPrice: number
  }

  type Trade = {
    id: number
    side: 'BUY' | 'SELL'
    symbol: string
    quantity: number
    price: number
    total: number
    date: string
  }

 const demoStocks = getSimulatedStocks()

  const money = (value: number) =>
    `₹${value.toLocaleString('en-IN', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`

  const [cash, setCash] = useState<number>(() => {
    const saved = localStorage.getItem('tavrixa-paper-cash')
    return saved !== null && Number.isFinite(Number(saved)) && Number(saved) >= 0
      ? Number(saved)
      : 1000000
  })

  const [holdings, setHoldings] = useState<Holding[]>(() => {
    try {
      return JSON.parse(localStorage.getItem('tavrixa-paper-holdings') || '[]')
    } catch {
      return []
    }
  })

  const [trades, setTrades] = useState<Trade[]>(() => {
    try {
      return JSON.parse(localStorage.getItem('tavrixa-paper-trades') || '[]')
    } catch {
      return []
    }
  })

  const [portfolioLoaded, setPortfolioLoaded] = useState(false)

  const [, setMarketVersion] = useState(0)

 
const [symbol, setSymbol] = useState(initialSymbol)
const [quantity, setQuantity] = useState('1')
const [side, setSide] = useState<'BUY' | 'SELL'>('BUY')
const [isOrderReviewOpen, setIsOrderReviewOpen] = useState(false)

  const [message, setMessage] = useState('')
  const [messageType, setMessageType] = useState<'success' | 'error'>('success')
  const [lastExecutedTrade, setLastExecutedTrade] = useState<Trade | null>(null)




  useEffect(() => {
    let cancelled = false

    async function loadPortfolio() {
      try {
        // Read the existing browser portfolio for a one-time import.
        const savedCash = localStorage.getItem('tavrixa-paper-cash')
        const legacyCash =
          savedCash !== null &&
          Number.isFinite(Number(savedCash)) &&
          Number(savedCash) >= 0
            ? Number(savedCash)
            : 1000000

        const readArray = <T,>(key: string): T[] => {
          try {
            const value = JSON.parse(localStorage.getItem(key) || '[]')
            return Array.isArray(value) ? value : []
          } catch {
            return []
          }
        }

        const legacyHoldings = readArray<Holding>(
          'tavrixa-paper-holdings',
        )
        const legacyTrades = readArray<Trade>(
          'tavrixa-paper-trades',
        )

        // Check whether this user's cloud account already exists.
        const existingAccount = await supabase
          .from('paper_trading_accounts')
          .select('cash')
          .eq('user_id', userId)
          .maybeSingle()

        if (existingAccount.error) throw existingAccount.error

        // Import the browser portfolio only for a new cloud account.
        if (!existingAccount.data) {
          const migration = await supabase.rpc(
            'import_legacy_paper_trading',
            {
              p_cash: legacyCash,
              p_holdings: legacyHoldings,
              // Existing history is newest-first; reverse insertion
              // so descending database IDs retain that display order.
              p_trades: [...legacyTrades].reverse(),
            },
          )

          if (migration.error) throw migration.error
        }

        // Load the authoritative cloud account and portfolio.
        const [accountResult, holdingsResult, tradesResult] =
          await Promise.all([
            supabase
              .from('paper_trading_accounts')
              .select('cash')
              .eq('user_id', userId)
              .single(),

            supabase
              .from('paper_trading_holdings')
              .select('symbol, name, quantity, avg_price')
              .eq('user_id', userId),

            supabase
              .from('paper_trading_trades')
              .select(
                'id, side, symbol, quantity, price, total, legacy_date, traded_at',
              )
              .eq('user_id', userId)
              .order('id', { ascending: false }),
          ])

        if (accountResult.error) throw accountResult.error
        if (holdingsResult.error) throw holdingsResult.error
        if (tradesResult.error) throw tradesResult.error

        if (cancelled) return

        setCash(Number(accountResult.data.cash))

        setHoldings(
          (holdingsResult.data ?? []).map((holding) => ({
            symbol: holding.symbol,
            name: holding.name,
            quantity: Number(holding.quantity),
            avgPrice: Number(holding.avg_price),
          })),
        )

        setTrades(
          (tradesResult.data ?? []).map((trade) => ({
            id: Number(trade.id),
            side: trade.side as Trade['side'],
            symbol: trade.symbol,
            quantity: Number(trade.quantity),
            price: Number(trade.price),
            total: Number(trade.total),
            date:
              trade.legacy_date ??
              new Date(trade.traded_at).toLocaleString('en-IN'),
          })),
        )

        setPortfolioLoaded(true)
      } catch (error) {
        console.error('Failed to load paper-trading portfolio:', error)

        if (!cancelled) {
          setMessageType('error')
          setMessage(
            'Could not load your cloud portfolio. Your existing browser data has been preserved.',
          )
        }
      }
    }

    void loadPortfolio()

    return () => {
      cancelled = true
    }
  }, [userId])

 
  const playTradeSound = async () => {
    let audio: AudioContext | undefined

    try {
      audio = new AudioContext()
      await audio.resume()

      const start = audio.currentTime
      const notes = [660, 830, 1046.5]

      notes.forEach((frequency, index) => {
        const oscillator = audio!.createOscillator()
        const gain = audio!.createGain()
        const noteStart = start + index * 0.14

        oscillator.type = 'sine'
        oscillator.frequency.setValueAtTime(frequency, noteStart)

        gain.gain.setValueAtTime(0.0001, noteStart)
        gain.gain.linearRampToValueAtTime(0.055, noteStart + 0.025)
        gain.gain.exponentialRampToValueAtTime(
          0.0001,
          noteStart + 0.2,
        )

        oscillator.connect(gain)
        gain.connect(audio!.destination)

        oscillator.start(noteStart)
        oscillator.stop(noteStart + 0.22)
      })

      window.setTimeout(() => {
        if (audio && audio.state !== 'closed') {
          void audio.close()
        }
      }, 700)
    } catch {
      if (audio && audio.state !== 'closed') {
        void audio.close().catch(() => {})
      }
    }
  }


 useEffect(() => {
  if (!portfolioLoaded) return
  localStorage.setItem('tavrixa-paper-cash', String(cash))
}, [cash, portfolioLoaded])

 useEffect(() => {
  if (!portfolioLoaded) return
  localStorage.setItem('tavrixa-paper-holdings', JSON.stringify(holdings))
}, [holdings, portfolioLoaded])

useEffect(() => {
  if (!portfolioLoaded) return
  localStorage.setItem('tavrixa-paper-trades', JSON.stringify(trades))
}, [trades, portfolioLoaded])

  useEffect(() => {
  return subscribeToMarket(() => {
    setMarketVersion((version) => version + 1)
  })
}, [])

const selectedStock = getSimulatedStock(symbol)
const orderQuantity = Number(quantity)
const orderTotal = (selectedStock?.price ?? 0) * orderQuantity

  
const currentHoldingQuantity =
  holdings.find((holding) => holding.symbol === symbol)?.quantity ?? 0

const orderProblem =
  !selectedStock
    ? 'Select a valid stock from the list.'
    : !Number.isSafeInteger(orderQuantity) || orderQuantity < 1
      ? 'Enter a whole-number quantity of at least 1.'
      : side === 'BUY' && orderTotal > cash
        ? 'Insufficient virtual cash for this order.'
        : side === 'SELL' && orderQuantity > currentHoldingQuantity
          ? `You only own ${currentHoldingQuantity} ${symbol} shares.`
          : ''


const canConfirmOrder = orderProblem === ''



  const investedValue = holdings.reduce(
    (total, holding) =>
      total +
      holding.quantity *
        (getSimulatedStock(holding.symbol)?.price ?? holding.avgPrice),
    0,
  )

  const costBasis = holdings.reduce(
    (total, holding) => total + holding.quantity * holding.avgPrice,
    0,
  )

  const profitLoss = investedValue - costBasis




 
async function placeOrder(side: 'BUY' | 'SELL') {
  if (!portfolioLoaded) {
    setMessageType('error')
    setMessage('Your cloud portfolio is still loading. Please wait.')
    return
  }

  if (!selectedStock) {
    setMessageType('error')
    setMessage('Select a valid stock with a simulated price.')
    return
  }

  if (!Number.isSafeInteger(orderQuantity) || orderQuantity < 1) {
    setMessageType('error')
    setMessage('Enter a whole-number quantity of at least 1.')
    return
  }

  const existing = holdings.find((holding) => holding.symbol === symbol)
  const currentQuantity = existing?.quantity ?? 0

  if (side === 'BUY' && orderTotal > cash) {
    setMessageType('error')
    setMessage('Insufficient virtual cash for this order.')
    return
  }

  if (side === 'SELL' && orderQuantity > currentQuantity) {
    setMessageType('error')
    setMessage(`You only own ${currentQuantity} ${symbol} shares.`)
    return
  }

  try {
    const { data, error } = await supabase.rpc('execute_paper_trade', {
      p_side: side,
      p_symbol: symbol,
      p_name: selectedStock.name,
      p_quantity: orderQuantity,
      p_price: selectedStock.price,
    })

    if (error) throw error

    const result = data as {
      success: boolean
      cash: number
      trade_id: number
      total: number
    }

    if (!result?.success) {
      throw new Error('The trade was not confirmed by the server.')
    }

    // Update the UI only after Supabase confirms the trade.
    setCash(Number(result.cash))

    if (side === 'BUY') {
      setHoldings((current) => {
        const holding = current.find((item) => item.symbol === symbol)

        if (!holding) {
          return [
            ...current,
            {
              symbol,
              name: selectedStock.name,
              quantity: orderQuantity,
              avgPrice: selectedStock.price,
            },
          ]
        }

        return current.map((item) =>
          item.symbol === symbol
            ? {
                ...item,
                quantity: item.quantity + orderQuantity,
                avgPrice:
                  (item.quantity * item.avgPrice + orderTotal) /
                  (item.quantity + orderQuantity),
              }
            : item,
        )
      })
    } else {
      setHoldings((current) =>
        current
          .map((item) =>
            item.symbol === symbol
              ? { ...item, quantity: item.quantity - orderQuantity }
              : item,
          )
          .filter((item) => item.quantity > 0),
      )
    }

    const trade: Trade = {
      id: Number(result.trade_id),
      side,
      symbol,
      quantity: orderQuantity,
      price: selectedStock.price,
      total: Number(result.total),
      date: new Date().toLocaleString('en-IN'),
    }

    setTrades((current) => [trade, ...current])
    setLastExecutedTrade(trade)
    setMessageType('success')
    setMessage(
      `${side === 'BUY' ? 'You bought' : 'You sold'} ${orderQuantity} share${orderQuantity === 1 ? '' : 's'} of ${symbol} successfully.`,
    )
    setIsOrderReviewOpen(false)
    playTradeSound()
  } catch (error) {
    console.error('Paper-trading order failed:', error)
    setMessageType('error')
    setMessage(
      error instanceof Error
        ? error.message
        : 'Trade failed. Your portfolio was not updated.',
    )
  }
}


async function resetAccount() {
  if (!portfolioLoaded) {
    setMessageType('error')
    setMessage('Your cloud portfolio is still loading. Please wait.')
    return
  }

  if (
    !window.confirm(
      'Reset your account? This clears virtual cash, holdings and all trade history.',
    )
  ) {
    return
  }

  try {
    const { data, error } = await supabase.rpc(
      'reset_paper_trading_account',
    )

    if (error) throw error

    const result = data as { success: boolean; cash: number }

    if (!result?.success) {
      throw new Error('The account reset was not confirmed.')
    }

    setCash(Number(result.cash))
    setHoldings([])
    setTrades([])
    setLastExecutedTrade(null)
    setMessage('Paper-trading account reset.')
    setMessageType('success')
  } catch (error) {
    console.error('Paper-trading reset failed:', error)
    setMessageType('error')
    setMessage(
      error instanceof Error
        ? error.message
        : 'Could not reset your cloud portfolio.',
    )
  }
}


  return (
<div className="paper-trading-page mx-auto max-w-6xl space-y-6">    
    <section className="relative overflow-hidden rounded-3xl border border-cyan-300/15 bg-gradient-to-br from-[#102638] via-[#101a2b] to-[#0b1019] p-6 sm:p-9">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-300">
          VIRTUAL INVESTING
        </p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
          Paper Trading<span className="text-cyan-300">.</span>
        </h1>
        <p className="mt-3 max-w-xl text-sm leading-6 text-slate-400">
          Practise investment decisions with virtual money. No real orders or
          real money are involved.
        </p>
        <p className="mt-7 text-xs text-slate-400">Available Virtual Cash</p>
        <p className="mt-2 text-3xl font-semibold text-white sm:text-4xl">
          {money(cash)}
        </p>
        <p className="mt-2 text-xs text-cyan-200">Virtual Starting Capital: ₹10,00,000</p>
       <button
  onClick={resetAccount}
  className="reset-account-btn mt-5 shrink-0 rounded-xl border px-4 py-2.5 text-sm font-semibold transition-colors"
>
  Reset Account
</button>
      </section>

      <div className="grid gap-4 sm:grid-cols-3">

       
{[
  { label: 'Available Cash', value: money(cash), color: 'text-white' },
  { label: 'Invested Value', value: money(investedValue), color: 'text-white' },
  {
    label: 'Unrealised PNL',
    value: `${profitLoss > 0 ? '+' : profitLoss < 0 ? '−' : ''}${money(Math.abs(profitLoss))}`,
    color:
      profitLoss > 0
        ? 'text-emerald-300'
        : profitLoss < 0
          ? 'text-rose-300'
          : 'text-white',
  },
].map((item) => (
  <div
    key={item.label}
    className="rounded-2xl border border-white/[0.08] bg-[#121a2e] p-5"
  >
    <p className="text-xs text-slate-400">{item.label}</p>
    <p className={`mt-4 text-xl font-semibold ${item.color}`}>
      {item.value}
    </p>
  </div>
))}

      </div>

      <section className="rounded-2xl border border-white/[0.08] bg-[#121a2e] p-5 sm:p-7">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-300">
          ORDER TERMINAL
        </p>
        <h2 className="mt-2 text-xl font-semibold text-white">Place a simulated trade</h2>

        <div className="mt-6 grid gap-5 sm:grid-cols-2">
          <div>
            <label className="text-xs text-slate-400">Select Company</label>
            <select
              value={symbol}
              onChange={(event) => setSymbol(event.target.value)}
              className="mt-2 w-full rounded-xl border border-white/10 bg-[#0b1019] px-3 py-3 text-sm text-white outline-none focus:border-cyan-300/40"
            >
              {demoStocks.map((stock) => (
                <option key={stock.symbol} value={stock.symbol}>
                  {stock.symbol} — {stock.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-xs text-slate-400">Quantity</label>
            <input
              type="number"
              min="1"
              step="1"
              value={quantity}
              onChange={(event) => setQuantity(event.target.value)}
              className="mt-2 w-full rounded-xl border border-white/10 bg-[#0b1019] px-3 py-3 text-sm text-white outline-none focus:border-cyan-300/40"
            />
          </div>
        </div>

        <div className="mt-5 rounded-xl border border-white/[0.06] bg-white/[0.025] p-4">
          <div className="flex justify-between gap-4 text-sm">
            <span className="text-slate-400">Price per share</span>
          <span className="text-white">
  {selectedStock ? money(selectedStock.price) : 'Price unavailable'}
</span>
          </div>
          <div className="mt-3 flex justify-between gap-4 text-sm">
            <span className="text-slate-400">Estimated order value</span>
            <span className="font-semibold text-white">
              {Number.isSafeInteger(orderQuantity) && orderQuantity > 0
                ? money(orderTotal)
                : '—'}
            </span>
          </div>
          <p className="mt-3 text-[11px] leading-5 text-amber-200/70">
            Demo prices only. Prices do not update with the real market.
          </p>
        </div>

       
<div className="mt-5 space-y-4">
  <div className="grid grid-cols-2 gap-1 rounded-2xl border border-white/[0.08] bg-[#080d18] p-1.5">
    <button
      type="button"
      onClick={() => {
        setSide('BUY')
        setMessage('')
      }}
      aria-pressed={side === 'BUY'}
     className={`rounded-xl px-4 py-3 text-sm font-semibold transition-all duration-200 ${
  side === 'BUY'
    ? 'bg-emerald-400 text-slate-950 shadow-lg shadow-emerald-500/20'
    : 'text-slate-400 hover:bg-white/[0.04] hover:text-white'
}`}
    >
      BUY
    </button>

    <button
      type="button"
      onClick={() => {
        setSide('SELL')
        setMessage('')
      }}
      aria-pressed={side === 'SELL'}
     className={`rounded-xl px-4 py-3 text-sm font-semibold transition-all duration-200 ${
  side === 'SELL'
    ? 'bg-rose-400 text-slate-950 shadow-lg shadow-rose-500/20'
    : 'text-slate-400 hover:bg-white/[0.04] hover:text-white'
}`}
    >
      SELL
    </button>
  </div>

  <button
    type="button"
   onClick={() => setIsOrderReviewOpen(true)}
    className={`w-full rounded-xl px-4 py-3.5 text-sm font-semibold transition-all duration-200 active:scale-[0.99] ${
      side === 'BUY'
  ? 'bg-emerald-400 text-slate-950 shadow-lg shadow-emerald-500/20 hover:bg-emerald-300'
  : 'bg-rose-400 text-slate-950 shadow-lg shadow-rose-500/20 hover:bg-rose-300'
    }`}
  >
    {side === 'BUY' ? 'Buy' : 'Sell'} · {symbol}
  </button>
</div>


        {message && (
          <p
            role="status"
            className={`mt-4 rounded-xl border p-3 text-sm ${
              messageType === 'success'
                ? 'border-cyan-300/15 bg-cyan-300/[0.05] text-cyan-200'
                : 'border-rose-300/15 bg-rose-300/[0.05] text-rose-200'
            }`}
          >
            {message}
          </p>
        )}
      </section>




        {lastExecutedTrade && (
        <motion.div
          key={lastExecutedTrade.id}
          initial={{ opacity: 0, y: 12, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
        className="trade-receipt relative overflow-hidden rounded-2xl border border-emerald-300/20 bg-gradient-to-br from-emerald-400/[0.09] via-[#121a2e] to-cyan-400/[0.04] p-5 sm:p-6"
        >
          <div className="absolute left-0 top-0 h-full w-1 bg-emerald-300" />

          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-emerald-300/10 text-xl text-emerald-300">
                ✓
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-300">
                  Trade executed successfully
                </p>
                <h2 className="mt-1 text-lg font-semibold text-white">
                  {lastExecutedTrade.side} · {lastExecutedTrade.symbol}
                </h2>
                <p className="mt-1 text-xs text-slate-400">
                  {lastExecutedTrade.date}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setLastExecutedTrade(null)}
              aria-label="Dismiss trade receipt"
              className="rounded-lg px-2 py-1 text-slate-400 transition hover:bg-white/[0.06] hover:text-white"
            >
              ✕
            </button>
          </div>

          <div className="mt-5 grid grid-cols-2 gap-4 rounded-xl border border-white/[0.06] bg-black/10 p-4 sm:grid-cols-3">
            <div>
              <p className="text-xs text-slate-400">Quantity</p>
              <p className="mt-1 font-semibold text-white">
                {lastExecutedTrade.quantity} shares
              </p>
            </div>
            <div>
              <p className="text-xs text-slate-400">Price per share</p>
              <p className="mt-1 font-semibold text-white">
                {money(lastExecutedTrade.price)}
              </p>
            </div>
            <div className="col-span-2 sm:col-span-1">
              <p className="text-xs text-slate-400">Total order value</p>
              <p className="mt-1 text-lg font-semibold text-emerald-300">
                {money(lastExecutedTrade.total)}
              </p>
            </div>
          </div>

          <p className="mt-3 text-xs text-slate-500">
            Simulated order · No real money or brokerage order involved.
          </p>
        </motion.div>
      )}
      

      <section className="rounded-2xl border border-white/[0.08] bg-[#121a2e] p-5 sm:p-7">

     
        <h2 className="text-lg font-semibold text-white">Your Holdings</h2>
        {holdings.length === 0 ? (
          <p className="mt-4 rounded-xl border border-dashed border-white/10 p-6 text-center text-sm text-slate-500">
            No holdings yet. Place your first simulated buy order above.
          </p>
        ) : (
          <div className="mt-4 space-y-3">
            {holdings.map((holding) => {
             const price =
  getSimulatedStock(holding.symbol)?.price ?? holding.avgPrice
              const value = holding.quantity * price
              const pnl = value - holding.quantity * holding.avgPrice

              return (
                <div key={holding.symbol} className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-white/[0.06] p-4">
                  <div>
                    <p className="text-sm font-semibold text-white">{holding.symbol}</p>
                    <p className="mt-1 text-xs text-slate-500">
                      {holding.quantity} shares · Average {money(holding.avgPrice)}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-white">{money(value)}</p>
                    <p className={`mt-1 text-xs ${pnl >= 0 ? 'text-emerald-300' : 'text-rose-300'}`}>
                      {pnl >= 0 ? '+' : ''}{money(pnl)}
                    </p>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </section>


      

      <section className="rounded-2xl border border-white/[0.08] bg-[#121a2e] p-5 sm:p-7">
        <h2 className="text-lg font-semibold text-white">Trade History</h2>
        {trades.length === 0 ? (
          <p className="mt-4 text-sm text-slate-500">Your completed simulated orders will appear here.</p>
        ) : (
          <div className="mt-4 space-y-3">
            {trades.map((trade) => (
              <div key={trade.id} className="flex flex-wrap items-center justify-between gap-3 border-b border-white/[0.06] pb-3 last:border-0">
                <div>
                  <p className="text-sm font-medium text-white">
                    <span className={trade.side === 'BUY' ? 'text-cyan-300' : 'text-rose-300'}>
                      {trade.side}
                    </span>
                    {' '}{trade.symbol}
                  </p>
                  <p className="mt-1 text-xs text-slate-500">
                    {trade.quantity} shares · {trade.date}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-white">{money(trade.total)}</p>
                  <p className="mt-1 text-xs text-slate-500">{money(trade.price)} / share</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      
     
      
{isOrderReviewOpen && (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-[#050914]/85 p-4 backdrop-blur-md"
  >
    <motion.div
      initial={{ opacity: 0, y: 18, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.22 }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="order-review-title"
      className="my-auto w-full max-w-md overflow-hidden rounded-3xl border border-white/10 bg-[#0d1424] shadow-2xl shadow-cyan-950/30"
    >
      <div
        className={`h-1 w-full ${
          side === 'BUY'
            ? 'bg-gradient-to-r from-cyan-400 to-blue-500'
            : 'bg-gradient-to-r from-rose-400 to-violet-500'
        }`}
      />

      <div className="p-6 sm:p-7">
        <div className="flex items-center justify-between">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-400">
            Order confirmation
          </p>
          <button
            type="button"
            onClick={() => setIsOrderReviewOpen(false)}
            aria-label="Close order review"
            className="rounded-lg p-2 text-slate-400 transition hover:bg-white/5 hover:text-white"
          >
            ✕
          </button>
        </div>

        <div className="mt-6 flex items-center gap-3">
          <div
            className={`flex size-12 items-center justify-center rounded-2xl text-lg font-bold ${
              side === 'BUY'
                ? 'bg-cyan-300/10 text-cyan-300'
                : 'bg-rose-300/10 text-rose-300'
            }`}
          >
            {side === 'BUY' ? '↗' : '↘'}
          </div>
          <div>
            <h2
              id="order-review-title"
              className="text-2xl font-semibold text-white"
            >
              Review {side === 'BUY' ? 'Buy' : 'Sell'}
            </h2>
            <p className="mt-1 text-sm text-slate-400">
             {selectedStock?.name ?? 'Unknown stock'}
            </p>
          </div>
        </div>

        <div className="mt-6 rounded-2xl border border-white/[0.08] bg-white/[0.025] p-4">
          <p className="text-xs text-slate-400">Selected Instrument</p>
          <p className="mt-1 text-lg font-semibold text-white">{symbol}</p>

          <div className="mt-5 space-y-4">
            <div className="flex justify-between gap-4 text-sm">
              <span className="text-slate-400">Order type</span>
              <span className={side === 'BUY' ? 'text-cyan-300' : 'text-rose-300'}>
                {side} · Market
              </span>
            </div>
            <div className="flex justify-between gap-4 text-sm">
              <span className="text-slate-400">PPS</span>
              <span className="text-white">{selectedStock ? money(selectedStock.price) : 'Price unavailable'}</span>
            </div>
            <div className="flex justify-between gap-4 text-sm">
              <span className="text-slate-400">Qty</span>
              <span className="text-white">{quantity} shares</span>
            </div>
            <div className="border-t border-white/[0.08] pt-4">
              <p className="text-xs text-slate-400">Estimated order value</p>
              <p className="mt-1 text-3xl font-semibold tracking-tight text-white">
                {Number.isSafeInteger(orderQuantity) && orderQuantity > 0
                  ? money(orderTotal)
                  : '—'}
              </p>
            </div>
          </div>
        </div>

        <div className="mt-4 flex items-start gap-2 rounded-xl border border-amber-300/10 bg-amber-300/[0.04] p-3">
          <span className="text-amber-300">ⓘ</span>
          <p className="text-xs leading-5 text-slate-400">
            This is a simulated trade using virtual money and illustrative prices.
            No real order will be placed.
          </p>
        </div>

        {orderProblem && (
  <div
    role="alert"
    className="mt-4 rounded-xl border border-rose-400/20 bg-rose-400/[0.07] p-3"
  >
    <p className="text-sm font-semibold text-rose-300">
      Order cannot be placed
    </p>
    <p className="mt-1 text-xs leading-5 text-rose-200/80">
      {orderProblem}
    </p>
  </div>
)}

       
<div className="mt-6 grid grid-cols-2 gap-3">
  <button
    type="button"
    onClick={() => setIsOrderReviewOpen(false)}
    className="rounded-xl border border-white/10 px-4 py-3 text-sm font-medium text-slate-300 transition hover:bg-white/[0.04] hover:text-white"
  >
    Cancel
  </button>

  <button
    type="button"
    disabled={!canConfirmOrder}
    onClick={() => {
      if (!canConfirmOrder) return
      placeOrder(side)
      setIsOrderReviewOpen(false)
    }}
    className={`rounded-xl px-4 py-3 text-sm font-semibold text-slate-950 transition active:scale-[0.98] ${
     side === 'BUY'
  ? 'bg-emerald-400 text-slate-950 shadow-lg shadow-emerald-500/20 hover:bg-emerald-300'
  : 'bg-rose-400 text-slate-950 shadow-lg shadow-rose-500/20 hover:bg-rose-300'
    } ${!canConfirmOrder ? 'cursor-not-allowed opacity-40' : ''}`}
  >
    Confirm
  </button>
</div>

      </div>
    </motion.div>
  </motion.div>
)}

    </div>
  )
}


function PortfolioQuickBar({ userId }: { userId: string }) {
  const money = (value: number) =>
    `₹${value.toLocaleString('en-IN', {
      maximumFractionDigits: 0,
    })}`

  const [, setVersion] = useState(0)
  const [cash, setCash] = useState(1000000)
  const [holdings, setHoldings] = useState<
    { symbol: string; quantity: number; avgPrice: number }[]
  >([])

  useEffect(() => {
    return subscribeToMarket(() => {
      setVersion((current) => current + 1)
    })
  }, [])

  useEffect(() => {
    let cancelled = false

    async function loadPortfolio() {
      const [accountResult, holdingsResult] = await Promise.all([
        supabase
          .from('paper_trading_accounts')
          .select('cash')
          .eq('user_id', userId)
          .maybeSingle(),
        supabase
          .from('paper_trading_holdings')
          .select('symbol, quantity, avg_price')
          .eq('user_id', userId),
      ])

      if (cancelled) return

      if (accountResult.error || holdingsResult.error) {
        console.error(
          'Failed to load portfolio quick bar:',
          accountResult.error || holdingsResult.error,
        )
        return
      }

      setCash(
        accountResult.data ? Number(accountResult.data.cash) : 1000000,
      )

      setHoldings(
        (holdingsResult.data ?? []).map((holding) => ({
          symbol: holding.symbol,
          quantity: Number(holding.quantity),
          avgPrice: Number(holding.avg_price),
        })),
      )
    }

    void loadPortfolio()

    return () => {
      cancelled = true
    }
  }, [userId])



  const investedValue = holdings.reduce(
    (total, holding) =>
      total +
      holding.quantity *
        (getSimulatedStock(holding.symbol)?.price ?? holding.avgPrice),
    0
  )

  const costBasis = holdings.reduce(
    (total, holding) => total + holding.quantity * holding.avgPrice,
    0
  )

  const pnl = investedValue - costBasis

  return (
    <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
      {[
        { label: 'Unrealised PNL', value: `${pnl >= 0 ? '+' : '−'}${money(Math.abs(pnl))}`, color: pnl >= 0 ? 'text-emerald-300' : 'text-rose-300' },
        { label: 'Holdings', value: String(holdings.length), color: 'text-white' },
        { label: 'Available Cash', value: money(cash), color: 'text-white' },
        { label: 'Invested Value', value: money(investedValue), color: 'text-white' },
      ].map((item) => (
        <div key={item.label} className="rounded-xl border border-white/[0.08] bg-[#0e141f]/90 px-4 py-3">
          <p className="text-[11px] text-slate-500">{item.label}</p>
          <p className={`mt-2 truncate text-sm font-semibold ${item.color}`}>
            {item.value}
          </p>
        </div>
      ))}
    </div>
  )
}






function TradeHistoryPage({ userId }: { userId: string }) {
  type Trade = {
    id: number
    side: 'BUY' | 'SELL'
    symbol: string
    quantity: number
    price: number
    total: number
    date: string
  }

  const [trades, setTrades] = useState<Trade[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false

    async function loadTrades() {
      const { data, error } = await supabase
        .from('paper_trading_trades')
        .select('id, side, symbol, quantity, price, total, legacy_date, traded_at')
        .eq('user_id', userId)
        .order('id', { ascending: false })

      if (cancelled) return

      if (error) {
        console.error('Failed to load trade history:', error)
      } else {
        setTrades(
          (data ?? []).map((trade) => ({
            id: Number(trade.id),
            side: trade.side as Trade['side'],
            symbol: trade.symbol,
            quantity: Number(trade.quantity),
            price: Number(trade.price),
            total: Number(trade.total),
            date:
              trade.legacy_date ??
              new Date(trade.traded_at).toLocaleString('en-IN'),
          })),
        )
      }

      setLoading(false)
    }

    void loadTrades()

    return () => {
      cancelled = true
    }
  }, [userId])

  const money = (value: number) =>
    `₹${value.toLocaleString('en-IN', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`

  return (
    <div className="trade-history-page mx-auto max-w-6xl space-y-6">
      <section className="rounded-3xl border border-cyan-300/15 bg-gradient-to-br from-[#102638] via-[#101a2b] to-[#0b1019] p-6 sm:p-9">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-300">
          ACTIVITY LEDGER
        </p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
          Trade History<span className="text-cyan-300">.</span>
        </h1>
        <p className="mt-3 text-sm leading-6 text-slate-400">
          Every simulated buy and sell order, recorded in one place.
        </p>
        <div className="mt-6">
          <p className="text-xs text-slate-400">Total recorded orders</p>
          <p className="mt-2 text-3xl font-semibold text-white">
            {loading ? 'Loading…' : trades.length}
          </p>
        </div>
      </section>

      <section className="overflow-hidden rounded-2xl border border-white/[0.08] bg-[#121a2e]">
        {loading ? (
          <div className="p-10 text-center text-sm text-slate-400">
            Loading your trade history…
          </div>
        ) : trades.length === 0 ? (
          <div className="p-10 text-center">
            <p className="text-sm font-medium text-white">No trades recorded yet</p>
            <p className="mt-2 text-xs text-slate-500">
              Your orders will appear here after you trade in Paper Trading.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-white/[0.06]">
            {trades.map((trade) => (
              <div
                key={trade.id}
                className="flex flex-wrap items-center justify-between gap-4 p-4 sm:p-5"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`flex size-10 items-center justify-center rounded-xl text-xs font-bold ${
                      trade.side === 'BUY'
                        ? 'bg-cyan-300/10 text-cyan-300'
                        : 'bg-rose-300/10 text-rose-300'
                    }`}
                  >
                    {trade.side === 'BUY' ? 'B' : 'S'}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-white">
                      {trade.symbol}
                      <span
                        className={`ml-2 text-[10px] ${
                          trade.side === 'BUY'
                            ? 'text-cyan-300'
                            : 'text-rose-300'
                        }`}
                      >
                        {trade.side}
                      </span>
                    </p>
                    <p className="mt-1 text-xs text-slate-500">
                      {trade.quantity} shares · {trade.date}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-white">
                    {money(trade.total)}
                  </p>
                  <p className="mt-1 text-xs text-slate-500">
                    {money(trade.price)} per share
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <p className="text-xs leading-5 text-slate-500">
        This ledger displays your simulated orders saved to your account. It is
        not a real brokerage statement.
      </p>
    </div>
  )
}








function InvestmentJournal({ userId }: { userId: string }) {




  const [entries, setEntries] = useState<
    { id: string; symbol: string; thesis: string; notes: string; date: string }[]
  >([])

  const [symbol, setSymbol] = useState('')
  const [thesis, setThesis] = useState('')
  const [notes, setNotes] = useState('')
  const [journalLoading, setJournalLoading] = useState(true)

  useEffect(() => {
    let cancelled = false

    const loadEntries = async () => {
      setJournalLoading(true)

      const { data, error } = await supabase
        .from('journal_entries')
        .select('id, symbol, thesis, notes, entry_date')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Failed to load journal:', error.message)
        alert('Could not load your journal entries.')
        setJournalLoading(false)
        return
      }

      if (!cancelled) {
        setEntries(
          (data ?? []).map((entry) => ({
            id: entry.id,
            symbol: entry.symbol,
            thesis: entry.thesis,
            notes: entry.notes,
            date: entry.entry_date,
          }))
        )
        setJournalLoading(false)
      }
    }

    void loadEntries()

    return () => {
      cancelled = true
    }
  }, [userId])

  const saveEntry = async () => {
    if (!symbol.trim() || !thesis.trim()) return

    const { data, error } = await supabase
      .from('journal_entries')
      .insert({
        user_id: userId,
        symbol: symbol.trim().toUpperCase(),
        thesis: thesis.trim(),
        notes: notes.trim(),
      })
      .select('id, symbol, thesis, notes, entry_date')
      .single()

    if (error) {
      console.error('Failed to save journal entry:', error.message)
      alert('Could not save your journal entry. Please try again.')
      return
    }

    setEntries((current) => [
      {
        id: data.id,
        symbol: data.symbol,
        thesis: data.thesis,
        notes: data.notes,
        date: data.entry_date,
      },
      ...current,
    ])

    setSymbol('')
    setThesis('')
    setNotes('')
  }

  const deleteEntry = async (id: string) => {
    const { error } = await supabase
      .from('journal_entries')
      .delete()
      .eq('user_id', userId)
      .eq('id', id)

    if (error) {
      console.error('Failed to delete journal entry:', error.message)
      alert('Could not delete your journal entry. Please try again.')
      return
    }

    setEntries((current) => current.filter((entry) => entry.id !== id))
  }



  return (
    <div className="mx-auto max-w-5xl space-y-7">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-300">
          INVESTMENT RESEARCH
        </p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-white">
          Investment Journal
        </h1>
        <p className="mt-2 text-sm text-slate-400">
          Document your thesis, track your decisions, and learn from your investing journey.
        </p>
      </div>

      <section className="rounded-2xl border border-white/[0.08] bg-[#121a2e] p-5 sm:p-6">
        <h2 className="text-lg font-semibold text-white">New Journal Entry</h2>
        <p className="mt-1 text-sm text-slate-400">
          Record why a company interests you before making an investment decision.
        </p>

        <div className="mt-5 space-y-4">
          <div>
            <label className="mb-2 block text-sm text-slate-300">
              Stock symbol*
            </label>
            <input
              value={symbol}
              onChange={(e) => setSymbol(e.target.value)}
              placeholder="e.g. RELIANCE"
              className="w-full rounded-xl border border-white/10 bg-[#0a0f1c] px-4 py-3 text-sm text-white outline-none focus:border-cyan-300/50"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm text-slate-300">
              Investment thesis*
            </label>
            <textarea
              value={thesis}
              onChange={(e) => setThesis(e.target.value)}
              placeholder="Why is this company worth researching?"
              rows={3}
              className="w-full resize-y rounded-xl border border-white/10 bg-[#0a0f1c] px-4 py-3 text-sm text-white outline-none focus:border-cyan-300/50"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm text-slate-300">
              Research notes
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Valuation, risks, management, entry price, or what would invalidate your thesis..."
              rows={3}
              className="w-full resize-y rounded-xl border border-white/10 bg-[#0a0f1c] px-4 py-3 text-sm text-white outline-none focus:border-cyan-300/50"
            />
          </div>

          <button
            type="button"
            onClick={saveEntry}
            disabled={!symbol.trim() || !thesis.trim()}
            className="rounded-xl bg-cyan-300 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-200 disabled:cursor-not-allowed disabled:opacity-40"
          >
            Save Journal Entry
          </button>
        </div>
      </section>

      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-white">Saved Entries</h2>
          <span className="text-xs text-slate-500">{entries.length} entries</span>
        </div>

       {journalLoading ? (
  <div className="rounded-2xl border border-white/10 p-8 text-center">
    <p className="text-sm text-slate-400">Loading your journal...</p>
  </div>
) : entries.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-white/10 p-8 text-center">
            <p className="text-sm text-slate-300">Your journal starts here.</p>
            <p className="mt-2 text-xs text-slate-500">
              Your saved investment theses will appear here.
            </p>
          </div>
        ) : (
          entries.map((entry) => (
            <article
              key={entry.id}
              className="rounded-2xl border border-white/[0.08] bg-[#121a2e] p-5"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <span className="inline-flex rounded-lg bg-cyan-300/[0.08] px-2.5 py-1 text-sm font-semibold text-cyan-300">
                    {entry.symbol}
                  </span>
                  <p className="mt-2 text-xs text-slate-500">{entry.date}</p>
                </div>
                <button
                  type="button"
                  onClick={() => deleteEntry(entry.id)}
                  className="text-xs text-rose-300 transition hover:text-rose-200"
                >
                  Delete
                </button>
              </div>

              <h3 className="mt-4 text-sm font-semibold text-white">
                Investment thesis
              </h3>
              <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-slate-300">
                {entry.thesis}
              </p>

              {entry.notes && (
                <>
                  <h3 className="mt-4 text-sm font-semibold text-white">Research notes</h3>
                  <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-slate-400">
                    {entry.notes}
                  </p>
                </>
              )}
            </article>
          ))
        )}
      </section>
    </div>
  )
}



function PortfolioAnalytics({ userId }: { userId: string }) {
  type AnalyticsTrade = {
    id: number
    side: 'BUY' | 'SELL'
    symbol: string
    quantity: number
    price: number
    total: number
    date: string
  }

  type AnalyticsHolding = {
    symbol: string
    name?: string
    quantity: number
    avgPrice: number
  }


  const [trades, setTrades] = useState<AnalyticsTrade[]>([])
  const [holdings, setHoldings] = useState<AnalyticsHolding[]>([])

  useEffect(() => {
    let cancelled = false

    async function loadAnalyticsPortfolio() {
      const [tradesResult, holdingsResult] = await Promise.all([
        supabase
          .from('paper_trading_trades')
          .select('id, side, symbol, quantity, price, total, legacy_date, traded_at')
          .eq('user_id', userId)
          .order('id', { ascending: false }),

        supabase
          .from('paper_trading_holdings')
          .select('symbol, name, quantity, avg_price')
          .eq('user_id', userId),
      ])

      if (cancelled) return

      if (tradesResult.error || holdingsResult.error) {
        console.error(
          'Failed to load portfolio analytics:',
          tradesResult.error || holdingsResult.error,
        )
        return
      }

      setTrades(
        (tradesResult.data ?? []).map((trade) => ({
          id: Number(trade.id),
          side: trade.side as AnalyticsTrade['side'],
          symbol: trade.symbol,
          quantity: Number(trade.quantity),
          price: Number(trade.price),
          total: Number(trade.total),
          date:
            trade.legacy_date ??
            new Date(trade.traded_at).toLocaleString('en-IN'),
        })),
      )

      setHoldings(
        (holdingsResult.data ?? []).map((holding) => ({
          symbol: holding.symbol,
          name: holding.name,
          quantity: Number(holding.quantity),
          avgPrice: Number(holding.avg_price),
        })),
      )
    }

    void loadAnalyticsPortfolio()

    return () => {
      cancelled = true
    }
  }, [userId])


  const validTrades = trades.filter(
    (trade) =>
      trade &&
      (trade.side === 'BUY' || trade.side === 'SELL') &&
      typeof trade.symbol === 'string' &&
      Number.isFinite(Number(trade.total))
  )

  const buys = validTrades.filter((trade) => trade.side === 'BUY')
  const sells = validTrades.filter((trade) => trade.side === 'SELL')
  const tradedValue = validTrades.reduce(
    (sum, trade) => sum + Number(trade.total),
    0
  )
  const buyValue = buys.reduce(
    (sum, trade) => sum + Number(trade.total),
    0
  )
  const sellValue = sells.reduce(
    (sum, trade) => sum + Number(trade.total),
    0
  )

  const symbolCounts = Object.entries(
    validTrades.reduce<Record<string, number>>((counts, trade) => {
      counts[trade.symbol] = (counts[trade.symbol] || 0) + 1
      return counts
    }, {})
  ).sort((a, b) => b[1] - a[1])

  const mostTraded = symbolCounts[0]
  const averageOrder = validTrades.length
    ? tradedValue / validTrades.length
    : 0

  const formatMoney = (value: number) =>
    `₹${value.toLocaleString('en-IN', {
      maximumFractionDigits: 2,
    })}`

  const panel =
    'rounded-2xl border border-white/[0.08] bg-[#121a2e] p-5'
  const muted = 'text-sm text-slate-400'

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-white">
          Portfolio Analytics
        </h1>
        <p className="mt-1 text-sm text-slate-400">
          Understand your paper-trading activity and investing habits.
        </p>
        <p className="mt-2 text-xs text-cyan-300">
          Based on your cloud-saved trades · Demo portfolio
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <div className={panel}>
          <p className={muted}>Total Orders</p>
          <p className="mt-3 text-2xl font-semibold text-white">
            {validTrades.length}
          </p>
          <p className={`${muted} mt-2`}>Recorded buy and sell orders</p>
        </div>

        <div className={panel}>
          <p className={muted}>Total Traded Value</p>
          <p className="mt-3 text-2xl font-semibold text-white">
            {formatMoney(tradedValue)}
          </p>
          <p className={`${muted} mt-2`}>Buys + sells, not portfolio value</p>
        </div>

        <div className={panel}>
          <p className={muted}>Average Order Value</p>
          <p className="mt-3 text-2xl font-semibold text-white">
            {formatMoney(averageOrder)}
          </p>
          <p className={`${muted} mt-2`}>Average value per recorded order</p>
        </div>

        <div className={panel}>
          <p className={muted}>Stocks Traded</p>
          <p className="mt-3 text-2xl font-semibold text-white">
            {symbolCounts.length}
          </p>
          <p className={`${muted} mt-2`}>Distinct stock symbols</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <section className={panel}>
          <h2 className="text-lg font-semibold text-white">
            Trading Activity
          </h2>
          <p className={`${muted} mt-1`}>
            Your order and transaction-value breakdown.
          </p>

          <div className="mt-6 space-y-5">
            <div>
              <div className="flex justify-between gap-3">
                <span className="text-sm text-slate-300">Buy Orders</span>
                <span className="text-sm font-medium text-white">
                  {buys.length}
                </span>
              </div>
              <div className="mt-2 h-2 overflow-hidden rounded-full bg-white/10">
                <div
                  className="h-full rounded-full bg-cyan-400"
                  style={{
                    width: `${
                      validTrades.length
                        ? (buys.length / validTrades.length) * 100
                        : 0
                    }%`,
                  }}
                />
              </div>
              <p className={`${muted} mt-1`}>
                Buy value: {formatMoney(buyValue)}
              </p>
            </div>

            <div>
              <div className="flex justify-between gap-3">
                <span className="text-sm text-slate-300">Sell Orders</span>
                <span className="text-sm font-medium text-white">
                  {sells.length}
                </span>
              </div>
              <div className="mt-2 h-2 overflow-hidden rounded-full bg-white/10">
                <div
                  className="h-full rounded-full bg-violet-400"
                  style={{
                    width: `${
                      validTrades.length
                        ? (sells.length / validTrades.length) * 100
                        : 0
                    }%`,
                  }}
                />
              </div>
              <p className={`${muted} mt-1`}>
                Sell value: {formatMoney(sellValue)}
              </p>
            </div>
          </div>
        </section>

        <section className={panel}>
          <h2 className="text-lg font-semibold text-white">
            Most-Traded Stocks
          </h2>
          <p className={`${muted} mt-1`}>
            Ranked by number of recorded orders.
          </p>

          {symbolCounts.length === 0 ? (
            <p className="mt-6 text-sm text-slate-400">
              No trades yet. Place a paper trade to start building your
              analytics.
            </p>
          ) : (
            <div className="mt-5 space-y-4">
              {symbolCounts.slice(0, 6).map(([symbol, count]) => (
                <div key={symbol}>
                  <div className="flex justify-between gap-3">
                    <span className="text-sm font-medium text-white">
                      {symbol}
                    </span>
                    <span className="text-sm text-slate-400">
                      {count} {count === 1 ? 'order' : 'orders'}
                    </span>
                  </div>
                  <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white/10">
                    <div
                      className="h-full rounded-full bg-cyan-400"
                      style={{
                        width: `${(count / (mostTraded?.[1] || 1)) * 100}%`,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>

      <section className={panel}>
        <h2 className="text-lg font-semibold text-white">
          Current Simulated Holdings
        </h2>
        <p className={`${muted} mt-1`}>
          Quantities and average purchase prices from your saved paper portfolio.
        </p>

        {holdings.filter((holding) => Number(holding.quantity) > 0).length ===
        0 ? (
          <p className="mt-5 text-sm text-slate-400">
            No current holdings. Buy a stock in Paper Trading to see it here.
          </p>
        ) : (
          <div className="mt-5 overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-white/10 text-slate-400">
                  <th className="pb-3 pr-4 font-medium">Stock</th>
                  <th className="pb-3 pr-4 font-medium">Quantity</th>
                  <th className="pb-3 pr-4 font-medium">Average Cost</th>
                  <th className="pb-3 text-right font-medium">Cost Basis</th>
                </tr>
              </thead>
              <tbody>
                {holdings
                  .filter((holding) => Number(holding.quantity) > 0)
                  .map((holding) => (
                    <tr
                      key={holding.symbol}
                      className="border-b border-white/[0.05] last:border-0"
                    >
                      <td className="py-4 pr-4 font-medium text-white">
                        {holding.symbol}
                      </td>
                      <td className="py-4 pr-4 text-slate-300">
                        {holding.quantity}
                      </td>
                      <td className="py-4 pr-4 text-slate-300">
                        {formatMoney(Number(holding.avgPrice) || 0)}
                      </td>
                      <td className="py-4 text-right text-slate-300">
                        {formatMoney(
                          Number(holding.quantity) *
                            (Number(holding.avgPrice) || 0)
                        )}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        )}
        <p className={`${muted} mt-4 text-xs`}>
          Cost basis is based on average purchase cost, not live market value or
          current profit/loss.
        </p>
      </section>

      <section className={panel}>
        <h2 className="text-lg font-semibold text-white">
          Behaviour Snapshot
        </h2>
        <p className={`${muted} mt-1`}>
          Descriptive observations from your recorded activity.
        </p>

        <div className="mt-5 space-y-4">
          <div className="rounded-xl border border-white/[0.06] p-4">
            <p className="text-sm font-medium text-white">
              {mostTraded
                ? `${mostTraded[0]} is your most-traded stock`
                : 'Your trading history starts here'}
            </p>
            <p className={`${muted} mt-1`}>
              {mostTraded
                ? `${mostTraded[1]} of ${validTrades.length} recorded orders involve this stock.`
                : 'Your future orders will reveal which stocks receive the most attention.'}
            </p>
          </div>

          <div className="rounded-xl border border-white/[0.06] p-4">
            <p className="text-sm font-medium text-white">
              {buys.length > sells.length
                ? 'More buying than selling'
                : sells.length > buys.length
                  ? 'More selling than buying'
                  : validTrades.length
                    ? 'Buy and sell order counts are equal'
                    : 'No trading pattern yet'}
            </p>
            <p className={`${muted} mt-1`}>
              {validTrades.length
                ? `You have ${buys.length} buy orders and ${sells.length} sell orders. This describes activity, not whether your decisions were profitable.`
                : 'Place trades to begin measuring your activity.'}
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}



function MarketIntelligence({
  onSelectStock,
}: {
  onSelectStock: (symbol: string) => void
}) {


const marketStocks = getSimulatedStocks()
const [selectedSector, setSelectedSector] = useState<string | null>(null)

const sectors = Array.from(
  new Set(marketStocks.map((stock) => stock.sector))
).map((name) => ({
  name,
  stocks: marketStocks.filter((stock) => stock.sector === name),
  color:
    name === 'Information Technology'
      ? 'bg-cyan-400'
      : name === 'Banking'
        ? 'bg-violet-400'
        : name === 'Energy'
          ? 'bg-amber-400'
          : name === 'Consumer Goods'
            ? 'bg-emerald-400'
            : 'bg-slate-400',
}))

const filteredStocks = selectedSector
  ? marketStocks.filter((stock) => stock.sector === selectedSector)
  : marketStocks

const sortedStocks = [...filteredStocks].sort(
  (a, b) => b.change - a.change
)

const watchlist = selectedSector
  ? sortedStocks
  : sortedStocks.slice(0, 8)

  const panel =
    'rounded-2xl border border-white/[0.08] bg-[#121a2e] p-5'
  const muted = 'text-sm text-slate-400'

  return (
    <div className="market-intel-layout flex flex-col gap-6">
      <div className="market-intel-heading">
        <h1 className="text-2xl font-semibold text-white">
          Market Intelligence
        </h1>
        <p className="mt-1 text-sm text-slate-400">
          Explore sectors, monitor stocks, and organise your market research.
        </p>
       
      </div>

    <div className="market-intel-summary grid grid-cols-1 gap-2 sm:grid-cols-3 sm:gap-4">
        <div className={panel}>
          <p className={muted}>Sectors to Monitor</p>
          <p className="mt-3 text-3xl font-semibold text-white">
            {sectors.length}
          </p>
          <p className={`${muted} mt-2`}>Major market segments</p>
        </div>
        <div className={panel}>
          <p className={muted}>Stocks in Overview</p>
          <p className="mt-3 text-3xl font-semibold text-white">
            {watchlist.length}
          </p>
          <p className={`${muted} mt-2`}>Illustrative research universe</p>
        </div>
        <div className={panel}>
          <p className={muted}>Research Focus</p>
          <p className="mt-3 text-2xl font-semibold text-cyan-300">
            Quality
          </p>
          <p className={`${muted} mt-2`}>Business quality before price action</p>
        </div>
      </div>

     <section className={`market-intel-sectors ${panel}`}>
        <div>
          <h2 className="text-lg font-semibold text-white">
            Sector Monitor
          </h2>
          <p className={`${muted} mt-1`}>
            Select a sector to explore its representative stocks.
          </p>
          {selectedSector && (
 <div className="market-intel-sector-message sticky top-2 z-30 mt-3 flex flex-col gap-3 rounded-xl border border-cyan-300/20 bg-[#121a2e] p-3 shadow-lg sm:flex-row sm:items-center sm:justify-between">
    <p className="text-sm leading-relaxed text-slate-300">
      <span className="font-medium text-cyan-300">
        {selectedSector}
      </span>{' '}
      selected. Its stocks are listed in Market Watch below.
      Select a stock to open its details.
    </p>

    <button
      type="button"
      onClick={() => setSelectedSector(null)}
      className="shrink-0 self-start rounded-lg border border-white/10 px-3 py-2 text-xs font-medium text-slate-300 transition hover:border-cyan-300/30 hover:text-white sm:self-auto"
    >
      Show all sectors
    </button>
  </div>
)}
        </div>

        <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
          {sectors.map((sector) => (

           <button
  key={sector.name}
  type="button"

 onClick={() =>
  setSelectedSector((current) =>
    current === sector.name ? null : sector.name
  )
}

  disabled={sector.stocks.length === 0}
 className={`w-full rounded-xl border p-4 text-left transition ${
  selectedSector === sector.name
    ? 'border-cyan-300/50 bg-cyan-300/[0.08]'
    : 'border-white/[0.07] bg-white/[0.02] hover:border-cyan-300/30 hover:bg-white/[0.04]'
} disabled:opacity-50`}
>

              <div className="flex items-center gap-3">
                <div className={`h-10 w-1 rounded-full ${sector.color}`} />
                <div>
                  <h3 className="font-medium text-white">{sector.name}</h3>
                  {selectedSector === sector.name && (
  <p className="mt-1 text-xs leading-relaxed text-cyan-300">
    Selected · This sector's stocks are shown in Market Watch below.
  </p>
)}
                  <p className={`${muted} mt-1 text-xs`}>
                  {sector.stocks
  .slice(0, 4)
  .map((stock) => stock.symbol)
  .join(' · ')}
                  </p>
                </div>
              </div>
            </button>
          ))}
        </div>
      </section>

      <section className={`market-intel-watch ${panel}`}>
        <h2 className="text-lg font-semibold text-white">
          Market Watch
        </h2>
        <p className={`${muted} mt-1`}>
          A starting list of companies for further research.
        </p>

        <div className="market-watch-scroll mt-5 overflow-x-auto">
          <table className="market-watch-table w-full text-left text-sm">
            <thead>
              <tr className="border-b border-white/10 text-slate-400">
                <th className="pb-3 pr-4 font-medium">Company</th>
                <th className="pb-3 pr-4 font-medium">Symbol</th>
                <th className="pb-3 font-medium">Sector</th>
              </tr>
            </thead>
            <tbody>
              {watchlist.map((stock) => (
               <tr
  key={stock.symbol}
  onClick={() => onSelectStock(stock.symbol)}
  role="button"
  tabIndex={0}
  onKeyDown={(event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      onSelectStock(stock.symbol)
    }
  }}
  className="cursor-pointer border-b border-white/[0.05] last:border-0 transition hover:bg-white/[0.04]"
>
                  <td className="py-4 pr-4 font-medium text-white">
                    {stock.name}
                  </td>
                  <td className="py-4 pr-4 text-cyan-300">
                    {stock.symbol}
                  </td>
                  <td className="py-4 text-slate-400">{stock.sector}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className={`market-intel-checklist ${panel}`}>
        <h2 className="text-lg font-semibold text-white">
          Research Checklist
        </h2>
        <p className={`${muted} mt-1`}>
          A disciplined framework for evaluating market opportunities.
        </p>

        <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
          {[
            ['01', 'Market Trend', 'Understand the broader market environment.'],
            ['02', 'Sector Outlook', 'Check industry growth and competitive pressure.'],
            ['03', 'Business Quality', 'Review profitability, debt, and cash flow.'],
            ['04', 'Valuation', 'Compare price with business fundamentals.'],
          ].map(([number, title, description]) => (
            <div
              key={number}
              className="flex gap-3 rounded-xl border border-white/[0.06] p-4"
            >
              <span className="text-sm font-semibold text-cyan-300">
                {number}
              </span>
              <div>
                <h3 className="text-sm font-medium text-white">{title}</h3>
                <p className={`${muted} mt-1 text-xs`}>{description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}




function PortfolioPage({ userId }: { userId: string }) {
  type Holding = {
    symbol: string
    name?: string
    quantity: number
    avgPrice: number
  }



  const [holdings, setHoldings] = useState<Holding[]>([])
  const [cash, setCash] = useState<number>(1000000)
  const [trades, setTrades] = useState<{ side: string; total: number }[]>([])

  useEffect(() => {
    let cancelled = false

    async function loadPortfolio() {
      const [accountResult, holdingsResult, tradesResult] = await Promise.all([
        supabase
          .from('paper_trading_accounts')
          .select('cash')
          .eq('user_id', userId)
          .maybeSingle(),

        supabase
          .from('paper_trading_holdings')
          .select('symbol, name, quantity, avg_price')
          .eq('user_id', userId),

        supabase
          .from('paper_trading_trades')
          .select('side, total')
          .eq('user_id', userId),
      ])

      if (cancelled) return

      if (accountResult.error || holdingsResult.error || tradesResult.error) {
        console.error(
          'Failed to load portfolio:',
          accountResult.error || holdingsResult.error || tradesResult.error
        )
        return
      }

      setCash(
        accountResult.data ? Number(accountResult.data.cash) : 1000000
      )

      setHoldings(
        (holdingsResult.data ?? []).map((holding) => ({
          symbol: holding.symbol,
          name: holding.name ?? undefined,
          quantity: Number(holding.quantity),
          avgPrice: Number(holding.avg_price),
        }))
      )

      setTrades(
        (tradesResult.data ?? []).map((trade) => ({
          side: trade.side,
          total: Number(trade.total),
        }))
      )
    }

    void loadPortfolio()

    return () => {
      cancelled = true
    }
  }, [userId])



  const activeHoldings = holdings.filter(
    (holding) => Number(holding.quantity) > 0
  )

  const invested = activeHoldings.reduce(
    (sum, holding) =>
      sum +
      Number(holding.quantity) * (Number(holding.avgPrice) || 0),
    0
  )

  const totalAssets = invested + cash

  const formatMoney = (value: number) =>
    `₹${value.toLocaleString('en-IN', {
      maximumFractionDigits: 2,
    })}`

  const panel =
    'rounded-2xl border border-white/[0.08] bg-[#121a2e] p-5'
  const muted = 'text-sm text-slate-400'

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-white">Portfolio</h1>
        <p className="mt-1 text-sm text-slate-400">
          Your simulated holdings, capital allocation, and trading activity.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <div className={panel}>
          <p className={muted}>Portfolio Cost Basis + Cash</p>
          <p className="mt-3 text-2xl font-semibold text-white">
            {formatMoney(totalAssets)}
          </p>
          <p className={`${muted} mt-2`}>Excludes unrealised gains or losses</p>
        </div>

        <div className={panel}>
          <p className={muted}>Invested Cost Basis</p>
          <p className="mt-3 text-2xl font-semibold text-white">
            {formatMoney(invested)}
          </p>
          <p className={`${muted} mt-2`}>Based on average purchase prices</p>
        </div>

        <div className={panel}>
          <p className={muted}>Available Cash</p>
          <p className="mt-3 text-2xl font-semibold text-cyan-300">
            {formatMoney(cash)}
          </p>
          <p className={`${muted} mt-2`}>Remaining simulated buying power</p>
        </div>

        <div className={panel}>
          <p className={muted}>Open Positions</p>
          <p className="mt-3 text-2xl font-semibold text-white">
            {activeHoldings.length}
          </p>
          <p className={`${muted} mt-2`}>Stocks currently held</p>
        </div>
      </div>

      <section className={panel}>
        <h2 className="text-lg font-semibold text-white">Your Holdings</h2>
        <p className={`${muted} mt-1`}>
          Positions and their share of your invested cost basis.
        </p>

        {activeHoldings.length === 0 ? (
          <div className="mt-6 rounded-xl border border-dashed border-white/10 p-8 text-center">
            <p className="font-medium text-white">No holdings yet</p>
            <p className={`${muted} mt-2`}>
              Visit Paper Trading to place your first simulated order.
            </p>
          </div>
        ) : (
          <div className="mt-5 space-y-5">
            {activeHoldings.map((holding) => {
              const cost =
                Number(holding.quantity) * (Number(holding.avgPrice) || 0)
              const allocation = invested > 0 ? (cost / invested) * 100 : 0

              return (
                <div key={holding.symbol}>
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <p className="font-medium text-white">
                        {holding.symbol}
                      </p>
                      <p className={`${muted} mt-1`}>
                        {holding.name || holding.symbol} · {holding.quantity} shares
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-white">
                        {formatMoney(cost)}
                      </p>
                      <p className={`${muted} mt-1`}>
                        {allocation.toFixed(1)}% of invested cost
                      </p>
                    </div>
                  </div>
                  <div className="mt-3 h-2 overflow-hidden rounded-full bg-white/10">
                    <div
                      className="h-full rounded-full bg-cyan-400"
                      style={{ width: `${allocation}%` }}
                    />
                  </div>
                  <p className={`${muted} mt-2 text-xs`}>
                    Average purchase price: {formatMoney(Number(holding.avgPrice) || 0)}
                  </p>
                </div>
              )
            })}
          </div>
        )}
      </section>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <section className={panel}>
          <h2 className="text-lg font-semibold text-white">
            Capital Allocation
          </h2>
          <p className={`${muted} mt-1`}>
            How your simulated capital is currently distributed.
          </p>

          <div className="mt-5 space-y-4">
            <div>
              <div className="flex justify-between gap-3 text-sm">
                <span className="text-slate-300">Invested</span>
                <span className="text-white">
                  {totalAssets > 0
                    ? ((invested / totalAssets) * 100).toFixed(1)
                    : '0.0'}%
                </span>
              </div>
              <div className="mt-2 h-2 overflow-hidden rounded-full bg-white/10">
                <div
                  className="h-full rounded-full bg-cyan-400"
                  style={{
                    width: `${totalAssets > 0 ? Math.min((invested / totalAssets) * 100, 100) : 0}%`,
                  }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between gap-3 text-sm">
                <span className="text-slate-300">Cash</span>
                <span className="text-white">
                  {totalAssets > 0
                    ? ((cash / totalAssets) * 100).toFixed(1)
                    : '0.0'}%
                </span>
              </div>
              <div className="mt-2 h-2 overflow-hidden rounded-full bg-white/10">
                <div
                  className="h-full rounded-full bg-violet-400"
                  style={{
                    width: `${totalAssets > 0 ? Math.min((cash / totalAssets) * 100, 100) : 0}%`,
                  }}
                />
              </div>
            </div>
          </div>
        </section>

        <section className={panel}>
          <h2 className="text-lg font-semibold text-white">
            Trading Summary
          </h2>
          <p className={`${muted} mt-1`}>
            Activity across your recorded paper-trading orders.
          </p>

          <div className="mt-5 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-300">Total orders</span>
              <span className="font-medium text-white">{trades.length}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-300">Buy orders</span>
              <span className="font-medium text-cyan-300">
                {trades.filter((trade) => trade.side === 'BUY').length}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-300">Sell orders</span>
              <span className="font-medium text-violet-300">
                {trades.filter((trade) => trade.side === 'SELL').length}
              </span>
            </div>
          </div>
        </section>
      </div>

      <p className="text-xs text-slate-500">
        All figures use saved paper-trading data. Holdings are valued at their
        average purchase cost, not live market prices. This page does not
        represent a real brokerage portfolio.
      </p>
    </div>
  )
}




function TransactionsPage({ userId }: { userId: string }) {
  type Trade = {
    id: number
    side: 'BUY' | 'SELL'
    symbol: string
    quantity: number
    price: number
    total: number
    date: string
  }

 
  const [trades, setTrades] = useState<Trade[]>([])
  const [, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false

    async function loadTrades() {
      const { data, error } = await supabase
        .from('paper_trading_trades')
        .select('id, side, symbol, quantity, price, total, legacy_date, traded_at')
        .eq('user_id', userId)
        .order('id', { ascending: false })

      if (cancelled) return

      if (error) {
        console.error('Failed to load transactions:', error)
      } else {
        setTrades(
          (data ?? []).map((trade) => ({
            id: Number(trade.id),
            side: trade.side as Trade['side'],
            symbol: trade.symbol,
            quantity: Number(trade.quantity),
            price: Number(trade.price),
            total: Number(trade.total),
            date:
              trade.legacy_date ??
              new Date(trade.traded_at).toLocaleString('en-IN'),
          }))
        )
      }

      setLoading(false)
    }

    void loadTrades()

    return () => {
      cancelled = true
    }
  }, [userId])


  const [search, setSearch] = useState('')
  const [sideFilter, setSideFilter] = useState('ALL')

  const filteredTrades = trades.filter((trade) => {
    const matchesSearch =
      String(trade.symbol || '').toLowerCase().includes(search.toLowerCase()) ||
      String(trade.date || '').toLowerCase().includes(search.toLowerCase())

    const matchesSide = sideFilter === 'ALL' || trade.side === sideFilter

    return matchesSearch && matchesSide
  })

  const formatMoney = (value: number) =>
    `₹${Number(value || 0).toLocaleString('en-IN', {
      maximumFractionDigits: 2,
    })}`

  const panel =
    'rounded-2xl border border-white/[0.08] bg-[#121a2e] p-5'
  const muted = 'text-sm text-slate-400'

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-white">Transactions</h1>
        <p className="mt-1 text-sm text-slate-400">
          Search and review every recorded paper-trading order.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className={panel}>
          <p className={muted}>Total transactions</p>
          <p className="mt-3 text-2xl font-semibold text-white">
            {trades.length}
          </p>
        </div>
        <div className={panel}>
          <p className={muted}>Buy orders</p>
          <p className="mt-3 text-2xl font-semibold text-cyan-300">
            {trades.filter((trade) => trade.side === 'BUY').length}
          </p>
        </div>
        <div className={panel}>
          <p className={muted}>Sell orders</p>
          <p className="mt-3 text-2xl font-semibold text-violet-300">
            {trades.filter((trade) => trade.side === 'SELL').length}
          </p>
        </div>
      </div>

      <section className={panel}>
        <div className="flex flex-col gap-4 sm:flex-row">
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search by stock or date..."
            className="min-w-0 flex-1 rounded-xl border border-white/10 bg-[#0a0f1c] px-4 py-3 text-sm text-white outline-none placeholder:text-slate-500 focus:border-cyan-400/50"
          />

          <select
            value={sideFilter}
            onChange={(event) => setSideFilter(event.target.value)}
            className="rounded-xl border border-white/10 bg-[#0a0f1c] px-4 py-3 text-sm text-white outline-none focus:border-cyan-400/50"
          >
            <option value="ALL">All transactions</option>
            <option value="BUY">Buys only</option>
            <option value="SELL">Sells only</option>
          </select>
        </div>

        <div className="mt-5 flex items-center justify-between gap-3">
          <h2 className="text-lg font-semibold text-white">
            Transaction Ledger
          </h2>
          <span className={muted}>
            {filteredTrades.length} results
          </span>
        </div>

        {filteredTrades.length === 0 ? (
          <div className="mt-5 rounded-xl border border-dashed border-white/10 p-8 text-center">
            <p className="font-medium text-white">No transactions found</p>
            <p className={`${muted} mt-2`}>
              Try changing your search or filter, or place a paper trade.
            </p>
          </div>
        ) : (
          <div className="mt-5 overflow-x-auto">
            <table className="market-watch-table w-full text-left text-sm">
              <thead>
                <tr className="border-b border-white/10 text-slate-400">
                  <th className="pb-3 pr-4 font-medium">Date</th>
                  <th className="pb-3 pr-4 font-medium">Stock</th>
                  <th className="pb-3 pr-4 font-medium">Side</th>
                  <th className="pb-3 pr-4 text-right font-medium">Qty</th>
                  <th className="pb-3 pr-4 text-right font-medium">Price</th>
                  <th className="pb-3 text-right font-medium">Total</th>
                </tr>
              </thead>
              <tbody>
                {filteredTrades.map((trade, index) => (
                  <tr
                    key={trade.id ?? index}
                    className="border-b border-white/[0.05] last:border-0"
                  >
                    <td className="whitespace-nowrap py-4 pr-4 text-slate-400">
                      {trade.date || '—'}
                    </td>
                    <td className="py-4 pr-4 font-medium text-white">
                      {trade.symbol}
                    </td>
                    <td className="py-4 pr-4">
                      <span
                        className={`rounded-lg px-2.5 py-1 text-xs font-semibold ${
                          trade.side === 'BUY'
                            ? 'bg-cyan-400/10 text-cyan-300'
                            : 'bg-violet-400/10 text-violet-300'
                        }`}
                      >
                        {trade.side}
                      </span>
                    </td>
                    <td className="py-4 pr-4 text-right text-slate-300">
                      {trade.quantity}
                    </td>
                    <td className="whitespace-nowrap py-4 pr-4 text-right text-slate-300">
                      {formatMoney(trade.price)}
                    </td>
                    <td className="whitespace-nowrap py-4 text-right font-medium text-white">
                      {formatMoney(trade.total)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  )
}



function ResearchComparePage() {
   const stocks = stockCatalogue.map((seed) => {
    const research = getCompanyResearch(seed.symbol)
    const previous = research.financials.annual['FY2024']
    const latest = research.financials.annual['FY2025']

    const growth =
      previous?.revenue != null &&
      previous.revenue !== 0 &&
      latest?.revenue != null
        ? ((latest.revenue - previous.revenue) /
            previous.revenue) *
          100
        : null

    return {
      symbol: seed.symbol,
      name: seed.name,
      sector: seed.sector,
      pe: research.valuation.pe,
      pb: research.valuation.pb,
      evEbitda: research.valuation.evEbitda,
      peg: research.valuation.peg,
      roe: research.valuation.roe,
      roce: research.valuation.roce,
      debt: research.valuation.debtEquity,
      operatingMargin: research.valuation.operatingMargin,
      netMargin: research.valuation.netMargin,
      interestCoverage: research.valuation.interestCoverage,
      currentRatio: research.valuation.currentRatio,
      freeCashFlow: research.valuation.freeCashFlow,
      growth,
    }
  })


  const [selected, setSelected] = useState<string[]>([
    'RELIANCE',
    'TCS',
    'HDFCBANK',
  ])

  const [search, setSearch] = useState('')

  const chosen = stocks.filter((stock) => selected.includes(stock.symbol))






const filteredStocks = stocks.filter((stock) =>
  `${stock.symbol} ${stock.name} ${stock.sector}`
    .toLowerCase()
    .includes(search.toLowerCase().trim())
)

const displayedStocks = search.trim()
  ? filteredStocks.slice(0, 30)
  : filteredStocks
      .filter((stock) =>
        [
          'RELIANCE', 'TCS', 'HDFCBANK', 'INFY', 'ITC',
          'ICICIBANK', 'BHARTIARTL', 'SBIN', 'LT', 'MARUTI',
        ].includes(stock.symbol)
      )
      .slice(0, 10)






  const toggleStock = (symbol: string) => {
    setSelected((current) =>
      current.includes(symbol)
        ? current.filter((item) => item !== symbol)
        : current.length < 4
          ? [...current, symbol]
          : current
    )
  }

  const panel =
    'rounded-2xl border border-white/[0.08] bg-[#121a2e] p-5'
  const muted = 'text-sm text-slate-400'

    const metrics = [
    { label: 'P/E ratio', key: 'pe', suffix: '×', lowerBetter: true },
    { label: 'Price/book', key: 'pb', suffix: '×', lowerBetter: true },
    { label: 'EV/EBITDA', key: 'evEbitda', suffix: '×', lowerBetter: true },
    { label: 'PEG ratio', key: 'peg', suffix: '×', lowerBetter: true },
    { label: 'Return on equity', key: 'roe', suffix: '%', lowerBetter: false },
    { label: 'Return on capital', key: 'roce', suffix: '%', lowerBetter: false },
    { label: 'Debt/equity', key: 'debt', suffix: '×', lowerBetter: true },
    { label: 'Operating margin', key: 'operatingMargin', suffix: '%', lowerBetter: false },
    { label: 'Net margin', key: 'netMargin', suffix: '%', lowerBetter: false },
    { label: 'Interest coverage', key: 'interestCoverage', suffix: '×', lowerBetter: false },
    { label: 'Current ratio', key: 'currentRatio', suffix: '×', lowerBetter: false },
    { label: 'Revenue growth', key: 'growth', suffix: '%', lowerBetter: false },
    { label: 'Free cash flow', key: 'freeCashFlow', suffix: '', lowerBetter: false },
  ] as const

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-white">
          Research & Compare
        </h1>
        <p className="mt-1 text-sm text-slate-400">
          Compare company fundamentals side by side.
        </p>
      </div>

      <section className={panel}>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-semibold text-white">
              Choose Companies
            </h2>
            <p className={`${muted} mt-1`}>
              Select up to four companies to compare.
            </p>
          </div>
          <span className="text-sm text-cyan-300">
            {selected.length}/4 selected
          </span>
        </div>

       
<div className="mt-5">
  <input
    type="text"
    value={search}
    onChange={(event) => setSearch(event.target.value)}
    placeholder="Search by company name, symbol, or sector..."
    className="w-full rounded-xl border border-white/10 bg-[#0a0f1c] px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-cyan-400/50"
  />
</div>

<div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">

         {displayedStocks.map((stock) => {
            const isSelected = selected.includes(stock.symbol)

            return (
              <button
                key={stock.symbol}
                type="button"
                onClick={() => toggleStock(stock.symbol)}
                className={`rounded-xl border p-4 text-left transition ${
                  isSelected
                    ? 'border-cyan-400/50 bg-cyan-400/[0.07]'
                    : 'border-white/[0.08] bg-white/[0.02] hover:bg-white/[0.05]'
                }`}
              >
                <div className="flex items-center justify-between gap-3">
                  <span className="font-semibold text-white">
                    {stock.symbol}
                  </span>
                  <span
                    className={`flex size-5 items-center justify-center rounded-md border text-xs ${
                      isSelected
                        ? 'border-cyan-400 bg-cyan-400 text-slate-950'
                        : 'border-white/20 text-transparent'
                    }`}
                  >
                    ✓
                  </span>
                </div>
                <p className={`${muted} mt-2`}>{stock.name}</p>
                <p className="mt-3 text-xs text-slate-500">{stock.sector}</p>
              </button>
            )
          })}
        </div>

        <p className={`${muted} mt-4 text-xs`}>
          The figures below are illustrative demo values, not verified current
          financial data. They are provided to demonstrate the comparison UI.
        </p>
      </section>

      <section className={panel}>
        <h2 className="text-lg font-semibold text-white">
          Fundamentals Comparison
        </h2>
        <p className={`${muted} mt-1`}>
          Compare the selected companies across key metrics.
        </p>

        {chosen.length === 0 ? (
          <p className="mt-6 text-sm text-slate-400">
            Select at least one company above to begin comparing.
          </p>
        ) : (
          <div className="mt-5 overflow-x-auto">
            <table className="w-full border-collapse text-left text-sm">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="min-w-36 pb-4 pr-5 font-medium text-slate-400">
                    Metric
                  </th>
                  {chosen.map((stock) => (
                    <th
                      key={stock.symbol}
                      className="min-w-32 pb-4 pr-5 font-semibold text-white"
                    >
                      {stock.symbol}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
               
{metrics.map((metric) => {
  const available = chosen
    .map((stock) => ({
      symbol: stock.symbol,
      value: stock[metric.key],
    }))
    .filter(
      (item) =>
        typeof item.value === 'number' &&
        Number.isFinite(item.value)
    )

  const best =
    available.length > 0
      ? metric.lowerBetter
        ? Math.min(...available.map((item) => item.value as number))
        : Math.max(...available.map((item) => item.value as number))
      : null

  return (
    <tr
      key={metric.key}
      className="border-b border-white/[0.05] last:border-0"
    >
      <td className="py-4 pr-5 text-slate-300">
        {metric.label}
      </td>

      {chosen.map((stock) => {
        const value = stock[metric.key]
        const isAvailable =
          typeof value === 'number' && Number.isFinite(value)
        const isBest = isAvailable && best !== null && value === best

        return (
          <td key={stock.symbol} className="py-4 pr-5">
            <span
              className={`font-medium ${
                isBest ? 'text-cyan-300' : 'text-slate-300'
              }`}
            >
              {isAvailable
                ? `${value.toFixed(2)}${metric.suffix}`
                : 'N/A'}
            </span>
          </td>
        )
      })}
    </tr>
  )
})}

              </tbody>
            </table>
          </div>
        )}
      </section>

      
<section className={panel}>
  <h2 className="text-lg font-semibold text-white">
    How to interpret the comparison
  </h2>
  <p className={`${muted} mt-1`}>
    Use these metrics together. No single ratio establishes whether a
    company is a good investment.
  </p>

  <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-2">
    {[
      {
        title: 'Valuation',
        metrics: 'P/E, Price/book, EV/EBITDA, PEG',
        description:
          'Compare what you pay against earnings, book value and operating earnings. Lower multiples are not automatically better. PEG also depends on the quality and period of its growth estimate.',
      },
      {
        title: 'Profitability & Returns',
        metrics: 'Return on equity, Return on capital',
        description:
          'ROE measures returns relative to shareholders’ equity; ROCE assesses returns on capital employed. Check leverage, business models and accounting differences when comparing companies.',
      },
      {
        title: 'Debt & Liquidity',
        metrics: 'Debt/equity, Interest coverage, Current ratio',
        description:
          'Assess leverage, ability to cover interest and short-term liquidity together. Banks and other financial companies have different balance sheets, so these ratios may not be comparable with non-financial firms.',
      },
      {
        title: 'Margins & Growth',
        metrics: 'Operating margin, Net margin, Revenue growth',
        description:
          'Margins indicate how much revenue remains after operating costs or all expenses. Revenue growth compares annual revenue across the available periods; check whether growth is consistent and profitable.',
      },
      {
        title: 'Cash Generation',
        metrics: 'Free cash flow',
        description:
          'Free cash flow indicates cash remaining after operating cash flows and capital expenditure, depending on the source definition. Check the reporting period and units; negative values are not automatically a failure.',
      },
      {
        title: 'Data Quality',
        metrics: 'Illustrative research data',
        description:
          'Current figures are demo estimates, not verified live financial data. Treat missing values as unavailable, confirm definitions and reporting periods, and verify figures against company filings before making investment decisions.',
      },
    ].map((item) => (
      <div
        key={item.title}
        className="rounded-xl border border-white/[0.07] bg-white/[0.02] p-4"
      >
        <h3 className="font-medium text-white">{item.title}</h3>
        <p className="mt-1 text-xs font-medium text-cyan-300">
          {item.metrics}
        </p>
        <p className={`${muted} mt-3 text-xs leading-5`}>
          {item.description}
        </p>
      </div>
    ))}
  </div>
</section>



    </div>
  )
}



function AlertsPage() {
  type Alert = {
    id: number
    symbol: string
    condition: 'ABOVE' | 'BELOW'
    target: string
    note: string
   createdAt: string
enabled: boolean
triggered?: boolean
  }

  const [alerts, setAlerts] = useState<Alert[]>(() => {
    try {
      const saved = JSON.parse(localStorage.getItem('tavrixa-alerts') || '[]')
      return Array.isArray(saved) ? saved : []
    } catch {
      return []
    }
  })

  const [symbol, setSymbol] = useState('RELIANCE')
  const [condition, setCondition] = useState<'ABOVE' | 'BELOW'>('ABOVE')
  const [target, setTarget] = useState('')
  const [note, setNote] = useState('')
  const [error, setError] = useState('')

 const stocks = getSimulatedStocks()

  const saveAlerts = (next: Alert[]) => {
    setAlerts(next)
    localStorage.setItem('tavrixa-alerts', JSON.stringify(next))
  }

  const addAlert = () => {
    const price = Number(target)

    if (!Number.isFinite(price) || price <= 0) {
      setError('Enter a valid target price greater than zero.')
      return
    }

    const next: Alert[] = [
      {
        id: Date.now(),
        symbol,
        condition,
        target: price.toString(),
        note: note.trim(),
        createdAt: new Date().toLocaleDateString('en-IN'),
        enabled: true,
      },
      ...alerts,
    ]

    saveAlerts(next)
    setTarget('')
    setNote('')
    setError('')
  }

  const panel =
    'rounded-2xl border border-white/[0.08] bg-[#121a2e] p-5'
  const muted = 'text-sm text-slate-400'

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-white">Price Alerts</h1>
        <p className="mt-1 text-sm text-slate-400">
          Create and manage price levels you want to monitor.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className={panel}>
          <p className={muted}>Total alerts</p>
          <p className="mt-3 text-3xl font-semibold text-white">
            {alerts.length}
          </p>
        </div>
        <div className={panel}>
          <p className={muted}>Enabled</p>
          <p className="mt-3 text-3xl font-semibold text-cyan-300">
            {alerts.filter((alert) => alert.enabled).length}
          </p>
        </div>
        <div className={panel}>
          <p className={muted}>Paused</p>
          <p className="mt-3 text-3xl font-semibold text-slate-300">
            {alerts.filter((alert) => !alert.enabled).length}
          </p>
        </div>
      </div>

      <section className={panel}>
        <h2 className="text-lg font-semibold text-white">Create an Alert</h2>
        <p className={`${muted} mt-1`}>
          Save a target price for a stock you are tracking.
        </p>

        <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm text-slate-300">
              Stock
            </label>
            <select
              value={symbol}
              onChange={(event) => setSymbol(event.target.value)}
              className="w-full rounded-xl border border-white/10 bg-[#0a0f1c] px-4 py-3 text-sm text-white outline-none focus:border-cyan-400/50"
            >
             {stocks.map((stock) => (
  <option key={stock.symbol} value={stock.symbol}>
    {stock.symbol} — {stock.name}
  </option>
))}
            </select>
          </div>

          <div>
            <label className="mb-2 block text-sm text-slate-300">
              Condition
            </label>
            <select
              value={condition}
              onChange={(event) =>
                setCondition(event.target.value as 'ABOVE' | 'BELOW')
              }
              className="w-full rounded-xl border border-white/10 bg-[#0a0f1c] px-4 py-3 text-sm text-white outline-none focus:border-cyan-400/50"
            >
              <option value="ABOVE">Price rises above</option>
              <option value="BELOW">Price falls below</option>
            </select>
          </div>

          <div>
            <label className="mb-2 block text-sm text-slate-300">
              Target Price (₹)
            </label>
            <input
              type="number"
              min="0.01"
              step="0.01"
              value={target}
              onChange={(event) => setTarget(event.target.value)}
              placeholder="e.g. 1500"
              className="w-full rounded-xl border border-white/10 bg-[#0a0f1c] px-4 py-3 text-sm text-white outline-none placeholder:text-slate-500 focus:border-cyan-400/50"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm text-slate-300">
              Note (optional)
            </label>
            <input
              value={note}
              onChange={(event) => setNote(event.target.value)}
              placeholder="Why this level matters"
              className="w-full rounded-xl border border-white/10 bg-[#0a0f1c] px-4 py-3 text-sm text-white outline-none placeholder:text-slate-500 focus:border-cyan-400/50"
            />
          </div>
        </div>

        {error && <p className="mt-3 text-sm text-rose-400">{error}</p>}

        <button
          type="button"
          onClick={addAlert}
          className="mt-5 rounded-xl bg-cyan-400 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-300"
        >
          Create Alert
        </button>
      </section>

      <section className={panel}>
        <h2 className="text-lg font-semibold text-white">Your Alerts</h2>
        <p className={`${muted} mt-1`}>
          Your saved target levels and alert settings.
        </p>

        {alerts.length === 0 ? (
          <div className="mt-5 rounded-xl border border-dashed border-white/10 p-8 text-center">
            <p className="font-medium text-white">No alerts created</p>
            <p className={`${muted} mt-2`}>
              Add a target price above to start building your alert list.
            </p>
          </div>
        ) : (
          <div className="mt-5 space-y-3">
            {alerts.map((alert) => (
              <div
                key={alert.id}
                className="flex flex-col gap-4 rounded-xl border border-white/[0.07] p-4 sm:flex-row sm:items-center sm:justify-between"
              >
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-semibold text-white">
                      {alert.symbol}
                    </span>
                    <span className="rounded-full bg-cyan-400/10 px-2.5 py-1 text-xs text-cyan-300">
                      {alert.condition === 'ABOVE' ? 'Above' : 'Below'} ₹
                      {Number(alert.target).toLocaleString('en-IN')}
                    </span>
                    <span
                      className={`rounded-full px-2.5 py-1 text-xs ${
                        alert.enabled
                          ? 'bg-emerald-400/10 text-emerald-300'
                          : 'bg-white/[0.06] text-slate-400'
                      }`}
                    >
                      {alert.triggered ? 'Triggered' : alert.enabled ? 'Enabled' : 'Paused'}
                    </span>
                  </div>
                  {alert.note && (
                    <p className={`${muted} mt-2`}>{alert.note}</p>
                  )}
                  <p className="mt-2 text-xs text-slate-500">
                    Created {alert.createdAt}
                  </p>
                </div>

                <div className="flex shrink-0 gap-2">
                  <button
                    type="button"
                    onClick={() =>
                      saveAlerts(
                        alerts.map((item) =>
                          item.id === alert.id
                            ? { ...item, enabled: !item.enabled }
                            : item
                        )
                      )
                    }
                    className="rounded-lg border border-white/10 px-3 py-2 text-sm text-slate-300 hover:bg-white/[0.05]"
                  >
                    {alert.enabled ? 'Pause' : 'Enable'}
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      saveAlerts(alerts.filter((item) => item.id !== alert.id))
                    }
                    className="rounded-lg border border-rose-400/20 px-3 py-2 text-sm text-rose-300 hover:bg-rose-400/10"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <p className="text-xs text-slate-500">
        Alerts are currently saved in this browser. They do not monitor live
        prices or send notifications yet; we’ll connect that functionality
        when the market-data layer is implemented.
      </p>
    </div>
  )
}



function TradingLabPage() {
  const [capital, setCapital] = useState(100000)
  const [riskPercent, setRiskPercent] = useState(1)
  const [entryPrice, setEntryPrice] = useState(1000)
  const [stopLossPercent, setStopLossPercent] = useState(5)
  const [targetPercent, setTargetPercent] = useState(10)

  const valid =
    capital > 0 &&
    riskPercent > 0 &&
    entryPrice > 0 &&
    stopLossPercent > 0 &&
    targetPercent > 0

  const riskAmount = valid ? capital * riskPercent / 100 : 0
  const stopDistance = valid ? entryPrice * stopLossPercent / 100 : 0
  const riskBasedQty = valid ? Math.floor(riskAmount / stopDistance) : 0
  const affordableQty = valid ? Math.floor(capital / entryPrice) : 0
  const quantity = Math.min(riskBasedQty, affordableQty)
  const positionValue = quantity * entryPrice
  const potentialLoss = quantity * stopDistance
  const potentialProfit = quantity * entryPrice * targetPercent / 100
  const rewardRisk = valid ? targetPercent / stopLossPercent : 0

  const money = (value: number) =>
    '₹' + value.toLocaleString('en-IN', {
      maximumFractionDigits: 2,
    })

  const fieldClass =
    'mt-2 w-full rounded-xl border border-slate-700 bg-[#0a0f1c] px-3 py-3 text-sm text-white outline-none focus:border-cyan-400'

  return (
    <div className="space-y-6">
      <div>
        <div className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-400">
          Trading Lab
        </div>
        <h1 className="mt-2 text-2xl font-bold text-white sm:text-3xl">
          Strategy Sandbox
        </h1>
        <p className="mt-2 max-w-2xl text-sm text-slate-400">
          Test your position size, downside risk, and potential reward before
          placing a simulated trade.
        </p>
      </div>

      <div className="grid gap-5 xl:grid-cols-[1.1fr_0.9fr]">
        <section className="rounded-2xl border border-slate-800 bg-[#121a2e] p-5 sm:p-6">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-lg font-semibold text-white">
              Strategy Parameters
            </h2>
            <span className="rounded-full bg-cyan-400/10 px-3 py-1 text-xs text-cyan-300">
              Adjustable
            </span>
          </div>

          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <label className="text-sm text-slate-300">
              Available capital (₹)
              <input
                type="number"
                min="1"
                value={capital}
                onChange={(e) => setCapital(Number(e.target.value))}
                className={fieldClass}
              />
            </label>

            <label className="text-sm text-slate-300">
              Risk per trade (%)
              <input
                type="number"
                min="0.1"
                max="100"
                step="0.1"
                value={riskPercent}
                onChange={(e) => setRiskPercent(Number(e.target.value))}
                className={fieldClass}
              />
            </label>

            <label className="text-sm text-slate-300">
              Entry price (₹)
              <input
                type="number"
                min="0.01"
                step="0.05"
                value={entryPrice}
                onChange={(e) => setEntryPrice(Number(e.target.value))}
                className={fieldClass}
              />
            </label>

            <label className="text-sm text-slate-300">
              Stop-loss distance (%)
              <input
                type="number"
                min="0.1"
                max="100"
                step="0.1"
                value={stopLossPercent}
                onChange={(e) => setStopLossPercent(Number(e.target.value))}
                className={fieldClass}
              />
            </label>

            <label className="text-sm text-slate-300 sm:col-span-2">
              Target distance (%)
              <input
                type="number"
                min="0.1"
                step="0.1"
                value={targetPercent}
                onChange={(e) => setTargetPercent(Number(e.target.value))}
                className={fieldClass}
              />
            </label>
          </div>

          <div className="mt-5 border-t border-slate-800 pt-5">
            <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-500">
              Quick risk presets
            </p>
            <div className="flex flex-wrap gap-2">
              {[
                { label: 'Conservative · 0.5%', value: 0.5 },
                { label: 'Balanced · 1%', value: 1 },
                { label: 'Aggressive · 2%', value: 2 },
              ].map((preset) => (
                <button
                  key={preset.value}
                  onClick={() => setRiskPercent(preset.value)}
                  className={`rounded-xl border px-3 py-2 text-xs transition ${
                    riskPercent === preset.value
                      ? 'border-cyan-400 bg-cyan-400/10 text-cyan-300'
                      : 'border-slate-700 text-slate-400 hover:border-slate-500'
                  }`}
                >
                  {preset.label}
                </button>
              ))}
            </div>
          </div>
        </section>

        <section className="rounded-2xl border border-slate-800 bg-[#121a2e] p-5 sm:p-6">
          <h2 className="text-lg font-semibold text-white">
            Simulation Results
          </h2>
          <p className="mt-1 text-sm text-slate-400">
            Recalculates automatically as you change the inputs.
          </p>

          {!valid ? (
            <div className="mt-6 rounded-xl border border-amber-500/30 bg-amber-500/10 p-4 text-sm text-amber-300">
              Enter positive values for all parameters to calculate the
              simulation.
            </div>
          ) : (
            <>
              <div className="mt-5 rounded-xl border border-cyan-400/20 bg-cyan-400/5 p-4">
                <p className="text-sm text-slate-400">
                  Estimated Position Size
                </p>
                <div className="mt-1 text-3xl font-bold text-white">
                  {quantity.toLocaleString('en-IN')}{' '}
                  <span className="text-base font-medium text-slate-400">
                    shares
                  </span>
                </div>
                <p className="mt-2 text-xs text-slate-400">
                  Position Value: {money(positionValue)}
                </p>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-3">
                <div className="rounded-xl bg-[#0a0f1c] p-4">
                  <p className="text-xs text-slate-400">Risk budget</p>
                  <p className="mt-2 text-lg font-semibold text-white">
                    {money(riskAmount)}
                  </p>
                </div>
                <div className="rounded-xl bg-[#0a0f1c] p-4">
                  <p className="text-xs text-slate-400">Risk : Reward</p>
                  <p className="mt-2 text-lg font-semibold text-cyan-300">
                    1 : {rewardRisk.toFixed(2)}
                  </p>
                </div>
                <div className="rounded-xl bg-[#0a0f1c] p-4">
                  <p className="text-xs text-slate-400">Potential loss</p>
                  <p className="mt-2 text-lg font-semibold text-rose-400">
                    −{money(potentialLoss)}
                  </p>
                </div>
                <div className="rounded-xl bg-[#0a0f1c] p-4">
                  <p className="text-xs text-slate-400">Potential profit</p>
                  <p className="mt-2 text-lg font-semibold text-emerald-400">
                    +{money(potentialProfit)}
                  </p>
                </div>
              </div>

              <div className="mt-4 space-y-3 rounded-xl border border-slate-800 p-4 text-sm">
                <div className="flex justify-between gap-3">
                  <span className="text-slate-400">Stop-loss price</span>
                  <span className="font-medium text-white">
                    {money(entryPrice * (1 - stopLossPercent / 100))}
                  </span>
                </div>
                <div className="flex justify-between gap-3">
                  <span className="text-slate-400">Target price</span>
                  <span className="font-medium text-white">
                    {money(entryPrice * (1 + targetPercent / 100))}
                  </span>
                </div>
                <div className="flex justify-between gap-3">
                  <span className="text-slate-400">Capital used</span>
                  <span className="font-medium text-white">
                    {capital > 0
                      ? ((positionValue / capital) * 100).toFixed(1)
                      : '0.0'}
                    %
                  </span>
                </div>
              </div>

              {riskBasedQty > affordableQty && (
                <p className="mt-4 rounded-xl bg-amber-500/10 p-3 text-xs text-amber-300">
                  Position size is capped by available capital. Your full
                  risk budget may not be used.
                </p>
              )}

              {quantity === 0 && (
                <p className="mt-4 rounded-xl bg-amber-500/10 p-3 text-xs text-amber-300">
                  Available capital is insufficient to buy one share at this
                  entry price while staying within the selected risk limit.
                </p>
              )}
            </>
          )}
        </section>
      </div>

      <div className="rounded-2xl border border-slate-800 bg-[#121a2e] p-5">
        <h3 className="font-semibold text-white">How to use this lab</h3>
        <div className="mt-3 grid gap-4 text-sm text-slate-400 sm:grid-cols-3">
          <div>
            <span className="font-medium text-cyan-300">01 · Define risk</span>
            <p className="mt-1">
              Set the maximum amount of capital you are willing to risk.
            </p>
          </div>
          <div>
            <span className="font-medium text-cyan-300">02 · Set your levels</span>
            <p className="mt-1">
              Enter a hypothetical entry price, stop-loss, and target.
            </p>
          </div>
          <div>
            <span className="font-medium text-cyan-300">03 · Evaluate</span>
            <p className="mt-1">
              Compare the estimated downside with the potential reward before
              testing a strategy further.
            </p>
          </div>
        </div>
        <p className="mt-5 border-t border-slate-800 pt-4 text-xs text-slate-500">
          Calculator only. Results are hypothetical and exclude brokerage,
          taxes, slippage, gaps, and execution risk. This is not a historical
          backtest or a live trading signal.
        </p>
      </div>
    </div>
  )
}



function App() {

  const [session, setSession] = useState<Session | null>(null)
const [authReady, setAuthReady] = useState(false)

  const [stocks, setStocks] = useState(() =>
  getSimulatedStocks().map((stock) => ({
    ...stock,
    price: stock.price.toLocaleString('en-IN', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }),
  }))
)


useEffect(() => {
  let mounted = true

  supabase.auth.getSession().then(({ data, error }) => {
    if (!mounted) return

    if (error) {
      console.error('Failed to retrieve Supabase session:', error.message)
    }

    setSession(data.session)
    setAuthReady(true)
  })

  const {
    data: { subscription },
  } = supabase.auth.onAuthStateChange((_event, newSession) => {
    if (!mounted) return

    setSession(newSession)
    setAuthReady(true)
  })

  return () => {
    mounted = false
    subscription.unsubscribe()
  }
}, [])



useEffect(() => {
  return subscribeToMarket(() => {
    setStocks(
      getSimulatedStocks().map((stock) => ({
        ...stock,
        price: stock.price.toLocaleString('en-IN', {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        }),
      }))
    )
  })
}, [])

  const [active, setActive] = useState('Overview')
  const [theme, setTheme] = useState(
  () => localStorage.getItem('tavrixa-theme') || 'dark'
)

const isLight = theme === 'light' ||
  (theme === 'system' &&
    window.matchMedia('(prefers-color-scheme: light)').matches)
  const [paperTradingSymbol, setPaperTradingSymbol] = useState('RELIANCE')
const [paperTradingSide, setPaperTradingSide] = useState<'BUY' | 'SELL'>('BUY')
  const [profileOpen, setProfileOpen] = useState(false)
const [profileName, setProfileName] = useState('MHCx')

const [profileEmail, setProfileEmail] = useState('')

  const [drawerOpen, setDrawerOpen] = useState(false)
  const [notificationsOpen, setNotificationsOpen] = useState(false)
  useEffect(() => {
  setNotificationsOpen(false)
}, [active])

const [, setNotificationsRead] = useState(false)

type AppNotification = {
  id: string
  title: string
  message: string
  timestamp: string
  read: boolean
}

const [notifications, setNotifications] = useState<AppNotification[]>(() => {
  try {
    const saved = JSON.parse(
      localStorage.getItem('tavrixa-notifications') || 'null'
    )
    if (Array.isArray(saved)) return saved
  } catch {}

  return [{
    id: 'welcome',
    title: 'Welcome to Tavrixa',
    message: 'Explore stocks, organise your research, and practise with paper trading.',
    timestamp: 'Workspace update',
    read: false,
  }]
})

useEffect(() => {
  localStorage.setItem('tavrixa-notifications', JSON.stringify(notifications))
}, [notifications])



const playAlertSound = () => {
  try {
    const AudioContextClass =
      window.AudioContext ||
      (window as typeof window & {
        webkitAudioContext?: typeof AudioContext
      }).webkitAudioContext

    if (!AudioContextClass) return

    const audio = new AudioContextClass()
    const oscillator = audio.createOscillator()
    const gain = audio.createGain()

    oscillator.type = 'sine'
    oscillator.frequency.setValueAtTime(660, audio.currentTime)
    oscillator.frequency.setValueAtTime(880, audio.currentTime + 0.15)

    gain.gain.setValueAtTime(0.0001, audio.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.12, audio.currentTime + 0.02)
    gain.gain.exponentialRampToValueAtTime(0.0001, audio.currentTime + 0.35)

    oscillator.connect(gain)
    gain.connect(audio.destination)

    oscillator.start()
    oscillator.stop(audio.currentTime + 0.36)
    oscillator.onended = () => void audio.close()
  } catch {
    // Notifications still work if audio is unavailable.
  }
}


const addNotification = (title: string, message: string) => {
  setNotifications((current) => [
    {
      id: `${Date.now()}-${Math.random()}`,
      title,
      message,
      timestamp: new Date().toLocaleString('en-IN'),
      read: false,
    },
    ...current,
  ])
  setNotificationsRead(false)
}

useEffect(() => {
  type StoredAlert = {
    id: number
    symbol: string
    condition: 'ABOVE' | 'BELOW'
    target: string
    note?: string
    enabled: boolean
    triggered?: boolean
  }

  const previousPrices = new Map(
    getSimulatedStocks().map((stock) => [stock.symbol, stock.price])
  )

  const unsubscribe = subscribeToMarket(() => {
    const currentStocks = getSimulatedStocks()

    let alerts: StoredAlert[]

    try {
      const saved = JSON.parse(
        localStorage.getItem('tavrixa-alerts') || '[]'
      )
      alerts = Array.isArray(saved) ? saved : []
    } catch {
      return
    }

    let changed = false

    for (const stock of currentStocks) {
      const previousPrice = previousPrices.get(stock.symbol)

      if (previousPrice !== undefined) {
        for (const alert of alerts) {
          if (!alert.enabled || alert.symbol !== stock.symbol) continue

          const targetPrice = Number(alert.target)
          if (!Number.isFinite(targetPrice) || targetPrice <= 0) continue

          const crossedAbove =
            alert.condition === 'ABOVE' &&
            previousPrice < targetPrice &&
            stock.price >= targetPrice

          const crossedBelow =
            alert.condition === 'BELOW' &&
            previousPrice > targetPrice &&
            stock.price <= targetPrice

          if (crossedAbove || crossedBelow) {
           alert.enabled = false
           alert.triggered = true
changed = true
playAlertSound()

            addNotification(
              `${stock.symbol} price alert triggered`,
              `${stock.symbol} crossed ${crossedAbove ? 'above' : 'below'} ₹${targetPrice.toFixed(2)}. Current simulated price: ₹${stock.price.toFixed(2)}.${alert.note ? ` Note: ${alert.note}` : ''}`
            )
          }
        }
      }

      previousPrices.set(stock.symbol, stock.price)
    }

    if (changed) {
      localStorage.setItem('tavrixa-alerts', JSON.stringify(alerts))
    }
  })

  return unsubscribe
}, [])

  const [query, setQuery] = useState('')
  const [selectedStock, setSelectedStock] = useState<string | null>(null)


  const [watchlist, setWatchlist] = useState<string[]>([])

  const onToggleWatchlist = async (symbol: string) => {
  if (!session?.user?.id) return

  const userId = session.user.id
  const isSaved = watchlist.includes(symbol)

  const { error } = isSaved
    ? await supabase
        .from('watchlists')
        .delete()
        .eq('user_id', userId)
        .eq('symbol', symbol)
    : await supabase
        .from('watchlists')
        .insert({ user_id: userId, symbol })

  if (error) {
    console.error('Failed to update watchlist:', error.message)
    alert('Could not update your watchlist. Please try again.')
    return
  }

  setWatchlist((current) =>
    isSaved
      ? current.filter((item) => item !== symbol)
      : current.includes(symbol)
        ? current
        : [...current, symbol]
  )
}

useEffect(() => {
  if (!session?.user?.id) {
    setWatchlist([])
    return
  }

  let cancelled = false

  const loadWatchlist = async () => {
    const { data, error } = await supabase
      .from('watchlists')
      .select('symbol')
      .eq('user_id', session.user.id)

    if (error) {
      console.error('Failed to load watchlist:', error.message)
      return
    }

    if (!cancelled) {
      setWatchlist(data.map((item) => item.symbol))
    }
  }

  void loadWatchlist()

  return () => {
    cancelled = true
  }
}, [session?.user?.id])






useEffect(() => {
  if (!session?.user) return

  const loadProfile = async () => {
    const user = session.user

    setProfileEmail(user.email ?? '')

    const { data, error } = await supabase
      .from('profiles')
      .select('display_name')
      .eq('id', user.id)
      .maybeSingle()

    if (error) {
      console.error('Failed to load profile:', error.message)
      return
    }

    if (data?.display_name) {
      setProfileName(data.display_name)
      return
    }

    const metadataName =
      typeof user.user_metadata?.display_name === 'string'
        ? user.user_metadata.display_name
        : ''

    const initialName = metadataName || user.email?.split('@')[0] || 'MHCx'

    const { error: insertError } = await supabase
      .from('profiles')
      .upsert({
        id: user.id,
        display_name: initialName,
        updated_at: new Date().toISOString(),
      })

    if (insertError) {
      console.error('Failed to create profile:', insertError.message)
      return
    }

    setProfileName(initialName)
  }

  void loadProfile()
}, [session?.user?.id])

 
const filteredStocks = stocks.filter((stock) =>
  `${stock.symbol} ${stock.name}`
    .toLowerCase()
    .includes(query.toLowerCase()),
)

const watchlistStocks = stocks.filter(
  (stock) => watchlist.includes(stock.symbol),
)

const filteredWatchlistStocks = watchlistStocks.filter((stock) =>
  `${stock.symbol} ${stock.name}`
    .toLowerCase()
    .includes(query.toLowerCase()),
)


if (!authReady) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0a0f1c] text-slate-300">
      Loading Tavrixa...
    </div>
  )
}

if (!session) {
  return <AuthPage />
}

  return (
  <div
  data-theme={isLight ? 'light' : 'dark'}
  className={`min-h-screen ${isLight ? 'bg-slate-100 text-slate-900' : 'bg-[#080b12] text-slate-100'}`}
>
      <div className="flex min-h-screen">
        <div className="hidden lg:block">
          <Sidebar active={active} onNavigate={(label) => {
  setActive(label)
  setSelectedStock(null)
  setProfileOpen(false)
}}



/>
        </div>

        <AnimatePresence>
          {drawerOpen && (
            <motion.div
              className="fixed inset-0 z-50 lg:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <button
                aria-label="Close navigation overlay"
                onClick={() => setDrawerOpen(false)}
                className="absolute inset-0 size-full bg-black/70 backdrop-blur-sm"
              />
              <motion.div
                className="absolute inset-y-0 left-0"
                initial={{ x: -280 }}
                animate={{ x: 0 }}
                exit={{ x: -280 }}
                transition={{ type: 'spring', damping: 28, stiffness: 280 }}
              >
                <Sidebar
  active={active}
  onNavigate={(label) => {
    setActive(label)
    setSelectedStock(null)
    setProfileOpen(false)
  }}
  onClose={() => setDrawerOpen(false)}
/>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        <main className="min-w-0 flex-1">
          <header className="sticky top-0 z-30 border-b border-white/[0.07] bg-[#080b12]/90 backdrop-blur-xl">
            <div className="flex h-[68px] items-center gap-3 px-4 sm:px-6 lg:px-9">
              <button
                onClick={() => setDrawerOpen(true)}
                aria-label="Open navigation"
                className="rounded-xl border border-white/[0.08] p-2.5 text-slate-300 transition hover:bg-white/[0.06] lg:hidden"
              >
                <Menu size={19} />
              </button>

              <div className="min-w-0 flex-1">
                <p className="truncate text-xs text-slate-500">
                  Workspace <span className="mx-1.5">/</span>
                  <span className="text-slate-300">{active}</span>
                </p>
              </div>        

              <button
  type="button"
  aria-label="Notifications"
  title="Notifications"
onClick={() => {
  setNotificationsOpen((open) => !open)
}}


  className="relative rounded-xl border border-white/[0.08] p-2.5 text-slate-400 transition hover:bg-white/[0.05] hover:text-white"
>
  <Bell size={18} />
 {notifications.some((item) => !item.read) && (
  <span className="absolute -right-1 -top-1 flex min-w-5 h-5 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white shadow-lg shadow-red-500/30">
    {notifications.filter((item) => !item.read).length > 99
      ? '99+'
      : notifications.filter((item) => !item.read).length}
  </span>
)}
</button>

              <button
  type="button"
  aria-label="Account menu"
  onClick={() => setProfileOpen(true)}
  className="flex size-9 items-center justify-center rounded-xl border border-white/[0.1] bg-white/[0.04] text-xs font-semibold text-cyan-200 hover:border-cyan-300/30 hover:bg-cyan-300/[0.08]"
>
  {profileName.trim().charAt(0).toUpperCase() || 'M'}
</button>
            </div>

           
          </header>

        {notificationsOpen && (
  <div className="fixed inset-0 z-[100] pointer-events-none">
   <div className="pointer-events-auto absolute right-4 top-20 w-[calc(100vw-2rem)] max-w-sm overflow-hidden rounded-2xl border border-white/[0.1] bg-[#0e141f] shadow-2xl sm:right-6 lg:right-9">
      <div className="flex items-center justify-between border-b border-white/[0.07] px-4 py-4">
        <div>
          <h3 className="text-sm font-semibold text-white">
            Notifications
          </h3>
          <p className="mt-1 text-xs text-slate-500">
            Your Tavrixa updates
          </p>
        </div>

                <div className="flex items-center gap-3">
          <button
            type="button"
          onClick={() => {
  setNotifications((current) =>
    current.map((item) => ({ ...item, read: true }))
  )
  setNotificationsRead(true)
}}
            className="text-xs text-cyan-300 transition hover:text-cyan-200"
          >
            Mark as read
          </button>

          <button
            type="button"
            aria-label="Close notifications"
            onClick={() => setNotificationsOpen(false)}
          className="flex size-10 shrink-0 items-center justify-center rounded-xl text-2xl leading-none text-slate-400 transition hover:bg-white/[0.08] hover:text-white"
          >
            ×
          </button>
        </div>
      </div>

      <div className="p-4">
       {notifications.length === 0 ? (
  <p className="py-5 text-center text-xs text-slate-500">
    You're all caught up.
  </p>
) : (
  <div className="max-h-80 space-y-3 overflow-y-auto">
    {notifications.map((item) => (
      <div
        key={item.id}
        className={`flex gap-3 rounded-xl border p-3 ${
          item.read
            ? 'border-white/[0.06] bg-white/[0.02]'
            : 'border-cyan-300/20 bg-cyan-300/[0.04]'
        }`}
      >
        <div className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-lg bg-cyan-300/10 text-cyan-300">
          <Bell size={16} />
        </div>

        <div className="min-w-0 flex-1">
          <p className="text-sm font-medium text-slate-200">
            {item.title}
          </p>
          <p className="mt-1 text-xs leading-relaxed text-slate-400">
            {item.message}
          </p>
          <p className="mt-2 text-[10px] text-slate-600">
            {item.timestamp}
          </p>
        </div>

        {!item.read && (
          <span className="mt-1 size-2 shrink-0 rounded-full bg-cyan-300" />
        )}
      </div>
    ))}


   </div>
)}
      </div>

      <div className="border-t border-white/[0.07] p-3">

        <button
          type="button"
          onClick={() => {
            setNotificationsOpen(false)
            setActive('Help & support')
          }}
        className="notification-help-btn w-full rounded-lg px-3 py-2 text-xs text-slate-400 transition-colors duration-200 hover:bg-white/[0.04] hover:text-white"
        >
          Visit Help & Support
        </button>
      </div>
    </div>
  </div>
)}

          <div className="mx-auto max-w-[1440px] px-4 pb-12 pt-7 sm:px-6 sm:pt-9 lg:px-9 lg:pt-10">


     {profileOpen ? (
  <ProfileSettings
    profileName={profileName}
    setProfileName={setProfileName}
    profileEmail={profileEmail}
    onClose={() => setProfileOpen(false)}
    onSignOut={async () => {
      const { error } = await supabase.auth.signOut()

      if (error) {
        console.error('Sign out failed:', error.message)
        window.alert(`Sign out failed: ${error.message}`)
        return
      }

      setProfileOpen(false)
    }}

     onSaveProfile={async () => {
      const user = session?.user
      if (!user) return

      const displayName = profileName.trim()

      if (!displayName) {
        window.alert('Please enter a display name.')
        return
      }

      const { error } = await supabase
        .from('profiles')
        .upsert({
          id: user.id,
          display_name: displayName,
          updated_at: new Date().toISOString(),
        })

      if (error) {
        console.error('Failed to save profile:', error.message)
        window.alert(`Could not save profile: ${error.message}`)
        return
      }

     setProfileName(displayName)
window.alert('Profile saved successfully.')
setProfileOpen(false)
    }}

  />
) : selectedStock ? (


 <StockDetail stocks={stocks}
 onBuy={() => {
  setPaperTradingSymbol(selectedStock)
  setPaperTradingSide('BUY')
  setSelectedStock(null)
  setActive('Paper Trading')
  setProfileOpen(false)
}}
onSell={() => {
  setPaperTradingSymbol(selectedStock)
  setPaperTradingSide('SELL')
  setSelectedStock(null)
  setActive('Paper Trading')
  setProfileOpen(false)
}}
  symbol={selectedStock}
  onBack={() => setSelectedStock(null)}
  watchlist={watchlist}
onToggleWatchlist={onToggleWatchlist}
/>
) : active === 'Discover Stocks' ? (
 <DiscoverStocks
  stocks={stocks}
  query={query}
  onQueryChange={setQuery}
  onSelectStock={setSelectedStock}
/>

) : active === 'Stock Screener' ? (
 <StockScreener
  stocks={stocks}
  onSelectStock={setSelectedStock}
/>
) : active === 'Watchlists' ? (
 <Watchlists
  stocks={stocks}
    watchlist={watchlist}
    onToggleWatchlist={(symbol) => {
      setWatchlist((current) =>
        current.includes(symbol)
          ? current.filter((item) => item !== symbol)
          : [...current, symbol]
      )
    }}
    onSelectStock={setSelectedStock}
    onExplore={() => setActive('Discover Stocks')}
  /> 

  
) : active === 'Help & support' ? (
  <div className="space-y-7">
    <div>
      <p className="mb-3 text-xs font-medium uppercase tracking-widest text-cyan-300">
        TAVRIXA SUPPORT CENTRE
      </p>
      <h1 className="text-2xl font-semibold text-white sm:text-3xl">
        Help & Support
      </h1>
      <p className="mt-2 text-sm text-slate-400">
        Answers, guidance, and assistance for your investment workspace.
      </p>
    </div>

    <div className="grid gap-4 sm:grid-cols-2">
      {[
        {
          title: 'Getting Started',
          text: 'Discover companies, explore available research, and add stocks to your watchlist.'
        },
        {
          title: 'Paper Trading',
          text: 'Practise simulated buy and sell transactions without using real money.'
        },
        {
          title: 'Portfolio & Trade History',
          text: 'Review your simulated trading activity and track your decisions.'
        },
        {
          title: 'Investment Journal',
          text: 'Record your thesis, reasoning, observations, and lessons learned.'
        }
      ].map((item) => (
        <div
          key={item.title}
          className="rounded-2xl border border-white/[0.08] bg-[#0e141f] p-5"
        >
          <h2 className="text-sm font-semibold text-white">{item.title}</h2>
          <p className="mt-2 text-sm leading-relaxed text-slate-400">
            {item.text}
          </p>
        </div>
      ))}
    </div>

    <section>
      <h2 className="mb-4 text-lg font-semibold text-white">
        FAQs
      </h2>

      <div className="space-y-3">
        {[
          {
            q: 'Is Tavrixa a real trading platform?',
            a: 'No. Paper trading is simulated for educational and research purposes. Tavrixa does not execute real stock market orders.'
          },
          {
            q: 'Does paper trading use real money?',
            a: 'No. The paper trading account uses simulated funds. Trades and balances shown there do not represent real investments.'
          },
          {
            q: 'Are stock prices and financial data live?',
            a: 'Data availability depends on the specific feature and its data source. Do not assume every displayed price or financial figure is real-time; verify important information with an authoritative source.'
          },
          {
            q: 'How do I add a stock to my watchlist?',
            a: 'Open Discover Stocks, select a company, and use its watchlist control if available. You can then review saved companies under Watchlists.'
          },
          {
            q: 'Why is my portfolio empty?',
            a: 'The portfolio reflects the data and simulated transactions supported by the current app. It does not automatically connect to your real brokerage account.'
          },
          {
            q: 'Can Tavrixa tell me which stocks to buy?',
            a: 'Tavrixa is intended to support your own research and decision-making. Its information is not personalised financial advice or a guarantee of investment returns.'
          },
          {
            q: 'What should I do if something is not working?',
            a: 'Try refreshing the page first. If the issue persists, email us with a description of the problem, the page where it occurred, and the steps needed to reproduce it.'
          },
          {
            q: 'Can I suggest a feature?',
            a: 'Yes. Send your idea to our contact email. Suggestions for research tools, usability improvements, and new features are welcome.'
          }
        ].map((faq) => (
          <details
            key={faq.q}
            className="group rounded-xl border border-white/[0.08] bg-[#0e141f] px-4 py-4"
          >
            <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-sm font-medium text-slate-200">
              {faq.q}
              <span className="text-lg text-cyan-300 transition-transform group-open:rotate-45">
                +
              </span>
            </summary>
            <p className="mt-3 pr-5 text-sm leading-relaxed text-slate-400">
              {faq.a}
            </p>
          </details>
        ))}
      </div>
    </section>

    <section className="rounded-2xl border border-cyan-300/15 bg-cyan-300/[0.04] p-5 sm:p-6">
      <p className="text-xs font-medium uppercase tracking-widest text-cyan-300">
        CONTACT
      </p>
      <h2 className="mt-2 text-lg font-semibold text-white">
        Still need help?
      </h2>
      <p className="mt-2 text-sm leading-relaxed text-slate-400">
        Report a bug, share feedback, or suggest an improvement. We welcome
        your thoughts on making Tavrixa better.
      </p>

      <a
        href="mailto:mhcx.tavrixa@gmail.com?subject=Tavrixa%20Support"
        className="mt-5 inline-flex items-center gap-2 rounded-lg bg-cyan-300 px-4 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-200"
      >
        Contact Support
        <ArrowRight size={15} />
      </a>

      <p className="mt-3 break-all text-sm text-slate-400">
        mhcx.tavrixa@gmail.com
      </p>
      <p className="mt-1 text-xs text-slate-500">
        The button opens your default email application. It does not submit
        an in-app support ticket.
      </p>
    </section>

    <p className="text-center text-xs leading-relaxed text-slate-600">
      Tavrixa is an investment research and simulation project, not a
      brokerage, financial adviser, or guarantee of investment performance.
    </p>
  </div>


) : active === 'About Tavrixa' ? (
  <AboutTavrixa />
) : active === 'Settings' ? (
  <TavrixaSettings
  theme={theme}
  setTheme={setTheme}
/>
) : active === 'Paper Trading' ? (

 
<PaperTrading
  key={`${session.user.id}-${paperTradingSymbol}-${paperTradingSide}`}
  userId={session.user.id}
  initialSymbol={paperTradingSymbol}
  initialSide={paperTradingSide}
/>

) : active === 'Trade History' ? (
 <TradeHistoryPage userId={session.user.id} />
) : active === 'Market Intelligence' ? (
 <MarketIntelligence
  onSelectStock={setSelectedStock}
/>

) : active === 'Alerts' ? (
  <AlertsPage />
) : active === 'Portfolio' ? (
 <PortfolioPage userId={session.user.id} />
) : active === 'Transactions' ? (
  <TransactionsPage userId={session.user.id} />
) : active === 'Research & Compare' ? (
  <ResearchComparePage />
) : active === 'Investment Journal' ? (
  <InvestmentJournal userId={session.user.id} />
) : active === 'Trading Lab' ? (
  <TradingLabPage />
 ) : active === 'Portfolio Analytics' ? (
  <PortfolioAnalytics userId={session.user.id} />
) : (
  <motion.div


    key={active}
    initial={{ opacity: 0, y: 8 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.25 }}
  >
              <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
                <div>
                  <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-cyan-300/[0.14] bg-cyan-300/[0.05] px-2.5 py-1.5 text-[10px] font-medium tracking-wide text-cyan-200">
                    <Sparkles size={12} />
                    YOUR INVESTMENT WORKSPACE
                  </div>
                  <h1 className="text-2xl font-semibold tracking-tight text-white sm:text-3xl">
                    {active === 'Overview' ? 'Market Overview' : active}
                  </h1>
                  <p className="mt-2 max-w-xl text-sm leading-relaxed text-slate-500">
                    A clearer view of the companies you follow and the decisions you make.
                  </p>
                </div>

                <div className="flex items-center gap-2 self-start sm:self-auto">
                 
                  <button
                    onClick={() => setActive('Discover Stocks')}
                    className="flex items-center gap-2 rounded-lg bg-cyan-300 px-3.5 py-2.5 text-xs font-semibold text-slate-950 transition hover:bg-cyan-200"
                  >
                    Explore Stocks
                    <ArrowRight size={14} />
                  </button>
                </div>
              </div>

<div className="mt-7">
  <MarketCore />
</div>

<PortfolioQuickBar userId={session.user.id} />

 <motion.div
  className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-3 sm:gap-4"
  initial="hidden"
  animate="visible"
  variants={{
    hidden: { opacity: 0, y: 18 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { staggerChildren: 0.12, duration: 0.5 },
    },
  }}
>
  {/* Watchlist */}
 <motion.div
  whileHover={{
    y: -5,
    rotateX: 3,
    rotateY: -3,
    scale: 1.02,
  }}
  transition={{ type: 'spring', stiffness: 300, damping: 20 }}
  style={{ transformPerspective: 800 }}
  className="group relative overflow-hidden rounded-2xl border border-white/[0.07] bg-[#0e141f] p-5 transition-all duration-300 hover:border-cyan-300/25"
>
    <div className="pointer-events-none absolute -right-10 -top-10 size-28 rounded-full bg-cyan-400/[0.07] blur-2xl transition-all duration-500 group-hover:bg-cyan-400/[0.14]" />
    <div className="relative flex items-center justify-between">
      <span className="text-xs text-slate-400">Watchlist</span>
      <Bookmark size={17} className="text-cyan-300" />
    </div>
    <p className="relative mt-4 text-3xl font-semibold tracking-tight text-white">
      {filteredStocks.length.toString().padStart(2, '0')}
      <span className="ml-1.5 text-sm font-normal text-slate-500">stocks</span>
    </p>
    <p className="relative mt-2 text-[11px] text-slate-500">
      Companies in the current view
    </p>
</motion.div>


  {/* Research */}
 <motion.div
  whileHover={{
    y: -5,
    rotateX: 3,
    rotateY: -3,
    scale: 1.02,
  }}
  transition={{ type: 'spring', stiffness: 300, damping: 20 }}
  style={{ transformPerspective: 800 }}
  className="group relative overflow-hidden rounded-2xl border border-white/[0.07] bg-[#0e141f] p-5 transition-all duration-300 hover:border-cyan-300/25"
>
    <div className="pointer-events-none absolute -right-10 -top-10 size-28 rounded-full bg-violet-400/[0.07] blur-2xl transition-all duration-500 group-hover:bg-violet-400/[0.14]" />
    <div className="relative flex items-center justify-between">
      <span className="text-xs text-slate-400">Research Workspace</span>
      <Activity size={17} className="text-violet-300" />
    </div>
    <p className="relative mt-4 text-3xl font-semibold tracking-tight text-white">
      Explore<span className="text-violet-300">.</span>
    </p>
    <p className="relative mt-2 text-[11px] text-slate-500">
      Discover companies and evaluate fundamentals
    </p>
  </motion.div>

  {/* Portfolio */}
  <motion.div
  whileHover={{
    y: -5,
    rotateX: 3,
    rotateY: -3,
    scale: 1.02,
  }}
  transition={{ type: 'spring', stiffness: 300, damping: 20 }}
  style={{ transformPerspective: 800 }}
  className="group relative overflow-hidden rounded-2xl border border-white/[0.07] bg-[#0e141f] p-5 transition-all duration-300 hover:border-cyan-300/25"
>
    <div className="pointer-events-none absolute -right-10 -top-10 size-28 rounded-full bg-emerald-400/[0.06] blur-2xl transition-all duration-500 group-hover:bg-emerald-400/[0.12]" />
    <div className="relative flex items-center justify-between">
      <span className="text-xs text-slate-400">Portfolio</span>
      <Wallet size={17} className="text-emerald-300" />
    </div>
    <p className="relative mt-4 text-3xl font-semibold tracking-tight text-white">
      <span className="text-emerald-300">Ready</span>
    </p>
    <p className="relative mt-2 text-[11px] text-slate-500">
      Track holdings and investment performance
    </p>
  </motion.div>
</motion.div>




              <section className="mt-9">
                <div className="mb-4 flex items-center justify-between gap-3">
                  <div>
                    <h2 className="text-base font-semibold text-white">
                      Your Watchlist
                    </h2>
                    <p className="mt-1 text-xs text-slate-500">
                      A starting point for deeper research
                    </p>
                  </div>
                  <button
                    onClick={() => setActive('Watchlists')}
                    className="inline-flex items-center gap-1.5 text-xs text-cyan-300 transition hover:text-cyan-200"
                  >
                    View all <ArrowRight size={14} />
                  </button>
                </div>

                <div className="overflow-hidden rounded-2xl border border-white/[0.07] bg-[#0e141f]">
                  <div className="hidden grid-cols-[minmax(0,1.8fr)_1fr_1fr] border-b border-white/[0.07] px-5 py-3 text-[10px] font-medium uppercase tracking-[0.12em] text-slate-600 sm:grid">
                    <span>Company</span>
                    <span className="text-right">Price (₹)</span>
                    <span className="text-right">Change</span>
                  </div>

                  {filteredWatchlistStocks.length === 0 ? (
                    <div className="px-5 py-12 text-center">
                      <Search className="mx-auto mb-3 text-slate-600" size={22} />
                      <p className="text-sm text-slate-300">No matching stocks</p>
                      <p className="mt-1 text-xs text-slate-500">
                        Try a company name or ticker symbol.
                      </p>
                    </div>
                  ) : (
                   filteredWatchlistStocks.map((stock, index) => (
                      <motion.div
  key={stock.symbol}
  onClick={() => setSelectedStock(stock.symbol)}
  role="button"
  tabIndex={0}
  initial={{ opacity: 0, y: 6 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ delay: index * 0.04 }}
  className="cursor-pointer grid cursor-pointer grid-cols-[minmax(0,1fr)_auto] items-center gap-3 border-b border-white/[0.05] px-4 py-4 last:border-b-0 transition hover:bg-white/[0.025] sm:grid-cols-[minmax(0,1.8fr)_1fr_1fr] sm:px-5"
>
                        <div className="flex min-w-0 items-center gap-3">
                          <div className="flex size-10 shrink-0 items-center justify-center rounded-xl border border-white/[0.07] bg-white/[0.035] text-[11px] font-semibold text-slate-300">
                            {stock.symbol.slice(0, 2)}
                          </div>
                          <div className="min-w-0">
                            <p className="truncate text-[13px] font-medium text-slate-100">
                              {stock.symbol}
                            </p>
                            <p className="mt-1 truncate text-[11px] text-slate-500">
                              {stock.name}
                            </p>
                          </div>
                        </div>

                        <div className="text-right">
                          <p className="text-[13px] font-medium tabular-nums text-slate-200">
                            {stock.price}
                          </p>
                          <div className="mt-1 sm:hidden">
                            <Change value={stock.change} />
                          </div>
                        </div>

                        <div className="hidden text-right sm:block">
                          <Change value={stock.change} />
                        </div>
                      </motion.div>
                    ))
                  )}

                  <div className="flex items-center gap-2 border-t border-white/[0.06] px-4 py-3.5 text-[10px] leading-relaxed text-slate-600 sm:px-5">
                    <Activity size={13} className="shrink-0" />
                    Illustrative prices only. Not live market data.
                  </div>
                </div>
              </section>





              

              <section className="mt-5 grid grid-cols-1 gap-3 md:grid-cols-2">
                <div className="group rounded-2xl border border-white/[0.07] bg-[#0e141f] p-5 transition-colors hover:border-cyan-300/20 sm:p-6">
                  <div className="flex size-10 items-center justify-center rounded-xl bg-cyan-300/[0.08] text-cyan-300">
                    <ChartNoAxesCombined size={20} />
                  </div>
                  <h3 className="mt-4 text-sm font-semibold text-white">
                    Research beyond the price
                  </h3>
                  <p className="mt-2 max-w-md text-xs leading-relaxed text-slate-500">
                    Explore business performance, financial statements, valuation and risks in one coherent workspace.
                  </p>
                  <button
                    onClick={() => setActive('Discover Stocks')}
                    className="mt-5 inline-flex items-center gap-2 text-xs font-medium text-cyan-300"
                  >
                    Discover Companies <ArrowRight size={14} />
                  </button>
                </div>

                <div className="group rounded-2xl border border-white/[0.07] bg-[#0e141f] p-5 transition-colors hover:border-cyan-300/20 sm:p-6">
                  <div className="flex size-10 items-center justify-center rounded-xl bg-violet-400/[0.09] text-violet-300">
                    <BriefcaseBusiness size={20} />
                  </div>
                  <h3 className="mt-4 text-sm font-semibold text-white">
                    Make every decision count
                  </h3>
                  <p className="mt-2 max-w-md text-xs leading-relaxed text-slate-500">
                    Build a research thesis, track simulated trades and learn from your investment decisions.
                  </p>
                  <button
                   onClick={() => setActive('Paper Trading')}
                    className="mt-5 inline-flex items-center gap-2 text-xs font-medium text-cyan-300"
                  >
                    Explore Paper Trading <ArrowRight size={14} />
                  </button>
                </div>
              </section>

              <footer className="mt-10 flex flex-col gap-2 border-t border-white/[0.06] pt-5 text-[10px] text-slate-600 sm:flex-row sm:items-center sm:justify-between">
                <span>Tavrixa by MHCx</span>
                <span>Research thoughtfully. Invest deliberately.</span>
              </footer>

                        </motion.div>
          )}
          </div>
        </main>
      </div>
    </div>
  )
}

export default App
