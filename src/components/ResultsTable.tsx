import { Fragment, useId, useMemo, useState } from 'react';
import { ArrowDown, ArrowUp, ArrowUpDown, ArrowUpRight, ChevronDown } from 'lucide-react';
import { type ComparisonResult, type CryptoCurrency, Exchange } from '../types';
import { ExchangeIcon } from './icons';
import { premiumPercent } from '../utils/pricing';
import { EXCHANGE_FEES, FEE_EVIDENCE } from '../data/exchangeFees';
import { formatPriceTime, STALE_PRICE_AGE } from '../services/market';
import { trackEvent } from '../services/analytics';

interface Props { results: ComparisonResult[]; isLoading: boolean; error: string | null; crypto?: CryptoCurrency; compact?: boolean; }
type SortKey = 'exchange' | 'spotPrice' | 'feePercent' | 'cryptoAmount' | 'effectivePrice' | 'premium';
export const EXCHANGE_LINKS: Record<Exchange, string> = {
  [Exchange.Coinbase]: 'https://www.coinbase.com', [Exchange.Binance]: 'https://www.binance.com', [Exchange.Firi]: 'https://firi.com', [Exchange.Kraken]: 'https://www.kraken.com', [Exchange.NBX]: 'https://nbx.com', [Exchange.BareBitcoin]: 'https://barebitcoin.no', [Exchange.Revolut]: 'https://www.revolut.com', [Exchange.CryptoCom]: 'https://crypto.com', [Exchange.BuyBitcoin]: 'https://buybitcoin.com',
};
const money = (value: number) => value.toLocaleString('nb-NO', { maximumFractionDigits: 0 });
const btc = (value: number) => value.toLocaleString('nb-NO', { minimumFractionDigits: 8, maximumFractionDigits: 8 });
const percent = (value: number) => `${(value * 100).toLocaleString('nb-NO', { maximumFractionDigits: 2 })} %`;
const sourceLabel = (result: ComparisonResult) => result.sourceKind === 'reference' ? 'Referanseestimat' : result.priceBasis === 'ask' ? 'Kjøpskurs' : result.priceBasis === 'reference' ? 'Spotreferanse' : 'Siste handel';
export function PriceSource({ result }: { result: ComparisonResult }) {
  const evidence = FEE_EVIDENCE[result.exchange];
  const kind = sourceLabel(result);
  const old = result.asOf && Date.now() - Date.parse(result.asOf) > STALE_PRICE_AGE;
  return <details className="quote-source"><summary>{kind}{!evidence.tradeVerified ? ' · modellsats' : ''}{old ? ' · eldre måling' : ''}</summary><div>
    <p>{result.asOf ? <>Pris fra <time dateTime={result.asOf}>{formatPriceTime(result.asOf)}</time>.</> : 'Tidspunkt mangler.'} {result.sourceKind === 'reference' && 'Dette er ikke en pris hentet hos denne tilbyderen.'}</p>
    {result.sourceUrl && <a href={result.sourceUrl} target="_blank" rel="noopener noreferrer">Åpne priskilden</a>}
    <p>{evidence.accountType}. {evidence.note} {result.spreadIncluded && 'Spread er allerede i kjøpskursen og legges ikke til på nytt.'}</p>
    <a href={evidence.sourceUrl} target="_blank" rel="noopener noreferrer">Gebyrkilde</a><p>{evidence.checkedAt ? `Handelsgebyr kontrollert ${evidence.checkedAt}.` : 'Handelsgebyret er ikke kontrollert – kun modellforutsetning.'}</p>
  </div></details>;
}

