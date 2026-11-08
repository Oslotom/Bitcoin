import { useEffect, useRef } from 'react';
import { motion, useReducedMotion, useScroll, useTransform } from 'motion/react';
import { ArrowDown, ArrowUpRight, BookOpen, Check, ChevronRight, CircleHelp, Layers3, RefreshCw, Wallet } from 'lucide-react';
import type { ComparisonResult } from '../types';
import { CryptoCurrency } from '../types';
import { PAGE_PATHS } from '../routes';
import HeroTableIllustration from './HeroTableIllustration';
import ResultsTable from './ResultsTable';
import ExchangePriceChart from './ExchangePriceChart';
import FAQSection from './FAQSection';
import { feeRows } from './FeeOverview';

interface Props {
  results: ComparisonResult[];
  isLoading: boolean;
  error: string | null;
  onRetry: () => void;
}

const guides = [
  { href: PAGE_PATHS.overview, icon: BookOpen, number: '01', category: 'Kom i gang', title: 'Ditt første Bitcoin-kjøp.', description: 'Fra konto og innskudd til kjøp og oppbevaring. Ett steg om gangen.', color: 'blue' },
  { href: PAGE_PATHS.norway, icon: Layers3, number: '02', category: 'Velg en børs', title: 'Norske børser, forklart.', description: 'Bli kjent med Firi, NBX og Bare Bitcoin. Se hva du bør sammenligne.', color: 'green' },
  { href: PAGE_PATHS.tax, icon: Wallet, number: '03', category: 'Ha oversikten', title: 'Ta skatten fra starten.', description: 'Få oversikt over hva du må dokumentere, og hva som skal rapporteres.', color: 'peach' },
];

