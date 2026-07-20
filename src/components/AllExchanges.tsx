import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ExternalLink, Search, Globe, Shield, Zap, Info } from 'lucide-react';

interface Platform {
  name: string;
  type: 'Exchange' | 'Broker' | 'Wallet' | 'P2P' | 'Payment App';
  region: 'Global' | 'Norway' | 'Europe' | 'USA';
  rating: string;
  features: string[];
  url: string;
}

const ALL_PLATFORMS: Platform[] = [
  { name: 'Firi', type: 'Exchange', region: 'Norway', rating: '5/5', features: ['Vipps', 'BankID', 'Norsk support'], url: 'https://firi.com' },
  { name: 'NBX', type: 'Exchange', region: 'Norway', rating: '4.8/5', features: ['BankID', 'Lav spread', 'Børsnotert'], url: 'https://nbx.com' },
  { name: 'Bare Bitcoin', type: 'Exchange', region: 'Norway', rating: '4.9/5', features: ['Kun Bitcoin', 'Lynrask', 'Enkelt'], url: 'https://barebitcoin.no' },
  { name: 'Binance', type: 'Exchange', region: 'Global', rating: '4.7/5', features: ['Lavest gebyr', 'Stort utvalg', 'Avansert'], url: 'https://binance.com' },
  { name: 'Coinbase', type: 'Broker', region: 'Global', rating: '4.5/5', features: ['Brukervennlig', 'Sikkert', 'NASDAQ-notert'], url: 'https://coinbase.com' },
  { name: 'Kraken', type: 'Exchange', region: 'Global', rating: '4.8/5', features: ['Høy sikkerhet', 'Lav fee', 'God support'], url: 'https://kraken.com' },
  { name: 'Revolut', type: 'Payment App', region: 'Europe', rating: '4.2/5', features: ['Alt-i-ett', 'Raskt', 'Bank-app'], url: 'https://revolut.com' },
  { name: 'Crypto.com', type: 'Exchange', region: 'Global', rating: '4.3/5', features: ['Visa-kort', 'App-fokusert', 'Cashback'], url: 'https://crypto.com' },
  { name: 'Bitstamp', type: 'Exchange', region: 'Europe', rating: '4.4/5', features: ['Eldst i Europa', 'Institusjonell', 'Trygt'], url: 'https://bitstamp.net' },
  { name: 'ByBit', type: 'Exchange', region: 'Global', rating: '4.5/5', features: ['Derivater', 'Trading', 'Høy likviditet'], url: 'https://bybit.com' },
  { name: 'KuCoin', type: 'Exchange', region: 'Global', rating: '4.4/5', features: ['Mange coins', 'Trading bots', 'Global'], url: 'https://kucoin.com' },
  { name: 'Gate.io', type: 'Exchange', region: 'Global', rating: '4.1/5', features: ['Tidlig ute', 'Mange altcoins', 'Startup launchpad'], url: 'https://gate.io' },
  { name: 'OKX', type: 'Exchange', region: 'Global', rating: '4.6/5', features: ['Web3 wallet', 'DeFi', 'Lav fee'], url: 'https://okx.com' },
  { name: 'Gemini', type: 'Exchange', region: 'USA', rating: '4.5/5', features: ['Regulert', 'Sikkert', 'Winklevoss'], url: 'https://gemini.com' },
  { name: 'Bitfinex', type: 'Exchange', region: 'Global', rating: '4.3/5', features: ['Avansert trading', 'Likviditet', 'Lending'], url: 'https://bitfinex.com' },
  { name: 'Luno', type: 'Broker', region: 'Global', rating: '4.2/5', features: ['Enkel app', 'Utdanning', 'Trygt'], url: 'https://luno.com' },
  { name: 'Huobi', type: 'Exchange', region: 'Global', rating: '4.2/5', features: ['Stort utvalg', 'Asiatisk fokus', 'Trading'], url: 'https://huobi.com' },
  { name: 'Bitget', type: 'Exchange', region: 'Global', rating: '4.4/5', features: ['Copy trading', 'Nyskapende', 'Sikkerhet'], url: 'https://bitget.com' },
  { name: 'MEXC', type: 'Exchange', region: 'Global', rating: '4.1/5', features: ['Ingen KYC krav', 'Mange coins', 'Raskt'], url: 'https://mexc.com' },
  { name: 'SwissBorg', type: 'Broker', region: 'Europe', rating: '4.6/5', features: ['Smart engine', 'Staking', 'Sveitsisk'], url: 'https://swissborg.com' },
  { name: 'Bitvavo', type: 'Exchange', region: 'Europe', rating: '4.5/5', features: ['Lav fee', 'Europeisk', 'Trygt'], url: 'https://bitvavo.com' },
  { name: 'Bison', type: 'Broker', region: 'Europe', rating: '4.4/5', features: ['Tysk børs', 'Sikkert', 'Enkelt'], url: 'https://bisonapp.com' },
  { name: 'Trade Republic', type: 'Broker', region: 'Europe', rating: '4.3/5', features: ['Aksjer & Krypto', 'Sparing', 'Europeisk'], url: 'https://traderepublic.com' },
  { name: 'eToro', type: 'Broker', region: 'Global', rating: '4.0/5', features: ['Social trading', 'CopyPortfolios', 'Enkelt'], url: 'https://etoro.com' },
  { name: 'Paxful', type: 'P2P', region: 'Global', rating: '3.9/5', features: ['Markedsplass', 'Mange betalingsmåter', 'Global'], url: 'https://paxful.com' },
  { name: 'LocalBitcoins', type: 'P2P', region: 'Global', rating: '3.8/5', features: ['Person-til-person', 'Historisk', 'Cash'], url: 'https://localbitcoins.com' },
  { name: 'Bisq', type: 'P2P', region: 'Global', rating: '4.7/5', features: ['Desentralisert', 'Anonymt', 'Open source'], url: 'https://bisq.network' },
  { name: 'Relai', type: 'Broker', region: 'Europe', rating: '4.8/5', features: ['Sveitsisk', 'Kun Bitcoin', 'Ingen KYC'], url: 'https://relai.app' },
  { name: 'Pocket Bitcoin', type: 'Broker', region: 'Europe', rating: '4.8/5', features: ['DCA fokus', 'Direkte til wallet', 'Sveitsisk'], url: 'https://pocketbitcoin.com' },
  { name: 'Swan Bitcoin', type: 'Broker', region: 'USA', rating: '4.9/5', features: ['Bitcoin maximalist', 'DCA', 'Lav fee'], url: 'https://swanbitcoin.com' },
  { name: 'Strike', type: 'Payment App', region: 'Global', rating: '4.8/5', features: ['Lightning network', 'Jack Mallers', 'Gratis'], url: 'https://strike.me' },
  { name: 'Cash App', type: 'Payment App', region: 'USA', rating: '4.5/5', features: ['Enkelt', 'Lightning', 'Populært'], url: 'https://cash.app' },
  { name: 'Blockchain.com', type: 'Wallet', region: 'Global', rating: '3.5/5', features: ['Wallet + Exchange', 'Enkelt', 'Historisk'], url: 'https://blockchain.com' },
  { name: 'Exodus', type: 'Wallet', region: 'Global', rating: '4.6/5', features: ['Multicurrency', 'Design', 'In-app swap'], url: 'https://exodus.com' },
  { name: 'Trust Wallet', type: 'Wallet', region: 'Global', rating: '4.7/5', features: ['Web3', 'Staking', 'Binance-eid'], url: 'https://trustwallet.com' },
  { name: 'MetaMask', type: 'Wallet', region: 'Global', rating: '4.5/5', features: ['Browser extension', 'Ethereum fokus', 'Swap'], url: 'https://metamask.io' },
  { name: 'BitPanda', type: 'Broker', region: 'Europe', rating: '4.4/5', features: ['Østerriksk', 'Gull & Krypto', 'Kort'], url: 'https://bitpanda.com' },
  { name: 'Kriptomat', type: 'Broker', region: 'Europe', rating: '4.1/5', features: ['Enkelt', 'Europeisk regulert', 'Support'], url: 'https://kriptomat.io' },
  { name: 'WhiteBit', type: 'Exchange', region: 'Europe', rating: '4.3/5', features: ['Europeisk', 'Sikkert', 'Stort utvalg'], url: 'https://whitebit.com' },
  { name: 'Poloniex', type: 'Exchange', region: 'Global', rating: '3.7/5', features: ['Historisk', 'Altcoins', 'Justin Sun'], url: 'https://poloniex.com' },
  { name: 'Bittrex', type: 'Exchange', region: 'Global', rating: '3.8/5', features: ['Mange coins', 'Regulert', 'Sikkert'], url: 'https://bittrex.com' },
  { name: 'Paypal', type: 'Payment App', region: 'Global', rating: '3.5/5', features: ['Veldig enkelt', 'Begrenset uttak', 'Kjent merke'], url: 'https://paypal.com' },
  { name: 'Skrill', type: 'Payment App', region: 'Global', rating: '3.4/5', features: ['Digital wallet', 'Gambling fokus', 'Krypto'], url: 'https://skrill.com' },
  { name: 'Neteller', type: 'Payment App', region: 'Global', rating: '3.4/5', features: ['Samme som Skrill', 'Raskt', 'Fees'], url: 'https://neteller.com' },
  { name: 'Wirex', type: 'Broker', region: 'Europe', rating: '4.0/5', features: ['Krypto kort', 'Cashback', 'Daily spending'], url: 'https://wirexapp.com' },
  { name: 'Bitrue', type: 'Exchange', region: 'Global', rating: '4.0/5', features: ['XRP fokus', 'Yield farming', 'Trading'], url: 'https://bitrue.com' },
  { name: 'Upbit', type: 'Exchange', region: 'Global', rating: '4.2/5', features: ['Koreansk fokus', 'Høyt volum', 'Trygt'], url: 'https://upbit.com' },
  { name: 'Bithumb', type: 'Exchange', region: 'Global', rating: '4.1/5', features: ['Koreansk', 'Historisk', 'Likviditet'], url: 'https://bithumb.com' },
  { name: 'Phemex', type: 'Exchange', region: 'Global', rating: '4.4/5', features: ['Trading', 'Null gebyr med premium', 'Raskt'], url: 'https://phemex.com' },
  { name: 'Liquid', type: 'Exchange', region: 'Global', rating: '4.0/5', features: ['FTX-eid (nå lukket?)', 'Asiatisk', 'Sikkert'], url: 'https://liquid.com' }
];