function ExchangeDetails({ result }: { result: ComparisonResult }) {
  const evidence = FEE_EVIDENCE[result.exchange];
  const trade = result.tradeRate ?? EXCHANGE_FEES[result.exchange].trade;
  const spread = result.spreadIncluded ? 0 : result.spreadRate ?? EXCHANGE_FEES[result.exchange].spread;
  return (
    <div className="exchange-details">
      <div>
        <p className="exchange-details-title">Kostnader for {money(result.totalCost)} kr hos {result.exchange}</p>
        <dl className="exchange-fee-grid">
          <div><dt>Handelsgebyr / kurtasje</dt><dd>{money(result.totalCost * trade)} kr <span>({percent(trade)})</span></dd></div>
          <div><dt>Ekstra estimert spread</dt><dd>{money(result.totalCost * spread)} kr <span>({percent(spread)})</span></dd></div>
          <div><dt>Sum beregnede tillegg</dt><dd>{money(result.feeInNok)} kr</dd></div>
          <div><dt>Beregnet mengde Bitcoin</dt><dd>{btc(result.cryptoAmount)} BTC</dd></div>
        </dl>
        <p className="mt-3 text-xs leading-relaxed text-slate-600">{result.spreadIncluded ? `Spread ligger allerede i kjøpskursen og legges ikke til på nytt.${result.includedSpreadNok !== undefined ? ` Målt kjøpsside-spread er ${money(result.includedSpreadNok)} kr per BTC.` : ''}` : 'Spread er en modellforutsetning og kan avvike fra prisen ved handel.'} Innskudd, kort/Vipps, uttak og valutaveksling er ikke inkludert.</p>
      </div>
      <div className="exchange-details-source">
        <p className="exchange-details-title">Prisgrunnlag og vilkår</p>
        <p>{evidence.accountType}. {evidence.note}</p>
        <p>{sourceLabel(result)}{result.asOf && <> fra <time dateTime={result.asOf}>{formatPriceTime(result.asOf)}</time></>}. {result.sourceKind === 'reference' && 'Dette er ikke et kjøpstilbud fra denne børsen.'}</p>
        <div className="flex flex-wrap gap-x-4 gap-y-2">
          {result.sourceUrl && <a href={result.sourceUrl} target="_blank" rel="noopener noreferrer">Se priskilden</a>}
          <a href={evidence.sourceUrl} target="_blank" rel="noopener noreferrer">Gebyrer og prisliste</a>
        </div>
        <p>{evidence.checkedAt ? `Handelsgebyr kontrollert ${evidence.checkedAt}.` : 'Ubekreftet gebyrsats – kun modellforutsetning.'}</p>
        <a href={EXCHANGE_LINKS[result.exchange]} target="_blank" rel="noopener noreferrer" onClick={() => trackEvent('exchange_click', { exchange: result.exchange })} className="btn-primary exchange-visit-link">Besøk {result.exchange}<ArrowUpRight size={15} aria-hidden="true" /><span className="sr-only"> (åpnes i ny fane)</span></a>
        <span className="text-[11px] text-slate-500">Direkte til børsen. Ingen henvisningslenke eller provisjon.</span>
      </div>
    </div>
  );
}

