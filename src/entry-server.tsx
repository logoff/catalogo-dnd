import { StrictMode } from 'react'
import { renderToString } from 'react-dom/server'
import { StaticRouter } from 'react-router-dom'
import AppRoutes from './AppRoutes'
import { ROUTER_BASENAME } from './utils/constants'
import type { Novel, NovelAnthology, NovelSeries } from './types/novel'
import { cacheNovel, loadNovelIndex, setAnthologies, setSeries } from './services/novelLoader'

// En el navegador los datos de novelas se cargan por trozos; aquí se cargan todos antes de pintar
await loadNovelIndex()
const series = import.meta.glob<NovelSeries[]>('/data/novels/series.json', {
  eager: true,
  import: 'default',
})
setSeries(Object.values(series)[0] ?? [])
const anthologies = import.meta.glob<NovelAnthology[]>('/data/novels/anthologies.json', {
  eager: true,
  import: 'default',
})
setAnthologies(Object.values(anthologies)[0] ?? [])
const novels = import.meta.glob<Novel>('/data/novels/*/*.json', { eager: true, import: 'default' })
Object.values(novels).forEach(cacheNovel)

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
