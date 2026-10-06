import { useEffect, useRef, useState } from 'react';
import Footer from './components/Footer';
import ResultsTable from './components/ResultsTable';
import Overview from './components/Overview';
import FAQSection from './components/FAQSection';
import FeeOverview from './components/FeeOverview';
import BitcoinKursPage from './components/pages/BitcoinKursPage';
import FiriVsNbxPage from './components/pages/FiriVsNbxPage';
import VippsPage from './components/pages/VippsPage';
import TaxPage from './components/pages/TaxPage';
import AboutPage from './components/pages/AboutPage';
import { ExchangeIcon } from './components/icons';
import CountUp from 'react-countup';
import NorwayExchanges from './components/NorwayExchanges';
import BitcoinCalculator from './components/BitcoinCalculator';
import { getCoinbasePrice, getBinancePrice, getFiriPrice, getKrakenPrice, getNbxPrice, getBareBitcoinPrice, getRevolutPrice, getCryptoComPrice, getBuyBitcoinPrice, FEES } from './services/api';
import { ComparisonResult, CryptoCurrency, Exchange } from './types';
import { ExternalLink, Edit2, Save, Menu, X, Zap, Globe, CreditCard } from 'lucide-react';
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
  const didInitCalculate = useRef(false);

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
    event?.preventDefault();
    setCurrentPage(page);
    setIsMobileMenuOpen(false);
    window.scrollTo(0, 0);

    const path = PAGE_PATHS[page];
    if (path && path !== window.location.pathname) {
      window.history.pushState({}, '', path);
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
          <a
            href="/"
            onClick={(e) => navigateTo('home', e)}
            aria-label="KjøpeBitcoin.no – forside"
            className="flex items-center gap-2 cursor-pointer group"
          >
            <div className="w-8 h-8 bg-brand rounded-lg flex items-center justify-center text-white font-black text-lg shadow-lg shadow-blue-100 group-hover:scale-105 transition-transform">
              ₿
            </div>
            <span className="font-display font-bold text-lg tracking-tight text-slate-900">
              KjøpeBitcoin<span className="text-brand">.no</span>
            </span>
          </a>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-6">
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
                  aria-label="Lukk meny"
                  className="p-2 text-slate-400 hover:text-slate-900 transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-6 space-y-2">
                {[
                  { id: 'home', label: 'Forside', icon: '🏠' },
                  { id: 'price', label: 'Bitcoin kurs i dag', icon: '📈' },
                  { id: 'norway', label: 'Bitcoin i Norge', icon: '🇳🇴' },
                  { id: 'firiNbx', label: 'Firi vs NBX', icon: '⚖️' },
                  { id: 'vipps', label: 'Kjøp med Vipps', icon: '📱' },
                  { id: 'overview', label: 'Guide & Kunnskap', icon: '📚' },
                  { id: 'tax', label: 'Skatt på Bitcoin', icon: '🧾' },
                  { id: 'about', label: 'Om oss og kontakt', icon: '✉️' }
                ].map((item) => (
                  <a
                    key={item.id}
                    href={PAGE_PATHS[item.id as Page]}
                    onClick={(e) => navigateTo(item.id as Page, e)}
                    className={`w-full flex items-center gap-4 px-4 py-4 rounded-2xl text-sm font-bold transition-all ${
                      currentPage === item.id 
                        ? 'bg-orange-50 text-orange-600' 
                        : 'text-slate-600 hover:bg-slate-50 active:scale-[0.98]'
                    }`}
                  >
                    <span className="text-xl">{item.icon}</span>
                    {item.label}
                  </a>
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
                  <span className="text-brand">Kjøpe Bitcoin</span> i Norge{" "}<br />
                  – finn beste kurs og pris
                </h1>

                <p className="max-w-2xl mx-auto text-lg md:text-lg text-slate-600 leading-relaxed font-medium">
                  Planlegger du å kjøpe Bitcoin? Vi sammenligner live Bitcoin kurs, gebyrer og spread hos Firi, Bare Bitcoin, NBX, Kraken, Binance og flere – så du ser hvor du får mest Bitcoin for pengene.
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

              <p className="text-center text-sm text-slate-500">
                Vil du regne på et eget beløp?{' '}
                <a href="#kalkulator" className="font-semibold text-brand hover:underline">
                  Bruk Bitcoin-kalkulatoren
                </a>
              </p>
            </section>

            <section id="kalkulator" className="max-w-5xl mx-auto px-4 pb-14 scroll-mt-20">
              <BitcoinCalculator results={results} isLoading={isLoading} />
            </section>

            <FeeOverview />

            {/* SEO-innhold: forklarende tekst om kjøp av Bitcoin i Norge */}
            <section className="max-w-5xl mx-auto px-4 pb-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="space-y-3">
                  <h2 className="text-xl font-bold text-slate-900">Hvor bør du kjøpe Bitcoin i Norge?</h2>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    Det billigste stedet å <strong>kjøpe Bitcoin i Norge</strong> avhenger av beløpet og hvordan du betaler. Tabellen over viser hvor mye Bitcoin du faktisk får etter handelsgebyr og spread, slik at du kan sammenligne børsene direkte. Se også oversikten over{' '}
                    <a href="/norske-borser" onClick={(e) => navigateTo('norway', e)} className="text-brand hover:underline">norske kryptobørser</a>.
                  </p>
                </div>
                <div className="space-y-3">
                  <h2 className="text-xl font-bold text-slate-900">Live Bitcoin kurs i NOK</h2>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    <strong>Bitcoin kursen</strong> hentes direkte fra børsene hver gang du besøker siden. Prisene vises i norske kroner, slik at du får en rettferdig sammenligning av <strong>Bitcoin prisen</strong> hos både norske og utenlandske aktører.
                  </p>
                </div>
                <div className="space-y-3">
                  <h2 className="text-xl font-bold text-slate-900">Gebyrer, spread og Vipps</h2>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    Mange børser reklamerer med lave gebyrer, men tar betalt gjennom spread eller innskuddsgebyr ved Vipps og kort. Les{' '}
                    <a href="/guide" onClick={(e) => navigateTo('overview', e)} className="text-brand hover:underline">guiden til å kjøpe Bitcoin trygt</a>{' '}
                    eller se{' '}
                    <a href={PAGE_PATHS.vipps} onClick={(e) => navigateTo('vipps', e)} className="text-brand hover:underline">hva det koster å kjøpe Bitcoin med Vipps</a>.
                  </p>
                </div>
              </div>

              <nav aria-label="Populære guider" className="mt-12">
                <h2 className="text-xl font-bold text-slate-900 mb-4">Populære guider</h2>
                <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                  {(['price', 'firiNbx', 'vipps', 'tax'] as Page[]).map((page) => (
                    <li key={page}>
                      <a
                        href={PAGE_PATHS[page]}
                        onClick={(e) => navigateTo(page, e)}
                        className="block h-full card-premium px-4 py-3 text-sm font-semibold text-slate-900 hover:text-brand"
                      >
                        {PAGE_TITLES[page]?.split(' | ')[0]}
                      </a>
                    </li>
                  ))}
                </ul>
              </nav>

              <FAQSection />
            </section>
          </div>
        )}

          {/* Page: Knowledge Overview */}
          {currentPage === 'overview' && <div className="animate-fade-in"><Overview /></div>}

          {/* Page: Norway Exchanges */}
          {currentPage === 'norway' && <div className="animate-fade-in"><NorwayExchanges /></div>}

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
