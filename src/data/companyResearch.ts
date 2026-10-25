import { stockCatalogue } from './stockCatalogue'

export type FinancialStatement = {
  revenue: number | null
  operatingProfit: number | null
  netProfit: number | null
  eps: number | null
  totalAssets?: number | null
  totalDebt?: number | null
  operatingCashFlow?: number | null
  freeCashFlow?: number | null
  operatingMargin?: number | null
  netMargin?: number | null
}

export type CompanyRisk = {
  category: string
  level: 'Low' | 'Moderate' | 'High' | 'Unknown'
  explanation: string
  source?: string
}

export type CompanyResearch = {
  symbol: string
  financials: {
    annual: Record<string, FinancialStatement>
    quarterly: Record<string, FinancialStatement>
  }
  valuation: {
    pe: number | null
    pb: number | null
    evEbitda: number | null
    peg: number | null
    roe: number | null
    roce: number | null
    operatingMargin: number | null
    netMargin: number | null
    debtEquity: number | null
    interestCoverage: number | null
    currentRatio: number | null
    freeCashFlow: number | null
  }
  risks: CompanyRisk[]
  dataStatus: 'unavailable' | 'partial' | 'verified'
}

function hashSymbol(symbol: string): number {
  let hash = 0

  for (let i = 0; i < symbol.length; i++) {
    hash = (hash * 31 + symbol.charCodeAt(i)) >>> 0
  }

  return hash
}

function seededValue(
  seed: number,
  offset: number,
  min: number,
  max: number,
): number {
  const value = ((seed + offset * 7919) % 10000) / 9999
  return min + value * (max - min)
}

function round(value: number, decimals = 2): number {
  const factor = 10 ** decimals
  return Math.round(value * factor) / factor
}

function makeStatement(
  revenue: number,
  operatingMargin: number,
  netMargin: number,
  eps: number,
  assets: number,
  debt: number,
  cashFlowMultiplier: number,
  freeCashFlowMultiplier: number,
): FinancialStatement {
  const operatingProfit = revenue * operatingMargin / 100
  const netProfit = revenue * netMargin / 100
  const operatingCashFlow = netProfit * cashFlowMultiplier
  const freeCashFlow = netProfit * freeCashFlowMultiplier

  return {
    revenue: Math.round(revenue),
    operatingProfit: Math.round(operatingProfit),
    netProfit: Math.round(netProfit),
    eps: round(eps),
    totalAssets: Math.round(assets),
    totalDebt: Math.round(debt),
    operatingCashFlow: Math.round(operatingCashFlow),
    freeCashFlow: Math.round(freeCashFlow),
    operatingMargin: round(operatingMargin),
    netMargin: round(netMargin),
  }
}

