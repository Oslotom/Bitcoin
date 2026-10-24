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
    <article className="site-container pt-10 sm:pt-14 pb-14 sm:pb-16 animate-fade-in">
      <nav aria-label="Brødsmuler" className="mb-6 text-sm text-slate-500">
        <a href={PAGE_PATHS.home} className="hover:text-brand">Kjøpe Bitcoin</a>
        <span aria-hidden="true"> / </span>
        <span aria-current="page">{PAGE_TITLES[page]?.split(' | ')[0]}</span>
      </nav>
      <header className="space-y-4 mb-10">
        <h1 className="page-title">{title}</h1>
        <p className="max-w-3xl text-base sm:text-lg text-slate-600 leading-relaxed">{intro}</p>
        <p className="text-sm text-slate-500">
          Av KjøpeBitcoin.no · Sist oppdatert{' '}
          <time dateTime={modified}>
            {new Date(modified).toLocaleDateString('nb-NO', { day: 'numeric', month: 'long', year: 'numeric' })}
          </time>
        </p>
      </header>

      <div className="article-content">
        {children}
      </div>

      <nav aria-label="Relaterte sider" className="mt-16 border-t border-slate-100 pt-8">
        <h2 className="section-title mb-4">Les også</h2>
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
