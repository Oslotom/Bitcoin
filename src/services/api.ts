import axios from 'axios';
import { CryptoCurrency, Exchange } from '../types';

const COINBASE_API_URL = 'https://api.coinbase.com/v2/prices';
const BINANCE_API_URL = 'https://api.binance.com/api/v3/ticker/price';
const FIRI_API_URL = 'https://api.firi.com/v2/markets/BTCNOK/ticker';

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
    trade: 0.005, // 0.5%
    spread: 0.002, // 0.2% (estimat)
  },
  [Exchange.Kraken]: {
    trade: 0.0026, // 0.26%
    spread: 0.003,  // 0.3% (simulated)
  },
  [Exchange.NBX]: {
    trade: 0.005,  // 0.5%
    spread: 0.008,  // 0.8% (simulated)
  },
  [Exchange.CryptoCom]: {
    trade: 0.004,  // 0.4%
    spread: 0.006,  // 0.6% (simulated)
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
    return parseFloat(response.data.last);
  } catch (error) {
    console.error('Error fetching Firi price:', error);
    throw new Error('Kunne ikke hente pris fra Firi.');
  }
};

// Simulated price fetching for new exchanges
export const getKrakenPrice = async (): Promise<number> => {
  return new Promise(resolve => setTimeout(() => resolve(simulatePrice(280000, 320000)), 300));
};

export const getNbxPrice = async (): Promise<number> => {
  return new Promise(resolve => setTimeout(() => resolve(simulatePrice(285000, 325000)), 350));
};

export const getCryptoComPrice = async (): Promise<number> => {
  return new Promise(resolve => setTimeout(() => resolve(simulatePrice(275000, 315000)), 400));
};

export const getBuyBitcoinPrice = async (): Promise<number> => {
  return new Promise(resolve => setTimeout(() => resolve(simulatePrice(290000, 330000)), 450));
};

