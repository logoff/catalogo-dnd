import type { RpgBook, RpgBookWithMeta, RpgIndex } from '@/types/rpg'
import { enrichBook } from '@/utils/rpg'

// Como en novelas, los datos de la sección no van en el bundle principal: el índice (licencias,
// sistemas y resumen de los libros) y cada libro son trozos aparte. El servidor los carga todos
// antes de pintar (entry-server.tsx) y el navegador precarga los de la ruta antes de hidratar
// (main.tsx), así que las páginas leen siempre de esta caché de forma síncrona.

// En un Map y no en un objeto: la clave sale de la URL y no debe poder llegar a propiedades
// heredadas como __proto__
const bookModules = new Map(
  Object.entries(import.meta.glob<RpgBook>('/data/rol/books/*/*.json', { import: 'default' }))
)

let cachedIndex: RpgIndex | null = null
const cachedBooks = new Map<string, RpgBookWithMeta>()

export function getRpgIndex(): RpgIndex | null {
  return cachedIndex
}

export function setRpgIndex(index: RpgIndex) {
  cachedIndex = index
}

export async function loadRpgIndex(): Promise<RpgIndex> {
  if (!cachedIndex) setRpgIndex((await import('virtual:rpg-index')).default)
  return cachedIndex!
}

// Necesita el índice ya cargado, para las licencias del sistema del libro
export function cacheBook(book: RpgBook): RpgBookWithMeta {
  const enriched = enrichBook(book, cachedIndex?.systems ?? [])
  cachedBooks.set(book.slug, enriched)
  return enriched
}

export function getCachedBook(slug: string): RpgBookWithMeta | undefined {
  return cachedBooks.get(slug)
}

// Ruta del JSON de cada libro: data/rol/books/<sistema>/<slug>.json
function moduleFor(system: string, slug: string): (() => Promise<RpgBook>) | undefined {
  return bookModules.get(`/data/rol/books/${system}/${slug}.json`)
}

export async function loadBook(system: string, slug: string): Promise<RpgBookWithMeta | undefined> {
  const cached = cachedBooks.get(slug)
  if (cached) return cached.system === system ? cached : undefined
  const load = moduleFor(system, slug)
  if (!load) return undefined
  const [book] = await Promise.all([load(), loadRpgIndex()])
  return cacheBook(book)
}

// Carga lo que necesita la página de la ruta para pintar lo mismo que el HTML prerenderizado.
// Todas las páginas de la sección usan el índice; la del libro, además, su JSON.
export async function preloadRpgRoute(pathname: string): Promise<void> {
  const book = pathname.match(/^\/rol\/([^/]+)\/([^/]+)\/?$/)
  if (book) {
    await loadBook(decodeURIComponent(book[1]), decodeURIComponent(book[2]))
  } else if (
    /^\/(rol|licencias)(\/[^/]+)?\/?$/.test(pathname) ||
    /^\/licencia\/[^/]+\/?$/.test(pathname)
  ) {
    await loadRpgIndex()
  }
}
