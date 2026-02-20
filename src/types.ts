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
}
