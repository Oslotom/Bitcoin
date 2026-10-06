import { PAGE_PATHS, type Page } from '../routes';

interface FooterProps {
  setCurrentPage: (page: Page, event?: { preventDefault: () => void }) => void;
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
          <nav id="footer-nav" className="flex flex-wrap justify-center gap-x-8 gap-y-4">
            {[
              { id: 'home', label: 'Hjem' },
              { id: 'price', label: 'Bitcoin kurs' },
              { id: 'norway', label: 'Norske børser' },
              { id: 'firiNbx', label: 'Firi vs NBX' },
              { id: 'vipps', label: 'Kjøp med Vipps' },
              { id: 'overview', label: 'Guide' },
              { id: 'tax', label: 'Skatt' },
              { id: 'about', label: 'Om oss og kontakt' }
            ].map((item) => (
              <a
                key={item.id}
                href={PAGE_PATHS[item.id as Page]}
                onClick={(e) => setCurrentPage(item.id as Page, e)}
                className={`text-sm font-semibold transition-colors ${
                  currentPage === item.id ? 'text-brand' : 'text-slate-500 hover:text-brand'
                }`}
              >
                {item.label}
              </a>
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
