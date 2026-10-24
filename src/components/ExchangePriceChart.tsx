import type { ComparisonResult } from '../types';

interface Props {
  results: ComparisonResult[];
  isLoading: boolean;
  error: string | null;
}

const nok = (value: number) => `${value.toLocaleString('nb-NO', { maximumFractionDigits: 0 })} kr`;
const percent = (value: number) => `${value.toLocaleString('nb-NO', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} %`;

export default function ExchangePriceChart({ results, isLoading, error }: Props) {
  const rows = results
    .filter((result) => Number.isFinite(result.effectivePrice) && result.effectivePrice > 0)
    .slice()
    .sort((a, b) => a.effectivePrice - b.effectivePrice);
  const cheapest = rows[0]?.effectivePrice ?? 0;
  const largestDifference = rows.length ? rows[rows.length - 1].effectivePrice - cheapest : 0;

  return (
    <section id="prisforskjell" aria-labelledby="prisforskjell-title" className="site-container py-10 sm:py-12 scroll-mt-20">
      <div className="card-premium p-5 sm:p-8 space-y-6">
        <div className="space-y-3">
          <h2 id="prisforskjell-title" className="section-title">Prisforskjell mellom Bitcoin-børsene</h2>
          <p id="prisforskjell-description" className="text-sm text-slate-600 leading-relaxed">
            Se hva én Bitcoin koster etter beregnet handelsgebyr og estimert spread. Stolpene viser tillegget i kroner
            per BTC sammenlignet med børsen som har lavest beregnet pris. Kortere stolpe betyr mindre prisforskjell.
          </p>
        </div>

        {isLoading ? (
          <p role="status" className="rounded-xl bg-slate-50 p-6 text-sm text-slate-500">Henter priser til grafen …</p>
        ) : rows.length < 2 ? (
          <p role="status" className="rounded-xl bg-slate-50 p-6 text-sm text-slate-500">
            {error || 'Vi trenger priser fra minst to børser for å vise en prisforskjell. Prøv å laste siden på nytt.'}
          </p>
        ) : (
          <figure aria-describedby="prisforskjell-description" className="space-y-6">
            <figcaption className="flex flex-wrap justify-between gap-3 rounded-xl bg-slate-50 px-4 py-3 text-sm">
              <span className="font-semibold text-slate-900">Lavest beregnet pris: {rows[0].exchange}</span>
              <span className="text-slate-600">{nok(cheapest)} per BTC</span>
            </figcaption>
            <ol className="space-y-5" aria-label="Børser sortert fra lavest til høyest beregnet pris">
              {rows.map((row) => {
                const difference = row.effectivePrice - cheapest;
                const premium = difference / cheapest * 100;
                const width = largestDifference > 0 ? difference / largestDifference * 100 : 0;
                return (
                  <li key={row.exchange} className="space-y-2">
                    <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 text-sm">
                      <span className="font-semibold text-slate-900">{row.exchange}</span>
                      <span className="text-slate-600">{nok(row.effectivePrice)} per BTC</span>
                    </div>
                    <div aria-hidden="true" className="h-4 overflow-hidden rounded-full bg-slate-100">
                      <div className={`h-full rounded-full ${difference === 0 ? 'bg-emerald-500' : 'bg-brand'}`} style={{ width: `${width}%`, minWidth: '3px' }} />
                    </div>
                    <p className={`text-xs ${difference === 0 ? 'text-emerald-700 font-semibold' : 'text-slate-500'}`}>
                      {difference === 0 ? 'Lavest pris i denne sammenligningen' : `+${nok(difference)} per BTC · ${percent(premium)} dyrere enn laveste pris`}
                    </p>
                  </li>
                );
              })}
            </ol>
            <p className="text-sm text-slate-600">
              {largestDifference === 0
                ? 'Alle tilgjengelige børser har samme beregnede pris akkurat nå.'
                : `Forskjellen mellom laveste og høyeste beregnede pris er ${nok(largestDifference)} per BTC (${percent(largestDifference / cheapest * 100)}).`}
            </p>
          </figure>
        )}

        <p className="border-t border-slate-100 pt-4 text-xs leading-relaxed text-slate-500">
          Grafen bruker de samme prisdataene som sammenligningstabellen. Bare børser med en tilgjengelig, gyldig pris
          er med. Innskudd, uttak og eventuell valutaveksling kommer i tillegg. Prisene kan være hentet på litt ulike
          tidspunkt, og noen priser kan være referanseestimater. Dette er ikke bindende kjøpstilbud.
        </p>
      </div>
    </section>
  );
}
