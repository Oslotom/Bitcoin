export type Page =
  | 'home'
  | 'overview'
  | 'norway'
  | 'price'
  | 'vipps'
  | 'firiNbx'
  | 'tax'
  | 'about'
  | 'calculator'
  | 'firiBare'
  | 'nbxBare'
  | 'research';

export const PAGE_PATHS: Partial<Record<Page, string>> = {
  home: '/',
  price: '/bitcoin-kurs',
  norway: '/norske-borser',
  firiNbx: '/firi-vs-nbx',
  vipps: '/kjope-bitcoin-med-vipps',
  overview: '/guide',
  tax: '/bitcoin-skatt',
  about: '/om-oss',
  calculator: '/bitcoin-kalkulator',
  firiBare: '/firi-vs-bare-bitcoin',
  nbxBare: '/nbx-vs-bare-bitcoin',
  research: '/prissammenligning-bitcoin',
};

export const PAGE_TITLES: Partial<Record<Page, string>> = {
  home: 'Kjøpe Bitcoin i Norge – sammenlign børser og gebyrer',
  price: 'Bitcoin kurs i NOK – pris, historikk og omregning | KjøpeBitcoin.no',
  norway: 'Norske kryptobørser for Bitcoin (2026) | KjøpeBitcoin.no',
  firiNbx: 'Firi vs NBX (2026): gebyrer og hvem er billigst? | KjøpeBitcoin.no',
  vipps: 'Kjøpe Bitcoin med Vipps – gebyrer og fremgangsmåte | KjøpeBitcoin.no',
  overview: 'Hvordan kjøpe Bitcoin i Norge? Guide steg for steg | KjøpeBitcoin.no',
  tax: 'Skatt på Bitcoin i Norge – slik fungerer det | KjøpeBitcoin.no',
  about: 'Om KjøpeBitcoin.no – slik sammenligner vi | KjøpeBitcoin.no',
  calculator: 'Bitcoin-kalkulator: hvor mye BTC får du for pengene? | KjøpeBitcoin.no',
  firiBare: 'Firi vs Bare Bitcoin – kostnader, betaling og forskjeller | KjøpeBitcoin.no',
  nbxBare: 'NBX vs Bare Bitcoin – gebyrer og kjøpspris | KjøpeBitcoin.no',
  research: 'Hva koster Bitcoin-kjøp på 1 000, 10 000 og 50 000 kr? | KjøpeBitcoin.no',
};

export const PAGE_DESCRIPTIONS: Partial<Record<Page, string>> = {
  home: 'Skal du kjøpe Bitcoin? Sammenlign børser, gebyrer og estimert spread hos Firi, NBX, Bare Bitcoin og flere. Se hva du får for pengene og hvordan du kommer i gang.',
  price: 'Se daterte Bitcoin-priser i norske kroner, kurshistorikk og BTC/NOK-omregning. Sammenlign beregnet kjøpspris hos norske og internasjonale børser.',
  norway: 'Firi, NBX eller Bare Bitcoin? Sammenlign norske Bitcoin-børser, beregnede kostnader og tjenester. Les hva du bør sjekke om tillatelse, betaling og uttak.',
  firiNbx: 'Firi eller NBX? Se kontrollerte handelsgebyrer, forskjeller i tjenester og en datert beregning for Bitcoin-kjøp med samme beløp.',
  vipps: 'Slik kjøper du Bitcoin med Vipps i Norge. Se hvor mye ekstra Vipps-innskudd koster sammenlignet med bankoverføring, og hvilke børser som støtter Vipps.',
  overview: 'Steg-for-steg guide til å kjøpe Bitcoin i Norge: velg børs, verifiser med BankID, sett inn penger og oppbevar Bitcoin trygt.',
  tax: 'Gevinst på Bitcoin skattes som alminnelig inntekt i Norge, og tap gir fradrag. Les hvordan skatt på kryptovaluta fungerer, og hva du må føre i skattemeldingen.',
  about: 'Hvem står bak KjøpeBitcoin.no, hvor prisene hentes fra, og hvordan vi regner ut hva det faktisk koster å kjøpe Bitcoin hos hver børs.',
  calculator: 'Regn ut hvor mye Bitcoin du kan få for 1 000, 10 000 kr eller ditt eget beløp. Sammenlign gebyrer og omregn mellom BTC og norske kroner.',
  firiBare: 'Firi eller Bare Bitcoin? Sammenlign standardgebyrer, daterte kjøpspriser, Vipps og bank. Se kilder og hva beregningene inkluderer.',
  nbxBare: 'Se forskjellen mellom NBX og Bare Bitcoin: handelsgebyr, spread og beregnet mengde BTC for samme beløp, med kilder og metode.',
  research: 'Et etterprøvbart regnestykke for Bitcoin-kjøp på 1 000, 10 000 og 50 000 kroner. Datert prisgrunnlag, kilder og tydelige begrensninger.',
};

// Sider som er redaksjonelle artikler (får Article-schema ved forhåndsrendring)
export const ARTICLE_PAGES: Page[] = ['overview', 'price', 'firiNbx', 'vipps', 'tax', 'firiBare', 'nbxBare', 'research'];

// Første publiseringsdato. dateModified hentes fra git-historikken.
export const ARTICLE_PUBLISHED: Partial<Record<Page, string>> = {
  overview: '2026-04-16',
  price: '2026-10-06',
  firiNbx: '2026-10-06',
  vipps: '2026-10-06',
  tax: '2026-10-06',
  firiBare: '2026-11-08',
  nbxBare: '2026-11-08',
  research: '2026-11-08',
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
