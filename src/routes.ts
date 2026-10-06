export type Page =
  | 'home'
  | 'live'
  | 'overview'
  | 'platforms'
  | 'norway'
  | 'contact'
  | 'all'
  | 'price'
  | 'vipps'
  | 'firiNbx'
  | 'tax'
  | 'about';

export const PAGE_PATHS: Partial<Record<Page, string>> = {
  home: '/',
  live: '/sammenlign',
  price: '/bitcoin-kurs',
  all: '/alle-borser',
  norway: '/norske-borser',
  firiNbx: '/firi-vs-nbx',
  vipps: '/kjope-bitcoin-med-vipps',
  overview: '/guide',
  tax: '/bitcoin-skatt',
  about: '/om-oss',
  contact: '/kontakt',
};

export const PAGE_TITLES: Partial<Record<Page, string>> = {
  home: 'Kjøpe Bitcoin i Norge | Se Live Bitcoin Kurs & Pris (2026)',
  live: 'Sammenlign Bitcoin priser og gebyrer live | KjøpeBitcoin.no',
  price: 'Bitcoin kurs i dag i NOK – live pris fra norske børser | KjøpeBitcoin.no',
  all: 'Alle kryptobørser – gebyrer og priser | KjøpeBitcoin.no',
  norway: 'Norske kryptobørser for Bitcoin (2026) | KjøpeBitcoin.no',
  firiNbx: 'Firi vs NBX (2026): gebyrer og hvem er billigst? | KjøpeBitcoin.no',
  vipps: 'Kjøpe Bitcoin med Vipps – gebyrer og fremgangsmåte | KjøpeBitcoin.no',
  overview: 'Guide: Slik kjøper du Bitcoin trygt i Norge | KjøpeBitcoin.no',
  tax: 'Skatt på Bitcoin i Norge – slik fungerer det | KjøpeBitcoin.no',
  about: 'Om KjøpeBitcoin.no – slik sammenligner vi | KjøpeBitcoin.no',
  contact: 'Kontakt oss | KjøpeBitcoin.no',
};

export const PAGE_DESCRIPTIONS: Partial<Record<Page, string>> = {
  home: 'Finn beste Bitcoin pris i Norge. Sammenlign live Bitcoin kurs og gebyrer fra Firi, Bare Bitcoin, NBX, Kraken og Binance. Guide til å kjøpe Bitcoin i Norge trygt.',
  live: 'Regn ut hvor mye Bitcoin du får for pengene hos Firi, Bare Bitcoin, NBX, Kraken, Binance og flere – etter gebyrer og spread.',
  price: 'Se Bitcoin kursen i norske kroner akkurat nå, hentet live fra Firi, NBX, Bare Bitcoin, Kraken, Binance og flere. Forstå hvorfor prisen varierer mellom børsene.',
  all: 'Oversikt over norske og internasjonale kryptobørser med handelsgebyr, spread og betalingsmetoder for kjøp av Bitcoin.',
  norway: 'Sammenlign norske kryptobørser registrert hos Finanstilsynet: Firi, Bare Bitcoin, NBX og flere. BankID, Vipps og skatterapport.',
  firiNbx: 'Firi eller NBX? Vi sammenligner handelsgebyr, spread og funksjoner hos de to norske kryptobørsene, med live regnestykke for kjøp av Bitcoin.',
  vipps: 'Slik kjøper du Bitcoin med Vipps i Norge. Se hvor mye ekstra Vipps-innskudd koster sammenlignet med bankoverføring, og hvilke børser som støtter Vipps.',
  overview: 'Steg-for-steg guide til å kjøpe Bitcoin i Norge: velg børs, verifiser med BankID, sett inn penger og oppbevar Bitcoin trygt.',
  tax: 'Gevinst på Bitcoin skattes som alminnelig inntekt i Norge, og tap gir fradrag. Les hvordan skatt på kryptovaluta fungerer, og hva du må føre i skattemeldingen.',
  about: 'Hvem står bak KjøpeBitcoin.no, hvor prisene hentes fra, og hvordan vi regner ut hva det faktisk koster å kjøpe Bitcoin hos hver børs.',
  contact: 'Ta kontakt med KjøpeBitcoin.no for spørsmål, tilbakemeldinger eller samarbeid.',
};

// Sider som er redaksjonelle artikler (får Article-schema ved forhåndsrendring)
export const ARTICLE_PAGES: Page[] = ['overview', 'price', 'firiNbx', 'vipps', 'tax'];

export const pageFromPath = (path: string): Page => {
  // /guide, /guide/ og /guide.html (den forhåndsrendrede filen) er samme side
  const normalized = path.replace(/\.html$/, '').replace(/\/+$/, '') || '/';
  const match = (Object.keys(PAGE_PATHS) as Page[]).find((page) => PAGE_PATHS[page] === normalized);
  return match ?? 'home';
};
