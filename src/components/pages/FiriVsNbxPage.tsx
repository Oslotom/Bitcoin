import ExchangeComparisonPage from './ExchangeComparisonPage';
import type { ComparisonResult } from '../../types';
import type { NavigateFn } from './ArticleLayout';
export default function FiriVsNbxPage({ results, navigateTo }: { results: ComparisonResult[]; navigateTo: NavigateFn }) {
  return <ExchangeComparisonPage variant="firiNbx" results={results} navigateTo={navigateTo} />;
}
