import React, { useState, useMemo } from 'react';
import { ComparisonResult, CryptoCurrency, Exchange } from '../types';
import { FEES } from '../services/api';
import CountUp from 'react-countup';
import { Calculator, ArrowRight, Info, AlertCircle } from 'lucide-react';

interface BitcoinCalculatorProps {
  results: ComparisonResult[];
  isLoading: boolean;
}

export default function BitcoinCalculator({ results, isLoading }: BitcoinCalculatorProps) {
  const [amount, setAmount] = useState<number>(10000);
  const [inputVal, setInputVal] = useState<string>('10 000');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/\s/g, '');
    if (val === '' || /^\d+$/.test(val)) {
      setInputVal(e.target.value);
      if (val !== '') {
        setAmount(parseInt(val, 10));
      }
    }
  };

  const calculatedResults = useMemo(() => {
    return results.map(res => {
      const exchangeFees = FEES[res.exchange];
      const commissionNok = amount * exchangeFees.trade;
      const spreadNok = amount * exchangeFees.spread;
      const totalFeeNok = commissionNok + spreadNok;
      const effectiveAmountNok = amount - totalFeeNok;
      const cryptoAmount = effectiveAmountNok / res.spotPrice;

      return {
        ...res,
        commissionNok,
        spreadNok,
        totalFeeNok,
        cryptoAmount
      };
    }).sort((a, b) => b.cryptoAmount - a.cryptoAmount);
  }, [results, amount]);

  const bestResult = calculatedResults[0];

  return (
    <section id="bitcoin-calculator" className="space-y-12 animate-fade-in py-20 border-t border-slate-100">
      <div className="text-center space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-brand/5 text-brand rounded-full text-[10px] font-black uppercase tracking-widest">
          <Calculator size={12} /> Verktøy
        </div>
        <h2 className="text-4xl font-display font-bold tracking-tight text-slate-900">
          Bitcoin <span className="text-brand">Kalkulator</span>
        </h2>
        <p className="text-slate-500 text-lg font-medium max-w-2xl mx-auto leading-relaxed">
          Se nøyaktig hvor mye du sitter igjen med etter alle gebyrer og kurtasje er trukket fra.
        </p>
      </div>

      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-3xl border border-slate-100 shadow-xl shadow-blue-900/5 p-8 md:p-12 space-y-8">
          <div className="space-y-4">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-[0.2em] ml-1">Beløp å investere (NOK)</label>
            <div className="relative">
              <input 
                type="text"
                value={inputVal}
                onChange={handleInputChange}
                className="w-full text-4xl md:text-5xl font-display font-bold text-slate-900 bg-slate-50/50 border-2 border-slate-100 rounded-3xl px-8 py-10 focus:outline-none focus:border-brand focus:bg-white transition-all text-center md:text-left"
              />
              <div className="absolute right-8 top-1/2 -translate-y-1/2 text-slate-300 font-bold text-2xl hidden md:block">NOK</div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 bg-brand text-white rounded-2xl shadow-lg shadow-blue-200 flex flex-col justify-between min-h-[140px]">
              <span className="text-[10px] font-bold uppercase tracking-widest opacity-80">Beste utfall</span>
              <div className="space-y-1">
                <div className="text-3xl font-display font-bold">
                  {bestResult ? bestResult.cryptoAmount.toFixed(8) : '0.00000000'} BTC
                </div>
                <div className="text-xs font-medium opacity-80">Hos {bestResult?.exchange}</div>
              </div>
            </div>
            <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100 flex flex-col justify-between min-h-[140px]">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Gjennomsnittlig gebyr</span>
              <div className="space-y-1">
                <div className="text-3xl font-display font-bold text-slate-900">
                  {bestResult ? Math.round(bestResult.totalFeeNok) : 0} NOK
                </div>
                <div className="text-xs font-medium text-slate-500">Inkl. kurtasje og spredning</div>
              </div>
            </div>
          </div>

          <div className="overflow-hidden rounded-2xl border border-slate-100 font-table">
            <table className="w-full">
              <thead>
                <tr className="bg-slate-50/50 border-b border-slate-100">
                  <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-left">Børs</th>
                  <th className="px-4 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-right">Kurtasje</th>
                  <th className="px-4 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-right">Spredning</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-right">Du får</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {calculatedResults.map((res, i) => (
                  <tr key={i} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <span className="text-sm font-bold text-slate-900">{res.exchange}</span>
                    </td>
                    <td className="px-4 py-4 text-right">
                      <span className="text-xs font-bold text-rose-500">
                        {res.commissionNok > 0 ? `-${Math.round(res.commissionNok)} kr` : '0 kr'}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-right">
                      <span className="text-xs font-bold text-rose-400">
                        {res.spreadNok > 0 ? `-${Math.round(res.spreadNok)} kr` : '0 kr'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <span className={`text-sm font-bold ${i === 0 ? 'text-brand' : 'text-slate-900'}`}>
                        {res.cryptoAmount.toFixed(8)}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex items-start gap-3 p-4 bg-amber-50 border border-amber-100 rounded-xl text-[11px] text-amber-800 leading-relaxed font-medium">
            <Info size={14} className="shrink-0 mt-0.5" />
            <p>
              Beregningen tar utgangspunkt i børshandel (spot). Noen plattformer har egne "Quick Buy" løsninger med høyere spread og gebyrer som ikke nødvendigvis reflekteres her. Vi anbefaler alltid å bruke Limit-ordre på børsen for lavest mulig pris.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
