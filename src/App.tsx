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
import { getCoinbasePrice, getBinancePrice, getFiriPrice, getKrakenPrice, getNbxPrice, getBareBitcoinPrice, getRevolutPrice, getCryptoComPrice, getBuyBitcoinPrice, FEES } from './services/api';
import { ComparisonResult, CryptoCurrency, Exchange } from './types';
import { ExternalLink, Edit2, Save, Menu, X } from 'lucide-react';
import { useContent } from './contexts/ContentContext';
import EditableText from './components/EditableText';
import { motion, AnimatePresence } from 'motion/react';

export default function App() {
  const { isEditMode, setIsEditMode, saveContent } = useContent();
  const [results, setResults] = useState<ComparisonResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastAmount, setLastAmount] = useState<number | null>(10000);
  const [currentPage, setCurrentPage] = useState<'home' | 'live' | 'overview' | 'platforms' | 'norway' | 'contact'>('home');
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
    if (didInitCalculate.current) return;
    didInitCalculate.current = true;
    handleCalculate(10000);
  }, []);

  const navigateTo = (page: typeof currentPage) => {
    setCurrentPage(page);
    setIsMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div id="app-root" className="min-h-screen bg-white text-slate-900 font-sans">
      {/* Header / Nav */}
      <header className="sticky top-0 z-40 w-full bg-white/80 backdrop-blur-md border-b border-slate-100">
        <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
          <div 
            onClick={() => navigateTo('home')}
            className="flex items-center gap-2 cursor-pointer group"
          >
            <div className="w-8 h-8 bg-orange-600 rounded-xl flex items-center justify-center text-white font-black text-lg shadow-lg shadow-orange-100 group-hover:scale-110 transition-transform">
              ₿
            </div>
            <span className="font-bold text-lg tracking-tighter uppercase whitespace-nowrap">
              KJØPEBITCOIN<span className="text-orange-500">.NO</span>
            </span>
          </div>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-6">
            <button 
              onClick={() => navigateTo('live')}
              className={`text-xs font-bold uppercase tracking-widest transition-colors ${currentPage === 'live' ? 'text-orange-600' : 'text-slate-400 hover:text-slate-900'}`}
            >
              Live Priser
            </button>
            <button 
              onClick={() => navigateTo('norway')}
              className={`text-xs font-bold uppercase tracking-widest transition-colors ${currentPage === 'norway' ? 'text-orange-600' : 'text-slate-400 hover:text-slate-900'}`}
            >
              I Norge
            </button>
            <button 
              onClick={() => navigateTo('overview')}
              className={`text-xs font-bold uppercase tracking-widest transition-colors ${currentPage === 'overview' ? 'text-orange-600' : 'text-slate-400 hover:text-slate-900'}`}
            >
              Guide
            </button>
            <button 
              onClick={() => navigateTo('contact')}
              className={`text-xs font-bold uppercase tracking-widest transition-colors ${currentPage === 'contact' ? 'text-orange-600' : 'text-slate-400 hover:text-slate-900'}`}
            >
              Kontakt
            </button>
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

      <main id="main-content" className="container mx-auto px-3 pt-6 pb-16">
        <div className="max-w-4xl mx-auto">
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

          {/* Page: Norway Exchanges */}
          <div id="norway-page">
            {currentPage === 'norway' && <NorwayExchanges />}
          </div>

          {/* Page: Contact */}
          <div id="contact-page">
            {currentPage === 'contact' && <ContactPage />}
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
