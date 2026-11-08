// Brukes kun ved bygg (scripts/prerender.mjs) for å lage statisk HTML for hver side,
// slik at Google og AI-crawlere som ikke kjører JavaScript ser hele innholdet.
import { renderToString } from 'react-dom/server';
import App from './App';
import { pageFromPath } from './routes';
import { renderPage } from './pageRegistry';

export { PAGE_PATHS, PAGE_TITLES, PAGE_DESCRIPTIONS, ARTICLE_PAGES, ARTICLE_PUBLISHED, REDIRECTS } from './routes';
export { FAQS } from './data/faqs';
export { feeRows } from './components/FeeOverview';
export { norwayExchanges } from './components/NorwayExchanges';

export function render(path: string): string {
  return renderToString(
    <App initialPage={pageFromPath(path)} prerenderContent={renderPage(pageFromPath(path))} />,
  );
}
