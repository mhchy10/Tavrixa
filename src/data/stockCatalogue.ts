
import rawList from './nse-stock-list.txt?raw'


export type StockSeed = {
  symbol: string
  name: string
  price: number
  sector: string
  marketCap: string
  marketCapValue: number
  pe: number
}


const originalPrices: Record<string, number> = {
  RELIANCE: 1462.8,
  TCS: 3184.5,
  HDFCBANK: 968.4,
  INFY: 1512.25,
}

const sectorGroups: Record<string, string[]> = {
  Banking: `
    AUBANK BANDHANBNK BANKBARODA BANKINDIA MAHABANK CANBK CENTRALBK
    CUB INDIANB IDBI IDFCFIRSTB FEDERALBNK HDFCBANK ICICIBANK
    INDUSINDBK J&KBANK KARURVYSYA KOTAKBANK PNB RBLBANK SBIN
    UCOBANK UNIONBANK YESBANK IOB
  `.trim().split(/\s+/),

  'Financial Services': `
    360ONE AADHARHFC AAVAS ABCAPITAL ABSLAMC AIIL ANGELONE ANANDRATHI
    BAJAJHLDNG BAJAJFINSV BAJFINANCE BAJAJHFL BSE CAMS CDSL
    CANFINHOME CGCL CHOLAFIN CHOLAHLDNG CHOICE CREDITACC FIVESTAR
    GROWW HDBFS HDFCAMC IEX IFCI IIFL JIOFIN JMFINANCIL
    KFINTECH LICHSGFIN LTF M&MFIN MANAPPURAM MCX MFSL
    MOTILALOFS MUTHOOTFIN NAM-INDIA NUVAMA PAYTM PFC PNBHOUSING
    POLICYBZR POONAWALLA RECLTD SAMMAANCAP SBICARD SHRIRAMFIN
    SUNDARMFIN TATACAP TATAINVEST UTIAMC
  `.trim().split(/\s+/),

  Insurance: `
    CANHLIFE GICRE HDFCLIFE ICICIGI ICICIPRULI LICI NIACL
    SBILIFE STARHEALTH
  `.trim().split(/\s+/),

  'Information Technology': `
    AFFLE BIRLASOFT BSOFT BBOX COFORGE CYIENT FRACTAL HCLTECH
    HEXT IKS INDIAMART INTELLECT KPITTECH LTIM LTTS LTM
    MPHASIS NAUKRI NETWEB OFSS PERSISTENT REDINGTON RAILTEL
    TATACOMM TATAELXSI TATATECH TECHM TEJASNET WIPRO ZENSARTECH
    FIRSTSOURCE FSL STLTECH SYRMA KAYNES
  `.trim().split(/\s+/),

  Energy: `
    ADANIGREEN ADANIPOWER ADANIENSOL ATGL BPCL CESC CHENNPETRO
    GAIL HINDPETRO IOC IGL JSWENERGY MGL NHPC NLCINDIA
    NTPC NTPCGREEN OIL ONGC PETRONET POWERGRID RELIANCE
    RPOWER SJVN SUZLON TATAPOWER TORNTPOWER WAAREEENER
    PREMIERENE EMMVEE IREDA INOXWIND OLAELEC ATHERENERG
    CLEANMAX
  `.trim().split(/\s+/),

  'Information Technology Services': `
    ACUTAAS AETHER ANTHEM ANURAS CLEAN COHANCE GRANULES
    HEXT IPCALAB LAURUSLABS NEULANDLAB ONESOURCE PPLPHARMA
    RUBICON SAILIFE SYNGENE
  `.trim().split(/\s+/),

  Automobiles: `
    ASHOKLEY BAJAJ-AUTO EICHERMOT ESCORTS FORCEMOTORS HEROMOTOCO
    HYUNDAI MARUTI M&M TMCV TMPV TVSMOTOR TATAMOTORS
    ATHERENERG OLECTRA OLAELEC
  `.trim().split(/\s+/),

  'Auto Components': `
    APOLLOTYRE BALKRISIND BELRISE BOSCHLTD CEATLTD CIEINDIA
    ENDURANCE EXIDEIND GABRIEL JKTYRE M&MFIN MINDACORP
    MOTHERSON MSUMI SANSERA SCHAEFFLER SONACOMS UNOMINDA
    ZFCVINDIA BHARATFORG JBMA TIINDIA
  `.trim().split(/\s+/),

  Pharmaceuticals: `
    ABBOTINDIA AJANTPHARM ALKEM AUROPHARMA BIOCON CAPLIPOINT
    CIPLA COHANCE CONCORDBIO DIVISLAB DRREDDY EMCURE GLAND
    GLAXO GLENMARK GRANULES IPCALAB LUPIN MANKIND NATCOPHARM
    NEULANDLAB ONESOURCE POLYMED PPLPHARMA SUNPHARMA TORNTPHARM
    WOCKPHARMA ZYDUSLIFE
  `.trim().split(/\s+/),

  Healthcare: `
    APOLLOHOSP ASTERDM FORTIS KIMS LALPATHLAB MAXHEALTH MEDANTA
    NH RAINBOW VIJAYA
  `.trim().split(/\s+/),

  FMCG: `
    ABDL AWL BRITANNIA CCL COLPAL DABUR EMAMILTD GODREJCP
    HINDUNILVR ITC MARICO NESTLEIND PATANJALI TATACONSUM
    VBL ZYDUSWELL GILLETTE GODFRYPHLP HONASA
  `.trim().split(/\s+/),

  Retail: `
    CARTRADE DMART FIRSTCRY LENSKART MEESHO NYKAA TRENT
    URBANCO VMM SWIGGY DEVYANI JUBLFOOD
  `.trim().split(/\s+/),

  'Consumer Durables': `
    AMBER ASIANPAINT ASAHIINDIA BLUESTARCO BERGEPAINT BATAINDIA
    CROMPTON DIXON HAVELLS HINDWARE HONAUT KAJARIACER
    LG ELECTRONICS VOLTAS WHIRLPOOL TITAN DOMS PAGEIND
    POLYCAB KEI FINCABLES RRKABEL SUPREMEIND ASTRAL
  `.trim().split(/\s+/),

  'Metals & Mining': `
    BHARATCOAL COALINDIA GALLANTT GPIL GRAVITA GRAPHITE
    HEGAM HINDALCO HINDCOPPER HINDZINC JAINREC JINDALSAW
    JINDALSTEL JSL LLOYDSME NATIONALUM NMDC NSLNISP SAIL
    SARDAEN SHYAMMETL TATASTEEL VEDL VAML VISL
  `.trim().split(/\s+/),

  'Cement & Materials': `
    ACC AMBUJACEM DALBHARAT GRASIM INDIA CEMENT INDIACEM
    JKCEMENT JSWCEMENT NUVOCO RAMCOCEM SHREECEM ULTRACEMCO
  `.trim().split(/\s+/),

  'Chemicals & Fertilizers': `
    AARTIIND ATUL CHAMBLFERT CLEAN DEEPAKFERT DEEPAKNTR
    EIDPARRY FACT FLUOROCHEM HSCL NAVINFLUOR PCBL PIIND
    PIDILITIND PRIVISCL SRF SUMICHEM TATACHEM UPL COROMANDEL
    PARADEEP
  `.trim().split(/\s+/),

  'Infrastructure & Engineering': `
    ABB ACE AFCONS AIAENG BEML BHEL CGPOWER CEMPRO
    CUMMINSIND ELECON ELGIEQUIP ENGINERSIND GVT&D
    HBLENGINE IRB IRCON KEC KSB KIRLOSBROS KIRLOSENG
    KPIL LT NCC NBCC RVNL SCHNEIDER SIEMENS TARIL
    TDPOWERSYS TECHNOE THERMAX TRITURBINE
  `.trim().split(/\s+/),

  Defence: `
    BDL BEL COCHINSHIP DATAPATTNS GRSE HAL MAZDOCK
    SOLARINDS ZENTEC
  `.trim().split(/\s+/),

  'Real Estate': `
    ANANTRAJ BAGMANE ABREL BIRET BRIGADE DLF EMBASSY
    GODREJPROP LODHA OBEROIRLTY PHOENIXLTD PRESTIGE
    SIGNATURE SOBHA
  `.trim().split(/\s+/),

  Telecommunications: `
    BHARTIARTL BHARTIHEXA HFCL IDEA INDUSTOWER TTML
  `.trim().split(/\s+/),

  'Transport & Logistics': `
    AEGIS AEGISLOG AEGISVOPAK ADANIPORTS CONCOR DELHIVERY
    GESHIP GMRAIRPORT INDIGO IRCTC JWL SCI
  `.trim().split(/\s+/),

  'Travel & Hospitality': `
    EIH ETERNAL INDHOTEL ITCHOTELS LEMONTREE PVRINOX
    SUNTV ZEEL
  `.trim().split(/\s+/),

  'Agriculture & Food': `
    AVANTIFEED BALRAMCHIN CCL COROMANDEL CUPID LTFOODS
    MAHABANK
  `.trim().split(/\s+/),
}

