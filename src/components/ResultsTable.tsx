import React, { useState } from 'react';
import { ComparisonResult, CryptoCurrency, Exchange } from '../types';
import { motion, AnimatePresence } from 'framer-motion';
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
    <tr className="border-b border-slate-200">
      <th className="whitespace-nowrap p-4 text-left text-sm font-semibold text-slate-500">Plattform</th>
      <th className="whitespace-nowrap p-4 text-right text-sm font-semibold text-slate-500">Du mottar</th>
      <th className="whitespace-nowrap p-4 text-right text-sm font-semibold text-slate-500">Kurs</th>
      <th className="whitespace-nowrap p-4 text-right text-sm font-semibold text-slate-500">Gebyr (NOK)</th>
      <th className="whitespace-nowrap p-4 text-right text-sm font-semibold text-slate-500"></th>
    </tr>
  </thead>
);

export default function ResultsTable({ results, isLoading, error, crypto }: ResultsTableProps) {
  const [expandedRow, setExpandedRow] = useState<Exchange | null>(null);

  if (isLoading) {
    return (
      <div className="mt-16 flex items-center justify-center">
        <svg className="h-10 w-10 animate-spin text-sky-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
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
        className="mt-8 rounded-lg border border-red-200 bg-red-50 p-4 text-center text-red-700"
      >
        <p><strong>En feil oppstod:</strong> {error}</p>
      </motion.div>
    );
  }

  if (results.length === 0) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center text-slate-500 shadow-lg md:p-16">
        <h3 className="text-xl font-semibold">Klar til aa sammenligne</h3>
        <p>Fyll ut skjemaet over for aa se live priser.</p>
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
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <div className="space-y-3 md:hidden">
          {sortedResults.map((result) => (
            <div key={result.exchange} className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
              <button
                type="button"
                className="w-full p-4 text-left"
                onClick={() => handleRowClick(result.exchange)}
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="flex min-w-0 items-center gap-2">
                    <ExchangeIcon exchange={result.exchange} />
                    <span className="truncate font-semibold text-slate-900">{result.exchange}</span>
                    {(result.exchange === Exchange.Firi || result.exchange === Exchange.Kraken) && (
                      <CountryIcon countryCode="NO" />
                    )}
                  </div>
                  {result.exchange === bestResult.exchange && (
                    <span className="rounded-full bg-green-100 px-2 py-0.5 text-xs font-semibold text-green-700">Best</span>
                  )}
                </div>
                <div className="mt-2 text-right text-lg font-semibold text-sky-600">
                  <CountUp end={result.cryptoAmount} decimals={6} duration={1} separator=" " decimal="," />
                </div>
              </button>
              <AnimatePresence initial={false}>
                {expandedRow === result.exchange && (
                  <motion.div
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

        <div className="hidden overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-lg md:block">
          <table className="w-full">
            <DesktopTableHeader />
            <tbody className="divide-y divide-slate-200">
              {sortedResults.map((result) => (
                <React.Fragment key={result.exchange}>
                  <tr onClick={() => handleRowClick(result.exchange)} className="cursor-pointer transition-colors duration-200 hover:bg-slate-50">
                    <td className="relative whitespace-nowrap p-4 font-semibold text-slate-900">
                      {result.exchange === bestResult.exchange && (
                        <div className="absolute -left-0.5 top-0 h-full w-1 rounded-l-full bg-green-500"></div>
                      )}
                      <div className="flex items-center gap-3">
                        <ExchangeIcon exchange={result.exchange} />
                        {result.exchange}
                        {(result.exchange === Exchange.Firi || result.exchange === Exchange.Kraken) && (
                          <CountryIcon countryCode="NO" />
                        )}
                      </div>
                    </td>
                    <td className="whitespace-nowrap p-4 text-right font-semibold text-sky-600">
                      <CountUp end={result.cryptoAmount} decimals={6} duration={1} separator=" " decimal="," />
                    </td>
                    <td className="whitespace-nowrap p-4 text-right text-slate-600">
                      <CountUp end={result.spotPrice} decimals={0} duration={1} separator=" " decimal="," /> NOK
                    </td>
                    <td className="whitespace-nowrap p-4 text-right text-slate-600">
                      <CountUp end={result.feeInNok} decimals={0} duration={1} prefix="~ " separator=" " decimal="," /> NOK
                    </td>
                    <td className="p-4 text-right">
                      <a
                        href={PLATFORM_DATA[result.exchange].link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="rounded-lg bg-sky-600 px-4 py-2 text-sm font-semibold text-white transition-all duration-200 hover:bg-sky-500"
                      >
                        Kjop her
                      </a>
                    </td>
                  </tr>
                  <tr>
                    <td colSpan={5} className="p-0" style={{ borderTop: 'none' }}>
                      <AnimatePresence initial={false}>
                        {expandedRow === result.exchange && (
                          <motion.div
                            key="desktop-content"
                            initial="collapsed"
                            animate="open"
                            exit="collapsed"
                            variants={{ open: { opacity: 1, height: 'auto' }, collapsed: { opacity: 0, height: 0 } }}
                            transition={{ duration: 0.3, ease: 'easeInOut' }}
                            className="overflow-hidden"
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
