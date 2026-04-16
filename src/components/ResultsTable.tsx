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

const PLATFORM_DATA: Record<Exchange, { link: string }> = {
  [Exchange.Coinbase]: { link: 'https://www.coinbase.com' },
  [Exchange.Binance]: { link: 'https://www.binance.com' },
  [Exchange.Firi]: { link: 'https://firi.com' },
  [Exchange.Kraken]: { link: 'https://www.kraken.com' },
  [Exchange.NBX]: { link: 'https://nbx.com' },
  [Exchange.BareBitcoin]: { link: 'https://barebitcoin.no' },
  [Exchange.Revolut]: { link: 'https://www.revolut.com' },
  [Exchange.CryptoCom]: { link: 'https://crypto.com' },
  [Exchange.BuyBitcoin]: { link: 'https://buybitcoin.com' },
};

const ExpandedRowContent = ({ result }: { result: ComparisonResult }) => (
  <div className="bg-slate-100 p-4 text-sm">
    <h4 className="mb-2 font-semibold text-slate-900">Detaljert beregning for {result.exchange}:</h4>
    <ul className="max-w-md space-y-1 text-slate-600">
      <li className="flex justify-between">
        <span>Ditt innskudd:</span>
        <span className="font-mono">{result.totalCost.toLocaleString('nb-NO', { style: 'currency', currency: 'NOK' })}</span>
      </li>
      <li className="flex justify-between">
        <span>- Handelsgebyr ({FEES[result.exchange].trade * 100}%):</span>
        <span className="font-mono">- {(result.totalCost * FEES[result.exchange].trade).toLocaleString('nb-NO', { style: 'currency', currency: 'NOK' })}</span>
      </li>
      <li className="flex justify-between">
        <span>- Spread ({FEES[result.exchange].spread * 100}%):</span>
        <span className="font-mono">- {(result.totalCost * FEES[result.exchange].spread).toLocaleString('nb-NO', { style: 'currency', currency: 'NOK' })}</span>
      </li>
      <li className="mt-1 flex justify-between border-t border-slate-200 pt-1 font-semibold text-slate-900">
        <span>Belop brukt til kjop av Bitcoin:</span>
        <span className="font-mono">{(result.totalCost - result.feeInNok).toLocaleString('nb-NO', { style: 'currency', currency: 'NOK' })}</span>
      </li>
      <li className="flex justify-between">
        <span>Kurs:</span>
        <span className="font-mono">{Math.round(result.spotPrice).toLocaleString('nb-NO')} NOK</span>
      </li>
      <li className="flex justify-between">
        <span>Totalt gebyr:</span>
        <span className="font-mono">~ {Math.round(result.feeInNok).toLocaleString('nb-NO')} NOK</span>
      </li>
    </ul>
    <a
      href={PLATFORM_DATA[result.exchange].link}
      target="_blank"
      rel="noopener noreferrer"
      className="mt-3 inline-flex rounded-lg bg-sky-600 px-4 py-2 text-sm font-semibold text-white transition-all duration-200 hover:bg-sky-500"
      onClick={(e) => e.stopPropagation()}
    >
      Kjop her
    </a>
  </div>
);

const DesktopTableHeader = () => (
  <thead>
    <tr className="border-b border-slate-100">
      <th className="py-3 px-4 text-left text-[10px] font-bold uppercase tracking-widest text-slate-400">Plattform</th>
      <th className="py-3 px-4 text-right text-[10px] font-bold uppercase tracking-widest text-slate-400">Du mottar</th>
      <th className="py-3 px-4 text-right text-[10px] font-bold uppercase tracking-widest text-slate-400">Kurs</th>
      <th className="py-3 px-4 text-right text-[10px] font-bold uppercase tracking-widest text-slate-400">Gebyr</th>
      <th className="py-3 px-4 text-right text-[10px] font-bold uppercase tracking-widest text-slate-400"></th>
    </tr>
  </thead>
);

