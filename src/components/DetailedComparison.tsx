import React from 'react';
import { Check, X, Info } from 'lucide-react';
import { ExchangeIcon } from './icons';
import { Exchange } from '../types';

interface Feature {
  name: string;
  description: string;
}

const FEATURES: Feature[] = [
  { name: 'Bankoverføring', description: 'Støtte for SEPA eller lokal bankoverføring' },
  { name: 'Vipps', description: 'Mulighet for betaling med Vipps' },
  { name: 'Kredittkort', description: 'Støtte for Visa og Mastercard' },
  { name: 'Lyn-nettverket', description: 'Støtte for Bitcoin Lightning Network' },
  { name: 'Norsk Språk', description: 'Brukergrensesnitt på norsk' },
  { name: 'Registrert hos Finanstilsynet', description: 'Selskapet er registrert som tjenesteyter for virtuell valuta' },
];

const EXCHANGE_DATA: Record<Exchange, Record<string, boolean | string>> = {
  [Exchange.Firi]: {
    'Bankoverføring': true,
    'Vipps': true,
    'Kredittkort': true,
    'Lyn-nettverket': false,
    'Norsk Språk': true,
    'Registrert hos Finanstilsynet': true,
  },
  [Exchange.NBX]: {
    'Bankoverføring': true,
    'Vipps': true,
    'Kredittkort': true,
    'Lyn-nettverket': false,
    'Norsk Språk': true,
    'Registrert hos Finanstilsynet': true,
  },
  [Exchange.BareBitcoin]: {
    'Bankoverføring': true,
    'Vipps': false,
    'Kredittkort': false,
    'Lyn-nettverket': true,
    'Norsk Språk': true,
    'Registrert hos Finanstilsynet': true,
  },
  [Exchange.Coinbase]: {
    'Bankoverføring': true,
    'Vipps': false,
    'Kredittkort': true,
    'Lyn-nettverket': true,
    'Norsk Språk': false,
    'Registrert hos Finanstilsynet': false,
  },
  [Exchange.Binance]: {
    'Bankoverføring': true,
    'Vipps': false,
    'Kredittkort': true,
    'Lyn-nettverket': true,
    'Norsk Språk': false,
    'Registrert hos Finanstilsynet': false,
  },
  [Exchange.Kraken]: {
    'Bankoverføring': true,
    'Vipps': false,
    'Kredittkort': true,
    'Lyn-nettverket': true,
    'Norsk Språk': false,
    'Registrert hos Finanstilsynet': false,
  },
  [Exchange.CryptoCom]: {
    'Bankoverføring': true,
    'Vipps': false,
    'Kredittkort': true,
    'Lyn-nettverket': false,
    'Norsk Språk': false,
    'Registrert hos Finanstilsynet': false,
  },
  [Exchange.Revolut]: {
    'Bankoverføring': true,
    'Vipps': false,
    'Kredittkort': true,
    'Lyn-nettverket': false,
    'Norsk Språk': true,
    'Registrert hos Finanstilsynet': false,
  },
  [Exchange.BuyBitcoin]: {
    'Bankoverføring': true,
    'Vipps': false,
    'Kredittkort': true,
    'Lyn-nettverket': false,
    'Norsk Språk': false,
    'Registrert hos Finanstilsynet': false,
  },
};

const DetailedComparison: React.FC = () => {
  const exchanges = Object.values(Exchange);

  return (
    <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm mt-8">
      <div className="p-6 border-bottom border-gray-100">
        <h2 className="text-xl font-bold text-gray-900">Egenskaper & Funksjoner</h2>
        <p className="text-sm text-gray-500">Sammenlign funksjonalitet på tvers av plattformer</p>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 border-y border-gray-100">
              <th className="p-4 text-xs font-mono uppercase tracking-wider text-gray-400 italic">Funksjon</th>
              {exchanges.map((exchange) => (
                <th key={exchange} className="p-4 text-center min-w-[120px]">
                  <div className="flex flex-col items-center gap-2">
                    <ExchangeIcon exchange={exchange} size={24} />
                    <span className="text-[10px] font-bold uppercase tracking-tighter text-gray-600">{exchange}</span>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {FEATURES.map((feature) => (
              <tr key={feature.name} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                <td className="p-4">
                  <div className="flex items-center gap-2 group relative">
                    <span className="text-sm font-medium text-gray-700">{feature.name}</span>
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                      <Info size={14} className="text-gray-400 cursor-help" />
                      <div className="absolute left-0 bottom-full mb-2 w-48 p-2 bg-gray-900 text-white text-[10px] rounded shadow-xl pointer-events-none z-50">
                        {feature.description}
                      </div>
                    </div>
                  </div>
                </td>
                {exchanges.map((exchange) => {
                  const hasFeature = EXCHANGE_DATA[exchange][feature.name];
                  return (
                    <td key={`${exchange}-${feature.name}`} className="p-4 text-center">
                      <div className="flex justify-center">
                        {hasFeature ? (
                          <div className="bg-green-100 p-1 rounded-full">
                            <Check size={14} className="text-green-600" />
                          </div>
                        ) : (
                          <div className="bg-gray-100 p-1 rounded-full">
                            <X size={14} className="text-gray-400" />
                          </div>
                        )}
                      </div>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DetailedComparison;
