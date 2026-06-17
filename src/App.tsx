import { useEffect, useRef, useState } from 'react';
import Footer from './components/Footer';
import ExchangeOverview from './components/ExchangeOverview';
import ResultsTable from './components/ResultsTable';
import VippsComparisonSection from './components/VippsComparisonSection';
import Overview from './components/Overview';
import FAQSection from './components/FAQSection';
import { ExchangeIcon } from './components/icons';
import CountUp from 'react-countup';
import { getCoinbasePrice, getBinancePrice, getFiriPrice, getKrakenPrice, getNbxPrice, getBareBitcoinPrice, getRevolutPrice, getCryptoComPrice, getBuyBitcoinPrice, FEES } from './services/api';
import { ComparisonResult, CryptoCurrency, Exchange } from './types';
import { ExternalLink, Edit2, Save } from 'lucide-react';
import { useContent } from './contexts/ContentContext';
import EditableText from './components/EditableText';

export default function App() {
  const { isEditMode, setIsEditMode, saveContent } = useContent();
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

  const topResults = [...results].sort((a, b) => b.cryptoAmount - a.cryptoAmount).slice(0, 3);

  return (
    <div id="app-root" className="min-h-screen bg-white text-slate-900 font-sans">
      <main id="main-content" className="container mx-auto px-3 pt-10 pb-16">
        <div className="max-w-4xl mx-auto">
          {/* Section: Logo (Navigation moved to footer) */}
          <header id="site-header" className="flex flex-col items-center mb-5">
            <div 
              id="logo-container"
              onClick={() => setCurrentPage('home')}
              className="flex items-center gap-3 cursor-pointer group"
            >
              <div className="bg-orange-600 p-1.5 rounded-xl group-hover:rotate-12 transition-transform shrink-0 shadow-lg shadow-orange-100">
                <span className="text-white text-base font-black italic px-1">₿</span>
              </div>
              <span className="font-bold text-l tracking-tighter whitespace-nowrap">KJØPEBITCOIN<span className="text-orange-500">.NO</span></span>
            </div>
          </header>

          {/* Page: Home (Landing / Analysis) */}
          {currentPage === 'home' && (
            <div id="home-page" className="space-y-2">
              {/* Hero Section */}
              <section id="home-hero" className="text-center space-y-2 py-8">
                <h1 className="text-3xl font-black sm:text-4xl text-slate-900 uppercase">
                  <EditableText contentKey="homeHeroTitle" />
                </h1>
                <div className="max-w-lg mx-auto">
                    <EditableText contentKey="homeHeroDescription" className="text-slate-500 text-sm font-medium leading-relaxed text-center" multiline />
                </div>
              </section>

              {/* Quick View Table */}
              <section id="quick-view-table" className="space-y-6">
                <div className="flex justify-between items-end">
                  <div className="space-y-1">
                    <h2 className="text-xl font-bold tracking-tight">
                        <EditableText contentKey="comparePriceTitle" />
                    </h2>
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


              

              {/* Details & FAQ Section */}
              <div id="details-faq-section" className="pt-16 border-t border-slate-100 space-y-16">
                <FAQSection />
              </div>
            </div>
          )}

{/* Top Highlights Cards */}
              {topResults.length > 0 && !isLoading && (
                <section id="best-price-highlights" className="pb-4">
                  <div className="flex gap-3 overflow-x-auto pb-4 px-1 scrollbar-hide -mx-1 sm:mx-0 sm:grid sm:grid-cols-3 sm:overflow-visible">
                    {topResults.map((result, index) => (
                      <div 
                        key={result.exchange}
                        className={`min-w-[210px] sm:min-w-0 bg-white border ${index === 0 ? 'border-orange-200 bg-orange-50/10' : 'border-slate-100'} p-4 rounded-xl shadow-sm space-y-3 group transition-all hover:shadow-md`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className="scale-[1.0] shrink-0">
                              <ExchangeIcon exchange={result.exchange} size={28} />
                            </div>
                            <span className="text-[15px] font-black text-slate-900 truncate">{result.exchange}</span>
                          </div>
                          {index === 0 && (
                            <span className="text-[9px] font-black bg-emerald-50 text-emerald-600 px-2 py-0.5 rounded uppercase tracking-widest border border-emerald-100">Best pris</span>
                          )}
                        </div>
                        <div className="space-y-0.5">
                          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Kurs nå</p>
                          <div className="text-[17px] font-black text-slate-900 font-mono tracking-tighter">
                            <CountUp end={result.spotPrice} decimals={0} duration={1.5} separator=" " decimal="," />
                            <span className="text-[12px] text-slate-400 font-sans ml-1">NOK</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              )}

          {/* Page: Live Prices (Comparison Tool) */}
          {currentPage === 'live' && (
            <div id="live-prices-page" className="space-y-16">
              <div className="text-center mb-10">
                <h2 className="text-2xl font-black tracking-tight uppercase">
                    <EditableText contentKey="livePricesTitle" />
                </h2>
                <div className="mt-1">
                    <EditableText contentKey="livePricesDescription" className="text-xs font-bold text-slate-400 uppercase tracking-widest" />
                </div>
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
      
      {/* Edit Mode Button - Bottom Right */}
      <div className="fixed bottom-4 right-4 z-50">
        {!isEditMode ? (
          <button 
            onClick={() => setIsEditMode(true)}
            className="flex items-center gap-1 text-[10px] text-slate-400 font-bold uppercase tracking-widest hover:text-slate-600 transition-colors bg-white/80 backdrop-blur-sm px-2 py-1 rounded"
          >
            <Edit2 size={10} /> Endre
          </button>
        ) : (
          <button 
            onClick={saveContent}
            className="flex items-center gap-1 text-[10px] text-white font-bold uppercase tracking-widest bg-emerald-600 hover:bg-emerald-700 transition-colors px-3 py-1.5 rounded-full shadow-lg"
          >
            <Save size={10} /> Lagre endringer
          </button>
        )}
      </div>

      <Footer setCurrentPage={setCurrentPage} currentPage={currentPage} />
    </div>
);
}
