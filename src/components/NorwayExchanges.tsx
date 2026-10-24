import { Exchange } from '../types';
import { feeRows } from './FeeOverview';
import ArticleLayout, { InternalLink, type NavigateFn } from './pages/ArticleLayout';

interface NorwayExchange {
  id: Exchange;
  name: string;
  description: string;
  url: string;
  features: string[];
  type: 'Børs' | 'Megler' | 'Ressurs';
}

// Samme utvalg som de norske børsene i prissammenligningen. Ingen sikkerhetsrangering.
export const norwayExchanges: NorwayExchange[] = [
  {
    id: Exchange.Firi,
    name: 'Firi',
    description: 'Norsk kryptobørs med kjøp og salg av Bitcoin og andre kryptovalutaer. Firi oppgir støtte for BankID og verktøy for skatteberegning.',
    url: 'https://firi.com/no',
    features: ['BankID', 'Skatteberegning', 'Flere kryptovalutaer'],
    type: 'Børs',
  },
  {
    id: Exchange.NBX,
    name: 'NBX (Norwegian Block Exchange)',
    description: 'Norsk kryptobørs med handel i norske kroner. NBX oppgir støtte for BankID, ordrebok og kjøp av flere kryptovalutaer.',
    url: 'https://nbx.com/',
    features: ['BankID', 'Ordrebok', 'Handel i NOK'],
    type: 'Børs',
  },
  {
    id: Exchange.BareBitcoin,
    name: 'Bare Bitcoin',
    description: 'Norsk tjeneste som fokuserer på Bitcoin. Tilbyr kjøp og salg, autosparing og oversikt over skattetall som du kan bruke i skattemeldingen.',
    url: 'https://barebitcoin.no/',
    features: ['Kun Bitcoin', 'Autosparing', 'Skatteoversikt'],
    type: 'Børs',
  },
];

export default function NorwayExchanges({ navigateTo }: { navigateTo: NavigateFn }) {
  const fees = feeRows();
  return (
    <ArticleLayout
      page="norway"
      title={<>Norske kryptobørser: kjøp Bitcoin i <span className="text-brand">Norge</span></>}
      intro="Sammenlign Firi, NBX og Bare Bitcoin – de tre norske tilbyderne i vår prissammenligning. Her ser du forskjeller i utvalg, kjøpsmåter og beregnede kostnader før du velger børs."
      related={['home', 'overview', 'firiNbx', 'vipps']}
      navigateTo={navigateTo}
    >
      <section>
        <h2>Firi, NBX eller Bare Bitcoin?</h2>
        <p>En norsk børs kan gjøre det enklere å betale i kroner og få hjelp på norsk. Valget bør likevel bygge på totalkostnad, hvilke tjenester du trenger og hvordan Bitcoin oppbevares. Oversikten er et utvalg, og er ikke en rangering av sikkerhet eller en fullstendig liste over tilbydere i Norge.</p>
        <div className="overflow-x-auto rounded-2xl border border-slate-100">
          <table className="w-full text-left text-sm">
            <caption className="sr-only">Norske Bitcoin-tilbydere og beregnet kostnad på kjøp av 10 000 kroner</caption>
            <thead className="bg-slate-50"><tr>
              <th scope="col" className="p-4">Tilbyder</th>
              <th scope="col" className="p-4">Tjenester</th>
              <th scope="col" className="p-4">Kostnad på 10 000 kr (est.)</th>
            </tr></thead>
            <tbody>{norwayExchanges.map((exchange) => {
              const row = fees.find((fee) => fee.exchange === exchange.id)!;
              return <tr key={exchange.id} className="border-t border-slate-100">
                <th scope="row" className="p-4"><a href={exchange.url} className="text-brand hover:underline">{exchange.name}</a></th>
                <td className="p-4">{exchange.features.join(', ')}</td>
                <td className="p-4">{Math.round(10000 * row.total)} kr</td>
              </tr>;
            })}</tbody>
          </table>
        </div>
        <p className="mt-3 text-sm text-slate-500">Kostnaden bygger på handelsgebyr og estimert spread i vår sammenligningsmodell. Innskudd, uttak og eventuell valutaveksling kommer i tillegg. Vilkår varierer med produkt og betalingsmåte; kontroller tilbudet hos børsen.</p>
      </section>
      {norwayExchanges.map((exchange) => (
        <section key={exchange.id}>
          <h2>{exchange.name}</h2>
          <p>{exchange.description}</p>
          <p><a href={exchange.url} className="text-brand hover:underline">Les om tjenester og gjeldende vilkår hos {exchange.name}</a>.</p>
        </section>
      ))}
      <section>
        <h2>Kontroller tillatelse og risiko før du velger børs</h2>
        <p>At en tjeneste er norsk eller bruker BankID er ikke en garanti for at pengene dine er trygge. Kontroller tilbyderens gjeldende tillatelse og hvilke tjenester den omfatter i{' '}<a href="https://www.finanstilsynet.no/virksomhetsregisteret/" className="text-brand hover:underline">Finanstilsynets virksomhetsregister</a>.</p>
        <p>MiCA gir regler for kryptoeiendelstjenester, men forbrukerbeskyttelsen er ikke den samme som for tradisjonelle finansprodukter. Bitcoin kan svinge kraftig i verdi. Finanstilsynet forklarer{' '}<a href="https://www.finanstilsynet.no/nyhetsarkiv/nyheter/2025/investeringer-i-kryptoeiendeler-kan-vare-risikable/" className="text-brand hover:underline">risikoen ved investering i kryptoeiendeler</a>.</p>
      </section>
      <section>
        <h2>Slik sammenligner du norske Bitcoin-børser</h2>
        <ul>
          <li><strong>Totalkostnad:</strong> Sammenlign BTC-beløpet du mottar for samme kronebeløp, med samme betalingsmåte.</li>
          <li><strong>Betaling:</strong> Kontroller støtte for bankoverføring, kort eller Vipps og hva hver metode koster.</li>
          <li><strong>Uttak:</strong> Undersøk om du kan sende Bitcoin til egen lommebok, samt minstebeløp og gebyr.</li>
          <li><strong>Dokumentasjon:</strong> Sjekk om du kan eksportere handler og få skatteoversikt. Du har selv ansvar for skattemeldingen.</li>
        </ul>
        <p>Bruk{' '}<InternalLink to="home" navigateTo={navigateTo}>pris- og gebyrsammenligningen på forsiden</InternalLink>{' '}for et kjøpseksempel på 10 000 kr, eller les{' '}<InternalLink to="firiNbx" navigateTo={navigateTo}>Firi og NBX sammenlignet</InternalLink>.</p>
      </section>
      <section>
        <h2>Kilder til opplysningene</h2>
        <p>Beskrivelsene bygger på tilbydernes egne nettsider, lenket over. Opplysninger om risiko og tilsyn bygger på Finanstilsynets veiledning. Produktutvalg og betalingsmåter kan endres. Oversikten omfatter de norske tilbyderne som inngår i vår prisberegning.</p>
      </section>
    </ArticleLayout>
  );
}
