// Brukes både av FAQ-seksjonen på forsiden og til FAQPage-schema (JSON-LD) ved bygg.
export interface FAQItem {
  question: string;
  answer: string;
}

export const FAQS: FAQItem[] = [
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
