import { PAGE_PATHS, type Page } from '../routes';

interface FooterProps {
  setCurrentPage: (page: Page, event?: { preventDefault: () => void }) => void;
  currentPage: string;
}

export default function Footer({ setCurrentPage, currentPage }: FooterProps) {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer id="site-footer" className="py-10 sm:py-12 bg-white border-t border-slate-200">
      <div className="site-container">
        <div className="flex flex-col items-center gap-6 text-center">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-brand rounded-lg flex items-center justify-center text-white font-bold text-lg">
              ₿
            </div>
            <span className="font-display font-bold text-lg tracking-tight text-slate-900">
              KjøpeBitcoin<span className="text-brand">.no</span>
            </span>
          </div>

          {/* Footer Navigation */}
          <nav id="footer-nav" className="flex flex-wrap justify-center gap-x-6 gap-y-3">
            {[
              { id: 'home', label: 'Kjøpe Bitcoin' },
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
                aria-current={currentPage === item.id ? 'page' : undefined}
                className={`text-sm font-semibold transition-colors ${
                  currentPage === item.id ? 'text-brand' : 'text-slate-500 hover:text-brand'
                }`}
              >
                {item.label}
              </a>
            ))}
          </nav>
          <a href="/sitemap.xml" className="text-sm text-slate-500 hover:text-brand">Nettstedkart</a>

          <div className="pt-8 border-t border-slate-200 w-full space-y-4">
            <p className="text-xs text-slate-500">
              © {currentYear} Alle rettigheter forbeholdt. Prisene er estimater og kan variere.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
