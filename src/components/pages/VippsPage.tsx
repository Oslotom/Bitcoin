import VippsComparisonSection, { FIRI_VIPPS_EXTRA_FEE } from '../VippsComparisonSection';
import { ComparisonResult } from '../../types';
import ArticleLayout, { InternalLink, type NavigateFn } from './ArticleLayout';

interface Props {
  results: ComparisonResult[];
  navigateTo: NavigateFn;
}

const vippsPct = `${(FIRI_VIPPS_EXTRA_FEE * 100).toFixed(1).replace('.', ',')} %`;

export default function VippsPage({ results, navigateTo }: Props) {
  return (
    <ArticleLayout
      page="vipps"
      title={<>Kjøpe Bitcoin med <span className="text-brand">Vipps</span></>}
      intro={`Ja, du kan kjøpe Bitcoin med Vipps i Norge. Det er den raskeste måten å komme i gang på – men det koster mer enn bankoverføring. Hos Firi betaler du rundt ${vippsPct} ekstra for innskudd med Vipps.`}
      related={['firiNbx', 'norway', 'overview', 'tax']}
      navigateTo={navigateTo}
    >
      <section>
        <h2>Slik kjøper du Bitcoin med Vipps</h2>
        <ol>
          <li>Opprett konto hos en norsk kryptobørs som støtter Vipps, for eksempel Firi.</li>
          <li>Logg inn og verifiser deg med BankID (lovpålagt kundekontroll).</li>
          <li>Velg innskudd med Vipps, skriv inn beløpet og godkjenn betalingen i Vipps-appen.</li>
          <li>Pengene er på kontoen med en gang – kjøp Bitcoin med saldoen din.</li>
          <li>Vurder å flytte Bitcoin til din egen lommebok hvis du skal spare over tid.</li>
        </ol>
      </section>

      <section>
        <h2>Hva koster det å bruke Vipps?</h2>
        <p>
          Vipps-innskudd koster mer enn vanlig bankoverføring fordi børsen betaler et transaksjonsgebyr til Vipps.
          Regnestykket under viser forskjellen for et kjøp på 10 000 kr hos Firi, med dagens Bitcoin-pris:
        </p>
        <VippsComparisonSection results={results} amount={10000} />
      </section>

      <section>
        <h2>Vipps eller bankoverføring?</h2>
        <p>
          <strong>Vipps</strong> passer når du vil kjøpe et mindre beløp raskt, eller kjøpe akkurat nå mens prisen er der du
          vil ha den. <strong>Bankoverføring</strong> (helst straksbetaling) er billigere og bør velges for større beløp og
          for fast månedlig sparing – da tar det sjelden mer enn noen minutter før pengene er inne.
        </p>
        <p>
          Sammenlign de totale kostnadene hos alle børsene i{' '}
          <InternalLink to="home" navigateTo={navigateTo}>priskalkulatoren på forsiden</InternalLink>, eller se{' '}
          <InternalLink to="firiNbx" navigateTo={navigateTo}>Firi og NBX side om side</InternalLink>.
        </p>
      </section>

      <section>
        <h2>Er det trygt å kjøpe Bitcoin med Vipps?</h2>
        <p>
          Selve betalingen er like trygg som andre Vipps-betalinger. Det viktigste er at du bruker en børs som er registrert
          hos Finanstilsynet, og at du aldri betaler med Vipps til privatpersoner eller «investeringsrådgivere» som tar
          kontakt med deg på sosiale medier – det er en vanlig svindelmetode.
        </p>
      </section>
    </ArticleLayout>
  );
}
