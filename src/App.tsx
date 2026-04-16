import { useEffect, useRef, useState } from 'react';
import Footer from './components/Footer';
import ComparisonForm from './components/ComparisonForm';
import ExchangeOverview from './components/ExchangeOverview';
import ResultsTable from './components/ResultsTable';
import VippsComparisonSection from './components/VippsComparisonSection';
import PriceChart from './components/PriceChart';
import DetailedComparison from './components/DetailedComparison';
import Overview from './components/Overview';
import { getCoinbasePrice, getBinancePrice, getFiriPrice, getKrakenPrice, getNbxPrice, getBareBitcoinPrice, getRevolutPrice, getCryptoComPrice, getBuyBitcoinPrice, FEES } from './services/api';
import { ComparisonResult, CryptoCurrency, Exchange } from './types';
import { ExternalLink, ShieldCheck, CreditCard, Wallet } from 'lucide-react';

export default function App() {
  const [results, setResults] = useState<ComparisonResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastAmount, setLastAmount] = useState<number | null>(10000);
  const [activeTab, setActiveTab] = useState<'live' | 'analysis'>('live');
  const [currentPage, setCurrentPage] = useState<'home' | 'compare' | 'overview' | 'platforms'>('home');

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

      setResults(newResults);
    } catch (err: any) {
      setError(err.message || 'En ukjent feil oppstod.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    handleCalculate(10000);
  }, []);

  return (
    <div id="app-root" className="min-h-screen bg-white text-slate-900 font-sans">
      <main id="main-content" className="container mx-auto px-4 pt-10 pb-16">
        <div className="max-w-4xl mx-auto">
          {/* Section: Logo and Navigation */}
          <header id="site-header" className="flex flex-col items-center mb-12">
            <div 
              id="logo-container"
              onClick={() => setCurrentPage('home')}
              className="flex items-center gap-3 cursor-pointer group mb-6"
            >
              <div className="bg-orange-600 p-1.5 rounded-xl group-hover:rotate-12 transition-transform shrink-0 shadow-lg shadow-orange-100">
                <span className="text-white text-base font-black italic px-1">₿</span>
              </div>
              <span className="font-bold text-2xl tracking-tighter whitespace-nowrap">KJØPEBITCOIN<span className="text-orange-500">.NO</span></span>
            </div>
            
            <nav id="main-nav" className="flex items-center gap-1 bg-slate-50 p-1 rounded-xl border border-slate-100">
              <button 
                id="nav-home-btn"
                onClick={() => setCurrentPage('home')}
                className={`text-[10px] font-bold uppercase tracking-widest transition-all px-4 py-2 rounded-lg ${currentPage === 'home' ? 'bg-white text-orange-600 shadow-sm border border-slate-100' : 'text-slate-400 hover:text-slate-600'}`}
              >
                Hjem
              </button>
              <button 
                id="nav-compare-btn"
                onClick={() => setCurrentPage('compare')}
                className={`text-[10px] font-bold uppercase tracking-widest transition-all px-4 py-2 rounded-lg ${currentPage === 'compare' ? 'bg-white text-orange-600 shadow-sm border border-slate-100' : 'text-slate-400 hover:text-slate-600'}`}
              >
                Sammenlign
              </button>
              <button 
                id="nav-platforms-btn"
                onClick={() => setCurrentPage('platforms')}
                className={`text-[10px] font-bold uppercase tracking-widest transition-all px-4 py-2 rounded-lg ${currentPage === 'platforms' ? 'bg-white text-orange-600 shadow-sm border border-slate-100' : 'text-slate-400 hover:text-slate-600'}`}
              >
                Plattformer
              </button>
              <button 
                id="nav-overview-btn"
                onClick={() => setCurrentPage('overview')}
                className={`text-[10px] font-bold uppercase tracking-widest transition-all px-4 py-2 rounded-lg ${currentPage === 'overview' ? 'bg-white text-orange-600 shadow-sm border border-slate-100' : 'text-slate-400 hover:text-slate-600'}`}
              >
                Oversikt
              </button>
            </nav>
          </header>

          {/* Page: Home (Landing Page) */}
          {currentPage === 'home' && (
            <div id="home-landing-page" className="space-y-16">
              <section id="hero-landing" className="text-center space-y-6 py-8">
            
                <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight leading-tight">
                  Den enkleste veien til <br /> din første <span className="text-orange-600">Bitcoin</span>
                </h1>
                <p className="text-slate-500 text-lg max-w-2xl mx-auto font-medium">
                  Vi sammenligner priser, gebyrer og sikkerhet hos norske og internasjonale børser, slik at du alltid får mest Bitcoin for pengene dine.
                </p>
                <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
                  <button 
                    onClick={() => setCurrentPage('compare')}
                    className="px-8 py-4 bg-orange-600 text-white font-black text-sm uppercase tracking-widest rounded-2xl hover:bg-orange-700 transition-all hover:scale-105 shadow-xl shadow-orange-100"
                  >
                    Sammenlign Priser Nå
                  </button>
                  <button 
                    onClick={() => setCurrentPage('overview')}
                    className="px-8 py-4 bg-white text-slate-900 border border-slate-200 font-black text-sm uppercase tracking-widest rounded-2xl hover:bg-slate-50 transition-all"
                  >
                    Hvordan kjøpe?
                  </button>
                </div>
              </section>

              {/* Teaser: Mini Comparison */}
              <section id="mini-teaser" className="bg-slate-50 rounded-3xl p-8 border border-slate-100">
                <div className="flex flex-col md:flex-row items-center gap-8">
                  <div className="flex-1 space-y-4">
                    <h2 className="text-2xl font-bold text-slate-900">Se live-priser fra alle børser</h2>
                    <p className="text-slate-600 text-sm">Priser på Bitcoin varierer mellom plattformer. Vi henter realtidsdata fra Coinbase, Binance, Firi og NBX slik at du ser hvem som er billigst akkurat nå.</p>
                    <div className="flex gap-4 items-center">
                      <div className="flex -space-x-2">
                        {[Exchange.Firi, Exchange.NBX, Exchange.Binance].map(ex => (
                          <div key={ex} className="w-8 h-8 rounded-full border-2 border-white bg-white flex items-center justify-center shadow-sm overflow-hidden">
                            <span className="scale-50 font-black text-[8px]">{ex[0]}</span>
                          </div>
                        ))}
                      </div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">+ 5 andre plattformer</span>
                    </div>
                  </div>
                  <div className="w-full md:w-auto">
                    <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 scale-90 md:scale-100">
                      <div className="text-[10px] font-black uppercase text-slate-400 mb-3 tracking-widest">Beste pris akkurat nå</div>
                      <div className="flex items-center gap-4">
                         <div className="text-2xl font-black text-slate-900 font-mono tracking-tighter">
                           {results[0] ? Math.round(results[0].spotPrice).toLocaleString('nb-NO') : '--- ---'} NOK
                         </div>
                         <div className="px-2 py-1 bg-emerald-50 text-emerald-600 text-[10px] font-black rounded-lg">LIVE</div>
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              {/* Grid: Popular Features */}
              <section id="features-landing" className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                  { title: 'Skatteberegning', desc: 'Norske børser som Firi og NBX rapporterer automatisk til Skatteetaten for deg.', icon: ShieldCheck },
                  { title: 'Betal med Vipps', desc: 'Flere børser støtter nå lynrask innbetaling med Vipps for umiddelbart kjøp.', icon: CreditCard },
                  { title: 'Egen lommebok', desc: 'Lær hvordan du tar kontroll over dine coins med en hardware wallet.', icon: Wallet }
                ].map((f, i) => (
                  <div key={i} className="p-8 bg-white border border-slate-100 rounded-3xl hover:border-orange-200 transition-colors group cursor-default">
                    <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center mb-6 text-slate-400 group-hover:text-orange-500 group-hover:bg-orange-50 transition-colors">
                       <f.icon size={24} />
                    </div>
                    <h3 className="text-lg font-bold text-slate-900 mb-2">{f.title}</h3>
                    <p className="text-slate-500 text-sm leading-relaxed">{f.desc}</p>
                  </div>
                ))}
              </section>
            </div>
          )}

          {/* Page: Comparison Tool (The refactored tool page) */}
          {currentPage === 'compare' && (
            <div id="compare-page" className="space-y-8">
              {/* Box: Input Form */}
              <section id="comparison-form-section" className="mb-8">
                <ComparisonForm onCalculate={handleCalculate} isLoading={isLoading} />
              </section>

              {/* Box: View Tabs */}
              <div id="tabs-container" className="flex justify-start mb-8 border-b border-slate-100">
                <div className="flex gap-6">
                  <button
                    id="tab-live-prices"
                    onClick={() => setActiveTab('live')}
                    className={`pb-3 text-[10px] font-bold uppercase tracking-widest transition-all ${
                      activeTab === 'live'
                        ? 'text-slate-900 border-b-2 border-slate-900'
                        : 'text-slate-400 hover:text-slate-600'
                    }`}
                  >
                    Live Priser
                  </button>
                  <button
                    id="tab-market-analysis"
                    onClick={() => setActiveTab('analysis')}
                    className={`pb-3 text-[10px] font-bold uppercase tracking-widest transition-all ${
                      activeTab === 'analysis'
                        ? 'text-slate-900 border-b-2 border-slate-900'
                        : 'text-slate-400 hover:text-slate-600'
                    }`}
                  >
                    Markedsanalyse
                  </button>
                </div>
              </div>

              {/* Content: Active Tab Rendering */}
              {activeTab === 'live' ? (
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
              ) : (
                <div id="market-analysis-content" className="space-y-12">
                  <PriceChart />
                  <DetailedComparison />
                </div>
              )}
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
      <Footer />
    </div>
);
}
