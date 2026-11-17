import type { NovelSetting, NovelSummary } from '@/types/novel'
import { normalize } from './videogameFilters'

export interface NovelFilters {
  searchQuery: string
  settings: NovelSetting[]
  series: string[]
  // Solo novelas con alguna edición en castellano (en España o fuera)
  spanishOnly: boolean
  // Solo novelas que se pueden comprar hoy
  availableOnly: boolean
}

// reading: orden de lectura, por series y número dentro de cada una
export type NovelSortField = 'date' | 'title' | 'reading'

export interface NovelSort {
  field: NovelSortField
  direction: 'asc' | 'desc'
}

type Facet = 'settings' | 'series'

export type NovelFacetCounts = Record<Facet, Record<string, number>> & {
  spanish: number
  available: number
}

const FACETS: Facet[] = ['settings', 'series']

function matchesSearch(novel: NovelSummary, searchQuery: string): boolean {
  const query = normalize(searchQuery.trim())
  return !query || novel.searchText.includes(query)
}

function facetValue(novel: NovelSummary, facet: Facet): string | undefined {
  return facet === 'settings' ? novel.setting : novel.series?.id
}

function matchesFilters(
  novel: NovelSummary,
  filters: NovelFilters,
  except?: Facet | 'spanish' | 'available'
): boolean {
  if (!matchesSearch(novel, filters.searchQuery)) return false
  if (except !== 'spanish' && filters.spanishOnly && novel.spanish === 'none') return false
  if (except !== 'available' && filters.availableOnly && !novel.availableToBuy) return false
  return FACETS.every((facet) => {
    const selected: string[] = filters[facet]
    const value = facetValue(novel, facet)
    return facet === except || selected.length === 0 || (!!value && selected.includes(value))
  })
}

export function filterNovels(novels: NovelSummary[], filters: NovelFilters): NovelSummary[] {
  return novels.filter((novel) => matchesFilters(novel, filters))
}

// Cuántas novelas daría cada opción con el resto de filtros activos. El panel usa los
// recuentos de series para ofrecer solo las de los mundos elegidos.
export function getNovelFacetCounts(
  novels: NovelSummary[],
  filters: NovelFilters
): NovelFacetCounts {
  const counts = { settings: {}, series: {}, spanish: 0, available: 0 } as NovelFacetCounts
  for (const facet of FACETS) {
    for (const novel of novels) {
      const value = facetValue(novel, facet)
      if (!value || !matchesFilters(novel, filters, facet)) continue
      counts[facet][value] = (counts[facet][value] ?? 0) + 1
    }
  }
  counts.spanish = novels.filter(
    (novel) => novel.spanish !== 'none' && matchesFilters(novel, filters, 'spanish')
  ).length
  counts.available = novels.filter(
    (novel) => novel.availableToBuy && matchesFilters(novel, filters, 'available')
  ).length
  return counts
}

// Orden de lectura: cada serie en el lugar de su primera novela y, dentro, por su número; las
// novelas sueltas, por su fecha entre las series
function readingOrder(novels: NovelSummary[], sign: number): NovelSummary[] {
  const groupDate = new Map<string, string>()
  for (const novel of novels) {
    const key = novel.series?.id ?? novel.slug
    const date = novel.date ?? '9999'
    if (!groupDate.has(key) || date < groupDate.get(key)!) groupDate.set(key, date)
  }
  const keyOf = (novel: NovelSummary) => novel.series?.id ?? novel.slug
  return [...novels].sort(
    (a, b) =>
      sign * groupDate.get(keyOf(a))!.localeCompare(groupDate.get(keyOf(b))!) ||
      keyOf(a).localeCompare(keyOf(b)) ||
      (a.series?.number ?? 0) - (b.series?.number ?? 0)
  )
}

export function sortNovels(
  novels: NovelSummary[],
  { field, direction }: NovelSort
): NovelSummary[] {
  const sign = direction === 'asc' ? 1 : -1
  if (field === 'reading') return readingOrder(novels, sign)
  return [...novels].sort((a, b) => {
    if (field === 'title') return sign * a.title.localeCompare(b.title)
    // Las que no tienen fecha siempre al final
    if (!a.date || !b.date) return Number(!a.date) - Number(!b.date)
    return sign * a.date.localeCompare(b.date) || a.title.localeCompare(b.title)
  })
}
