import React, { useState, useMemo, useRef, useEffect } from 'react';
import { Search, X, FileText, HelpCircle, ArrowRight, CornerDownRight, ExternalLink } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Exchange } from '../types';

interface SearchSectionProps {
  setCurrentPage: (page: 'home' | 'live' | 'overview' | 'platforms') => void;
}

interface SearchItem {
  id: string;
  type: 'platform' | 'faq' | 'page';
  title: string;
  description: string;
  keywords: string[];
  payload?: any;
}

export default function SearchSection({ setCurrentPage }: SearchSectionProps) {
  const [query, setQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [selectedItem, setSelectedItem] = useState<SearchItem | null>(null);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  // Close search suggestion box when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
        setIsFocused(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const searchIndex: SearchItem[] = useMemo(() => [
    // Pages
    {
      id: 'page-home',
      type: 'page',
      title: 'Kalkulator & Sammenligning',
      description: 'Gå til forsiden for å sammenligne priser på Bitcoin basert på ønsket beløp.',
      keywords: ['hjem', 'home', 'kalkulator', 'pris', 'sammenlign', 'kalkuler', 'forside'],
      payload: { targetPage: 'home' }
    },
    {
      id: 'page-live',
      type: 'page',
      title: 'Live Markedsscan',
      description: 'Se hele oversikten over live kurser, spredning og gebyrer i sanntid.',
      keywords: ['live', 'markedsscan', 'pris', 'kurser', 'sanntid', 'børser', 'tabell', 'gebyr'],
      payload: { targetPage: 'live' }
    },
    {
      id: 'page-platforms',
      type: 'page',
      title: 'Børser & Omtaler',
      description: 'Les dype analyser, anmeldelser, fordeler og ulemper for alle støttede børser.',
      keywords: ['plattformer', 'børser', 'omtaler', 'firi', 'nbx', 'bare bitcoin', 'coinbase', 'binance', 'kraken', 'revolut', 'anmeldelse', 'erfaringer'],
      payload: { targetPage: 'platforms' }
    },
    {
      id: 'page-overview',
      type: 'page',
      title: 'Kunnskapssenter & Guide',
      description: 'Omfattende guide om hvordan du kjøper Bitcoin trygt, skatteregler og sikkerhet.',
      keywords: ['oversikt', 'guide', 'lær', 'kunnskap', 'skatt', 'sikkerhet', 'faq', 'hvordan', 'bankid'],
      payload: { targetPage: 'overview' }
    },
    // Platforms / Exchanges
    {
      id: 'platform-firi',
      type: 'platform',
      title: 'Firi',
      description: 'Norges største kryptobørs. Registrert hos Finanstilsynet, tilbyr enkel registrering med BankID og raske innskudd med Vipps.',
      keywords: ['firi', 'norsk', 'vipps', 'bankid', 'registrer', 'skatterapport', 'innskudd'],
      payload: {
        link: 'https://firi.com',
        fees: 'Vipps: 2.3%, Kort: 2.1%, Bank: Gratis. Handelsgebyr: 0.7%',
        spread: 'Ca. 0.35% - 0.7%',
        pros: ['Finanstilsynet-registrert', 'Vipps-innskudd på sekunder', 'Automatisk skatteberegning', 'BankID'],
        cons: ['Noe høyere handelsgebyr enn globale giganter', 'Kun tilgjengelig i Norden']
      }
    },
    {
      id: 'platform-barebitcoin',
      type: 'platform',
      title: 'Bare Bitcoin',
      description: 'Norsk spesialist-app eksklusivt for Bitcoin. Lynrask, ekstremt sikker, og optimert for månedlig sparing (DCA) med Lightning Network.',
      keywords: ['bare bitcoin', 'norsk', 'lightning', 'sparing', 'dca', 'spesialist', 'app'],
      payload: {
        link: 'https://barebitcoin.no',
        fees: 'Handelsgebyr: 0.5% for kjøp/salg.',
        spread: 'Svært lav, typisk rundt 0.25% - 0.4%',
        pros: ['Ekte bitcoin-fokus og Lightning Support', 'Ypperlig for faste spareavtaler (DCA)', 'Enkel BankID-pålogging', 'Meget lav spread'],
        cons: ['Kun Bitcoin (støtter ikke andre kryptovalutaer)', 'Ingen Vipps-støtte direkte i appen']
      }
    },
    {
      id: 'platform-nbx',
      type: 'platform',
      title: 'Norwegian Block Exchange (NBX)',
      description: 'Norsk Lisensiert kryptobørs av Finanstilsynet. Tilbyr BankID, kredittkort med cashback, og avanserte handelsgrensesnitt for proffer.',
      keywords: ['nbx', 'norwegian block exchange', 'norsk', 'kredittkort', 'cashback', 'finanstilsynet'],
      payload: {
        link: 'https://nbx.com',
        fees: 'Handelsgebyr: 0.5%. Kort/Vipps: 2.0% - 2.5%.',
        spread: 'Ca. 0.4% - 0.8%',
        pros: ['BankID og full regulering i Norge', 'Kredittkort med krypto-cashback', 'Avansert handelsplattform (orderbook)', 'God likviditet'],
        cons: ['Kan virke noe mer komplisert enn Firi for nybegynnere', 'Spread kan øke under lavt volum']
      }
    },
    {
      id: 'platform-coinbase',
      type: 'platform',
      title: 'Coinbase',
      description: 'Verdens mest kjente og børsnoterte amerikanske plattform. Ekstremt brukervennlig grensesnitt som passer utmerket for nybegynnere.',
      keywords: ['coinbase', 'global', 'amerikansk', 'enkel', 'brukervennlig', 'app', 'børsnotert'],
      payload: {
        link: 'https://www.coinbase.com',
        fees: 'Coinbase Advanced: 0.4% - 0.6%. Standard kjøp: Opptil 1.5% - 3.99%.',
        spread: 'Ca. 0.5% - 1.0%',
        pros: ['Særdeles enkelt brukergrensesnitt', 'Høyeste sikkerhetsstandard globalt', 'Børsnotert i USA (NASDAQ: COIN)'],
        cons: ['Høye gebyrer på standard lynkjøp', 'Dyr valutaveksling NOK/USD', 'Ingen BankID eller integrasjon med Skatteetaten']
      }
    },
    {
      id: 'platform-binance',
      type: 'platform',
      title: 'Binance',
      description: 'Verdens desidert største kryptobørs målt i handelsvolum. Tilbyr markedets laveste gebyrer, hundrevis av coins og avanserte verktøy.',
      keywords: ['binance', 'global', 'lavest gebyr', 'avansert', 'størst', 'trading', 'volum'],
      payload: {
        link: 'https://www.binance.com',
        fees: 'Handelsgebyr: Kun 0.1% (eller mindre hvis du bruker BNB).',
        spread: 'Ekstremt lav spread, ofte under 0.05%',
        pros: ['Laveste gebyrer i bransjen', 'Enorm likviditet og rask utførelse', 'Gigantisk utvalg av finesser og krypto'],
        cons: ['Komplisert grensesnitt for nybegynnere', 'Uregulert i Norge (valutafare)', 'Manuell skatteberegning nødvendig']
      }
    },
    {
      id: 'platform-kraken',
      type: 'platform',
      title: 'Kraken',
      description: 'Historisk og høyt respektert global kryptobørs kjent for legendarisk sikkerhet, god kundeservice og profesjonelle verktøy.',
      keywords: ['kraken', 'global', 'sikkerhet', 'pro', 'support', 'euro', 'innskudd'],
      payload: {
        link: 'https://www.kraken.com',
        fees: 'Kraken Pro: 0.16% maker / 0.26% taker. Instant buy: 1.5%.',
        spread: 'Ca. 0.15% - 0.3% (Pro)',
        pros: ['Aldri blitt hacket (eksepsjonell historikk)', 'Gode gebyrer på Kraken Pro', '24/7 profesjonell livechat'],
        cons: ['Krav om SEPA-overføring i EUR eller USD', 'Vanskeligere å sette inn NOK direkte', 'Ikke integrert med norske myndigheter']
      }
    },
    // FAQs
    {
      id: 'faq-guide',
      type: 'faq',
      title: 'Hvordan kjøper man Bitcoin i Norge?',
      description: 'Opprett konto på registrert børs, logg inn med BankID, sett inn NOK med Vipps/bank, og klikk kjøp.',
      keywords: ['hvordan', 'kjøpe', 'norge', 'steg', 'bank', 'overføring', 'komme i gang'],
      payload: {
        answer: 'Prosessen er enkel: 1. Velg en registrert norsk børs som Bare Bitcoin, Firi eller NBX. 2. Opprett konto ved å signere raskt med BankID. 3. Sett inn norske kroner (NOK) via bankoverføring, straksinnskudd eller Vipps. 4. Gjennomfør handelen når pengene er på konto. 5. Overfør din Bitcoin til din egen maskinvare-lommebok (tredjeparts cold-wallet) hvis du skal eie den over lang tid.'
      }
    },
    {
      id: 'faq-vipps',
      type: 'faq',
      title: 'Går det an å eie Bitcoin ved hjelp av Vipps?',
      description: 'Ja, norske børser som Firi og NBX støtter direkte kjøp og innskudd med Vipps på sekunder.',
      keywords: ['vipps', 'enkelt', 'mobil', 'mobilbetaling', 'app-innskudd', 'straks'],
      payload: {
        answer: 'Absolutt! Norske plattformer tilbyr integrering av Vipps direkte i innloggingen. Det betyr at du fyller på saldoen på sekunder. Husk at Vipps-innskudd ofte belastes med et gebyr (typisk rundt 2-2.3%) på grunn av høye transaksjonskostnader fra Vipps, så standard bankoverføring er billigere.'
      }
    },
    {
      id: 'faq-tax',
      type: 'faq',
      title: 'Hvordan fungerer skatt og avgifter på Bitcoin?',
      description: 'I Norge skattelegges gevinster som kapitalinntekt (22%), og norske børser rapporterer automatisk.',
      keywords: ['skatt', 'skatteetaten', 'rapportering', 'tap', 'fradrag', 'formue', 'gevinst'],
      payload: {
        answer: 'Gevinst ved realisasjon (salg eller veksling) av Bitcoin skal beskattes som alminnelig inntekt (p.t. 22% skattesats). Du har også krav på tilsvarende fradrag for eventuelle tap. Formuesverdi per 31. desember skal også oppgis. Norske børser (som Firi) rapporterer automatisk dine beholdninger og gevinster direkte til Skatteetaten, så de dukker opp ferdig utfylt i skattemeldingen!'
      }
    },
    {
      id: 'faq-security',
      type: 'faq',
      title: 'Er det trygt å investere i krypto i Norge?',
      description: 'Det er helt trygt så lenge du bruker børser som er registrert hos det norske Finanstilsynet.',
      keywords: ['sikker', 'lovlig', 'finanstilsynet', 'svindel', 'trygghet', 'regulering'],
      payload: {
        answer: 'Det er fullt lovlig og generelt sikkert om du foretar handelen via en plattform registrert hos det norske Finanstilsynet. Dette garanterer at foretaket overholder strenge krav til hvitvasking, kundekontroll (KYC) og sikker oppbevaring av kundenes midler. For optimal sikkerhet anbefales det å sende egne coins til en privat maskinvarelommebok (f.eks. Ledger eller Trezor).'
      }
    }
  ], []);

  // Filter items matching the query text
  const results = useMemo(() => {
    if (!query.trim()) return [];
    const normalizedQuery = query.toLowerCase().trim();
    return searchIndex.filter((item) => {
      const matchTitle = item.title.toLowerCase().includes(normalizedQuery);
      const matchDesc = item.description.toLowerCase().includes(normalizedQuery);
      const matchKeywords = item.keywords.some(keyword => keyword.includes(normalizedQuery));
      return matchTitle || matchDesc || matchKeywords;
    }).slice(0, 6);
  }, [query, searchIndex]);

  const handleSelectResult = (item: SearchItem) => {
    if (item.type === 'page') {
      setCurrentPage(item.payload.targetPage);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      setQuery('');
      setIsFocused(false);
    } else {
      setSelectedItem(item);
    }
  };

  return (
    <div id="search-section-root" className="w-full max-w-xl mx-auto px-4 mt-4" ref={searchContainerRef}>
      <div className="space-y-1.5 text-center mb-4">
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">Finn svar raskt</p>
        <h3 className="text-sm font-bold text-slate-700">Søk på plattformer, skatteregler eller funksjoner</h3>
      </div>

      <div className="relative">
        <div className="relative flex items-center">
          <Search className="absolute left-3.5 text-slate-400" size={16} />
          <input
            id="footer-search-input"
            type="text"
            placeholder="Søk f.eks. 'Vipps', 'Skatt', 'Firi'..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setIsFocused(true)}
            className="w-full pl-10 pr-10 py-2.5 bg-white border border-slate-200 rounded-xl text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0052FF] focus:border-transparent transition-all shadow-sm"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="absolute right-3.5 text-slate-400 hover:text-slate-600 transition-colors"
            >
              <X size={16} />
            </button>
          )}
        </div>

        {/* Real-time Autofill / Dropdown */}
        <AnimatePresence>
          {isFocused && query.trim() !== '' && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="absolute bottom-full mb-2 left-0 right-0 max-h-[320px] overflow-y-auto bg-white border border-slate-100 rounded-2xl shadow-xl z-40 divide-y divide-slate-50"
            >
              {results.length > 0 ? (
                results.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => handleSelectResult(item)}
                    className="p-3.5 hover:bg-slate-50 transition-colors cursor-pointer flex items-start gap-3"
                  >
                    <div className="mt-0.5 mt-shrink-0">
                      {item.type === 'page' && (
                        <div className="bg-blue-50 text-[#0052FF] p-1.5 rounded-lg">
                          <FileText size={14} />
                        </div>
                      )}
                      {item.type === 'faq' && (
                        <div className="bg-orange-50 text-orange-600 p-1.5 rounded-lg">
                          <HelpCircle size={14} />
                        </div>
                      )}
                      {item.type === 'platform' && (
                        <div className="bg-emerald-50 text-emerald-600 px-1.5 py-0.5 rounded text-[10px] uppercase font-black tracking-wider leading-relaxed">
                          Børs
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1.5">
                        <span className="text-[13px] font-bold text-slate-900 leading-tight block truncate">{item.title}</span>
                        <CornerDownRight size={10} className="text-slate-300 stroke-[3]" />
                      </div>
                      <p className="text-[11px] text-slate-500 truncate mt-0.5">{item.description}</p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-8 text-center text-slate-400">
                  <p className="text-xs font-semibold">Fant ingen resultater for "{query}"</p>
                  <p className="text-[10px] mt-1">Prøv andre søkeord eller bla nedover i guidene.</p>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Immersive modal for displaying selected platform details or FAQ answers */}
      <AnimatePresence>
        {selectedItem && (
          <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-3xl border border-slate-100 shadow-2xl p-6 w-full max-w-md max-h-[85vh] overflow-y-auto space-y-6"
            >
              {/* Header */}
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="space-y-1">
                  <span className="text-[9px] font-black uppercase tracking-widest text-[#0052FF] bg-blue-50 px-2 py-0.5 rounded-full">
                    {selectedItem.type === 'platform' ? 'Kryptobørs omtale' : 'Ofte stilt spørsmål'}
                  </span>
                  <h3 className="text-lg font-black text-slate-950 tracking-tight">{selectedItem.title}</h3>
                </div>
                <button
                  onClick={() => setSelectedItem(null)}
                  className="bg-slate-50 hover:bg-slate-100 text-slate-400 hover:text-slate-600 p-2 rounded-full transition-colors"
                >
                  <X size={16} />
                </button>
              </div>

              {/* Main description */}
              <p className="text-slate-600 text-sm leading-relaxed">{selectedItem.description}</p>

              {/* Content body depending on category */}
              {selectedItem.type === 'faq' && (
                <div className="px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl space-y-2">
                  <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-widest leading-none">Forklaring</h4>
                  <p className="text-slate-800 text-sm leading-relaxed whitespace-pre-line font-medium text-[13px]">{selectedItem.payload.answer}</p>
                </div>
              )}

              {selectedItem.type === 'platform' && (
                <div className="space-y-5">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-1">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Est. handelsgebyr</p>
                      <p className="text-xs font-bold text-slate-800">{selectedItem.payload.fees}</p>
                    </div>
                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-1">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Spredning (Spread)</p>
                      <p className="text-xs font-bold text-slate-800">{selectedItem.payload.spread}</p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <h5 className="text-[11px] font-bold text-emerald-600 uppercase tracking-widest mb-1.5 flex items-center gap-1">✓ Fordeler</h5>
                      <ul className="text-xs text-slate-600 space-y-1 pl-1">
                        {selectedItem.payload.pros.map((pro: string, i: number) => (
                          <li key={i} className="flex items-start gap-1.5">
                            <span className="text-emerald-500 font-bold">•</span>
                            <span>{pro}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <h5 className="text-[11px] font-bold text-red-500 uppercase tracking-widest mb-1.5 flex items-center gap-1">✗ Ulemper</h5>
                      <ul className="text-xs text-slate-600 space-y-1 pl-1">
                        {selectedItem.payload.cons.map((con: string, i: number) => (
                          <li key={i} className="flex items-start gap-1.5">
                            <span className="text-red-400 font-bold">•</span>
                            <span>{con}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              )}

              {/* Action buttons */}
              <div className="pt-2 flex items-center gap-3">
                <button
                  onClick={() => {
                    if (selectedItem.type === 'platform') {
                      setCurrentPage('platforms');
                    } else if (selectedItem.type === 'faq') {
                      setCurrentPage('overview');
                    }
                    setSelectedItem(null);
                    setQuery('');
                    setIsFocused(false);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="flex-1 py-3 bg-slate-900 border border-transparent text-white text-xs font-bold uppercase tracking-widest rounded-xl hover:bg-slate-800 transition-colors flex items-center justify-center gap-2 shadow-sm"
                >
                  Gå til full oversikt <ArrowRight size={12} />
                </button>
                {selectedItem.type === 'platform' && (
                  <a
                    href={selectedItem.payload.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 py-3 bg-[#0052FF] text-white text-xs font-bold uppercase tracking-widest rounded-xl hover:bg-[#0045db] transition-colors flex items-center justify-center gap-2 shadow-sm"
                  >
                    Besøk websiden <ExternalLink size={12} />
                  </a>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
