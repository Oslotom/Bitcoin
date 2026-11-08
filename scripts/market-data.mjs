// Runs on the build runner, never in a visitor's browser. Only public, fixed endpoints.
export const MAX_QUOTE_AGE_MS = 24 * 60 * 60 * 1000;
export const positive = (value) => ['number', 'string'].includes(typeof value) && Number.isFinite(Number(value)) && Number(value) > 0 ? Number(value) : null;
export const recent = (iso, now) => Number.isFinite(Date.parse(iso)) && Date.parse(iso) <= now + 60_000 && now - Date.parse(iso) <= MAX_QUOTE_AGE_MS;

export async function collectMarketData({ previous, now = Date.now(), fetcher = fetch, includeHistory = true } = {}) {
  const stamp = new Date(now).toISOString();
  const issues = [];
  const cache = new Map();
  const json = (url) => {
    if (!cache.has(url)) cache.set(url, (async () => {
      const res = await fetcher(url, { signal: AbortSignal.timeout(7000), headers: { Accept: 'application/json', 'User-Agent': 'KjopeBitcoin-price-monitor/1.0' } });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return res.json();
    })());
    return cache.get(url);
  };
  const number = (value) => { const n = positive(value); if (!n) throw new Error('Ugyldig pris'); return n; };
  const spotUrl = 'https://api.coinbase.com/v2/prices/BTC-NOK/spot';
  const fx = (currency) => json(`https://api.coinbase.com/v2/prices/${currency}-NOK/spot`).then((v) => number(v.data?.amount));
  const quote = (exchange, priceNok, sourceUrl, basis = 'last', asOf = stamp) => {
    if (!recent(asOf, now)) throw new Error('Pris er eldre enn 24 timer eller har ugyldig tidspunkt');
    return { exchange, priceNok: number(priceNok), asOf, sourceUrl, kind: 'exchange', basis, spreadIncluded: basis === 'ask' };
  };
  const withSpread = (q, bidNok) => positive(bidNok) && Number(bidNok) <= q.priceNok ? { ...q, includedSpreadNok: (q.priceNok - Number(bidNok)) / 2 } : q;
  let reference;
  try { reference = quote('Coinbase', (await json(spotUrl)).data?.amount, spotUrl, 'reference'); }
  catch (error) {
    issues.push({ exchange: 'Coinbase', reason: `Spotkurs: ${error.message}` });
    reference = previous?.quotes?.find((q) => q.exchange === 'Coinbase' && recent(q.asOf, now));
  }
  const jobs = [
    ['Coinbase', async () => { if (!reference) throw new Error('Ingen referansekurs'); return reference; }],
    ['Firi', async () => {
      const url = 'https://api.firi.com/v2/markets/BTCNOK/ticker';
      try { const v = await json(url); if (positive(v.ask)) return withSpread(quote('Firi', v.ask, url, 'ask'), v.bid); } catch { /* Try the separate public market list. */ }
      const marketsUrl = 'https://api.firi.com/v2/markets';
      const markets = await json(marketsUrl);
      return quote('Firi', markets.find((m) => m.id === 'BTCNOK')?.last, marketsUrl);
    }],
    ['NBX', async () => {
      const url = 'https://api.nbx.com/markets/BTC-NOK/trades';
      const trades = await json(url);
      const trade = trades.filter((t) => positive(t.price) && recent(t.createdAt, now)).sort((a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt))[0];
      if (!trade) throw new Error('Ingen nylige handler');
      return quote('NBX', trade.price, url, 'last', trade.createdAt);
    }],
    ['Bare Bitcoin', async () => {
      const url = 'https://api.bb.no/v1/price/nok';
      const v = await json(url);
      // bank.buy includes additional costs; ask is the price before trade fee.
      return withSpread(quote('Bare Bitcoin', v.ask, url, 'ask', v.timestamp || stamp), v.bid);
    }],
    ['Binance', async () => {
      const url = 'https://api.binance.com/api/v3/ticker/bookTicker?symbol=BTCEUR';
      const [v, rate] = await Promise.all([json(url), fx('EUR')]);
      return withSpread(quote('Binance', number(v.askPrice) * rate, url, 'ask'), positive(v.bidPrice) ? Number(v.bidPrice) * rate : null);
    }],
    ['Kraken', async () => {
      const url = 'https://api.kraken.com/0/public/Ticker?pair=XBTUSD';
      const [v, rate] = await Promise.all([json(url), fx('USD')]);
      return withSpread(quote('Kraken', number(v.result?.XXBTZUSD?.a?.[0]) * rate, url, 'ask'), positive(v.result?.XXBTZUSD?.b?.[0]) ? Number(v.result.XXBTZUSD.b[0]) * rate : null);
    }],
    ['Crypto.com', async () => {
      const url = 'https://api.crypto.com/exchange/v1/public/get-tickers';
      const [v, rate] = await Promise.all([json(url), fx('USD')]);
      const tick = v.result?.data?.find((t) => (t.i ?? t.instrument_name) === 'BTC_USDT');
      const q = quote('Crypto.com', number(tick?.a ?? tick?.last_price) * rate, url, positive(tick?.a) ? 'ask' : 'last');
      q.note = 'BTC/USDT omregnet med USD/NOK; USDT/USD er antatt 1 og kan avvike.';
      return q.basis === 'ask' ? withSpread(q, positive(tick?.b) ? Number(tick.b) * rate : null) : q;
    }],
    ...['Revolut', 'BuyBitcoin.com'].map((name) => [name, async () => {
      if (!reference) throw new Error('Ingen referansekurs');
      return { ...reference, exchange: name, kind: 'reference', basis: 'reference', spreadIncluded: false, note: 'Coinbase-referanse, ikke pris fra denne tilbyderen.' };
    }]),
  ];
  const quotes = (await Promise.all(jobs.map(async ([exchange, get]) => {
    try { return await get(); }
    catch (error) {
      issues.push({ exchange, reason: error.message });
      const saved = previous?.quotes?.find((q) => q.exchange === exchange && recent(q.asOf, now));
      if (saved) return saved; // Preserve its real timestamp. Never relabel old data as fresh.
      if (reference) return { ...reference, exchange, kind: 'reference', basis: 'reference', spreadIncluded: false, note: 'Børspris utilgjengelig; beregnet med Coinbase-referanse.' };
      return null;
    }
  }))).filter(Boolean);

  let history = previous?.history ?? { sourceUrl: 'https://api.coingecko.com/api/v3/coins/bitcoin/market_chart?vs_currency=nok&days=30', asOf: null, points: [] };
  if (includeHistory && (!history.asOf || now - Date.parse(history.asOf) > 6 * 60 * 60 * 1000)) {
    try {
      const url = 'https://api.coingecko.com/api/v3/coins/bitcoin/market_chart?vs_currency=nok&days=30';
      const v = await json(url);
      const days = new Map();
      for (const [timestamp, price] of v.prices ?? []) {
        if (positive(price) && timestamp <= now + 60_000 && timestamp >= now - 32 * 86400000) days.set(new Date(timestamp).toISOString().slice(0, 10), { timestamp, price: Number(price) });
      }
      if (days.size < 2) throw new Error('For få historiske målinger');
      history = { sourceUrl: url, asOf: stamp, points: [...days.values()].sort((a, b) => a.timestamp - b.timestamp) };
    } catch (error) {
      issues.push({ exchange: 'Historikk', reason: error.message });
      // A documented historical-price endpoint, not today's rate repeated on past dates.
      if (history.points.length < 2) {
        const points = [];
        for (let day = 7; day >= 1; day--) {
          const date = new Date(now - day * 86400000).toISOString().slice(0, 10);
          try { const v = await json(`${spotUrl}?date=${date}`); points.push({ timestamp: Date.parse(`${date}T00:00:00Z`), price: number(v.data?.amount) }); } catch { /* Missing days remain missing. */ }
        }
        history = { sourceUrl: 'https://docs.cdp.coinbase.com/coinbase-business/track-apis/prices', asOf: stamp, points };
      }
    }
  }
  return { version: 1, generatedAt: stamp, quotes, issues, history };
}
