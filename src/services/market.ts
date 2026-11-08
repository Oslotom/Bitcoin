import savedSnapshot from '../data/market-snapshot.json';
import { EXCHANGE_FEES } from '../data/exchangeFees';
import { Exchange, type MarketSnapshot, type ComparisonResult } from '../types';

export const MAX_PRICE_AGE = 24 * 60 * 60 * 1000;
export const STALE_PRICE_AGE = 60 * 60 * 1000;
const known = new Set<string>(Object.values(Exchange));
export function parseSnapshot(value: unknown, now = Date.now()): MarketSnapshot {
  const data = value as MarketSnapshot;
  if (!data || data.version !== 1 || !Array.isArray(data.quotes) || !Number.isFinite(Date.parse(data.generatedAt)) || Date.parse(data.generatedAt) > now + 60000) throw new Error('Ugyldig prisfil');
  const seen = new Set<string>();
  const quotes = data.quotes.filter((q) => {
    const valid = known.has(q.exchange) && !seen.has(q.exchange) && Number.isFinite(q.priceNok) && q.priceNok > 0 && Number.isFinite(Date.parse(q.asOf)) && Date.parse(q.asOf) <= now + 60000 && ['exchange', 'reference'].includes(q.kind) && ['ask', 'last', 'reference'].includes(q.basis) && typeof q.spreadIncluded === 'boolean' && typeof q.sourceUrl === 'string' && q.sourceUrl.startsWith('https://');
    if (valid) seen.add(q.exchange);
    return valid;
  });
  const points = Array.isArray(data.history?.points) ? data.history.points.filter((p) => Number.isFinite(p.timestamp) && p.timestamp <= now + 60000 && Number.isFinite(p.price) && p.price > 0).sort((a, b) => a.timestamp - b.timestamp) : [];
  return { version: 1, generatedAt: data.generatedAt, quotes, issues: Array.isArray(data.issues) ? data.issues : [], history: { sourceUrl: typeof data.history?.sourceUrl === 'string' && data.history.sourceUrl.startsWith('https://') ? data.history.sourceUrl : 'https://www.coinbase.com/', asOf: data.history?.asOf ?? null, points } };
}

export const INITIAL_SNAPSHOT = parseSnapshot(savedSnapshot);
export const validAmount = (amount: number) => Number.isFinite(amount) && amount >= 100 && amount <= 10_000_000;
export function compareSnapshot(snapshot: MarketSnapshot, amount = 10000, now = Date.now()): ComparisonResult[] {
  if (!validAmount(amount)) return [];
  return snapshot.quotes.filter((q) => now - Date.parse(q.asOf) <= MAX_PRICE_AGE && Date.parse(q.asOf) <= now + 60000).map((q) => {
    const fees = EXCHANGE_FEES[q.exchange];
    const spreadRate = q.spreadIncluded ? 0 : fees.spread;
    const feeRate = fees.trade + spreadRate;
    return {
      exchange: q.exchange, spotPrice: q.priceNok, feeInNok: amount * feeRate,
      effectivePrice: q.priceNok / (1 - feeRate), cryptoAmount: amount * (1 - feeRate) / q.priceNok, totalCost: amount,
      asOf: q.asOf, sourceUrl: q.sourceUrl, sourceKind: q.kind, priceBasis: q.basis, spreadIncluded: q.spreadIncluded,
      tradeRate: fees.trade, spreadRate,
      includedSpreadNok: Number.isFinite(q.includedSpreadNok) && q.includedSpreadNok! >= 0 && q.includedSpreadNok! <= q.priceNok ? q.includedSpreadNok : undefined,
    };
  });
}

export const formatPriceTime = (iso: string) => new Date(iso).toLocaleString('nb-NO', { dateStyle: 'short', timeStyle: 'short', timeZone: 'Europe/Oslo' });
export async function fetchSnapshot(signal?: AbortSignal): Promise<MarketSnapshot> {
  const response = await fetch(`/data/market-snapshot.json?t=${Math.floor(Date.now() / 60000)}`, { signal: signal ?? AbortSignal.timeout(7000), cache: 'no-store' });
  if (!response.ok) throw new Error('Kunne ikke oppdatere prisgrunnlaget. Sist lagrede priser vises.');
  const next = parseSnapshot(await response.json());
  if (!next.quotes.length) throw new Error('Prisfilen mangler gyldige priser. Sist lagrede priser vises.');
  return next;
}
