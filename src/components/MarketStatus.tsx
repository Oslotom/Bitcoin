import { Clock3, RefreshCw } from 'lucide-react';
import type { MarketSnapshot } from '../types';
import { formatPriceTime, STALE_PRICE_AGE, MAX_PRICE_AGE } from '../services/market';

export default function MarketStatus({ snapshot, error, onRetry }: { snapshot: MarketSnapshot; error?: string | null; onRetry?: () => void }) {
  const times = snapshot.quotes.map(q => Date.parse(q.asOf)).filter(Number.isFinite);
  const latest = times.length ? new Date(Math.max(...times)).toISOString() : snapshot.generatedAt;
  const age = Date.now() - Date.parse(latest);
  const stale = age > STALE_PRICE_AGE;
  return (
    <div className={`market-status ${stale || error ? 'market-status-stale' : ''}`}>
      <p><Clock3 size={14} aria-hidden="true" /><span>Nyeste prisgrunnlag fra <time dateTime={latest}>{formatPriceTime(latest)}</time>. {!times.length || age > MAX_PRICE_AGE ? 'Ingen gyldige priser nyere enn 24 timer.' : stale ? 'Eldre prisgrunnlag – kontroller prisen hos børsen.' : 'Tidspunkt per børs finnes under priskilden. Beregningene er ikke kjøpstilbud.'}</span></p>
      {error && <p role="status">{error}</p>}
      {onRetry && <button type="button" onClick={onRetry}><RefreshCw size={13} aria-hidden="true" /> Oppdater</button>}
    </div>
  );
}
