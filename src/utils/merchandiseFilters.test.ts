import { describe, it, expect, beforeEach } from 'vitest'
import type { Merchandise } from '@/types/merchandise'
import { enrichMerchandise } from '@/services/merchandiseLoader'
import { useMerchandiseStore } from '@/store/merchandiseStore'
import {
  filterMerchandise,
  getMerchandiseFacetCounts,
  sortMerchandise,
  type MerchandiseFilters,
} from './merchandiseFilters'

const item = (slug: string, extra: Partial<Merchandise>) =>
  enrichMerchandise({
    slug,
    title: slug,
    group: 'books',
    kind: 'cookbook',
    manufacturer: 'Ten Speed Press',
    description: 'a\n\nb',
    source: 'https://example.com/',
    editions: [{ language: 'english' }],
    images: ['/images/merchandising/x/0.jpg'],
    ...extra,
  })

const link = [{ store: 'amazon' as const, url: 'https://www.amazon.es/dp/X/' }]

const items = [
  item("Heroes' Feast", {
    title_es: 'Festín de héroes',
    date: '2020-10-27',
    editions: [
      { language: 'english', purchase_links: link },
      { language: 'castellano', spain: true },
    ],
  }),
  item('Legend of Drizzt', {
    kind: 'guide_book',
    manufacturer: 'DK',
    date: '2023',
    editions: [{ language: 'castellano', spain: false, purchase_links: link }],
  }),
  item('LEGO 21348', { group: 'figures', kind: 'lego', manufacturer: 'LEGO', date: '2024-04-01' }),
  item('Dungeon Mayhem', { group: 'games', kind: 'card_game', manufacturer: 'Wizards' }),
]

const noFilters: MerchandiseFilters = {
  searchQuery: '',
  groups: [],
  kinds: [],
  spainOnly: false,
  availableOnly: false,
}

const titles = (list: { title: string }[]) => list.map((i) => i.title)

describe('filterMerchandise', () => {
  it('sin filtros devuelve todo', () => {
    expect(filterMerchandise(items, noFilters)).toHaveLength(4)
  })

  it('filtra por grupo y tipo, y los combina', () => {
    expect(titles(filterMerchandise(items, { ...noFilters, groups: ['figures'] }))).toEqual([
      'LEGO 21348',
    ])
    expect(
      titles(filterMerchandise(items, { ...noFilters, groups: ['books'], kinds: ['guide_book'] }))
    ).toEqual(['Legend of Drizzt'])
  })

  it('el castellano solo cuenta si la edición salió en España', () => {
    expect(titles(filterMerchandise(items, { ...noFilters, spainOnly: true }))).toEqual([
      "Heroes' Feast",
    ])
  })

  it('filtra por artículos a la venta', () => {
    expect(titles(filterMerchandise(items, { ...noFilters, availableOnly: true }))).toEqual([
      "Heroes' Feast",
      'Legend of Drizzt',
    ])
  })

  it('busca sin tildes en el título en castellano y en el fabricante', () => {
    expect(titles(filterMerchandise(items, { ...noFilters, searchQuery: 'festin' }))).toEqual([
      "Heroes' Feast",
    ])
    expect(titles(filterMerchandise(items, { ...noFilters, searchQuery: 'lego' }))).toEqual([
      'LEGO 21348',
    ])
  })
})

describe('getMerchandiseFacetCounts', () => {
  it('cuenta cada opción con el resto de filtros activos', () => {
    const counts = getMerchandiseFacetCounts(items, { ...noFilters, groups: ['books'] })
    // El recuento de grupos ignora el propio filtro de grupo
    expect(counts.groups).toEqual({ books: 2, figures: 1, games: 1 })
    expect(counts.kinds).toEqual({ cookbook: 1, guide_book: 1 })
    expect(counts.spain).toBe(1)
    expect(counts.available).toBe(2)
  })
})

describe('sortMerchandise', () => {
  it('ordena por fecha en los dos sentidos, con los que no tienen fecha al final', () => {
    expect(titles(sortMerchandise(items, { field: 'date', direction: 'desc' }))).toEqual([
      'LEGO 21348',
      'Legend of Drizzt',
      "Heroes' Feast",
      'Dungeon Mayhem',
    ])
    expect(titles(sortMerchandise(items, { field: 'date', direction: 'asc' }))).toEqual([
      "Heroes' Feast",
      'Legend of Drizzt',
      'LEGO 21348',
      'Dungeon Mayhem',
    ])
  })

  it('ordena por título', () => {
    expect(titles(sortMerchandise(items, { field: 'title', direction: 'asc' }))).toEqual([
      'Dungeon Mayhem',
      "Heroes' Feast",
      'Legend of Drizzt',
      'LEGO 21348',
    ])
  })
})

describe('useMerchandiseStore', () => {
  beforeEach(() => useMerchandiseStore.getState().clearFilters())

  it('cuenta los filtros activos y los quita', () => {
    const store = useMerchandiseStore.getState()
    store.toggleGroup('books')
    store.toggleKind('cookbook')
    store.setSpainOnly(true)
    store.setSearchQuery('festin')
    expect(useMerchandiseStore.getState().getActiveFilterCount()).toBe(4)
    useMerchandiseStore.getState().clearFilters()
    expect(useMerchandiseStore.getState().getActiveFilterCount()).toBe(0)
  })

  it('ordena por defecto del más reciente al más antiguo', () => {
    expect(useMerchandiseStore.getState().sort).toEqual({ field: 'date', direction: 'desc' })
  })
})
