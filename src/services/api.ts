import axios from 'axios';
import { CryptoCurrency } from '../types';

const COINBASE_API_URL = 'https://api.coinbase.com/v2/prices';
const BINANCE_API_URL = 'https://api.binance.com/api/v3/ticker/price';
const FIRI_API_URL = 'https://api.firi.com/v2/markets/BTCNOK/ticker';

// Configurable fees and spreads
export const FEES = {
  Coinbase: {
    trade: 0.0149, // 1.49%
    spread: 0.005,  // 0.5%
  },
  Binance: {
    trade: 0.001,  // 0.1%
    spread: 0.001, // 0.1%
  },
  Firi: {
    trade: 0.005, // 0.5%
    spread: 0.002, // 0.2% (estimat)
  },
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

