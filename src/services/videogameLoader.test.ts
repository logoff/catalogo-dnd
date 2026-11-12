import { describe, it, expect } from 'vitest'
import Ajv from 'ajv'
import addFormats from 'ajv-formats'
import schemaSource from '/data/schemas/videogame.jsonschema?raw'
import inventory from '/data/videogames/inventory.md?raw'
import type { Videogame } from '@/types/videogame'
import { getAllProducts } from './dataLoader'
import { enrichVideogame, getAllVideogames, getVideogameFiles } from './videogameLoader'

const ajv = new Ajv({ allErrors: true })
addFormats(ajv)
const validate = ajv.compile(JSON.parse(schemaSource))

// Imágenes de public/ con la ruta que usan los JSON (/images/…)
const publicImages = new Set(
  Object.keys(import.meta.glob('/public/images/videogames/**/*')).map((path) =>
    path.replace(/^\/public/, '')
  )
)

const minimalGame: Videogame = {
  slug: 'juego',
  title: 'Juego',
  description: 'Qué es.\n\nPara quién es.',
  developers: ['Estudio'],
  publishers: ['Editora'],
  genres: ['rpg'],
  releases: [{ platform: 'pc_windows', date: '2000-05-01' }],
}

describe('esquema de videojuego', () => {
  it('acepta un juego mínimo', () => {
    expect(validate(minimalGame)).toBe(true)
  })

  it('rechaza campos desconocidos, plataformas inexistentes y fechas mal formadas', () => {
    expect(validate({ ...minimalGame, extra: 1 })).toBe(false)
    expect(validate({ ...minimalGame, releases: [{ platform: 'dreamcast' }] })).toBe(false)
    expect(validate({ ...minimalGame, releases: [{ platform: 'nes', date: '1992-13' }] })).toBe(
      false
    )
  })

  it('acepta fechas parciales', () => {
    for (const date of ['1988', '1988-06', '1988-06-15']) {
      expect(validate({ ...minimalGame, releases: [{ platform: 'c64', date }] })).toBe(true)
    }
  })
})

describe('enrichVideogame', () => {
  it('toma la primera fecha, la década y las plataformas sin repetir', () => {
    const game = enrichVideogame({
      ...minimalGame,
      releases: [
        { platform: 'mac', date: '2000-07-17' },
        { platform: 'pc_windows', date: '1998-12-21' },
        { platform: 'pc_windows', date: '2012-11-28', edition: 'Enhanced Edition' },
      ],
    })
    expect(game.firstReleaseDate).toBe('1998-12-21')
    expect(game.decade).toBe(1990)
    expect(game.platforms).toEqual(['mac', 'pc_windows'])
  })

  it('ordena bien las fechas parciales', () => {
    const game = enrichVideogame({
      ...minimalGame,
      releases: [
        { platform: 'amiga', date: '1990' },
        { platform: 'c64', date: '1988-06' },
      ],
    })
    expect(game.firstReleaseDate).toBe('1988-06')
  })

  describe('resumen de castellano', () => {
    const withSpanish = (spanish: Videogame['releases'][number]['spanish']) =>
      enrichVideogame({ ...minimalGame, releases: [{ platform: 'pc_windows', spanish }] })
        .spanishSummary

    it('distingue voces, textos y solo inglés, y sin dato cuenta como solo inglés', () => {
      expect(withSpanish({ interface: true, subtitles: true, audio: true })).toBe('full')
      expect(withSpanish({ interface: true, subtitles: true, audio: false })).toBe('text')
      expect(withSpanish({ interface: false, subtitles: true, audio: false })).toBe('text')
      expect(withSpanish({ interface: false, subtitles: false, audio: false })).toBe('none')
      expect(withSpanish(undefined)).toBe('none')
    })

    it('una traducción de fans no cuenta como castellano', () => {
      expect(
        withSpanish({ interface: false, subtitles: false, audio: false, note: 'De fans' })
      ).toBe('none')
    })

    it('se queda con el mejor nivel de todos los lanzamientos', () => {
      const game = enrichVideogame({
        ...minimalGame,
        releases: [
          { platform: 'pc_dos' },
          { platform: 'pc_windows', spanish: { interface: false, subtitles: false, audio: false } },
          { platform: 'mac', spanish: { interface: true, subtitles: true, audio: false } },
        ],
      })
      expect(game.spanishSummary).toBe('text')
    })
  })

  it('normaliza la mejor nota a 100', () => {
    const game = enrichVideogame({
      ...minimalGame,
      reviews: [
        { source: 'metacritic', score: 78, scale: 100, url: 'https://example.com/a' },
        { source: 'vandal', score: 9.2, scale: 10, url: 'https://example.com/b' },
      ],
    })
    expect(game.bestScore).toBe(92)
    expect(enrichVideogame(minimalGame).bestScore).toBeNull()
  })

  it('está a la venta si algún lanzamiento no retirado tiene enlace de compra', () => {
    const link = { store: 'amazon' as const, url: 'https://www.amazon.es/dp/X' }
    expect(enrichVideogame(minimalGame).availableToBuy).toBe(false)
    expect(
      enrichVideogame({
        ...minimalGame,
        releases: [{ platform: 'pc_windows', purchase_links: [link], delisted: true }],
      }).availableToBuy
    ).toBe(false)
    expect(
      enrichVideogame({
        ...minimalGame,
        releases: [{ platform: 'pc_windows', purchase_links: [link] }],
      }).availableToBuy
    ).toBe(true)
  })
})

