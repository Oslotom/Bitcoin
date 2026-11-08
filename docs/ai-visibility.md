# Synlighet i ChatGPT og Claude

Vurdert 8. november 2026. Dette er en teknisk gjennomgang og et begrenset nettsøk, ikke en måling av siteringsandel inne i ChatGPT eller Claude.

## Observerte forhold

- Forsiden kunne leses gjennom nettsøk. Et søk på domenenavnet fant flere undersider. Noen utdrag inneholdt eldre tekst; søkeresultater kan ligge etter publisert innhold.
- Åtte sider forhåndsrendres med egne canonical-adresser, metadata og sitemap.
- OAI-SearchBot, ChatGPT-User, Claude-SearchBot og Claude-User er tillatt i robots.txt. Dette sier ikke om reelle botforespørsler når gjennom hosting eller om siden blir sitert.
- Live-tabellen avhenger av JavaScript og API-er. En statisk gebyrtabell finnes på /om-oss, og spørsmål/svar finnes i HTML på forsiden.
- Prisbeskrivelser og llms.txt beskrev tidligere datagrunnlaget for bastant. Noen priser er CoinGecko-estimater og gebyrene er modellforutsetninger.

## Prioritert tiltaksliste

1. **Implementert:** dokumenter formler, Coinbase-referanse, estimater, reservepriser og begrensninger på /om-oss#metode.
2. **Implementert:** lenk direkte fra forsiden til metoden og /om-oss#gebyroversikt. Behold en kort forside og tilgjengelig statisk faktagrunnlag.
3. **Implementert:** korriger llms.txt, inkluder kilde og endringsdato per side i llms-full.txt, og skill eksportdato fra innholdsendring. Disse filene er supplerende formater; de dokumenterer ikke eller garanterer bedre rangering.
4. **Implementert:** byggkontroller for tilgang til søke-/brukerboter, statisk gebyrtabell, metodelenke og proveniens i teksteksport.
5. **Neste redaksjonelle arbeid:** verifiser hvert gebyr mot aktuell kontotype, handelsprodukt og offisiell prisliste; registrer kontrollert dato separat fra kodeendringer. Modellene kan avvike fra reelle tilbud. Unngå å presentere en modellrangering som bekreftet billigst.
6. **Krever bekreftede eieropplysninger:** oppgi ansvarlig utgiver, relevant erfaring og kommersielle bindinger. Ikke konstruer forfatteridentitet, kvalifikasjoner eller uavhengighet.
7. **Ekstern synlighet:** publiser etterprøvbare sammenligninger som andre relevante norske nettsteder har grunn til å lenke til. Ingen kjøpte eller konstruerte omtaler.
8. **Måling:** etabler et sammenlignbart utgangspunkt i begge produkter før effekten vurderes.

## Måleopplegg

Test i nye samtaler med nettsøk aktivert, samme språk og land, og noter dato, produkt/modell, eksakt spørsmål, om søk ble brukt, siterte domener og sitert URL. Gjenta hvert spørsmål tre ganger og rapporter antall siteringer av vårt domene delt på antall gjennomførte svar. En merkevarespørring må rapporteres separat fra generiske spørsmål.

- Hvor kan jeg kjøpe bitcoin i Norge?
- Hva koster det å kjøpe bitcoin for 10 000 kroner?
- Hvordan sammenligner jeg gebyrer hos Firi og NBX?
- Kan jeg kjøpe bitcoin med Vipps?
- Hvordan beregnes påslag på bitcoin-kursen?
- Hva er kjøpebitcoin.no? (merkevarespørring)

Sammenlign et nytt utvalg etter 4–6 uker. Referral-trafikk fra chatgpt.com og claude.ai, der analyseverktøy finnes, er et supplement: ikke alle siteringer gir klikk, og ikke alle klikk har referrer. Verifiser botidentitet med leverandørenes publiserte IP-informasjon dersom serverlogger er tilgjengelige; en simulert User-Agent er ikke bevis på faktisk crawling.

## Primærkilder

- OpenAI: https://developers.openai.com/api/docs/bots — OAI-SearchBot brukes til søk; GPTBot gjelder trening. Tilgang er ikke en plasseringsgaranti.
- Anthropic: https://support.claude.com/en/articles/8896518-does-anthropic-crawl-data-from-the-web-and-how-can-site-owners-block-the-crawler — skiller Claude-SearchBot, Claude-User og ClaudeBot og beskriver robots.txt.

Vurderingen av klarere metode, kilder og internlenker som nyttige tiltak er vår faglige vurdering, ikke en dokumentert rangeringsformel fra leverandørene.
