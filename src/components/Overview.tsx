import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { getFiriPrice } from '../services/api';
import CountUp from 'react-countup';
import { Info, ExternalLink, ShieldCheck, Globe, CreditCard, Landmark, Wallet, Monitor } from 'lucide-react';

interface OverviewCategory {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  platforms: string;
  fees: {
    trading: string;
    hidden: string;
    totalPercent: number;
    extraNok?: number;
  };
  pros: string[];
  cons: string[];
}

const CATEGORIES: OverviewCategory[] = [
  {
    id: 'norsk-bors',
    name: 'Norsk børs',
    description: 'Børser registrert i Norge med norsk kundeservice og enkel BankID-innlogging.',
    icon: <ShieldCheck className="text-blue-500" />,
    platforms: 'Firi, NBX, Bare Bitcoin',
    fees: {
      trading: '0.7% - 1.5%',
      hidden: 'Lav spread (0.1% - 0.5%)',
      totalPercent: 0.007,
    },
    pros: ['Norsk kundestøtte', 'Enkel innbetaling i NOK via Straksbetaling/Vipps', 'Automatisk skatterapportering'],
    cons: ['Noe høyere handelsgebyr enn utenlandske giganter'],
  },
  {
    id: 'utenlandsk-bors',
    name: 'Utenlandsk børs',
    description: 'Globale kjemper med de laveste handelsgebyrene og størst utvalg.',
    icon: <Globe className="text-purple-500" />,
    platforms: 'Binance, Kraken, Coinbase',
    fees: {
      trading: '0.1% - 0.26%',
      hidden: 'Veksling til USD/EUR (0.5%+) + Uttaksgebyr (~150-200 kr)',
      totalPercent: 0.001,
      extraNok: 150, 
    },
    pros: ['Lavest kurtasje', 'Enorme mengder verktøy', 'Størst likviditet'],
    cons: ['Ofte dyrt uttak av småsummer', 'Mangler ofte norsk støtte', 'Dyrere i NOK pga veksling'],
  },
  {
    id: 'digitale-banker',
    name: 'Digitale banker',
    description: 'Enkel tilgang via apper du kanskje allerede bruker for vanlig bank.',
    icon: <CreditCard className="text-sky-500" />,
    platforms: 'Revolut, Lunar',
    fees: {
      trading: '0.99% - 1.99%',
      hidden: 'Ofte høye spreader (1-2%)',
      totalPercent: 0.0199,
    },
    pros: ['Sprek brukeropplevelse', 'Alt på ett sted', 'Kjøp biter for 10 kroner'],
    cons: ['Kan ofte ikke trekke ut Bitcoin til egen lommebok selv', 'Ikke de beste prisene'],
  },
  {
    id: 'bitcoin-nettsider',
    name: 'Bitcoin nettsider',
    description: 'Sider spesialisert på raske kjøp uten registrering på børs.',
    icon: <Monitor className="text-orange-500" />,
    platforms: 'BuyBitcoin, Relai (CH)',
    fees: {
      trading: '1.5% - 2.5%',
      hidden: 'Spread (~1%)',
      totalPercent: 0.025,
    },
    pros: ['Fokus på selve Bitcoin', 'Enkelt oppsett for sparing', 'Ofte mulighet for direkte uttak'],
    cons: ['Høyere gebyrer enn børser'],
  },
  {
    id: 'nordnet-sertifikater',
    name: 'Investeringsplattformer',
    description: 'Eksponering mot kurs via sertifikater (ikke ekte Bitcoin du kan flytte).',
    icon: <Landmark className="text-emerald-500" />,
    platforms: 'Nordnet, Etoro',
    fees: {
      trading: '0.1% - 0.5% (Kurtasje)',
      hidden: 'Spread + Forvaltningsgebyr (årlig)',
      totalPercent: 0.005,
    },
    pros: ['Kan brukes i ASK/IPS', 'Ingen behov for egen lommebok', 'Lettforståelig for aksjeinvestorer'],
    cons: ['Du eier ikke Bitcoin selv', 'Sperret til børsens åpningstider'],
  },
  {
    id: 'hardware-lommebok',
    name: 'Hardware lommebok',
    description: 'Direkte kjøp via partnere inne i din egen lommebok-app.',
    icon: <Wallet className="text-slate-700" />,
    platforms: 'Ledger Live, Trezor Suite',
    fees: {
      trading: '3.0% - 5.0%',
      hidden: 'Høy kortavgift',
      totalPercent: 0.04,
    },
    pros: ['Bitcoin havner rett på din egen enhet', 'Maksimal sikkerhet', 'Ingen behov for mellombørs'],
    cons: ['Veldig høye gebyrer via tredjeparter'],
  },
  {
    id: 'bitcoin-minibank',
    name: 'Bitcoin minibank',
    description: 'Fysiske maskiner (ATM) hvor du kan kjøpe Bitcoin med kontanter eller kort.',
    icon: <Landmark className="text-rose-500" />,
    platforms: 'Instacoin, LocalCoin',
    fees: {
      trading: '7.0% - 15.0%',
      hidden: 'Høy spread + Fast gebyr',
      totalPercent: 0.10,
    },
    pros: ['Mulighet for kontanter', 'Umiddelbart kjøp', 'Høy grad av privatliv'],
    cons: ['Ekstremt høye gebyrer', 'Begrenset tilgjengelighet', 'Ofte dårlig kurs'],
  },
];

