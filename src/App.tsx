import { lazy, Suspense, useEffect, useRef, useState, type ReactNode } from 'react';
import Footer from './components/Footer';
import HomePage from './components/HomePage';
const Overview = lazy(() => import('./components/Overview'));
const BitcoinKursPage = lazy(() => import('./components/pages/BitcoinKursPage'));
const FiriVsNbxPage = lazy(() => import('./components/pages/FiriVsNbxPage'));
const VippsPage = lazy(() => import('./components/pages/VippsPage'));
const TaxPage = lazy(() => import('./components/pages/TaxPage'));
const AboutPage = lazy(() => import('./components/pages/AboutPage'));
const NorwayExchanges = lazy(() => import('./components/NorwayExchanges'));
import { INITIAL_SNAPSHOT, compareSnapshot, fetchSnapshot } from './services/market';
import { Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
const ExchangeComparisonPage = lazy(() => import('./components/pages/ExchangeComparisonPage'));
const PriceResearchPage = lazy(() => import('./components/pages/PriceResearchPage'));
const CalculatorPage = lazy(() => import('./components/pages/CalculatorPage'));
import { PAGE_PATHS, PAGE_TITLES, pageFromPath, type Page } from './routes';

// initialPage settes ved forhåndsrendring på byggetidspunktet (der window ikke finnes)
export default function App({ initialPage, prerenderContent }: { initialPage?: Page; prerenderContent?: ReactNode }) {
  const [snapshot, setSnapshot] = useState(INITIAL_SNAPSHOT);
  const [amount, setAmount] = useState(10000);
  const [isLoading, setIsLoading] = useState(false);
  const results = compareSnapshot(snapshot, amount);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<Page>(() => initialPage ?? pageFromPath(window.location.pathname));
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isHeaderScrolled, setIsHeaderScrolled] = useState(false);
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const refreshRef = useRef<() => void>(() => {});

  useEffect(() => {
    const updateHeader = () => setIsHeaderScrolled(window.scrollY > 16);
    updateHeader();
    window.addEventListener('scroll', updateHeader, { passive: true });
    window.addEventListener('pageshow', updateHeader);
    return () => {
      window.removeEventListener('scroll', updateHeader);
      window.removeEventListener('pageshow', updateHeader);
    };
  }, []);

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

  useEffect(() => {
    const pricePages: Page[] = ['home', 'price', 'firiNbx', 'firiBare', 'nbxBare', 'vipps', 'research', 'calculator'];
    if (!pricePages.includes(currentPage)) return;
    let alive = true;
    let controller: AbortController | undefined;
    const refresh = async () => {
      controller?.abort();
      const request = new AbortController();
      controller = request;
      const timer = window.setTimeout(() => request.abort(), 7000);
      setIsLoading(true);
      try {
        const next = await fetchSnapshot(request.signal);
        if (alive) { setSnapshot(previous => Date.parse(next.generatedAt) >= Date.parse(previous.generatedAt) ? next : previous); setError(null); }
      } catch {
        if (alive && controller === request) setError('Kunne ikke oppdatere prisfilen. Sist lagrede priser vises med tidspunkt.');
      } finally {
        window.clearTimeout(timer);
        if (alive && controller === request) setIsLoading(false);
      }
    };
    refreshRef.current = refresh;
    void refresh();
    const interval = window.setInterval(() => { if (document.visibilityState === 'visible') void refresh(); }, 60000);
    return () => { alive = false; controller?.abort(); window.clearInterval(interval); };
  }, [currentPage]);

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
      <header className="site-header sticky top-0 z-40 w-full" data-scrolled={isHeaderScrolled}>
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
              { id: 'calculator', label: 'Kalkulator' },
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
                  { id: 'calculator', label: 'Bitcoin-kalkulator' },
                  { id: 'norway', label: 'Bitcoin i Norge' },
                  { id: 'firiNbx', label: 'Firi vs NBX' },
                  { id: 'firiBare', label: 'Firi vs Bare Bitcoin' },
                  { id: 'nbxBare', label: 'NBX vs Bare Bitcoin' },
                  { id: 'research', label: 'Dokumentert prissammenligning' },
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
        {currentPage === 'home' && <HomePage results={results} isLoading={isLoading && results.length === 0} error={results.length ? null : error} snapshot={snapshot} amount={amount} onAmountChange={setAmount} refreshError={error} onRetry={() => refreshRef.current()} />}

          {prerenderContent ?? <Suspense fallback={<div className="site-container py-16" role="status">Laster siden …</div>}>
          {/* Page: Knowledge Overview */}
          {currentPage === 'overview' && <div className="animate-fade-in"><Overview navigateTo={navigateTo} /></div>}

          {/* Page: Norway Exchanges */}
          {currentPage === 'norway' && <div className="animate-fade-in"><NorwayExchanges navigateTo={navigateTo} /></div>}

          {/* Redaksjonelle landingssider */}
          {currentPage === 'price' && <BitcoinKursPage results={results} isLoading={isLoading && results.length === 0} error={results.length ? null : error} snapshot={snapshot} amount={amount} onAmountChange={setAmount} navigateTo={navigateTo} />}
          {currentPage === 'firiNbx' && <FiriVsNbxPage results={results} navigateTo={navigateTo} />}
          {currentPage === 'vipps' && <VippsPage results={results} navigateTo={navigateTo} />}
          {currentPage === 'tax' && <TaxPage navigateTo={navigateTo} />}
          {currentPage === 'about' && <AboutPage navigateTo={navigateTo} />}
          {currentPage === 'firiBare' && <ExchangeComparisonPage variant="firiBare" results={results} navigateTo={navigateTo} />}
          {currentPage === 'nbxBare' && <ExchangeComparisonPage variant="nbxBare" results={results} navigateTo={navigateTo} />}
          {currentPage === 'research' && <PriceResearchPage results={results} asOf={snapshot.generatedAt} navigateTo={navigateTo} />}
          {currentPage === 'calculator' && <CalculatorPage results={results} snapshot={snapshot} amount={amount} onAmountChange={setAmount} navigateTo={navigateTo} />}
          </Suspense>}
        </main>
      
      <Footer setCurrentPage={navigateTo} currentPage={currentPage} />
    </div>
);
}