function makeDemoResearch(
  stock: (typeof stockCatalogue)[number],
): CompanyResearch {
  const seed = hashSymbol(stock.symbol)

  // Stable simulated assumptions for each symbol.
  const pe = stock.pe > 0
    ? stock.pe
    : round(seededValue(seed, 1, 12, 42))

  const netMargin = seededValue(seed, 2, 5, 22)
  const operatingMargin = Math.max(
    netMargin + 2,
    seededValue(seed, 3, 12, 32),
  )

  const growth = seededValue(seed, 4, -5, 24)
  const assetMultiplier = seededValue(seed, 5, 0.65, 2.1)
  const debtRatio = seededValue(seed, 6, 0.08, 0.48)
  const cashFlowMultiplier = seededValue(seed, 7, 0.85, 1.65)
  const freeCashFlowMultiplier = seededValue(seed, 8, -0.2, 1.1)

  // Catalogue market capitalization is simulated and expressed in ₹ crore.
  const marketCap = stock.marketCapValue
  const netProfit = marketCap / pe
  const revenue = netProfit / (netMargin / 100)
  const assets = Math.max(
    marketCap * assetMultiplier,
    marketCap * 0.8,
  )
  const debt = assets * debtRatio

  // Estimate shares from simulated market cap and price.
  const shares = marketCap / Math.max(stock.price, 1)
  const eps = netProfit / Math.max(shares, 0.001)

  const fy2025 = makeStatement(
    revenue,
    operatingMargin,
    netMargin,
    eps,
    assets,
    debt,
    cashFlowMultiplier,
    freeCashFlowMultiplier,
  )

  const previousRevenue = revenue / (1 + growth / 100)

  const fy2024 = makeStatement(
    previousRevenue,
    Math.max(operatingMargin - seededValue(seed, 9, -1.5, 1.5), 1),
    Math.max(netMargin - seededValue(seed, 10, -1.5, 1.5), 0.5),
    eps / (1 + growth / 100),
    assets * seededValue(seed, 11, 0.88, 0.98),
    debt * seededValue(seed, 12, 0.96, 1.08),
    cashFlowMultiplier,
    freeCashFlowMultiplier,
  )

  const quarterly = (fraction: number, offset: number) => {
    const variation = seededValue(seed, offset, 0.88, 1.12)

    return makeStatement(
      revenue * fraction * variation,
      operatingMargin,
      netMargin,
      eps * fraction * variation,
      assets,
      debt,
      cashFlowMultiplier,
      freeCashFlowMultiplier,
    )
  }

  const equity = Math.max(assets - debt, 1)
  const freeCashFlow = fy2025.freeCashFlow ?? 0
  const interestExpense = debt * 0.08
  const earningsGrowth = Math.max(growth, 1)

  const valuation: CompanyResearch['valuation'] = {
    pe: round(pe),
    pb: round(marketCap / equity),
    evEbitda: round(
      (marketCap + debt) /
      Math.max(fy2025.operatingProfit ?? 1, 1),
    ),
    peg: round(pe / earningsGrowth),
    roe: round((netProfit / equity) * 100),
    roce: round(
      ((fy2025.operatingProfit ?? 0) /
        Math.max(assets - debt, 1)) * 100,
    ),
    operatingMargin: fy2025.operatingMargin ?? null,
    netMargin: fy2025.netMargin ?? null,
    debtEquity: round(debt / equity),
    interestCoverage: round(
      (fy2025.operatingProfit ?? 0) /
      Math.max(interestExpense, 1),
    ),
    currentRatio: round(seededValue(seed, 13, 0.8, 2.5)),
    freeCashFlow,
  }

  const sector = stock.sector
  const sectorFocus: Record<string, string> = {
    Banking: 'credit quality, loan growth and liquidity conditions',
    'Information Technology':
      'client spending, technology demand and delivery costs',
    Energy: 'commodity-price cycles, operating costs and capital expenditure',
    Healthcare: 'regulatory requirements, product pipelines and operating costs',
    Pharmaceuticals:
      'regulatory compliance, product concentration and research spending',
    'Fast Moving Consumer Goods':
      'input costs, consumer demand and competitive pricing',
    Automotive: 'sales cycles, input costs and technology transitions',
    'Automobiles':
      'sales cycles, input costs and technology transitions',
    'Financial Services':
      'credit conditions, funding costs and asset quality',
    'Metals & Mining':
      'commodity cycles, production costs and demand changes',
    Telecommunications:
      'capital expenditure, competition and pricing pressure',
    'Information Technology Services':
      'client spending, technology demand and delivery costs',
  }

  const focus =
    sectorFocus[sector] ??
    'competitive pressure, demand changes and operating resilience'

  const riskTemplates = [
    {
      category: 'Business resilience',
      explanation: `Illustrative scenario for ${stock.name}: ${focus} could affect future operating performance.`,
    },
    {
      category: 'Financial exposure',
      explanation: `Illustrative scenario for ${stock.name}: leverage, cash generation and funding needs warrant examination using verified statements.`,
    },
    {
      category: 'Earnings volatility',
      explanation: `Illustrative scenario for ${stock.name}: margins and earnings may vary as business conditions and costs change.`,
    },
    {
      category: 'Industry conditions',
      explanation: `Illustrative scenario for ${stock.name}: structural changes and competitive dynamics could influence future performance.`,
    },
    {
      category: 'Governance review',
      explanation: `No actual governance finding is asserted. Review disclosures, auditor observations and related-party transactions.`,
    },
    {
      category: 'Cash-flow resilience',
      explanation: `Illustrative scenario for ${stock.name}: compare operating cash flow with reported profit and investment requirements.`,
    },
  ]

  const riskLevels: CompanyRisk['level'][] = [
    'Low',
    'Moderate',
    'High',
    'Unknown',
  ]

  const risks: CompanyRisk[] = [0, 1, 2].map((index) => {
    const templateIndex =
      (seed + index * 3) % riskTemplates.length
    const levelIndex =
      (seed + index * 7) % riskLevels.length
    const template = riskTemplates[templateIndex]

    return {
      category: template.category,
      level: riskLevels[levelIndex],
      explanation: template.explanation,
      source: 'Tavrixa simulated scenario — not verified company research',
    }
  })

  return {
    symbol: stock.symbol,
    financials: {
      annual: {
        'FY2024': fy2024,
        'FY2025': fy2025,
      },
      quarterly: {
        'Q1 FY2026': quarterly(0.24, 14),
        'Q2 FY2026': quarterly(0.26, 15),
      },
    },
    valuation,
    risks,
    dataStatus: 'partial',
  }
}

export const companyResearch: Record<string, CompanyResearch> =
  Object.fromEntries(
    stockCatalogue.map((stock) => [
      stock.symbol,
      makeDemoResearch(stock),
    ]),
  )

export function getCompanyResearch(symbol: string): CompanyResearch {
  const normalizedSymbol = symbol.trim().toUpperCase()

  return (
    companyResearch[normalizedSymbol] ?? {
      symbol: normalizedSymbol,
      financials: {
        annual: {},
        quarterly: {},
      },
      valuation: {
        pe: null,
        pb: null,
        evEbitda: null,
        peg: null,
        roe: null,
        roce: null,
        operatingMargin: null,
        netMargin: null,
        debtEquity: null,
        interestCoverage: null,
        currentRatio: null,
        freeCashFlow: null,
      },
      risks: [],
      dataStatus: 'unavailable',
    }
  )
}
