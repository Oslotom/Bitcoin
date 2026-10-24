// A market reference is a benchmark, not a guaranteed executable purchase price.
export function premiumPercent(price: number, reference: number | null): number | null {
  if (!Number.isFinite(price) || price <= 0 || reference === null || !Number.isFinite(reference) || reference <= 0) return null;
  return (price / reference - 1) * 100;
}
