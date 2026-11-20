import type { RpgBookSummary } from '@/types/rpg'
import { normalize } from './videogameFilters'
import { compareBooks } from './rpg'

export interface RpgFilters {
  searchQuery: string
  // Slug del sistema, o vacío para todos
  system: string
  // Slug de la licencia (heredada del sistema o propia del libro), o vacío para todas
  license: string
  spanishOnly: boolean
}

export type RpgSort = 'newest' | 'oldest' | 'title'

export function filterBooks(books: RpgBookSummary[], filters: RpgFilters): RpgBookSummary[] {
  const query = normalize(filters.searchQuery.trim())
  return books.filter(
    (book) =>
      (!query || book.searchText.includes(query)) &&
      (!filters.system || book.system === filters.system) &&
      (!filters.license || book.licenses.includes(filters.license)) &&
      (!filters.spanishOnly || book.spanish)
  )
}

const titleOf = (book: RpgBookSummary) => book.title

export function sortBooks(books: RpgBookSummary[], sort: RpgSort): RpgBookSummary[] {
  const sorted = [...books]
  if (sort === 'title') return sorted.sort((a, b) => titleOf(a).localeCompare(titleOf(b), 'es'))
  sorted.sort(compareBooks)
  // Los que no tienen fecha van siempre al final
  return sort === 'oldest'
    ? [...sorted.filter((b) => b.latestDate).reverse(), ...sorted.filter((b) => !b.latestDate)]
    : sorted
}
