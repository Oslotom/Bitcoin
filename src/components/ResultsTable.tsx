import { useMemo, useState } from 'react';
import { ArrowDown, ArrowUp, ArrowUpDown, ArrowUpRight } from 'lucide-react';
import { type ComparisonResult, type CryptoCurrency, Exchange } from '../types';
import { ExchangeIcon } from './icons';
import { premiumPercent } from '../utils/pricing';
import { FEE_EVIDENCE } from '../data/exchangeFees';
import { formatPriceTime, STALE_PRICE_AGE } from '../services/market';
import { trackEvent } from '../services/analytics';

interface Props { results: ComparisonResult[]; isLoading: boolean; error: string | null; crypto?: CryptoCurrency; compact?: boolean; }
type SortKey = 'exchange' | 'spotPrice' | 'feePercent' | 'cryptoAmount' | 'effectivePrice' | 'premium';
export const EXCHANGE_LINKS: Record<Exchange, string> = {
  [Exchange.Coinbase]: 'https://www.coinbase.com', [Exchange.Binance]: 'https://www.binance.com', [Exchange.Firi]: 'https://firi.com', [Exchange.Kraken]: 'https://www.kraken.com', [Exchange.NBX]: 'https://nbx.com', [Exchange.BareBitcoin]: 'https://barebitcoin.no', [Exchange.Revolut]: 'https://www.revolut.com', [Exchange.CryptoCom]: 'https://crypto.com', [Exchange.BuyBitcoin]: 'https://buybitcoin.com',
};
const money = (value: number) => value.toLocaleString('nb-NO', { maximumFractionDigits: 0 });
const btc = (value: number) => value.toLocaleString('nb-NO', { minimumFractionDigits: 8, maximumFractionDigits: 8 });
export function PriceSource({ result }: { result: ComparisonResult }) {
  const evidence = FEE_EVIDENCE[result.exchange];
  const kind = result.sourceKind === 'reference' ? 'Referanseestimat' : result.priceBasis === 'ask' ? 'Kjøpskurs' : result.priceBasis === 'reference' ? 'Spotreferanse' : 'Siste handel';
  const old = result.asOf && Date.now() - Date.parse(result.asOf) > STALE_PRICE_AGE;
  return <details className="quote-source"><summary>{kind}{!evidence.tradeVerified ? ' · modellsats' : ''}{old ? ' · eldre måling' : ''}</summary><div>
    <p>{result.asOf ? <>Pris fra <time dateTime={result.asOf}>{formatPriceTime(result.asOf)}</time>.</> : 'Tidspunkt mangler.'} {result.sourceKind === 'reference' && 'Dette er ikke en pris hentet hos denne tilbyderen.'}</p>
    {result.sourceUrl && <a href={result.sourceUrl} target="_blank" rel="noopener noreferrer">Åpne priskilden</a>}
    <p>{evidence.accountType}. {evidence.note} {result.spreadIncluded && 'Spread er allerede i kjøpskursen og legges ikke til på nytt.'}</p>
    <a href={evidence.sourceUrl} target="_blank" rel="noopener noreferrer">Gebyrkilde</a><p>{evidence.checkedAt ? `Handelsgebyr kontrollert ${evidence.checkedAt}.` : 'Handelsgebyret er ikke kontrollert – kun modellforutsetning.'}</p>
  </div></details>;
}

