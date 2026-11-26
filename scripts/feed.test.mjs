import { describe, it, expect } from 'vitest'
import { atomFeed, feedEntries, FEED_SIZE } from './feed.mjs'

const empty = { products: [], videogames: [], merchandise: [], novels: [], rpgBooks: [] }
const today = '2026-11-19'

describe('feed de novedades', () => {
  it('anuncia los estrenos de cine y series, con su país y su medio', () => {
    const entries = feedEntries(
      {
        ...empty,
        screenWorks: [
          {
            slug: 'honor-among-thieves',
            kind: 'film',
            official: true,
            title: 'Honor Among Thieves',
            title_es: 'Honor entre ladrones',
            releases: [
              { country: 'us', medium: 'cinema', date: '2023-03-31' },
              { country: 'es', medium: 'cinema', date: '2023-03-31' },
              { country: 'es', medium: 'tv', date: '2024' },
            ],
          },
        ],
      },
      today
    )
    expect(entries.map((e) => [e.title, e.summary, e.path])).toEqual([
      [
        'Honor entre ladrones se estrena en cines en EE. UU.',
        'Película oficial de D&D.',
        '/cine-y-series/honor-among-thieves',
      ],
      [
        'Honor entre ladrones se estrena en cines en España',
        'Película oficial de D&D.',
        '/cine-y-series/honor-among-thieves',
      ],
    ])
  })

  it('reúne las ediciones con fecha de todas las secciones, de la más reciente a la más antigua', () => {
    const entries = feedEntries(
      {
        ...empty,
        products: [
          {
            folder: '2024',
            product: {
              code: 'PHB',
              publications: [
                { title: "Player's Handbook", language: 'english', date: '2024-09-17' },
                { title: 'Manual del Jugador', language: 'castellano', date: '2025-02' },
              ],
            },
          },
        ],
        rpgBooks: [
          {
            slug: 'player-core',
            system: 'pathfinder-2e',
            title: 'Player Core',
            editions: [
              {
                language: 'castellano',
                title: 'Manual de juego',
                publisher: 'Devir',
                date: '2025-06-10',
              },
            ],
          },
        ],
      },
      today
    )
    expect(entries.map((e) => [e.date, e.title, e.path])).toEqual([
      ['2025-06-10', 'Manual de juego sale en castellano', '/rol/pathfinder-2e/player-core'],
      ['2025-02-01', 'Manual del Jugador sale en castellano', '/producto/2024/phb'],
      ['2024-09-17', "Player's Handbook sale en inglés", '/producto/2024/phb'],
    ])
  })

  it('deja fuera las fechas futuras y las que solo dan el año', () => {
    const entries = feedEntries(
      {
        ...empty,
        novels: [
          {
            slug: 'novela',
            title: 'Novela',
            editions: [
              { language: 'english', publisher: 'TSR', date: '1984' },
              { language: 'castellano', publisher: 'Minotauro', date: '2027-01-10' },
            ],
          },
        ],
      },
      today
    )
    expect(entries).toEqual([])
  })

  it('junta los formatos de una misma edición que salen el mismo día', () => {
    const edition = {
      language: 'castellano',
      title: 'Condenación',
      publisher: 'Minotauro',
      date: '2026-11-18',
    }
    const entries = feedEntries(
      {
        ...empty,
        novels: [
          {
            slug: 'condemnation',
            title: 'Condemnation',
            editions: [
              { ...edition, format: 'paperback' },
              { ...edition, format: 'ebook' },
            ],
          },
        ],
      },
      today
    )
    expect(entries).toHaveLength(1)
  })

  it(`lleva como mucho ${FEED_SIZE} entradas`, () => {
    const games = Array.from({ length: FEED_SIZE + 10 }, (_, i) => ({
      slug: `juego-${i}`,
      title: `Juego ${i}`,
      releases: [{ platform: 'pc_windows', date: '2020-01-01' }],
    }))
    expect(feedEntries({ ...empty, videogames: games }, today)).toHaveLength(FEED_SIZE)
  })

  it('genera un Atom válido con los enlaces marcados para la analítica y el texto escapado', () => {
    const xml = atomFeed(
      [
        {
          date: '2025-06-10',
          title: 'Dungeons & Dragons <nuevo>',
          summary: 'Libro.',
          path: '/producto/2024/phb',
          key: 'castellano-1',
        },
      ],
      '2025-06-10'
    )
    expect(xml).toContain('<feed xmlns="http://www.w3.org/2005/Atom" xml:lang="es">')
    expect(xml).toContain('<title>Dungeons &amp; Dragons &lt;nuevo&gt;</title>')
    expect(xml).toContain(
      '<link href="https://catalogodnd.es/producto/2024/phb?utm_source=rss&amp;utm_medium=feed&amp;utm_campaign=novedades"/>'
    )
    expect(xml).toContain('<updated>2025-06-10T00:00:00Z</updated>')
  })
})
