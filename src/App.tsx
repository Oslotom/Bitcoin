import { useEffect, useRef, useState } from 'react';
import Footer from './components/Footer';
import ResultsTable from './components/ResultsTable';
import Overview from './components/Overview';
import FAQSection from './components/FAQSection';
import { feeRows } from './components/FeeOverview';
import BitcoinKursPage from './components/pages/BitcoinKursPage';
import FiriVsNbxPage from './components/pages/FiriVsNbxPage';
import VippsPage from './components/pages/VippsPage';
import TaxPage from './components/pages/TaxPage';
import AboutPage from './components/pages/AboutPage';
import { ExchangeIcon } from './components/icons';
import CountUp from 'react-countup';
import NorwayExchanges from './components/NorwayExchanges';
import ExchangePriceChart from './components/ExchangePriceChart';
import HeroTableIllustration from './components/HeroTableIllustration';
import { getCoinbasePrice, getBinancePrice, getFiriPrice, getKrakenPrice, getNbxPrice, getBareBitcoinPrice, getRevolutPrice, getCryptoComPrice, getBuyBitcoinPrice, FEES } from './services/api';
import { ComparisonResult, CryptoCurrency, Exchange } from './types';
import { ExternalLink, Edit2, Save, Menu, X, ArrowUpRight, ArrowRight } from 'lucide-react';
import { useContent } from './contexts/ContentContext';
import EditableText from './components/EditableText';
import { motion, AnimatePresence } from 'motion/react';
import { PAGE_PATHS, PAGE_TITLES, pageFromPath, type Page } from './routes';

