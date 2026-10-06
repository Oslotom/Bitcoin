// Kjøres etter `vite build` og `vite build --ssr`. Lager:
//  - statisk forhåndsrendret HTML for hver side (dist/index.html, dist/guide.html, ...)
//    med egen title, description, canonical og strukturert data. GitHub Pages serverer
//    /guide fra guide.html med HTTP 200, og crawlere uten JavaScript ser innholdet.
//  - dist/sitemap.xml med ekte endringsdato per side (fra git)
//  - omdirigeringssider for nedlagte URL-er (REDIRECTS i src/routes.ts)
//  - dist/llms.txt: kort, faktabasert oppsummering for AI-assistenter (ChatGPT, Claude, Perplexity ...)
//  - dist/llms-full.txt: hele tekstinnholdet på alle sider som Markdown, for AI-er som vil lese alt
//  - dist/404.html: ekte 404-side (noindex) i stedet for å sende ukjente URL-er til forsiden
import { readFileSync, writeFileSync, rmSync } from 'node:fs';
import { pathToFileURL } from 'node:url';
import { resolve } from 'node:path';
import { getPageDates } from './page-dates.mjs';

const SITE = 'https://www.xn--kjpebitcoin-hgb.no';
const SITE_NAME = 'KjøpeBitcoin.no';
const SSR_DIR = 'dist-ssr';
const today = new Date().toISOString().slice(0, 10);
const pageDates = getPageDates();

const { render, PAGE_PATHS, PAGE_TITLES, PAGE_DESCRIPTIONS, ARTICLE_PAGES, ARTICLE_PUBLISHED, REDIRECTS, FAQS, feeRows, norwayExchanges } = await import(
  pathToFileURL(resolve(SSR_DIR, 'entry-server.js')).href
);

const escapeAttr = (value) => value.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');
const jsonLd = (data) =>
  `<script type="application/ld+json">${JSON.stringify(data).replace(/</g, '\\u003c')}</script>`;
const percent = (value) => `${(value * 100).toFixed(2).replace('.', ',')} %`;

// Enkel HTML -> Markdown for llms-full.txt (bare innholdet i <main>, uten ikoner og skript)
const decodeEntities = (text) =>
  text
    .replace(/&nbsp;/g, ' ')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#x27;|&#39;/g, "'")
    .replace(/&amp;/g, '&');
