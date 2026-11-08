# Trafikk, datakvalitet og drift

Implementert 8. november 2026. Ansvarlig for innhold: Kjøpebitcoin.no. Ingen provisjon.

## Prisgrunnlag

`npm run data:update` henter offentlige API-data på byggekjøreren, med tidsavbrudd per forespørsel. Resultatet lagres likt i `src/data/market-snapshot.json` (forhåndsrendring) og `public/data/market-snapshot.json` (oppdatering i nettleseren).

GitHub Actions samler nye data og bygger/publiserer ved push og manuelt, og har en planlagt kjøring kl. :17 og :47 hver time UTC. GitHub kan forsinke eller deaktivere planlagte jobber, blant annet etter inaktivitet i offentlige repositorier. Oppdateringen er ikke en sanntidsgaranti. Sjekk Actions hvis prisfilen blir gammel.

Ved feil beholdes forrige publiserte pris med sitt opprinnelige tidspunkt, maksimalt 24 timer. Deretter brukes en tydelig merket Coinbase-referanse hvis tilgjengelig, ellers utelates prisen. Priser eldre enn 24 timer beregnes/rangeres ikke. Over én time gammel prisfil varsles. Alle-børser-feil uten gyldig reserve stopper bygg, slik at siste publiserte nettsted ikke erstattes med tomme data.

NBX bruker `/markets/BTC-NOK/trades`; ticker-endepunktet som tidligere ble brukt var utilgjengelig. Bare Bitcoin bruker `ask`, ikke `bank.buy` (som inneholder flere kostnader). Ask-priser får ikke lagt på estimert spread på nytt. Kilder som allerede inneholder spread, og siste handler, er forskjellige prisgrunnlag og merkes derfor forskjellig.

Historikk hentes i NOK fra CoinGecko, med siste observerte punkt per UTC-dato. Det fylles ikke inn oppdiktede verdier for manglende dager. Coinbase sitt dokumenterte historiske spot-endepunkt er reserve hvis ingen historikk finnes. Historikk er observasjoner, ikke en fullstendig handelslogg eller garanterte sluttkurser.

## Gebyrkontroll

Rediger `src/data/exchangeFees.ts`. Hver sats har kontotype, kilde, merknad og egen kontrollert-dato. `tradeVerified: false` betyr modellforutsetning og skal ikke presenteres som et bekreftet tilbud. Spread som bygger på et historisk gjennomsnitt må ikke omtales som en live spread.

Kontroller domestic-satsene minst månedlig og ved meldinger om vilkårsendringer. Pro/Advanced er ikke direkte sammenlignbart med et vanlig appkjøp; dette står i kildene og på sidene. Ved tvil merkes satsen ukontrollert fremfor å gjette. Ingen kilder skal automatisk få ny kontrollert-dato ved et bygg.

## Nye verktøy og landingssider

- `/bitcoin-kalkulator`: samme kronebeløp hos alle børsene, hurtigvalg og BTC/NOK-omregning.
- `/bitcoin-kurs`: historikk, daglige målinger som HTML-tabell og omregning.
- `/firi-vs-bare-bitcoin` og `/nbx-vs-bare-bitcoin`: dokumenterte standardscenarioer.
- `/prissammenligning-bitcoin`: original, etterprøvbar modellberegning for 1 000, 10 000 og 50 000 kr. Ikke markedsfør dette som faktiske testkjøp.

Alle sider finnes i sitemap, internlenking og teksteksportene. Tabeller med daterte markedspriser er med i opprinnelig HTML. Artikkelsider lastes separat og henter ikke prisfilen med mindre siden faktisk bruker priser.

## Aktivering av måling: kontoeier må legge inn verdiene

Ingen analytics-konto, Google-eierskap eller Bing-eierskap opprettes automatisk. Ikke legg inn oppdiktede verifikasjonskoder.

I GitHub: Settings → Secrets and variables → Actions → Variables:

1. `VITE_GOOGLE_SITE_VERIFICATION`: `content`-verdien fra HTML-taggen til en URL-prefix-eiendom i Search Console. Alternativt verifiser domene med DNS hos domeneleverandøren.
2. `VITE_BING_SITE_VERIFICATION`: verifikasjonsverdien fra Bing Webmaster Tools.
3. `VITE_PLAUSIBLE_DOMAIN`: domenet registrert i din Plausible-konto.
4. `VITE_PLAUSIBLE_SCRIPT_URL`: den nøyaktige HTTPS script-adressen fra din Plausible-installasjon. Koden støtter både data-domain-oppsett og den nye init-køen. Verifiser installasjonen i leverandørens kontrollverktøy.

Kjør et nytt bygg etter at variablene er satt. Uten analytics-verdiene lastes ingen ekstern målingskode. Do Not Track og Global Privacy Control respekteres av integrasjonen. Gå gjennom personvernteksten når leverandør eller bruk av data endres.

Opprett disse custom event-målene i Plausible (sendte hendelser dukker ikke automatisk opp som konverteringsmål):

| Hendelse | Egenskaper | Formål |
| --- | --- | --- |
| `exchange_click` | exchange | Klikk videre til en tilbyder |
| `calculator_preset` | amount (bare hurtigvalg) | Bruk av beløpsverktøyet |
| `calculator_amount` | bracket (bredt intervall) | Beregning med eget beløp |
| `history_range` | days | Bruk av kurshistorikken |

Navn, e-post, kontaktskjema og nøyaktige fritekstbeløp sendes ikke som analyseegenskaper. Lokalt kan hendelser kontrolleres med `window.addEventListener('bitcoin:analytics', e => console.log(e.detail))`. Test på produksjonsdomenet når kontoen er koblet til; leverandøren kan filtrere localhost/bot-tester.

Send `https://www.xn--kjpebitcoin-hgb.no/sitemap.xml` til Google og Bing. IndexNow varsles ved innholdspush, ikke ved hver halvtimeoppdatering. Det garanterer ikke indeksering eller sitering i AI-svar.

## Arbeidsplan etter publisering

Første 7 dager: kontroller innhenting, indeksering og kildeavvik. Etter 28 dager: sammenlign visninger, klikk, CTR, søk og landingssider i Search Console. Se på bruk av kalkulatoren og videreklikk per kilde/søkeord hvis datagrunnlaget er stort nok. Bruk Core Web Vitals-feltdata når tilgjengelig; et lokalt nettlesertestresultat er ikke feltdata.

Utvid først sider som allerede får visninger. Unngå duplikatsider for hvert beløp. En periodisk prisanalyse bør dokumentere endringer i datakilder og modell, og lenke til et arkivert datagrunnlag hvis den hevder en historisk observasjon. Ikke opprett oppdiktede ekspertprofiler, testhandler, omtaler eller lenker. Ekstern omtale og kontakt med utgivere krever et eget publiserings-/kontaktoppdrag.

## Kontroll før publisering

`npm test`, `npm run lint`, `npm run build`, `npm run seo:check`. Kontroller også mobil, beløpsvalidering, kildelenker, zoom, tastatur og oppførsel uten JavaScript. Det skal ikke lenger finnes `/api/proxy/*`-forespørsler i nettleseren eller en offentlig «Endre»-knapp.

Offisielle referanser:
- https://developers.google.com/search/docs/appearance/ai-features
- https://developers.google.com/search/docs/fundamentals/creating-helpful-content
- https://support.google.com/webmasters/answer/9008080
- https://plausible.io/docs/plausible-script
- https://plausible.io/docs/custom-event-goals
