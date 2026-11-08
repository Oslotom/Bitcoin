import { Exchange } from '../types';

export interface FeeEvidence {
  sourceUrl: string;
  checkedAt: string | null;
  accountType: string;
  tradeVerified: boolean;
  spreadKind: 'estimate' | 'unknown';
  note: string;
}

// Rates describe the named scenario, not every account or payment method at an exchange.
export const EXCHANGE_FEES: Record<Exchange, { trade: number; spread: number }> = {
  [Exchange.Firi]: { trade: 0.007, spread: 0 },
  [Exchange.NBX]: { trade: 0.007, spread: 0.001 },
  [Exchange.BareBitcoin]: { trade: 0.007, spread: 0.0015 },
  [Exchange.Binance]: { trade: 0.001, spread: 0.001 },
  [Exchange.Kraken]: { trade: 0.004, spread: 0.001 },
  [Exchange.Coinbase]: { trade: 0.006, spread: 0.001 },
  [Exchange.Revolut]: { trade: 0, spread: 0.02 },
  [Exchange.CryptoCom]: { trade: 0.005, spread: 0 },
  [Exchange.BuyBitcoin]: { trade: 0.01, spread: 0.015 },
};

export const FEE_EVIDENCE: Record<Exchange, FeeEvidence> = {
  [Exchange.Firi]: { sourceUrl: 'https://firi.com/no/om-oss/priser', checkedAt: '2026-11-08', accountType: 'Vanlig handel, innskudd fra bank', tradeVerified: true, spreadKind: 'unknown', note: '0,7 % kurtasje. Modellen legger ikke til ekstra spread når kjøpskurs brukes. 0 % ekstra betyr ikke at børsens spread er null. Vipps/kort koster ekstra.' },
  [Exchange.NBX]: { sourceUrl: 'https://nbx.com/en/tpor', checkedAt: '2026-11-08', accountType: 'Standardkunde, 0,70 % maker/taker', tradeVerified: true, spreadKind: 'estimate', note: 'Standardgebyret er 0,70 %. 0,10 % spread er en modellforutsetning, ikke et bekreftet tilbud. Siste handel er ikke nødvendigvis dagens kjøpskurs.' },
  [Exchange.BareBitcoin]: { sourceUrl: 'https://barebitcoin.no/avgifter', checkedAt: '2026-11-08', accountType: 'Standard uten bb+, bank', tradeVerified: true, spreadKind: 'estimate', note: '0,7 % handelsavgift. 0,15 % ensidig spread bygger på tilbyderens historiske gjennomsnitt, ikke en garantert sats. Ved bruk av ask-kurs legges spread ikke til en gang til.' },
  [Exchange.Binance]: { sourceUrl: 'https://www.binance.com/en/fee/trading', checkedAt: '2026-11-08', accountType: 'Spot, vanlig kunde uten BNB-rabatt', tradeVerified: true, spreadKind: 'estimate', note: '0,10 % ordinær spotavgift. Modellen bruker 0,10 % estimert spread med mindre ask-kurs allerede er brukt. NOK/EUR-veksling er ikke med.' },
  [Exchange.Kraken]: { sourceUrl: 'https://support.kraken.com/articles/204799657-kraken-fee-credits-kfee-', checkedAt: '2026-11-08', accountType: 'Kraken Pro, høyeste ordinære spot-taker-sats', tradeVerified: true, spreadKind: 'estimate', note: '0,40 % taker i valgt Pro-scenario. Enkelkjøp i Kraken-appen har andre priser. 0,10 % spread er estimert når ask ikke er brukt. Valutaveksling kommer i tillegg.' },
  [Exchange.Coinbase]: { sourceUrl: 'https://help.coinbase.com/en-gb/coinbase/trading-and-funding/advanced-trade/what-is-advanced-trade', checkedAt: '2026-11-08', accountType: 'Coinbase Advanced, scenario med 0,60 % taker', tradeVerified: true, spreadKind: 'estimate', note: 'Et Advanced-scenario på 0,60 %, ikke prisen for enkelkjøp i Coinbase-appen. Faktisk kontosats må kontrolleres innlogget. 0,10 % spread er estimert.' },
  [Exchange.Revolut]: { sourceUrl: 'https://www.revolut.com/en-NO/legal/exchangingcryptocurrenciespersonalfees/', checkedAt: null, accountType: 'Ubekreftet modell, ikke en bestemt abonnementstype', tradeVerified: false, spreadKind: 'unknown', note: '2 % samlet modellpåslag er ikke en kontrollert gebyrsats for norske kunder. Minimumsgebyr, abonnement og volum kan endre prisen. Brukes kun som illustrasjon.' },
  [Exchange.CryptoCom]: { sourceUrl: 'https://crypto.com/exchange/document/fees-limits', checkedAt: null, accountType: 'Ubekreftet modell', tradeVerified: false, spreadKind: 'unknown', note: '0,50 % er en modellforutsetning, ikke en nylig bekreftet kontosats. App og Exchange har ulike priser. Null ekstra spread betyr ikke spreadfri handel.' },
  [Exchange.BuyBitcoin]: { sourceUrl: 'https://buybitcoin.com/', checkedAt: null, accountType: 'Ubekreftet modell', tradeVerified: false, spreadKind: 'unknown', note: '1 % gebyr og 1,5 % spread er ikke nylig bekreftet hos tilbyderen. Brukes kun som illustrasjon, ikke som et kjøpstilbud.' },
};

export const FIRI_VIPPS_FEE = 0.039;
