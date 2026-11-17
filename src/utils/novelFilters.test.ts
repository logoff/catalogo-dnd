import { describe, it, expect, beforeEach } from 'vitest'
import type { Novel } from '@/types/novel'
import { enrichNovel, summarize } from '@/utils/novels'
import { NOVELS_PAGE_SIZE, useNovelStore } from '@/store/novelStore'
import { filterNovels, getNovelFacetCounts, sortNovels, type NovelFilters } from './novelFilters'

const link = [{ store: 'amazon' as const, url: 'https://www.amazon.es/dp/X/' }]
const english = {
  language: 'english' as const,
  country: 'us' as const,
  publisher: 'TSR',
  format: 'paperback' as const,
}
const spanish = (title: string) => ({
  language: 'castellano' as const,
  spain: true,
  title,
  publisher: 'Timun Mas',
  format: 'paperback' as const,
})

const novel = (slug: string, extra: Partial<Novel>) =>
  summarize(
    enrichNovel(
      {
        slug,
        title: slug,
        authors: ['Margaret Weis', 'Tracy Hickman'],
        setting: 'dragonlance',
        kind: 'novel',
        description: 'a\n\nb',
        source: 'https://example.com/',
        editions: [english],
        ...extra,
      },
      []
    )
  )

const novels = [
  novel('Dragons of Autumn Twilight', {
    series: { id: 'chronicles', number: 1 },
    date: '1984-11',
    editions: [english, spanish('El retorno de los dragones')],
  }),
  novel('Dragons of Winter Night', {
    series: { id: 'chronicles', number: 2 },
    date: '1985-07',
    editions: [{ ...english, purchase_links: link }],
  }),
  novel('Time of the Twins', { series: { id: 'legends', number: 1 }, date: '1986-02' }),
  novel('The Legend of Huma', { date: '1988-02' }),
  novel('Homeland', {
    setting: 'forgotten_realms',
    authors: ['R. A. Salvatore'],
    series: { id: 'dark-elf', number: 1 },
    date: '1990-08',
  }),
]

const noFilters: NovelFilters = {
  searchQuery: '',
  settings: [],
  series: [],
  spanishOnly: false,
  availableOnly: false,
}

const titles = (list: { title: string }[]) => list.map((n) => n.title)

describe('filterNovels', () => {
  it('filtra por mundo y por serie, y combina los filtros', () => {
    expect(filterNovels(novels, { ...noFilters, settings: ['forgotten_realms'] })).toHaveLength(1)
    expect(
      titles(
        filterNovels(novels, { ...noFilters, settings: ['dragonlance'], series: ['chronicles'] })
      )
    ).toEqual(['Dragons of Autumn Twilight', 'Dragons of Winter Night'])
  })

  it('filtra por edición en castellano y por novelas a la venta', () => {
    expect(titles(filterNovels(novels, { ...noFilters, spanishOnly: true }))).toEqual([
      'Dragons of Autumn Twilight',
    ])
    expect(titles(filterNovels(novels, { ...noFilters, availableOnly: true }))).toEqual([
      'Dragons of Winter Night',
    ])
  })

  it('busca por título en castellano y por autor, sin tildes ni mayúsculas', () => {
    expect(
      titles(filterNovels(novels, { ...noFilters, searchQuery: 'El Retorno de los dragones' }))
    ).toEqual(['Dragons of Autumn Twilight'])
    expect(titles(filterNovels(novels, { ...noFilters, searchQuery: 'salvatore' }))).toEqual([
      'Homeland',
    ])
  })
})

describe('getNovelFacetCounts', () => {
  it('solo cuenta las series de los mundos elegidos', () => {
    const counts = getNovelFacetCounts(novels, { ...noFilters, settings: ['forgotten_realms'] })
    expect(counts.series).toEqual({ 'dark-elf': 1 })
    // El recuento de mundos ignora el propio filtro de mundo
    expect(counts.settings).toEqual({ dragonlance: 4, forgotten_realms: 1 })
  })

  it('cuenta las novelas en castellano y a la venta con el resto de filtros', () => {
    const counts = getNovelFacetCounts(novels, { ...noFilters, series: ['chronicles'] })
    expect(counts.spanish).toBe(1)
    expect(counts.available).toBe(1)
  })
})

describe('sortNovels', () => {
  it('ordena por fecha en los dos sentidos y por título', () => {
    expect(titles(sortNovels(novels, { field: 'date', direction: 'desc' }))[0]).toBe('Homeland')
    expect(titles(sortNovels(novels, { field: 'date', direction: 'asc' }))[0]).toBe(
      'Dragons of Autumn Twilight'
    )
    expect(titles(sortNovels(novels, { field: 'title', direction: 'asc' }))[0]).toBe(
      'Dragons of Autumn Twilight'
    )
  })

  it('en orden de lectura agrupa cada serie y sigue su número, con las sueltas por fecha', () => {
    const shuffled = [novels[4], novels[1], novels[3], novels[2], novels[0]]
    expect(titles(sortNovels(shuffled, { field: 'reading', direction: 'asc' }))).toEqual([
      'Dragons of Autumn Twilight',
      'Dragons of Winter Night',
      'Time of the Twins',
      'The Legend of Huma',
      'Homeland',
    ])
  })
})

describe('novelStore', () => {
  beforeEach(() => useNovelStore.getState().clearFilters())

  it('vuelve a la primera tanda al cambiar los filtros', () => {
    const store = useNovelStore.getState()
    store.showMore()
    expect(useNovelStore.getState().visibleCount).toBe(NOVELS_PAGE_SIZE * 2)
    store.toggleSetting('dragonlance')
    expect(useNovelStore.getState().visibleCount).toBe(NOVELS_PAGE_SIZE)
  })

  it('aplica los filtros de la dirección sustituyendo a los que hubiera', () => {
    const store = useNovelStore.getState()
    store.setSpanishOnly(true)
    store.applyUrlFilters({ settings: ['dragonlance'], series: ['chronicles'] })
    const state = useNovelStore.getState()
    expect([state.settings, state.series, state.spanishOnly]).toEqual([
      ['dragonlance'],
      ['chronicles'],
      false,
    ])
    expect(state.getActiveFilterCount()).toBe(2)
  })
})
