import { StrictMode } from 'react'
import { renderToString } from 'react-dom/server'
import { StaticRouter } from 'react-router-dom'
import AppRoutes from './AppRoutes'
import { ROUTER_BASENAME } from './utils/constants'

// Punto de entrada del prerenderizado (scripts/prerender.mjs): genera el HTML de una ruta
export function render(url: string): string {
  return renderToString(
    <StrictMode>
      <StaticRouter location={url} basename={ROUTER_BASENAME}>
        <AppRoutes />
      </StaticRouter>
    </StrictMode>
  )
}
