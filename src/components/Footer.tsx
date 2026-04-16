interface FooterProps {
  setCurrentPage: (page: 'home' | 'live' | 'overview' | 'platforms') => void;
  currentPage: string;
}

export default function Footer({ setCurrentPage, currentPage }: FooterProps) {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer id="site-footer" className="py-12 bg-slate-50 border-t border-slate-100 mt-20">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="flex flex-col items-center gap-8 text-center">
          {/* Footer Navigation */}
          <nav id="footer-nav" className="flex flex-wrap justify-center gap-x-8 gap-y-4">
            <button 
              onClick={() => setCurrentPage('home')}
              className={`text-xs font-bold uppercase tracking-widest transition-colors ${currentPage === 'home' ? 'text-orange-600' : 'text-slate-400 hover:text-slate-600'}`}
            >
              Hjem
            </button>
            <button 
              onClick={() => setCurrentPage('live')}
              className={`text-xs font-bold uppercase tracking-widest transition-colors ${currentPage === 'live' ? 'text-orange-600' : 'text-slate-400 hover:text-slate-600'}`}
            >
              Live Priser
            </button>
            <button 
              onClick={() => setCurrentPage('platforms')}
              className={`text-xs font-bold uppercase tracking-widest transition-colors ${currentPage === 'platforms' ? 'text-orange-600' : 'text-slate-400 hover:text-slate-600'}`}
            >
              Plattformer
            </button>
            <button 
              onClick={() => setCurrentPage('overview')}
              className={`text-xs font-bold uppercase tracking-widest transition-colors ${currentPage === 'overview' ? 'text-orange-600' : 'text-slate-400 hover:text-slate-600'}`}
            >
              Oversikt
            </button>
          </nav>

          <div className="space-y-2">
            <p className="text-sm font-bold text-slate-900 tracking-tight">&copy; {currentYear} KJØPEBITCOIN<span className="text-orange-500">.NO</span></p>
            <p className="text-[10px] uppercase font-black tracking-widest text-slate-400 max-w-xs mx-auto">Alle rettigheter forbeholdt. Prisene er estimater og kan variere.</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
