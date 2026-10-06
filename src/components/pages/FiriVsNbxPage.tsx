import FiriVsNbx from '../FiriVsNbx';
import { FEES } from '../../services/api';
import { ComparisonResult, Exchange } from '../../types';
import ArticleLayout, { InternalLink, type NavigateFn } from './ArticleLayout';

interface Props {
  results: ComparisonResult[];
  navigateTo: NavigateFn;
}

const pct = (value: number) => `${(value * 100).toFixed(2).replace('.', ',')} %`;

export default function FiriVsNbxPage({ results, navigateTo }: Props) {
  const firi = FEES[Exchange.Firi];
  const nbx = FEES[Exchange.NBX];
  const firiTotal = firi.trade + firi.spread;
  const nbxTotal = nbx.trade + nbx.spread;
  const cheaper = firiTotal < nbxTotal ? 'Firi' : 'NBX';

  return (
    <ArticleLayout
      title={<>Firi vs NBX: <span className="text-brand">hvem er billigst?</span></>}
      intro="Firi og NBX er to av de største norske kryptobørsene. Begge lar deg kjøpe Bitcoin med norske kroner og BankID – men gebyrene og funksjonene er forskjellige."
      related={['norway', 'vipps', 'price', 'live']}
      navigateTo={navigateTo}
    >
      <section>
        <h2>Kort oppsummert</h2>
        <p>
          Med gebyrene vi legger til grunn er <strong>{cheaper}</strong> billigst på selve handelen:
          totalt {pct(Math.min(firiTotal, nbxTotal))} mot {pct(Math.max(firiTotal, nbxTotal))}. På et kjøp
          for 10 000 kr utgjør forskjellen omtrent {Math.round(Math.abs(firiTotal - nbxTotal) * 10000)} kr.
          Firi er ofte å foretrekke for nybegynnere som vil sette inn penger med Vipps, mens NBX passer for deg som vil
          ha lavere kurtasje.
        </p>
      </section>

      <section>
        <h2>Gebyrer hos Firi og NBX</h2>
        <div className="card-premium overflow-x-auto">
          <table className="w-full text-sm font-table">
            <thead className="bg-slate-50 text-left text-slate-500">
              <tr>
                <th scope="col" className="px-4 py-3 font-semibold"></th>
                <th scope="col" className="px-4 py-3 font-semibold">Firi</th>
                <th scope="col" className="px-4 py-3 font-semibold">NBX</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              <tr>
                <th scope="row" className="px-4 py-3 text-left font-semibold">Handelsgebyr</th>
                <td className="px-4 py-3">{pct(firi.trade)}</td>
                <td className="px-4 py-3">{pct(nbx.trade)}</td>
              </tr>
              <tr>
                <th scope="row" className="px-4 py-3 text-left font-semibold">Estimert spread</th>
                <td className="px-4 py-3">{pct(firi.spread)}</td>
                <td className="px-4 py-3">{pct(nbx.spread)}</td>
              </tr>
              <tr>
                <th scope="row" className="px-4 py-3 text-left font-semibold">Totalt</th>
                <td className="px-4 py-3 font-bold">{pct(firiTotal)}</td>
                <td className="px-4 py-3 font-bold">{pct(nbxTotal)}</td>
              </tr>
              <tr>
                <th scope="row" className="px-4 py-3 text-left font-semibold">Gebyr på 10 000 kr</th>
                <td className="px-4 py-3">{Math.round(firiTotal * 10000)} kr</td>
                <td className="px-4 py-3">{Math.round(nbxTotal * 10000)} kr</td>
              </tr>
              <tr>
                <th scope="row" className="px-4 py-3 text-left font-semibold">Innlogging</th>
                <td className="px-4 py-3">BankID</td>
                <td className="px-4 py-3">BankID</td>
              </tr>
              <tr>
                <th scope="row" className="px-4 py-3 text-left font-semibold">Innskudd med Vipps</th>
                <td className="px-4 py-3">Ja (ekstra gebyr)</td>
                <td className="px-4 py-3">Se børsens nettside</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p className="text-sm text-slate-500 mt-3">
          Innskudds- og uttaksgebyrer kommer i tillegg. Sjekk alltid gjeldende priser hos børsen før du handler.
        </p>
      </section>

      <section>
        <FiriVsNbx results={results} />
      </section>

      <section>
        <h2>Hvilken bør du velge?</h2>
        <h3>Velg Firi hvis …</h3>
        <ul>
          <li>du er ny og vil ha en enkel app med norsk kundeservice</li>
          <li>du vil sette inn penger raskt med Vipps (se <InternalLink to="vipps" navigateTo={navigateTo}>hva Vipps koster</InternalLink>)</li>
          <li>du ønsker hjelp med skatterapport for kryptovaluta</li>
        </ul>
        <h3>Velg NBX hvis …</h3>
        <ul>
          <li>du handler større beløp og vil ha lavest mulig kurtasje</li>
          <li>du vil handle med ordrebok og egne limit-ordre</li>
        </ul>
        <p>
          Vil du se flere alternativer, finner du alle <InternalLink to="norway" navigateTo={navigateTo}>norske kryptobørser</InternalLink> her.
        </p>
      </section>
    </ArticleLayout>
  );
}
