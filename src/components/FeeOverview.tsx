import { FEES } from '../services/api';
import { Exchange } from '../types';
import { FEE_EVIDENCE } from '../data/exchangeFees';

declare const __PAGE_DATES__: Record<string, string>;

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

// Kort, datadrevet svar på «hvor er det billigst å kjøpe Bitcoin?» (forsiden og FAQPage-schema)
export const cheapestSummary = () => {
  const rows = feeRows();
  const cheapest = rows[0];
  const cheapestNorwegian = rows.find((row) => row.norwegian)!;
  const priciest = rows[rows.length - 1];
  const fee = (row: (typeof rows)[number]) => Math.round(10000 * row.total);
  return `Med handelsgebyrene og estimert spread i vår sammenligning har ${cheapest.exchange} lavest beregnet kostnad (${formatPercent(cheapest.total)}), og ${cheapestNorwegian.exchange} lavest blant de norske børsene (${formatPercent(cheapestNorwegian.total)}). På et kjøp av 10 000 kr tilsvarer det anslagsvis ${fee(cheapest)} kr hos ${cheapest.exchange}, ${fee(cheapestNorwegian)} kr hos ${cheapestNorwegian.exchange} og ${fee(priciest)} kr hos ${priciest.exchange}. Valutaveksling, innskudd og uttak kommer i tillegg. Hvilken børs som er billigst for deg avhenger også av betalingsmåte og gjeldende vilkår.`;
};

// Statisk gebyroversikt: synlig uten at live-prisene må lastes, slik at både Google
// og AI-crawlere (som ikke kjører JavaScript) får med seg tallene.
export default function FeeOverview() {
  const rows = feeRows();
  const example = 10000;

  return (
    <section id="gebyroversikt" className="w-full py-4 space-y-5">
      <div className="space-y-2">
        <h2 className="section-title">Gebyroversikt: hva koster det å kjøpe Bitcoin?</h2>
        <p className="text-slate-600 leading-relaxed">
          Tabellen viser modellens handelsgebyr og estimerte spread, sortert etter samlet sats.
          Kolonnen til høyre viser beregnet kostnad på et kjøp av {example.toLocaleString('nb-NO')} kr, ikke et bekreftet tilbud fra børsen.
        </p>
        <p className="text-sm text-slate-500">
          Innhold sist endret: <time dateTime={__PAGE_DATES__.about}>{formatDate(__PAGE_DATES__.about)}</time>. Kontrollert dato for hver gebyrkilde står nedenfor.
        </p>
      </div>

      <div className="card-premium overflow-x-auto">
        <table className="w-full text-sm font-sans">
          <caption className="sr-only">Gebyrer for kjøp av Bitcoin i Norge per børs</caption>
          <thead className="bg-slate-50 text-left text-slate-500">
            <tr>
              <th scope="col" className="px-4 py-3 font-semibold">Børs</th>
              <th scope="col" className="px-4 py-3 font-semibold">Handelsgebyr</th>
              <th scope="col" className="px-4 py-3 font-semibold">Ekstra spread i modellen</th>
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
                  {!FEE_EVIDENCE[row.exchange].tradeVerified && <span className="block text-xs font-normal text-amber-800">Ubekreftet modellsats</span>}
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

      <div id="gebyrkilder" className="space-y-3">
        <h3 className="font-semibold text-slate-900">Kilder, scenario og kontroll</h3>
        <p className="text-sm text-slate-600">Satser gjelder ulike produkter. En Pro/Advanced-konto er ikke det samme som enkelkjøp i en app. Tall uten bekreftet kilde er tydelig merket og skal ikke leses som et faktisk tilbud.</p>
        {rows.map(row => { const evidence = FEE_EVIDENCE[row.exchange]; return <details key={row.exchange} className="border-b border-slate-100 pb-3 text-sm"><summary className="cursor-pointer text-slate-900">{row.exchange} · {evidence.checkedAt ? `kontrollert ${formatDate(evidence.checkedAt)}` : 'ikke kontrollert'}</summary><p className="mt-2 text-slate-600">{evidence.accountType}. {evidence.note}</p><a className="text-brand hover:underline" href={evidence.sourceUrl} target="_blank" rel="noopener noreferrer">Les tilbyderens priser og vilkår</a></details>; })}
      </div>

      <div className="space-y-2 text-sm text-slate-600 leading-relaxed">
        <h3 className="font-bold text-slate-900">Slik beregner vi prisene</h3>
        <p>
          Prisgrunnlaget kommer fra børsenes API-er eller referanseestimater, omregnet til norske kroner. Vi legger til handelsgebyret og en
          estimert spread der den ikke allerede er inkludert i kjøpskursen. Vi beregner hvor mye Bitcoin du kan sitte igjen med i det valgte scenarioet. Innskuddsgebyrer
          (f.eks. ved Vipps eller kort) og uttaksgebyrer kommer i tillegg og er ikke med i tallene over. Gebyrene kan endres
          av børsene – sjekk alltid prisen hos børsen før du handler.
        </p>
      </div>
    </section>
  );
}