export default function AllExchanges() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('Alle');

  const filteredPlatforms = ALL_PLATFORMS.filter(p => 
    (p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
     p.features.some(f => f.toLowerCase().includes(searchTerm.toLowerCase()))) &&
    (filterType === 'Alle' || p.type === filterType)
  );

  const types = ['Alle', ...Array.from(new Set(ALL_PLATFORMS.map(p => p.type)))];

  return (
    <div id="all-exchanges-page" className="space-y-12 animate-fade-in font-table">
      <div className="text-center space-y-4">
        <h2 className="text-4xl font-display font-bold tracking-tight text-slate-900">
          Alle handelsplasser for <span className="text-brand">Bitcoin</span>
        </h2>
        <p className="text-slate-500 text-lg font-medium max-w-2xl mx-auto leading-relaxed">
          En komplett oversikt over 50 plattformer hvor du kan kjøpe, selge og handle kryptovaluta.
        </p>
      </div>

      <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text"
            placeholder="Søk etter navn eller funksjon (f.eks Vipps)..."
            className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand focus:bg-white transition-all text-sm font-medium"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 no-scrollbar">
          {types.map(type => (
            <button
              key={type}
              onClick={() => setFilterType(type)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                filterType === type 
                ? 'bg-brand text-white shadow-md shadow-blue-100' 
                : 'bg-slate-50 text-slate-500 hover:bg-slate-100'
              }`}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      <div className="card-premium overflow-hidden border border-slate-100">
        <div className="overflow-x-auto no-scrollbar">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100">
                <th className="px-3 md:px-6 py-3 text-[9px] md:text-[10px] font-bold text-slate-400 uppercase tracking-widest">Plattform</th>
                <th className="px-2 md:px-6 py-3 text-[9px] md:text-[10px] font-bold text-slate-400 uppercase tracking-widest">Type</th>
                <th className="px-2 md:px-6 py-3 text-[9px] md:text-[10px] font-bold text-slate-400 uppercase tracking-widest">Region</th>
                <th className="hidden md:table-cell px-6 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Egenskaper</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredPlatforms.map((p, i) => (
                <tr 
                  key={i} 
                  className="group hover:bg-slate-50/80 transition-colors cursor-pointer"
                  onClick={() => window.open(p.url, '_blank')}
                >
                  <td className="px-3 md:px-6 py-3 md:py-4">
                    <div className="flex flex-col">
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs md:text-sm font-bold text-slate-900 group-hover:text-brand transition-colors truncate">{p.name}</span>
                        <span className="text-[8px] md:text-[10px] text-emerald-600 font-black px-1 bg-emerald-50 rounded">
                          {p.rating.split('/')[0]}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="px-2 md:px-6 py-3 md:py-4">
                    <span className="text-[9px] md:text-[10px] font-bold text-slate-500 uppercase tracking-tighter">
                      {p.type.split(' ')[0]}
                    </span>
                  </td>
                  <td className="px-2 md:px-6 py-3 md:py-4">
                    <div className="flex items-center gap-1">
                      <Globe size={10} className="text-slate-300 hidden md:block" />
                      <span className="text-[9px] md:text-[10px] text-slate-400 font-bold uppercase tracking-tighter">{p.region}</span>
                    </div>
                  </td>
                  <td className="hidden md:table-cell px-6 py-4">
                    <div className="flex flex-wrap gap-1">
                      {p.features.slice(0, 2).map((f, fi) => (
                        <span key={fi} className="px-1.5 py-0.5 bg-blue-50/50 text-brand rounded text-[9px] font-bold border border-blue-100/30 whitespace-nowrap">
                          {f}
                        </span>
                      ))}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="p-8 bg-blue-50 rounded-3xl border border-blue-100 flex flex-col md:flex-row items-center gap-8">
        <div className="p-4 bg-white rounded-2xl shadow-sm">
          <Info size={32} className="text-brand" />
        </div>
        <div className="space-y-2 text-center md:text-left">
          <h4 className="text-lg font-bold text-slate-900">Trenger du hjelp til å velge?</h4>
          <p className="text-sm text-slate-600 leading-relaxed font-medium">
            Det finnes hundrevis av børser der ute. For norske brukere anbefaler vi alltid å starte med en norsk-registrert børs som <strong>Firi</strong> eller <strong>Bare Bitcoin</strong> for best mulig trygghet og enkelhet med BankID og Vipps.
          </p>
        </div>
      </div>
    </div>
  );
}
