import React, { useState } from 'react';
import { CryptoCurrency } from '../types';
import { motion } from 'framer-motion';

interface ComparisonFormProps {
  onCalculate: (amount: number) => void;
  isLoading: boolean;
}

export default function ComparisonForm({ onCalculate, isLoading }: ComparisonFormProps) {
  const [amount, setAmount] = useState('10000');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const numericAmount = parseFloat(amount);
    if (isNaN(numericAmount) || numericAmount <= 0) {
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
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row items-center gap-4 bg-gray-800/50 backdrop-blur-sm p-4 rounded-xl shadow-lg border border-white/10">
        <div className="w-full sm:w-auto flex-grow">
            <label htmlFor="amount" className="sr-only">Beløp (NOK)</label>
            <input
              id="amount"
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Skriv inn beløp i NOK"
              className="w-full bg-gray-700/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none transition"
            />
        </div>
        {error && <p className="text-red-400 text-sm w-full sm:w-auto text-center">{error}</p>}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full sm:w-auto bg-indigo-600 text-white font-semibold px-8 py-3 rounded-lg hover:bg-indigo-500 disabled:bg-gray-600 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105 disabled:scale-100 flex items-center justify-center"
        >
          {isLoading ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Beregner...
            </>
          ) : (
            'Beregn'
          )}
        </button>
      </form>
    </motion.div>
  );
}
