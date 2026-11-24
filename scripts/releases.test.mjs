import { describe, it, expect } from 'vitest'
import { announcedEntries, describeFicha, releaseEntries, splitReleases } from './releases.mjs'

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

describe('fichas de data/', () => {
  const systems = [
    { slug: 'dnd-3-5', name: 'D&D 3.5', official: true },
    { slug: 'pathfinder-2e', name: 'Pathfinder 2E' },
    { slug: 'dnd-5e-2024', name: 'D&D 5.5E', official: true, official_catalog: '/2024' },
  ]

  it('reconoce cada tipo de ficha por su ruta y deja fuera los demás archivos', () => {
    expect(describeFicha('data/schemas/product.jsonschema', {})).toBeNull()
    expect(describeFicha('data/novels/series.json', [])).toBeNull()
    expect(
      describeFicha('data/2024/products/01_books/05_x/004_dsbap.json', {
        code: 'DSBaP',
        publications: [{ title: 'Dark Sun: Blood and Power', language: 'english' }],
      })
    ).toEqual({
      section: 'libros',
      path: '/producto/2024/dsbap',
      name: 'Dark Sun: Blood and Power',
      date: null,
    })
  })

  it('da la fecha más reciente de sus ediciones', () => {
    const ficha = describeFicha('data/novels/forgotten_realms/novela.json', {
      slug: 'novela',
      title: 'Novela',
      editions: [
        { language: 'english', publisher: 'A', date: '1990-05' },
        { language: 'castellano', publisher: 'B', date: '2026-11-18' },
      ],
    })
    expect(ficha).toEqual({
      section: 'novelas',
      path: '/novela/novela',
      name: 'Novela',
      date: '2026-11-18',
    })
  })

  it('los libros y sistemas de rol van a su sección, y los de D&D con catálogo no cuentan', () => {
    expect(
      describeFicha(
        'data/rol/books/dnd-3-5/libro.json',
        {
          slug: 'libro',
          system: 'dnd-3-5',
          title: 'Libro',
          editions: [{ language: 'english', publisher: 'W', date: '2003' }],
        },
        systems
      )
    ).toEqual({
      section: 'ediciones',
      path: '/ediciones/dnd-3-5/libro',
      name: 'Libro',
      date: '2003',
      context: 'D&D 3.5',
    })
    expect(describeFicha('data/rol/systems/pathfinder-2e.json', systems[1])).toMatchObject({
      section: 'rol',
      path: '/rol/pathfinder-2e',
    })
    expect(describeFicha('data/rol/systems/dnd-5e-2024.json', systems[2])).toBeNull()
  })
})

describe('cómics', () => {
  const comic = {
    slug: 'mindbreaker',
    title: 'Dungeons & Dragons: Mindbreaker',
    publisher: 'IDW Publishing',
    issues: [{ number: '1', date: '2021-10-20' }, { number: '2' }],
    editions: [
      {
        language: 'castellano',
        spain: true,
        title: 'Rompementes',
        publisher: 'Norma',
        date: '2023-05',
        format: 'paperback',
        isbn13: 9788467900000,
      },
      {
        language: 'castellano',
        spain: true,
        publisher: 'Zinco',
        format: 'issue',
        issues: [{ number: '1', date: '1990-07' }],
      },
    ],
  }

  it('cuenta los números con fecha, los tomos y las grapas, con la sección «comics»', () => {
    const entries = releaseEntries({ ...empty, comics: [comic] })
    expect(entries.map((e) => [e.name, e.section, e.language])).toEqual([
      ['Rompementes', 'comics', 'castellano'],
      ['Dungeons & Dragons: Mindbreaker #1', 'comics', 'english'],
      ['Dungeons & Dragons: Mindbreaker #1', 'comics', 'castellano'],
    ])
    expect(entries[0].path).toBe('/comic/mindbreaker')
  })

  it('describe la ficha de un cómic y no la de los tomos de varias series', () => {
    expect(describeFicha('data/comics/idw/mindbreaker.json', comic)).toMatchObject({
      section: 'comics',
      path: '/comic/mindbreaker',
      name: 'Dungeons & Dragons: Mindbreaker',
      date: '2023-05',
    })
    expect(describeFicha('data/comics/collections.json', [])).toBeNull()
  })
})
