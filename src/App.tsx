import { useState } from 'react';
import Footer from './components/Footer';
import Header from './components/Header';
import ExchangeOverview from './components/ExchangeOverview';
import ResultsTable from './components/ResultsTable';
import { getCoinbasePrice, getBinancePrice, getFiriPrice, getKrakenPrice, getNbxPrice, getCryptoComPrice, getBuyBitcoinPrice, FEES } from './services/api';
import { ComparisonResult, CryptoCurrency, Exchange } from './types';

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
      const [coinbasePrice, binancePrice, firiPrice, krakenPrice, nbxPrice, cryptoComPrice, buyBitcoinPrice] = await Promise.allSettled([
        getCoinbasePrice(CryptoCurrency.BTC),
        getBinancePrice(CryptoCurrency.BTC),
        getFiriPrice(),
        getKrakenPrice(),
        getNbxPrice(),
        getCryptoComPrice(),
        getBuyBitcoinPrice(),
      ]);

      const newResults: ComparisonResult[] = [];

      const processResult = (exchange: Exchange, priceResult: PromiseSettledResult<number>) => {
        if (priceResult.status === 'fulfilled') {
          const spotPrice = priceResult.value;
          const feePercentage = FEES[exchange].trade + FEES[exchange].spread;
          const feeInNok = amount * feePercentage;
          const amountAfterFee = amount - feeInNok;
          const effectivePrice = spotPrice / (1 - feePercentage);
          const cryptoAmount = amountAfterFee / spotPrice;
          newResults.push({
            exchange,
            spotPrice,
            feeInNok,
            effectivePrice,
            cryptoAmount,
            totalCost: amount,
          });
        } else {
          console.error(`Error fetching price for ${exchange}:`, priceResult.reason);
        }
      };

      processResult(Exchange.Coinbase, coinbasePrice);
      processResult(Exchange.Binance, binancePrice);
      processResult(Exchange.Firi, firiPrice);
      processResult(Exchange.Kraken, krakenPrice);
      processResult(Exchange.NBX, nbxPrice);
      processResult(Exchange.CryptoCom, cryptoComPrice);
      processResult(Exchange.BuyBitcoin, buyBitcoinPrice);

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
            <ResultsTable results={results} isLoading={isLoading} error={error} crypto={CryptoCurrency.BTC} />
          )}
        </div>
      </main>
      <ExchangeOverview />
      <Footer />
    </div>
  );
}
