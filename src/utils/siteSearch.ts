// Buscador global: convierte las fichas de cada sección en entradas comunes y las busca todas a la
// vez, agrupadas por sección. Lógica pura, sin cargar datos: la página de resultados le pasa lo
// que tiene en memoria y los índices de novelas, cómics y rol cuando llegan.
import type { ProductWithMeta } from '@/types'
import type { VideogameWithMeta } from '@/types/videogame'
import type { MerchandiseWithMeta } from '@/types/merchandise'
import type { NovelSummary } from '@/types/novel'
import type { ComicSummary } from '@/types/comic'
import type { RpgIndex } from '@/types/rpg'
import type { ScreenWorkWithMeta } from '@/types/screen'
import { PLACEHOLDER_IMAGE } from './constants'
import { firstPublication, productPath } from './releases'
import { translateEdition, translateType } from './translations'
import { bookPath, isDndEdition, systemPath } from './rpg'
import { normalize } from './videogameFilters'
import { isbnsOf } from './searchText'
import { kindNames as screenKindNames, yearsLabel } from './screen'

export type SearchSection =
  | 'books'
  | 'editions'
  | 'videogames'
  | 'merchandise'
  | 'novels'
  | 'comics'
  | 'screen'
  | 'rpg'
  | 'licenses'

// Orden en que se muestran los grupos de resultados
export const SEARCH_SECTIONS: { id: SearchSection; label: string; path: string }[] = [
  { id: 'books', label: 'Libros de 5E y 2024', path: '/catalogo' },
  { id: 'editions', label: 'Ediciones anteriores de D&D', path: '/ediciones' },
  { id: 'videogames', label: 'Videojuegos', path: '/videojuegos' },
  { id: 'merchandise', label: 'Merchandising', path: '/merchandising' },
  { id: 'novels', label: 'Novelas', path: '/novelas' },
  { id: 'comics', label: 'Cómics', path: '/comics' },
  { id: 'screen', label: 'Cine y series', path: '/cine-y-series' },
  { id: 'rpg', label: 'Otros juegos de rol', path: '/rol' },
  { id: 'licenses', label: 'Licencias abiertas', path: '/licencias' },
]

export interface SearchEntry {
  section: SearchSection
  path: string
  title: string
  // Título en castellano, si lo tiene y es distinto del original
  titleEs: string | null
  // Miniatura de la portada o imagen principal, si la hay
  image: string | null
  // Dato breve para distinguir la ficha: edición, año, autor, sistema…
  detail: string
  // Títulos, autores o editoriales e ISBN, sin tildes ni mayúsculas
  searchText: string
}

export interface SearchGroup {
  section: SearchSection
  label: string
  path: string
  entries: SearchEntry[]
}

const join = (parts: (string | number | null | undefined)[]) =>
  parts.filter((part) => part !== null && part !== undefined && part !== '').join(' · ')

const textOf = (parts: (string | null | undefined)[]) =>
  normalize([...new Set(parts.filter((part): part is string => !!part))].join(' | '))

const distinct = (original: string, spanish: string | null | undefined) =>
  spanish && spanish !== original ? spanish : null

export function productEntries(products: ProductWithMeta[]): SearchEntry[] {
  return products.map((product) => {
    const image = product.publications[0]?.images?.[0]
    return {
      section: 'books',
      path: productPath(product),
      title: product.primaryTitle,
      titleEs: distinct(product.primaryTitle, firstPublication(product, 'castellano')?.title),
      image: image && image !== PLACEHOLDER_IMAGE ? image : null,
      detail: join([
        translateEdition(product.primaryEdition),
        translateType(product.primaryType),
        product.dateRange.earliest?.slice(0, 4),
      ]),
      searchText: textOf([
        product.code,
        product.primaryTitle,
        ...product.publications.flatMap((pub) => [
          pub.title,
          ...(pub.authors ?? []),
          pub.publisher,
        ]),
        ...isbnsOf(product.publications),
      ]),
    }
  })
}

export function videogameEntries(games: VideogameWithMeta[]): SearchEntry[] {
  return games.map((game) => ({
    section: 'videogames',
    path: `/videojuego/${game.slug}`,
    title: game.title,
    titleEs: distinct(game.title, game.title_es),
    image: game.images?.[0] ?? null,
    detail: join([game.firstReleaseDate?.slice(0, 4), game.developers.join(', ')]),
    searchText: textOf([game.title, game.title_es, ...game.developers, ...game.publishers]),
  }))
}