export default function ResultsTable({ results, isLoading, error, crypto }: ResultsTableProps) {
  const [expandedRow, setExpandedRow] = useState<Exchange | null>(null);

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

  const handleRowClick = (exchange: Exchange) => {
    setExpandedRow(expandedRow === exchange ? null : exchange);
  };

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
        <div id="results-mobile-view" className="space-y-1 md:hidden">
          {sortedResults.map((result) => (
            <div 
              key={result.exchange} 
              id={`exchange-row-mobile-${result.exchange.toLowerCase()}`}
              className="overflow-hidden border-b border-slate-50 bg-white"
            >
              <button
                type="button"
                className="w-full py-2.5 px-2 text-left"
                onClick={() => handleRowClick(result.exchange)}
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="flex min-w-0 items-center gap-3">
                    <div className="shrink-0 scale-75">
                      <ExchangeIcon exchange={result.exchange} />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-sm font-bold text-slate-900 leading-tight">{result.exchange}</span>
                      <span className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter">
                        {result.exchange === Exchange.Firi || result.exchange === Exchange.NBX || result.exchange === Exchange.BareBitcoin ? 'Norsk' : 'Global'}
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-col items-end">
                    <div className="text-sm font-bold text-slate-900 font-mono tracking-tighter">
                      <CountUp end={result.cryptoAmount} decimals={6} duration={1} separator=" " decimal="," /> BTC
                    </div>
                    {result.exchange === bestResult.exchange && (
                      <span className="text-[8px] font-black text-emerald-500 uppercase tracking-widest">Beste pris</span>
                    )}
                  </div>
                </div>
              </button>
              <AnimatePresence initial={false}>
                {expandedRow === result.exchange && (
                  <motion.div
                    id={`expanded-content-mobile-${result.exchange.toLowerCase()}`}
                    key="mobile-content"
                    initial="collapsed"
                    animate="open"
                    exit="collapsed"
                    variants={{ open: { opacity: 1, height: 'auto' }, collapsed: { opacity: 0, height: 0 } }}
                    transition={{ duration: 0.25, ease: 'easeInOut' }}
                    className="overflow-hidden"
                  >
                    <ExpandedRowContent result={result} />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>

        {/* Desktop View: Traditional Table */}
        <div id="results-desktop-view" className="hidden md:block">
          <table className="w-full">
            <DesktopTableHeader />
            <tbody className="divide-y divide-slate-50">
              {sortedResults.map((result) => (
                <React.Fragment key={result.exchange}>
                  <tr 
                    id={`exchange-row-desktop-${result.exchange.toLowerCase()}`}
                    onClick={() => handleRowClick(result.exchange)} 
                    className="group cursor-pointer transition-colors duration-200 hover:bg-slate-50/50"
                  >
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div className="shrink-0 scale-75 transition-transform group-hover:scale-90">
                          <ExchangeIcon exchange={result.exchange} />
                        </div>
                        <div className="flex flex-col">
                          <span className="text-sm font-bold text-slate-900 leading-tight">{result.exchange}</span>
                          <span className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter">
                            {result.exchange === Exchange.Firi || result.exchange === Exchange.NBX || result.exchange === Exchange.BareBitcoin ? 'Norsk' : 'Global'}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-right">
                       <div className="flex flex-col items-end">
                        <div className="text-sm font-bold text-slate-900 font-mono tracking-tighter">
                          <CountUp end={result.cryptoAmount} decimals={6} duration={1} separator=" " decimal="," /> BTC
                        </div>
                        {result.exchange === bestResult.exchange && (
                          <span className="text-[8px] font-black text-emerald-500 uppercase tracking-widest">Beste pris</span>
                        )}
                      </div>
                    </td>
                    <td className="py-3 px-4 text-right text-xs font-medium text-slate-500 font-mono">
                      <CountUp end={result.spotPrice} decimals={0} duration={1} separator=" " decimal="," /> NOK
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex flex-col items-end">
                        <div className="text-xs font-bold text-slate-900">
                           ~ {Math.round(result.feeInNok)} NOK
                        </div>
                        <span className="text-[8px] font-bold text-slate-400 uppercase tracking-tight">
                          {Math.round((result.feeInNok / result.totalCost) * 1000) / 10}% totalt
                        </span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-right">
                        <a
                          id={`buy-btn-${result.exchange.toLowerCase()}`}
                          href={PLATFORM_DATA[result.exchange].link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex rounded-lg bg-slate-900 px-3 py-1.5 text-[10px] font-bold text-white transition-all duration-200 hover:bg-slate-800"
                          onClick={(e) => e.stopPropagation()}
                        >
                          Kjøp
                        </a>
                    </td>
                  </tr>
                  {/* Expanded Calculation Area */}
                  <tr id={`calculation-row-${result.exchange.toLowerCase()}`}>
                    <td colSpan={5} className="p-0 border-none">
                      <AnimatePresence initial={false}>
                        {expandedRow === result.exchange && (
                          <motion.div
                            id={`expanded-content-desktop-${result.exchange.toLowerCase()}`}
                            key="desktop-content"
                            initial="collapsed"
                            animate="open"
                            exit="collapsed"
                            variants={{ open: { opacity: 1, height: 'auto' }, collapsed: { opacity: 0, height: 0 } }}
                            transition={{ duration: 0.3, ease: 'easeInOut' }}
                            className="overflow-hidden bg-slate-50/30"
                          >
                            <ExpandedRowContent result={result} />
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </td>
                  </tr>
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
