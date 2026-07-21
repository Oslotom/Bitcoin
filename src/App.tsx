import { useEffect, useRef, useState } from 'react';
import Footer from './components/Footer';
import ExchangeOverview from './components/ExchangeOverview';
import ResultsTable from './components/ResultsTable';
import VippsComparisonSection from './components/VippsComparisonSection';
import Overview from './components/Overview';
import FAQSection from './components/FAQSection';
import { ExchangeIcon } from './components/icons';
import CountUp from 'react-countup';
import NorwayExchanges from './components/NorwayExchanges';
import ContactPage from './components/ContactPage';
import AllExchanges from './components/AllExchanges';
import BitcoinCalculator from './components/BitcoinCalculator';
import FiriVsNbx from './components/FiriVsNbx';
import { getCoinbasePrice, getBinancePrice, getFiriPrice, getKrakenPrice, getNbxPrice, getBareBitcoinPrice, getRevolutPrice, getCryptoComPrice, getBuyBitcoinPrice, FEES } from './services/api';
import { ComparisonResult, CryptoCurrency, Exchange } from './types';
import { ExternalLink, Edit2, Save, Menu, X, Zap, Globe, CreditCard } from 'lucide-react';
import { useContent } from './contexts/ContentContext';
import EditableText from './components/EditableText';
import { motion, AnimatePresence } from 'motion/react';

