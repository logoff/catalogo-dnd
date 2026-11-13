import { describe, it, expect } from 'vitest'
import Ajv from 'ajv'
import addFormats from 'ajv-formats'
import schemaSource from '/data/schemas/videogame.jsonschema?raw'
import bundleSchemaSource from '/data/schemas/videogame-bundle.jsonschema?raw'
import inventory from '/data/videogames/inventory.md?raw'
import type { Videogame, VideogameWithMeta } from '@/types/videogame'
import { getAllProducts } from './dataLoader'
import {
  enrichVideogame,
  getAllVideogames,
  getBundleFiles,
  getVideogameFiles,
} from './videogameLoader'

const ajv = new Ajv({ allErrors: true })
addFormats(ajv)
const validate = ajv.compile(JSON.parse(schemaSource))
const validateBundle = ajv.compile(JSON.parse(bundleSchemaSource))

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

  describe('vídeos', () => {
    const video = {
      youtube: '1T22wNvoNiU',
      kind: 'trailer',
      title: 'Official Launch Trailer',
      channel: 'Larian Studios',
      date: '2023-08-03',
    }

    it('acepta un vídeo con todos sus datos', () => {
      expect(validate({ ...minimalGame, videos: [video] })).toBe(true)
    })

    it('rechaza un vídeo sin canal, con un identificador que no es de YouTube o sin fecha completa', () => {
      const withoutChannel: Partial<typeof video> = { ...video }
      delete withoutChannel.channel
      expect(validate({ ...minimalGame, videos: [withoutChannel] })).toBe(false)
      expect(
        validate({
          ...minimalGame,
          videos: [{ ...video, youtube: 'https://youtu.be/1T22wNvoNiU' }],
        })
      ).toBe(false)
      expect(validate({ ...minimalGame, videos: [{ ...video, date: '2023-08' }] })).toBe(false)
    })

    it('rechaza más de tres vídeos', () => {
      expect(validate({ ...minimalGame, videos: Array(4).fill(video) })).toBe(false)
    })
  })

  describe('capturas', () => {
    const screenshot = {
      image: '/images/videogames/juego/screenshot-1.webp',
      source: 'https://store.steampowered.com/app/1086940/',
    }

    it('acepta una captura con su imagen y su fuente', () => {
      expect(validate({ ...minimalGame, screenshots: [screenshot] })).toBe(true)
    })

    it('rechaza una captura sin fuente o que no es un WebP de capturas', () => {
      expect(validate({ ...minimalGame, screenshots: [{ image: screenshot.image }] })).toBe(false)
      expect(
        validate({
          ...minimalGame,
          screenshots: [{ ...screenshot, image: '/images/videogames/juego/0.jpg' }],
        })
      ).toBe(false)
    })

    it('rechaza más de seis capturas', () => {
      expect(validate({ ...minimalGame, screenshots: Array(7).fill(screenshot) })).toBe(false)
    })
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

  it('deriva la miniatura local de cada vídeo y deja la lista vacía si no hay', () => {
    const video = {
      youtube: '1T22wNvoNiU',
      kind: 'trailer' as const,
      title: 'Tráiler',
      channel: 'Larian Studios',
      date: '2023-08-03',
    }
    expect(enrichVideogame({ ...minimalGame, videos: [video] }).videos).toEqual([
      { ...video, thumbnail: '/images/videogames/juego/video-1T22wNvoNiU.jpg' },
    ])
    expect(enrichVideogame(minimalGame).videos).toEqual([])
  })

  it('deriva la miniatura de cada captura y deja la lista vacía si no hay', () => {
    const screenshot = {
      image: '/images/videogames/juego/screenshot-2.webp',
      source: 'https://www.gog.com/en/game/juego',
    }
    expect(enrichVideogame({ ...minimalGame, screenshots: [screenshot] }).screenshots).toEqual([
      { ...screenshot, thumbnail: '/images/videogames/juego/screenshot-2-thumb.webp' },
    ])
    expect(enrichVideogame(minimalGame).screenshots).toEqual([])
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

  describe('vídeos', () => {
    // Vídeos repetidos en un juego y miniaturas que no están en public/
    const videoProblems = (list: VideogameWithMeta[]) =>
      list.flatMap((g) => {
        const ids = g.videos.map((v) => v.youtube)
        const repeated = ids
          .filter((id, i) => ids.indexOf(id) !== i)
          .map((id) => `${g.slug}: vídeo repetido ${id}`)
        const missing = g.videos
          .filter((v) => !publicImages.has(v.thumbnail))
          .map((v) => `${g.slug}: falta la miniatura ${v.thumbnail}`)
        return [...repeated, ...missing]
      })

    it('no se repiten en un juego y todos tienen su miniatura local', () => {
      expect(videoProblems(games)).toEqual([])
    })

    it('la comprobación detecta vídeos repetidos y miniaturas que faltan', () => {
      const video = {
        youtube: 'xxxxxxxxxxx',
        kind: 'trailer' as const,
        title: 'Tráiler',
        channel: 'Editora',
        date: '2020-01-01',
      }
      const game = enrichVideogame({ ...minimalGame, videos: [video, video] })
      expect(videoProblems([game])).toEqual([
        'juego: vídeo repetido xxxxxxxxxxx',
        'juego: falta la miniatura /images/videogames/juego/video-xxxxxxxxxxx.jpg',
        'juego: falta la miniatura /images/videogames/juego/video-xxxxxxxxxxx.jpg',
      ])
    })
  })

  describe('capturas', () => {
    // Capturas repetidas en un juego e imágenes ampliadas o miniaturas que no están en public/
    const screenshotProblems = (list: VideogameWithMeta[]) =>
      list.flatMap((g) => {
        const images = g.screenshots.map((s) => s.image)
        const repeated = images
          .filter((image, i) => images.indexOf(image) !== i)
          .map((image) => `${g.slug}: captura repetida ${image}`)
        const missing = g.screenshots
          .flatMap((s) => [s.image, s.thumbnail])
          .filter((path) => !publicImages.has(path))
          .map((path) => `${g.slug}: falta ${path}`)
        return [...repeated, ...missing]
      })

    it('no se repiten en un juego y todas tienen su imagen y su miniatura locales', () => {
      expect(screenshotProblems(games)).toEqual([])
    })

    it('la comprobación detecta capturas repetidas e imágenes que faltan', () => {
      const screenshot = {
        image: '/images/videogames/juego/screenshot-1.webp',
        source: 'https://store.steampowered.com/app/1/',
      }
      const game = enrichVideogame({ ...minimalGame, screenshots: [screenshot, screenshot] })
      expect(screenshotProblems([game])).toEqual([
        'juego: captura repetida /images/videogames/juego/screenshot-1.webp',
        'juego: falta /images/videogames/juego/screenshot-1.webp',
        'juego: falta /images/videogames/juego/screenshot-1-thumb.webp',
        'juego: falta /images/videogames/juego/screenshot-1.webp',
        'juego: falta /images/videogames/juego/screenshot-1-thumb.webp',
      ])
    })
  })

  it('los enlaces de compra no llevan parámetros de afiliado', () => {
    const AFFILIATE_PARAMS = ['tag', 'aff', 'affiliate', 'ref', 'a', 'as', 'igr', 'partner']
    const sources = [
      ...games.map((g) => ({ id: g.slug, releases: g.releases })),
      ...Object.values(getBundleFiles()),
    ]
    const withAffiliate = sources.flatMap((g) =>
      g.releases
        .flatMap((r) => r.purchase_links ?? [])
        .filter((link) => {
          const url = new URL(link.url)
          return (
            url.hostname.includes('adtraction') ||
            AFFILIATE_PARAMS.some((param) => url.searchParams.has(param))
          )
        })
        .map((link) => `${g.id}: ${link.url}`)
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

  describe('recopilaciones', () => {
    const bundleFiles = getBundleFiles()
    const bundles = Object.values(bundleFiles)
    const slugs = games.map((g) => g.slug)

    it('cumplen el esquema y el nombre del archivo es su id', () => {
      const errors = Object.entries(bundleFiles).flatMap(([path, bundle]) => [
        ...(validateBundle(bundle) ? [] : [`${path}: ${ajv.errorsText(validateBundle.errors)}`]),
        ...(path.endsWith(`/${bundle.id}.json`) ? [] : [`${path}: no coincide con ${bundle.id}`]),
      ])
      expect(errors).toEqual([])
    })

    it('un juego que solo se vende en recopilación cuenta como a la venta', () => {
      expect(games.find((g) => g.slug === 'pool-of-radiance')?.availableToBuy).toBe(true)
    })

    it('solo incluyen juegos del catálogo', () => {
      const missing = bundles.flatMap((b) =>
        b.games.filter((slug) => !slugs.includes(slug)).map((slug) => `${b.id}: ${slug}`)
      )
      expect(missing).toEqual([])
    })

    it('cada lanzamiento en recopilación apunta a una que existe en esa plataforma', () => {
      const broken = games.flatMap((g) =>
        g.releases
          .filter((r) => r.bundle)
          .filter((r) => {
            const bundle = bundles.find((b) => b.id === r.bundle)
            return (
              !bundle ||
              !bundle.games.includes(g.slug) ||
              !bundle.releases.some((br) => br.platform === r.platform)
            )
          })
          .map((r) => `${g.slug}: ${r.bundle} (${r.platform})`)
      )
      expect(broken).toEqual([])
    })

    it('cada juego de una recopilación tiene un lanzamiento que la referencia', () => {
      const orphan = bundles.flatMap((b) =>
        b.games
          .filter((slug) => {
            const game = games.find((g) => g.slug === slug)
            return game && !game.releases.some((r) => r.bundle === b.id)
          })
          .map((slug) => `${b.id}: ${slug}`)
      )
      expect(orphan).toEqual([])
    })

    it('los lanzamientos en recopilación no repiten sus enlaces de compra', () => {
      const duplicated = games.flatMap((g) =>
        g.releases.filter((r) => r.bundle && r.purchase_links).map(() => g.slug)
      )
      expect(duplicated).toEqual([])
    })
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
