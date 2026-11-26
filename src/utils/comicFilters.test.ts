import { describe, expect, it } from 'vitest'
import type { ComicSummary } from '@/types/comic'
import {
  activeFilterCount,
  filterComics,
  getComicFacetCounts,
  NO_FILTERS,
  sortComics,
} from './comicFilters'
import { eraOf, issueCountLabel, publisherGroup } from './comicTranslations'

const comic = (slug: string, extra: Partial<ComicSummary> = {}): ComicSummary => ({
  slug,
  title: slug,
  spanishTitle: null,
  publisher: 'IDW Publishing',
  setting: 'forgotten_realms',
  kind: 'limited_series',
  date: '2021-10',
  years: '2021',
  issue_count: 5,
  announced: false,
  thumbnail: null,
  spanish: 'none',
  availableToBuy: false,
  continuedBy: null,
  searchText: slug,
  ...extra,
})

const comics = [
  comic('Mindbreaker', { searchText: 'mindbreaker | jim zub', availableToBuy: true }),
  comic('Dragonlance', {
    publisher: 'DC Comics',
    setting: 'dragonlance',
    date: '1988-11',
    spanish: 'spain',
  }),
  comic('Rick and Morty', { publisher: 'IDW / Oni Press', setting: 'none', date: '2018-11' }),
]

const titles = (list: ComicSummary[]) => list.map((c) => c.title)

describe('filterComics', () => {
  it('sin filtros devuelve todo', () => {
    expect(filterComics(comics, NO_FILTERS)).toHaveLength(3)
  })

  it('filtra por editorial agrupada, mundo, época, castellano y venta', () => {
    expect(titles(filterComics(comics, { ...NO_FILTERS, publishers: ['IDW'] }))).toEqual([
      'Mindbreaker',
      'Rick and Morty',
    ])
    expect(titles(filterComics(comics, { ...NO_FILTERS, settings: ['dragonlance'] }))).toEqual([
      'Dragonlance',
    ])
    expect(titles(filterComics(comics, { ...NO_FILTERS, eras: ['2010s'] }))).toEqual([
      'Rick and Morty',
    ])
    expect(titles(filterComics(comics, { ...NO_FILTERS, spainOnly: true }))).toEqual([
      'Dragonlance',
    ])
    expect(titles(filterComics(comics, { ...NO_FILTERS, availableOnly: true }))).toEqual([
      'Mindbreaker',
    ])
  })

  it('busca por autor sin distinguir mayúsculas', () => {
    expect(titles(filterComics(comics, { ...NO_FILTERS, searchQuery: 'Jim Zub' }))).toEqual([
      'Mindbreaker',
    ])
  })
})

describe('sortComics', () => {
  it('ordena por fecha en los dos sentidos y por título', () => {
    expect(titles(sortComics(comics, 'date-desc'))).toEqual([
      'Mindbreaker',
      'Rick and Morty',
      'Dragonlance',
    ])
    expect(titles(sortComics(comics, 'date-asc'))[0]).toBe('Dragonlance')
    expect(titles(sortComics(comics, 'title-asc'))[0]).toBe('Dragonlance')
  })
})

describe('getComicFacetCounts', () => {
  it('cuenta cada opción ignorando su propio filtro', () => {
    const counts = getComicFacetCounts(comics, { ...NO_FILTERS, publishers: ['DC'] })
    expect(counts.publishers).toEqual({ IDW: 2, DC: 1 })
    expect(counts.settings).toEqual({ dragonlance: 1 })
    expect(counts.spain).toBe(1)
  })
})

describe('utilidades', () => {
  it('épocas, editoriales y recuento de números', () => {
    expect(eraOf('1988-11')).toBe('1980s-1990s')
    expect(eraOf('2026-01')).toBe('2020s')
    expect(publisherGroup('IDW / Oni Press')).toBe('IDW')
    expect(publisherGroup('Dark Horse Comics')).toBe('Dark Horse')
    expect(issueCountLabel(comics[0])).toBe('5 números')
    expect(issueCountLabel({ issue_count: 1, announced: false, kind: 'graphic_novel' })).toBeNull()
    expect(issueCountLabel({ issue_count: 6, announced: true, kind: 'ongoing' })).toBe('Anunciada')
    expect(activeFilterCount({ ...NO_FILTERS, eras: ['2020s'], spainOnly: true })).toBe(2)
  })
})
