// Brukes kun ved bygg (scripts/prerender.mjs) for å lage statisk HTML for hver side,
// slik at Google og AI-crawlere som ikke kjører JavaScript ser hele innholdet.
import { renderToString } from 'react-dom/server';
import App from './App';
import { ContentProvider } from './contexts/ContentContext';
import { pageFromPath } from './routes';

export { PAGE_PATHS, PAGE_TITLES, PAGE_DESCRIPTIONS, ARTICLE_PAGES, ARTICLE_PUBLISHED } from './routes';
export { FAQS } from './data/faqs';
export { feeRows } from './components/FeeOverview';

export function render(path: string): string {
  return renderToString(
    <ContentProvider>
      <App initialPage={pageFromPath(path)} />
    </ContentProvider>,
  );
}
