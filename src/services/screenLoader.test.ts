import { describe, it, expect } from 'vitest'
import Ajv from 'ajv'
import addFormats from 'ajv-formats'
import schemaSource from '/data/schemas/screen.jsonschema?raw'
import inventory from '/data/screen/inventory.md?raw'
import type { ScreenWork } from '@/types/screen'
import { getAllMerchandise } from './merchandiseLoader'
import { getAllVideogames } from './videogameLoader'
import {
  KIND_DIRECTORIES,
  enrichScreenWork,
  getAllScreenWorks,
  getScreenFiles,
  getScreenWorksForMerchandise,
  getScreenWorksForNovel,
} from './screenLoader'

const ajv = new Ajv({ allErrors: true })
addFormats(ajv)
const validate = ajv.compile(JSON.parse(schemaSource))

// Slugs de las novelas a partir del nombre de sus JSON (un test de novelas exige que coincidan)
const novelSlugs = Object.keys(import.meta.glob('/data/novels/*/*.json')).map((path) =>
  path.replace(/^.*\/([^/]+)\.json$/, '$1')
)

// Imágenes de public/ con la ruta que usan los JSON (/images/…)
const publicImages = new Set(
  Object.keys(import.meta.glob('/public/images/screen/**/*')).map((path) =>
    path.replace(/^\/public/, '')
  )
)

const film: ScreenWork = {
  slug: 'pelicula',
  kind: 'film',
  official: true,
  title: 'Película',
  description: 'Sinopsis.',
  status: 'released',
}

const trailer = (youtube: string, language: 'en' | 'es' = 'en') => ({
  youtube,
  language,
  title: 'Tráiler',
  channel: 'Paramount Pictures',
  date: '2022-07-21',
})

describe('esquema de cine y series', () => {
  it('acepta una película mínima', () => {
    expect(validate(film)).toBe(true)
  })

  it('exige el motivo en las obras no oficiales y lo prohíbe en las oficiales', () => {
    expect(validate({ ...film, official: false })).toBe(false)
    expect(validate({ ...film, official: false, unofficial_reason: 'Sin licencia.' })).toBe(true)
    expect(validate({ ...film, unofficial_reason: 'Sin licencia.' })).toBe(false)
  })

  it('exige temporadas en las series y la serie de origen en los episodios', () => {
    const seriesData = { start_year: 1983, end_year: 1985, seasons: 3 }
    expect(validate({ ...film, kind: 'series' })).toBe(false)
    expect(validate({ ...film, kind: 'series', status: 'announced' })).toBe(true)
    expect(validate({ ...film, kind: 'series', series: seriesData })).toBe(true)
    expect(validate({ ...film, series: seriesData })).toBe(false)
    expect(validate({ ...film, kind: 'episode' })).toBe(false)
    expect(validate({ ...film, kind: 'episode', parent_series: 'Secret Level' })).toBe(true)
    expect(validate({ ...film, parent_series: 'Secret Level' })).toBe(false)
  })

  it('rechaza tipos desconocidos y campos de más', () => {
    expect(validate({ ...film, kind: 'short' })).toBe(false)
    expect(validate({ ...film, extra: 1 })).toBe(false)
  })

  it('comprueba la forma de los enlaces de IMDb y FilmAffinity', () => {
    const external = (value: object) => validate({ ...film, external: value })
    expect(external({ imdb: 'https://www.imdb.com/title/tt2906216/' })).toBe(true)
    expect(external({ imdb: 'https://www.imdb.com/title/tt2906216/reviews' })).toBe(false)
    expect(external({ filmaffinity: 'https://www.filmaffinity.com/es/film363637.html' })).toBe(true)
    expect(external({ filmaffinity: 'https://www.filmaffinity.com/mx/film363637.html' })).toBe(
      false
    )
  })

  it('admite como mucho tres tráileres', () => {
    const trailers = ['aaaaaaaaaaa', 'bbbbbbbbbbb', 'ccccccccccc', 'ddddddddddd'].map((id) =>
      trailer(id)
    )
    expect(validate({ ...film, trailers: trailers.slice(0, 3) })).toBe(true)
    expect(validate({ ...film, trailers })).toBe(false)
  })

  it('solo admite Amazon como tienda de las ediciones físicas', () => {
    const edition = (store: string) => ({
      format: 'bluray',
      spanish_audio: true,
      spanish_subtitles: true,
      purchase_links: [{ store, url: 'https://www.amazon.es/dp/B000000000/' }],
    })
    expect(validate({ ...film, physical_editions: [edition('amazon')] })).toBe(true)
    expect(validate({ ...film, physical_editions: [edition('prime_video')] })).toBe(false)
  })
})

