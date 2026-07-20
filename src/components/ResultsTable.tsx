import React, { useState, useMemo } from 'react';
import { ComparisonResult, CryptoCurrency, Exchange } from '../types';
import { motion, AnimatePresence } from 'motion/react';
import CountUp from 'react-countup';
import { CountryIcon, ExchangeIcon } from './icons';
import { FEES } from '../services/api';
import { ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react';

interface ResultsTableProps {
  results: ComparisonResult[];
  isLoading: boolean;
  error: string | null;
  crypto: CryptoCurrency;
}

type SortKey = 'exchange' | 'spotPrice' | 'feePercent' | 'cryptoAmount';

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
  const [sortConfig, setSortConfig] = useState<{ key: SortKey; direction: 'asc' | 'desc' }>({
    key: 'cryptoAmount',
    direction: 'desc'
  });

  const toggleRow = (exchange: Exchange) => {
    setExpandedRow(expandedRow === exchange ? null : exchange);
  };

  const handleSort = (key: SortKey) => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'desc' ? 'asc' : 'desc'
    }));
  };

  const sortedResults = useMemo(() => {
    return [...results].sort((a, b) => {
      let valA: any;
      let valB: any;

      if (sortConfig.key === 'exchange') {
        valA = a.exchange;
        valB = b.exchange;
      } else if (sortConfig.key === 'spotPrice') {
        valA = a.spotPrice;
        valB = b.spotPrice;
      } else if (sortConfig.key === 'feePercent') {
        valA = a.feeInNok / a.totalCost;
        valB = b.feeInNok / b.totalCost;
      } else {
        valA = a.cryptoAmount;
        valB = b.cryptoAmount;
      }

      if (valA < valB) return sortConfig.direction === 'asc' ? -1 : 1;
      if (valA > valB) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });
  }, [results, sortConfig]);

  const lowestFeeResult = useMemo(() => {
    if (results.length === 0) return null;
    return results.reduce((lowest, current) =>
      (current.feeInNok / current.totalCost) < (lowest.feeInNok / lowest.totalCost) ? current : lowest
    );
  }, [results]);

  const bestResult = useMemo(() => {
    if (results.length === 0) return null;
    return results.reduce((best, current) =>
      current.cryptoAmount > best.cryptoAmount ? current : best
    );
  }, [results]);

  const worstResult = useMemo(() => {
    if (results.length === 0) return null;
    return results.reduce((worst, current) =>
      current.cryptoAmount < worst.cryptoAmount ? current : worst
    );
  }, [results]);

  const SortIndicator = ({ column }: { column: SortKey }) => {
    if (sortConfig.key !== column) return <ArrowUpDown size={12} className="ml-1 opacity-20" />;
    return sortConfig.direction === 'asc' ? 
      <ArrowUp size={12} className="ml-1 text-brand" /> : 
      <ArrowDown size={12} className="ml-1 text-brand" />;
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

  return (
    <AnimatePresence>
      <motion.div
        id="results-table-main"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="overflow-hidden font-table"
      >
        {/* Mobile View: Stacked Rows */}
        <div id="results-mobile-view" className="md:hidden">
          <div className="flex px-4 py-3 bg-slate-50/50 border-b border-slate-100">
            <span 
              className="w-[45%] text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center cursor-pointer"
              onClick={() => handleSort('exchange')}
            >
              Plattform <SortIndicator column="exchange" />
            </span>
            <span 
              className="w-[20%] text-[10px] font-bold text-slate-400 uppercase tracking-wider text-center flex items-center justify-center cursor-pointer"
              onClick={() => handleSort('feePercent')}
            >
              Gebyr <SortIndicator column="feePercent" />
            </span>
            <span 
              className="w-[35%] text-[10px] font-bold text-slate-400 uppercase tracking-wider text-right flex items-center justify-end cursor-pointer"
              onClick={() => handleSort('spotPrice')}
            >
              Pris <SortIndicator column="spotPrice" />
            </span>
          </div>

          <div className="divide-y divide-slate-50">
            {sortedResults.map((result) => (
              <div 
                key={result.exchange} 
                className="bg-white hover:bg-slate-50/80 transition-colors"
                onClick={() => toggleRow(result.exchange)}
              >
                <div className="py-4 px-2 flex items-center justify-between">
                  {/* Left: Platform */}
                  <div className="flex min-w-0 items-center gap-3 w-[45%]">
                    <div className="shrink-0 transition-transform group-hover:scale-105">
                      <ExchangeIcon exchange={result.exchange} size={32} />
                    </div>
                    <div className="flex flex-col min-w-0">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="text-sm font-bold text-slate-900 leading-tight truncate">{result.exchange}</span>
                        {bestResult && result.exchange === bestResult.exchange && (
                          <span className="px-1 py-0.5 bg-emerald-50 text-emerald-600 border border-emerald-100 rounded text-[8px] font-black uppercase">Beste pris</span>
                        )}
                      </div>
                      <div className="flex items-center gap-1.5 mt-0.5 flex-wrap">
                        <span className="text-[10px] text-slate-400 font-medium">
                          {result.exchange === Exchange.Firi || result.exchange === Exchange.NBX || result.exchange === Exchange.BareBitcoin ? 'Norsk' : 'Global'}
                        </span>
                        {lowestFeeResult && result.exchange === lowestFeeResult.exchange && (
                          <span className="text-[9px] font-bold text-blue-500 uppercase tracking-tighter">Lavest gebyr</span>
                        )}
                        {worstResult && result.exchange === worstResult.exchange && (
                          <span className="text-[9px] font-bold text-red-500 uppercase tracking-tighter">Dyrest</span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Center: Fee */}
                  <div className="w-[20%] text-center">
                    <span className={`text-xs font-bold ${lowestFeeResult && result.exchange === lowestFeeResult.exchange ? 'text-success' : 'text-slate-600'}`}>
                      {Math.round((result.feeInNok / result.totalCost) * 1000) / 10}%
                    </span>
                  </div>

                  {/* Right: Price */}
                  <div className="flex flex-col items-end w-[35%]">
                    <div className="text-sm font-bold text-slate-900 tracking-tight">
                      <CountUp end={result.spotPrice} decimals={0} duration={1} separator=" " decimal="," />
                    </div>
                  </div>
                </div>

                {/* Expanded Details Mobile */}
                <AnimatePresence>
                  {expandedRow === result.exchange && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden bg-slate-50/50"
                    >
                      <div className="p-5 space-y-5">
                        <div className="p-4 bg-white rounded-xl border border-slate-100 shadow-sm">
                          <p className="text-xs text-slate-600 leading-relaxed font-medium italic">
                            "{PLATFORM_DATA[result.exchange].description}"
                          </p>
                        </div>
                        <div className="grid grid-cols-2 gap-6">
                          <div className="space-y-1">
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Handlegebyr</p>
                            <p className="text-sm font-bold text-slate-900">{result.feeInNok.toLocaleString('no-NO')} NOK</p>
                          </div>
                          <div className="space-y-1">
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Spredning</p>
                            <p className="text-sm font-bold text-slate-900">{FEES[result.exchange].spread}%</p>
                          </div>
                        </div>
                        <a
                          href={PLATFORM_DATA[result.exchange].link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn-primary w-full text-sm"
                          onClick={(e) => e.stopPropagation()}
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
              <tr className="bg-slate-50/50 border-b border-slate-100">
                <th 
                  className="py-4 px-6 text-left text-[10px] font-bold uppercase tracking-wider text-slate-400 cursor-pointer hover:text-slate-600 transition-colors"
                  onClick={() => handleSort('exchange')}
                >
                  <div className="flex items-center">
                    Plattform <SortIndicator column="exchange" />
                  </div>
                </th>
                <th 
                  className="py-4 px-6 text-right text-[10px] font-bold uppercase tracking-wider text-slate-400 cursor-pointer hover:text-slate-600 transition-colors"
                  onClick={() => handleSort('spotPrice')}
                >
                  <div className="flex items-center justify-end">
                    Live Pris (NOK) <SortIndicator column="spotPrice" />
                  </div>
                </th>
                <th 
                  className="py-4 px-6 text-right text-[10px] font-bold uppercase tracking-wider text-slate-400 cursor-pointer hover:text-slate-600 transition-colors"
                  onClick={() => handleSort('feePercent')}
                >
                  <div className="flex items-center justify-end">
                    Totalt Gebyr <SortIndicator column="feePercent" />
                  </div>
                </th>
                <th className="py-4 px-6 text-right text-[10px] font-bold uppercase tracking-wider text-slate-400">Handling</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {sortedResults.map((result) => (
                <React.Fragment key={result.exchange}>
                  <tr 
                    className="group hover:bg-slate-50/80 transition-all duration-200 cursor-pointer"
                    onClick={() => toggleRow(result.exchange)}
                  >
                    <td className="py-5 px-6">
                      <div className="flex items-center gap-4">
                        <div className="shrink-0 transition-transform group-hover:scale-110">
                          <ExchangeIcon exchange={result.exchange} size={40} />
                        </div>
                        <div className="flex flex-col">
                          <div className="flex items-center gap-2">
                            <span className="text-base font-bold text-slate-900 leading-none">{result.exchange}</span>
                            {bestResult && result.exchange === bestResult.exchange && (
                              <span className="px-1.5 py-0.5 bg-emerald-50 text-emerald-600 border border-emerald-100 rounded text-[9px] font-black uppercase tracking-wider">Beste pris</span>
                            )}
                          </div>
                          <div className="flex items-center gap-2 mt-2">
                            <span className="text-xs text-slate-400 font-medium flex items-center gap-1.5">
                              {result.exchange === Exchange.Firi || result.exchange === Exchange.NBX || result.exchange === Exchange.BareBitcoin ? (
                                <><span className="w-1 h-1 rounded-full bg-brand" /> Norsk plattform</>
                              ) : 'Global plattform'}
                            </span>
                            {lowestFeeResult && result.exchange === lowestFeeResult.exchange && (
                              <span className="text-[10px] font-bold text-blue-500 uppercase tracking-tight">Lavest gebyr</span>
                            )}
                            {worstResult && result.exchange === worstResult.exchange && (
                              <span className="text-[10px] font-bold text-red-500 uppercase tracking-tight">Dyrest</span>
                            )}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="py-5 px-6 text-right">
                      <div className="flex flex-col items-end">
                        <span className="text-lg font-bold text-slate-900 tracking-tight">
                          <CountUp end={result.spotPrice} decimals={0} duration={1} separator=" " decimal="," />
                        </span>
                        <span className="text-[10px] text-slate-400 font-bold uppercase mt-1">Per BTC</span>
                      </div>
                    </td>
                    <td className="py-5 px-6 text-right">
                      <div className="flex flex-col items-end">
                        <span className={`text-base font-bold ${lowestFeeResult && result.exchange === lowestFeeResult.exchange ? 'text-success' : 'text-slate-900'}`}>
                          {Math.round((result.feeInNok / result.totalCost) * 1000) / 10}%
                        </span>
                      </div>
                    </td>
                    <td className="py-5 px-6 text-right">
                      <a
                        id={`buy-btn-${result.exchange.toLowerCase()}`}
                        href={PLATFORM_DATA[result.exchange].link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn-primary py-2 px-5 text-sm inline-flex shadow-md shadow-blue-100"
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
                          className="bg-slate-50/50 overflow-hidden"
                        >
                          <div className="mx-6 mb-6 p-8 bg-white rounded-2xl border border-slate-100 shadow-sm flex flex-col md:flex-row gap-12">
                            <div className="flex-1 space-y-4">
                              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Analyse av plattformen</h4>
                              <p className="text-base text-slate-600 leading-relaxed font-medium italic">
                                "{PLATFORM_DATA[result.exchange].description}"
                              </p>
                            </div>
                            <div className="md:w-64 grid grid-cols-1 gap-6">
                              <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Handlegebyr</p>
                                <p className="text-lg font-bold text-slate-900">{result.feeInNok.toLocaleString('no-NO')} NOK</p>
                              </div>
                              <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Spredning (spread)</p>
                                <p className="text-lg font-bold text-slate-900">{FEES[result.exchange].spread}%</p>
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

