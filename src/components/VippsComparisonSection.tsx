import { useEffect, useState } from 'react';
import { ComparisonResult, Exchange } from '../types';
import { FEES, getFiriPrice } from '../services/api';

interface VippsComparisonSectionProps {
  results: ComparisonResult[];
  amount: number | null;
  className?: string;
}

const FIRI_VIPPS_EXTRA_FEE = 0.039;

const VippsLogo = () => (
  <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-[#FF5B24] text-xl font-black text-white shadow-sm">
    V
  </div>
);

export default function VippsComparisonSection({ results, amount, className = '' }: VippsComparisonSectionProps) {
  const firiResult = results.find((result) => result.exchange === Exchange.Firi);
  const [fallbackSpotPrice, setFallbackSpotPrice] = useState<number | null>(null);
  const [priceError, setPriceError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    const loadFiriPrice = async () => {
      try {
        const latestPrice = await getFiriPrice();
        if (mounted) setFallbackSpotPrice(latestPrice);
      } catch {
        if (mounted) setPriceError('Kunne ikke hente Firi-pris akkurat na.');
      }
    };

    loadFiriPrice();
    return () => {
      mounted = false;
    };
  }, []);

  const effectiveAmount = amount && amount > 0 ? amount : 10000;
  const spotPrice = firiResult?.spotPrice ?? fallbackSpotPrice;

  const bankFeeRate = FEES[Exchange.Firi].trade + FEES[Exchange.Firi].spread;
  const vippsFeeRate = bankFeeRate + FIRI_VIPPS_EXTRA_FEE;
  const bankFeeNok = effectiveAmount * bankFeeRate;
  const vippsFeeNok = effectiveAmount * vippsFeeRate;
  const bankBtc = spotPrice ? (effectiveAmount - bankFeeNok) / spotPrice : 0;
  const vippsBtc = spotPrice ? (effectiveAmount - vippsFeeNok) / spotPrice : 0;
  const feeDifferenceNok = vippsFeeNok - bankFeeNok;
  const btcDifference = bankBtc - vippsBtc;

  return (
    <section className={`card-premium p-8 ${className}`.trim()}>
      <div className="flex flex-col lg:flex-row gap-12 items-start">
        <div className="flex-1 space-y-6">
          <div className="flex items-center gap-4">
            <VippsLogo />
            <div>
              <h3 className="text-2xl font-display font-bold tracking-tight text-slate-900">
                Kjøp med Vipps
              </h3>
              <p className="text-xs font-bold uppercase tracking-widest text-slate-400">Direktebetaling</p>
            </div>
          </div>
          <p className="text-base text-slate-600 leading-relaxed font-medium">
            Vipps er den raskeste måten å komme i gang på, men merk at det medfører et ekstra betalingsgebyr på <span className="font-bold text-slate-900">3,9%</span> sammenlignet med vanlig bankoverføring.
          </p>

          <div className="p-4 bg-blue-50 border border-blue-100 rounded-xl text-sm text-brand font-bold flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-sm">💡</div>
            <span>Du sparer ca. {Math.round(feeDifferenceNok).toLocaleString('nb-NO')} NOK ved å velge bankoverføring.</span>
          </div>
        </div>

        <div className="w-full lg:w-96 shrink-0">
          <div className="overflow-hidden rounded-2xl border border-slate-100 shadow-sm bg-white">
            <table className="w-full">
              <thead className="bg-slate-50/50 border-b border-slate-100">
                <tr>
                  <th className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-widest text-slate-400">Metode</th>
                  <th className="px-4 py-3 text-right text-[10px] font-bold uppercase tracking-widest text-slate-400">Gebyr</th>
                  <th className="px-4 py-3 text-right text-[10px] font-bold uppercase tracking-widest text-slate-400">Du får</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                <tr className="hover:bg-slate-50 transition-colors">
                  <td className="px-4 py-4 font-bold text-slate-900 text-sm">Bankoverføring</td>
                  <td className="px-4 py-4 text-right text-xs text-slate-500 font-mono italic">{Math.round(bankFeeNok)} NOK</td>
                  <td className="px-4 py-4 text-right text-sm text-slate-900 font-bold font-mono tracking-tight">{bankBtc.toFixed(6)}</td>
                </tr>
                <tr className="hover:bg-slate-50 transition-colors">
                  <td className="px-4 py-4 font-bold text-slate-900 text-sm">Vipps Betaling</td>
                  <td className="px-4 py-4 text-right text-xs text-slate-500 font-mono italic">{Math.round(vippsFeeNok)} NOK</td>
                  <td className="px-4 py-4 text-right text-sm text-brand font-bold font-mono tracking-tight">{vippsBtc.toFixed(6)}</td>
                </tr>
              </tbody>
            </table>
          </div>
          {!spotPrice && <p className="mt-3 text-[10px] text-slate-400 font-bold uppercase tracking-widest text-center animate-pulse">Oppdaterer priser...</p>}
        </div>
      </div>
    </section>
  );
}
