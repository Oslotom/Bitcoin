import React, { useState } from 'react';
import { ComparisonResult, CryptoCurrency, Exchange } from '../types';
import { motion, AnimatePresence } from 'motion/react';
import CountUp from 'react-countup';
import { CountryIcon, ExchangeIcon } from './icons';
import { FEES } from '../services/api';

interface ResultsTableProps {
  results: ComparisonResult[];
  isLoading: boolean;
  error: string | null;
  crypto: CryptoCurrency;
}

const PLATFORM_DATA: Record<Exchange, { link: string; description: string }> = {
  [Exchange.Coinbase]: { 
    link: 'https://www.coinbase.com',
    description: 'Verdens mest kjente børs. Svært brukervennlig, men ofte litt høyere gebyrer enn de rendyrkede handelsplattformene.'
  },
  [Exchange.Binance]: { 
    link: 'https://www.binance.com',
    description: 'Global gigant med det største utvalget og svært lave gebyrer. Kan oppleves som litt avansert for nybegynnere.'
  },
  [Exchange.Firi]: { 
    link: 'https://firi.com',
    description: 'Nordens største kryptobørs. Trygg norsk plattform med VIPPS-innskudd og enkel registrering med BankID.'
  },
  [Exchange.Kraken]: { 
    link: 'https://www.kraken.com',
    description: 'Amerikansk børs kjent for ekstrem sikkerhet og gode priser. Et solid valg for både nybegynnere og profesjonelle.'
  },
  [Exchange.NBX]: { 
    link: 'https://nbx.com',
    description: 'Norsk kryptobørs med fokus på sikkerhet. Lisensiert av Finanstilsynet og tilbyr enkel handel direkte fra banken.'
  },
  [Exchange.BareBitcoin]: { 
    link: 'https://barebitcoin.no',
    description: 'Norsk spesialist-app for kun Bitcoin. Lynraskt, sikkert og optimalisert for faste spareavtaler.'
  },
  [Exchange.Revolut]: { 
    link: 'https://www.revolut.com',
    description: 'Bank-app som også tilbyr kryptohandel. Veldig enkelt hvis du allerede bruker Revolut, men gebyrene er ofte høye.'
  },
  [Exchange.CryptoCom]: { 
    link: 'https://crypto.com',
    description: 'Populær global app med fokus på brukervennlighet og krypto-baserte betalingsløsninger.'
  },
  [Exchange.BuyBitcoin]: { 
    link: 'https://buybitcoin.com',
    description: 'Enkel tjeneste for kjøp av Bitcoin med fokus på rask levering og enkel bankoverføring.'
  },
};

