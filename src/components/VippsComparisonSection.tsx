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
    <section className={`rounded-3xl border border-slate-200 bg-white p-6 shadow-lg md:p-10 ${className}`.trim()}>
      <div className="grid items-start gap-8 lg:grid-cols-12">
        <div className="lg:col-span-7">
          <VippsLogo />
          <h3 className="mt-4 text-4xl font-bold tracking-tight text-slate-900 md:text-5xl">
            Kjop Bitcoin med VIPPS
          </h3>
          <p className="mt-4 max-w-xl text-lg text-slate-600">
            Vipps er raskt og enkelt, men ekstra betalingsgebyr gjor at du far mindre BTC enn ved bankoverforing.
          </p>
          {priceError && <p className="mt-3 text-sm text-red-700">{priceError}</p>}

          <div className="mt-6 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-amber-900">
            For {effectiveAmount.toLocaleString('nb-NO')} NOK betaler du ca.
            <span className="font-semibold">{Math.round(feeDifferenceNok).toLocaleString('nb-NO')} NOK</span> mer i
            gebyr med Vipps.
          </div>

          <div className="mt-6">
            <h4 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
              Steder du kan kjope Bitcoin med Vipps
            </h4>
            <ul className="mt-3 space-y-2 text-slate-700">
              <li>
                <a
                  href="https://firi.com/no/kryptovaluta/bitcoin-btc/hvordan-kjope-bitcoin"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sky-700 hover:text-sky-600"
                >
                  Firi
                </a>
              </li>
              <li>
                <a
                  href="https://nbx.com/no/bitcoin-kurs"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sky-700 hover:text-sky-600"
                >
                  NBX
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="lg:col-span-5">
          <div className="overflow-hidden rounded-2xl border border-slate-200">
            <table className="w-full text-xs md:text-sm">
              <thead className="bg-slate-100 text-slate-600">
                <tr>
                  <th className="px-3 py-2 text-left font-semibold">Metode</th>
                  <th className="px-2 md:px-3 py-2 text-right font-semibold">Gebyr</th>
                  <th className="px-2 md:px-3 py-2 text-right font-semibold">Du far (BTC)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 bg-white">
                <tr>
                  <td className="px-2 md:px-3 py-2 font-medium text-slate-900">Firi bank</td>
                  <td className="px-2 md:px-3 py-2 text-right text-slate-700">{Math.round(bankFeeNok).toLocaleString('nb-NO')} NOK</td>
                  <td className="px-2 md:px-3 py-2 text-right text-slate-900">{bankBtc.toLocaleString('nb-NO', { maximumFractionDigits: 8 })}</td>
                </tr>
                <tr>
                  <td className="px-2 md:px-3 py-2 font-medium text-slate-900">Firi Vipps</td>
                  <td className="px-2 md:px-3 py-2 text-right text-slate-700">{Math.round(vippsFeeNok).toLocaleString('nb-NO')} NOK</td>
                  <td className="px-2 md:px-3 py-2 text-right text-slate-900">{vippsBtc.toLocaleString('nb-NO', { maximumFractionDigits: 8 })}</td>
                </tr>
                <tr className="bg-slate-50">
                  <td className="px-2 md:px-3 py-2 font-semibold text-slate-900">Differanse</td>
                  <td className="px-2 md:px-3 py-2 text-right font-semibold text-amber-700">
                    +{Math.round(feeDifferenceNok).toLocaleString('nb-NO')} NOK
                  </td>
                  <td className="px-2 md:px-3 py-2 text-right font-semibold text-amber-700">
                    -{btcDifference.toLocaleString('nb-NO', { maximumFractionDigits: 8 })}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          {!spotPrice && <p className="mt-2 text-xs text-slate-500">Laster Firi-pris for tabellen...</p>}
        </div>
      </div>
    </section>
  );
}
