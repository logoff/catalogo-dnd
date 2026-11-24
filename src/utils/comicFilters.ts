import type { ComicSetting, ComicSummary } from '@/types/comic'
import { eraOf, publisherGroup, type ComicEra } from './comicTranslations'
import { normalize } from './videogameFilters'

export interface ComicFilters {
  searchQuery: string
  publishers: string[]
  settings: ComicSetting[]
  eras: ComicEra[]
  // Solo series con alguna edición en castellano publicada en España
  spainOnly: boolean
  // Solo series con alguna edición que se puede comprar hoy
  availableOnly: boolean
}

export const NO_FILTERS: ComicFilters = {
  searchQuery: '',
  publishers: [],
  settings: [],
  eras: [],
  spainOnly: false,
  availableOnly: false,
}

export type ComicSort = 'date-desc' | 'date-asc' | 'title-asc'

type Facet = 'publishers' | 'settings' | 'eras'

export type ComicFacetCounts = Record<Facet, Record<string, number>> & {
  spain: number
  available: number
}

const FACETS: Facet[] = ['publishers', 'settings', 'eras']

function facetValue(comic: ComicSummary, facet: Facet): string {
  if (facet === 'publishers') return publisherGroup(comic.publisher)
  if (facet === 'settings') return comic.setting
  return eraOf(comic.date)
}

function matchesFilters(
  comic: ComicSummary,
  filters: ComicFilters,
  except?: Facet | 'spain' | 'available'
): boolean {
  const query = normalize(filters.searchQuery.trim())
  if (query && !comic.searchText.includes(query)) return false
  if (except !== 'spain' && filters.spainOnly && comic.spanish !== 'spain') return false
  if (except !== 'available' && filters.availableOnly && !comic.availableToBuy) return false
  return FACETS.every((facet) => {
    const selected: string[] = filters[facet]
    return facet === except || selected.length === 0 || selected.includes(facetValue(comic, facet))
  })
}

export function filterComics(comics: ComicSummary[], filters: ComicFilters): ComicSummary[] {
  return comics.filter((comic) => matchesFilters(comic, filters))
}

export function sortComics(comics: ComicSummary[], sort: ComicSort): ComicSummary[] {
  const sorted = [...comics]
  if (sort === 'title-asc') return sorted.sort((a, b) => a.title.localeCompare(b.title))
  const direction = sort === 'date-asc' ? 1 : -1
  return sorted.sort(
    (a, b) => direction * a.date.localeCompare(b.date) || a.title.localeCompare(b.title)
  )
}

// Cuántas series daría cada opción con el resto de filtros activos
export function getComicFacetCounts(
  comics: ComicSummary[],
  filters: ComicFilters
): ComicFacetCounts {
  const counts = {
    publishers: {},
    settings: {},
    eras: {},
    spain: 0,
    available: 0,
  } as ComicFacetCounts
  for (const comic of comics) {
    for (const facet of FACETS) {
      if (!matchesFilters(comic, filters, facet)) continue
      const value = facetValue(comic, facet)
      counts[facet][value] = (counts[facet][value] ?? 0) + 1
    }
    if (comic.spanish === 'spain' && matchesFilters(comic, filters, 'spain')) counts.spain++
    if (comic.availableToBuy && matchesFilters(comic, filters, 'available')) counts.available++
  }
  return counts
}

export function activeFilterCount(filters: ComicFilters): number {
  return (
    (filters.searchQuery.trim() ? 1 : 0) +
    filters.publishers.length +
    filters.settings.length +
    filters.eras.length +
    (filters.spainOnly ? 1 : 0) +
    (filters.availableOnly ? 1 : 0)
  )
}
