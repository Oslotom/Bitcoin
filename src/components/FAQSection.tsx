import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Shield, CreditCard, Award, HelpCircle } from 'lucide-react';

interface FAQItem {
  question: string;
  answer: string;
}

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const faqs: FAQItem[] = [
    {
      question: "Hvordan kjøper man Bitcoin i Norge?",
      answer: "Her er den enkle standardprosedyren for å kjøpe Bitcoin i Norge:\n1. Velg en sikker kryptobørs registrert hos Finanstilsynet (for eksempel Bare Bitcoin, Firi eller NBX).\n2. Opprett en konto og verifiser identiteten din på få sekunder ved hjelp av BankID.\n3. Overfør norske kroner (NOK) raskt og trygt med Vipps, straksbetaling eller vanlig bankoverføring.\n4. Gjennomfør Bitcoin-kjøpet med din innskutte saldo.\n5. Overfør dine Bitcoins til en trygg, personlig hardware-lommebok for sikker langtidsoppbevaring."
    },
    {
      question: "Hvilken norsk kryptobørs er den beste og billigste?",
      answer: "Det finnes ingen enkeltstående plattform som er best til absolutt alt, men det avhenger av dine preferanser:\n- Firi er ideell for nybegynnere som ønsker en trygg plattform med automatisk skatteberegning, rask BankID-registrering og Vipps-støtte.\n- Bare Bitcoin er en svært lynrask og optimalisert spesialistplattform for kjøp og fast sparing i kun Bitcoin, med svært lav spredning og Lightning-nettverksstøtte.\n- NBX passer for bedrifter og de som ønsker avanserte handelsmuligheter og kredittkort-fordeler.\n- Globale børser som Kraken og Binance har lavere nominelle handelsgebyrer, men medfører betydelig høyere kostnader ved valutaveksling (fra NOK til EUR/USD) og internasjonale bankgebyrer, i tillegg til at de mangler automatisk skatterapportering."
    },
    {
      question: "Kan man kjøpe Bitcoin med Vipps?",
      answer: "Ja, det er fullt mulig og svært populært å kjøpe Bitcoin med Vipps i Norge. Børser som Firi og NBX tilbyr direkte integrasjon med Vipps. Dette betyr at du kan gjøre innskudd på sekunder og kjøpe krypto umiddelbart, selv om denne innskuddsmetoden ofte har et noe høyere gebyr enn vanlige bankoverføringer."
    },
    {
      question: "Hvordan fungerer beskatning av Bitcoin i Norge?",
      answer: "I Norge er gevinster ved salg eller realisasjon av Bitcoin skattepliktig som kapitalinntekt (prosentandelen følger ordinær skattesats for alminnelig inntekt). Tilsvarende får du fradrag for eventuelle tap. Formuesverdien av dine Bitcoins per 31. desember skal også oppgis i skattemeldingen. Hvis du benytter en norskregistrert tjeneste som Firi eller NBX, rapporteres disse tallene automatisk inn til Skatteetaten slik at opplysningene ligger ferdig utfylt i din skattemelding."
    },
    {
      question: "Er det lovlig og trygt å investere i Bitcoin i Norge?",
      answer: "Ja, det er 100 % lovlig å eie, kjøpe og selge Bitcoin i Norge. For din egen sikkerhet anbefales det på det sterkeste å kun benytte kryptovalutatjenester som er offisielt registrert hos det norske Finanstilsynet. Dette forsikrer at plattformen følger strenge norske regler for sikkerhet, hvitvasking og finansiell rapportering."
    }
  ];

  return (
    <section className="mt-16 space-y-16 border-t border-slate-100 pt-16" aria-label="SEO og FAQ Seksjon">
      {/* 2-Column Educational Info & SEO keywords */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
        <div className="space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-orange-50 text-orange-700 rounded-full text-xs font-black uppercase tracking-wider">
            <Shield size={12} /> Trygg crypto-guide
          </div>
          <h2 className="text-2xl font-black tracking-tight text-slate-900 uppercase">
            Hva bør du vurdere når du skal <span className="text-orange-600">kjøpe Bitcoin</span> i Norge?
          </h2>
          <p className="text-slate-600 text-sm leading-relaxed">
            Når du sammenligner kryptobørser, er det fort gjort å kun se på handelsgebyret. For å finne den 
            <strong> billigste måten å kjøpe Bitcoin på</strong>, må du ta tre kritiske faktorer i betraktning:
          </p>
          <ul className="space-y-3 text-sm text-slate-600">
            <li className="flex items-start gap-2">
              <span className="text-orange-600 font-bold">•</span>
              <div>
                <strong>Handelsgebyr (Kurtasje):</strong> Prosentandelen børsen tar for å utføre ordren din (ligger typisk mellom 0,1% og 1,5%).
              </div>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-orange-600 font-bold">•</span>
              <div>
                <strong>Spredning (Spread):</strong> Forskjellen på kjøpspris og salgspris i ordreboken. Enkelte aktører reklamerer med null gebyr, men tar seg i stedet godt betalt gjennom en kunstig høy spread.
              </div>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-orange-600 font-bold">•</span>
              <div>
                <strong>Overførings- og nettverksgebyrer:</strong> Hva det koster å sette inn norske kroner (NOK) og – viktigst av alt – hva det koster å ta ut dine Bitcoin til din egen lommebok.
              </div>
            </li>
          </ul>
        </div>

        <div className="bg-slate-50/50 border border-slate-100 p-6 rounded-2xl space-y-6">
          <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
            <Award className="text-orange-600" size={18} /> Slik lykkes du trinn-for-trinn
          </h3>
          
          <ol className="space-y-4 text-xs font-medium text-slate-700">
            <li className="flex gap-3">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-orange-600 text-white font-mono font-black text-xs">1</span>
              <div className="space-y-0.5">
                <span className="font-bold text-slate-900 text-sm block">Sammenlign live kurser</span>
                <p className="text-slate-500 font-normal leading-relaxed">Bruk vår sanntidskalkulator til å beregne nøyaktig hvor mye Bitcoin (BTC) du får utbetalt etter alle gebyrer og spredninger.</p>
              </div>
            </li>
            <li className="flex gap-3">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-slate-900 text-white font-mono font-black text-xs">2</span>
              <div className="space-y-0.5">
                <span className="font-bold text-slate-900 text-sm block">Verifiser med BankID</span>
                <p className="text-slate-500 font-normal leading-relaxed">Norske kryptobørser krever hvitvasking-verifisering (KYC). Dette tar mindre enn ett minutt ved hjelp av elektronisk BankID.</p>
              </div>
            </li>
            <li className="flex gap-3">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-slate-900 text-white font-mono font-black text-xs">3</span>
              <div className="space-y-0.5">
                <span className="font-bold text-slate-900 text-sm block">Gjør innskudd og kjøp</span>
                <p className="text-slate-500 font-normal leading-relaxed">Overfør beløpet du ønsker å investere med Vipps eller bank. Så snart pengene har ankommet kontoen, kan du gjennomføre ditt kjøp.</p>
              </div>
            </li>
          </ol>
        </div>
      </div>

      {/* FAQ Accordion Section */}
      <div className="space-y-6 max-w-3xl mx-auto pt-8">
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-1.5 px-2 py-0.5 bg-slate-100 text-slate-600 rounded text-[10px] font-black uppercase tracking-wider">
            <HelpCircle size={10} /> FAQ
          </div>
          <h3 className="text-xl font-bold text-slate-900">Ofte stilte spørsmål</h3>
          <p className="text-xs text-slate-400 font-black uppercase tracking-widest">Alt du trenger å vite om Bitcoin-handel i Norge</p>
        </div>

        <div className="divide-y divide-slate-100 border-y border-slate-100">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <div key={index} className="py-4">
                <button
                  onClick={() => toggleFAQ(index)}
                  className="w-full flex justify-between items-center text-left py-2 font-bold text-slate-900 hover:text-orange-600 transition-colors text-sm md:text-base outline-none group"
                >
                  <span>{faq.question}</span>
                  <span className="text-slate-400 group-hover:text-orange-600 transition-colors shrink-0 ml-4">
                    {isOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                  </span>
                </button>
                
                <div 
                  className={`overflow-hidden transition-all duration-300 ease-in-out ${
                    isOpen ? 'max-h-[300px] opacity-100 mt-2' : 'max-h-0 opacity-0'
                  }`}
                >
                  <p className="text-xs md:text-sm text-slate-600 leading-relaxed whitespace-pre-line bg-slate-50/50 p-4 rounded-xl border border-slate-100/50">
                    {faq.answer}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
