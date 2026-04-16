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
    <section className={`rounded-2xl border border-slate-100 bg-white p-6 shadow-sm ${className}`.trim()}>
      <div className="flex flex-col md:flex-row gap-8 items-start">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-4">
            <VippsLogo />
            <div>
              <h3 className="text-xl font-bold tracking-tight text-slate-900">
                Kjøp med Vipps
              </h3>
              <p className="text-[10px] font-bold uppercase tracking-widest text-orange-500">Fast & Easy</p>
            </div>
          </div>
          <p className="text-sm text-slate-500 leading-relaxed mb-6">
            Vipps er raskt og enkelt, men ekstra betalingsgebyr gjør at du får mindre BTC enn ved bankoverføring.
          </p>

          <div className="rounded-xl border border-amber-100 bg-amber-50/50 p-4 text-[13px] text-amber-900 font-medium">
            Ved kjøp på {effectiveAmount.toLocaleString('nb-NO')} NOK betaler du ca. <span className="font-bold underlineDecoration-amber-200 decoration-2 underline-offset-2 underline">{Math.round(feeDifferenceNok).toLocaleString('nb-NO')} NOK</span> mer i gebyr.
          </div>
        </div>

        <div className="w-full md:w-80 shrink-0">
          <div className="overflow-hidden rounded-xl border border-slate-100">
            <table className="w-full text-xs">
              <thead className="bg-slate-50 text-[10px] font-bold uppercase tracking-widest text-slate-400">
                <tr>
                  <th className="px-3 py-2 text-left font-bold">Metode</th>
                  <th className="px-2 py-2 text-right font-bold">Gebyr</th>
                  <th className="px-2 py-2 text-right font-bold">Du får</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                <tr>
                  <td className="px-3 py-2 font-bold text-slate-900 text-[11px]">Bankoverføring</td>
                  <td className="px-2 py-2 text-right text-slate-500 font-mono italic">{Math.round(bankFeeNok)} NOK</td>
                  <td className="px-2 py-2 text-right text-slate-900 font-bold font-mono tracking-tighter">{bankBtc.toFixed(6)}</td>
                </tr>
                <tr>
                  <td className="px-3 py-2 font-bold text-slate-900 text-[11px]">Vipps Betaling</td>
                  <td className="px-2 py-2 text-right text-slate-500 font-mono italic">{Math.round(vippsFeeNok)} NOK</td>
                  <td className="px-2 py-2 text-right text-slate-900 font-bold font-mono tracking-tighter text-orange-600">{vippsBtc.toFixed(6)}</td>
                </tr>
              </tbody>
            </table>
          </div>
          {!spotPrice && <p className="mt-2 text-[10px] text-slate-400 font-medium italic animate-pulse">Oppdaterer priser...</p>}
        </div>
      </div>
    </section>
  );
}
