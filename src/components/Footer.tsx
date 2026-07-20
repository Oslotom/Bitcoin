interface FooterProps {
  setCurrentPage: (page: 'home' | 'live' | 'overview' | 'platforms' | 'norway' | 'contact' | 'all') => void;
  currentPage: string;
}

export default function Footer({ setCurrentPage, currentPage }: FooterProps) {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer id="site-footer" className="py-24 bg-white border-t border-slate-100">
      <div className="max-w-5xl mx-auto px-4">
        <div className="flex flex-col items-center gap-12 text-center">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-brand rounded-lg flex items-center justify-center text-white font-black text-lg">
              ₿
            </div>
            <span className="font-display font-bold text-lg tracking-tight text-slate-900">
              KjøpeBitcoin<span className="text-brand">.no</span>
            </span>
          </div>

          {/* Footer Navigation */}
          <nav id="footer-nav" className="flex flex-wrap justify-center gap-x-12 gap-y-6">
            {[
              { id: 'home', label: 'Hjem' },
              { id: 'live', label: 'Sammenlign' },
              { id: 'all', label: 'Alle Børser' },
              { id: 'norway', label: 'Norge' },
              { id: 'overview', label: 'Guide' },
              { id: 'contact', label: 'Kontakt' }
            ].map((item) => (
              <button 
                key={item.id}
                onClick={() => setCurrentPage(item.id as any)}
                className={`text-sm font-semibold transition-colors ${
                  currentPage === item.id ? 'text-brand' : 'text-slate-500 hover:text-brand'
                }`}
              >
                {item.label}
              </button>
            ))}
          </nav>

          <div className="pt-8 border-t border-slate-50 w-full space-y-4">
            <p className="text-[10px] uppercase font-bold tracking-[0.2em] text-slate-400">
              © {currentYear} Alle rettigheter forbeholdt. Prisene er estimater og kan variere.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