const htmlToMarkdown = (html) => {
  const main = html.match(/<main[^>]*>([\s\S]*)<\/main>/)?.[1] ?? html;
  return decodeEntities(
    main
      .replace(/<!-- -->/g, '')
      .replace(/<(script|style|svg|button|form)[\s\S]*?<\/\1>/g, '')
      .replace(/<h([1-4])[^>]*>([\s\S]*?)<\/h\1>/g, (_, level, text) => `\n\n${'#'.repeat(Number(level))} ${text.replace(/<[^>]+>/g, '').trim()}\n\n`)
      .replace(/<li[^>]*>/g, '\n- ')
      .replace(/<tr[^>]*>/g, '\n| ')
      .replace(/<\/t[hd]>/g, ' | ')
      .replace(/<\/span>/g, ' ')
      .replace(/<(p|div|br|ul|ol|table|section|header|article)[^>]*>/g, '\n')
      .replace(/<[^>]+>/g, ''),
  )
    .split('\n')
    .map((line) => line.replace(/[ \t]+/g, ' ').trim())
    .join('\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
};

const replaceOrFail = (html, pattern, replacement) => {
  if (!pattern.test(html)) throw new Error(`Fant ikke ${pattern} i dist/index.html`);
  return html.replace(pattern, () => replacement);
};

const template = readFileSync('dist/index.html', 'utf8');
const pages = Object.keys(PAGE_PATHS);
const markdownByPage = {};

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
      dateModified: pageDates[page] ?? today,
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
  if (ARTICLE_PAGES.includes(page)) {
    structuredData.push({
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: title.split(' | ')[0],
      description,
      inLanguage: 'nb-NO',
      ...(ARTICLE_PUBLISHED[page] && { datePublished: ARTICLE_PUBLISHED[page] }),
      dateModified: pageDates[page] ?? today,
      mainEntityOfPage: { '@id': `${url}#webpage` },
      image: `${SITE}/og-image.png`,
      author: { '@id': `${SITE}/#organization` },
      publisher: { '@id': `${SITE}/#organization` },
    });
  }
  if (page === 'norway') {
    structuredData.push({
      '@context': 'https://schema.org',
      '@type': 'ItemList',
      name: 'Norske kryptobørser og meglere for kjøp av Bitcoin',
      itemListElement: norwayExchanges
        .filter((exchange) => exchange.type !== 'Ressurs')
        .map((exchange, index) => ({
          '@type': 'ListItem',
          position: index + 1,
          item: {
            '@type': 'Organization',
            name: exchange.name,
            url: exchange.url,
            description: exchange.description,
            areaServed: 'NO',
          },
        })),
    });
  }
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
  html = html.replace(/(<link rel="alternate" hreflang="[^"]+" href=)".*?"/g, `$1"${url}"`);
  if (ARTICLE_PAGES.includes(page)) {
    html = replaceOrFail(
      html,
      /<meta property="og:type" content="website" \/>/,
      `<meta property="og:type" content="article" />
    <meta property="article:modified_time" content="${pageDates[page] ?? today}" />`,
    );
  }
  if (page !== 'home') {
    html = html.replace(/<meta property="og:title" content=".*?" \/>/, `<meta property="og:title" content="${escapeAttr(title)}" />`);
    html = html.replace(/<meta name="twitter:title" content=".*?" \/>/, `<meta name="twitter:title" content="${escapeAttr(title)}" />`);
    html = html.replace(/<meta property="og:description" content=".*?" \/>/, `<meta property="og:description" content="${escapeAttr(description)}" />`);
    html = html.replace(/<meta name="twitter:description" content=".*?" \/>/, `<meta name="twitter:description" content="${escapeAttr(description)}" />`);
  }
  html = replaceOrFail(html, /<!--page-jsonld-->/, structuredData.map(jsonLd).join('\n    '));
  const appHtml = render(path);
  markdownByPage[page] = htmlToMarkdown(appHtml);
  html = replaceOrFail(html, /<!--app-html-->/, appHtml);

  const file = page === 'home' ? 'dist/index.html' : `dist${path}.html`;
  writeFileSync(file, html);
  console.log(`Skrev ${file}`);
}

// Sitemap (Google bruker bare loc og lastmod; priority/changefreq ignoreres)
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${pages
  .map(
    (page) => `  <url>
    <loc>${page === 'home' ? `${SITE}/` : `${SITE}${PAGE_PATHS[page]}`}</loc>
    <lastmod>${pageDates[page] ?? today}</lastmod>
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

// llms-full.txt – hele innholdet, slik at AI-assistenter kan svare uten å hente hver side
const llmsFull = `# ${SITE_NAME} – fullstendig innhold

> Hele tekstinnholdet på ${SITE_NAME}, generert ${today}. Live priser vises bare på nettsiden; tallene under er gebyrsatser og statisk innhold.

${pages
  .map((page) => {
    const url = page === 'home' ? `${SITE}/` : `${SITE}${PAGE_PATHS[page]}`;
    return `---\n\nKilde: ${url}\n\n${markdownByPage[page]}`;
  })
  .join('\n\n')}
`;
writeFileSync('dist/llms-full.txt', llmsFull);
console.log('Skrev dist/llms-full.txt');

// 404.html – GitHub Pages serverer denne med HTTP 404. /guide/ og /guide.html sendes
// videre til /guide; alt annet får en ekte 404 med noindex (unngår «soft 404» og duplikater).
const knownPaths = pages.filter((page) => page !== 'home').map((page) => PAGE_PATHS[page]);
const notFoundLinks = ['home', 'price', 'norway', 'overview', 'tax', 'about']
  .map((page) => `<li><a href="${PAGE_PATHS[page]}">${PAGE_TITLES[page].split(' | ')[0]}</a></li>`)
  .join('\n        ');
const notFound = `<!doctype html>
<html lang="nb">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="robots" content="noindex" />
    <title>Siden finnes ikke | ${SITE_NAME}</title>
    <link rel="icon" type="image/jpeg" href="/favicon.jpg" />
    <script>
      (function (l) {
        var known = ${JSON.stringify(knownPaths)};
        var clean = l.pathname.replace(/\\.html$/, '').replace(/\\/+$/, '');
        if (clean !== l.pathname && known.indexOf(clean) !== -1) l.replace(clean + l.search + l.hash);
      })(window.location);
    </script>
    <style>
      body { font-family: system-ui, sans-serif; background: #fff; color: #0f172a; max-width: 40rem; margin: 0 auto; padding: 4rem 1rem; line-height: 1.6; }
      a { color: #0052ff; font-weight: 600; }
      li { margin: .4rem 0; }
    </style>
  </head>
  <body>
    <h1>Siden finnes ikke</h1>
    <p>Vi fant ikke siden du lette etter. Kanskje du var ute etter en av disse?</p>
    <ul>
        ${notFoundLinks}
    </ul>
  </body>
</html>
`;
writeFileSync('dist/404.html', notFound);
console.log('Skrev dist/404.html');

// Omdirigeringssider for nedlagte URL-er. GitHub Pages kan ikke sende 301, men en
// umiddelbar meta refresh + canonical til ny side behandles av Google som permanent flytting.
for (const [oldPath, page] of Object.entries(REDIRECTS)) {
  const target = page === 'home' ? `${SITE}/` : `${SITE}${PAGE_PATHS[page]}`;
  const redirect = `<!doctype html>
<html lang="nb">
  <head>
    <meta charset="utf-8" />
    <title>${escapeAttr(PAGE_TITLES[page])}</title>
    <meta name="robots" content="noindex, follow" />
    <link rel="canonical" href="${target}" />
    <meta http-equiv="refresh" content="0; url=${target}" />
    <script>location.replace(${JSON.stringify(target)} + location.hash);</script>
  </head>
  <body>
    <p>Siden har flyttet til <a href="${target}">${escapeAttr(PAGE_TITLES[page].split(' | ')[0])}</a>.</p>
  </body>
</html>
`;
  writeFileSync(`dist${oldPath}.html`, redirect);
  console.log(`Skrev dist${oldPath}.html -> ${target}`);
}

rmSync(SSR_DIR, { recursive: true, force: true });
