import { useState } from 'react';
import Footer from './components/Footer';
import Header from './components/Header';
import ExchangeOverview from './components/ExchangeOverview';
import ResultsTable from './components/ResultsTable';
import { getCoinbasePrice, getBinancePrice, getFiriPrice, FEES } from './services/api';
import { ComparisonResult } from './types';

export default function App() {
  const [results, setResults] = useState<ComparisonResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showResults, setShowResults] = useState(false);

  const handleCalculate = async (amount: number) => {
    setIsLoading(true);
    setError(null);
    setResults([]);

    try {
      const [coinbasePrice, binancePrice, firiPrice] = await Promise.allSettled([
        getCoinbasePrice('BTC'),
        getBinancePrice('BTC'),
        getFiriPrice(),
      ]);

      const newResults: ComparisonResult[] = [];

      if (coinbasePrice.status === 'fulfilled') {
        const spotPrice = coinbasePrice.value;
        const feePercentage = FEES.Coinbase.trade + FEES.Coinbase.spread;
        const feeInNok = amount * feePercentage;
        const amountAfterFee = amount - feeInNok;
        const effectivePrice = spotPrice / (1 - feePercentage);
        const cryptoAmount = amountAfterFee / spotPrice;
        newResults.push({
          exchange: 'Coinbase',
          spotPrice,
          feeInNok,
          effectivePrice,
          cryptoAmount,
          totalCost: amount,
        });
      }

      if (binancePrice.status === 'fulfilled') {
        const spotPrice = binancePrice.value;
        const feePercentage = FEES.Binance.trade + FEES.Binance.spread;
        const feeInNok = amount * feePercentage;
        const amountAfterFee = amount - feeInNok;
        const effectivePrice = spotPrice / (1 - feePercentage);
        const cryptoAmount = amountAfterFee / spotPrice;
        newResults.push({
          exchange: 'Binance',
          spotPrice,
          feeInNok,
          effectivePrice,
          cryptoAmount,
          totalCost: amount,
        });
      } else {
        // If Binance fails, show a specific error but don't crash
        console.error(binancePrice.reason);
        // We can set a partial error message if needed
      }

      if (firiPrice.status === 'fulfilled') {
        const spotPrice = firiPrice.value;
        const feePercentage = FEES.Firi.trade + FEES.Firi.spread;
        const feeInNok = amount * feePercentage;
        const amountAfterFee = amount - feeInNok;
        const effectivePrice = spotPrice / (1 - feePercentage);
        const cryptoAmount = amountAfterFee / spotPrice;
        newResults.push({
          exchange: 'Firi',
          spotPrice,
          feeInNok,
          effectivePrice,
          cryptoAmount,
          totalCost: amount,
        });
      }

      if (newResults.length === 0) {
        throw new Error('Kunne ikke hente priser fra noen av børsene. Prøv igjen senere.');
      }

      setResults(newResults);
      setShowResults(true); // Show results only on successful calculation
    } catch (err: any) {
      setError(err.message || 'En ukjent feil oppstod.');
      setShowResults(false); // Hide results if there's an error
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white font-sans">
      <Header onCalculate={handleCalculate} isLoading={isLoading} />
      <main className="container mx-auto px-4 pb-16">
        <div className="max-w-4xl mx-auto">
          {showResults && (
            <ResultsTable results={results} isLoading={isLoading} error={error} crypto={'BTC'} />
          )}
        </div>
      </main>
      <ExchangeOverview />
      <Footer />
    </div>
  );
}
