import { motion } from 'framer-motion';
import { Star } from 'lucide-react';
import { ExchangeIcon } from './icons';
import { Exchange } from '../types';

const exchanges: { name: Exchange; icon: Exchange; description: string; rating: number; link: string }[] = [
  {
    name: Exchange.Firi,
    icon: Exchange.Firi,
    description: 'Norsk, regulert kryptobors for handel i NOK.',
    rating: 4.8,
    link: 'https://firi.com',
  },
  {
    name: Exchange.Coinbase,
    icon: Exchange.Coinbase,
    description: 'Stor global bors med brukervennlig plattform.',
    rating: 4.5,
    link: 'https://www.coinbase.com',
  },
  {
    name: Exchange.Binance,
    icon: Exchange.Binance,
    description: 'Svaert stor global bors med mange markeder.',
    rating: 4.2,
    link: 'https://www.binance.com',
  },
  {
    name: Exchange.Kraken,
    icon: Exchange.Kraken,
    description: 'Etablert bors med sterkt fokus pa sikkerhet.',
    rating: 4.6,
    link: 'https://www.kraken.com',
  },
  {
    name: Exchange.NBX,
    icon: Exchange.NBX,
    description: 'Norsk bors for kryptohandel i NOK.',
    rating: 4.3,
    link: 'https://nbx.com',
  },
  {
    name: Exchange.Revolut,
    icon: Exchange.Revolut,
    description: 'Mobilbank-app med enkel tilgang til krypto.',
    rating: 4.1,
    link: 'https://www.revolut.com',
  },
  {
    name: Exchange.CryptoCom,
    icon: Exchange.CryptoCom,
    description: 'Global kryptoplattform med kort og tjenester.',
    rating: 4.0,
    link: 'https://crypto.com',
  },
  {
    name: Exchange.BuyBitcoin,
    icon: Exchange.BuyBitcoin,
    description: 'Enkel Bitcoin-kjopslosning for nye brukere.',
    rating: 3.9,
    link: 'https://buybitcoin.com',
  },
];

export default function ExchangeOverview() {
  return (
    <div className="py-16 md:py-24 bg-slate-50">
      <div className="max-w-4xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <h2 className="text-3xl md:text-4xl font-bold text-center text-slate-900 mb-12">Oversikt over Bitcoin Borser</h2>
          <div className="bg-white backdrop-blur-sm border border-slate-200 rounded-2xl shadow-lg overflow-x-auto">
            <table className="w-full min-w-max">
              <thead>
                <tr className="border-b border-slate-200">
                  <th className="text-left font-semibold text-sm text-slate-500 p-4">Plattform</th>
                  <th className="text-left font-semibold text-sm text-slate-500 p-4">Beskrivelse</th>
                  <th className="text-center font-semibold text-sm text-slate-500 p-4">Vurdering</th>
                  <th className="text-right font-semibold text-sm text-slate-500 p-4"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {exchanges.map((exchange) => (
                  <tr key={exchange.name} className="hover:bg-slate-50 transition-colors duration-200">
                    <td className="p-4 align-top">
                      <div className="flex items-center gap-3 font-semibold text-slate-900">
                        <ExchangeIcon exchange={exchange.name as any} />
                        {exchange.name}
                      </div>
                    </td>
                    <td className="p-4 text-slate-600 whitespace-nowrap">{exchange.description}</td>
                    <td className="p-4 align-top">
                      <div className="flex items-center justify-center gap-1 text-yellow-400">
                        <Star size={16} className="fill-current" />
                        <span className="font-semibold text-slate-900">{exchange.rating.toFixed(1)}</span>
                      </div>
                    </td>
                    <td className="p-4 text-right align-top">
                      <a href={exchange.link} target="_blank" rel="noopener noreferrer" className="bg-slate-100 text-slate-900 font-semibold px-4 py-2 rounded-lg hover:bg-sky-600 hover:text-white transition-all duration-200 text-sm whitespace-nowrap">
                        Besok side
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
