import test from 'node:test';
import assert from 'node:assert/strict';
import { collectMarketData, positive } from './market-data.mjs';

const now = Date.parse('2026-11-08T04:00:00Z');
const stamp = new Date(now).toISOString();
const mock = async (url) => {
  let value;
  if (url.includes('BTC-NOK/spot')) value = { data: { amount: '700000' } };
  else if (url.includes('EUR-NOK')) value = { data: { amount: '12' } };
  else if (url.includes('USD-NOK')) value = { data: { amount: '10' } };
  else if (url.includes('firi')) value = { ask: '701000' };
  else if (url.includes('nbx')) value = [{ price: '702000', createdAt: '2026-11-08T03:30:00Z' }];
  else if (url.includes('api.bb.no')) value = { price: 700000, ask: 703000, bank: { buy: 708000 }, timestamp: stamp };
  else if (url.includes('binance')) value = { askPrice: '58500' };
  else if (url.includes('kraken')) value = { result: { XXBTZUSD: { a: ['70400'] } } };
  else if (url.includes('crypto.com')) value = { result: { data: [{ i: 'BTC_USDT', a: '70500' }] } };
  else if (url.includes('coingecko')) value = { prices: [[now - 86400000, 680000], [now - 86300000, 681000], [now, 700000]] };
  return { ok: Boolean(value), status: value ? 200 : 404, json: async () => value };
};

test('collection uses NBX trades and Bare Bitcoin ask before payment/trade markup', async () => {
  const result = await collectMarketData({ now, fetcher: mock });
  assert.equal(result.quotes.length, 9);
  const nbx = result.quotes.find(q => q.exchange === 'NBX');
  assert.equal(nbx.priceNok, 702000);
  assert.equal(nbx.asOf, '2026-11-08T03:30:00Z');
  assert(nbx.sourceUrl.endsWith('/trades'));
  const bb = result.quotes.find(q => q.exchange === 'Bare Bitcoin');
  assert.equal(bb.priceNok, 703000);
  assert.equal(bb.spreadIncluded, true);
  assert.equal(result.quotes.find(q => q.exchange === 'Revolut').kind, 'reference');
});

test('outages keep saved source timestamps and never create fresh fake prices', async () => {
  const previous = await collectMarketData({ now: now - 3600000, fetcher: mock, includeHistory: false });
  const result = await collectMarketData({ previous, now, fetcher: async () => ({ ok: false, status: 503 }), includeHistory: false });
  const before = previous.quotes.find(q => q.exchange === 'NBX');
  assert.deepEqual(result.quotes.find(q => q.exchange === 'NBX'), before);
  assert(result.issues.length > 0);
  const empty = await collectMarketData({ now, fetcher: async () => ({ ok: false, status: 503 }), includeHistory: false });
  assert.equal(empty.quotes.length, 0);
});

test('history keeps observed daily points, not a made-up value for missing days', async () => {
  const result = await collectMarketData({ now, fetcher: mock });
  assert.equal(result.history.points.length, 2);
  assert.equal(result.history.points[0].price, 681000);
  assert.equal(result.history.points[1].price, 700000);
});

test('non-price values are rejected', () => {
  for (const v of [null, undefined, true, false, NaN, Infinity, '', -1, 'abc']) assert.equal(positive(v), null);
});
