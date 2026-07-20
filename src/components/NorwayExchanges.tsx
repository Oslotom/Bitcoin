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
    <div id="norway-exchanges-section" className="space-y-12 animate-fade-in">
      <div className="text-center space-y-4">
        <h2 className="text-4xl font-display font-bold tracking-tight text-slate-900">
          Kjøp Bitcoin i <span className="text-brand">Norge</span>
        </h2>
        <p className="text-slate-500 text-lg font-medium max-w-2xl mx-auto leading-relaxed">
          Oversikt over de tryggeste og mest populære norske handelsplattformene registrert hos Finanstilsynet.
        </p>
      </div>

      <div className="card-premium overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/50 border-b border-slate-100">
              <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Plattform</th>
              <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest hidden md:table-cell">Type</th>
              <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest hidden sm:table-cell">Egenskaper</th>
              <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-right">Detaljer</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {norwayExchanges.map((exchange) => (
              <React.Fragment key={exchange.id}>
                <tr 
                  onClick={() => toggleExpand(exchange.id)}
                  className="group cursor-pointer hover:bg-slate-50/80 transition-colors"
                >
                  <td className="px-6 py-6">
                    <div className="flex items-center gap-4">
                      <div className="shrink-0 group-hover:scale-110 transition-transform">
                        <ExchangeIcon exchange={exchange.id} size={40} />
                      </div>
                      <div>
                        <div className="text-base font-bold text-slate-900">{exchange.name}</div>
                        <div className="text-[11px] text-slate-400 font-medium md:hidden mt-1 flex items-center gap-2">
                          <span className="w-1 h-1 rounded-full bg-brand" /> {exchange.type}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-6 hidden md:table-cell">
                    <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider ${
                      exchange.type === 'Børs' ? 'bg-blue-50 text-brand border border-blue-100' : 
                      exchange.type === 'Megler' ? 'bg-purple-50 text-purple-600 border border-purple-100' : 
                      'bg-slate-100 text-slate-600 border border-slate-200'
                    }`}>
                      {exchange.type}
                    </span>
                  </td>
                  <td className="px-6 py-6 hidden sm:table-cell">
                    <div className="flex flex-wrap gap-2">
                      {exchange.features.slice(0, 2).map((feature, i) => (
                        <span key={i} className="text-[10px] font-bold bg-slate-50 text-slate-500 px-2 py-0.5 rounded border border-slate-100 uppercase tracking-tight">
                          {feature}
                        </span>
                      ))}
                      {exchange.features.length > 2 && (
                        <span className="text-[10px] font-bold text-slate-300 px-1 py-0.5">
                          +{exchange.features.length - 2}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-6 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <div className="text-slate-300 group-hover:text-brand transition-colors">
                        {expandedId === exchange.id ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
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
                          className="overflow-hidden bg-slate-50/50"
                        >
                          <div className="mx-6 mb-6 p-8 bg-white rounded-2xl border border-slate-100 shadow-sm space-y-8">
                            <div className="space-y-3">
                              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Om plattformen</h4>
                              <p className="text-base text-slate-600 leading-relaxed max-w-3xl font-medium italic">
                                "{exchange.description}"
                              </p>
                            </div>
                            
                            <div className="flex flex-wrap gap-3">
                              {exchange.features.map((feature, i) => (
                                <span key={i} className="flex items-center gap-2 text-xs font-bold text-slate-700 bg-slate-50 border border-slate-100 px-4 py-2 rounded-xl">
                                  <span className="w-1.5 h-1.5 bg-brand rounded-full" />
                                  {feature}
                                </span>
                              ))}
                            </div>

                            <div className="pt-4 border-t border-slate-50">
                              <a 
                                href={exchange.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="btn-primary inline-flex px-8"
                              >
                                Besøk {exchange.name} <ExternalLink size={16} />
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
