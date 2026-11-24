import { describe, it, expect } from 'vitest'
import Ajv from 'ajv'
import addFormats from 'ajv-formats'
import comicSchemaSource from '/data/schemas/comic.jsonschema?raw'
import inventory from '/data/comics/inventory.md?raw'
import type { Comic, ComicEdition } from '@/types/comic'
import { isValidIsbn13 } from '@/utils/isbn'
import { expandIssueRange, thumbnailOf } from '@/utils/comics'
import { getAllProducts } from './dataLoader'
import { getAllVideogames } from './videogameLoader'
import { getAllMerchandise } from './merchandiseLoader'
import comicsIndex from 'virtual:comics-index'
import { getCachedComic, loadComic, preloadComicRoute } from './comicLoader'

const ajv = new Ajv({ allErrors: true })
addFormats(ajv)
const comicSchema = JSON.parse(comicSchemaSource)
const validate = ajv.compile(comicSchema)
const validateCollections = ajv.compile({
  type: 'array',
  items: { allOf: [{ $ref: '/schemas/comic#/$defs/edition' }, { required: ['id'] }] },
})

// En los tests se cargan todas las series a la vez; la web las carga de una en una
const files = import.meta.glob<Comic>('/data/comics/*/*.json', { eager: true, import: 'default' })
const comics = Object.values(files)
const slugs = comics.map((c) => c.slug)
const collections = Object.values(
  import.meta.glob<ComicEdition[]>('/data/comics/collections.json', {
    eager: true,
    import: 'default',
  })
)[0]

// Carpetas válidas: una por editorial
const PUBLISHER_DIRS = [
  'dc',
  'tsr',
  'kenzer',
  'devils-due',
  'idw',
  'harpercollins',
  'dark-horse',
  'planeta',
  'otras',
]

// Portadas de public/ con la ruta que usan los JSON (/images/…)
const publicImages = new Set(
  Object.keys(import.meta.glob('/public/images/comics/**/*')).map((path) =>
    path.replace(/^\/public/, '')
  )
)

const minimalComic: Comic = {
  slug: 'serie',
  title: 'Serie',
  publisher: 'IDW Publishing',
  setting: 'forgotten_realms',
  kind: 'limited_series',
  date: '2021-10',
  issue_count: 1,
  description: 'De qué trata.\n\nDónde encaja.',
  source: 'https://www.comics.org/series/1/',
  issues: [{ number: '1' }],
}

// Todas las ediciones con su dueño: las de cada serie y los tomos de varias series
const allEditions = [
  ...comics.flatMap((c) => (c.editions ?? []).map((e) => ({ owner: c.slug, ...e }))),
  ...collections.map((e) => ({ owner: e.id!, ...e })),
]

describe('esquema de cómics', () => {
  it('acepta una serie mínima', () => {
    expect(validate(minimalComic), ajv.errorsText(validate.errors)).toBe(true)
  })

  it('rechaza una serie sin fuente o con un mundo fuera de la lista', () => {
    const withoutSource: Partial<Comic> = { ...minimalComic }
    delete withoutSource.source
    expect(validate(withoutSource)).toBe(false)
    expect(validate({ ...minimalComic, setting: 'athas' })).toBe(false)
  })

  it('exige spain en las ediciones en castellano y contents en los tomos', () => {
    const tomo = { language: 'english', publisher: 'IDW', format: 'paperback' }
    expect(validate({ ...minimalComic, editions: [tomo] })).toBe(false)
    expect(
      validate({
        ...minimalComic,
        editions: [
          { ...tomo, language: 'castellano', contents: [{ series: 'serie', issues: '1' }] },
        ],
      })
    ).toBe(false)
  })
})

