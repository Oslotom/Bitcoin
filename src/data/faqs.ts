// Samme svar vises på forsiden, i FAQPage-schema og i llms.txt.
import { cheapestSummary } from '../components/FeeOverview';

export interface FAQItem {
  question: string;
  answer: string;
}

export const FAQS: FAQItem[] = [
  {
    question: 'Hvordan kjøper man Bitcoin i Norge?',
    answer: 'Velg en kryptobørs, kontroller tilbyderens tillatelse, opprett konto og bekreft identiteten din. Sett inn norske kroner med en betalingsmåte børsen støtter, velg Bitcoin (BTC) og kontroller mengde og totalkostnad før du bekrefter kjøpet. Etterpå kan du beholde Bitcoin hos tilbyderen eller sende dem til en egen lommebok. Du trenger ikke kjøpe én hel Bitcoin; minstebeløpet bestemmes av børsen.',
  },
  {
    question: 'Hvor er det billigst å kjøpe Bitcoin i Norge?',
    answer: cheapestSummary(),
  },
  {
    question: 'Hvilken norsk kryptobørs bør jeg velge?',
    answer: 'Sammenlign Firi, NBX og Bare Bitcoin ut fra hva du trenger, og kontroller gjeldende vilkår hos hver tilbyder. Firi tilbyr flere kryptovalutaer og verktøy for skatteberegning. NBX har blant annet handel i NOK og ordrebok. Bare Bitcoin fokuserer på Bitcoin og tilbyr autosparing og skatteoversikt. Se på totalkostnaden for ditt beløp, betalingsmåte og muligheten til å ta ut Bitcoin til egen lommebok. Listen er ikke en rangering av sikkerhet.',
  },
  {
    question: 'Kan man kjøpe Bitcoin med Vipps?',
    answer: 'Ja, hos tilbydere som Firi kan du bruke Vipps i forbindelse med kjøpet. Kontroller om betalingen er et innskudd eller et direkte kjøp, og hvilket betalingsgebyr som gjelder. Vipps- og kortbetaling kan koste mer enn bankoverføring. Se alltid på hvor mye Bitcoin du mottar for hele beløpet du betaler.',
  },
  {
    question: 'Hvordan fungerer skatt på Bitcoin i Norge?',
    answer: 'Gevinst ved salg, bytte eller bruk av Bitcoin som betaling er normalt skattepliktig som alminnelig inntekt med 22 prosent, og tap kan gi fradrag. Beholdningen ved årsskiftet inngår i formuen til markedsverdi per 1. januar året etter inntektsåret. Du har selv ansvar for opplysningene i skattemeldingen. En rapport fra børsen kan hjelpe, men må kontrolleres og suppleres med andre handler. Se Skatteetatens regler for din situasjon.',
  },
  {
    question: 'Er det trygt å kjøpe Bitcoin i Norge?',
    answer: 'Bitcoin innebærer høy risiko, og du kan tape hele investeringen. Norsk kundeservice, BankID eller en tillatelse er ingen garanti mot kursfall, svindel eller tap. Kontroller tilbyderens gjeldende tillatelse og hvilke tjenester den omfatter i Finanstilsynets virksomhetsregister. MiCA gir visse rettigheter, men beskyttelsen er ikke den samme som for tradisjonelle finansprodukter. Bruk tofaktorautentisering der det tilbys, og del aldri gjenopprettingsord eller BankID-koder.',
  },
];
