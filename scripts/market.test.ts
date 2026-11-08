import test from 'node:test';
import assert from 'node:assert/strict';
import { compareSnapshot, parseSnapshot, MAX_PRICE_AGE, validAmount } from '../src/services/market.ts';
import { Exchange, type MarketSnapshot } from '../src/types.ts';
import { EXCHANGE_FEES, FEE_EVIDENCE } from '../src/data/exchangeFees.ts';

const now = Date.parse('2026-11-08T04:00:00Z');
const stamp = new Date(now).toISOString();
const snapshot: MarketSnapshot = { version: 1, generatedAt: stamp, quotes: [{ exchange: Exchange.BareBitcoin, priceNok: 700000, asOf: stamp, sourceUrl: 'https://api.bb.no/v1/price/nok', kind: 'exchange', basis: 'ask', spreadIncluded: true }], issues: [], history: { sourceUrl: 'https://example.com/data', asOf: stamp, points: [] } };

test('ask prices never receive spread a second time', () => {
  const row = compareSnapshot(snapshot, 10000, now)[0];
  assert.equal(row.spreadRate, 0);
  assert.equal(row.feeInNok, 70);
  assert.equal(row.effectivePrice, 700000 / 0.993);
  assert.equal(row.cryptoAmount, 9930 / 700000);
  const lastTrade = { ...snapshot, quotes: snapshot.quotes.map(q => ({ ...q, spreadIncluded: false })) };
  assert(compareSnapshot(lastTrade, 10000, now)[0].feeInNok > row.feeInNok);
});

test('amount changes recompute output, retain prices, and do not change ranking arithmetic', () => {
  for (const amount of [100, 1000, 10000, 50000, 10000000]) {
    const r = compareSnapshot(snapshot, amount, now)[0];
    assert.equal(r.totalCost, amount);
    assert(Math.abs(r.cryptoAmount * r.effectivePrice - amount) < 1e-6);
  }
  for (const amount of [NaN, Infinity, 0, -1, 99, 10000001]) { assert.equal(validAmount(amount), false); assert.deepEqual(compareSnapshot(snapshot, amount, now), []); }
});

test('expired prices cannot be ranked or used to calculate a purchase', () => {
  assert.equal(compareSnapshot(snapshot, 10000, now + MAX_PRICE_AGE + 1).length, 0);
});

test('malformed snapshots, future prices, duplicates and unknown exchanges are rejected', () => {
  assert.throws(() => parseSnapshot({}, now));
  assert.throws(() => parseSnapshot({ ...snapshot, generatedAt: new Date(now + 120000).toISOString() }, now));
  const bad = { ...snapshot, quotes: [...snapshot.quotes, ...snapshot.quotes, { ...snapshot.quotes[0], exchange: 'Fake' }, { ...snapshot.quotes[0], exchange: Exchange.NBX, priceNok: NaN }] };
  assert.equal(parseSnapshot(bad, now).quotes.length, 1);
});

test('every fee scenario has provenance and unchecked rates are not labelled verified', () => {
  for (const name of Object.values(Exchange)) {
    assert(EXCHANGE_FEES[name].trade + EXCHANGE_FEES[name].spread < 1);
    assert(FEE_EVIDENCE[name].sourceUrl.startsWith('https://'));
    assert(FEE_EVIDENCE[name].accountType.length > 0);
    if (FEE_EVIDENCE[name].tradeVerified) assert(FEE_EVIDENCE[name].checkedAt);
    else assert.equal(FEE_EVIDENCE[name].checkedAt, null);
  }
  assert.equal(EXCHANGE_FEES[Exchange.NBX].trade, 0.007);
  assert.equal(EXCHANGE_FEES[Exchange.BareBitcoin].trade, 0.007);
});
