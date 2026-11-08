import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { collectMarketData } from './market-data.mjs';

let previous;
try { previous = JSON.parse(await readFile('src/data/market-snapshot.json', 'utf8')); } catch { /* First build. */ }
if (process.env.MARKET_PREVIOUS_URL) {
  const url = new URL(process.env.MARKET_PREVIOUS_URL);
  if (url.origin !== 'https://www.xn--kjpebitcoin-hgb.no' || url.pathname !== '/data/market-snapshot.json') throw new Error('Ugyldig forrige prisfil');
  try {
    const r = await fetch(url, { signal: AbortSignal.timeout(7000), cache: 'no-store' });
    if (r.ok) { const saved = await r.json(); if (saved.version === 1 && Date.parse(saved.generatedAt) > (Date.parse(previous?.generatedAt ?? '') || 0)) previous = saved; }
  } catch { /* Keep local last-successful data. */ }
}
const snapshot = await collectMarketData({ previous });
if (!snapshot.quotes.length) throw new Error('Ingen gyldige priser. Bygget stoppes slik at sist publiserte versjon bevares.');
await mkdir('src/data', { recursive: true });
await mkdir('public/data', { recursive: true });
const json = JSON.stringify(snapshot, null, 2) + '\n';
await writeFile('src/data/market-snapshot.json', json);
await writeFile('public/data/market-snapshot.json', json);
console.log(`Lagret ${snapshot.quotes.length} prisgrunnlag og ${snapshot.history.points.length} historiske observasjoner. ${snapshot.issues.length} kildeavvik.`);
for (const issue of snapshot.issues) console.log(`${issue.exchange}: ${issue.reason}`);
