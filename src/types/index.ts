export type CryptoCurrency = 'BTC';

export type Exchange = 'Coinbase' | 'Binance' | 'Firi';

export interface PriceData {
  price: number;
}

export interface ComparisonResult {
  exchange: Exchange;
  spotPrice: number;
  feeInNok: number;
  effectivePrice: number;
  cryptoAmount: number;
  totalCost: number;
}
