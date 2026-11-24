// Lógica pura de cómics, sin import.meta.glob: la usan el loader del navegador y el plugin de Vite
// que genera el índice del listado en Node (por eso las importaciones son relativas)
import type {
  Comic,
  ComicEdition,
  ComicEditionWithMeta,
  ComicSummary,
  ComicWithMeta,
} from '../types/comic.ts'
import { normalize } from './videogameFilters.ts'

// Números de un rango: «1-5» → 1…5; «1-3, 6» → 1, 2, 3, 6; «Annual 1» → «Annual 1». Los rangos
// solo valen entre números enteros; lo demás se toma tal cual.
export function expandIssueRange(range: string): string[] {
  return range.split(',').flatMap((part) => {
    const text = part.trim()
    const match = text.match(/^(\d+)\s*-\s*(\d+)$/)
    if (!match) return [text]
    const [from, to] = [Number(match[1]), Number(match[2])]
    return Array.from({ length: Math.max(0, to - from + 1) }, (_, i) => String(from + i))
  })
}

// Números que recoge una edición de una serie concreta
export function issuesOf(edition: ComicEdition, slug: string): string[] {
  return (edition.contents ?? [])
    .filter((content) => content.series === slug)
    .flatMap((content) => expandIssueRange(content.issues))
}

// Tomos de collections.json que recogen la serie
export function collectionsFor(collections: ComicEdition[], slug: string): ComicEdition[] {
  return collections.filter((edition) => edition.contents?.some((c) => c.series === slug))
}

// Nombre corto de una edición, para indicar en qué tomo está cada número
export function editionLabel(edition: ComicEdition): string {
  const year = edition.date ? ` (${edition.date.slice(0, 4)})` : ''
  return `${edition.title ?? edition.publisher}${year}`
}

export function thumbnailOf(cover: string): string {
  return cover.replace(/\.webp$/, '-thumb.webp')
}

function byDateDesc<T extends { date?: string }>(a: T, b: T): number {
  return (b.date ?? '').localeCompare(a.date ?? '')
}

function yearsOf(comic: Comic): string {
  const from = comic.date.slice(0, 4)
  const to = (comic.end_date ?? comic.date).slice(0, 4)
  return from === to ? from : `${from}-${to}`
}

function spanishOf(editions: ComicEdition[]): ComicWithMeta['spanish'] {
  const spanish = editions.filter((edition) => edition.language === 'castellano')
  if (spanish.some((edition) => edition.spain)) return 'spain'
  return spanish.length > 0 ? 'elsewhere' : 'none'
}

export function enrichComic(
  comic: Comic,
  collections: ComicEdition[],
  continuedBy: string | null = null
): ComicWithMeta {
  const editions: ComicEditionWithMeta[] = [
    ...(comic.editions ?? []),
    ...collectionsFor(collections, comic.slug),
  ]
    .map((edition) => ({
      ...edition,
      otherSeries: [
        ...new Set(
          (edition.contents ?? []).map((c) => c.series).filter((slug) => slug !== comic.slug)
        ),
      ],
    }))
    .sort(byDateDesc)

  const collectedIn: Record<string, string[]> = {}
  for (const edition of editions) {
    if (edition.format === 'issue') continue
    for (const number of issuesOf(edition, comic.slug)) {
      ;(collectedIn[number] ??= []).push(editionLabel(edition))
    }
  }

  const spanishTitle =
    comic.title_es ??
    editions.find((edition) => edition.language === 'castellano' && edition.title)?.title ??
    null

  const cover =
    comic.issues.find((issue) => issue.cover)?.cover ??
    [...editions].reverse().find((edition) => edition.cover)?.cover ??
    null

  return {
    ...comic,
    years: yearsOf(comic),
    editions,
    spanishTitle,
    spanish: spanishOf(editions),
    availableToBuy: editions.some((edition) => (edition.purchase_links ?? []).length > 0),
    cover,
    collectedIn,
    continuedBy,
  }
}

// De la más reciente a la más antigua; a igual fecha, por título
export function compareByDate(
  a: Pick<Comic, 'date' | 'title'>,
  b: Pick<Comic, 'date' | 'title'>
): number {
  return b.date.localeCompare(a.date) || a.title.localeCompare(b.title)
}

export function summarize(comic: ComicWithMeta): ComicSummary {
  const people = [
    ...(comic.writers ?? []),
    ...(comic.artists ?? []),
    ...comic.issues.flatMap((issue) => [...(issue.writers ?? []), ...(issue.artists ?? [])]),
  ]
  const titles = [
    comic.title,
    ...(comic.spanishTitle ? [comic.spanishTitle] : []),
    ...comic.editions.flatMap((edition) => (edition.title ? [edition.title] : [])),
  ]
  return {
    slug: comic.slug,
    title: comic.title,
    spanishTitle: comic.spanishTitle,
    publisher: comic.publisher,
    setting: comic.setting,
    kind: comic.kind,
    date: comic.date,
    years: comic.years,
    issue_count: comic.issue_count,
    announced: comic.announced ?? false,
    thumbnail: comic.cover ? thumbnailOf(comic.cover) : null,
    spanish: comic.spanish,
    availableToBuy: comic.availableToBuy,
    searchText: normalize([...new Set([...titles, ...people])].join(' | ')),
  }
}

// Serie que continúa a cada una (el inverso de continues)
export function continuations(comics: Comic[]): Map<string, string> {
  return new Map(
    comics.flatMap((comic) => (comic.continues ? [[comic.continues, comic.slug] as const] : []))
  )
}

// Lo que necesita el listado: sin descripciones, números ni ediciones
export function buildComicIndex(comics: Comic[], collections: ComicEdition[]): ComicSummary[] {
  const next = continuations(comics)
  return comics
    .map((comic) => summarize(enrichComic(comic, collections, next.get(comic.slug) ?? null)))
    .sort(compareByDate)
}
