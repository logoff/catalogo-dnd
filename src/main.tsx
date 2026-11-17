import { StrictMode } from 'react'
import { createRoot, hydrateRoot } from 'react-dom/client'
import App from './App'
import { preloadNovelRoute } from './services/novelLoader'
import './styles/globals.css'

// Quita las etiquetas del <head> que trae el HTML: a partir de aquí las gestiona cada página
document.querySelectorAll('[data-static-meta]').forEach((el) => el.remove())

const container = document.getElementById('root')!
const app = (
  <StrictMode>
    <App />
  </StrictMode>
)

// En producción el HTML viene prerenderizado; en desarrollo el contenedor llega vacío. Las
// páginas de novelas necesitan sus datos antes del primer render para coincidir con ese HTML.
preloadNovelRoute(window.location.pathname).finally(() => {
  if (container.hasChildNodes()) {
    hydrateRoot(container, app)
  } else {
    createRoot(container).render(app)
  }
})