export default function ResultsTable({ results, isLoading, error }: Props) {
  const id = useId();
  const [expandedExchange, setExpandedExchange] = useState<Exchange | null>(null);
  const [sort, setSort] = useState<{ key: SortKey; direction: 'asc' | 'desc' }>({ key: 'effectivePrice', direction: 'asc' });
  const sorted = useMemo(() => [...results].sort((a, b) => {
    const get = (r: ComparisonResult) => sort.key === 'exchange' ? r.exchange : sort.key === 'feePercent' ? r.feeInNok / r.totalCost : sort.key === 'premium' ? r.effectivePrice : r[sort.key];
    const x = get(a), y = get(b); return (x < y ? -1 : x > y ? 1 : 0) * (sort.direction === 'asc' ? 1 : -1);
  }), [results, sort]);
  const amount = results[0]?.totalCost ?? 10000;
  const reference = results.find(r => r.exchange === Exchange.Coinbase)?.spotPrice ?? null;
  const setKey = (key: SortKey) => setSort(prev => ({ key, direction: prev.key === key ? prev.direction === 'asc' ? 'desc' : 'asc' : key === 'cryptoAmount' ? 'desc' : 'asc' }));
  const headings: { key: SortKey; label: string }[] = [
    { key: 'exchange', label: 'Børs' }, { key: 'spotPrice', label: 'Kurs per BTC' }, { key: 'feePercent', label: `Kostnad på ${money(amount)} kr` }, { key: 'cryptoAmount', label: 'BTC' }, { key: 'effectivePrice', label: 'Pris inkl. gebyr/spread' }, { key: 'premium', label: 'Påslag mot referanse' },
  ];
  const icon = (key: SortKey) => sort.key !== key ? <ArrowUpDown size={12} aria-hidden="true" /> : sort.direction === 'asc' ? <ArrowUp size={12} aria-hidden="true" /> : <ArrowDown size={12} aria-hidden="true" />;
  const detailId = (exchange: Exchange, view: 'mobile' | 'desktop') => `${id}-${view}-${Object.values(Exchange).indexOf(exchange)}`;
  const toggleExchange = (exchange: Exchange) => setExpandedExchange(previous => previous === exchange ? null : exchange);
  const exchangeButton = (r: ComparisonResult, view: 'mobile' | 'desktop') => <button type="button" id={`${detailId(r.exchange, view)}-button`} aria-expanded={expandedExchange === r.exchange} aria-controls={`${detailId(r.exchange, view)}-details`} onClick={() => toggleExchange(r.exchange)} className="exchange-toggle"><ExchangeIcon exchange={r.exchange} size={23} /><span>{r.exchange}</span><ChevronDown size={14} aria-hidden="true" /></button>;
  if (isLoading && !results.length) return <p role="status" className="py-8 text-sm text-slate-500">Henter prisgrunnlag …</p>;
  if (!results.length) return <p role="status" className="py-8 text-sm text-slate-600">{error || 'Ingen prisgrunnlag nyere enn 24 timer er tilgjengelige. Prøv å oppdatere, eller se gebyroversikten.'} <a className="text-brand underline" href="/om-oss#gebyroversikt">Se gebyrer</a></p>;
  return (
    <div id="results-table-compact" className="space-y-3 font-sans">
      <div className="comparison-mobile">
        <label className="mb-4 flex items-center justify-between gap-4 text-xs text-slate-500">Sorter børser<select className="rounded-lg border border-slate-200 bg-white px-2 py-2 text-slate-800" value={sort.key} onChange={e => setSort({ key: e.target.value as SortKey, direction: e.target.value === 'cryptoAmount' ? 'desc' : 'asc' })}>{headings.map(h => <option key={h.key} value={h.key}>{h.label}</option>)}</select></label>
        <ol className="divide-y divide-slate-100">{sorted.map(r => <li key={r.exchange} className="py-4 first:pt-0">
          <div>{exchangeButton(r, 'mobile')}</div>
          <dl className="mt-3 grid grid-cols-2 gap-3 text-xs"><div><dt className="text-slate-500">Beregnet pris / BTC</dt><dd className="mt-1 font-medium tabular-nums text-slate-900">{money(r.effectivePrice)} NOK</dd></div><div className="text-right"><dt className="text-slate-500">Gebyr + ekstra spread</dt><dd className="mt-1 tabular-nums text-slate-900">{money(r.feeInNok)} kr <span className="text-slate-500">({(r.feeInNok / r.totalCost * 100).toLocaleString('nb-NO', { maximumFractionDigits: 2 })} %)</span></dd></div></dl>
          <div id={`${detailId(r.exchange, 'mobile')}-details`} role="region" aria-labelledby={`${detailId(r.exchange, 'mobile')}-button`} hidden={expandedExchange !== r.exchange}><ExchangeDetails result={r} /></div>
        </li>)}</ol>
      </div>
      <div className="comparison-desktop overflow-x-auto bg-white">
        <table className="w-full min-w-[940px] border-collapse text-sm">
          <caption className="sr-only">Beregnet Bitcoin-kjøp for {money(amount)} kroner. Kurs og effektiv kjøpspris er per BTC.</caption>
          <thead className="border-b border-slate-100 text-xs text-slate-500"><tr>{headings.map(h => <th key={h.key} scope="col" aria-sort={sort.key === h.key ? sort.direction === 'asc' ? 'ascending' : 'descending' : 'none'} className={`px-3 py-3 font-medium ${h.key === 'exchange' ? 'pl-1 text-left' : 'text-right'}`}><button type="button" onClick={() => setKey(h.key)} className={`inline-flex items-center gap-1 py-1 ${sort.key === h.key ? 'text-brand' : 'hover:text-slate-900'}`}>{h.label}{icon(h.key)}</button></th>)}</tr></thead>
          <tbody className="divide-y divide-slate-100">{sorted.map(r => {
            const premium = premiumPercent(r.effectivePrice, reference);
            return <Fragment key={r.exchange}><tr className="exchange-summary-row cursor-pointer hover:bg-slate-50" onClick={event => { if (!(event.target as HTMLElement).closest('button, a, input, select, summary')) toggleExchange(r.exchange); }}><th scope="row" className="pl-1 pr-3 py-3 text-left font-normal">{exchangeButton(r, 'desktop')}</th>
              <td className="px-3 py-3 text-right tabular-nums whitespace-nowrap">{money(r.spotPrice)} <span className="text-[10px] text-slate-500">NOK</span></td>
              <td className="px-3 py-3 text-right tabular-nums whitespace-nowrap">{money(r.feeInNok)} kr <span className="text-xs text-slate-500">({(r.feeInNok / r.totalCost * 100).toLocaleString('nb-NO', { maximumFractionDigits: 2 })} %)</span></td>
              <td className="px-3 py-3 text-right tabular-nums whitespace-nowrap">{btc(r.cryptoAmount)}</td>
              <td className="px-3 py-3 text-right font-medium tabular-nums whitespace-nowrap">{money(r.effectivePrice)} <span className="text-[10px] font-normal text-slate-500">NOK</span></td>
              <td className="px-3 py-3 text-right tabular-nums whitespace-nowrap">{premium === null ? '—' : `${premium > 0 ? '+' : ''}${premium.toLocaleString('nb-NO', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} %`}</td>
            </tr><tr className="exchange-detail-row" hidden={expandedExchange !== r.exchange}><td colSpan={headings.length}><div id={`${detailId(r.exchange, 'desktop')}-details`} role="region" aria-labelledby={`${detailId(r.exchange, 'desktop')}-button`}><ExchangeDetails result={r} /></div></td></tr></Fragment>;
          })}</tbody>
        </table>
      </div>
      <details className="px-1 text-xs text-slate-500"><summary className="cursor-pointer font-medium hover:text-brand">Slik regner vi pris og påslag</summary><p className="mt-2 max-w-3xl leading-relaxed">Mengde BTC = beløp × (1 − handelsgebyr − ekstra spread) / grunnpris. Effektiv pris per BTC = grunnpris / (1 − handelsgebyr − ekstra spread). Spread som allerede er i kjøpskursen legges ikke til på nytt. Påslag måles mot Coinbase sin spotkurs. Beløpene avrundes for visning; sortering og beregning bruker uavrundede tall. Innskudd, uttak og valutaveksling kommer i tillegg. Produkter og kontosatser er forskjellige. <a href="/om-oss#metode" className="text-brand hover:underline">Se metode og begrensninger</a>.</p></details>
    </div>
  );
}
