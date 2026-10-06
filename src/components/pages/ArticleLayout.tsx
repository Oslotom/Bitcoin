import type { ReactNode } from 'react';
import { PAGE_PATHS, PAGE_TITLES, type Page } from '../../routes';

declare const __PAGE_DATES__: Record<string, string>;

export type NavigateFn = (page: Page, event?: { preventDefault: () => void }) => void;

export function InternalLink({ to, navigateTo, children }: { to: Page; navigateTo: NavigateFn; children: ReactNode }) {
  return (
    <a href={PAGE_PATHS[to]} onClick={(e) => navigateTo(to, e)} className="font-semibold text-brand hover:underline">
      {children}
    </a>
  );
}

interface ArticleLayoutProps {
  page: Page;
  title: ReactNode;
  intro: ReactNode;
  related: Page[];
  navigateTo: NavigateFn;
  children: ReactNode;
}

// Felles mal for redaksjonelle sider: én H1, ingress, dato og relaterte sider (internlenking)
export default function ArticleLayout({ page, title, intro, related, navigateTo, children }: ArticleLayoutProps) {
  const modified = __PAGE_DATES__[page];
  return (
    <article className="max-w-3xl mx-auto px-4 pt-20 pb-16 animate-fade-in">
      <header className="space-y-4 mb-10">
        <h1 className="text-4xl md:text-5xl font-display font-bold tracking-tight text-slate-900 leading-[1.1]">{title}</h1>
        <p className="text-lg text-slate-600 leading-relaxed font-medium">{intro}</p>
        <p className="text-xs text-slate-400 font-medium">
          Av KjøpeBitcoin.no · Sist oppdatert{' '}
          <time dateTime={modified}>
            {new Date(modified).toLocaleDateString('nb-NO', { day: 'numeric', month: 'long', year: 'numeric' })}
          </time>
        </p>
      </header>

      <div className="space-y-10 text-slate-700 leading-relaxed [&_h2]:text-2xl [&_h2]:font-bold [&_h2]:text-slate-900 [&_h2]:mb-3 [&_h3]:text-lg [&_h3]:font-bold [&_h3]:text-slate-900 [&_h3]:mb-2 [&_p]:mb-3 [&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:space-y-2 [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:space-y-2">
        {children}
      </div>

      <nav aria-label="Relaterte sider" className="mt-16 border-t border-slate-100 pt-8">
        <h2 className="text-sm font-bold uppercase tracking-widest text-slate-400 mb-4">Les også</h2>
        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {related.map((page) => (
            <li key={page}>
              <a
                href={PAGE_PATHS[page]}
                onClick={(e) => navigateTo(page, e)}
                className="block card-premium px-4 py-3 text-sm font-semibold text-slate-900 hover:text-brand"
              >
                {PAGE_TITLES[page]?.split(' | ')[0]}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </article>
  );
}
