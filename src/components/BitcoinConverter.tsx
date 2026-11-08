import { useId, useState } from 'react';
import { Exchange, type ComparisonResult } from '../types';

export default function BitcoinConverter({ results }: { results: ComparisonResult[] }) {
  const id = useId();
  const [mode, setMode] = useState<'nok' | 'btc'>('nok');
  const [input, setInput] = useState('1000');
  const reference = results.find(r => r.exchange === Exchange.Coinbase);
  const value = Number(input.replace(',', '.'));
  const valid = input.trim() !== '' && Number.isFinite(value) && value >= 0 && value <= (mode === 'btc' ? 21000000 : 1e12);
  const output = valid && reference ? mode === 'nok' ? value / reference.spotPrice : value * reference.spotPrice : null;
  return <section className="converter-panel" aria-labelledby={`${id}-title`}><h2 id={`${id}-title`} className="section-title">Regn om mellom BTC og NOK</h2><p className="mt-3 text-sm text-slate-600">En ren valutaomregning med Coinbase sin lagrede spotkurs. Handelsgebyr, spread og betalingsgebyr er ikke med.</p><div className="mt-5 grid gap-4 sm:grid-cols-2"><div><label htmlFor={id} className="field-label">Beløp i {mode.toUpperCase()}</label><div className="mt-2 flex gap-2"><input id={id} inputMode="decimal" className="form-control min-w-0" value={input} onChange={e => setInput(e.target.value)} aria-invalid={!valid} /><select aria-label="Fra valuta" className="form-control w-24" value={mode} onChange={e => { setMode(e.target.value as 'btc' | 'nok'); setInput(e.target.value === 'btc' ? '0.01' : '1000'); }}><option value="nok">NOK</option><option value="btc">BTC</option></select></div></div><div className="rounded-xl bg-brand-soft p-4"><p className="text-xs text-slate-500">Tilsvarer omtrent</p><output className="mt-2 block text-xl font-semibold tabular-nums text-slate-900" htmlFor={id}>{output === null ? '—' : `${output.toLocaleString('nb-NO', { maximumFractionDigits: mode === 'nok' ? 8 : 0 })} ${mode === 'nok' ? 'BTC' : 'NOK'}`}</output></div></div>{!valid && <p role="status" className="mt-3 text-sm text-rose-700">Skriv et gyldig, positivt beløp.</p>}{!reference && <p className="mt-3 text-sm text-slate-500">Omregning er ikke tilgjengelig uten en nylig referansekurs.</p>}</section>;
}
