import type { Novel, NovelAnthology, NovelIndex, NovelSeries, NovelWithMeta } from '@/types/novel'
import { anthologiesFor, collectionsIn, enrichNovel } from '@/utils/novels'

// Los datos de novelas no van en el bundle principal (ver design.md, «Peso»): el índice del
// listado, las series y cada novela son trozos aparte. El servidor los carga todos antes de pintar
// (entry-server.tsx) y el navegador precarga los de la ruta antes de hidratar (main.tsx), así
// que las páginas leen siempre de esta caché de forma síncrona.

const novelModules = import.meta.glob<Novel>('/data/novels/*/*.json', { import: 'default' })

// Las series, con sus recopilatorios, solo las necesita la ficha: también van aparte
const seriesModules = import.meta.glob<NovelSeries[]>('/data/novels/series.json', {
  import: 'default',
})

let cachedSeries: NovelSeries[] | null = null

export function setSeries(series: NovelSeries[]) {
  cachedSeries = series
}

export async function loadSeries(): Promise<NovelSeries[]> {
  if (!cachedSeries) {
    const [load] = Object.values(seriesModules)
    setSeries(load ? await load() : [])
  }
  return cachedSeries!
}

// Series con sus recopilatorios; solo después de loadSeries (o de setSeries en el servidor)
export function getAllSeries(): NovelSeries[] {
  return cachedSeries ?? []
}

export function getSeries(id: string): NovelSeries | undefined {
  return cachedSeries?.find((series) => series.id === id)
}

// Las antologías, como las series, solo las necesita la ficha
const anthologyModules = import.meta.glob<NovelAnthology[]>('/data/novels/anthologies.json', {
  import: 'default',
})

let cachedAnthologies: NovelAnthology[] | null = null

export function setAnthologies(anthologies: NovelAnthology[]) {
  cachedAnthologies = anthologies
}

export async function loadAnthologies(): Promise<NovelAnthology[]> {
  if (!cachedAnthologies) {
    const [load] = Object.values(anthologyModules)
    setAnthologies(load ? await load() : [])
  }
  return cachedAnthologies!
}

// Antologías de una novela; solo después de loadAnthologies (o de setAnthologies en el servidor)
export function getAnthologiesFor(novel: Novel): NovelAnthology[] {
  return anthologiesFor(cachedAnthologies ?? [], novel)
}

let cachedIndex: NovelIndex | null = null
const cachedNovels = new Map<string, NovelWithMeta>()

export function getNovelIndex(): NovelIndex | null {
  return cachedIndex
}

export function getCachedNovel(slug: string): NovelWithMeta | undefined {
  return cachedNovels.get(slug)
}

export function setNovelIndex(index: NovelIndex) {
  cachedIndex = index
}

// Necesita las series ya cargadas, para contar los recopilatorios que incluyen la novela
export function cacheNovel(novel: Novel): NovelWithMeta {
  const enriched = enrichNovel(novel, collectionsIn(cachedSeries ?? [], novel.slug))
  cachedNovels.set(novel.slug, enriched)
  return enriched
}

export async function loadNovelIndex(): Promise<NovelIndex> {
  if (!cachedIndex) setNovelIndex((await import('virtual:novels-index')).default)
  return cachedIndex!
}

// Ruta del JSON de cada novela por su slug (los archivos se llaman como el slug)
function moduleFor(slug: string): (() => Promise<Novel>) | undefined {
  const path = Object.keys(novelModules).find((p) => p.endsWith(`/${slug}.json`))
  return path ? novelModules[path] : undefined
}

export async function loadNovel(slug: string): Promise<NovelWithMeta | undefined> {
  const cached = cachedNovels.get(slug)
  if (cached) return cached
  const load = moduleFor(slug)
  if (!load) return undefined
  const [novel] = await Promise.all([load(), loadSeries(), loadAnthologies()])
  return cacheNovel(novel)
}

// Carga lo que necesita la página de la ruta para pintar lo mismo que el HTML prerenderizado.
// La ficha también usa el índice, para la lista de su serie, y las fichas de cine y series, para
// los títulos de sus novelas relacionadas.
export async function preloadNovelRoute(pathname: string): Promise<void> {
  const detail = pathname.match(/^\/novela\/([^/]+)\/?$/)
  if (detail) {
    await Promise.all([loadNovelIndex(), loadNovel(decodeURIComponent(detail[1]))])
  } else if (
    /^\/novelas\/?$/.test(pathname) ||
    /^\/cine-y-series\/[^/]+\/?$/.test(pathname) ||
    /^\/guias\/(orden-de-lectura-[^/]+|novelas-en-castellano)\/?$/.test(pathname)
  ) {
    await loadNovelIndex()
  }
}
