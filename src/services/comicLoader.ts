import type { Comic, ComicEdition, ComicSummary, ComicWithMeta } from '@/types/comic'
import { enrichComic } from '@/utils/comics'

// Como las novelas, los datos de cómics no van en el bundle principal: el índice del listado,
// los tomos de varias series y cada serie son trozos aparte. El servidor los carga todos antes de
// pintar (entry-server.tsx) y el navegador precarga los de la ruta antes de hidratar (main.tsx),
// así que las páginas leen siempre de esta caché de forma síncrona.

const comicModules = import.meta.glob<Comic>('/data/comics/*/*.json', { import: 'default' })

const collectionModules = import.meta.glob<ComicEdition[]>('/data/comics/collections.json', {
  import: 'default',
})

let cachedCollections: ComicEdition[] | null = null
let cachedIndex: ComicSummary[] | null = null
const cachedComics = new Map<string, ComicWithMeta>()

export function setCollections(collections: ComicEdition[]) {
  cachedCollections = collections
}

export async function loadCollections(): Promise<ComicEdition[]> {
  if (!cachedCollections) {
    const [load] = Object.values(collectionModules)
    setCollections(load ? await load() : [])
  }
  return cachedCollections!
}

export function setComicIndex(index: ComicSummary[]) {
  cachedIndex = index
}

export function getComicIndex(): ComicSummary[] | null {
  return cachedIndex
}

export async function loadComicIndex(): Promise<ComicSummary[]> {
  if (!cachedIndex) setComicIndex((await import('virtual:comics-index')).default)
  return cachedIndex!
}

export function getCachedComic(slug: string): ComicWithMeta | undefined {
  return cachedComics.get(slug)
}

// Necesita los tomos de varias series ya cargados; la serie que continúa a esta sale del índice
export function cacheComic(comic: Comic): ComicWithMeta {
  const continuedBy = continuedByOf(comic.slug)
  const enriched = enrichComic(comic, cachedCollections ?? [], continuedBy)
  cachedComics.set(comic.slug, enriched)
  return enriched
}

// La continuación se guarda en la serie siguiente (continues); el índice la expone al revés
const continuations = new Map<string, string>()

export function setContinuations(map: Map<string, string>) {
  continuations.clear()
  for (const [from, to] of map) continuations.set(from, to)
}

function continuedByOf(slug: string): string | null {
  return continuations.get(slug) ?? null
}

// Ruta del JSON de cada serie por su slug (los archivos se llaman como el slug)
function moduleFor(slug: string): (() => Promise<Comic>) | undefined {
  const path = Object.keys(comicModules).find((p) => p.endsWith(`/${slug}.json`))
  return path ? comicModules[path] : undefined
}

export async function loadComic(slug: string): Promise<ComicWithMeta | undefined> {
  const cached = cachedComics.get(slug)
  if (cached) return cached
  const load = moduleFor(slug)
  if (!load) return undefined
  const [comic] = await Promise.all([load(), loadCollections(), loadContinuations()])
  return cacheComic(comic)
}

let continuationsLoaded = false

// Las continuaciones vienen en el índice virtual (virtual:comics-index lleva continuedBy)
async function loadContinuations(): Promise<void> {
  if (continuationsLoaded) return
  const index = await loadComicIndex()
  setContinuations(
    new Map(index.flatMap((c) => (c.continuedBy ? [[c.slug, c.continuedBy] as const] : [])))
  )
  continuationsLoaded = true
}

// Carga lo que necesita la página de la ruta para pintar lo mismo que el HTML prerenderizado
export async function preloadComicRoute(pathname: string): Promise<void> {
  const detail = pathname.match(/^\/comic\/([^/]+)\/?$/)
  if (detail) {
    await Promise.all([loadComicIndex(), loadComic(decodeURIComponent(detail[1]))])
  } else if (/^\/comics\/?$/.test(pathname)) {
    await loadComicIndex()
  }
}
