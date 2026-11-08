import { ComparisonResult, Exchange } from '../types';
import { FIRI_VIPPS_FEE, EXCHANGE_FEES, FEE_EVIDENCE } from '../data/exchangeFees';
export const FIRI_VIPPS_EXTRA_FEE = FIRI_VIPPS_FEE;
interface Props { results: ComparisonResult[]; amount: number | null; className?: string; }
export default function VippsComparisonSection({ results, amount, className = '' }: Props) {
 const budget = amount && amount > 0 ? amount : 10000;
 const price = results.find(r => r.exchange === Exchange.Firi);
 const tradeRate = EXCHANGE_FEES[Exchange.Firi].trade;
 const bankNet = budget * (1 - tradeRate);
 // Firi adds payment fee to the deposit: hold the total budget constant.
 const deposit = budget / (1 + FIRI_VIPPS_FEE);
 const vippsNet = deposit * (1 - tradeRate);
 const money = (n: number) => `${n.toLocaleString('nb-NO', { maximumFractionDigits: 0 })} kr`;
 return <section className={`rounded-2xl border border-slate-200 p-5 sm:p-6 ${className}`}><h3 className="text-xl font-semibold text-slate-900">Vipps eller bank hos Firi?</h3><p className="mt-3 text-sm leading-relaxed text-slate-600">Samme totale budsjett: {money(budget)}. Vipps/kort har 3,9 % betalingsgebyr som legges til innskuddet. Handelsgebyret kommer i tillegg.</p><div className="mt-5 overflow-x-auto"><table className="w-full text-sm"><caption className="sr-only">Sammenligning med samme totale budsjett hos Firi</caption><thead><tr><th scope="col" className="py-3 text-left">Metode</th><th scope="col" className="py-3 text-right">Beregnet kostnad</th><th scope="col" className="py-3 text-right">Beregnet BTC</th></tr></thead><tbody>{[{name:'Bank',net:bankNet},{name:'Vipps',net:vippsNet}].map(row=><tr key={row.name} className="border-t border-slate-100"><th scope="row" className="py-3 text-left font-medium">{row.name}</th><td className="py-3 text-right tabular-nums">{money(budget-row.net)}</td><td className="py-3 text-right tabular-nums">{price ? (row.net/price.spotPrice).toLocaleString('nb-NO',{maximumFractionDigits:8}) : 'Pris mangler'}</td></tr>)}</tbody></table></div><p className="mt-4 text-sm font-medium text-brand">Forskjell i modellert kostnad: {money(bankNet-vippsNet)}.</p><p className="mt-3 text-xs leading-relaxed text-slate-500">Vipps-innskudd = totalbudsjett / 1,039. BTC beregnes etter handelsgebyret fra dette innskuddet. Kursendring, spread som ikke allerede er i kursen og uttak kan endre resultatet. <a href={FEE_EVIDENCE[Exchange.Firi].sourceUrl} className="text-brand underline">Firi sin prisliste</a> · kontrollert {FEE_EVIDENCE[Exchange.Firi].checkedAt}.</p></section>;
}
