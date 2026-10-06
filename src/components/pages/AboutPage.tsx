import { feeRows } from '../FeeOverview';
import ArticleLayout, { InternalLink, type NavigateFn } from './ArticleLayout';

export default function AboutPage({ navigateTo }: { navigateTo: NavigateFn }) {
  const exchanges = feeRows().map((row) => row.exchange);

  return (
    <ArticleLayout
      title={<>Om <span className="text-brand">KjøpeBitcoin.no</span></>}
      intro="KjøpeBitcoin.no er en norsk sammenligningstjeneste som hjelper deg å finne den billigste og tryggeste måten å kjøpe Bitcoin på i Norge."
      related={['live', 'norway', 'overview', 'contact']}
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

      <section>
        <h2>Slik henter og beregner vi prisene</h2>
        <ul>
          <li>Prisene hentes live fra børsenes offentlige API-er hver gang du besøker siden.</li>
          <li>Priser i USD eller EUR regnes om til norske kroner.</li>
          <li>Vi legger til hver børs sitt handelsgebyr og en estimert spread, og regner ut effektiv pris per Bitcoin.</li>
          <li>Innskudds- og uttaksgebyrer er ikke med i hovedtabellen, men omtales der de er relevante, for eksempel for Vipps.</li>
        </ul>
        <p>
          Vi sammenligner i dag {exchanges.length} børser: {exchanges.join(', ')}. Se{' '}
          <InternalLink to="home" navigateTo={navigateTo}>gebyroversikten på forsiden</InternalLink> for tallene vi bruker.
        </p>
      </section>

      <section>
        <h2>Viktig å vite</h2>
        <p>
          Innholdet på KjøpeBitcoin.no er generell informasjon og ikke finansiell rådgivning. Kryptovaluta er en volatil
          investering, og du kan tape pengene du investerer. Gebyrer og vilkår kan endres av børsene – sjekk alltid
          gjeldende priser hos børsen før du handler.
        </p>
      </section>

      <section>
        <h2>Kontakt</h2>
        <p>
          Har du funnet en feil, eller vil du foreslå en børs vi bør ta med? <InternalLink to="contact" navigateTo={navigateTo}>Send oss en melding</InternalLink>.
        </p>
      </section>
    </ArticleLayout>
  );
}
