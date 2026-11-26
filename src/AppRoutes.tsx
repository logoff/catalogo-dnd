import { Routes, Route } from 'react-router-dom'
import Layout from './components/layout/Layout'
import HomePage from './pages/HomePage'
import CatalogPage from './pages/CatalogPage'
import EditionPage from './pages/EditionPage'
import ProductDetailPage from './pages/ProductDetailPage'
import VideogameDetailPage from './pages/VideogameDetailPage'
import VideogamesPage from './pages/VideogamesPage'
import MerchandisePage from './pages/MerchandisePage'
import MerchandiseDetailPage from './pages/MerchandiseDetailPage'
import NovelsPage from './pages/NovelsPage'
import NovelDetailPage from './pages/NovelDetailPage'
import ScreenPage from './pages/ScreenPage'
import ScreenDetailPage from './pages/ScreenDetailPage'
import LicensesPage from './pages/LicensesPage'
import RpgSectionPage from './pages/RpgSectionPage'
import RpgSystemPage from './pages/RpgSystemPage'
import RpgBookPage from './pages/RpgBookPage'
import LicenseDetailPage from './pages/LicenseDetailPage'
import NotFoundPage from './pages/NotFoundPage'
import GuidesPage from './pages/GuidesPage'
import LegalPage from './pages/LegalPage'
import StartGuide from './pages/guides/StartGuide'
import EditionsGuide from './pages/guides/EditionsGuide'
import SpanishTimeline from './pages/guides/SpanishTimeline'
import EnglishTimeline from './pages/guides/EnglishTimeline'
import SpanishReleases from './pages/guides/SpanishReleases'
import EdgeWizardsGuide from './pages/guides/EdgeWizardsGuide'
import DrizztReadingOrder from './pages/guides/DrizztReadingOrder'
import DragonlanceReadingOrder from './pages/guides/DragonlanceReadingOrder'
import SpanishNovelsGuide from './pages/guides/SpanishNovelsGuide'

// Rutas compartidas por el navegador (App) y el prerenderizado (entry-server)
export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<HomePage />} />
        <Route path="catalogo" element={<CatalogPage />} />
        <Route path="2014" element={<EditionPage edition="5e" />} />
        <Route path="2014/:category" element={<EditionPage edition="5e" />} />
        <Route path="2024" element={<EditionPage edition="2024" />} />
        <Route path="2024/:category" element={<EditionPage edition="2024" />} />
        <Route path="producto/:edition/:code" element={<ProductDetailPage />} />
        <Route path="videojuegos" element={<VideogamesPage />} />
        <Route path="videojuego/:slug" element={<VideogameDetailPage />} />
        <Route path="merchandising" element={<MerchandisePage />} />
        <Route path="merchandising/:slug" element={<MerchandiseDetailPage />} />
        <Route path="novelas" element={<NovelsPage />} />
        <Route path="novela/:slug" element={<NovelDetailPage />} />
        <Route path="cine-y-series" element={<ScreenPage />} />
        <Route path="cine-y-series/:slug" element={<ScreenDetailPage />} />
        <Route path="rol" element={<RpgSectionPage />} />
        <Route path="rol/:system" element={<RpgSystemPage />} />
        <Route path="rol/:system/:book" element={<RpgBookPage />} />
        <Route path="licencias" element={<LicensesPage />} />
        <Route path="licencia/:slug" element={<LicenseDetailPage />} />
        <Route path="guias" element={<GuidesPage />} />
        <Route path="guias/por-donde-empezar" element={<StartGuide />} />
        <Route path="guias/2014-vs-2024" element={<EditionsGuide />} />
        <Route path="guias/cronologia-castellano" element={<SpanishTimeline />} />
        <Route path="guias/cronologia-ingles" element={<EnglishTimeline />} />
        <Route path="guias/cuando-sale-en-castellano" element={<SpanishReleases />} />
        <Route path="guias/edge-o-wizards" element={<EdgeWizardsGuide />} />
        <Route path="guias/orden-de-lectura-drizzt" element={<DrizztReadingOrder />} />
        <Route path="guias/orden-de-lectura-dragonlance" element={<DragonlanceReadingOrder />} />
        <Route path="guias/novelas-en-castellano" element={<SpanishNovelsGuide />} />
        <Route path="aviso-legal" element={<LegalPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  )
}