export default function ResultsTable({ results, isLoading, error }: Props) {
  const [sort, setSort] = useState<{ key: SortKey; direction: 'asc' | 'desc' }>({ key: 'effectivePrice', direction: 'asc' });
  const sorted = useMemo(() => [...results].sort((a, b) => {
    const get = (r: ComparisonResult) => sort.key === 'exchange' ? r.exchange : sort.key === 'feePercent' ? r.feeInNok / r.totalCost : sort.key === 'premium' ? r.effectivePrice : r[sort.key];
    const x = get(a), y = get(b); return (x < y ? -1 : x > y ? 1 : 0) * (sort.direction === 'asc' ? 1 : -1);
  }), [results, sort]);
  const amount = results[0]?.totalCost ?? 10000;
  const reference = results.find(r => r.exchange === Exchange.Coinbase)?.spotPrice ?? null;
  const setKey = (key: SortKey) => setSort(prev => ({ key, direction: prev.key === key ? prev.direction === 'asc' ? 'desc' : 'asc' : key === 'cryptoAmount' ? 'desc' : 'asc' }));
  const headings: { key: SortKey; label: string }[] = [
    { key: 'exchange', label: 'Børs' }, { key: 'spotPrice', label: 'Kurs per BTC' }, { key: 'feePercent', label: `Kostnad på ${money(amount)} kr` }, { key: 'cryptoAmount', label: 'Du får BTC' }, { key: 'effectivePrice', label: 'Pris inkl. gebyr/spread' }, { key: 'premium', label: 'Påslag mot referanse' },
  ];
  const icon = (key: SortKey) => sort.key !== key ? <ArrowUpDown size={12} aria-hidden="true" /> : sort.direction === 'asc' ? <ArrowUp size={12} aria-hidden="true" /> : <ArrowDown size={12} aria-hidden="true" />;
  const exchangeLink = (r: ComparisonResult) => <a href={EXCHANGE_LINKS[r.exchange]} target="_blank" rel="noopener noreferrer" onClick={() => trackEvent('exchange_click', { exchange: r.exchange })} className="inline-flex items-center gap-2 text-sm font-medium text-brand hover:underline"><ExchangeIcon exchange={r.exchange} size={23} />{r.exchange}<ArrowUpRight size={12} aria-hidden="true" /></a>;
  if (isLoading && !results.length) return <p role="status" className="py-8 text-sm text-slate-500">Henter prisgrunnlag …</p>;
  if (!results.length) return <p role="status" className="py-8 text-sm text-slate-600">{error || 'Ingen prisgrunnlag nyere enn 24 timer er tilgjengelige. Prøv å oppdatere, eller se gebyroversikten.'} <a className="text-brand underline" href="/om-oss#gebyroversikt">Se gebyrer</a></p>;
  return (
    <div id="results-table-compact" className="space-y-3 font-sans">
      <div className="comparison-mobile">
        <label className="mb-4 flex items-center justify-between gap-4 text-xs text-slate-500">Sorter børser<select className="rounded-lg border border-slate-200 bg-white px-2 py-2 text-slate-800" value={sort.key} onChange={e => setSort({ key: e.target.value as SortKey, direction: e.target.value === 'cryptoAmount' ? 'desc' : 'asc' })}>{headings.map(h => <option key={h.key} value={h.key}>{h.label}</option>)}</select></label>
        <ol className="divide-y divide-slate-100">{sorted.map(r => <li key={r.exchange} className="py-4 first:pt-0">
          <div className="flex items-start justify-between gap-3"><div>{exchangeLink(r)}</div><div className="text-right"><span className="block text-[10px] text-slate-500">Du får for {money(amount)} kr</span><strong className="text-sm font-semibold tabular-nums text-slate-900">{btc(r.cryptoAmount)} BTC</strong></div></div>
          <PriceSource result={r} /><dl className="mt-3 grid grid-cols-2 gap-3 text-xs"><div><dt className="text-slate-500">Beregnet pris / BTC</dt><dd className="mt-1 font-medium tabular-nums text-slate-900">{money(r.effectivePrice)} NOK</dd></div><div className="text-right"><dt className="text-slate-500">Gebyr + ekstra spread</dt><dd className="mt-1 tabular-nums text-slate-900">{money(r.feeInNok)} kr <span className="text-slate-500">({(r.feeInNok / r.totalCost * 100).toLocaleString('nb-NO', { maximumFractionDigits: 2 })} %)</span></dd></div></dl>
        </li>)}</ol>
      </div>
      <div className="comparison-desktop overflow-x-auto bg-white">
        <table className="w-full min-w-[940px] border-collapse text-sm">
          <caption className="sr-only">Beregnet Bitcoin-kjøp for {money(amount)} kroner. Kurs og effektiv kjøpspris er per BTC.</caption>
          <thead className="border-b border-slate-100 text-xs text-slate-500"><tr>{headings.map(h => <th key={h.key} scope="col" aria-sort={sort.key === h.key ? sort.direction === 'asc' ? 'ascending' : 'descending' : 'none'} className={`px-3 py-3 font-medium ${h.key === 'exchange' ? 'pl-1 text-left' : 'text-right'}`}><button type="button" onClick={() => setKey(h.key)} className={`inline-flex items-center gap-1 py-1 ${sort.key === h.key ? 'text-brand' : 'hover:text-slate-900'}`}>{h.label}{icon(h.key)}</button></th>)}</tr></thead>
          <tbody className="divide-y divide-slate-100">{sorted.map(r => {
            const premium = premiumPercent(r.effectivePrice, reference);
            return <tr key={r.exchange} className="hover:bg-slate-50"><th scope="row" className="pl-1 pr-3 py-3 text-left font-normal">{exchangeLink(r)}<PriceSource result={r} /></th>
              <td className="px-3 py-3 text-right tabular-nums whitespace-nowrap">{money(r.spotPrice)} <span className="text-[10px] text-slate-500">NOK</span></td>
              <td className="px-3 py-3 text-right tabular-nums whitespace-nowrap">{money(r.feeInNok)} kr <span className="text-xs text-slate-500">({(r.feeInNok / r.totalCost * 100).toLocaleString('nb-NO', { maximumFractionDigits: 2 })} %)</span></td>
              <td className="px-3 py-3 text-right tabular-nums whitespace-nowrap">{btc(r.cryptoAmount)}</td>
              <td className="px-3 py-3 text-right font-medium tabular-nums whitespace-nowrap">{money(r.effectivePrice)} <span className="text-[10px] font-normal text-slate-500">NOK</span></td>
              <td className="px-3 py-3 text-right tabular-nums whitespace-nowrap">{premium === null ? '—' : `${premium > 0 ? '+' : ''}${premium.toLocaleString('nb-NO', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} %`}</td>
            </tr>;
          })}</tbody>
        </table>
      </div>
      <details className="px-1 text-xs text-slate-500"><summary className="cursor-pointer font-medium hover:text-brand">Slik regner vi pris og påslag</summary><p className="mt-2 max-w-3xl leading-relaxed">Mengde BTC = beløp × (1 − handelsgebyr − ekstra spread) / grunnpris. Effektiv pris per BTC = grunnpris / (1 − handelsgebyr − ekstra spread). Spread som allerede er i kjøpskursen legges ikke til på nytt. Påslag måles mot Coinbase sin spotkurs. Beløpene avrundes for visning; sortering og beregning bruker uavrundede tall. Innskudd, uttak og valutaveksling kommer i tillegg. Produkter og kontosatser er forskjellige. <a href="/om-oss#metode" className="text-brand hover:underline">Se metode og begrensninger</a>.</p></details>
    </div>
  );
}
