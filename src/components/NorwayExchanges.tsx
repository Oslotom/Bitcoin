import React, { useState } from 'react';
import { Exchange } from '../types';
import { ExchangeIcon } from './icons';
import { ChevronDown, ChevronUp, ExternalLink } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface NorwayExchange {
  id: string;
  name: string;
  description: string;
  url: string;
  features: string[];
  type: 'Børs' | 'Megler' | 'Ressurs';
}

const norwayExchanges: NorwayExchange[] = [
  {
    id: Exchange.Firi,
    name: 'Firi',
    description: 'Norges største kryptobørs. Registrert hos Finanstilsynet, tilbyr enkel registrering med BankID og raske innskudd med Vipps.',
    url: 'https://firi.com',
    features: ['BankID', 'Vipps', 'Automatisk skatteberegning', 'Norsk kundeservice'],
    type: 'Børs'
  },
  {
    id: Exchange.NBX,
    name: 'NBX (Norwegian Block Exchange)',
    description: 'Norsk børs med fokus på sikkerhet og profesjonelle verktøy. Tilbyr BankID, kredittkort med krypto-cashback og er børsnotert.',
    url: 'https://nbx.com',
    features: ['BankID', 'Kredittkort med cashback', 'Børsnotert', 'Institusjonelle løsninger'],
    type: 'Børs'
  },
  {
    id: Exchange.BareBitcoin,
    name: 'Bare Bitcoin',
    description: 'Norsk spesialist-app eksklusivt for Bitcoin. Lynrask, ekstremt sikker, og optimert for sparing (DCA) med Lightning Network-støtte.',
    url: 'https://barebitcoin.no',
    features: ['Bitcoin-spesialist', 'Lightning Network', 'DCA / Spareavtaler', 'BankID'],
    type: 'Børs'
  },
  {
    id: 'kaupang',
    name: 'Kaupang Krypto',
    description: 'Norsk kryptomegler som tilbyr et bredt utvalg av kryptovalutaer og personlig oppfølging for større handler (OTC).',
    url: 'https://kaupangkrypto.no',
    features: ['Bredt utvalg', 'OTC-tjenester', 'BankID', 'Norsk megler'],
    type: 'Megler'
  },
  {
    id: 'kryptopris',
    name: 'Kryptopris.no',
    description: 'Uavhengig sammenligningstjeneste for norske kryptobørser. Hjelper deg å finne de laveste gebyrene og beste prisene.',
    url: 'https://kryptopris.no',
    features: ['Sammenligning', 'Gebyr-oversikt', 'Uavhengig', 'Guider'],
    type: 'Ressurs'
  },
  {
    id: 'bitnord',
    name: 'Bitnord',
    description: 'Norsk handelsplattform som fokuserer på enkelhet og brukervennlighet for kjøp og salg av krypto.',
    url: 'https://bitnord.no',
    features: ['Enkel handel', 'Norsk språk', 'BankID', 'Raske oppgjør'],
    type: 'Børs'
  },
  {
    id: 'vebit',
    name: 'Vebit',
    description: 'Norsk aktør som tilbyr enkel inngang til kryptomarkedet med fokus på trygghet og etterlevelse.',
    url: 'https://vebit.no',
    features: ['Sikkerhet', 'BankID', 'Enkel registrering'],
    type: 'Megler'
  }
];

export default function NorwayExchanges() {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <div id="norway-exchanges-section" className="space-y-8 animate-fade-in">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-black tracking-tight text-slate-900 uppercase">
          Kjøp Bitcoin i <span className="text-orange-600">Norge</span>
        </h2>
        <p className="text-slate-500 text-sm font-medium max-w-lg mx-auto">
          Oversikt over de tryggeste og mest populære norske handelsplattformene registrert hos Finanstilsynet.
        </p>
      </div>

      <div className="bg-white border border-slate-100 rounded-2xl shadow-sm overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/50 border-b border-slate-100">
              <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Plattform</th>
              <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest hidden md:table-cell">Type</th>
              <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest hidden sm:table-cell">Egenskaper</th>
              <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-right">Mer info</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {norwayExchanges.map((exchange) => (
              <React.Fragment key={exchange.id}>
                <tr 
                  onClick={() => toggleExpand(exchange.id)}
                  className="group cursor-pointer hover:bg-slate-50/50 transition-colors"
                >
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-4">
                      <div className="shrink-0 group-hover:scale-110 transition-transform">
                        <ExchangeIcon exchange={exchange.id} size={32} />
                      </div>
                      <div>
                        <div className="text-sm font-bold text-slate-900">{exchange.name}</div>
                        <div className="text-[11px] text-slate-500 font-medium md:hidden">
                          {exchange.type} • Klikk for mer
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-5 hidden md:table-cell">
                    <span className={`text-[10px] font-black px-2 py-1 rounded uppercase tracking-wider ${
                      exchange.type === 'Børs' ? 'bg-blue-50 text-blue-600' : 
                      exchange.type === 'Megler' ? 'bg-purple-50 text-purple-600' : 
                      'bg-orange-50 text-orange-600'
                    }`}>
                      {exchange.type}
                    </span>
                  </td>
                  <td className="px-6 py-5 hidden sm:table-cell">
                    <div className="flex flex-wrap gap-1.5">
                      {exchange.features.slice(0, 2).map((feature, i) => (
                        <span key={i} className="text-[9px] font-bold bg-slate-100 text-slate-600 px-2 py-0.5 rounded uppercase tracking-tighter">
                          {feature}
                        </span>
                      ))}
                      {exchange.features.length > 2 && (
                        <span className="text-[9px] font-bold text-slate-400 px-1 py-0.5">
                          +{exchange.features.length - 2} til
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-5 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <div className="text-slate-300">
                        {expandedId === exchange.id ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                      </div>
                    </div>
                  </td>
                </tr>
                <AnimatePresence>
                  {expandedId === exchange.id && (
                    <tr>
                      <td colSpan={4} className="px-0 py-0 border-none">
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="overflow-hidden"
                        >
                          <div className="px-6 py-6 bg-slate-50/30 border-t border-slate-50 space-y-4">
                            <div className="space-y-2">
                              <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Beskrivelse</h4>
                              <p className="text-sm text-slate-600 leading-relaxed max-w-2xl">
                                {exchange.description}
                              </p>
                            </div>
                            
                            <div className="flex flex-wrap gap-2 pt-2">
                              {exchange.features.map((feature, i) => (
                                <span key={i} className="flex items-center gap-1.5 text-[11px] font-bold text-slate-700 bg-white border border-slate-200 px-3 py-1 rounded-full shadow-sm">
                                  <span className="w-1 h-1 bg-orange-500 rounded-full" />
                                  {feature}
                                </span>
                              ))}
                            </div>

                            <div className="pt-4">
                              <a 
                                href={exchange.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 text-[11px] font-bold text-white bg-[#0052FF] hover:bg-[#0045db] px-5 py-2.5 rounded-xl shadow-sm transition-all active:scale-95"
                              >
                                Besøk {exchange.name} <ExternalLink size={12} />
                              </a>
                            </div>
                          </div>
                        </motion.div>
                      </td>
                    </tr>
                  )}
                </AnimatePresence>
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
