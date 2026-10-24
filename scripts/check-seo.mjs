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
assert(/name="robots" content="noindex"/.test(read('404.html')), '404 must be noindex');
console.log(`SEO OK: ${urls.size} pages, unique metadata, canonical URLs, links, sitemap and JSON-LD.`);
