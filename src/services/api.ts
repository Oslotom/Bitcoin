import axios from 'axios';
import { CryptoCurrency, Exchange } from '../types';

const COINBASE_API_URL = 'https://api.coinbase.com/v2/prices';
const BINANCE_API_URL = 'https://api.binance.com/api/v3/ticker/price';
const FIRI_API_URL = 'https://api.firi.com/v2/markets/BTCNOK/ticker';
const KRAKEN_API_URL = 'https://api.kraken.com/0/public/Ticker';
const CRYPTOCOM_API_URL = 'https://api.crypto.com/exchange/v1/public/get-tickers';
const NBX_API_URL = 'https://api.nbx.com/tickers';

// Configurable fees and spreads
export const FEES = {
  [Exchange.Coinbase]: {
    trade: 0.0149, // 1.49%
    spread: 0.005,  // 0.5%
  },
  [Exchange.Binance]: {
    trade: 0.001,  // 0.1%
    spread: 0.001, // 0.1%
  },
  [Exchange.Firi]: {
    trade: 0.007, // 0.7%
    spread: 0, // 0.0% (estimat)
  },
  [Exchange.Kraken]: {
    trade: 0.0026, // 0.26% (Kraken Pro fee tier 1 for maker/taker)
    spread: 0.001,  // 0.1% (estimated spread)
  },
  [Exchange.NBX]: {
    trade: 0.0034,  // 0.34% (NBX competitive fee for BTC/NOK)
    spread: 0.001,  // 0.1% (estimated spread)
  },
  [Exchange.CryptoCom]: {
    trade: 0.005,  // 0.5% 
    spread: 0, 
  },
  [Exchange.BuyBitcoin]: {
    trade: 0.01,   // 1.0%
    spread: 0.015,  // 1.5% (simulated)
  },
};

const simulatePrice = (min: number, max: number) => {
  return parseFloat((Math.random() * (max - min) + min).toFixed(2));
};

export const getCoinbasePrice = async (crypto: CryptoCurrency): Promise<number> => {
  try {
    const response = await axios.get(`${COINBASE_API_URL}/${crypto}-NOK/spot`);
    return parseFloat(response.data.data.amount);
  } catch (error) {
    console.error('Error fetching Coinbase price:', error);
    throw new Error('Kunne ikke hente pris fra Coinbase.');
  }
};

const getEurNokRate = async (): Promise<number> => {
  try {
    const response = await axios.get(`${COINBASE_API_URL}/EUR-NOK/spot`);
    return parseFloat(response.data.data.amount);
  } catch (error) {
    console.error('Error fetching EUR-NOK rate from Coinbase:', error);
    throw new Error('Kunne ikke hente EUR-NOK vekslingskurs.');
  }
}

export const getBinancePrice = async (crypto: CryptoCurrency): Promise<number> => {
  try {
    // First, try the direct NOK pair
    const symbol = `${crypto}NOK`;
    const response = await axios.get(`${BINANCE_API_URL}?symbol=${symbol}`);
    return parseFloat(response.data.price);
  } catch (error) {
    console.warn(`Direct ${crypto}NOK pair not found on Binance. Trying EUR conversion.`);
    // If direct NOK pair fails, try converting through EUR
    try {
      const symbolEur = `${crypto}EUR`;
      const responseEur = await axios.get(`${BINANCE_API_URL}?symbol=${symbolEur}`);
      const priceInEur = parseFloat(responseEur.data.price);
      
      // Now get the EUR to NOK rate from Coinbase
      const eurNokRate = await getEurNokRate();
      
      return priceInEur * eurNokRate;
    } catch (eurError) {
      console.error(`Error fetching Binance price for ${crypto} via EUR:`, eurError);
      throw new Error(`Kunne ikke hente pris fra Binance for ${crypto}. Verken NOK eller EUR handelspar funnet.`);
    }
  }
};

export const getFiriPrice = async (): Promise<number> => {
  try {
    const response = await axios.get(FIRI_API_URL);
    const ask = parseFloat(response.data?.ask);
    if (Number.isFinite(ask) && ask > 0) {
      return ask;
    }

    const last = parseFloat(response.data?.last);
    if (Number.isFinite(last) && last > 0) {
      return last;
    }

    const bid = parseFloat(response.data?.bid);
    if (Number.isFinite(bid) && bid > 0 && Number.isFinite(ask) && ask > 0) {
      return (bid + ask) / 2;
    }

    throw new Error('Invalid ticker payload from Firi.');
  } catch (error) {
    console.error('Error fetching Firi price:', error);
    throw new Error('Kunne ikke hente pris fra Firi.');
  }
};

// Simulated price fetching for new exchanges
const getUsdNokRate = async (): Promise<number> => {
  try {
    const response = await axios.get(`${COINBASE_API_URL}/USD-NOK/spot`);
    return parseFloat(response.data.data.amount);
  } catch (error) {
    console.error('Error fetching USD-NOK rate from Coinbase:', error);
    throw new Error('Kunne ikke hente USD-NOK vekslingskurs.');
  }
}

export const getKrakenPrice = async (): Promise<number> => {
  try {
    const response = await axios.get(`${KRAKEN_API_URL}?pair=XBTUSD`);
    const priceInUsd = parseFloat(response.data.result.XXBTZUSD.c[0]); // 'c' is the last trade closed price
    const usdNokRate = await getUsdNokRate();
    return priceInUsd * usdNokRate;
  } catch (error) {
    console.error('Error fetching Kraken price:', error);
    throw new Error('Kunne ikke hente pris fra Kraken.');
  }
};

export const getNbxPrice = async (): Promise<number> => {
  try {
    const response = await axios.get(NBX_API_URL);
    const btcNokTicker = response.data.find((t: any) => t.id === 'BTC-NOK');
    if (!btcNokTicker) throw new Error('BTC-NOK ticker not found on NBX');
    return parseFloat(btcNokTicker.lastTradePrice);
  } catch (error) {
    console.error('Error fetching NBX price:', error);
    throw new Error('Kunne ikke hente pris fra NBX.');
  }
};

export const getCryptoComPrice = async (): Promise<number> => {
  try {
    const response = await axios.get(CRYPTOCOM_API_URL);
    const tickers = response.data?.result?.data ?? response.data?.data ?? [];
    const btcTicker = tickers.find((ticker: any) => {
      const instrument = ticker.instrument_name ?? ticker.instrumentName ?? ticker.i;
      return instrument === 'BTC_USDT';
    });

    if (!btcTicker) {
      throw new Error('BTC_USDT ticker not found on Crypto.com');
    }

    const rawPrice = btcTicker.last_price ?? btcTicker.lastPrice ?? btcTicker.a ?? btcTicker.p;
    const priceInUsd = parseFloat(rawPrice);
    if (!Number.isFinite(priceInUsd)) {
      throw new Error('Invalid BTC_USDT price on Crypto.com');
    }

    const usdNokRate = await getUsdNokRate();
    return priceInUsd * usdNokRate;
  } catch (error) {
    console.error('Error fetching Crypto.com price:', error);
    throw new Error('Kunne ikke hente pris fra Crypto.com.');
  }
};

export const getBuyBitcoinPrice = async (): Promise<number> => {
  return new Promise(resolve => setTimeout(() => resolve(simulatePrice(290000, 330000)), 450));
};