export function merchandiseEntries(items: MerchandiseWithMeta[]): SearchEntry[] {
  return items.map((item) => ({
    section: 'merchandise',
    path: `/merchandising/${item.slug}`,
    title: item.title,
    titleEs: distinct(item.title, item.title_es),
    image: item.images[0] ?? null,
    detail: join([item.manufacturer, item.year]),
    searchText: textOf([
      item.title,
      item.title_es,
      item.manufacturer,
      ...item.editions.flatMap((edition) => [edition.title, edition.publisher]),
      ...isbnsOf(item.editions),
    ]),
  }))
}

// Novelas, cómics y libros de rol traen su texto de búsqueda hecho desde el índice
export function novelEntries(novels: NovelSummary[]): SearchEntry[] {
  return novels.map((novel) => ({
    section: 'novels',
    path: `/novela/${novel.slug}`,
    title: novel.title,
    titleEs: distinct(novel.title, novel.titleEs),
    image: novel.thumbnail,
    detail: join([novel.authors.join(', '), novel.year]),
    searchText: novel.searchText,
  }))
}

export function comicEntries(comics: ComicSummary[]): SearchEntry[] {
  return comics.map((comic) => ({
    section: 'comics',
    path: `/comic/${comic.slug}`,
    title: comic.title,
    titleEs: distinct(comic.title, comic.spanishTitle),
    image: comic.thumbnail,
    detail: join([comic.publisher, comic.years]),
    searchText: comic.searchText,
  }))
}

// Películas, series, documentales y episodios, oficiales o no
export function screenEntries(works: ScreenWorkWithMeta[]): SearchEntry[] {
  return works.map((work) => ({
    section: 'screen',
    path: `/cine-y-series/${work.slug}`,
    title: work.title,
    titleEs: distinct(work.title, work.title_es),
    image: work.poster?.thumbnail ?? null,
    detail: join([
      screenKindNames[work.kind],
      yearsLabel(work),
      work.official ? null : 'No oficial',
    ]),
    // La serie de los episodios sueltos, para que «secret level» encuentre el suyo
    searchText: textOf([work.title, work.title_es, work.parent_series]),
  }))
}

// Sistemas y libros: los de las ediciones anteriores de D&D van en su propio grupo
export function rpgEntries(index: RpgIndex): SearchEntry[] {
  const systemOf = (slug: string) => index.systems.find((system) => system.slug === slug)
  const systems: SearchEntry[] = index.systems.map((system) => ({
    section: isDndEdition(system) ? 'editions' : 'rpg',
    path: system.official_catalog ?? systemPath(system),
    title: system.name,
    titleEs: null,
    image: null,
    detail: join([system.publisher, system.date.slice(0, 4)]),
    searchText: textOf([system.name, system.publisher]),
  }))
  const books: SearchEntry[] = index.books.map((book) => {
    const system = systemOf(book.system)
    return {
      section: system && isDndEdition(system) ? 'editions' : 'rpg',
      path: bookPath(book, index.systems),
      title: book.title,
      titleEs: distinct(book.title, book.titleEs),
      image: book.thumbnail,
      detail: join([system?.name, (book.originalDate ?? book.spanishDate)?.slice(0, 4)]),
      // El nombre del sistema, para que «pathfinder» encuentre también sus libros
      searchText: system ? `${book.searchText} | ${normalize(system.name)}` : book.searchText,
    }
  })
  const licenses: SearchEntry[] = index.licenses.map((license) => ({
    section: 'licenses',
    path: `/licencia/${license.slug}`,
    title: license.name,
    titleEs: null,
    image: null,
    detail: join([license.holder, license.date.slice(0, 4)]),
    searchText: textOf([license.name, license.short_name, license.holder]),
  }))
  return [...systems, ...books, ...licenses]
}

// Fichas que contienen el texto buscado, agrupadas por sección en el orden de SEARCH_SECTIONS y
// sin grupos vacíos. Dentro de cada grupo van primero las que empiezan por el texto (en el título
// original o en el de castellano) y después el resto, cada parte por título.
export function searchSite(query: string, entries: SearchEntry[]): SearchGroup[] {
  const needle = normalize(query.trim())
  if (!needle) return []
  const startsWith = (entry: SearchEntry) =>
    normalize(entry.title).startsWith(needle) ||
    (entry.titleEs !== null && normalize(entry.titleEs).startsWith(needle))
  const compare = (a: SearchEntry, b: SearchEntry) =>
    Number(startsWith(b)) - Number(startsWith(a)) || a.title.localeCompare(b.title, 'es')

  const matches = entries.filter((entry) => entry.searchText.includes(needle))
  return SEARCH_SECTIONS.map(({ id, label, path }) => ({
    section: id,
    label,
    path,
    entries: matches.filter((entry) => entry.section === id).sort(compare),
  })).filter((group) => group.entries.length > 0)
}