describe('enrichScreenWork', () => {
  it('prefiere el título y el cartel en castellano', () => {
    const work = enrichScreenWork({
      ...film,
      title_es: 'La película',
      posters: [
        { language: 'en', image: '/images/screen/pelicula/poster-en.webp', source: 'https://a.b/' },
        { language: 'es', image: '/images/screen/pelicula/poster-es.webp', source: 'https://a.b/' },
      ],
    })
    expect(work.displayTitle).toBe('La película')
    expect(work.poster?.language).toBe('es')
    expect(work.poster?.thumbnail).toBe('/images/screen/pelicula/poster-es-thumb.webp')
  })

  it('pone primero el tráiler en castellano y le asigna su miniatura local', () => {
    const work = enrichScreenWork({
      ...film,
      trailers: [trailer('aaaaaaaaaaa'), trailer('bbbbbbbbbbb', 'es')],
    })
    expect(work.trailers.map((t) => t.youtube)).toEqual(['bbbbbbbbbbb', 'aaaaaaaaaaa'])
    expect(work.trailers[0].thumbnail).toBe('/images/screen/pelicula/video-bbbbbbbbbbb.jpg')
  })

  it('toma la primera fecha de estreno, o el inicio de la serie', () => {
    const work = enrichScreenWork({
      ...film,
      releases: [
        { country: 'es', medium: 'cinema', date: '2001-04-12' },
        { country: 'us', medium: 'cinema', date: '2000-12-08' },
      ],
    })
    expect(work.firstReleaseDate).toBe('2000-12-08')
    expect(work.year).toBe(2000)
    const series = enrichScreenWork({
      ...film,
      kind: 'series',
      series: { start_year: 1983, seasons: 3 },
    })
    expect(series.year).toBe(1983)
    expect(enrichScreenWork(film).year).toBeNull()
  })

  it('cuenta como en castellano con título, estreno o edición en España', () => {
    expect(enrichScreenWork(film).hasSpanish).toBe(false)
    expect(enrichScreenWork({ ...film, title_es: 'La película' }).hasSpanish).toBe(true)
    expect(
      enrichScreenWork({
        ...film,
        releases: [{ country: 'es', medium: 'tv', date: '1985' }],
      }).hasSpanish
    ).toBe(true)
    expect(
      enrichScreenWork({
        ...film,
        physical_editions: [{ format: 'dvd', spanish_audio: false, spanish_subtitles: true }],
      }).hasSpanish
    ).toBe(true)
  })

  it('está a la venta si alguna edición física tiene enlace', () => {
    const edition = { format: 'dvd' as const, spanish_audio: true, spanish_subtitles: true }
    expect(enrichScreenWork({ ...film, physical_editions: [edition] }).availableToBuy).toBe(false)
    expect(
      enrichScreenWork({
        ...film,
        physical_editions: [
          { ...edition, purchase_links: [{ store: 'amazon', url: 'https://www.amazon.es/dp/X/' }] },
        ],
      }).availableToBuy
    ).toBe(true)
  })
})

