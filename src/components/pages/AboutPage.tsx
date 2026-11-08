import FeeOverview, { feeRows } from '../FeeOverview';
import ContactPage from '../ContactPage';
import ArticleLayout, { InternalLink, type NavigateFn } from './ArticleLayout';

export default function AboutPage({ navigateTo }: { navigateTo: NavigateFn }) {
  const exchanges = feeRows().map((row) => row.exchange);

  return (
    <ArticleLayout
      page="about"
      title={<>Om <span className="text-brand">KjøpeBitcoin.no</span></>}
      intro="KjøpeBitcoin.no er en norsk sammenligningstjeneste som viser priser, beregnede kostnader og praktiske forskjeller ved kjøp av Bitcoin. Vi sammenligner kostnader, men rangerer ikke børsenes sikkerhet."
      related={['norway', 'overview', 'price', 'tax']}
      navigateTo={navigateTo}
    >
      <section>
        <h2>Hva vi gjør</h2>
        <p>
          Det er store forskjeller på hva det koster å kjøpe Bitcoin hos ulike børser, men gebyrene er ofte vanskelige å
          sammenligne. Noen tar kurtasje, andre tar betalt gjennom spread, og innskudd med Vipps eller kort koster ekstra.
          Vi samler prisene på ett sted og regner om alt til én ting: <strong>hvor mye Bitcoin du faktisk får for pengene</strong>.
        </p>
      </section>

      <section id="metode" className="scroll-mt-20">
        <h2>Slik henter og beregner vi prisene</h2>
        <ul>
          <li>Vi forsøker å hente priser fra offentlige API-er når du åpner siden. Markedspriser er ikke bindende kjøpstilbud.</li>
          <li>Revolut og BuyBitcoin.com bruker CoinGecko sin Bitcoin-kurs som referanseestimat. Bare Bitcoin bruker også denne som reserve når egen pris ikke kan hentes.</li>
          <li>Priser i USD eller EUR regnes om til norske kroner.</li>
          <li>Vi legger til hver børs sitt handelsgebyr og en estimert spread, og regner ut effektiv pris per Bitcoin.</li>
          <li>Innskudds- og uttaksgebyrer er ikke med i hovedtabellen, men omtales der de er relevante, for eksempel for Vipps.</li>
        </ul>
        <p>
          Vi sammenligner i dag {exchanges.length} børser: {exchanges.join(', ')}. Se{' '}
          gebyroversikten nedenfor for tallene vi bruker, eller <InternalLink to="home" navigateTo={navigateTo}>sammenlign kjøp av Bitcoin</InternalLink> på forsiden.
        </p>
        <h3>Hva betyr pris og påslag?</h3>
        <p>Med kurs P og samlet gebyrandel f beregner vi pris per BTC som P / (1 − f). Ved et kjøp på 10 000 kr er beregnet kostnad 10 000 × f, og mengden Bitcoin er 10 000 × (1 − f) / P.</p>
        <p>Påslag i prosent er (beregnet pris per BTC / Coinbase sin BTC-NOK-spotkurs − 1) × 100. Coinbase er en sammenligningsreferanse, ikke en universell fasit for Bitcoin-kursen. Mangler referansen, viser vi ikke påslag.</p>
        <p>Gebyrsatsene er modellforutsetninger, og spread er estimert. Kontotype, handelsvolum, betalingsmåte og tidspunkt kan gi andre kostnader. En kjøpskurs kan allerede inneholde spread; å legge til estimert spread kan da overvurdere kostnaden. Laveste beregnede pris er derfor ikke en garanti for billigste handel.</p>
        <p>Prisgrunnlaget kommer blant annet fra <a href="https://api.coinbase.com/v2/prices/BTC-NOK/spot">Coinbase BTC-NOK</a>, <a href="https://api.firi.com/v2/markets/BTCNOK/ticker">Firi BTCNOK</a> og <a href="https://www.coingecko.com/en/coins/bitcoin">CoinGecko</a>. Datoen på siden viser når innholdet ble endret, ikke når alle gebyrer sist ble bekreftet hos tilbyderne.</p>
      </section>

      <FeeOverview />

      <section>
        <h2>Viktig å vite</h2>
        <p>
          Innholdet på KjøpeBitcoin.no er generell informasjon og ikke finansiell rådgivning. Kryptovaluta er en volatil
          investering, og du kan tape pengene du investerer. Gebyrer og vilkår kan endres av børsene – sjekk alltid
          gjeldende priser hos børsen før du handler.
        </p>
      </section>

      <section id="kontakt" className="scroll-mt-20">
        <h2>Kontakt oss</h2>
        <p>
          Har du funnet en feil, spørsmål om annonsering, eller vil du foreslå en børs vi bør ta med? Send oss en melding
          med skjemaet under, så svarer vi innen 24 timer.
        </p>
        <ContactPage />
      </section>
    </ArticleLayout>
  );
}
