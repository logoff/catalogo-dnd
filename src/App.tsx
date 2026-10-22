import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Layout from './components/layout/Layout'
import HomePage from './pages/HomePage'
import CatalogPage from './pages/CatalogPage'
import EditionPage from './pages/EditionPage'
import ProductDetailPage from './pages/ProductDetailPage'
import NotFoundPage from './pages/NotFoundPage'
import GuidesPage from './pages/GuidesPage'
import LegalPage from './pages/LegalPage'
import StartGuide from './pages/guides/StartGuide'
import EditionsGuide from './pages/guides/EditionsGuide'
import SpanishTimeline from './pages/guides/SpanishTimeline'
import EnglishTimeline from './pages/guides/EnglishTimeline'
import { BASE_PATH } from './utils/constants'

function App() {
  // Remove trailing slash for basename
  const basename = BASE_PATH.endsWith('/') ? BASE_PATH.slice(0, -1) : BASE_PATH

  return (
    <BrowserRouter basename={basename}>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="catalogo" element={<CatalogPage />} />
          <Route path="2014" element={<EditionPage edition="5e" />} />
          <Route path="2014/:category" element={<EditionPage edition="5e" />} />
          <Route path="2024" element={<EditionPage edition="2024" />} />
          <Route path="2024/:category" element={<EditionPage edition="2024" />} />
          <Route path="producto/:edition/:code" element={<ProductDetailPage />} />
          <Route path="guias" element={<GuidesPage />} />
          <Route path="guias/por-donde-empezar" element={<StartGuide />} />
          <Route path="guias/2014-vs-2024" element={<EditionsGuide />} />
          <Route path="guias/cronologia-castellano" element={<SpanishTimeline />} />
          <Route path="guias/cronologia-ingles" element={<EnglishTimeline />} />
          <Route path="aviso-legal" element={<LegalPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
