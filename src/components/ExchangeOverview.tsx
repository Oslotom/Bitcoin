import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Star } from 'lucide-react';
import { ExchangeIcon } from './icons';
import { Exchange } from '../types';

type ExchangeCategory = 'Norsk' | 'Global';

const exchanges: { name: Exchange; icon: Exchange; description: string; rating: number; link: string; category: ExchangeCategory }[] = [
  {
    name: Exchange.Firi,
    icon: Exchange.Firi,
    description: 'Norsk, regulert kryptobors for handel i NOK.',
    rating: 4.8,
    link: 'https://firi.com',
    category: 'Norsk',
  },
  {
    name: Exchange.Coinbase,
    icon: Exchange.Coinbase,
    description: 'Stor global bors med brukervennlig plattform.',
    rating: 4.5,
    link: 'https://www.coinbase.com',
    category: 'Global',
  },
  {
    name: Exchange.Binance,
    icon: Exchange.Binance,
    description: 'Svaert stor global bors med mange markeder.',
    rating: 4.2,
    link: 'https://www.binance.com',
    category: 'Global',
  },
  {
    name: Exchange.Kraken,
    icon: Exchange.Kraken,
    description: 'Etablert bors med sterkt fokus pa sikkerhet.',
    rating: 4.6,
    link: 'https://www.kraken.com',
    category: 'Global',
  },
  {
    name: Exchange.NBX,
    icon: Exchange.NBX,
    description: 'Norsk bors for kryptohandel i NOK.',
    rating: 4.3,
    link: 'https://nbx.com',
    category: 'Norsk',
  },
  {
    name: Exchange.BareBitcoin,
    icon: Exchange.BareBitcoin,
    description: 'Norsk Bitcoin-plattform med enkel kjop i NOK.',
    rating: 4.2,
    link: 'https://barebitcoin.no',
    category: 'Norsk',
  },
  {
    name: Exchange.Revolut,
    icon: Exchange.Revolut,
    description: 'Mobilbank-app med enkel tilgang til krypto.',
    rating: 4.1,
    link: 'https://www.revolut.com',
    category: 'Global',
  },
  {
    name: Exchange.CryptoCom,
    icon: Exchange.CryptoCom,
    description: 'Global kryptoplattform med kort og tjenester.',
    rating: 4.0,
    link: 'https://crypto.com',
    category: 'Global',
  },
  {
    name: Exchange.BuyBitcoin,
    icon: Exchange.BuyBitcoin,
    description: 'Enkel Bitcoin-kjopslosning for nye brukere.',
    rating: 3.9,
    link: 'https://buybitcoin.com',
    category: 'Global',
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
    const matchesQuery =
      exchange.name.toLowerCase().includes(query.toLowerCase()) ||
      exchange.description.toLowerCase().includes(query.toLowerCase());
    const matchesCategory = categoryFilter === 'Alle' || exchange.category === categoryFilter;
    return matchesQuery && matchesCategory;
  });

  return (
    <div className="py-16 md:py-24 bg-slate-50">
      <div className="max-w-4xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <h2 className="text-3xl md:text-4xl font-bold text-center text-slate-900 mb-6">Her kan du kjøpe Bitcoin</h2>
          <div className="mb-6 grid grid-cols-1 sm:grid-cols-2 gap-3">
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
          <div className="bg-white backdrop-blur-sm border border-slate-200 rounded-2xl shadow-lg overflow-hidden">
            <table className="w-full table-fixed md:table-auto">
              <thead>
                <tr className="border-b border-slate-200">
                  <th className="text-left font-semibold text-sm text-slate-500 p-3 md:p-4">Plattform</th>
                  <th className="hidden md:table-cell text-left font-semibold text-sm text-slate-500 p-4">Beskrivelse</th>
                  <th className="hidden md:table-cell text-center font-semibold text-sm text-slate-500 p-4">Vurdering</th>
                  <th className="hidden md:table-cell text-right font-semibold text-sm text-slate-500 p-4"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {filteredExchanges.map((exchange) => (
                  <React.Fragment key={exchange.name}>
                    <tr
                      className="hover:bg-slate-50 transition-colors duration-200 cursor-pointer"
                      onClick={() => toggleExpanded(exchange.name)}
                    >
                      <td className="p-3 md:p-4 align-top">
                        <div className="flex items-center gap-3 font-semibold text-slate-900">
                          <ExchangeIcon exchange={exchange.name as any} />
                          <span className="truncate">{exchange.name}</span>
                        </div>
                      </td>
                      <td className="hidden md:table-cell p-4 text-slate-600 whitespace-nowrap">{exchange.description}</td>
                      <td className="hidden md:table-cell p-4 align-top">
                        <div className="flex items-center justify-center gap-1 text-yellow-400">
                          <Star size={16} className="fill-current" />
                          <span className="font-semibold text-slate-900">{exchange.rating.toFixed(1)}</span>
                        </div>
                      </td>
                      <td className="hidden md:table-cell p-4 text-right align-top">
                        <a
                          href={exchange.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="bg-slate-100 text-slate-900 font-semibold px-4 py-2 rounded-lg hover:bg-sky-600 hover:text-white transition-all duration-200 text-sm whitespace-nowrap"
                          onClick={(e) => e.stopPropagation()}
                        >
                          Besok side
                        </a>
                      </td>
                    </tr>
                    <tr className="md:hidden">
                      <td colSpan={4} className="p-0">
                        {expanded === exchange.name && (
                          <div className="px-3 pb-3 text-sm text-slate-600 bg-slate-50">
                            <p>{exchange.description}</p>
                            <div className="mt-2 flex items-center justify-between">
                              <div className="flex items-center gap-1 text-yellow-500">
                                <Star size={14} className="fill-current" />
                                <span className="font-semibold text-slate-900">{exchange.rating.toFixed(1)}</span>
                              </div>
                              <a
                                href={exchange.link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="bg-slate-100 text-slate-900 font-semibold px-3 py-1.5 rounded-lg hover:bg-sky-600 hover:text-white transition-all duration-200 text-xs whitespace-nowrap"
                                onClick={(e) => e.stopPropagation()}
                              >
                                Besok side
                              </a>
                            </div>
                          </div>
                        )}
                      </td>
                    </tr>
                  </React.Fragment>
                ))}
                {filteredExchanges.length === 0 && (
                  <tr>
                    <td colSpan={4} className="p-6 text-sm text-slate-500 text-center">
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
