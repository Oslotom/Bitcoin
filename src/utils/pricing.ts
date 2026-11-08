// A market reference is a benchmark, not a guaranteed executable purchase price.
export function premiumPercent(price: number, reference: number | null): number | null {
  if (!Number.isFinite(price) || price <= 0 || reference === null || !Number.isFinite(reference) || reference <= 0) return null;
  return (price / reference - 1) * 100;
}

// Fees are deducted from the total paid, matching the comparison table's effectivePrice.
export function bitcoinCostBreakdown(spot: number, tradeRate: number, spreadRate: number) {
  if (![spot, tradeRate, spreadRate].every(Number.isFinite) || spot <= 0 || tradeRate < 0 || spreadRate < 0 || tradeRate + spreadRate >= 1) return null;
  const total = spot / (1 - (tradeRate + spreadRate));
  if (!Number.isFinite(total)) return null;
  return { spot, trade: total * tradeRate, spread: total * spreadRate, total };
}
