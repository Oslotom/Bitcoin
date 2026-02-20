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
  [Exchange.Revolut]: { link: 'https://www.revolut.com' },
  [Exchange.CryptoCom]: { link: 'https://crypto.com' },
  [Exchange.BuyBitcoin]: { link: 'https://buybitcoin.com' },
};

const TableHeader = () => (
  <thead>
    <tr className="border-b border-slate-200">
      <th className="text-left font-semibold text-sm text-slate-500 p-4 whitespace-nowrap">Plattform</th>
      <th className="text-right font-semibold text-sm text-slate-500 p-4 whitespace-nowrap">Du mottar</th>
      <th className="text-right font-semibold text-sm text-slate-500 p-4 whitespace-nowrap">Kurs</th>
      <th className="text-right font-semibold text-sm text-slate-500 p-4 whitespace-nowrap">Gebyr (NOK)</th>
      <th className="text-right font-semibold text-sm text-slate-500 p-4 whitespace-nowrap"></th>
    </tr>
  </thead>
);

const ExpandedRowContent = ({ result }: { result: ComparisonResult }) => (
  <div className="bg-slate-100 p-4 text-sm">
    <h4 className="font-semibold text-slate-900 mb-2">Detaljert beregning for {result.exchange}:</h4>
    <ul className="space-y-1 text-slate-600 max-w-md">
      <li className="flex justify-between">
        <span>Ditt innskudd:</span>
        <span className="font-mono">{result.totalCost.toLocaleString('nb-NO', { style: 'currency', currency: 'NOK' })}</span>
      </li>
      <li className="flex justify-between">
        <span>- Handelsgebyr ({FEES[result.exchange].trade * 100}%):</span>
        <span className="font-mono">- {(result.totalCost * FEES[result.exchange].trade).toLocaleString('nb-NO', { style: 'currency', currency: 'NOK' })}</span>
      </li>
      <li className="flex justify-between">
        <span>- Estimat for spread/vekslingskurs ({FEES[result.exchange].spread * 100}%):</span>
        <span className="font-mono">- {(result.totalCost * FEES[result.exchange].spread).toLocaleString('nb-NO', { style: 'currency', currency: 'NOK' })}</span>
      </li>
      <li className="flex justify-between border-t border-slate-200 pt-1 mt-1 font-semibold text-slate-900">
        <span>Beloep brukt til kjoep av Bitcoin:</span>
        <span className="font-mono">{(result.totalCost - result.feeInNok).toLocaleString('nb-NO', { style: 'currency', currency: 'NOK' })}</span>
      </li>
    </ul>
  </div>
);

export default function ResultsTable({ results, isLoading, error, crypto }: ResultsTableProps) {
  const [expandedRow, setExpandedRow] = useState<Exchange | null>(null);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center mt-16">
        <svg className="animate-spin h-10 w-10 text-sky-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
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
        className="mt-8 text-center bg-red-50 border border-red-200 p-4 rounded-lg text-red-700"
      >
        <p><strong>En feil oppstod:</strong> {error}</p>
      </motion.div>
    );
  }

  const TableShell = ({ children }: { children: React.ReactNode }) => (
    <div className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-x-auto">
      <table className="w-full min-w-max">
        <TableHeader />
        {children}
      </table>
    </div>
  );

  if (results.length === 0) {
    return (
      <TableShell>
        <tbody>
          <tr>
            <td colSpan={5} className="text-center p-16 text-slate-500">
              <h3 className="text-xl font-semibold">Klar til aa sammenligne</h3>
              <p>Fyll ut skjemaet over for aa se live priser.</p>
            </td>
          </tr>
        </tbody>
      </TableShell>
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
        <TableShell>
          <tbody className="divide-y divide-slate-200">
            {sortedResults.map((result) => (
              <React.Fragment key={result.exchange}>
                <tr onClick={() => handleRowClick(result.exchange)} className="hover:bg-slate-50 transition-colors duration-200 cursor-pointer">
                  <td className="p-4 font-semibold text-slate-900 whitespace-nowrap relative">
                    {result.exchange === bestResult.exchange && (
                      <div className="absolute -left-0.5 top-0 h-full w-1 bg-green-500 rounded-l-full"></div>
                    )}
                    <div className="flex items-center gap-3">
                      <ExchangeIcon exchange={result.exchange} />
                      {result.exchange}
                      {(result.exchange === Exchange.Firi || result.exchange === Exchange.Kraken) && (
                        <CountryIcon countryCode="NO" />
                      )}
                    </div>
                  </td>
                  <td className="text-right p-4 font-semibold text-sky-600 whitespace-nowrap"><CountUp end={result.cryptoAmount} decimals={6} duration={1} separator=" " decimal="," /></td>
                  <td className="text-right p-4 text-slate-600 whitespace-nowrap"><CountUp end={result.spotPrice} decimals={0} duration={1} separator=" " decimal="," /> NOK</td>
                  <td className="text-right p-4 text-slate-600 whitespace-nowrap"><CountUp end={result.feeInNok} decimals={0} duration={1} prefix="~ " separator=" " decimal="," /> NOK</td>
                  <td className="p-4 text-right">
                    <a href={PLATFORM_DATA[result.exchange].link} target="_blank" rel="noopener noreferrer" className="bg-sky-600 text-white font-semibold px-4 py-2 rounded-lg hover:bg-sky-500 transition-all duration-200 text-sm">
                      Kjøp her
                    </a>
                  </td>
                </tr>
                <tr>
                  <td colSpan={5} className="p-0" style={{ borderTop: 'none' }}>
                    <AnimatePresence initial={false}>
                      {expandedRow === result.exchange && (
                        <motion.div
                          key="content"
                          initial="collapsed"
                          animate="open"
                          exit="collapsed"
                          variants={{
                            open: { opacity: 1, height: 'auto' },
                            collapsed: { opacity: 0, height: 0 },
                          }}
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
        </TableShell>
      </motion.div>
    </AnimatePresence>
  );
}