export default function App() {
  const { isEditMode, setIsEditMode, saveContent } = useContent();
  const [results, setResults] = useState<ComparisonResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastAmount, setLastAmount] = useState<number | null>(10000);
  const [currentPage, setCurrentPage] = useState<'home' | 'live' | 'overview' | 'platforms' | 'norway' | 'contact' | 'all'>('home');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
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
    // Basic routing logic for SEO paths
    const path = window.location.pathname;
    if (path === '/sammenlign') setCurrentPage('live');
    else if (path === '/alle-borser') setCurrentPage('all');
    else if (path === '/norske-borser') setCurrentPage('norway');
    else if (path === '/guide') setCurrentPage('overview');
    else if (path === '/kontakt') setCurrentPage('contact');

    if (didInitCalculate.current) return;
    didInitCalculate.current = true;
    handleCalculate(10000);
  }, []);

  const navigateTo = (page: 'home' | 'live' | 'overview' | 'platforms' | 'norway' | 'contact' | 'all') => {
    setCurrentPage(page);
    setIsMobileMenuOpen(false);
    window.scrollTo(0, 0);
    
    // Update URL without reloading for SEO
    const paths: Record<string, string> = {
      home: '/',
      live: '/sammenlign',
      all: '/alle-borser',
      norway: '/norske-borser',
      overview: '/guide',
      contact: '/kontakt'
    };
    if (paths[page]) {
      window.history.pushState({}, '', paths[page]);
    }
  };

  return (
    <div id="app-root" className="min-h-screen bg-white text-slate-900 font-sans">
      {/* Global Background Decorations */}
      <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden opacity-[0.04]">
        <div className="absolute -top-[10%] -left-[20%] w-[140%] h-[600px] bg-gradient-to-br from-brand via-transparent to-transparent rotate-[-15deg] transform-gpu" />
        <div className="absolute top-[30%] -right-[20%] w-[120%] h-[800px] bg-gradient-to-bl from-accent via-transparent to-transparent rotate-[12deg] transform-gpu" />
        <div className="absolute bottom-[10%] -left-[10%] w-[100%] h-[500px] bg-gradient-to-tr from-brand via-transparent to-transparent rotate-[-8deg] transform-gpu" />
      </div>

      {/* Header / Nav */}
      <header className="sticky top-0 z-40 w-full bg-transparent backdrop-blur-s" style={{ marginBottom: '-20px' }}>
        <div className="max-w-5xl mx-auto px-4 h-20 flex items-center justify-between">
          <div 
            onClick={() => navigateTo('home')}
            className="flex items-center gap-2 cursor-pointer group"
          >
            <div className="w-8 h-8 bg-brand rounded-lg flex items-center justify-center text-white font-black text-lg shadow-lg shadow-blue-100 group-hover:scale-105 transition-transform">
              ₿
            </div>
            <span className="font-display font-bold text-lg tracking-tight text-slate-900">
              KjøpeBitcoin<span className="text-brand">.no</span>
            </span>
          </div>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8">
            {[
              { id: 'live', label: 'Sammenlign Priser' },
              { id: 'all', label: 'Alle' },
              { id: 'norway', label: 'Børser i Norge' },
              { id: 'overview', label: 'Lær Mer' },
              { id: 'contact', label: 'Kontakt' }
            ].map((item) => (
              <button 
                key={item.id}
                onClick={() => navigateTo(item.id as any)}
                className={`text-sm font-semibold transition-colors ${
                  currentPage === item.id ? 'text-brand' : 'text-slate-500 hover:text-brand'
                }`}
              >
                {item.label}
              </button>
            ))}
          </nav>

          {/* Mobile Menu Toggle */}
          <button 
            onClick={() => setIsMobileMenuOpen(true)}
            className="md:hidden p-2 text-slate-500 hover:text-slate-900 transition-colors"
          >
            <Menu size={24} />
          </button>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[50] md:hidden"
            />
            <motion.div 
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 bottom-0 w-[280px] bg-white z-[51] shadow-2xl md:hidden flex flex-col"
            >
              <div className="p-6 flex items-center justify-between border-b border-slate-50">
                <span className="font-black text-[10px] uppercase tracking-widest text-slate-400">Meny</span>
                <button 
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-2 text-slate-400 hover:text-slate-900 transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-6 space-y-2">
                {[
                  { id: 'home', label: 'Forside', icon: '🏠' },
                  { id: 'live', label: 'Live Priser', icon: '📊' },
                  { id: 'all', label: 'Alle Børser', icon: '🌎' },
                  { id: 'norway', label: 'Bitcoin i Norge', icon: '🇳🇴' },
                  { id: 'overview', label: 'Guide & Kunnskap', icon: '📚' },
                  { id: 'contact', label: 'Kontakt oss', icon: '✉️' }
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => navigateTo(item.id as any)}
                    className={`w-full flex items-center gap-4 px-4 py-4 rounded-2xl text-sm font-bold transition-all ${
                      currentPage === item.id 
                        ? 'bg-orange-50 text-orange-600' 
                        : 'text-slate-600 hover:bg-slate-50 active:scale-[0.98]'
                    }`}
                  >
                    <span className="text-xl">{item.icon}</span>
                    {item.label}
                  </button>
                ))}
              </div>

              <div className="p-6 border-t border-slate-50">
                <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em] text-center">
                  © 2026 KJØPEBITCOIN.NO
                </p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <main id="main-content" className="flex-1">
        {currentPage === 'home' && (
          <div className="animate-fade-in">
            {/* Hero Section */}
            <section className="relative pt-20 pb-12 overflow-hidden">
              <div className="max-w-5xl mx-auto px-4 text-center space-y-8">
            
                
                <h1 className="text-5xl md:text-6xl font-display font-bold tracking-tight text-slate-900 leading-[1.1]">
                  Finn beste <span className="text-brand">Bitcoin kurs</span><br />
                  og pris i Norge
                </h1>
                
                <p className="max-w-2xl mx-auto text-lg md:text-lg text-slate-600 leading-relaxed font-medium">
                  Planlegger du å kjøpe bitcoin? Vi sammenligner priser, gebyrer og spredning på tvers av alle børser i Norge.
                </p>


              </div>
            </section>

            {/* Quick Features Bar */}
            <section className="max-w-5xl mx-auto px-1">
              <div className="bg-white/50 py-2 px-1 flex flex-wrap justify-center gap-x-2 gap-y-2">
                <div className="flex items-center gap-2.5">
                  <div className="bg-blue-50 p-1.5 rounded-lg text-brand">
                    <Zap size={16} fill="currentColor" className="opacity-20" />
                  </div>
                  <span className="text-sm font-bold text-slate-700">Live kurs</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <div className="bg-blue-50 p-1.5 rounded-lg text-brand">
                    <Globe size={16} />
                  </div>
                  <span className="text-sm font-bold text-slate-700">30 børser</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <div className="bg-blue-50 p-1.5 rounded-lg text-brand">
                    <CreditCard size={16} />
                  </div>
                  <span className="text-sm font-bold text-slate-700">Se gebyrer</span>
                </div>
              </div>
            </section>

    

            {/* Preview Section */}
            <section className="py-14 max-w-5xl mx-auto px-4 space-y-8">
              <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                <div className="space-y-2">
                  <h2 className="text-3xl font-display font-bold tracking-tight">Live Bitcoin priser</h2>
                  <p className="text-slate-500 font-medium">Prisene blir automatisk hentet</p>
                </div>
            
              </div>
              
              <div className="card-premium overflow-hidden">
                <ResultsTable results={results} isLoading={isLoading} error={error} crypto={CryptoCurrency.BTC} />
              </div>
            </section>
          </div>
        )}

          {/* Page: Live Prices (Comparison Tool) */}
          {currentPage === 'live' && (
            <div id="live-prices-page" className="space-y-16 animate-fade-in">
              <div className="text-center max-w-2xl mx-auto space-y-4">
                <h2 className="text-4xl font-display font-bold tracking-tight">Live Prissammenligning</h2>
                <p className="text-slate-600 font-medium leading-relaxed">
                  Vi henter priser direkte fra børsene og regner ut nøyaktig hvor mye krypto du sitter igjen med etter alle gebyrer.
                </p>
              </div>

              <div id="live-prices-content" className="space-y-12">
                <div className="card-premium p-1">
                  <ResultsTable results={results} isLoading={isLoading} error={error} crypto={CryptoCurrency.BTC} />
                </div>
                
                <div className="flex flex-col md:flex-row gap-12 pt-8">
                  <div className="flex-1">
                    <VippsComparisonSection results={results} amount={lastAmount} />
                  </div>
                  <div className="md:w-80 space-y-6">
                    <div className="card-premium p-6 bg-slate-900 text-white border-none">
                      <h3 className="text-xl font-bold font-display mb-4">Hvorfor sammenligne?</h3>
                      <p className="text-slate-300 text-sm leading-relaxed mb-6">
                        Forskjellen mellom den billigste og dyreste plattformen kan være over 5% på små beløp. Det betyr 500 kr spart per 10 000 kr du investerer.
                      </p>
                      <button 
                        onClick={() => navigateTo('overview')}
                        className="w-full py-3 bg-white text-slate-900 rounded-xl font-bold text-sm hover:bg-slate-100 transition-colors"
                      >
                        Lær mer om gebyrer
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Bitcoin Calculator Section */}
              <div className="max-w-5xl mx-auto px-4 pb-12">
                <BitcoinCalculator results={results} isLoading={isLoading} />
              </div>

              {/* Firi vs NBX Section */}
              <div className="max-w-5xl mx-auto px-4 pb-20">
                <FiriVsNbx results={results} />
              </div>

              {/* SEO Content Section */}
              <div className="max-w-4xl mx-auto px-4 pb-24 border-t border-slate-50 pt-20">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                  <div className="space-y-4">
                    <h3 className="text-xl font-bold text-slate-900">Kjøpe Bitcoin i Norge</h3>
                    <p className="text-sm text-slate-500 leading-relaxed">
                      Det har aldri vært enklere å <strong>kjøpe bitcoin i Norge</strong>. Med BankID og norske børser som Firi og NBX kan du handle trygt på få minutter. Vår tjeneste overvåker markedet slik at du alltid finner den beste <strong>bitcoin prisen</strong> tilgjengelig akkurat nå.
                    </p>
                  </div>
                  <div className="space-y-4">
                    <h3 className="text-xl font-bold text-slate-900">Live Bitcoin kurs</h3>
                    <p className="text-sm text-slate-500 leading-relaxed">
                      Følg med på <strong>Bitcoin kurs</strong> live og se hvordan prisen endrer seg på tvers av globale og norske markeder. Ved å sammenligne <strong>Bitcoin norge</strong> priser kan du spare betydelige beløp på handelsgebyrer og spread.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Page: Platforms Overview */}
          {currentPage === 'platforms' && <div className="animate-fade-in"><ExchangeOverview /></div>}

          {/* Page: All Exchanges */}
          {currentPage === 'all' && <div className="animate-fade-in max-w-5xl mx-auto px-4 py-12"><AllExchanges /></div>}

          {/* Page: Knowledge Overview */}
          {currentPage === 'overview' && <div className="animate-fade-in"><Overview /></div>}

          {/* Page: Norway Exchanges */}
          {currentPage === 'norway' && <div className="animate-fade-in"><NorwayExchanges /></div>}

          {/* Page: Contact */}
          {currentPage === 'contact' && <div className="animate-fade-in"><ContactPage /></div>}
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

      <Footer setCurrentPage={navigateTo as any} currentPage={currentPage} />
    </div>
);
}
