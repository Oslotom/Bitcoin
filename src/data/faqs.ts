// Samme svar vises på forsiden, i FAQPage-schema og i llms.txt.
import { cheapestSummary } from '../components/FeeOverview';

export interface FAQItem {
  question: string;
  answer: string;
}

export const FAQS: FAQItem[] = [
  {
    question: 'Hvordan kjøper man Bitcoin i Norge?',
    answer: 'Velg børs, opprett konto, bekreft identiteten og sett inn penger. Velg Bitcoin (BTC), og kontroller beløp og kostnader før du bekrefter. Du kan kjøpe en brøkdel av én Bitcoin.',
  },
  {
    question: 'Hvor er det billigst å kjøpe Bitcoin i Norge?',
    answer: cheapestSummary(),
  },
  {
    question: 'Hvilken norsk kryptobørs bør jeg velge?',
    answer: 'Sammenlign totalkostnad, betalingsmåter og uttak til egen lommebok. Firi og NBX har flere kryptovalutaer; Bare Bitcoin fokuserer på Bitcoin. Kontroller tilbyderens tillatelse og gjeldende vilkår.',
  },
  {
    question: 'Kan man kjøpe Bitcoin med Vipps?',
    answer: 'Ja, blant annet hos Firi. Sjekk betalingsgebyret og om betalingen gjelder innskudd eller direkte kjøp. Vipps og kort kan koste mer enn bankoverføring.',
  },
  {
    question: 'Hvordan fungerer skatt på Bitcoin i Norge?',
    answer: 'Gevinst ved salg, bytte eller betaling skattlegges normalt med 22 prosent; tap kan gi fradrag. Beholdningen ved årsskiftet føres som formue. Du må selv kontrollere og levere opplysningene i skattemeldingen.',
  },
  {
    question: 'Er det trygt å kjøpe Bitcoin i Norge?',
    answer: 'Bitcoin innebærer høy risiko, og du kan tape hele investeringen. Kontroller tilbyderens tillatelse hos Finanstilsynet, bruk tofaktorautentisering og del aldri BankID-koder eller gjenopprettingsord. En tillatelse garanterer ikke mot tap.',
  },
];
