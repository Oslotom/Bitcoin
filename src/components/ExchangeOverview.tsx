import React, { useState } from 'react';
import { motion } from 'framer-motion';
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
    <div className="bg-slate-50 py-16 md:py-24">
      <div className="mx-auto max-w-4xl px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <h2 className="mb-6 text-center text-3xl font-bold text-slate-900 md:text-4xl">Her kan du kjøpe Bitcoin</h2>

          <div className="mb-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Sok etter plattform..."
              className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 focus:outline-none"
            />
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value as 'Alle' | ExchangeCategory)}
              className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 focus:outline-none"
            >
              <option value="Alle">Alle</option>
              <option value="Norsk">Norske</option>
              <option value="Global">Globale</option>
            </select>
          </div>

          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-lg">
            <table className="w-full table-fixed md:table-auto">
              <thead>
                <tr className="border-b border-slate-200">
                  <th className="p-3 text-left text-sm font-semibold text-slate-500 md:p-4">Plattform</th>
                  <th className="hidden p-4 text-left text-sm font-semibold text-slate-500 md:table-cell">Beskrivelse</th>
                  <th className="hidden p-4 text-right text-sm font-semibold text-slate-500 md:table-cell"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {filteredExchanges.map((exchange) => (
                  <React.Fragment key={exchange.name}>
                    <tr
                      className="cursor-pointer transition-colors duration-200 hover:bg-slate-50"
                      onClick={() => toggleExpanded(exchange.name)}
                    >
                      <td className="p-3 align-top md:p-4">
                        <div className="flex items-center gap-3 font-semibold text-slate-900">
                          <ExchangeIcon exchange={exchange.name as any} />
                            <span className="truncate">{exchange.name}</span>
                        </div>
                      </td>
                      <td className="hidden whitespace-nowrap p-4 text-slate-600 md:table-cell">{exchange.description}</td>
                      <td className="hidden p-4 text-right align-top md:table-cell">
                        <a
                          href={exchange.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="whitespace-nowrap rounded-lg bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-900 transition-all duration-200 hover:bg-sky-600 hover:text-white"
                          onClick={(e) => e.stopPropagation()}
                        >
                          Besok side
                        </a>
                      </td>
                    </tr>

                    <tr>
                      <td colSpan={3} className="p-0">
                        {expanded === exchange.name && (
                          <div className="bg-slate-50 px-3 pb-3 pt-1 text-sm text-slate-600 md:px-4 md:pb-4">
                            <p className="mb-3">{exchange.description}</p>
                            <div className="grid gap-3 md:grid-cols-2">
                                <div>
                                  <p className="mb-1 font-semibold text-slate-900">Fordeler</p>
                                  <ul className="space-y-1">
                                    {exchange.pros.map((pro) => (
                                      <li key={pro}>+ {pro}</li>
                                    ))}
                                  </ul>
                                </div>
                                <div>
                                  <p className="mb-1 font-semibold text-slate-900">Ulemper</p>
                                  <ul className="space-y-1">
                                    {exchange.cons.map((con) => (
                                      <li key={con}>- {con}</li>
                                    ))}
                                  </ul>
                                </div>
                              </div>
                              <a
                                href={exchange.link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="mt-3 inline-flex rounded-lg bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-900 transition-all duration-200 hover:bg-sky-600 hover:text-white md:hidden"
                                onClick={(e) => e.stopPropagation()}
                              >
                                Besok side
                              </a>
                          </div>
                        )}
                      </td>
                    </tr>
                  </React.Fragment>
                ))}

                {filteredExchanges.length === 0 && (
                  <tr>
                    <td colSpan={3} className="p-6 text-center text-sm text-slate-500">
                      Ingen borser matcher filteret.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
