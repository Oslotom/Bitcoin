import ArticleLayout, { InternalLink, type NavigateFn } from './pages/ArticleLayout';

export default function Overview({ navigateTo }: { navigateTo: NavigateFn }) {
  return (
    <ArticleLayout
      page="overview"
      title={<>Hvordan kjøpe <span className="text-brand">Bitcoin i Norge?</span></>}
      intro="For å kjøpe Bitcoin trenger du en konto hos en kryptobørs, identitetskontroll og et innskudd. Her går vi gjennom valget av børs, betaling, kjøpsordren og oppbevaring – fra første sammenligning til ditt første kjøp."
      related={['home', 'norway', 'vipps', 'tax']}
      navigateTo={navigateTo}
    >
      <nav aria-label="Innhold i kjøpsguiden" className="rounded-2xl bg-slate-50 p-5">
        <h2>I denne guiden</h2>
        <ol>
          <li><a href="#velg-bors">Velg børs og sammenlign totalkostnaden</a></li>
          <li><a href="#opprett-konto">Opprett konto og bekreft identiteten</a></li>
          <li><a href="#innskudd">Sett inn norske kroner</a></li>
          <li><a href="#kjop">Kontroller og gjennomfør kjøpet</a></li>
          <li><a href="#oppbevaring">Velg hvordan Bitcoin skal oppbevares</a></li>
          <li><a href="#dokumentasjon">Lagre dokumentasjon til skattemeldingen</a></li>
        </ol>
      </nav>
      <section id="velg-bors" className="scroll-mt-24">
        <h2>1. Velg en børs for kjøp av Bitcoin</h2>
        <p>Sammenlign hva du får for det samme beløpet i norske kroner. Handelsgebyret alene forteller ikke hele prisen: spread, valutaveksling, innskudd og uttak kan komme i tillegg. Bruk{' '}<InternalLink to="home" navigateTo={navigateTo}>Bitcoin-kalkulatoren og gebyroversikten</InternalLink>{' '}som utgangspunkt, og kontroller det endelige tilbudet hos børsen før du handler.</p>
        <p>Firi, NBX og Bare Bitcoin er eksempler på norske tjenester. Norske kroner, BankID og norsk kundeservice kan forenkle første kjøp. En utenlandsk børs kan ha lavere handelsgebyr, men du må også undersøke kostnaden ved å veksle og overføre penger. Se{' '}<InternalLink to="norway" navigateTo={navigateTo}>sammenligningen av norske kryptobørser</InternalLink>.</p>
        <p>Sjekk tilbyderens gjeldende tillatelse og hvilke tjenester den omfatter i{' '}<a href="https://www.finanstilsynet.no/virksomhetsregisteret/" className="text-brand hover:underline">Finanstilsynets virksomhetsregister</a>. Regulering gjør ikke Bitcoin risikofritt, og du kan tape hele investeringen.</p>
      </section>
      <section id="opprett-konto" className="scroll-mt-24">
        <h2>2. Opprett konto og verifiser identiteten</h2>
        <p>Gå direkte til børsens offisielle nettsted eller app. Du må vanligvis oppgi kontaktinformasjon, bekrefte identiteten og svare på spørsmål om kundeforholdet. BankID støttes av flere norske tilbydere; kravene og behandlingstiden varierer. Ekstra dokumentasjon kan være nødvendig.</p>
        <p>Bruk et unikt passord og aktiver tofaktorautentisering der det tilbys. Del aldri BankID-koder eller gjenopprettingsord med noen som tar kontakt og sier de skal hjelpe deg med kjøpet.</p>
      </section>
      <section id="innskudd" className="scroll-mt-24">
        <h2>3. Sett inn penger med bankoverføring, Vipps eller kort</h2>
        <p>Følg innskuddsinstruksjonene på kontoen din. Kontroller kontonummer, eventuell betalingsreferanse og børsens krav til hvem betalingen kommer fra. Vent til innskuddet er registrert før du legger inn kjøpsordren.</p>
        <p>Bankoverføring kan gi lavere betalingsgebyr enn Vipps og kort. Raskere betaling er ikke nødvendigvis billigere: sammenlign totalbeløpet, ikke bare tiden det tar. I{' '}<InternalLink to="vipps" navigateTo={navigateTo}>guiden til å kjøpe Bitcoin med Vipps</InternalLink>{' '}forklarer vi forskjellen mellom innskuddsgebyr og handelsgebyr.</p>
      </section>
      <section id="kjop" className="scroll-mt-24">
        <h2>4. Kjøp Bitcoin og kontroller hva du får</h2>
        <p>Velg Bitcoin (BTC), angi beløpet i kroner og les ordresammendraget. Du trenger ikke kjøpe én hel Bitcoin: kjøpet kan være en liten brøkdel. Minstebeløpet bestemmes av børsen og betalingsmåten.</p>
        <ul>
          <li><strong>Enkeltkjøp:</strong> Børsen viser et tilbud med beløpet du skal betale og mengden BTC du mottar. Se etter hvilke gebyrer som er inkludert.</li>
          <li><strong>Markedsordre:</strong> Du handler mot tilgjengelige ordre. Sluttprisen kan avvike fra kursen du så før ordren ble lagt inn.</li>
          <li><strong>Limitordre:</strong> Du setter en maksimal kjøpspris. Ordren blir bare gjennomført dersom markedet matcher betingelsene, og kan bli stående uutført.</li>
        </ul>
        <p>Kontroller at det er Bitcoin du kjøper, og ikke et sertifikat, derivat eller et annet produkt som bare følger kursen. Slike produkter har andre vilkår og gir ikke nødvendigvis Bitcoin du kan sende til egen lommebok.</p>
      </section>
      <section id="oppbevaring" className="scroll-mt-24">
        <h2>5. Oppbevar Bitcoin på børs eller i egen lommebok</h2>
        <p>På børsen er det tilbyderen som håndterer oppbevaringen. Du er avhengig av kontosikkerheten, driften og tilbyderens evne til å gjøre opp uttak. En egen lommebok gir deg kontroll over nøklene, men også ansvaret for sikkerhetskopiering og riktige overføringer.</p>
        <p>En hardware-lommebok kan brukes til å holde nøklene utenfor en vanlig datamaskin. Oppbevar gjenopprettingsordene privat og offline. Ved uttak må adresse og nettverk stemme; start gjerne med en liten testoverføring og kontroller uttaksgebyret. En feil overføring kan være umulig å reversere.</p>
      </section>
      <section id="dokumentasjon" className="scroll-mt-24">
        <h2>6. Lagre kvitteringer og oversikt til skatt</h2>
        <p>Ta vare på dato, beløp i kroner, mengde BTC, gebyrer og transaksjonshistorikk. Et kjøp som du beholder utløser normalt ikke skatt på gevinst, men beholdningen ved årsskiftet skal oppgis som formue. Salg, bytte og bruk som betaling kan utløse skattepliktig gevinst eller fradragsberettiget tap.</p>
        <p>En skatterapport fra børsen kan hjelpe, men du må kontrollere opplysningene og ta med handler fra andre børser og lommebøker. Les{' '}<InternalLink to="tax" navigateTo={navigateTo}>guiden om skatt på Bitcoin</InternalLink>.</p>
      </section>
      <section>
        <h2>Kilder og videre lesning</h2>
        <ul>
          <li><a href="https://www.finanstilsynet.no/tema/kryptoeiendeler-mica/" className="text-brand hover:underline">Finanstilsynet: kryptoeiendelsloven og MiCA</a></li>
          <li><a href="https://www.finanstilsynet.no/nyhetsarkiv/nyheter/2025/investeringer-i-kryptoeiendeler-kan-vare-risikable/" className="text-brand hover:underline">Finanstilsynet: risiko og forbrukerbeskyttelse</a></li>
          <li><a href="https://www.skatteetaten.no/person/skatt/hjelp-til-riktig-skatt/aksjer-og-verdipapirer/om/virtuell-valuta/skatteregler---virtuell-valuta/" className="text-brand hover:underline">Skatteetaten: skatteregler for virtuelle eiendeler</a></li>
        </ul>
      </section>
    </ArticleLayout>
  );
}
