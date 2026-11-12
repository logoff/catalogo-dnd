import type { Genre, Platform, Setting, VideogameWithMeta } from '@/types/videogame'

export type SpanishFilter = 'full' | 'text' | 'none'

export interface VideogameFilters {
  searchQuery: string
  platforms: Platform[]
  decades: number[]
  spanish: SpanishFilter[]
  settings: Setting[]
  genres: Genre[]
  // Solo juegos que se pueden comprar hoy
  availableOnly: boolean
}

export type VideogameSortField = 'date' | 'title' | 'score'

export interface VideogameSort {
  field: VideogameSortField
  direction: 'asc' | 'desc'
}

type Facet = 'platforms' | 'decades' | 'spanish' | 'settings' | 'genres'

export type VideogameFacetCounts = Record<Facet, Record<string, number>> & { available: number }

const FACETS: Facet[] = ['platforms', 'decades', 'spanish', 'settings', 'genres']

// Sin tildes ni mayúsculas: «puertas de baldur» encuentra «Puertas de Baldur»
export function normalize(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
}

function matchesSearch(game: VideogameWithMeta, searchQuery: string): boolean {
  const query = normalize(searchQuery.trim())
  if (!query) return true
  return [game.title, game.title_es]
    .filter((title): title is string => !!title)
    .some((title) => normalize(title).includes(query))
}

function facetValues(game: VideogameWithMeta, facet: Facet): (string | number)[] {
  switch (facet) {
    case 'platforms':
      return game.platforms
    case 'decades':
      return game.decade === null ? [] : [game.decade]
    case 'spanish':
      return [game.spanishSummary]
    case 'settings':
      return game.setting ? [game.setting] : []
    case 'genres':
      return game.genres
  }
}

function matchesFilters(
  game: VideogameWithMeta,
  filters: VideogameFilters,
  except?: Facet | 'available'
): boolean {
  if (!matchesSearch(game, filters.searchQuery)) return false
  if (except !== 'available' && filters.availableOnly && !game.availableToBuy) return false
  return FACETS.every((facet) => {
    const selected: (string | number)[] = filters[facet]
    if (facet === except || selected.length === 0) return true
    return facetValues(game, facet).some((value) => selected.includes(value))
  })
}

export function filterVideogames(
  games: VideogameWithMeta[],
  filters: VideogameFilters
): VideogameWithMeta[] {
  return games.filter((game) => matchesFilters(game, filters))
}

// Cuántos juegos daría cada opción con el resto de filtros activos
export function getVideogameFacetCounts(
  games: VideogameWithMeta[],
  filters: VideogameFilters
): VideogameFacetCounts {
  const counts = {
    platforms: {},
    decades: {},
    spanish: {},
    settings: {},
    genres: {},
    available: 0,
  } as VideogameFacetCounts
  for (const facet of FACETS) {
    for (const game of games) {
      if (!matchesFilters(game, filters, facet)) continue
      for (const value of new Set(facetValues(game, facet))) {
        counts[facet][value] = (counts[facet][value] ?? 0) + 1
      }
    }
  }
  counts.available = games.filter(
    (game) => game.availableToBuy && matchesFilters(game, filters, 'available')
  ).length
  return counts
}

export function sortVideogames(
  games: VideogameWithMeta[],
  { field, direction }: VideogameSort
): VideogameWithMeta[] {
  const sign = direction === 'asc' ? 1 : -1
  return [...games].sort((a, b) => {
    switch (field) {
      case 'title':
        return sign * a.title.localeCompare(b.title)
      case 'date':
        // Los anunciados sin fecha siempre al final
        if (!a.firstReleaseDate || !b.firstReleaseDate) {
          return Number(!a.firstReleaseDate) - Number(!b.firstReleaseDate)
        }
        return sign * a.firstReleaseDate.localeCompare(b.firstReleaseDate)
      case 'score':
        // Los juegos sin nota siempre al final
        if (a.bestScore === null || b.bestScore === null) {
          return Number(a.bestScore === null) - Number(b.bestScore === null)
        }
        return sign * (a.bestScore - b.bestScore)
    }
  })
}
