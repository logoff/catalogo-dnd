import { describe, it, expect, beforeEach } from 'vitest'
import type { Videogame } from '@/types/videogame'
import { enrichVideogame } from '@/services/videogameLoader'
import { useVideogameStore } from '@/store/videogameStore'
import {
  filterVideogames,
  getVideogameFacetCounts,
  sortVideogames,
  type VideogameFilters,
} from './videogameFilters'

const game = (slug: string, extra: Partial<Videogame>) =>
  enrichVideogame({
    slug,
    title: slug,
    description: 'a\n\nb',
    developers: ['X'],
    publishers: ['Y'],
    genres: ['rpg'],
    releases: [{ platform: 'pc_windows' }],
    ...extra,
  })

const link = [{ store: 'gog' as const, url: 'https://www.gog.com/en/game/x' }]

const games = [
  game('Pool of Radiance', {
    setting: 'forgotten_realms',
    releases: [
      { platform: 'c64', date: '1988-06' },
      {
        platform: 'pc_windows',
        date: '2022',
        spanish: { interface: false, subtitles: false, audio: false },
      },
    ],
  }),
  game("Baldur's Gate", {
    title_es: 'Puertas de Baldur',
    setting: 'forgotten_realms',
    releases: [
      {
        platform: 'pc_windows',
        date: '1998-12-21',
        spanish: { interface: true, subtitles: true, audio: false },
        purchase_links: link,
      },
    ],
    reviews: [{ source: 'metacritic', score: 91, scale: 100, url: 'https://example.com/1' }],
  }),
  game('Tower of Doom', {
    setting: 'mystara',
    genres: ['beat_em_up'],
    releases: [{ platform: 'arcade', date: '1994' }],
  }),
  game('Warlock', {
    status: 'announced',
    genres: ['action'],
    releases: [{ platform: 'ps5' }],
  }),
  game('Baldur’s Gate 3', {
    setting: 'forgotten_realms',
    releases: [
      {
        platform: 'pc_windows',
        date: '2023-08-03',
        spanish: { interface: true, subtitles: true, audio: true },
        purchase_links: link,
      },
    ],
    reviews: [{ source: 'vandal', score: 9.6, scale: 10, url: 'https://example.com/2' }],
  }),
]

const none: VideogameFilters = {
  searchQuery: '',
  platforms: [],
  decades: [],
  spanish: [],
  settings: [],
  genres: [],
  availableOnly: false,
}

const slugs = (list: typeof games) => list.map((g) => g.slug)

describe('filterVideogames', () => {
  it('filtra por cada faceta', () => {
    expect(slugs(filterVideogames(games, { ...none, platforms: ['arcade'] }))).toEqual([
      'Tower of Doom',
    ])
    expect(slugs(filterVideogames(games, { ...none, decades: [1980] }))).toEqual([
      'Pool of Radiance',
    ])
    expect(slugs(filterVideogames(games, { ...none, settings: ['mystara'] }))).toEqual([
      'Tower of Doom',
    ])
    expect(slugs(filterVideogames(games, { ...none, genres: ['action'] }))).toEqual(['Warlock'])
    // Sin castellano confirmado cuenta como solo en inglés
    expect(slugs(filterVideogames(games, { ...none, spanish: ['none'] }))).toEqual([
      'Pool of Radiance',
      'Tower of Doom',
      'Warlock',
    ])
  })

  it('combina facetas con Y y opciones de una faceta con O', () => {
    const result = filterVideogames(games, {
      ...none,
      spanish: ['full', 'text'],
      availableOnly: true,
    })
    expect(slugs(result)).toEqual(["Baldur's Gate", 'Baldur’s Gate 3'])
    expect(filterVideogames(games, { ...none, spanish: ['full'], decades: [1990] })).toEqual([])
  })

  it('busca por título original y en castellano sin tildes ni mayúsculas', () => {
    expect(slugs(filterVideogames(games, { ...none, searchQuery: 'puertas de baldúr' }))).toEqual([
      "Baldur's Gate",
    ])
    expect(slugs(filterVideogames(games, { ...none, searchQuery: 'TOWER' }))).toEqual([
      'Tower of Doom',
    ])
  })
})

describe('getVideogameFacetCounts', () => {
  it('cuenta cada opción con el resto de filtros', () => {
    const counts = getVideogameFacetCounts(games, { ...none, settings: ['forgotten_realms'] })
    expect(counts.decades).toEqual({ 1980: 1, 1990: 1, 2020: 1 })
    expect(counts.settings).toEqual({ forgotten_realms: 3, mystara: 1 })
    expect(counts.available).toBe(2)
  })
})

describe('sortVideogames', () => {
  it('por fecha, con los anunciados sin fecha al final en los dos sentidos', () => {
    expect(slugs(sortVideogames(games, { field: 'date', direction: 'asc' }))).toEqual([
      'Pool of Radiance',
      'Tower of Doom',
      "Baldur's Gate",
      'Baldur’s Gate 3',
      'Warlock',
    ])
    expect(slugs(sortVideogames(games, { field: 'date', direction: 'desc' })).pop()).toBe('Warlock')
  })

  it('por nota normalizada, con los juegos sin nota al final', () => {
    const sorted = slugs(sortVideogames(games, { field: 'score', direction: 'desc' }))
    expect(sorted.slice(0, 2)).toEqual(['Baldur’s Gate 3', "Baldur's Gate"])
    expect(sortVideogames(games, { field: 'score', direction: 'asc' })[0].slug).toBe(
      "Baldur's Gate"
    )
  })

  it('por título', () => {
    expect(slugs(sortVideogames(games, { field: 'title', direction: 'asc' }))[0]).toBe(
      "Baldur's Gate"
    )
  })
})

describe('videogameStore', () => {
  const initial = useVideogameStore.getState()
  beforeEach(() => useVideogameStore.setState(initial, true))

  it('marca y desmarca filtros y los cuenta', () => {
    const store = useVideogameStore.getState()
    store.togglePlatform('pc_windows')
    store.toggleDecade(1990)
    store.setAvailableOnly(true)
    expect(useVideogameStore.getState().platforms).toEqual(['pc_windows'])
    expect(useVideogameStore.getState().getActiveFilterCount()).toBe(3)

    useVideogameStore.getState().togglePlatform('pc_windows')
    expect(useVideogameStore.getState().platforms).toEqual([])

    useVideogameStore.getState().clearFilters()
    expect(useVideogameStore.getState().getActiveFilterCount()).toBe(0)
  })

  it('arranca con los juegos del catálogo ordenados por fecha', () => {
    const { videogames, sort } = useVideogameStore.getState()
    expect(videogames.length).toBeGreaterThan(0)
    expect(sort).toEqual({ field: 'date', direction: 'asc' })
  })
})
