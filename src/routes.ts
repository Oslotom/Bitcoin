export type Page =
  | 'home'
  | 'overview'
  | 'norway'
  | 'price'
  | 'vipps'
  | 'firiNbx'
  | 'tax'
  | 'about';

export const PAGE_PATHS: Partial<Record<Page, string>> = {
  home: '/',
  price: '/bitcoin-kurs',
  norway: '/norske-borser',
  firiNbx: '/firi-vs-nbx',
  vipps: '/kjope-bitcoin-med-vipps',
  overview: '/guide',
  tax: '/bitcoin-skatt',
  about: '/om-oss',
};

export const PAGE_TITLES: Partial<Record<Page, string>> = {
  home: 'Kjøpe Bitcoin i Norge (2026) – sammenlign pris og gebyrer',
  price: 'Bitcoin kurs i dag i NOK – live pris fra norske børser | KjøpeBitcoin.no',
  norway: 'Norske kryptobørser for Bitcoin (2026) | KjøpeBitcoin.no',
  firiNbx: 'Firi vs NBX (2026): gebyrer og hvem er billigst? | KjøpeBitcoin.no',
  vipps: 'Kjøpe Bitcoin med Vipps – gebyrer og fremgangsmåte | KjøpeBitcoin.no',
  overview: 'Guide: Slik kjøper du Bitcoin trygt i Norge | KjøpeBitcoin.no',
  tax: 'Skatt på Bitcoin i Norge – slik fungerer det | KjøpeBitcoin.no',
  about: 'Om KjøpeBitcoin.no – slik sammenligner vi | KjøpeBitcoin.no',
};

export const PAGE_DESCRIPTIONS: Partial<Record<Page, string>> = {
  home: 'Hvor er det billigst å kjøpe Bitcoin i Norge? Sammenlign live pris, gebyr og spread hos Firi, NBX, Bare Bitcoin, Kraken og Binance – og se hva du faktisk får.',
  price: 'Se Bitcoin kursen i norske kroner akkurat nå, hentet live fra Firi, NBX, Bare Bitcoin, Kraken, Binance og flere. Forstå hvorfor prisen varierer mellom børsene.',
  norway: 'Sammenlign norske kryptobørser registrert hos Finanstilsynet: Firi, Bare Bitcoin, NBX og flere. BankID, Vipps og skatterapport.',
  firiNbx: 'Firi eller NBX? Vi sammenligner handelsgebyr, spread og funksjoner hos de to norske kryptobørsene, med live regnestykke for kjøp av Bitcoin.',
  vipps: 'Slik kjøper du Bitcoin med Vipps i Norge. Se hvor mye ekstra Vipps-innskudd koster sammenlignet med bankoverføring, og hvilke børser som støtter Vipps.',
  overview: 'Steg-for-steg guide til å kjøpe Bitcoin i Norge: velg børs, verifiser med BankID, sett inn penger og oppbevar Bitcoin trygt.',
  tax: 'Gevinst på Bitcoin skattes som alminnelig inntekt i Norge, og tap gir fradrag. Les hvordan skatt på kryptovaluta fungerer, og hva du må føre i skattemeldingen.',
  about: 'Hvem står bak KjøpeBitcoin.no, hvor prisene hentes fra, og hvordan vi regner ut hva det faktisk koster å kjøpe Bitcoin hos hver børs.',
};

// Sider som er redaksjonelle artikler (får Article-schema ved forhåndsrendring)
export const ARTICLE_PAGES: Page[] = ['overview', 'price', 'firiNbx', 'vipps', 'tax'];

// Første publiseringsdato (datePublished i Article-schema). dateModified settes til byggedato.
export const ARTICLE_PUBLISHED: Partial<Record<Page, string>> = {
  overview: '2026-04-16',
  price: '2026-10-06',
  firiNbx: '2026-10-06',
  vipps: '2026-10-06',
  tax: '2026-10-06',
};

// Nedlagte sider -> sidene som overtok innholdet. Ved bygg blir de til
// omdirigeringssider (meta refresh + canonical), som Google behandler som 301.
export const REDIRECTS: Record<string, Page> = {
  '/sammenlign': 'home',
  '/alle-borser': 'norway',
  '/kontakt': 'about',
};

export const pageFromPath = (path: string): Page => {
  // /guide, /guide/ og /guide.html (den forhåndsrendrede filen) er samme side
  const normalized = path.replace(/\.html$/, '').replace(/\/+$/, '') || '/';
  if (REDIRECTS[normalized]) return REDIRECTS[normalized];
  const match = (Object.keys(PAGE_PATHS) as Page[]).find((page) => PAGE_PATHS[page] === normalized);
  return match ?? 'home';
};