describe('datos de cine y series', () => {
  const files = getScreenFiles()
  const works = getAllScreenWorks()

  it('hay obras oficiales y no oficiales', () => {
    expect(works.some((w) => w.official)).toBe(true)
    expect(works.some((w) => !w.official)).toBe(true)
  })

  it('todas cumplen el esquema', () => {
    const errors = Object.entries(files)
      .filter(([, work]) => !validate(work))
      .map(([path]) => `${path}: ${ajv.errorsText(validate.errors)}`)
    expect(errors).toEqual([])
  })

  it('cada archivo está en la carpeta de su tipo y se llama como su slug', () => {
    const mismatched = Object.entries(files)
      .filter(([path, work]) => !path.endsWith(`/${KIND_DIRECTORIES[work.kind]}/${work.slug}.json`))
      .map(([path]) => path)
    expect(mismatched).toEqual([])
  })

  it('los slugs no se repiten', () => {
    const slugs = works.map((w) => w.slug)
    expect(slugs.filter((s, i) => slugs.indexOf(s) !== i)).toEqual([])
  })

  it('ninguna obra repite tráiler', () => {
    const repeated = works.filter(
      (w) => new Set(w.trailers.map((t) => t.youtube)).size !== w.trailers.length
    )
    expect(repeated.map((w) => w.slug)).toEqual([])
  })

  it('los carteles y sus miniaturas existen', () => {
    const missing = works.flatMap((w) =>
      w.posters
        .flatMap((p) => [p.image, p.thumbnail])
        .filter((img) => !publicImages.has(img))
        .map((img) => `${w.slug}: ${img}`)
    )
    expect(missing).toEqual([])
  })

  it('las miniaturas de los tráileres existen', () => {
    const missing = works.flatMap((w) =>
      w.trailers
        .filter((t) => !publicImages.has(t.thumbnail))
        .map((t) => `${w.slug}: ${t.thumbnail}`)
    )
    expect(missing).toEqual([])
  })

  it('los enlaces de compra no llevan parámetros de afiliado', () => {
    const withAffiliate = works.flatMap((w) =>
      (w.physical_editions ?? [])
        .flatMap((e) => e.purchase_links ?? [])
        .filter((link) => new URL(link.url).searchParams.has('tag'))
        .map((link) => `${w.slug}: ${link.url}`)
    )
    expect(withAffiliate).toEqual([])
  })

  it('las novelas, artículos y videojuegos relacionados existen', () => {
    const merchandise = getAllMerchandise().map((m) => m.slug)
    const games = getAllVideogames().map((g) => g.slug)
    const missing = works.flatMap((w) => [
      ...(w.related_novels ?? [])
        .filter((slug) => !novelSlugs.includes(slug))
        .map((slug) => `${w.slug}: novela ${slug}`),
      ...(w.related_merchandise ?? [])
        .filter((slug) => !merchandise.includes(slug))
        .map((slug) => `${w.slug}: merchandising ${slug}`),
      ...(w.related_videogames ?? [])
        .filter((slug) => !games.includes(slug))
        .map((slug) => `${w.slug}: videojuego ${slug}`),
    ])
    expect(missing).toEqual([])
  })

  it('encuentra las obras de una novela y de un artículo en sentido inverso', () => {
    const withNovel = works.find((w) => (w.related_novels ?? []).length > 0)
    if (withNovel) {
      expect(getScreenWorksForNovel(withNovel.related_novels![0])).toContain(withNovel)
    }
    const withMerch = works.find((w) => (w.related_merchandise ?? []).length > 0)
    if (withMerch) {
      expect(getScreenWorksForMerchandise(withMerch.related_merchandise![0])).toContain(withMerch)
    }
  })

  describe('inventario', () => {
    // Columna «Ficha» de cada tabla del inventario: el slug, o «pendiente»
    const inventorySlugs: string[] = []
    let fichaIndex = -1
    for (const line of inventory.split('\n')) {
      if (!line.startsWith('|')) {
        fichaIndex = -1
        continue
      }
      const cells = line.split('|').map((cell) => cell.trim())
      if (cells.includes('Obra')) {
        fichaIndex = cells.indexOf('Ficha')
      } else if (fichaIndex > 0 && !/^-+$/.test(cells[1])) {
        const ficha = cells[fichaIndex]
        if (ficha !== 'pendiente') inventorySlugs.push(ficha)
      }
    }

    it('cada ficha está en el inventario', () => {
      const missing = works.map((w) => w.slug).filter((slug) => !inventorySlugs.includes(slug))
      expect(missing).toEqual([])
    })

    it('cada entrada con ficha en el inventario tiene su JSON', () => {
      const slugs = works.map((w) => w.slug)
      expect(inventorySlugs.filter((slug) => !slugs.includes(slug))).toEqual([])
    })
  })
})
