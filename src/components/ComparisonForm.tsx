import React, { useState } from 'react';
import { CryptoCurrency } from '../types';
import { CryptoIcon, CountryIcon } from './icons';
import { motion } from 'framer-motion';

interface ComparisonFormProps {
  onCalculate: (amount: number) => void;
  isLoading: boolean;
}

export default function ComparisonForm({ onCalculate, isLoading }: ComparisonFormProps) {
  const [amount, setAmount] = useState('10000');
  const [error, setError] = useState<string | null>(null);
  const [selectedAction, setSelectedAction] = useState('Buy'); // Only 'Buy' is selectable
  const [selectedCrypto, setSelectedCrypto] = useState<CryptoCurrency>(CryptoCurrency.BTC); // BTC is default
  const [selectedCountry, setSelectedCountry] = useState('NO'); // Only 'NO' is selectable
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('Bankoverføring'); // Only 'Bankoverføring' is selectable

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
      <form onSubmit={handleSubmit} className="flex items-center w-full max-w-4xl bg-white rounded-xl shadow-lg text-gray-800 divide-x divide-gray-200">
        {/* Kjøp/Salg Dropdown */}
        <div className="relative flex-1 flex items-center justify-center p-4">
          <select
            className="block w-full bg-white text-gray-800 text-lg font-semibold focus:outline-none cursor-not-allowed appearance-none pr-8"
            value={selectedAction}
            disabled
          >
            <option>Buy</option>
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-400">
            <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
              <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </div>
        </div>

        {/* Crypto Dropdown */}
        <div className="relative flex-1 flex items-center p-4">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <CryptoIcon crypto={selectedCrypto} />
          </div>
          <select
            className="block w-full bg-white text-gray-800 text-lg font-semibold focus:outline-none cursor-not-allowed appearance-none pl-10 pr-8"
            value={selectedCrypto}
            disabled
          >
            <option value={CryptoCurrency.BTC}>
              Bitcoin BTC
            </option>
            <option value={CryptoCurrency.ETH} disabled>
              Ethereum ETH - Ikke tilgjengelig
            </option>
            <option value={CryptoCurrency.DOGE} disabled>
              Dogecoin DOGE - Ikke tilgjengelig
            </option>
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-400">
            <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
              <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </div>
        </div>

        {/* Country Dropdown */}
        <div className="relative flex-1 flex items-center p-4">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <CountryIcon countryCode={selectedCountry} />
          </div>
          <select
            className="block w-full bg-white text-gray-800 text-lg font-semibold focus:outline-none cursor-not-allowed appearance-none pl-10 pr-8"
            value={selectedCountry}
            disabled
          >
            <option value="NO">
              in Norway
            </option>
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-400">
            <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
              <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </div>
        </div>

        {/* Search Button */}
        <button
          type="submit"
          disabled={isLoading}
          className="flex-none bg-green-500 text-white font-semibold px-8 py-4 rounded-r-xl hover:bg-green-600 disabled:bg-gray-400 disabled:cursor-not-allowed transition-all duration-300 flex items-center justify-center"
        >
          {isLoading ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Searching...
            </>
          ) : (
            'Search'
          )}
        </button>
      </form>
    </motion.div>
  );
}