// initialPage settes ved forhåndsrendring på byggetidspunktet (der window ikke finnes)
export default function App({ initialPage }: { initialPage?: Page }) {
  const { isEditMode, setIsEditMode, saveContent } = useContent();
  const [results, setResults] = useState<ComparisonResult[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<Page>(() => initialPage ?? pageFromPath(window.location.pathname));
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const didInitCalculate = useRef(false);

  useEffect(() => {
    if (!isMobileMenuOpen) return;
    const previousFocus = document.activeElement as HTMLElement | null;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const controls = (): HTMLElement[] => mobileMenuRef.current ? Array.from(mobileMenuRef.current.querySelectorAll<HTMLElement>('a[href], button')) : [];
    controls()[0]?.focus();
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setIsMobileMenuOpen(false);
      if (event.key !== 'Tab') return;
      const items = controls();
      const first = items[0];
      const last = items[items.length - 1];
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus(); }
    };
    document.addEventListener('keydown', onKeyDown);
    const desktop = window.matchMedia('(min-width: 1024px)');
    const closeOnDesktop = () => { if (desktop.matches) setIsMobileMenuOpen(false); };
    desktop.addEventListener('change', closeOnDesktop);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener('keydown', onKeyDown);
      desktop.removeEventListener('change', closeOnDesktop);
      previousFocus?.focus();
    };
  }, [isMobileMenuOpen]);

  const handleCalculate = async (amount: number) => {
    setIsLoading(true);
    setError(null);
    setResults([]);

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
          if (!Number.isFinite(spotPrice) || spotPrice <= 0) {
            console.warn(`Invalid price for ${exchange}`);
            return;
          }
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
    const onPopState = () => setCurrentPage(pageFromPath(window.location.pathname));
    window.addEventListener('popstate', onPopState);

    if (!didInitCalculate.current) {
      didInitCalculate.current = true;
      handleCalculate(10000);
    }
    return () => window.removeEventListener('popstate', onPopState);
  }, []);

  useEffect(() => {
    const title = PAGE_TITLES[currentPage];
    if (title) document.title = title;
  }, [currentPage]);

  const navigateTo = (page: Page, event?: { preventDefault: () => void }) => {
    const path = PAGE_PATHS[page];
    // Load the prerendered document, including its canonical and JSON-LD.
    // For links, preserve native navigation (including Ctrl/Cmd-click).
    if (event) return;
    if (path && path !== window.location.pathname) {
      window.location.assign(path);
    }
  };

  return (
    <div id="app-root" className="min-h-screen bg-white text-slate-900 font-sans">
      {/* Header / Nav */}
      <header className="sticky top-0 z-40 w-full border-b border-slate-200 bg-white/95 backdrop-blur-sm">
        <div className="site-container h-16 flex items-center justify-between">
          <a
            href="/"
            onClick={(e) => navigateTo('home', e)}
            aria-label="KjøpeBitcoin.no – forside"
            className="flex items-center gap-2 cursor-pointer group"
          >
            <div className="w-8 h-8 bg-brand rounded-lg flex items-center justify-center text-white font-bold text-lg ">
              ₿
            </div>
            <span className="font-display font-bold text-lg tracking-tight text-slate-900">
              KjøpeBitcoin<span className="text-brand">.no</span>
            </span>
          </a>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-5">
            {[
              { id: 'price', label: 'Bitcoin kurs' },
              { id: 'norway', label: 'Børser i Norge' },
              { id: 'firiNbx', label: 'Firi vs NBX' },
              { id: 'overview', label: 'Guide' },
              { id: 'tax', label: 'Skatt' },
              { id: 'about', label: 'Om oss' }
            ].map((item) => (
              <a
                key={item.id}
                href={PAGE_PATHS[item.id as Page]}
                onClick={(e) => navigateTo(item.id as Page, e)}
                aria-current={currentPage === item.id ? 'page' : undefined}
                className={`text-sm font-semibold transition-colors ${
                  currentPage === item.id ? 'text-brand' : 'text-slate-500 hover:text-brand'
                }`}
              >
                {item.label}
              </a>
            ))}
          </nav>

          {/* Mobile Menu Toggle */}
          <button 
            onClick={() => setIsMobileMenuOpen(true)}
            aria-label="Åpne meny"
            aria-expanded={isMobileMenuOpen}
            aria-controls="mobile-navigation"
            className="lg:hidden p-2 text-slate-500 hover:text-slate-900 transition-colors"
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
              className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[50] lg:hidden"
            />
            <motion.div 
              initial={{ x: '100%' }}
              ref={mobileMenuRef}
              id="mobile-navigation"
              role="dialog"
              aria-modal="true"
              aria-label="Navigasjon"
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 bottom-0 w-[280px] bg-white z-[51] shadow-2xl lg:hidden flex flex-col"
            >
              <div className="p-6 flex items-center justify-between border-b border-slate-50">
                <span className="text-sm font-semibold text-slate-700">Meny</span>
                <button 
                  onClick={() => setIsMobileMenuOpen(false)}
                  aria-label="Lukk meny"
                  className="p-2 text-slate-400 hover:text-slate-900 transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-6 space-y-2">
                {[
                  { id: 'home', label: 'Forside' },
                  { id: 'price', label: 'Bitcoin kurs i dag' },
                  { id: 'norway', label: 'Bitcoin i Norge' },
                  { id: 'firiNbx', label: 'Firi vs NBX' },
                  { id: 'vipps', label: 'Kjøp med Vipps' },
                  { id: 'overview', label: 'Guide & Kunnskap' },
                  { id: 'tax', label: 'Skatt på Bitcoin' },
                  { id: 'about', label: 'Om oss og kontakt' }
                ].map((item) => (
                  <a
                    key={item.id}
                    href={PAGE_PATHS[item.id as Page]}
                    onClick={(e) => navigateTo(item.id as Page, e)}
                aria-current={currentPage === item.id ? 'page' : undefined}
                    className={`w-full flex items-center gap-4 px-4 py-4 rounded-2xl text-sm font-semibold transition-colors ${
                      currentPage === item.id 
                        ? 'bg-brand-soft text-brand'
                        : 'text-slate-600 hover:bg-slate-50 active:scale-[0.98]'
                    }`}
                  >
                    {item.label}
                  </a>
                ))}
              </div>

              <div className="p-6 border-t border-slate-50">
                <p className="text-xs text-slate-500 text-center">
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
            <section className="landing-hero overflow-hidden">
              <div className="site-container grid items-center gap-12 lg:grid-cols-[1.05fr_1fr] py-12 sm:py-16 lg:py-20">
                <div className="space-y-6">
                  <p className="inline-flex items-center gap-2 rounded-full border border-indigo-100 bg-white px-3 py-1.5 text-xs font-medium text-slate-600"><span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-brand" />{feeRows().length} børser. Én oversikt.</p>
                  <h1 className="hero-heading">Kjøpe Bitcoin<br /><span className="text-brand">i Norge.</span></h1>
                  <p className="max-w-md text-base sm:text-lg leading-relaxed text-slate-600">Sammenlign kurs og gebyrer.<br className="hidden sm:block" /> Finn ut hvor du får mer for pengene.</p>
                  <div className="flex flex-wrap items-center gap-3">
                    <a href="#kjop-bitcoin" className="btn-primary">Sammenlign børser <ArrowRight size={16} /></a>
                    <a href={PAGE_PATHS.overview} className="inline-flex min-h-11 items-center gap-1.5 px-2 text-sm font-semibold text-slate-600 hover:text-brand">Ny med Bitcoin? <ArrowUpRight size={15} /></a>
                  </div>
                  <p className="text-xs text-slate-500">Du velger børs. Vi gjør kostnadene synlige.</p>
                </div>
                <HeroTableIllustration />
              </div>
            </section>

            {/* Preview Section */}
            <section id="kjop-bitcoin" className="site-container py-10 sm:py-12 space-y-6 scroll-mt-20">
              <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                <div className="space-y-2">
                  <h2 className="section-title">Finn din Bitcoin-børs.</h2>
                  <p className="text-slate-500 font-medium">Kurs, gebyrer og beregnet kjøpspris – side om side.</p>
                </div>
            
              </div>
              
              <div className="overflow-hidden">
                <ResultsTable results={results} isLoading={isLoading} error={error} crypto={CryptoCurrency.BTC} compact />
              </div>

              <p className="text-center text-sm text-slate-500">
                <a href="#prisforskjell" className="font-semibold text-brand hover:underline">Se prisforskjellene i grafen</a>
              </p>
            </section>

            <section className="site-container pb-10">
              <nav aria-label="Les mer om kjøp av Bitcoin" className="grid sm:grid-cols-3 gap-3">
                <a href={PAGE_PATHS.overview} className="resource-link bg-[#f1f4ff]"><span>Kjøpe Bitcoin, steg for steg</span><ArrowUpRight size={19} className="shrink-0 text-brand" /></a>
                <a href={PAGE_PATHS.norway} className="resource-link bg-[#f0f8f4]"><span>Bli kjent med norske børser</span><ArrowUpRight size={19} className="shrink-0 text-emerald-700" /></a>
                <a href={PAGE_PATHS.tax} className="resource-link bg-[#fff6ee]"><span>Få oversikt over skatten</span><ArrowUpRight size={19} className="shrink-0 text-amber-700" /></a>
              </nav>

              <FAQSection />
            </section>
            <ExchangePriceChart results={results} isLoading={isLoading} error={error} />
          </div>
        )}

          {/* Page: Knowledge Overview */}
          {currentPage === 'overview' && <div className="animate-fade-in"><Overview navigateTo={navigateTo} /></div>}

          {/* Page: Norway Exchanges */}
          {currentPage === 'norway' && <div className="animate-fade-in"><NorwayExchanges navigateTo={navigateTo} /></div>}

          {/* Redaksjonelle landingssider */}
          {currentPage === 'price' && <BitcoinKursPage results={results} isLoading={isLoading} error={error} navigateTo={navigateTo} />}
          {currentPage === 'firiNbx' && <FiriVsNbxPage results={results} navigateTo={navigateTo} />}
          {currentPage === 'vipps' && <VippsPage results={results} navigateTo={navigateTo} />}
          {currentPage === 'tax' && <TaxPage navigateTo={navigateTo} />}
          {currentPage === 'about' && <AboutPage navigateTo={navigateTo} />}
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

      <Footer setCurrentPage={navigateTo} currentPage={currentPage} />
    </div>
);
}
