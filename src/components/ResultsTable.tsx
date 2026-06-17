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
        <div id="results-mobile-view" className="md:hidden border-y border-slate-100">
          {/* Mobile Header */}
          <div className="flex px-4 py-2 bg-white border-b border-slate-100">
            <span className="w-[40%] text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Plattform</span>
            <span className="w-[20%] text-[10px] font-semibold text-slate-400 uppercase tracking-wider text-center">Gebyr</span>
            <span className="w-[40%] text-[10px] font-semibold text-slate-400 uppercase tracking-wider text-right">Pris</span>
          </div>

          <div className="divide-y divide-slate-100">
            {sortedResults.map((result) => (
              <div 
                key={result.exchange} 
                className="bg-white hover:bg-slate-50 transition-colors"
                onClick={() => toggleRow(result.exchange)}
              >
                <div className="py-2.5 px-4 flex items-center justify-between">
                  {/* Left: Platform */}
                  <div className="flex min-w-0 items-center gap-3 w-[40%]">
                    <div className="shrink-0 scale-90">
                      <ExchangeIcon exchange={result.exchange} />
                    </div>
                    <div className="flex flex-col min-w-0">
                      <span className="text-[14px] font-semibold text-slate-900 leading-tight truncate">{result.exchange}</span>
                    </div>
                  </div>

                  {/* Center: Fee */}
                  <div className="w-[20%] text-center">
                    <span className="text-[12px] text-slate-600 font-bold font-mono">
                      {Math.round((result.feeInNok / result.totalCost) * 1000) / 10}%
                    </span>
                  </div>

                  {/* Right: Price & Tag */}
                  <div className="flex flex-col items-end w-[40%]">
                    <div className="text-[14px] font-semibold text-slate-900 font-mono">
                      <CountUp end={result.spotPrice} decimals={0} duration={1} separator=" " decimal="," />
                    </div>
                    {result.exchange === bestResult.exchange && (
                      <span className="text-[8px] font-bold text-[#0052FF] mt-0.5 uppercase tracking-wider">Best pris</span>
                    )}
                  </div>
                </div>

                {/* Expanded Details Mobile */}
                <AnimatePresence>
                  {expandedRow === result.exchange && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden bg-slate-50 border-t border-slate-100"
                    >
                      <div className="p-4 space-y-4">
                        <div className="px-3 py-3 bg-white rounded-lg border border-slate-200">
                          <p className="text-[13px] text-slate-600 leading-relaxed font-medium italic">
                            "{PLATFORM_DATA[result.exchange].description}"
                          </p>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-1">
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">Handlegebyr</p>
                            <p className="text-sm font-bold text-slate-900">{result.feeInNok.toLocaleString('no-NO')} NOK</p>
                          </div>
                          <div className="space-y-1">
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">Spredning</p>
                            <p className="text-sm font-bold text-slate-900">{FEES[result.exchange].spread}%</p>
                          </div>
                        </div>
                        <a
                          href={PLATFORM_DATA[result.exchange].link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center justify-center w-full py-3 bg-[#0052FF] text-white rounded-lg text-sm font-bold hover:bg-[#0045db] transition-colors shadow-sm"
                          onClick={(e) => e.stopPropagation()}
                        >
                          Besøk {result.exchange}
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
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-slate-100">
                <th className="py-3 px-2 text-left text-[11px] font-semibold uppercase tracking-wider text-slate-400">Navn</th>
                <th className="py-3 px-2 text-right text-[11px] font-semibold uppercase tracking-wider text-slate-400">Pris (NOK)</th>
                <th className="py-3 px-2 text-right text-[11px] font-semibold uppercase tracking-wider text-slate-400">Gebyr</th>
                <th className="py-3 px-2 text-right text-[11px] font-semibold uppercase tracking-wider text-slate-400">Handling</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {sortedResults.map((result) => (
                <React.Fragment key={result.exchange}>
                  <tr 
                    className="group hover:bg-slate-50 transition-colors duration-150 cursor-pointer"
                    onClick={() => toggleRow(result.exchange)}
                  >
                    <td className="py-3 px-2">
                      <div className="flex items-center gap-4">
                        <div className="shrink-0 transition-transform group-hover:scale-105">
                          <ExchangeIcon exchange={result.exchange} />
                        </div>
                        <div className="flex flex-col">
                          <div className="flex items-center gap-2">
                            <span className="text-[15px] font-semibold text-slate-900 leading-none">{result.exchange}</span>
                            {result.exchange === bestResult.exchange && (
                              <span className="text-[9px] font-bold text-[#0052FF] bg-blue-50 px-2 py-0.5 rounded-full uppercase tracking-wider leading-none">Best</span>
                            )}
                          </div>
                          <span className="text-[11px] text-slate-500 font-medium mt-1">
                            {result.exchange === Exchange.Firi || result.exchange === Exchange.NBX || result.exchange === Exchange.BareBitcoin ? 'Norsk' : 'Global'}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-2 text-right">
                      <span className="text-[16px] font-semibold text-slate-900 font-mono">
                        <CountUp end={result.spotPrice} decimals={0} duration={1} separator=" " decimal="," />
                      </span>
                    </td>
                    <td className="py-3 px-2 text-right">
                      <span className="text-[14px] font-bold text-slate-900 font-mono">
                        {Math.round((result.feeInNok / result.totalCost) * 1000) / 10}%
                      </span>
                    </td>
                    <td className="py-3 px-2 text-right">
                      <a
                        id={`buy-btn-${result.exchange.toLowerCase()}`}
                        href={PLATFORM_DATA[result.exchange].link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center rounded-md bg-[#0052FF] px-4 py-2 text-[13px] font-bold text-white transition-all duration-150 hover:bg-[#0045db] shadow-sm ml-2"
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
                          <div className="px-6 py-6 border-l-4 border-[#0052FF] ml-3 mb-4 mt-2 bg-white rounded-r-xl border border-slate-100 shadow-sm mr-3">
                            <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-2">Om plattformen</h4>
                            <p className="text-[14px] text-slate-600 leading-relaxed font-medium italic">
                              "{PLATFORM_DATA[result.exchange].description}"
                            </p>
                            <div className="mt-4 pt-4 border-t border-slate-50 flex gap-8">
                                <div>
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Est. gebyrer</p>
                                    <p className="text-sm font-bold text-slate-900">{result.feeInNok.toLocaleString('no-NO')} NOK</p>
                                </div>
                                <div>
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Spredning (spread)</p>
                                    <p className="text-sm font-bold text-slate-900">{FEES[result.exchange].spread}%</p>
                                </div>
                            </div>
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
