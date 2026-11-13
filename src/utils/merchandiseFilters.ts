import type { MerchandiseGroup, MerchandiseKind, MerchandiseWithMeta } from '@/types/merchandise'
import { normalize } from './videogameFilters'

export interface MerchandiseFilters {
  searchQuery: string
  groups: MerchandiseGroup[]
  kinds: MerchandiseKind[]
  // Solo artículos con edición en castellano publicada en España
  spainOnly: boolean
  // Solo artículos que se pueden comprar hoy
  availableOnly: boolean
}

export type MerchandiseSortField = 'date' | 'title'

export interface MerchandiseSort {
  field: MerchandiseSortField
  direction: 'asc' | 'desc'
}

type Facet = 'groups' | 'kinds'

export type MerchandiseFacetCounts = Record<Facet, Record<string, number>> & {
  spain: number
  available: number
}

const FACETS: Facet[] = ['groups', 'kinds']

function matchesSearch(item: MerchandiseWithMeta, searchQuery: string): boolean {
  const query = normalize(searchQuery.trim())
  if (!query) return true
  return [item.title, item.title_es, item.manufacturer]
    .filter((text): text is string => !!text)
    .some((text) => normalize(text).includes(query))
}

function facetValue(item: MerchandiseWithMeta, facet: Facet): string {
  return facet === 'groups' ? item.group : item.kind
}

function matchesFilters(
  item: MerchandiseWithMeta,
  filters: MerchandiseFilters,
  except?: Facet | 'spain' | 'available'
): boolean {
  if (!matchesSearch(item, filters.searchQuery)) return false
  if (except !== 'spain' && filters.spainOnly && item.spanish !== 'spain') return false
  if (except !== 'available' && filters.availableOnly && !item.availableToBuy) return false
  return FACETS.every((facet) => {
    const selected: string[] = filters[facet]
    return facet === except || selected.length === 0 || selected.includes(facetValue(item, facet))
  })
}

export function filterMerchandise(
  items: MerchandiseWithMeta[],
  filters: MerchandiseFilters
): MerchandiseWithMeta[] {
  return items.filter((item) => matchesFilters(item, filters))
}

// Cuántos artículos daría cada opción con el resto de filtros activos
export function getMerchandiseFacetCounts(
  items: MerchandiseWithMeta[],
  filters: MerchandiseFilters
): MerchandiseFacetCounts {
  const counts = { groups: {}, kinds: {}, spain: 0, available: 0 } as MerchandiseFacetCounts
  for (const facet of FACETS) {
    for (const item of items) {
      if (!matchesFilters(item, filters, facet)) continue
      const value = facetValue(item, facet)
      counts[facet][value] = (counts[facet][value] ?? 0) + 1
    }
  }
  counts.spain = items.filter(
    (item) => item.spanish === 'spain' && matchesFilters(item, filters, 'spain')
  ).length
  counts.available = items.filter(
    (item) => item.availableToBuy && matchesFilters(item, filters, 'available')
  ).length
  return counts
}

export function sortMerchandise(
  items: MerchandiseWithMeta[],
  { field, direction }: MerchandiseSort
): MerchandiseWithMeta[] {
  const sign = direction === 'asc' ? 1 : -1
  return [...items].sort((a, b) => {
    if (field === 'title') return sign * a.title.localeCompare(b.title)
    // Los que no tienen fecha siempre al final
    if (!a.date || !b.date) return Number(!a.date) - Number(!b.date)
    return sign * a.date.localeCompare(b.date)
  })
}
