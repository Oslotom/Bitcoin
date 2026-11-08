import test from 'node:test';
import assert from 'node:assert/strict';
import { bitcoinCostBreakdown } from '../src/utils/pricing.ts';

test('per-BTC components sum to the effective purchase price, not a spot markup', () => {
  const cost = bitcoinCostBreakdown(1_000_000, 0.007, 0.001)!;
  assert.equal(cost.total, 1_000_000 / 0.992);
  assert(Math.abs(cost.spot + cost.trade + cost.spread - cost.total) < 1e-8);
  assert(Math.abs(cost.trade / cost.total - 0.007) < 1e-12);
  assert(Math.abs(cost.spread / cost.total - 0.001) < 1e-12);
});

test('zero fee and spread keep the total unchanged', () => {
  assert.deepEqual(bitcoinCostBreakdown(1_000_000, 0, 0), { spot: 1_000_000, trade: 0, spread: 0, total: 1_000_000 });
});

test('measured spread is split out of ask price without increasing the total again', () => {
  const result = bitcoinCostBreakdown(700000, 0.007, 0, 500)!;
  assert.equal(result.spot, 699500);
  assert.equal(result.spread, 500);
  assert.equal(result.total, 700000 / 0.993);
  assert(Math.abs(result.spot + result.trade + result.spread - result.total) < 1e-8);
});

test('missing or invalid prices and rates never create a plotted price', () => {
  for (const spot of [NaN, Infinity, 0, -1]) assert.equal(bitcoinCostBreakdown(spot, 0.007, 0), null);
  for (const rate of [NaN, Infinity, -0.1, 1, 1.1]) {
    assert.equal(bitcoinCostBreakdown(1_000_000, rate, 0), null);
    assert.equal(bitcoinCostBreakdown(1_000_000, 0, rate), null);
  }
  assert.equal(bitcoinCostBreakdown(1_000_000, 0.5, 0.5), null);
});