describe('datos de videojuegos', () => {
  const files = getVideogameFiles()
  const games = getAllVideogames()

  it('hay juegos', () => {
    expect(games.length).toBeGreaterThan(0)
  })

  it('todos cumplen el esquema', () => {
    const errors = Object.entries(files)
      .filter(([, game]) => !validate(game))
      .map(([path]) => `${path}: ${ajv.errorsText(validate.errors)}`)
    expect(errors).toEqual([])
  })

  it('el nombre del archivo es el slug', () => {
    const mismatched = Object.entries(files)
      .filter(([path, game]) => !path.endsWith(`/${game.slug}.json`))
      .map(([path]) => path)
    expect(mismatched).toEqual([])
  })

  it('los slugs no se repiten', () => {
    const slugs = games.map((g) => g.slug)
    expect(slugs.filter((s, i) => slugs.indexOf(s) !== i)).toEqual([])
  })

  it('todos tienen una descripción de dos párrafos', () => {
    const invalid = games
      .filter((g) => g.description.split('\n\n').filter((p) => p.trim()).length !== 2)
      .map((g) => g.slug)
    expect(invalid).toEqual([])
  })

  it('todos tienen al menos una imagen y todas existen', () => {
    const problems = games.flatMap((g) => {
      if (!g.images?.length) return [`${g.slug}: sin imagen`]
      return g.images.filter((img) => !publicImages.has(img)).map((img) => `${g.slug}: ${img}`)
    })
    expect(problems).toEqual([])
  })

  it('los enlaces de compra no llevan parámetros de afiliado', () => {
    const AFFILIATE_PARAMS = ['tag', 'aff', 'affiliate', 'ref', 'a', 'as', 'igr', 'partner']
    const withAffiliate = games.flatMap((g) =>
      g.releases
        .flatMap((r) => r.purchase_links ?? [])
        .filter((link) => {
          const url = new URL(link.url)
          return (
            url.hostname.includes('adtraction') ||
            AFFILIATE_PARAMS.some((param) => url.searchParams.has(param))
          )
        })
        .map((link) => `${g.slug}: ${link.url}`)
    )
    expect(withAffiliate).toEqual([])
  })

  it('los libros relacionados existen en el catálogo', () => {
    const products = getAllProducts()
    const missing = games.flatMap((g) =>
      (g.related_products ?? [])
        .filter(
          (rel) => !products.some((p) => p.primaryEdition === rel.edition && p.code === rel.code)
        )
        .map((rel) => `${g.slug}: ${rel.edition}/${rel.code}`)
    )
    expect(missing).toEqual([])
  })

  describe('inventario', () => {
    // Columna «Ficha» de las tablas del inventario: el slug, o «pendiente»
    const rows = inventory
      .split('\n')
      .filter((line) => /^\|\s*\d+\s*\|/.test(line))
      .map((line) => line.split('|').map((cell) => cell.trim()))
    const fichaIndex = (() => {
      const header = inventory
        .split('\n')
        .find((line) => line.startsWith('| #'))!
        .split('|')
        .map((cell) => cell.trim())
      return header.indexOf('Ficha')
    })()
    const inventorySlugs = rows.map((cells) => cells[fichaIndex]).filter((f) => f !== 'pendiente')

    it('cada ficha está en el inventario', () => {
      const missing = games.map((g) => g.slug).filter((slug) => !inventorySlugs.includes(slug))
      expect(missing).toEqual([])
    })

    it('cada entrada con ficha en el inventario tiene su JSON', () => {
      const slugs = games.map((g) => g.slug)
      expect(inventorySlugs.filter((slug) => !slugs.includes(slug))).toEqual([])
    })
  })
})