const Overview: React.FC = () => {
  const [spotPrice, setSpotPrice] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const amount = 10000;

  useEffect(() => {
    const fetchBaseline = async () => {
      try {
        const price = await getFiriPrice();
        setSpotPrice(price);
      } catch (err) {
        console.error('Error fetching price for overview', err);
      } finally {
        setLoading(false);
      }
    };
    fetchBaseline();
  }, []);

  const calculateBTC = (category: OverviewCategory) => {
    if (!spotPrice) return 0;
    const feeInNok = (amount * category.fees.totalPercent) + (category.fees.extraNok || 0);
    const amountAfterFee = amount - feeInNok;
    return amountAfterFee / spotPrice;
  };

  const Sparkline = ({ color, type }: { color: string, type: 'stable' | 'volatile' | 'expensive' | 'cheap' }) => {
    const paths = {
      cheap: "M0 15 Q5 5, 10 12 T20 5 T30 10 T40 2",
      stable: "M0 10 Q10 10, 20 10 T40 10",
      volatile: "M0 15 L5 5 L10 18 L15 2 L20 15 L25 5 L30 18 L40 10",
      expensive: "M0 2 Q10 5, 20 15 T40 18"
    };
    
    return (
      <svg width="60" height="20" viewBox="0 0 40 20" className="opacity-60 hidden sm:block">
        <path d={paths[type]} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" />
      </svg>
    );
  };

  const getSparklineType = (id: string): 'stable' | 'volatile' | 'expensive' | 'cheap' => {
    if (id === 'utenlandsk-bors') return 'cheap';
    if (id === 'norsk-bors') return 'stable';
    if (id === 'bitcoin-minibank' || id === 'hardware-lommebok') return 'expensive';
    return 'volatile';
  };

  return (
    <div id="overview-wrapper" className="bg-white min-h-screen">
      <div className="container mx-auto px-4 py-16 max-w-5xl">
        <motion.div
          id="overview-header"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-16"
        >
          <h1 className="text-4xl font-display font-bold text-slate-900 mb-4">Alternativer for kjøp</h1>
          <p className="text-lg font-medium text-slate-500 max-w-2xl leading-relaxed">
            En omfattende sammenligning av ulike metoder for å kjøpe Bitcoin, fra norske børser til hardware-lommebøker.
          </p>
        </motion.div>

        {/* Section: Simple Comparison List */}
        <div id="category-summary-list" className="space-y-1 mb-24 card-premium overflow-hidden">
          <div className="bg-slate-50/50 px-6 py-4 border-b border-slate-100 flex items-center justify-between text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">
            <span>Metode</span>
            <div className="hidden sm:block">Trend</div>
            <span>Est. Utfall (10k NOK)</span>
          </div>
          {CATEGORIES.map((cat, idx) => {
            const btcResult = calculateBTC(cat);
            const feePercent = (cat.fees.totalPercent * 100).toFixed(1);
            
            return (
              <motion.div
                key={cat.id}
                id={`category-item-${cat.id}`}
                initial={{ opacity: 0, x: -5 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="flex items-center justify-between py-6 hover:bg-slate-50/50 transition-colors px-6 cursor-default group border-b border-slate-50 last:border-0"
              >
                {/* Left: Icon & Name */}
                <div className="flex items-center gap-5 flex-[2] sm:flex-1">
                  <div className="w-12 h-12 rounded-xl overflow-hidden flex items-center justify-center bg-slate-50 group-hover:scale-110 transition-all duration-300 shrink-0 shadow-sm border border-slate-100">
                    <div className="scale-90">{cat.icon}</div>
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="text-base font-bold text-slate-900 leading-tight truncate">{cat.name}</span>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1 truncate">{cat.id.replace('-', ' ')}</span>
                  </div>
                </div>

                {/* Middle: Sparkline Visual (Hidden on mobile) */}
                <div id={`sparkline-${cat.id}`} className="hidden sm:flex flex-1 justify-center">
                  <Sparkline 
                    color={cat.id === 'utenlandsk-bors' ? '#10b981' : cat.fees.totalPercent > 0.03 ? '#f43f5e' : '#3b82f6'} 
                    type={getSparklineType(cat.id)} 
                  />
                </div>

                {/* Right: Price & Fees */}
                <div className="flex flex-col items-end min-w-[120px] sm:min-w-[160px] flex-1">
                  {loading ? (
                    <div className="h-5 w-24 bg-slate-100 animate-pulse rounded-lg mb-1"></div>
                  ) : (
                    <div className="text-lg font-bold text-slate-900 font-mono tracking-tight">
                      <CountUp 
                        end={btcResult} 
                        decimals={6} 
                        duration={1} 
                        separator=" " 
                        decimal="," 
                      /> BTC
                    </div>
                  )}
                  <div className="flex items-center gap-1.5">
                    <span className={`text-[10px] font-bold uppercase tracking-wider ${cat.fees.totalPercent > 0.03 ? 'text-rose-500' : 'text-brand'}`}>
                      {cat.fees.totalPercent > 0 ? (cat.fees.totalPercent > 0.03 ? '↘' : '↗') : ''} {feePercent}% avgift
                    </span>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Section: Extensive Depth Analysis Grid */}
        <div className="space-y-8 mb-12">
          <h2 id="analysis-grid-title" className="text-xs font-bold text-slate-400 uppercase tracking-[0.3em]">Dybdeanalyse</h2>
          <div id="detailed-analysis-grid" className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {CATEGORIES.map((cat, idx) => (
              <motion.div
                key={cat.id}
                id={`analysis-card-${cat.id}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * idx }}
                className="card-premium p-8 hover:border-brand/30 transition-all group"
              >
                <div className="flex items-center gap-5 mb-8">
                  <div className="p-4 bg-slate-50 rounded-2xl group-hover:bg-blue-50 transition-colors border border-slate-100">{cat.icon}</div>
                  <h3 className="text-2xl font-display font-bold text-slate-900">{cat.name}</h3>
                </div>
                <p className="text-slate-600 mb-8 text-base leading-relaxed font-medium">{cat.description}</p>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 mb-8">
                  <div id={`pros-${cat.id}`} className="space-y-4">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-emerald-600 flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> Fordeler
                    </p>
                    <ul className="space-y-3">
                      {cat.pros.map(pro => (
                        <li key={pro} className="text-xs text-slate-600 flex items-start gap-3 leading-relaxed">
                          <span className="text-emerald-500 font-bold shrink-0">✓</span> {pro}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div id={`cons-${cat.id}`} className="space-y-4">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-rose-500 flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-rose-500" /> Ulemper
                    </p>
                    <ul className="space-y-3">
                      {cat.cons.map(con => (
                        <li key={con} className="text-xs text-slate-600 flex items-start gap-3 leading-relaxed">
                          <span className="text-rose-500 font-bold shrink-0">✕</span> {con}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
                
                <div className="pt-8 border-t border-slate-50 flex justify-between items-center">
                  <div className="flex items-center gap-2 text-slate-400">
                    <Info size={14} className="shrink-0" />
                    <span className="text-[10px] uppercase font-bold tracking-tight">Estimat per 10k NOK</span>
                  </div>
                  <button className="text-brand text-[11px] font-bold flex items-center gap-1.5 hover:translate-x-1 transition-transform">
                    Les guide <ExternalLink size={14} />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Section: Legal/Footer Disclaimer */}
        <div id="disclaimer-section" className="mt-24 p-10 bg-slate-50 rounded-3xl border border-slate-100 space-y-4">
          <p className="font-bold text-slate-900 text-lg flex items-center gap-3">
            <Info size={20} className="text-brand" /> Viktig informasjon
          </p>
          <p className="text-slate-500 text-sm leading-relaxed font-medium">
            Gebyrsatsene ovenfor er estimater og kan endre seg basert på markedsforhold, volumrabatter eller spesielle kampanjer. 
            Ved kjøp av Bitcoin er det viktig å skille mellom handelsgebyr (commission/fee) og spread (forskjell mellom kjøps- og salgspris).
            Utenlandske børser er ofte billigst på gebyrer, men kan koste mer i vekslingsgebyr fra NOK og uttaksgebyr til egen lommebok.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Overview;
