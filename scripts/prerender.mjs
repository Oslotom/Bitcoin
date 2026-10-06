// Kjøres etter `vite build` og `vite build --ssr`. Lager:
//  - statisk forhåndsrendret HTML for hver side (dist/index.html, dist/sammenlign.html, ...)
//    med egen title, description, canonical og strukturert data. GitHub Pages serverer
//    /sammenlign fra sammenlign.html med HTTP 200, og crawlere uten JavaScript ser innholdet.
//  - dist/sitemap.xml med dagens dato
//  - dist/llms.txt: kort, faktabasert oppsummering for AI-assistenter (ChatGPT, Claude, Perplexity ...)
import { readFileSync, writeFileSync, rmSync } from 'node:fs';
import { pathToFileURL } from 'node:url';
import { resolve } from 'node:path';

const SITE = 'https://xn--kjpebitcoin-hgb.no';
const SITE_NAME = 'KjøpeBitcoin.no';
const SSR_DIR = 'dist-ssr';
const today = new Date().toISOString().slice(0, 10);

const { render, PAGE_PATHS, PAGE_TITLES, PAGE_DESCRIPTIONS, FAQS, feeRows } = await import(
  pathToFileURL(resolve(SSR_DIR, 'entry-server.js')).href
);

const escapeAttr = (value) => value.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');
const jsonLd = (data) =>
  `<script type="application/ld+json">${JSON.stringify(data).replace(/</g, '\\u003c')}</script>`;
const percent = (value) => `${(value * 100).toFixed(2).replace('.', ',')} %`;

const replaceOrFail = (html, pattern, replacement) => {
  if (!pattern.test(html)) throw new Error(`Fant ikke ${pattern} i dist/index.html`);
  return html.replace(pattern, () => replacement);
};

const template = readFileSync('dist/index.html', 'utf8');
const pages = Object.keys(PAGE_PATHS);

for (const page of pages) {
  const path = PAGE_PATHS[page];
  const url = page === 'home' ? `${SITE}/` : `${SITE}${path}`;
  const title = PAGE_TITLES[page];
  const description = PAGE_DESCRIPTIONS[page];

  const structuredData = [
    {
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      '@id': `${url}#webpage`,
      url,
      name: title,
      description,
      inLanguage: 'nb-NO',
      dateModified: today,
      isPartOf: { '@id': `${SITE}/#website` },
      ...(page !== 'home' && {
        breadcrumb: {
          '@type': 'BreadcrumbList',
          itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'Forside', item: `${SITE}/` },
            { '@type': 'ListItem', position: 2, name: title.split(' | ')[0], item: url },
          ],
        },
      }),
    },
  ];
  if (page === 'home') {
    structuredData.push({
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: FAQS.map((faq) => ({
        '@type': 'Question',
        name: faq.question,
        acceptedAnswer: { '@type': 'Answer', text: faq.answer },
      })),
    });
  }

  let html = template;
  html = replaceOrFail(html, /<title>.*?<\/title>/, `<title>${escapeAttr(title)}</title>`);
  html = replaceOrFail(html, /<meta name="description" content=".*?" \/>/, `<meta name="description" content="${escapeAttr(description)}" />`);
  html = replaceOrFail(html, /<link rel="canonical" href=".*?" \/>/, `<link rel="canonical" href="${url}" />`);
  html = replaceOrFail(html, /<meta property="og:url" content=".*?" \/>/, `<meta property="og:url" content="${url}" />`);
  if (page !== 'home') {
    html = html.replace(/<meta property="og:title" content=".*?" \/>/, `<meta property="og:title" content="${escapeAttr(title)}" />`);
    html = html.replace(/<meta name="twitter:title" content=".*?" \/>/, `<meta name="twitter:title" content="${escapeAttr(title)}" />`);
    html = html.replace(/<meta property="og:description" content=".*?" \/>/, `<meta property="og:description" content="${escapeAttr(description)}" />`);
    html = html.replace(/<meta name="twitter:description" content=".*?" \/>/, `<meta name="twitter:description" content="${escapeAttr(description)}" />`);
  }
  html = replaceOrFail(html, /<!--page-jsonld-->/, structuredData.map(jsonLd).join('\n    '));
  html = replaceOrFail(html, /<!--app-html-->/, render(path));

  const file = page === 'home' ? 'dist/index.html' : `dist${path}.html`;
  writeFileSync(file, html);
  console.log(`Skrev ${file}`);
}

// Sitemap
const priority = { home: '1.0', live: '0.9', norway: '0.8', all: '0.8', overview: '0.7', contact: '0.3' };
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${pages
  .map(
    (page) => `  <url>
    <loc>${page === 'home' ? `${SITE}/` : `${SITE}${PAGE_PATHS[page]}`}</loc>
    <lastmod>${today}</lastmod>
    <priority>${priority[page] ?? '0.5'}</priority>
  </url>`,
  )
  .join('\n')}
</urlset>
`;
writeFileSync('dist/sitemap.xml', sitemap);
console.log('Skrev dist/sitemap.xml');

// llms.txt (https://llmstxt.org) – faktagrunnlag AI-assistenter kan sitere
const fees = feeRows();
const llms = `# ${SITE_NAME}

> ${SITE_NAME} er en norsk, uavhengig sammenligningstjeneste for kjøp av Bitcoin i Norge. Siden viser live Bitcoin-kurs i norske kroner (NOK) fra norske og internasjonale kryptobørser, og regner ut hvor mye Bitcoin du faktisk får etter handelsgebyr og spread.

Sist oppdatert: ${today}

## Sider

${pages
  .filter((page) => page !== 'home')
  .map((page) => `- [${PAGE_TITLES[page].split(' | ')[0]}](${SITE}${PAGE_PATHS[page]}): ${PAGE_DESCRIPTIONS[page]}`)
  .join('\n')}

## Gebyrer for kjøp av Bitcoin (sortert fra billigst)

Handelsgebyr + estimert spread. Innskudds- og uttaksgebyrer kommer i tillegg.

| Børs | Norsk | Handelsgebyr | Spread (est.) | Totalt | Gebyr på 10 000 kr |
|---|---|---|---|---|---|
${fees
  .map((f) => `| ${f.exchange} | ${f.norwegian ? 'Ja' : 'Nei'} | ${percent(f.trade)} | ${percent(f.spread)} | ${percent(f.total)} | ${Math.round(10000 * f.total)} kr |`)
  .join('\n')}

## Ofte stilte spørsmål

${FAQS.map((faq) => `### ${faq.question}\n\n${faq.answer}`).join('\n\n')}
`;
writeFileSync('dist/llms.txt', llms);
console.log('Skrev dist/llms.txt');

rmSync(SSR_DIR, { recursive: true, force: true });
