// Eager imports for build-time rendering only. The browser uses lazy imports in App.
import Overview from './components/Overview';
import NorwayExchanges from './components/NorwayExchanges';
import BitcoinKursPage from './components/pages/BitcoinKursPage';
import FiriVsNbxPage from './components/pages/FiriVsNbxPage';
import VippsPage from './components/pages/VippsPage';
import TaxPage from './components/pages/TaxPage';
import AboutPage from './components/pages/AboutPage';
import CalculatorPage from './components/pages/CalculatorPage';
import ExchangeComparisonPage from './components/pages/ExchangeComparisonPage';
import PriceResearchPage from './components/pages/PriceResearchPage';
import { INITIAL_SNAPSHOT, compareSnapshot } from './services/market';
import type { Page } from './routes';

export function renderPage(page: Page) {
  const navigateTo = () => {};
  const results = compareSnapshot(INITIAL_SNAPSHOT);
  const common = { results, navigateTo, snapshot: INITIAL_SNAPSHOT, amount: 10000, onAmountChange: () => {} };
  switch (page) {
    case 'overview': return <Overview navigateTo={navigateTo} />;
    case 'norway': return <NorwayExchanges navigateTo={navigateTo} />;
    case 'price': return <BitcoinKursPage {...common} isLoading={false} error={null} />;
    case 'firiNbx': return <FiriVsNbxPage {...common} />;
    case 'vipps': return <VippsPage {...common} />;
    case 'tax': return <TaxPage navigateTo={navigateTo} />;
    case 'about': return <AboutPage navigateTo={navigateTo} />;
    case 'calculator': return <CalculatorPage {...common} />;
    case 'firiBare': case 'nbxBare': return <ExchangeComparisonPage {...common} variant={page} />;
    case 'research': return <PriceResearchPage {...common} asOf={INITIAL_SNAPSHOT.generatedAt} />;
    default: return null;
  }
}
