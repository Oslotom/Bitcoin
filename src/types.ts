export enum CryptoCurrency {
  BTC = 'BTC',
  ETH = 'ETH',
  DOGE = 'DOGE',
}

export enum Exchange {
  Coinbase = 'Coinbase',
  Binance = 'Binance',
  Firi = 'Firi',
  Kraken = 'Kraken',
  NBX = 'NBX',
  BareBitcoin = 'Bare Bitcoin',
  Revolut = 'Revolut',
  CryptoCom = 'Crypto.com',
  BuyBitcoin = 'BuyBitcoin.com',
}

export interface PriceData {
  exchange: Exchange;
  spotPrice: number;
}

export interface ComparisonResult {
  exchange: Exchange;
  spotPrice: number;
  feeInNok: number;
  effectivePrice: number;
  cryptoAmount: number;
  totalCost: number;
  asOf?: string;
  sourceUrl?: string;
  sourceKind?: 'exchange' | 'reference';
  priceBasis?: 'ask' | 'last' | 'reference';
  spreadIncluded?: boolean;
  tradeRate?: number;
  spreadRate?: number;
  includedSpreadNok?: number;
}

export interface MarketQuote {
  exchange: Exchange;
  priceNok: number;
  asOf: string;
  sourceUrl: string;
  kind: 'exchange' | 'reference';
  basis: 'ask' | 'last' | 'reference';
  spreadIncluded: boolean;
  includedSpreadNok?: number;
  note?: string;
}

export interface MarketSnapshot {
  version: 1;
  generatedAt: string;
  quotes: MarketQuote[];
  issues: { exchange: string; reason: string }[];
  history: { sourceUrl: string; asOf: string | null; points: { timestamp: number; price: number }[] };
}
