import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Layout from './components/layout/Layout'
import HomePage from './pages/HomePage'
import CatalogPage from './pages/CatalogPage'
import EditionPage from './pages/EditionPage'
import ProductDetailPage from './pages/ProductDetailPage'
import NotFoundPage from './pages/NotFoundPage'
import { BASE_PATH } from './utils/constants'

function App() {
  // Remove trailing slash for basename
  const basename = BASE_PATH.endsWith('/') ? BASE_PATH.slice(0, -1) : BASE_PATH

  return (
    <BrowserRouter
      basename={basename}
      future={{
        v7_startTransition: true,
        v7_relativeSplatPath: true,
      }}
    >
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="catalogo" element={<CatalogPage />} />
          <Route path="2014" element={<EditionPage edition="5e" />} />
          <Route path="2014/:category" element={<EditionPage edition="5e" />} />
          <Route path="2024" element={<EditionPage edition="2024" />} />
          <Route path="2024/:category" element={<EditionPage edition="2024" />} />
          <Route path="producto/:code" element={<ProductDetailPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
