import { useState } from 'react';
import { ArrowUpRight, Maximize2 } from 'lucide-react';
import { Exchange, type ComparisonResult } from '../types';
import { FEES } from '../services/api';
import { bitcoinCostBreakdown } from '../utils/pricing';
import { ExchangeIcon } from './icons';

interface Props {
  results: ComparisonResult[];
  isLoading: boolean;
  error: string | null;
}

// An editorial selection, not a ranking by volume or market share.
export const CHART_EXCHANGES = [Exchange.Firi, Exchange.NBX, Exchange.BareBitcoin, Exchange.Kraken, Exchange.Binance];
const nok = (value: number) => `${value.toLocaleString('nb-NO', { maximumFractionDigits: 0 })} kr`;
const preciseNok = (value: number) => `${value.toLocaleString('nb-NO', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} kr`;

export default function ExchangePriceChart({ results, isLoading, error }: Props) {
  const [zoomed, setZoomed] = useState(true);
  const rows = CHART_EXCHANGES.map((exchange) => {
    const result = results.find((row) => row.exchange === exchange);
    const cost = result ? bitcoinCostBreakdown(result.spotPrice, result.tradeRate ?? FEES[exchange].trade, result.spreadRate ?? FEES[exchange].spread, result.includedSpreadNok ?? 0) : null;
    return { exchange, cost, result };
  }).sort((a, b) => (a.cost?.total ?? Infinity) - (b.cost?.total ?? Infinity));
  const available = rows.flatMap((row) => row.cost ? [row.cost] : []);
  const minimumSpot = available.length ? Math.min(...available.map((row) => row.spot)) : 0;
  const maximumTotal = available.length ? Math.max(...available.map((row) => row.total)) : 1;
  const axisStart = zoomed ? minimumSpot * 0.997 : 0;
  const axisEnd = maximumTotal * 1.001;
  const axisRange = axisEnd - axisStart;
  const ticks = Array.from({ length: 5 }, (_, i) => axisStart + axisRange * i / 4);

  return (
    <section id="prisforskjell" aria-labelledby="prisforskjell-title" className="site-container py-10 sm:py-12 scroll-mt-20">
      <div className="price-breakdown space-y-7">
        <div className="flex flex-wrap items-end justify-between gap-5">
          <div className="max-w-xl">
            <p className="section-eyebrow">Prisen, del for del</p>
            <h2 id="prisforskjell-title" className="home-section-title">Hva koster én Bitcoin?</h2>
            <p id="prisforskjell-description" className="mt-3 text-sm leading-relaxed text-slate-600">Fem utvalgte børser. Hver linje viser grunnpris, beregnet handelsgebyr og målt eller estimert spread. Endepunktet viser beregnet totalpris for 1 BTC.</p>
          </div>
          <button type="button" onClick={() => setZoomed((value) => !value)} aria-pressed={zoomed} aria-controls="bitcoin-cost-lines" className="price-scale-toggle"><Maximize2 size={14} aria-hidden="true" /> Zoom på forskjeller <span>{zoomed ? 'På' : 'Av'}</span></button>
        </div>

        <ul className="price-legend" aria-label="Farger i grafen">
          <li><span className="price-key price-spot" aria-hidden="true" /> Grunnpris</li>
          <li><span className="price-key price-trade" aria-hidden="true" /> Handelsgebyr</li>
          <li><span className="price-key price-spread" aria-hidden="true" /> Spread (målt/est.)</li>
        </ul>

        <figure id="bitcoin-cost-lines" aria-describedby="prisforskjell-description price-axis-note">
          {isLoading ? (
            <div role="status" className="space-y-7 py-3">
              <p className="text-sm text-slate-500">Henter priser til grafen …</p>
              <div aria-hidden="true" className="space-y-8">{CHART_EXCHANGES.map((exchange) => <div key={exchange} className="price-line-skeleton" />)}</div>
            </div>
          ) : (
            <>
              {available.length === 0 && <p role="status" className="mb-5 rounded-xl bg-white p-4 text-sm text-slate-600">{error || 'Priser er ikke tilgjengelige akkurat nå. Prøv å hente prisene på nytt i tabellen.'}</p>}
              <ol className="price-lines" aria-label="Utvalgte børser sortert etter beregnet totalpris per Bitcoin">
                {rows.map(({ exchange, cost, result }, index) => (
                  <li key={exchange} className="price-line-row">
                    <div className="price-line-heading">
                      <div className="flex items-center gap-2 text-sm font-semibold text-slate-900"><ExchangeIcon exchange={exchange} size={23} />{exchange}{index === 0 && cost && available.length > 1 && <span className="price-lowest">Lavest i modellen</span>}</div>
                      <span className="text-sm font-semibold tabular-nums text-slate-900">{cost ? nok(cost.total) : <span className="font-normal text-slate-500">Pris utilgjengelig</span>}</span>
                    </div>
                    {cost ? (
                      <div className="price-line-visual">
                        <div className="price-line-track" aria-hidden="true">
                          <div className="price-line-segments" style={{ width: `${(cost.total - axisStart) / axisRange * 100}%` }}>
                            <span className="price-spot" style={{ flexGrow: cost.spot - axisStart }} />
                            <span className="price-trade" style={{ flexGrow: cost.trade }} />
                            <span className="price-spread" style={{ flexGrow: cost.spread }} />
                            <span className="price-endpoint" />
                          </div>
                        </div>
                        <details className="price-line-details" name="bitcoin-price-breakdown">
                          <summary>Fordeling<span className="sr-only"> for {exchange}</span><span aria-hidden="true">⌄</span></summary>
                          <dl className="price-line-values">
                          <div className="text-xs text-slate-500">{result?.sourceKind === 'reference' ? 'Referanseestimat, ikke børspris.' : result?.includedSpreadNok !== undefined ? 'Målt spread er forskjellen fra bid/ask-midtkurs til kjøpskurs. Den er allerede inkludert, ikke lagt til på nytt.' : result?.priceBasis === 'ask' ? 'Kjøpskurs – spread er inkludert, men kan ikke skilles ut med tilgjengelige data.' : 'Siste handel – ekstra spread er modellert.'}</div>
                          <div><dt><span className="price-key price-spot" aria-hidden="true" />Grunnpris</dt><dd>{preciseNok(cost.spot)}</dd></div>
                          <div><dt><span className="price-key price-trade" aria-hidden="true" />Gebyr</dt><dd>{preciseNok(cost.trade)}</dd></div>
                          <div><dt><span className="price-key price-spread" aria-hidden="true" />Spread</dt><dd>{preciseNok(cost.spread)}</dd></div>
                          </dl>
                        </details>
                      </div>
                    ) : <div className="price-line-visual"><div className="price-unavailable" aria-hidden="true" /></div>}
                  </li>
                ))}
              </ol>
              {available.length > 0 && <div className="price-axis" aria-hidden="true">{ticks.map((value, i) => <span key={i}>{nok(value)}</span>)}</div>}
            </>
          )}
          <figcaption id="price-axis-note" className="mt-5 text-xs leading-relaxed text-slate-500">{zoomed ? `Zoomvisning: prisaksen starter ${available.length && !isLoading ? `ved ${nok(axisStart)}` : 'over null'}. Den første delen av grunnprisen er utelatt for å gjøre gebyrene synlige. Slå av zoom for å vise hele prisen fra 0 kr.` : 'Hele prisen vises fra 0 kr. Alle linjene bruker samme skala; små gebyrer kan være vanskelige å se.'} Velg «Fordeling» for å se delbeløpene.</figcaption>
        </figure>

        <div className="flex flex-wrap items-start justify-between gap-4 border-t border-slate-200 pt-5 text-xs leading-relaxed text-slate-500">
          <p className="max-w-2xl">Samme gebyrmodell som tabellen. Grunnprisen kan være en børspris eller et referanseestimat. Innskudd, uttak og valutaveksling kommer i tillegg. Tallene er beregninger, ikke bindende kjøpstilbud.</p>
          <a href="/om-oss#metode" className="inline-flex min-h-8 items-center gap-1 font-medium text-brand">Se beregningen <ArrowUpRight size={13} aria-hidden="true" /></a>
        </div>
      </div>
    </section>
  );
}
