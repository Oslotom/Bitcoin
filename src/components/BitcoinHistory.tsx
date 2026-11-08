import { useId, useState } from 'react';
import type { MarketSnapshot } from '../types';
import { formatPriceTime } from '../services/market';
import { trackEvent } from '../services/analytics';

const money = (v: number) => `${v.toLocaleString('nb-NO', { maximumFractionDigits: 0 })} kr`;
const day = (v: number) => new Date(v).toLocaleDateString('nb-NO', { day: 'numeric', month: 'short', timeZone: 'UTC' });
export default function BitcoinHistory({ history }: { history: MarketSnapshot['history'] }) {
  const id = useId();
  const [days, setDays] = useState(30);
  const end = history.points.at(-1)?.timestamp ?? 0;
  const points = history.points.filter(p => p.timestamp >= end - days * 86400000).slice(-days);
  if (points.length < 2) return <section aria-label="Kurshistorikk"><h2 className="section-title">Bitcoin-kurs over tid</h2><p className="mt-3 text-sm text-slate-600">Historiske målinger er ikke tilgjengelige. Vi viser ingen konstruert kurve.</p></section>;
  const start = points[0].timestamp;
  const min = Math.min(...points.map(p => p.price));
  const max = Math.max(...points.map(p => p.price));
  const span = max - min || max * 0.01;
  const coords = points.map(p => `${20 + (p.timestamp - start) / (end - start || 1) * 720},${205 - (p.price - min) / span * 170}`);
  const last = points[points.length - 1];
  const change = (last.price / points[0].price - 1) * 100;
  const displayedChange = Math.round(change * 100) / 100 || 0;
  return (
    <section className="history-panel" aria-labelledby={`${id}-title`}>
      <div className="flex flex-wrap items-start justify-between gap-4"><div><h2 id={`${id}-title`} className="section-title">Bitcoin-kurs over tid</h2><p className="mt-2 text-sm text-slate-600">Siste viste måling: {money(last.price)} · <span className={displayedChange >= 0 ? 'text-emerald-700' : 'text-rose-700'}>{displayedChange > 0 ? '+' : ''}{displayedChange.toLocaleString('nb-NO', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} % i vist periode</span></p></div><div className="flex gap-2" aria-label="Velg historikkperiode">{[7, 30].map(d => <button key={d} type="button" aria-pressed={days === d} className="history-range" onClick={() => { setDays(d); trackEvent('history_range', { days: String(d) }); }}>{d} dager</button>)}</div></div>
      <svg className="history-chart" viewBox="0 0 760 230" role="img" aria-labelledby={`${id}-chart-title ${id}-chart-desc`}>
        <title id={`${id}-chart-title`}>{`Bitcoin-kurs i NOK fra ${day(start)} til ${day(end)}`}</title>
        <desc id={`${id}-chart-desc`}>Laveste måling {money(min)}, høyeste {money(max)}. Prisaksen er tilpasset perioden og starter ikke på null. Alle målinger står i tabellen nedenfor.</desc>
        <defs><linearGradient id={`${id}-fill`} x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#0052ff" stopOpacity="0.16" /><stop offset="100%" stopColor="#0052ff" stopOpacity="0" /></linearGradient></defs>
        {[35, 120, 205].map(y => <line key={y} x1="20" x2="740" y1={y} y2={y} stroke="#e5eaf4" strokeDasharray="4 5" />)}
        <path d={`M${coords.join(' L')} L740,220 L20,220 Z`} fill={`url(#${id}-fill)`} />
        <polyline points={coords.join(' ')} fill="none" stroke="#0052ff" strokeWidth="3" strokeLinejoin="round" strokeLinecap="round" />
      </svg>
      <div className="flex justify-between text-xs text-slate-500"><span>{day(start)}</span><span>{day(end)}</span></div>
      <p className="mt-4 text-xs leading-relaxed text-slate-500">Daglige observasjoner i NOK (UTC), ikke alle handler eller garanterte sluttkurser. Prisaksen er tilpasset perioden. {history.asOf && <>Hentet <time dateTime={history.asOf}>{formatPriceTime(history.asOf)}</time>.</>} <a className="text-brand hover:underline" href={history.sourceUrl} target="_blank" rel="noopener noreferrer">Datakilde</a>. {history.asOf && Date.now() - Date.parse(history.asOf) > 48 * 3600000 && 'Historikken er eldre enn to døgn.'}</p>
      <details className="mt-4 text-sm"><summary className="cursor-pointer font-medium text-brand">Se målingene som tabell</summary><div className="mt-3 overflow-x-auto"><table className="w-full text-sm"><caption className="sr-only">Historiske Bitcoin-målinger i norske kroner</caption><thead><tr><th scope="col" className="py-2 text-left">Dato (UTC)</th><th scope="col" className="py-2 text-right">NOK per BTC</th></tr></thead><tbody>{points.map(p => <tr key={p.timestamp} className="border-t border-slate-100"><th scope="row" className="py-2 text-left font-normal">{new Date(p.timestamp).toISOString().slice(0, 10)}</th><td className="py-2 text-right tabular-nums">{money(p.price)}</td></tr>)}</tbody></table></div></details>
    </section>
  );
}
