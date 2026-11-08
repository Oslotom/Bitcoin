import type { ComparisonResult, MarketSnapshot } from '../../types';
import ArticleLayout, { type NavigateFn } from './ArticleLayout';
import AmountControl from '../AmountControl';
import MarketStatus from '../MarketStatus';
import ResultsTable from '../ResultsTable';
import BitcoinConverter from '../BitcoinConverter';

export default function CalculatorPage({ results, snapshot, amount, onAmountChange, navigateTo }: { results: ComparisonResult[]; snapshot: MarketSnapshot; amount: number; onAmountChange: (value: number) => void; navigateTo: NavigateFn }) {
  return <ArticleLayout page="calculator" title="Hvor mye Bitcoin får du for pengene?" intro="Velg kronebeløpet ditt og sammenlign beregnet mengde Bitcoin etter handelsgebyr og ekstra spread. Alle priser har kilde og tidspunkt." related={['price', 'research', 'firiBare', 'nbxBare']} navigateTo={navigateTo}>
    <section aria-label="Bitcoin-kalkulator"><AmountControl amount={amount} onChange={onAmountChange} /><MarketStatus snapshot={snapshot} /><ResultsTable results={results} isLoading={false} error={null} compact /></section>
    <BitcoinConverter results={results} />
    <section><h2>Slik bruker du kalkulatoren</h2><p>Velg for eksempel 1 000, 10 000 eller 50 000 kr, eller skriv inn et eget beløp mellom 100 og 10 000 000 kr. «Du får BTC» er en beregning basert på den lagrede kursen og scenarioet for hver børs, ikke en ordrebokberegning eller et kjøpstilbud.</p><p>Ved store beløp kan likviditet, slippage og volumrabatter endre prisen. Ved små beløp kan minimumsgebyrer få større betydning. Innskudd, uttak og NOK/EUR- eller NOK/USD-veksling er ikke inkludert.</p><a href="/om-oss#metode" className="text-brand hover:underline">Les forutsetningene og kontotypene</a></section>
  </ArticleLayout>;
}
