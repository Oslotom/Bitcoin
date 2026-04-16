import { useEffect, useRef, useState } from 'react';
import Footer from './components/Footer';
import ExchangeOverview from './components/ExchangeOverview';
import ResultsTable from './components/ResultsTable';
import VippsComparisonSection from './components/VippsComparisonSection';
import PriceChart from './components/PriceChart';
import DetailedComparison from './components/DetailedComparison';
import Overview from './components/Overview';
import { getCoinbasePrice, getBinancePrice, getFiriPrice, getKrakenPrice, getNbxPrice, getBareBitcoinPrice, getRevolutPrice, getCryptoComPrice, getBuyBitcoinPrice, FEES } from './services/api';
import { ComparisonResult, CryptoCurrency, Exchange } from './types';
import { ExternalLink } from 'lucide-react';

export default function App() {
  const [results, setResults] = useState<ComparisonResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastAmount, setLastAmount] = useState<number | null>(10000);
  const [currentPage, setCurrentPage] = useState<'home' | 'live' | 'overview' | 'platforms'>('home');
  const didInitCalculate = useRef(false);

  const handleCalculate = async (amount: number) => {
    setIsLoading(true);
    setError(null);
    setResults([]);
    setLastAmount(amount);

    try {
      const [coinbasePrice, binancePrice, firiPrice, krakenPrice, nbxPrice, bareBitcoinPrice, revolutPrice, cryptoComPrice, buyBitcoinPrice] = await Promise.allSettled([
        getCoinbasePrice(CryptoCurrency.BTC),
        getBinancePrice(CryptoCurrency.BTC),
        getFiriPrice(),
        getKrakenPrice(),
        getNbxPrice(),
        getBareBitcoinPrice(),
        getRevolutPrice(),
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
      processResult(Exchange.BareBitcoin, bareBitcoinPrice);
      processResult(Exchange.Revolut, revolutPrice);
      processResult(Exchange.CryptoCom, cryptoComPrice);
      processResult(Exchange.BuyBitcoin, buyBitcoinPrice);

      if (newResults.length === 0) {
        throw new Error('Kunne ikke hente priser fra noen av børsene. Prøv igjen senere.');
      }

      setResults(newResults);
    } catch (err: any) {
      setError(err.message || 'En ukjent feil oppstod.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (didInitCalculate.current) return;
    didInitCalculate.current = true;
    handleCalculate(10000);
  }, []);

  return (
    <div id="app-root" className="min-h-screen bg-white text-slate-900 font-sans">
      <main id="main-content" className="container mx-auto px-4 pt-10 pb-16">
        <div className="max-w-4xl mx-auto">
          {/* Section: Logo (Navigation moved to footer) */}
          <header id="site-header" className="flex flex-col items-center mb-10">
            <div 
              id="logo-container"
              onClick={() => setCurrentPage('home')}
              className="flex items-center gap-3 cursor-pointer group"
            >
              <div className="bg-orange-600 p-1.5 rounded-xl group-hover:rotate-12 transition-transform shrink-0 shadow-lg shadow-orange-100">
                <span className="text-white text-base font-black italic px-1">₿</span>
              </div>
              <span className="font-bold text-xl tracking-tighter whitespace-nowrap">KJØPEBITCOIN<span className="text-orange-500">.NO</span></span>
            </div>
          </header>

          {/* Page: Home (Landing / Analysis) */}
          {currentPage === 'home' && (
            <div id="home-page" className="space-y-2">
              {/* Hero Section */}
              <section id="home-hero" className="text-center space-y-2 py-8">
                <h1 className="text-3xl font-black tracking-tighter sm:text-4xl text-slate-900 uppercase">
                  Finn den beste prisen på <span className="text-orange-600">Bitcoin</span>
                </h1>
                <p className="text-slate-500 max-w-lg mx-auto text-sm font-medium leading-relaxed">
                  Vi henter live kurser og gebyrer fra alle norske og internasjonale børser, slik at du alltid vet hvor du får mest for pengene.
                </p>
              </section>

              {/* Quick View Table */}
              <section id="quick-view-table" className="space-y-6">
                <div className="flex justify-between items-end">
                  <div className="space-y-1">
                    <h2 className="text-lg font-bold tracking-tight">Live markedsscan</h2>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Utvalgte børser • 10.000 kr beløp</p>
                  </div>
                  <button 
                    onClick={() => setCurrentPage('live')}
                    className="text-[10px] font-black uppercase tracking-widest text-orange-600 hover:text-orange-700"
                  >
                    Full oversikt →
                  </button>
                </div>
                <ResultsTable results={results} isLoading={isLoading} error={error} crypto={CryptoCurrency.BTC} />
              </section>

              {/* Section: Market Analysis */}
              <div id="market-analysis-content" className="pt-16 border-t border-slate-100 space-y-12">
                <div className="text-center max-w-xl mx-auto">
                  <h2 className="text-xl font-bold tracking-tight mb-2">Markedsanalyse</h2>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Trender og grafisk oversikt</p>
                </div>
                <PriceChart />
                <DetailedComparison />
              </div>
            </div>
          )}

          {/* Page: Live Prices (Comparison Tool) */}
          {currentPage === 'live' && (
            <div id="live-prices-page" className="space-y-16">
              <div className="text-center mb-10">
                <h2 className="text-2xl font-black tracking-tight uppercase">Live Priser</h2>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Sanntidssammenligning av børser</p>
              </div>

              <div id="live-prices-content" className="space-y-16">
                <ResultsTable results={results} isLoading={isLoading} error={error} crypto={CryptoCurrency.BTC} />
                
                {/* CTA Box */}
                <div id="cta-explanation" className="text-center bg-white p-6 rounded-2xl border border-slate-100 shadow-sm max-w-2xl mx-auto">
                  <p className="text-slate-600 mb-4 font-medium text-sm">Vil du ha en dypere forklaring på de ulike måtene å kjøpe på?</p>
                  <button 
                    onClick={() => setCurrentPage('overview')}
                    className="inline-flex items-center gap-2 px-6 py-3 bg-slate-900 text-white text-xs font-black uppercase tracking-widest rounded-xl hover:bg-slate-800 transition-all active:scale-95"
                  >
                    Se vår fulle oversikt <ExternalLink size={14} />
                  </button>
                </div>

                <VippsComparisonSection results={results} amount={lastAmount} />
              </div>
            </div>
          )}

          {/* Page: Platforms Overview */}
          <div id="platforms-page">
            {currentPage === 'platforms' && <ExchangeOverview />}
          </div>

          {/* Page: Knowledge Overview */}
          <div id="overview-page">
            {currentPage === 'overview' && <Overview />}
          </div>
        </div>
      </main>
      <Footer setCurrentPage={setCurrentPage} currentPage={currentPage} />
    </div>
);
}
