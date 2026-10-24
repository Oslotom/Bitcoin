import { ArrowDownRight, Check, Bitcoin } from 'lucide-react';
import { Exchange } from '../types';
import { ExchangeIcon } from './icons';
import { feeRows } from './FeeOverview';

export default function HeroTableIllustration() {
  const rows = feeRows().filter((row) => [Exchange.NBX, Exchange.Firi, Exchange.BareBitcoin].includes(row.exchange));
  return (
    <figure className="hero-scene">
      <div aria-hidden="true" className="hero-orbit" />
      <div aria-hidden="true" className="hero-coin"><Bitcoin size={34} strokeWidth={1.6} /></div>
      <div className="hero-board">
        <div className="flex items-start justify-between gap-4 border-b border-slate-100 pb-5">
          <div>
            <p className="text-[11px] font-medium text-slate-500">Litt mer oversikt.</p>
            <p className="mt-1 text-lg font-semibold tracking-tight text-slate-900">Litt mindre gebyr.</p>
          </div>
          <span aria-hidden="true" className="rounded-full bg-brand-soft p-2 text-brand"><ArrowDownRight size={19} /></span>
        </div>
        <div className="flex justify-between pt-4 pb-2 text-[10px] font-medium text-slate-500"><span>Norske børser</span><span>Kostnad / 10 000 kr</span></div>
        <div className="divide-y divide-slate-100">
          {rows.map((row, index) => (
            <div key={row.exchange} className={`flex items-center justify-between gap-3 py-3.5 ${index === 0 ? 'text-brand' : 'text-slate-700'}`}>
              <span className="flex items-center gap-2.5 text-xs font-medium"><ExchangeIcon exchange={row.exchange} size={23} />{row.exchange}</span>
              <span className={`rounded-lg px-2 py-1 text-sm font-semibold tabular-nums ${index === 0 ? 'bg-brand-soft' : ''}`}>{Math.round(10000 * row.total)} kr</span>
            </div>
          ))}
        </div>
        <p className="border-t border-slate-100 pt-3 text-[10px] leading-relaxed text-slate-500">Gebyr + estimert spread. Andre kostnader kommer i tillegg.</p>
      </div>
      <div className="hero-note"><span className="rounded-full bg-emerald-100 p-1 text-emerald-700"><Check size={13} /></span><span>Små forskjeller. Dine penger.</span></div>
      <figcaption className="absolute bottom-4 left-0 right-0 text-center text-[10px] text-slate-500">Illustrasjon av kostnadssammenligningen</figcaption>
    </figure>
  );
}
