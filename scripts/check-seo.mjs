// Check the generated documents, not just the route configuration.
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';

const site = 'https://www.xn--kjpebitcoin-hgb.no';
const read = (file) => readFileSync(`dist/${file}`, 'utf8');
const sitemap = read('sitemap.xml');
assert(sitemap.includes('xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"'), 'Missing sitemap namespace');
const entries = [...sitemap.matchAll(/<url>\s*<loc>([^<]+)<\/loc>\s*<lastmod>([^<]+)<\/lastmod>\s*<\/url>/g)];
assert(entries.length > 0, 'Sitemap has no URLs');
assert.equal(entries.length, (sitemap.match(/<url>/g) || []).length, 'Malformed sitemap entries');
const urls = new Set(entries.map((entry) => entry[1]));
assert.equal(urls.size, entries.length, 'Duplicate sitemap URLs');
const titles = new Set();
const descriptions = new Set();
const allLinks = new Set();
for (const [, location, modified] of entries) {
  const url = new URL(location);
  assert.equal(url.origin, site, `Wrong canonical host: ${location}`);
  assert(!url.search && !url.hash && !url.pathname.endsWith('.html'), `Noncanonical sitemap URL: ${location}`);
  assert(/^\d{4}-\d{2}-\d{2}$/.test(modified) && Number.isFinite(Date.parse(modified)), `Invalid lastmod: ${location}`);
  assert(modified <= new Date().toISOString().slice(0, 10), `Future lastmod: ${location}`);
  const html = read(url.pathname === '/' ? 'index.html' : `${url.pathname.slice(1)}.html`);
  assert(!/noindex|http-equiv="refresh"/i.test(html), `Nonindexable document in sitemap: ${location}`);
  assert.equal((html.match(/<h1\b/g) || []).length, 1, `Expected one H1: ${location}`);
  assert.equal(html.match(/<link rel="canonical" href="([^"]+)"/)?.[1], location, `Canonical mismatch: ${location}`);
  assert.equal(html.match(/<meta property="og:url" content="([^"]+)"/)?.[1], location, `OG URL mismatch: ${location}`);
  const title = html.match(/<title>([^<]+)<\/title>/)?.[1];
  const description = html.match(/<meta name="description" content="([^"]+)"/)?.[1];
  assert(title && !titles.has(title), `Missing/duplicate title: ${location}`);
  assert(description && !descriptions.has(description), `Missing/duplicate description: ${location}`);
  titles.add(title);
  descriptions.add(description);
  const main = html.match(/<main\b[^>]*>([\s\S]*?)<\/main>/)?.[1];
  assert(main && main.replace(/<[^>]+>/g, '').length > 200, `Missing prerendered content: ${location}`);
  const json = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)];
  assert(json.length > 0, `Missing structured data: ${location}`);
  for (const [, raw] of json) JSON.parse(raw);
  for (const [, href] of html.matchAll(/<a\b[^>]*href="([^"]+)"/g)) {
    const target = new URL(href.replace(/&amp;/g, '&'), location);
    if (target.origin !== site) continue;
    allLinks.add(`${target.origin}${target.pathname}`);
    const file = target.pathname === '/' ? 'index.html' : target.pathname.slice(1);
    assert(existsSync(`dist/${file}`) || existsSync(`dist/${file}.html`), `Broken internal link ${href} on ${location}`);
    if (target.hash) {
      const targetFile = existsSync(`dist/${file}`) ? file : `${file}.html`;
      const fragment = decodeURIComponent(target.hash.slice(1));
      assert(read(targetFile).includes(`id="${fragment}"`), `Missing anchor ${href} on ${location}`);
    }
  }
  assert(read('llms-full.txt').includes(`Kilde: ${location}`), `Missing AI text source: ${location}`);
}
for (const url of urls) assert(allLinks.has(url), `Orphan page: ${url}`);
assert(read('robots.txt').includes(`Sitemap: ${site}/sitemap.xml`), 'robots.txt points to the wrong sitemap');
// Prevent accidental blocking of search/user retrieval independently of training bots.
const robotGroups = read('robots.txt').split(/\r?\n\s*\r?\n/);
for (const bot of ['OAI-SearchBot', 'ChatGPT-User', 'Claude-SearchBot', 'Claude-User']) {
  const group = robotGroups.find((text) => text.split(/\r?\n/).some((line) => line.trim().toLowerCase() === `user-agent: ${bot.toLowerCase()}`));
  assert(group && /^Allow:\s*\/\s*$/m.test(group) && !/^Disallow:\s*\S+/m.test(group), `AI retrieval blocked: ${bot}`);
}
const about = read('om-oss.html');
assert(about.includes('id="metode"') && about.includes('id="gebyroversikt"') && about.includes('<table'), 'Missing static method/fee evidence');
assert(read('index.html').includes('href="/om-oss#metode"'), 'Homepage must link to methodology without JavaScript');
assert(read('llms.txt').includes('referanseestimater') && read('llms-full.txt').includes('Sist endret:'), 'AI text missing provenance or limitations');
assert(/name="robots" content="noindex"/.test(read('404.html')), '404 must be noindex');
// Core comparison must be present in the delivered HTML, not just after API calls.
const snapshot = JSON.parse(read('data/market-snapshot.json'));
assert.equal(snapshot.version, 1, 'Missing shared market snapshot');
const hasCurrentQuotes = snapshot.quotes.some(q => Date.now() - Date.parse(q.asOf) <= 24 * 3600000);
if (hasCurrentQuotes) {
  assert(read('index.html').includes('id="results-table-compact"') && read('index.html').includes('Beregnet Bitcoin-kjøp for'), 'Homepage prices are not prerendered');
  assert(read('bitcoin-kalkulator.html').includes('id="results-table-compact"'), 'Calculator has no initial price data');
}
if (snapshot.history.points.length > 1) assert(read('bitcoin-kurs.html').includes('Historiske Bitcoin-målinger'), 'Historical observations missing from HTML');
assert(about.includes('id="redaksjon"') && about.includes('id="gebyrkilder"') && about.includes('ingen provisjon'), 'Editorial/fee provenance missing');
assert(!read('index.html').includes('Lagre endringer'), 'Public edit controls must not be rendered');
console.log(`SEO OK: ${urls.size} pages, unique metadata, canonical URLs, links, sitemap and JSON-LD.`);