describe('datos de cómics', () => {
  it('todos cumplen el esquema', () => {
    const errors = Object.entries(files)
      .filter(([, comic]) => !validate(comic))
      .map(([path]) => `${path}: ${ajv.errorsText(validate.errors)}`)
    expect(errors).toEqual([])
  })

  it('los tomos de varias series cumplen el esquema y sus ids no chocan con los slugs', () => {
    expect(validateCollections(collections), ajv.errorsText(validateCollections.errors)).toBe(true)
    const ids = collections.map((e) => e.id)
    expect(ids.filter((id, i) => ids.indexOf(id) !== i)).toEqual([])
    expect(ids.filter((id) => slugs.includes(id!))).toEqual([])
  })

  it('cada archivo está en la carpeta de una editorial y se llama como su slug', () => {
    const wrong = Object.entries(files)
      .filter(([path, comic]) => {
        const [, , , dir, file] = path.split('/')
        return !PUBLISHER_DIRS.includes(dir) || file !== `${comic.slug}.json`
      })
      .map(([path]) => path)
    expect(wrong).toEqual([])
  })

  it('los slugs no se repiten', () => {
    expect(slugs.filter((s, i) => slugs.indexOf(s) !== i)).toEqual([])
  })

  it('el número de entregas coincide con los números listados (salvo lo anunciado)', () => {
    const wrong = comics
      .filter((c) => !c.announced && c.issue_count !== c.issues.length)
      .map((c) => `${c.slug}: ${c.issue_count} ≠ ${c.issues.length}`)
    expect(wrong).toEqual([])
  })

  it('los números no se repiten dentro de una serie', () => {
    const wrong = comics.flatMap((c) => {
      const numbers = c.issues.map((i) => i.number)
      return numbers.filter((n, i) => numbers.indexOf(n) !== i).map((n) => `${c.slug}: ${n}`)
    })
    expect(wrong).toEqual([])
  })

  it('los tomos recogen series y números que existen', () => {
    const bySlug = new Map(comics.map((c) => [c.slug, c]))
    const wrong = allEditions.flatMap((edition) =>
      (edition.contents ?? []).flatMap((content) => {
        const series = bySlug.get(content.series)
        if (!series) return [`${edition.owner}: serie ${content.series}`]
        const numbers = series.issues.map((i) => i.number)
        return expandIssueRange(content.issues)
          .filter((n) => !numbers.includes(n))
          .map((n) => `${edition.owner}: ${content.series} n.º ${n}`)
      })
    )
    expect(wrong).toEqual([])
  })

  it('los ISBN son ISBN-13 válidos y no se repiten', () => {
    const isbns = allEditions.flatMap((e) => (e.isbn13 ? [e.isbn13] : []))
    expect(isbns.filter((isbn) => !isValidIsbn13(isbn))).toEqual([])
    expect(isbns.filter((isbn, i) => isbns.indexOf(isbn) !== i)).toEqual([])
  })

  it('cada serie tiene al menos una portada y todas las portadas existen con su miniatura', () => {
    const covers = (c: Comic) => [
      ...c.issues.flatMap((i) => (i.cover ? [i.cover] : [])),
      ...(c.editions ?? []).flatMap((e) => [
        ...(e.cover ? [e.cover] : []),
        ...(e.issues ?? []).flatMap((i) => (i.cover ? [i.cover] : [])),
      ]),
    ]
    const collectionCovers = collections.flatMap((e) => (e.cover ? [e.cover] : []))
    const all = [...comics.flatMap(covers), ...collectionCovers]
    const inCollection = (slug: string) =>
      collections.some((e) => e.cover && e.contents?.some((content) => content.series === slug))
    expect(
      comics.filter((c) => covers(c).length === 0 && !inCollection(c.slug)).map((c) => c.slug)
    ).toEqual([])
    expect(all.filter((cover) => !publicImages.has(cover))).toEqual([])
    expect(all.filter((cover) => !publicImages.has(thumbnailOf(cover)))).toEqual([])
  })

  it('todos tienen una descripción de dos párrafos', () => {
    const wrong = comics
      .filter((c) => c.description.split('\n\n').filter((p) => p.trim()).length !== 2)
      .map((c) => c.slug)
    expect(wrong).toEqual([])
  })

  it('los enlaces de compra no llevan parámetros de afiliado', () => {
    const AFFILIATE_PARAMS = ['tag', 'aff', 'affiliate', 'ref', 'a', 'as', 'partner', 'awinaffid']
    const withAffiliate = allEditions.flatMap((e) =>
      (e.purchase_links ?? [])
        .filter((link) => {
          const url = new URL(link.url)
          return (
            url.hostname.includes('adtraction') ||
            url.hostname.includes('awin') ||
            AFFILIATE_PARAMS.some((param) => url.searchParams.has(param))
          )
        })
        .map((link) => `${e.owner}: ${link.url}`)
    )
    expect(withAffiliate).toEqual([])
  })

  it('las series, novelas, libros, videojuegos y artículos relacionados existen', () => {
    const novelSlugs = Object.keys(import.meta.glob('/data/novels/*/*.json')).map((path) =>
      path.split('/').pop()!.replace('.json', '')
    )
    const products = getAllProducts()
    const games = getAllVideogames().map((g) => g.slug)
    const merch = getAllMerchandise().map((m) => m.slug)
    const missing = comics.flatMap((c) => [
      ...(c.continues && !slugs.includes(c.continues)
        ? [`${c.slug}: continúa ${c.continues}`]
        : []),
      ...(c.related_novels ?? [])
        .filter((s) => !novelSlugs.includes(s))
        .map((s) => `${c.slug}: novela ${s}`),
      ...(c.related_videogames ?? [])
        .filter((s) => !games.includes(s))
        .map((s) => `${c.slug}: videojuego ${s}`),
      ...(c.related_merchandise ?? [])
        .filter((s) => !merch.includes(s))
        .map((s) => `${c.slug}: artículo ${s}`),
      ...(c.related_products ?? [])
        .filter(
          (rel) => !products.some((p) => p.primaryEdition === rel.edition && p.code === rel.code)
        )
        .map((rel) => `${c.slug}: ${rel.edition}/${rel.code}`),
    ])
    expect(missing).toEqual([])
  })

  it('el índice tiene una entrada por serie', () => {
    expect(comicsIndex.map((c) => c.slug).sort()).toEqual([...slugs].sort())
  })

  describe('inventario', () => {
    // Columna «Ficha» de las tablas: el slug, «pendiente» o «descartado»
    const header = inventory
      .split('\n')
      .find((line) => line.startsWith('| #'))!
      .split('|')
      .map((cell) => cell.trim())
    const fichaIndex = header.indexOf('Ficha')
    const inventorySlugs = inventory
      .split('\n')
      .filter((line) => /^\|\s*\d+\s*\|/.test(line))
      .map((line) => line.split('|').map((cell) => cell.trim())[fichaIndex])
      .filter((ficha) => ficha !== 'pendiente' && ficha !== 'descartado')

    it('cada ficha está en el inventario', () => {
      expect(slugs.filter((slug) => !inventorySlugs.includes(slug))).toEqual([])
    })

    it('cada entrada con ficha en el inventario tiene su JSON', () => {
      expect(inventorySlugs.filter((slug) => !slugs.includes(slug))).toEqual([])
    })
  })
})

describe('carga de cómics', () => {
  it('carga una serie por su slug y la deja en la caché', async () => {
    if (slugs.length === 0) return
    const comic = await loadComic(slugs[0])
    expect(comic?.slug).toBe(slugs[0])
    expect(getCachedComic(slugs[0])).toBe(comic)
  })

  it('una serie que no existe devuelve undefined', async () => {
    expect(await loadComic('no-existe')).toBeUndefined()
  })

  it('precarga la ficha de la ruta', async () => {
    if (slugs.length === 0) return
    await preloadComicRoute(`/comic/${slugs[0]}`)
    expect(getCachedComic(slugs[0])).toBeDefined()
  })
})
