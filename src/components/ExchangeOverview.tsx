import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ExchangeIcon } from './icons';
import { Exchange } from '../types';

type ExchangeCategory = 'Norsk' | 'Global';

type ExchangeItem = {
  name: Exchange;
  icon: Exchange;
  description: string;
  link: string;
  category: ExchangeCategory;
  pros: string[];
  cons: string[];
};

const exchanges: ExchangeItem[] = [
  {
    name: Exchange.Firi,
    icon: Exchange.Firi,
    description: 'Norsk, regulert kryptobors for handel i NOK.',
    link: 'https://firi.com',
    category: 'Norsk',
    pros: ['Norsk app og support', 'Enkel NOK-innbetaling'],
    cons: ['Hoyere kost enn noen globale borser'],
  },
  {
    name: Exchange.Coinbase,
    icon: Exchange.Coinbase,
    description: 'Stor global bors med brukervennlig plattform.',
    link: 'https://www.coinbase.com',
    category: 'Global',
    pros: ['Svaert enkel i bruk', 'God sikkerhet og omdomme'],
    cons: ['Kan vaere dyrere enn proff-plattformer'],
  },
  {
    name: Exchange.Binance,
    icon: Exchange.Binance,
    description: 'Svaert stor global bors med mange markeder.',
    link: 'https://www.binance.com',
    category: 'Global',
    pros: ['Lavere avgifter', 'Mange markeder og funksjoner'],
    cons: ['Mer kompleks for nybegynnere'],
  },
  {
    name: Exchange.Kraken,
    icon: Exchange.Kraken,
    description: 'Etablert bors med sterkt fokus pa sikkerhet.',
    link: 'https://www.kraken.com',
    category: 'Global',
    pros: ['Solid sikkerhetsprofil', 'Bra for avanserte brukere'],
    cons: ['Grensesnitt kan oppleves mer teknisk'],
  },
  {
    name: Exchange.NBX,
    icon: Exchange.NBX,
    description: 'Norsk bors for kryptohandel i NOK.',
    link: 'https://nbx.com',
    category: 'Norsk',
    pros: ['Norsk aktor', 'NOK-fokus'],
    cons: ['Noe mindre utvalg enn de storste globale'],
  },
  {
    name: Exchange.BareBitcoin,
    icon: Exchange.BareBitcoin,
    description: 'Norsk Bitcoin-plattform med enkel kjop i NOK.',
    link: 'https://barebitcoin.no',
    category: 'Norsk',
    pros: ['Spisset mot Bitcoin', 'Enkel kjopsflyt'],
    cons: ['Faerre produkter enn full-service borser'],
  },
  {
    name: Exchange.Revolut,
    icon: Exchange.Revolut,
    description: 'Mobilbank-app med enkel tilgang til krypto.',
    link: 'https://www.revolut.com',
    category: 'Global',
    pros: ['Rask tilgang i mobilbank', 'Veldig enkel onboarding'],
    cons: ['Ikke alltid lavest spread'],
  },
  {
    name: Exchange.CryptoCom,
    icon: Exchange.CryptoCom,
    description: 'Global kryptoplattform med kort og tjenester.',
    link: 'https://crypto.com',
    category: 'Global',
    pros: ['Mange tilleggstjenester', 'Kort/bonus-okosystem'],
    cons: ['Pris og spread varierer med produkt'],
  },
  {
    name: Exchange.BuyBitcoin,
    icon: Exchange.BuyBitcoin,
    description: 'Enkel Bitcoin-kjopsloesning for nye brukere.',
    link: 'https://buybitcoin.com',
    category: 'Global',
    pros: ['Lett for nybegynnere', 'Enkel kjopsprosess'],
    cons: ['Kan ha hoyere total kostnad'],
  },
];

