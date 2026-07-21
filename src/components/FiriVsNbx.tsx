import React from 'react';
import { ComparisonResult, Exchange } from '../types';
import { FEES } from '../services/api';
import { Scale, CheckCircle2, TrendingUp } from 'lucide-react';

interface FiriVsNbxProps {
  results: ComparisonResult[];
}

export default function FiriVsNbx({ results }: FiriVsNbxProps) {
  const amount = 10000;
  
  const firiRes = results.find(r => r.exchange === Exchange.Firi);
  const nbxRes = results.find(r => r.exchange === Exchange.NBX);

  const calculateBreakdown = (exchange: Exchange, price: number) => {
    const fees = FEES[exchange];
    const tradeFee = amount * fees.trade;
    const spreadFee = amount * fees.spread;
    const totalFee = tradeFee + spreadFee;
    const btcAmount = (amount - totalFee) / price;
    
    return { tradeFee, spreadFee, totalFee, btcAmount };
  };

  const firiData = firiRes ? calculateBreakdown(Exchange.Firi, firiRes.spotPrice) : null;
  const nbxData = nbxRes ? calculateBreakdown(Exchange.NBX, nbxRes.spotPrice) : null;

  if (!firiData || !nbxData) return null;

  return (
    <section id="firi-vs-nbx" className="py-20 border-t border-slate-100 font-table">
      <div className="text-center space-y-4 mb-16">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-brand/5 text-brand rounded-full text-[10px] font-black uppercase tracking-widest">
          <Scale size={12} /> Sammenligning
        </div>
        <h2 className="text-4xl font-display font-bold tracking-tight text-slate-900">
          Firi vs NBX: <span className="text-brand">Hvem er billigst?</span>
        </h2>
        <p className="text-slate-500 text-lg font-medium max-w-2xl mx-auto">
          En direkte sammenligning av de to største norske børsene ved kjøp for 10 000 kr.
        </p>
      </div>

      <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 px-4">
        {/* Firi Card */}
        <div className="bg-white rounded-3xl border border-slate-100 shadow-xl shadow-slate-200/50 p-8 space-y-6 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <h3 className="text-2xl font-bold text-slate-900">Firi</h3>
            <span className="px-3 py-1 bg-blue-50 text-brand text-[10px] font-bold rounded-full uppercase">Mest populær</span>
          </div>
          
          <div className="space-y-4">
            <div className="flex justify-between items-end pb-4 border-b border-slate-50">
              <span className="text-sm text-slate-400 font-bold uppercase tracking-wider">Du får</span>
              <span className="text-3xl font-display font-bold text-slate-900">{firiData.btcAmount.toFixed(8)} BTC</span>
            </div>
            
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-slate-500 font-medium">Kurtasje (Handelsgebyr)</span>
                <span className="font-bold text-rose-500">-{Math.round(firiData.tradeFee)} kr</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-500 font-medium">Estimert spread (Gebyrisk)</span>
                <span className="font-bold text-rose-400">-{Math.round(firiData.spreadFee)} kr</span>
              </div>
              <div className="flex justify-between text-sm pt-2 border-t border-slate-50">
                <span className="text-slate-900 font-bold">Totale kostnader</span>
                <span className="font-bold text-slate-900">{Math.round(firiData.totalFee)} kr</span>
              </div>
            </div>
          </div>

          <ul className="space-y-2 pt-4">
            {['Registrering med BankID', 'Innskudd med Vipps', 'Forsikret lagring'].map((feature, i) => (
              <li key={i} className="flex items-center gap-2 text-xs font-medium text-slate-600">
                <CheckCircle2 size={14} className="text-emerald-500" /> {feature}
              </li>
            ))}
          </ul>
        </div>

        {/* NBX Card */}
        <div className="bg-white rounded-3xl border border-slate-100 shadow-xl shadow-slate-200/50 p-8 space-y-6 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <h3 className="text-2xl font-bold text-slate-900">NBX</h3>
            <span className="px-3 py-1 bg-emerald-50 text-emerald-600 text-[10px] font-bold rounded-full uppercase">Børsnotert</span>
          </div>
          
          <div className="space-y-4">
            <div className="flex justify-between items-end pb-4 border-b border-slate-50">
              <span className="text-sm text-slate-400 font-bold uppercase tracking-wider">Du får</span>
              <span className="text-3xl font-display font-bold text-slate-900">{nbxData.btcAmount.toFixed(8)} BTC</span>
            </div>
            
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-slate-500 font-medium">Kurtasje (Handelsgebyr)</span>
                <span className="font-bold text-rose-500">-{Math.round(nbxData.tradeFee)} kr</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-500 font-medium">Estimert spread (Gebyrisk)</span>
                <span className="font-bold text-rose-400">-{Math.round(nbxData.spreadFee)} kr</span>
              </div>
              <div className="flex justify-between text-sm pt-2 border-t border-slate-50">
                <span className="text-slate-900 font-bold">Totale kostnader</span>
                <span className="font-bold text-slate-900">{Math.round(nbxData.totalFee)} kr</span>
              </div>
            </div>
          </div>

          <ul className="space-y-2 pt-4">
            {['Kredittkort med krypto-back', 'Institusjonell likviditet', 'Lav spread'].map((feature, i) => (
              <li key={i} className="flex items-center gap-2 text-xs font-medium text-slate-600">
                <CheckCircle2 size={14} className="text-emerald-500" /> {feature}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="max-w-3xl mx-auto mt-12 p-6 bg-slate-50 rounded-2xl border border-slate-100 flex items-center gap-4">
        <TrendingUp className="text-brand shrink-0" size={24} />
        <p className="text-xs text-slate-600 leading-relaxed font-medium">
          <strong>Konklusjon:</strong> {firiData.btcAmount > nbxData.btcAmount ? 'Firi' : 'NBX'} gir deg akkurat nå litt mer bitcoin for pengene i dette regnestykket. Forskjellen er minimal ({Math.abs(Math.round((firiData.btcAmount - nbxData.btcAmount) * (firiRes?.spotPrice || 0)))} kr), så valget bør også baseres på hvilke funksjoner og brukeropplevelse du foretrekker.
        </p>
      </div>
    </section>
  );
}
