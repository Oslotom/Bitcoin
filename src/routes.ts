export type Page = 'home' | 'live' | 'overview' | 'platforms' | 'norway' | 'contact' | 'all';

export const PAGE_PATHS: Partial<Record<Page, string>> = {
  home: '/',
  live: '/sammenlign',
  all: '/alle-borser',
  norway: '/norske-borser',
  overview: '/guide',
  contact: '/kontakt',
};

export const PAGE_TITLES: Partial<Record<Page, string>> = {
  home: 'Kjøpe Bitcoin i Norge | Se Live Bitcoin Kurs & Pris (2026)',
  live: 'Sammenlign Bitcoin priser og gebyrer live | KjøpeBitcoin.no',
  all: 'Alle kryptobørser – gebyrer og priser | KjøpeBitcoin.no',
  norway: 'Norske kryptobørser for Bitcoin (2026) | KjøpeBitcoin.no',
  overview: 'Guide: Slik kjøper du Bitcoin trygt i Norge | KjøpeBitcoin.no',
  contact: 'Kontakt oss | KjøpeBitcoin.no',
};

export const PAGE_DESCRIPTIONS: Partial<Record<Page, string>> = {
  home: 'Finn beste Bitcoin pris i Norge. Sammenlign live Bitcoin kurs og gebyrer fra Firi, Bare Bitcoin, NBX, Kraken og Binance. Guide til å kjøpe Bitcoin i Norge trygt.',
  live: 'Regn ut hvor mye Bitcoin du får for pengene hos Firi, Bare Bitcoin, NBX, Kraken, Binance og flere – etter gebyrer og spread.',
  all: 'Oversikt over norske og internasjonale kryptobørser med handelsgebyr, spread og betalingsmetoder for kjøp av Bitcoin.',
  norway: 'Sammenlign norske kryptobørser registrert hos Finanstilsynet: Firi, Bare Bitcoin, NBX og flere. BankID, Vipps og skatterapport.',
  overview: 'Steg-for-steg guide til å kjøpe Bitcoin i Norge: velg børs, verifiser med BankID, sett inn penger og oppbevar Bitcoin trygt.',
  contact: 'Ta kontakt med KjøpeBitcoin.no for spørsmål, tilbakemeldinger eller samarbeid.',
};

export const pageFromPath = (path: string): Page => {
  // /guide, /guide/ og /guide.html (den forhåndsrendrede filen) er samme side
  const normalized = path.replace(/\.html$/, '').replace(/\/+$/, '') || '/';
  const match = (Object.keys(PAGE_PATHS) as Page[]).find((page) => PAGE_PATHS[page] === normalized);
  return match ?? 'home';
};
