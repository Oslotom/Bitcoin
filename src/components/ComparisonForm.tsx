import React, { useState } from 'react';
import { CryptoCurrency } from '../types';
import { CryptoIcon } from './icons';
import { motion } from 'motion/react';

interface ComparisonFormProps {
  onCalculate: (amount: number) => void;
  isLoading: boolean;
}

const formatAmount = (raw: string) => {
  if (!raw) return '';
  const value = Number(raw);
  if (!Number.isFinite(value) || value <= 0) return '';
  return `${value.toLocaleString('nb-NO')} NOK`;
};

export default function ComparisonForm({ onCalculate, isLoading }: ComparisonFormProps) {
  const [amount, setAmount] = useState('10000');
  const [error, setError] = useState<string | null>(null);
  const [selectedAction, setSelectedAction] = useState('Kjop');
  const [selectedCrypto, setSelectedCrypto] = useState<CryptoCurrency>(CryptoCurrency.BTC);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const numericAmount = Number(amount);
    if (!Number.isFinite(numericAmount) || numericAmount <= 0) {
      setError('Vennligst skriv inn et gyldig positivt tall.');
      return;
    }
    setError(null);
    onCalculate(numericAmount);
  };

  return (
    <motion.div
      id="comparison-form-container"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.4 }}
    >
      <form id="price-search-form" onSubmit={handleSubmit} className="w-full rounded-lg bg-white p-1.5 shadow-sm border border-slate-100">
        <div className="grid grid-cols-2 gap-1.5 sm:grid-cols-12 font-mono">
          {/* Input: Action Selection */}
          <div className="relative sm:col-span-2">
            <select
              id="action-select"
              className="block w-full rounded border border-slate-100 bg-slate-50 px-2 py-2 text-xs font-bold text-slate-800 focus:outline-none appearance-none pr-6"
              value={selectedAction}
              onChange={(e) => setSelectedAction(e.target.value)}
            >
              <option>Kjøp</option>
              <option disabled>Selg</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-1.5 text-slate-400">
              <svg className="h-3 w-3" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </div>
          </div>

          {/* Input: Crypto Selection */}
          <div className="relative sm:col-span-2">
            <div className="pointer-events-none absolute inset-y-0 left-0 z-10 flex items-center pl-2">
              <div className="h-3 w-3">
                <CryptoIcon crypto={selectedCrypto} />
              </div>
            </div>
            <select
              id="crypto-select"
              className="block w-full rounded border border-slate-100 bg-slate-50 py-2 pl-6 pr-6 text-xs font-bold text-slate-800 focus:outline-none appearance-none"
              value={selectedCrypto}
              onChange={(e) => setSelectedCrypto(e.target.value as CryptoCurrency)}
            >
              <option value={CryptoCurrency.BTC}>BTC</option>
              <option value={CryptoCurrency.ETH} disabled>ETH</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-1.5 text-slate-400">
              <svg className="h-3 w-3" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </div>
          </div>

          {/* Input: Amount in NOK */}
          <div className="col-span-2 sm:col-span-6">
            <input
              id="amount-input"
              type="text"
              inputMode="numeric"
              value={formatAmount(amount)}
              onChange={(e) => setAmount(e.target.value.replace(/\D/g, ''))}
              placeholder="Beløp"
              className="block w-full rounded border border-slate-100 bg-slate-50 px-3 py-2 text-xs font-bold text-slate-800 focus:outline-none"
            />
          </div>

          {/* Submit Button */}
          <button
            id="calculate-submit-btn"
            type="submit"
            disabled={isLoading}
            className="col-span-2 sm:col-span-2 rounded bg-orange-600 py-2 text-xs font-bold text-white transition-all hover:bg-orange-700 disabled:bg-slate-200 disabled:text-slate-400 active:scale-95"
          >
            {isLoading ? '...' : 'Oppdater'}
          </button>
        </div>
      </form>
      {error && <p id="form-error-msg" className="mt-2 text-left text-sm text-red-600">{error}</p>}
    </motion.div>
  );
}
