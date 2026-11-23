import { describe, it, expect } from 'vitest'
import { announcedEntries, releaseEntries, splitReleases } from './releases.mjs'

const empty = { products: [], videogames: [], merchandise: [], novels: [], rpgBooks: [] }
const today = '2026-11-23'

const novel = (editions) => ({ slug: 'novela', title: 'Novela', editions })
const rpgBook = (system, editions) => ({ slug: 'libro', system, title: 'Libro', editions })
const product = (publications) => ({ product: { code: 'DSBaP', publications }, folder: '2024' })

describe('ediciones con fecha', () => {
  it('cuenta una vez los formatos de una edición del mismo día, con su sección e idioma', () => {
    const entries = releaseEntries({
      ...empty,
      novels: [
        novel([
          {
            language: 'castellano',
            title: 'La novela',
            publisher: 'Minotauro',
            format: 'paperback',
            date: '2026-11-18',
          },
          {
            language: 'castellano',
            title: 'La novela',
            publisher: 'Minotauro',
            format: 'ebook',
            date: '2026-11-18',
          },
        ]),
      ],
    })
    expect(entries).toEqual([
      expect.objectContaining({
        name: 'La novela',
        date: '2026-11-18',
        section: 'novelas',
        language: 'castellano',
        path: '/novela/novela',
      }),
    ])
  })

  it('separa las ediciones anteriores de D&D del resto de juegos de rol', () => {
    const entries = releaseEntries({
      ...empty,
      rpgSystems: [
        { slug: 'dnd-3-5', name: 'D&D 3.5', official: true },
        { slug: 'pathfinder-2e', name: 'Pathfinder 2E' },
      ],
      rpgBooks: [
        rpgBook('dnd-3-5', [{ language: 'english', publisher: 'Wizards', date: '2003-07' }]),
        rpgBook('pathfinder-2e', [{ language: 'castellano', publisher: 'Devir', date: '2026-09' }]),
      ],
    })
    expect(entries.map((e) => [e.section, e.path, e.date, e.context])).toEqual([
      ['rol', '/rol/pathfinder-2e/libro', '2026-09-01', 'Pathfinder 2E'],
      ['ediciones', '/ediciones/dnd-3-5/libro', '2003-07-01', 'D&D 3.5'],
    ])
  })

  it('cuenta las fechas de mes desde el día 1, incluye las futuras y deja fuera las de solo año', () => {
    const entries = releaseEntries({
      ...empty,
      novels: [
        novel([
          { language: 'english', publisher: 'A', date: '2027-02' },
          { language: 'castellano', publisher: 'B', date: '2027' },
        ]),
      ],
    })
    expect(entries.map((e) => [e.date, e.monthOnly])).toEqual([['2027-02-01', true]])
  })

  it('los videojuegos no llevan idioma', () => {
    const [entry] = releaseEntries({
      ...empty,
      videogames: [
        {
          slug: 'juego',
          title: 'Juego',
          releases: [{ platform: 'pc_windows', date: '2026-10-01' }],
        },
      ],
    })
    expect(entry.section).toBe('videojuegos')
    expect(entry).not.toHaveProperty('language')
  })
})

describe('anunciados', () => {
  it('incluye los libros oficiales y los videojuegos anunciados sin fecha', () => {
    const announced = announcedEntries(
      {
        ...empty,
        products: [product([{ language: 'english', title: 'Dark Sun: Blood and Power' }])],
        videogames: [
          {
            slug: 'warlock',
            title: 'Warlock',
            status: 'announced',
            releases: [{ platform: 'pc_windows' }, { platform: 'ps5' }],
          },
        ],
      },
      today
    )
    expect(announced.map((e) => [e.name, e.section, e.year])).toEqual([
      ['Dark Sun: Blood and Power', 'libros', undefined],
      ['Warlock', 'videojuegos', undefined],
    ])
  })

  it('no cuenta como anuncio una edición sin fecha de otro juego de rol', () => {
    const announced = announcedEntries(
      {
        ...empty,
        rpgBooks: [rpgBook('pathfinder-1e', [{ language: 'castellano', publisher: 'Devir' }])],
      },
      today
    )
    expect(announced).toEqual([])
  })

  it('incluye con su año las ediciones con solo un año posterior al actual', () => {
    const announced = announcedEntries(
      {
        ...empty,
        rpgBooks: [
          rpgBook('daggerheart', [{ language: 'castellano', publisher: 'Devir', date: '2027' }]),
          rpgBook('otro', [{ language: 'castellano', publisher: 'Devir', date: '2026' }]),
        ],
      },
      today
    )
    expect(announced).toEqual([
      expect.objectContaining({ section: 'rol', language: 'castellano', year: '2027' }),
    ])
  })

  it('el videojuego anunciado solo con el año sale con ese año', () => {
    const [entry] = announcedEntries(
      {
        ...empty,
        videogames: [
          {
            slug: 'w',
            title: 'W',
            status: 'announced',
            releases: [{ platform: 'ps5', date: '2027' }],
          },
        ],
      },
      today
    )
    expect(entry.year).toBe('2027')
  })
})

describe('recientes y próximas', () => {
  const at = (date) => ({ date, title: date })
  const entries = [
    at('2027-01-10'),
    at('2026-11-24'),
    at('2026-11-23'),
    at('2026-08-25'),
    at('2026-08-24'),
  ]

  it('hoy y hace 90 días cuentan como recientes; 91 días no', () => {
    expect(splitReleases(entries, today).recent.map((e) => e.date)).toEqual([
      '2026-11-23',
      '2026-08-25',
    ])
  })

  it('las próximas van de la más cercana a la más lejana', () => {
    expect(splitReleases(entries, today).upcoming.map((e) => e.date)).toEqual([
      '2026-11-24',
      '2027-01-10',
    ])
  })
})
