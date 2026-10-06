import ResultsTable from '../ResultsTable';
import { ComparisonResult, CryptoCurrency } from '../../types';
import ArticleLayout, { InternalLink, type NavigateFn } from './ArticleLayout';

interface Props {
  results: ComparisonResult[];
  isLoading: boolean;
  error: string | null;
  navigateTo: NavigateFn;
}

export default function BitcoinKursPage({ results, isLoading, error, navigateTo }: Props) {
  return (
    <ArticleLayout
      title={<>Bitcoin kurs i dag <span className="text-brand">(NOK)</span></>}
      intro="Her ser du Bitcoin-prisen i norske kroner akkurat nå, hentet direkte fra norske og internasjonale kryptobørser. Prisen varierer litt fra børs til børs – tabellen viser hvor du får mest Bitcoin for pengene."
      related={['live', 'firiNbx', 'vipps', 'tax']}
      navigateTo={navigateTo}
    >
      <section>
        <h2>Live Bitcoin pris hos norske og utenlandske børser</h2>
        <div className="card-premium overflow-hidden not-prose">
          <ResultsTable results={results} isLoading={isLoading} error={error} crypto={CryptoCurrency.BTC} />
        </div>
        <p className="text-sm text-slate-500 mt-3">
          Prisene hentes hver gang du åpner siden. Utenlandske børser som oppgir pris i USD eller EUR er regnet om til NOK.
        </p>
      </section>

      <section>
        <h2>Hvorfor er Bitcoin-kursen forskjellig fra børs til børs?</h2>
        <p>
          Bitcoin handles på hundrevis av markedsplasser samtidig, og hver børs har sin egen ordrebok. Prisen du ser er
          derfor alltid prisen <em>på den børsen</em>. Forskjellene skyldes særlig:
        </p>
        <ul>
          <li><strong>Spread:</strong> differansen mellom kjøps- og salgspris. Mindre børser og meglertjenester har ofte høyere spread.</li>
          <li><strong>Likviditet:</strong> børser med mye handel i NOK får prisen tettere på det globale markedet.</li>
          <li><strong>Valuta:</strong> på utenlandske børser kjøper du ofte i USD eller EUR, og valutavekslingen koster ekstra.</li>
          <li><strong>Gebyrer:</strong> kurtasje kommer i tillegg til kursen, og noen børser bygger gebyret inn i prisen.</li>
        </ul>
        <p>
          Spotprisen alene sier derfor lite om hva du faktisk betaler. Bruk{' '}
          <InternalLink to="live" navigateTo={navigateTo}>priskalkulatoren</InternalLink> for å se hvor mye Bitcoin du sitter
          igjen med etter alle gebyrer.
        </p>
      </section>

      <section>
        <h2>Hva påvirker Bitcoin-prisen?</h2>
        <p>
          Bitcoin har et fast tak på 21 millioner mynter, og antall nye bitcoin som utstedes halveres omtrent hvert fjerde år
          («halveringen»). Prisen bestemmes ellers av tilbud og etterspørsel: renter og makroøkonomi, regulering,
          institusjonelle investorer og den generelle stemningen i kryptomarkedet. For norske kjøpere påvirker også
          kronekursen mot dollar prisen i NOK – svekkes kronen, stiger Bitcoin målt i kroner selv om dollarprisen står stille.
        </p>
      </section>

      <section>
        <h2>Hvor bør du kjøpe Bitcoin til best kurs?</h2>
        <p>
          Den laveste kursen gir ikke nødvendigvis den billigste handelen. Se{' '}
          <InternalLink to="norway" navigateTo={navigateTo}>norske kryptobørser</InternalLink> for børser med BankID og
          innskudd i kroner, eller les{' '}
          <InternalLink to="firiNbx" navigateTo={navigateTo}>sammenligningen av Firi og NBX</InternalLink>.
        </p>
      </section>
    </ArticleLayout>
  );
}
