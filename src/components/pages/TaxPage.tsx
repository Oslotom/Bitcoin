import ArticleLayout, { InternalLink, type NavigateFn } from './ArticleLayout';

const SKATTEETATEN_URL = 'https://www.skatteetaten.no/person/skatt/hjelp-til-riktig-skatt/aksjer-og-verdipapirer/om/virtuell-valuta/';

export default function TaxPage({ navigateTo }: { navigateTo: NavigateFn }) {
  return (
    <ArticleLayout
      page="tax"
      title={<>Skatt på <span className="text-brand">Bitcoin</span> i Norge</>}
      intro="Bitcoin og annen kryptovaluta regnes som formuesobjekt i Norge. Gevinst er skattepliktig, tap gir fradrag, og verdien ved årsskiftet skal føres opp som formue i skattemeldingen."
      related={['overview', 'norway', 'firiNbx', 'price']}
      navigateTo={navigateTo}
    >
      <section>
        <h2>Kort oppsummert</h2>
        <ul>
          <li><strong>Gevinst</strong> ved salg av Bitcoin skattes som alminnelig inntekt (22 %).</li>
          <li><strong>Tap</strong> er fradragsberettiget med samme sats.</li>
          <li><strong>Formue:</strong> Bitcoin du eier ved årsskiftet føres opp til markedsverdi (per 1. januar året etter).</li>
          <li>Det er <strong>ikke krav om FIFO</strong> for kryptovaluta, i motsetning til aksjer.</li>
          <li>Det er realisasjonen som utløser skatt – ikke at kursen stiger mens du eier Bitcoin.</li>
        </ul>
      </section>

      <section>
        <h2>Når må du betale skatt på Bitcoin?</h2>
        <p>Skatteplikten utløses når du <strong>realiserer</strong> Bitcoin. Det skjer blant annet når du:</p>
        <ul>
          <li>selger Bitcoin og får norske kroner eller annen valuta</li>
          <li>bytter Bitcoin mot en annen kryptovaluta</li>
          <li>betaler for varer eller tjenester med Bitcoin</li>
        </ul>
        <p>
          Å kjøpe Bitcoin og beholde den utløser ikke inntektsskatt. Å flytte Bitcoin mellom dine egne lommebøker er heller
          ikke en realisasjon.
        </p>
      </section>

      <section>
        <h2>Slik regner du ut gevinst og tap</h2>
        <p>
          Gevinsten er det du fikk ved salget (utgangsverdien, minus transaksjonskostnader) fratrukket det du betalte for
          Bitcoinen (inngangsverdien, inkludert transaksjonskostnader). Beløpene regnes om til norske kroner etter kursen på
          transaksjonstidspunktet.
        </p>
        <p>
          Har du kjøpt Bitcoin til ulike tidspunkter og priser, må du selv ta stilling til hvilke enheter du har solgt.
          I motsetning til aksjer gjelder det <strong>ikke noe krav om FIFO</strong> (først inn, først ut) for
          kryptovaluta – men valget må kunne dokumenteres.
        </p>
        <p>
          <strong>Eksempel:</strong> Du kjøper Bitcoin for 10 000 kr og selger senere for 15 000 kr. Gevinsten er 5 000 kr,
          og skatten blir 22 % av dette, altså 1 100 kr.
        </p>
      </section>

      <section>
        <h2>Formuesskatt på Bitcoin</h2>
        <p>
          Bitcoin du eier ved utgangen av året skal føres opp som formue til markedsverdi per 1. januar året etter.
          Kryptovaluta har ingen verdsettelsesrabatt slik aksjer har. Om du faktisk betaler formuesskatt avhenger av din
          samlede nettoformue og bunnfradraget det aktuelle året.
        </p>
        <p>
          Skatteetaten oppgir en kurs du kan bruke: for skattemeldingen for 2025 er Bitcoin satt til{' '}
          <strong>881 206,06 kr</strong> (kurs per 1. januar 2026). Eier du for eksempel 0,2 BTC, blir formuesverdien
          omtrent 176 241 kr.
        </p>
      </section>

      <section>
        <h2>Gjør det enkelt: bruk en norsk børs</h2>
        <p>
          Flere norske kryptobørser tilbyr skatterapport som viser gevinst, tap og formue for året. Det sparer deg for mye
          arbeid sammenlignet med å regne ut alt selv fra utenlandske børser. Se oversikten over{' '}
          <InternalLink to="norway" navigateTo={navigateTo}>norske kryptobørser</InternalLink>.
        </p>
      </section>

      <aside className="card-premium p-5 text-sm text-slate-600">
        Denne siden er generell informasjon og ikke skatterådgivning. Reglene kan endres – se{' '}
        <a href={SKATTEETATEN_URL} target="_blank" rel="noopener" className="font-semibold text-brand hover:underline">
          Skatteetatens side om kryptovaluta
        </a>{' '}
        for gjeldende regler.
      </aside>
    </ArticleLayout>
  );
}