export default function ExchangeOverview() {
  const [expanded, setExpanded] = useState<Exchange | null>(null);
  const [query, setQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<'Alle' | ExchangeCategory>('Alle');

  const toggleExpanded = (exchange: Exchange) => {
    setExpanded(expanded === exchange ? null : exchange);
  };

  const filteredExchanges = exchanges.filter((exchange) => {
    const q = query.toLowerCase();
    const matchesQuery =
      exchange.name.toLowerCase().includes(q) ||
      exchange.description.toLowerCase().includes(q) ||
      exchange.pros.some((p) => p.toLowerCase().includes(q)) ||
      exchange.cons.some((c) => c.toLowerCase().includes(q));
    const matchesCategory = categoryFilter === 'Alle' || exchange.category === categoryFilter;
    return matchesQuery && matchesCategory;
  });

  return (
    <div id="exchange-overview-wrapper" className="bg-white py-12">
      <div className="mx-auto max-w-4xl px-4">
        <motion.div
          id="exchange-overview-content"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {/* Header & Filters */}
          <div id="platforms-grid-header" className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
            <div>
              <h1 className="text-xl font-bold tracking-tight text-slate-900">Utforsk plattformer</h1>
              <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Finn børsen som passer dine behov</p>
            </div>
            
            <div id="search-filter-controls" className="flex gap-2">
              <input
                id="exchange-search-input"
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Søk..."
                className="rounded-lg border border-slate-100 bg-slate-50 px-3 py-1.5 text-xs font-bold text-slate-800 focus:outline-none w-40"
              />
              <select
                id="exchange-category-select"
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value as 'Alle' | ExchangeCategory)}
                className="rounded-lg border border-slate-100 bg-slate-50 px-3 py-1.5 text-xs font-bold text-slate-800 focus:outline-none"
              >
                <option value="Alle">Alle typer</option>
                <option value="Norsk">Norske</option>
                <option value="Global">Globale</option>
              </select>
            </div>
          </div>

          {/* List: Filtered Results */}
          <div id="exchanges-list-container" className="overflow-hidden rounded-xl border border-slate-100 divide-y divide-slate-50">
            {filteredExchanges.map((exchange) => (
              <div key={exchange.name} id={`exchange-item-${exchange.name.toLowerCase()}`} className="group">
                <div 
                  id={`exchange-header-${exchange.name.toLowerCase()}`}
                  className="flex items-center justify-between p-4 cursor-pointer hover:bg-slate-50/50 transition-colors"
                  onClick={() => toggleExpanded(exchange.name)}
                >
                  <div className="flex items-center gap-4">
                    <div className="shrink-0 scale-90">
                      <ExchangeIcon exchange={exchange.name as any} />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-slate-900">{exchange.name}</h3>
                      <p className="text-[10px] text-slate-400 font-medium uppercase tracking-tighter">{exchange.category}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="hidden sm:block text-[11px] text-slate-500 font-medium italic truncate max-w-[200px]">{exchange.description}</span>
                    <div className={`transition-transform duration-300 ${expanded === exchange.name ? 'rotate-180' : ''}`}>
                       <svg className="w-4 h-4 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>
                </div>

                {/* Dropdown: Detailed Platform Info */}
                <AnimatePresence>
                  {expanded === exchange.name && (
                    <motion.div
                      id={`exchange-details-${exchange.name.toLowerCase()}`}
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden bg-slate-50/30"
                    >
                      <div className="px-12 pb-6 pt-2">
                        <p className="text-xs text-slate-600 mb-6 leading-relaxed bg-white p-3 rounded-lg border border-slate-100 italic">
                          "{exchange.description}"
                        </p>
                        <div className="grid sm:grid-cols-2 gap-8">
                          <div id={`pros-${exchange.name.toLowerCase()}`}>
                            <h4 className="text-[10px] uppercase tracking-widest font-black text-emerald-500 mb-3">Fordeler</h4>
                            <ul className="space-y-2">
                              {exchange.pros.map(pro => (
                                <li key={pro} className="text-xs text-slate-700 flex items-start gap-2">
                                  <span className="text-emerald-500 font-black">✓</span> {pro}
                                </li>
                              ))}
                            </ul>
                          </div>
                          <div id={`cons-${exchange.name.toLowerCase()}`}>
                            <h4 className="text-[10px] uppercase tracking-widest font-black text-rose-400 mb-3">Ulemper</h4>
                            <ul className="space-y-2">
                              {exchange.cons.map(con => (
                                <li key={con} className="text-xs text-slate-700 flex items-start gap-2 text-opacity-80">
                                  <span className="text-rose-400 font-black">✕</span> {con}
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                        <div className="mt-8">
                          <a
                            id={`ext-link-${exchange.name.toLowerCase()}`}
                            href={exchange.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 px-6 py-2 bg-slate-900 text-white text-[10px] font-black uppercase tracking-widest rounded-lg hover:bg-slate-800 transition-colors"
                          >
                            Gå til plattform
                          </a>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}

            {filteredExchanges.length === 0 && (
              <div id="no-results-msg" className="p-12 text-center text-slate-400 italic text-sm">
                Ingen børser funnet for dine søkekriterier.
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