export default function ResultsTable({ results, isLoading, error, crypto }: ResultsTableProps) {
  const [expandedRow, setExpandedRow] = useState<Exchange | null>(null);

  const toggleRow = (exchange: Exchange) => {
    setExpandedRow(expandedRow === exchange ? null : exchange);
  };
  if (isLoading) {
    return (
      <div className="py-12 flex items-center justify-center">
        <svg className="h-8 w-8 animate-spin text-orange-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      </div>
    );
  }

  if (error) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mt-8 rounded-xl border border-red-100 bg-red-50 p-4 text-center text-red-600 text-sm"
      >
        <p><strong>Feil:</strong> {error}</p>
      </motion.div>
    );
  }

  if (results.length === 0) {
    return (
      <div className="rounded-2xl border border-slate-100 bg-white p-12 text-center text-slate-400">
        <h3 className="text-lg font-bold text-slate-900 mb-1">Klar til å sammenligne</h3>
        <p className="text-sm">Fyll ut beløp for å se live priser.</p>
      </div>
    );
  }

  const sortedResults = [...results].sort((a, b) => {
    const btcDiff = b.cryptoAmount - a.cryptoAmount;
    if (btcDiff !== 0) return btcDiff;
    return a.effectivePrice - b.effectivePrice;
  });

  const bestResult = sortedResults.reduce((best, current) =>
    current.cryptoAmount > best.cryptoAmount ? current : best
  );

  const lowestFeeResult = sortedResults.reduce((lowest, current) =>
    (current.feeInNok / current.totalCost) < (lowest.feeInNok / lowest.totalCost) ? current : lowest
  );

  const mostExpensiveResult = sortedResults.reduce((most, current) =>
    current.cryptoAmount < most.cryptoAmount ? current : most
  );

  return (
    <AnimatePresence>
      <motion.div
        id="results-table-main"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="border-t border-slate-100"
      >
        {/* Mobile View: Stacked Rows */}
        <div id="results-mobile-view" className="md:hidden border-t border-slate-100">
          {/* Mobile Header */}
          <div className="flex px-3 py-2 bg-slate-50 border-b border-slate-100 italic">
            <span className="w-1/3 text-[11px] font-bold text-slate-400 uppercase tracking-widest">Plattform</span>
            <span className="w-1/3 text-[11px] font-bold text-slate-400 uppercase tracking-widest text-center">Gebyr</span>
            <span className="w-1/3 text-[11px] font-bold text-slate-400 uppercase tracking-widest text-right">Kurs</span>
          </div>

          <div className="space-y-0.5">
            {sortedResults.map((result) => (
              <div 
                key={result.exchange} 
                id={`exchange-row-mobile-${result.exchange.toLowerCase()}`}
                className="overflow-hidden border-b border-slate-50 bg-white"
              >
                <div 
                  className="py-2.5 px-3 cursor-pointer active:bg-slate-50 transition-colors"
                  onClick={() => toggleRow(result.exchange)}
                >
                  <div className="flex items-center justify-between gap-3">
                    {/* Left: Platform */}
                    <div className="flex min-w-0 items-center gap-2.5 w-1/3">
                      <div className="shrink-0 scale-[0.8]">
                        <ExchangeIcon exchange={result.exchange} />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[14px] font-bold text-slate-900 leading-tight truncate">{result.exchange}</span>
                        <span className="text-[9px] font-black text-slate-400 uppercase tracking-tighter truncate">
                          {result.exchange === Exchange.Firi || result.exchange === Exchange.NBX || result.exchange === Exchange.BareBitcoin ? 'Norsk' : 'Global'}
                        </span>
                      </div>
                    </div>

                    {/* Center: Fee */}
                    <div className="flex flex-col items-center w-1/3 text-center">
                      <span className="text-[13px] font-bold text-slate-900 font-mono">
                        {Math.round((result.feeInNok / result.totalCost) * 1000) / 10}%
                      </span>
                    </div>

                    {/* Right: Price */}
                    <div className="flex flex-col items-end w-1/3">
                      <div className="text-[14px] font-bold text-slate-900 font-mono tracking-tighter">
                        <CountUp end={result.spotPrice} decimals={0} duration={1} separator=" " decimal="," />
                        <span className="text-[11px] text-slate-400 font-sans ml-1 uppercase">NOK</span>
                      </div>
                      <div className="flex flex-wrap justify-end gap-1 mt-0.5">
                        {result.exchange === bestResult.exchange && (
                          <span className="text-[8px] font-black text-emerald-500 uppercase tracking-widest leading-none">Best pris</span>
                        )}
                        {result.exchange === lowestFeeResult.exchange && (
                          <span className="text-[8px] font-black text-blue-500 uppercase tracking-widest leading-none">Lavest gebyrer</span>
                        )}
                        {result.exchange === mostExpensiveResult.exchange && (
                          <span className="text-[8px] font-black text-red-500 uppercase tracking-widest leading-none">Dyrest</span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                <AnimatePresence>
                  {expandedRow === result.exchange && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="bg-slate-50 border-t border-slate-100 overflow-hidden"
                    >
                      <div className="p-3 space-y-3">
                        <p className="text-[12px] text-slate-600 leading-relaxed italic">
                          {PLATFORM_DATA[result.exchange].description}
                        </p>
                        <a
                          href={PLATFORM_DATA[result.exchange].link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center justify-center w-full rounded-lg bg-slate-900 py-2.5 text-[12px] font-bold text-white shadow-sm hover:bg-slate-800 transition-colors"
                        >
                          Gå til {result.exchange}
                        </a>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </div>

        {/* Desktop View: Traditional Table */}
      <div id="results-desktop-view" className="hidden md:block">
        <table className="w-full">
          <thead>
            <tr className="border-b border-slate-100 italic">
              <th className="py-3 px-3 text-left text-[12px] font-bold uppercase tracking-widest text-slate-400">Plattform</th>
              <th className="py-3 px-3 text-right text-[12px] font-bold uppercase tracking-widest text-slate-400">Kurs</th>
              <th className="py-3 px-3 text-right text-[12px] font-bold uppercase tracking-widest text-slate-400">Gebyr</th>
              <th className="py-3 px-3 text-right text-[12px] font-bold uppercase tracking-widest text-slate-400"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {sortedResults.map((result) => (
              <React.Fragment key={result.exchange}>
                <tr 
                  id={`exchange-row-desktop-${result.exchange.toLowerCase()}`}
                  className={`group transition-colors duration-200 cursor-pointer ${expandedRow === result.exchange ? 'bg-slate-50' : 'hover:bg-slate-50/50'}`}
                  onClick={() => toggleRow(result.exchange)}
                >
                  <td className="py-2.5 px-3">
                    <div className="flex items-center gap-3">
                      <div className="shrink-0 scale-[0.95] transition-transform group-hover:scale-[1.0]">
                        <ExchangeIcon exchange={result.exchange} />
                      </div>
                      <div className="flex flex-col">
                        <div className="flex items-center gap-2">
                          <span className="text-[16px] font-bold text-slate-900 leading-tight">{result.exchange}</span>
                          <div className="flex items-center gap-1.5">
                            {result.exchange === bestResult.exchange && (
                              <span className="text-[9px] font-black bg-emerald-50 text-emerald-600 px-1.5 py-0.5 rounded uppercase tracking-widest">Best pris</span>
                            )}
                            {result.exchange === lowestFeeResult.exchange && (
                              <span className="text-[9px] font-black bg-blue-50 text-blue-600 px-1.5 py-0.5 rounded uppercase tracking-widest">Lavest gebyrer</span>
                            )}
                            {result.exchange === mostExpensiveResult.exchange && (
                              <span className="text-[9px] font-black bg-red-50 text-red-600 px-1.5 py-0.5 rounded uppercase tracking-widest">Dyrest</span>
                            )}
                          </div>
                        </div>
                        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-tighter">
                          {result.exchange === Exchange.Firi || result.exchange === Exchange.NBX || result.exchange === Exchange.BareBitcoin ? 'Norsk' : 'Global'}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="py-2.5 px-3 text-right text-[14px] font-bold text-slate-900 font-mono">
                    <CountUp end={result.spotPrice} decimals={0} duration={1} separator=" " decimal="," /> <span className="text-[11px] text-slate-400 font-sans ml-0.5 uppercase">NOK</span>
                  </td>
                  <td className="py-2.5 px-3 text-right text-[14px] font-bold text-slate-900 font-mono">
                    {Math.round((result.feeInNok / result.totalCost) * 1000) / 10}%
                  </td>
                  <td className="py-2.5 px-3 text-right">
                      <a
                        id={`buy-btn-${result.exchange.toLowerCase()}`}
                        href={PLATFORM_DATA[result.exchange].link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex rounded-md bg-slate-900 px-4 py-2 text-[11px] font-bold text-white transition-all duration-200 hover:bg-slate-800 shadow-sm"
                        onClick={(e) => e.stopPropagation()}
                      >
                        Kjøp
                      </a>
                  </td>
                </tr>
                {expandedRow === result.exchange && (
                  <tr>
                    <td colSpan={4} className="p-0 border-none">
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="bg-slate-50 overflow-hidden"
                      >
                        <div className="px-6 py-4 border-l-4 border-slate-900 ml-3 mb-4 rounded-r-xl">
                          <p className="text-[14px] text-slate-600 leading-relaxed font-medium italic">
                            "{PLATFORM_DATA[result.exchange].description}"
                          </p>
                        </div>
                      </motion.div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
      </motion.div>
    </AnimatePresence>
  );
}
