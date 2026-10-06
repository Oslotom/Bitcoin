// Ekte «sist endret»-dato per side, hentet fra git-historikken til filene siden består av.
// Brukes i sitemap (lastmod), strukturert data (dateModified) og synlig «Sist oppdatert».
// Å sette dagens dato på alle sider ved hvert bygg får Google til å ignorere lastmod.
import { execFileSync } from 'node:child_process';

const PAGE_SOURCES = {
  home: ['src/App.tsx', 'src/components/FeeOverview.tsx', 'src/components/FAQSection.tsx', 'src/data/faqs.ts', 'src/services/api.ts'],
  price: ['src/components/pages/BitcoinKursPage.tsx'],
  norway: ['src/components/NorwayExchanges.tsx'],
  firiNbx: ['src/components/pages/FiriVsNbxPage.tsx', 'src/components/FiriVsNbx.tsx'],
  vipps: ['src/components/pages/VippsPage.tsx', 'src/components/VippsComparisonSection.tsx'],
  overview: ['src/components/Overview.tsx'],
  tax: ['src/components/pages/TaxPage.tsx'],
  about: ['src/components/pages/AboutPage.tsx', 'src/components/ContactPage.tsx'],
};

const git = (args) => {
  try {
    return execFileSync('git', args, { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }).trim();
  } catch {
    return '';
  }
};

export function getPageDates() {
  const today = new Date().toISOString().slice(0, 10);
  return Object.fromEntries(
    Object.entries(PAGE_SOURCES).map(([page, files]) => {
      // Ucommittede endringer (lokal utvikling) eller manglende historikk -> dagens dato
      const dirty = git(['status', '--porcelain', '--', ...files]);
      const committed = git(['log', '-1', '--format=%cs', '--', ...files]);
      return [page, dirty || !committed ? today : committed];
    }),
  );
}
