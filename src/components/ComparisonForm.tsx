import React, { useState } from 'react';
import { CryptoCurrency } from '../types';
import { CryptoIcon } from './icons';
import { motion } from 'framer-motion';

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
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.4 }}
    >
      <form onSubmit={handleSubmit} className="w-full rounded-xl bg-white p-2 shadow-lg">
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-12">
          <div className="relative sm:col-span-2">
            <select
              className="block w-full rounded-lg border border-slate-200 bg-white px-3 py-3 text-sm font-semibold text-gray-800 focus:outline-none appearance-none pr-9"
              value={selectedAction}
              onChange={(e) => setSelectedAction(e.target.value)}
            >
              <option>Kjop</option>
              <option disabled>Selg (kommer snart)</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-400">
              <svg className="h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </div>
          </div>

          <div className="relative sm:col-span-2">
            <div className="pointer-events-none absolute inset-y-0 left-0 z-10 flex items-center pl-3">
              <div className="h-4 w-4 [&>svg]:h-4 [&>svg]:w-4">
                <CryptoIcon crypto={selectedCrypto} />
              </div>
            </div>
            <select
              className="block w-full rounded-lg border border-slate-200 bg-white py-3 pl-8 pr-8 text-sm font-semibold text-gray-800 focus:outline-none appearance-none"
              value={selectedCrypto}
              onChange={(e) => setSelectedCrypto(e.target.value as CryptoCurrency)}
            >
              <option value={CryptoCurrency.BTC}>BTC</option>
              <option value={CryptoCurrency.ETH} disabled>ETH (coming soon)</option>
              <option value={CryptoCurrency.DOGE} disabled>DOGE (coming soon)</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-400">
              <svg className="h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </div>
          </div>

          <div className="col-span-2 sm:col-span-6">
            <label htmlFor="amount" className="sr-only">Amount</label>
            <input
              id="amount"
              type="text"
              inputMode="numeric"
              value={formatAmount(amount)}
              onChange={(e) => setAmount(e.target.value.replace(/\D/g, ''))}
              placeholder="Belop"
              className="block w-full rounded-lg border border-slate-200 bg-white px-3 py-3 text-sm font-semibold text-gray-800 focus:outline-none"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="col-span-2 sm:col-span-2 shrink-0 whitespace-nowrap rounded-lg bg-green-500 px-4 py-3 text-sm font-semibold text-white transition-all duration-300 hover:bg-green-600 disabled:cursor-not-allowed disabled:bg-gray-400"
          >
            {isLoading ? 'Laster...' : 'Compare'}
          </button>
        </div>
      </form>
      {error && <p className="mt-2 text-left text-sm text-red-600">{error}</p>}
    </motion.div>
  );
}