const originalSectors: Record<string, string> = Object.fromEntries(
  Object.entries(sectorGroups).flatMap(([sector, symbols]) =>
    symbols.map((symbol) => [symbol, sector] as const),
  ),
)


const originalPE: Record<string, number> = {
  RELIANCE: 25.4,
  TCS: 29.1,
  HDFCBANK: 19.3,
  INFY: 24.7,
}

const parsedStocks = rawList
  .split(/\r?\n/)
  .map((line) => {
    const [name, symbol] = line.split('—').map((part) => part.trim())
    return { name, symbol }
  })
  .filter(
    (stock) =>
      stock.name &&
      stock.symbol &&
      stock.symbol !== 'DUMMYHEG' &&
      /^[A-Z0-9&.-]+$/.test(stock.symbol),
  )

const uniqueStocks = Array.from(
  new Map(parsedStocks.map((stock) => [stock.symbol, stock])).values(),
).slice(0, 500)



function getSimulatedMarketCap(symbol: string): number {
  let hash = 0

  for (let i = 0; i < symbol.length; i++) {
    hash = (hash * 31 + symbol.charCodeAt(i)) >>> 0
  }

  const normalized = hash / 4294967295

  return Math.round(
    500 + Math.pow(normalized, 2.1) * 1_500_000,
  )
}


export const stockCatalogue: StockSeed[] = uniqueStocks.map(
  ({ name, symbol }, index) => {
    const marketCapValue = getSimulatedMarketCap(symbol)

    const marketCap =
      marketCapValue >= 20_000
        ? 'Large Cap'
        : marketCapValue >= 5_000
          ? 'Mid Cap'
          : 'Small Cap'

    return {
      name,
      symbol,
      price:
        originalPrices[symbol] ??
        Math.round((100 + ((index * 137.51) % 2900)) * 100) / 100,
      sector: originalSectors[symbol] ?? 'Unclassified',
      marketCap,
      marketCapValue,
      pe: originalPE[symbol] ?? 0,
    }
  },
)
