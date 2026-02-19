import { motion } from 'framer-motion';
import { Star } from 'lucide-react';
import { ExchangeIcon } from './icons';

const exchanges = [
  {
    name: 'Firi',
    icon: 'Firi',
    description: 'En norsk-basert børs som gjør det enkelt og trygt å kjøpe og selge kryptovaluta med NOK. Regulert av Finanstilsynet.',
    rating: 4.8,
    link: 'https://firi.com',
  },
  {
    name: 'Coinbase',
    icon: 'Coinbase',
    description: 'En av verdens største og mest anerkjente børser. Tilbyr et bredt utvalg av kryptovaluta og er kjent for sitt brukervennlige grensesnitt.',
    rating: 4.5,
    link: 'https://www.coinbase.com',
  },
  {
    name: 'Binance',
    icon: 'Binance',
    description: 'Verdens største kryptobørs målt i handelsvolum. Tilbyr avanserte handelsverktøy og et enormt utvalg av digitale eiendeler.',
    rating: 4.2,
    link: 'https://www.binance.com',
  },
];

export default function ExchangeOverview() {
  return (
    <div className="py-16 md:py-24 bg-gray-900">
      <div className="max-w-4xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <h2 className="text-3xl md:text-4xl font-bold text-center text-white mb-12">Oversikt over Bitcoin Børser</h2>
          <div className="bg-gray-800/50 backdrop-blur-sm border border-white/10 rounded-2xl shadow-lg overflow-x-auto">
            <table className="w-full min-w-max">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="text-left font-semibold text-sm text-gray-400 p-4">Plattform</th>
                  <th className="text-left font-semibold text-sm text-gray-400 p-4">Beskrivelse</th>
                  <th className="text-center font-semibold text-sm text-gray-400 p-4">Vurdering</th>
                  <th className="text-right font-semibold text-sm text-gray-400 p-4"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10">
                {exchanges.map((exchange) => (
                  <tr key={exchange.name} className="hover:bg-gray-800/60 transition-colors duration-200">
                    <td className="p-4 align-top">
                      <div className="flex items-center gap-3 font-semibold text-white">
                        <ExchangeIcon exchange={exchange.name as any} />
                        {exchange.name}
                      </div>
                    </td>
                    <td className="p-4 text-gray-300 max-w-md">{exchange.description}</td>
                    <td className="p-4 align-top">
                      <div className="flex items-center justify-center gap-1 text-yellow-400">
                        <Star size={16} className="fill-current" />
                        <span className="font-semibold text-white">{exchange.rating.toFixed(1)}</span>
                      </div>
                    </td>
                    <td className="p-4 text-right align-top">
                      <a href={exchange.link} target="_blank" rel="noopener noreferrer" className="bg-gray-700/60 text-white font-semibold px-4 py-2 rounded-lg hover:bg-indigo-600 transition-all duration-200 text-sm whitespace-nowrap">
                        Besøk side
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
