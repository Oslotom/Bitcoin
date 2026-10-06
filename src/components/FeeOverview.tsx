import { FEES } from '../services/api';
import { Exchange } from '../types';

declare const __BUILD_DATE__: string;

const NORWEGIAN_EXCHANGES = new Set<Exchange>([Exchange.Firi, Exchange.NBX, Exchange.BareBitcoin]);

const formatPercent = (value: number) =>
  `${(value * 100).toLocaleString('nb-NO', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} %`;

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString('nb-NO', { day: 'numeric', month: 'long', year: 'numeric' });

export const feeRows = () =>
  (Object.keys(FEES) as Exchange[])
    .map((exchange) => ({
      exchange,
      trade: FEES[exchange].trade,
      spread: FEES[exchange].spread,
      total: FEES[exchange].trade + FEES[exchange].spread,
      norwegian: NORWEGIAN_EXCHANGES.has(exchange),
    }))
    .sort((a, b) => a.total - b.total);

// Statisk gebyroversikt: synlig uten at live-prisene må lastes, slik at både Google
// og AI-crawlere (som ikke kjører JavaScript) får med seg tallene.
export default function FeeOverview() {
  const rows = feeRows();
  const example = 10000;

  return (
    <section id="gebyroversikt" className="max-w-5xl mx-auto px-4 py-12 space-y-6">
      <div className="space-y-2">
        <h2 className="text-3xl font-display font-bold tracking-tight">Gebyroversikt: hva koster det å kjøpe Bitcoin?</h2>
        <p className="text-slate-600 leading-relaxed">
          Tabellen viser handelsgebyr og estimert spread for kjøp av Bitcoin med norske kroner, sortert fra billigst til dyrest.
          Kolonnen til høyre viser hva du betaler i gebyr på et kjøp av {example.toLocaleString('nb-NO')} kr.
        </p>
        <p className="text-xs text-slate-400 font-medium">
          Sist oppdatert: <time dateTime={__BUILD_DATE__}>{formatDate(__BUILD_DATE__)}</time>
        </p>
      </div>

      <div className="card-premium overflow-x-auto">
        <table className="w-full text-sm font-table">
          <caption className="sr-only">Gebyrer for kjøp av Bitcoin i Norge per børs</caption>
          <thead className="bg-slate-50 text-left text-slate-500">
            <tr>
              <th scope="col" className="px-4 py-3 font-semibold">Børs</th>
              <th scope="col" className="px-4 py-3 font-semibold">Handelsgebyr</th>
              <th scope="col" className="px-4 py-3 font-semibold">Spread (est.)</th>
              <th scope="col" className="px-4 py-3 font-semibold">Totalt</th>
              <th scope="col" className="px-4 py-3 font-semibold text-right">Gebyr på {example.toLocaleString('nb-NO')} kr</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {rows.map((row) => (
              <tr key={row.exchange}>
                <th scope="row" className="px-4 py-3 text-left font-bold text-slate-900">
                  {row.exchange}
                  {row.norwegian && <span className="ml-2 text-[10px] font-bold uppercase text-brand">Norsk</span>}
                </th>
                <td className="px-4 py-3 text-slate-600">{formatPercent(row.trade)}</td>
                <td className="px-4 py-3 text-slate-600">{formatPercent(row.spread)}</td>
                <td className="px-4 py-3 font-semibold text-slate-900">{formatPercent(row.total)}</td>
                <td className="px-4 py-3 text-right text-slate-600">
                  {Math.round(example * row.total).toLocaleString('nb-NO')} kr
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="space-y-2 text-sm text-slate-600 leading-relaxed">
        <h3 className="font-bold text-slate-900">Slik beregner vi prisene</h3>
        <p>
          Live-prisene hentes direkte fra børsenes offentlige API-er i norske kroner. Vi legger til handelsgebyret og en
          estimert spread for hver børs, og regner ut hvor mye Bitcoin du faktisk sitter igjen med. Innskuddsgebyrer
          (f.eks. ved Vipps eller kort) og uttaksgebyrer kommer i tillegg og er ikke med i tallene over. Gebyrene kan endres
          av børsene – sjekk alltid prisen hos børsen før du handler.
        </p>
      </div>
    </section>
  );
}
