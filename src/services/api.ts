// Public UI code only reads the same-origin, cached snapshot. Collection runs on the build runner.
import { CryptoCurrency, Exchange } from '../types';
import { fetchSnapshot, INITIAL_SNAPSHOT, MAX_PRICE_AGE } from './market';
export { EXCHANGE_FEES as FEES } from '../data/exchangeFees';

async function price(exchange: Exchange): Promise<number> {
  let snapshot = INITIAL_SNAPSHOT;
  try { snapshot = await fetchSnapshot(); } catch { /* Keep the dated, last-successful snapshot. */ }
  const quote = snapshot.quotes.find(q => q.exchange === exchange && Date.now() - Date.parse(q.asOf) <= MAX_PRICE_AGE);
  if (!quote) throw new Error(`Ingen nylig pris for ${exchange}`);
  return quote.priceNok;
}
export const getCoinbasePrice = async (crypto: CryptoCurrency) => { if (crypto !== CryptoCurrency.BTC) throw new Error('Kun Bitcoin støttes'); return price(Exchange.Coinbase); };
export const getBinancePrice = async (crypto: CryptoCurrency) => { if (crypto !== CryptoCurrency.BTC) throw new Error('Kun Bitcoin støttes'); return price(Exchange.Binance); };
export const getFiriPrice = () => price(Exchange.Firi);
export const getKrakenPrice = () => price(Exchange.Kraken);
export const getNbxPrice = () => price(Exchange.NBX);
export const getBareBitcoinPrice = () => price(Exchange.BareBitcoin);
export const getRevolutPrice = () => price(Exchange.Revolut);
export const getCryptoComPrice = () => price(Exchange.CryptoCom);
export const getBuyBitcoinPrice = () => price(Exchange.BuyBitcoin);
export const getHistoricalData = async (days = 30) => {
  const snapshot = await fetchSnapshot();
  return snapshot.history.points.filter(p => p.timestamp >= Date.now() - days * 86400000);
};