export default function HomePage({ results, isLoading, error, onRetry }: Props) {
  const root = useRef<HTMLDivElement>(null);
  const hero = useRef<HTMLElement>(null);
  const reducedMotion = useReducedMotion();
  const { scrollYProgress } = useScroll();
  const { scrollYProgress: heroProgress } = useScroll({ target: hero, offset: ['start start', 'end start'] });
  const illustrationY = useTransform(heroProgress, [0, 1], [0, reducedMotion ? 0 : 55]);
  const illustrationRotate = useTransform(heroProgress, [0, 1], [0, reducedMotion ? 0 : 3]);
  const rows = feeRows();
  const norwegianRows = rows.filter((row) => row.norwegian);
  const exampleLow = Math.round(norwegianRows[0].total * 10000);
  const exampleHigh = Math.round(norwegianRows[norwegianRows.length - 1].total * 10000);

  useEffect(() => {
    if (!('IntersectionObserver' in window)) return;
    // Animate on entry without hiding server-rendered content or depending on JS for visibility.
    const revealObserver = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
          entry.target.animate(
            [{ opacity: 0.25, transform: 'translateY(22px)' }, { opacity: 1, transform: 'translateY(0)' }],
            { duration: 650, easing: 'cubic-bezier(0.22, 1, 0.36, 1)' },
          );
        }
        revealObserver.unobserve(entry.target);
      }
    }, { threshold: 0.12 });
    root.current?.querySelectorAll('[data-reveal]').forEach((element) => revealObserver.observe(element));

    return () => revealObserver.disconnect();
  }, []);

  return (
    <div ref={root} className="home-page">
      <motion.div aria-hidden="true" className="reading-progress" style={{ scaleX: reducedMotion ? 0 : scrollYProgress }} />
      <section ref={hero} className="landing-hero home-hero" aria-labelledby="home-title">
        <div aria-hidden="true" className="hero-glow" />
        <div className="site-container relative grid items-center gap-12 py-14 sm:py-20 lg:grid-cols-[1.1fr_1fr] lg:gap-14 lg:py-24">
          <div className="hero-copy">
            <h1 id="home-title" className="hero-heading">Kjøpe Bitcoin.<br /><span className="hero-title-accent">Med mer oversikt.</span></h1>
            <p className="mt-6 max-w-md text-base leading-relaxed text-slate-600 sm:text-lg">Skal du kjøpe Bitcoin? Sammenlign kurs og beregnede kostnader hos {rows.length} børser. Finn forskjellene før du velger.</p>
            <div className="mt-7 flex flex-wrap gap-x-5 gap-y-2 text-xs text-slate-600">
              <span className="inline-flex items-center gap-1.5"><Check size={14} className="text-brand" aria-hidden="true" /> Priser i norske kroner</span>
              <span className="inline-flex items-center gap-1.5"><Check size={14} className="text-brand" aria-hidden="true" /> Gebyrer synliggjort</span>
            </div>
          </div>
          <motion.div className="hero-illustration-wrap" style={{ y: illustrationY, rotate: illustrationRotate }}>
            <HeroTableIllustration />
          </motion.div>
        </div>
      </section>

      <section id="kjop-bitcoin" aria-labelledby="comparison-title" className="site-container home-section">
        <h2 id="comparison-title" className="sr-only">Sammenlign Bitcoin-priser</h2>
        <div className="comparison-panel">
          <div>
            {isLoading ? (
              <div role="status" className="comparison-loading">
                <p className="mb-6 text-sm text-slate-500">Henter kurs og beregner kostnader …</p>
                <div aria-hidden="true" className="space-y-5">
                  {Array.from({ length: 6 }, (_, index) => <div key={index} className="comparison-skeleton-row"><span /><span /><span /></div>)}
                </div>
              </div>
            ) : (
              <ResultsTable results={results} isLoading={false} error={error} crypto={CryptoCurrency.BTC} compact />
            )}
            {error && <div className="mt-4 text-center"><button type="button" className="btn-secondary" onClick={onRetry}><RefreshCw size={15} aria-hidden="true" /> Prøv igjen</button></div>}
          </div>
          <div className="comparison-panel-bottom">
            <p>Noen priser er referanseestimater. Innskudd, uttak og valutaveksling kommer i tillegg.</p>
            <a href="/om-oss#metode">Se prisgrunnlaget <ArrowUpRight size={13} aria-hidden="true" /></a>
          </div>
        </div>
        <div className="mt-5 flex flex-wrap items-center justify-between gap-3 text-sm">
          <a href="#prisforskjell" className="inline-flex items-center gap-2 font-medium text-brand">Se forskjellene i grafen <ArrowDown size={14} aria-hidden="true" /></a>
          <a href="/om-oss#gebyroversikt" className="text-slate-500 underline decoration-slate-300 underline-offset-4 hover:text-brand">Se gebyrer uten live-kurs</a>
        </div>
      </section>

      <div className="home-chart-area" data-reveal>
        <ExchangePriceChart results={results} isLoading={isLoading} error={error} />
      </div>

      <section id="slik-velger-du" className="site-container home-section" aria-labelledby="choose-title">
        <div data-reveal className="cost-story">
          <div>
            <p className="section-eyebrow !text-blue-200">02 / Se hele regnestykket</p>
            <h2 id="choose-title" className="home-section-title !text-white">Et lite gebyr.<br />En del av ditt kjøp.</h2>
            <p className="mt-5 max-w-md text-sm leading-relaxed text-slate-300 sm:text-base">Et lavt handelsgebyr forteller ikke hele historien. Spread, betalingsmåte og uttak kan også påvirke hva du sitter igjen med.</p>
            <a href="/om-oss#metode" className="mt-6 inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-white">Forstå kostnadene <ArrowUpRight size={16} aria-hidden="true" /></a>
          </div>
          <div className="cost-example">
            <p className="text-xs font-medium text-slate-400">Eksempel · kjøp for 10 000 kr</p>
            <p className="mt-3 text-4xl font-semibold tracking-tight text-white sm:text-5xl">{exampleLow}–{exampleHigh}<span className="ml-2 text-xl text-slate-400">kr</span></p>
            <p className="mt-2 text-sm text-slate-300">Beregnet gebyr + spread hos norske børser</p>
            <div className="my-6 space-y-4">
              {norwegianRows.map((row) => (
                <div key={row.exchange}>
                  <div className="mb-2 flex justify-between text-xs text-slate-300"><span>{row.exchange}</span><span className="font-semibold text-white">{Math.round(row.total * 10000)} kr</span></div>
                  <div className="cost-track" aria-hidden="true"><div style={{ width: `${row.total / norwegianRows[norwegianRows.length - 1].total * 100}%` }} /></div>
                </div>
              ))}
            </div>
            <p className="border-t border-white/10 pt-4 text-xs leading-relaxed text-slate-400">Basert på gebyrmodellen vår, ikke et kjøpstilbud. Innskudd, uttak og eventuell valutaveksling er ikke med.</p>
          </div>
        </div>
      </section>

      <section className="site-container pb-16 sm:pb-24" aria-labelledby="guides-title">
        <div data-reveal className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div><p className="section-eyebrow">03 / Fra oversikt til innsikt</p><h2 id="guides-title" className="home-section-title">Ta neste steg med oversikt.</h2></div>
          <p className="max-w-xs text-sm leading-relaxed text-slate-500">Ny med Bitcoin, eller bare ute etter et bedre beslutningsgrunnlag?</p>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {guides.map(({ href, icon: Icon, number, category, title, description, color }) => (
            <a data-reveal key={number} href={href} className={`guide-card guide-card-${color}`}>
              <div className="flex items-start justify-between"><span className="guide-icon"><Icon size={24} strokeWidth={1.5} aria-hidden="true" /></span><span className="text-xs font-medium text-slate-500">{number}</span></div>
              <p className="mt-8 text-xs font-medium text-slate-500">{category}</p>
              <h3 className="mt-2 text-xl font-semibold tracking-tight text-slate-900">{title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-slate-600">{description}</p>
              <span className="mt-7 inline-flex items-center gap-2 text-sm font-semibold text-slate-900">Les guiden <ArrowUpRight size={17} aria-hidden="true" /></span>
            </a>
          ))}
        </div>
      </section>

      <section id="sporsmal" className="home-faq-area" aria-label="Spørsmål om Bitcoin">
        <div className="site-container py-12 sm:py-16" data-reveal>
          <FAQSection />
          <div className="home-closing">
            <div className="flex items-center gap-3"><CircleHelp size={21} className="shrink-0 text-brand" aria-hidden="true" /><p className="text-sm text-slate-600">Lurer du på hvordan vi sammenligner?</p></div>
            <a href={PAGE_PATHS.about} className="inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-brand">Bli kjent med tjenesten <ChevronRight size={16} aria-hidden="true" /></a>
          </div>
          <p className="mt-6 max-w-2xl text-xs leading-relaxed text-slate-500">Bitcoin kan svinge kraftig i verdi, og du kan tape hele investeringen. Sammenligningen er informasjon, ikke en anbefaling om å investere.</p>
        </div>
      </section>
    </div>
  );
}
