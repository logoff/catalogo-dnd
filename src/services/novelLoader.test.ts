import { describe, it, expect } from 'vitest'
import Ajv from 'ajv'
import addFormats from 'ajv-formats'
import novelSchemaSource from '/data/schemas/novel.jsonschema?raw'
import seriesSchemaSource from '/data/schemas/novel-series.jsonschema?raw'
import anthologySchemaSource from '/data/schemas/novel-anthology.jsonschema?raw'
import inventory from '/data/novels/inventory.md?raw'
import type { Novel, NovelAnthology, NovelCollection, NovelSeries } from '@/types/novel'
import { isValidIsbn13 } from '@/utils/isbn'
import { getAllProducts } from './dataLoader'
import { getAllVideogames } from './videogameLoader'
import { getAllMerchandise } from './merchandiseLoader'
import novelsIndex from 'virtual:novels-index'
import { anthologiesFor, compareByDate, enrichNovel, mainCover } from '@/utils/novels'
import { getCachedNovel, getNovelIndex, loadNovel, preloadNovelRoute } from './novelLoader'

const ajv = new Ajv({ allErrors: true })
addFormats(ajv)
const novelSchema = JSON.parse(novelSchemaSource)
ajv.addSchema(novelSchema)
const validate = ajv.getSchema(novelSchema.$id)!
const validateSeries = ajv.compile(JSON.parse(seriesSchemaSource))
const validateAnthologies = ajv.compile(JSON.parse(anthologySchemaSource))
const allAnthologies = Object.values(
  import.meta.glob<NovelAnthology[]>('/data/novels/anthologies.json', {
    eager: true,
    import: 'default',
  })
)[0]
const allSeries = Object.values(
  import.meta.glob<NovelSeries[]>('/data/novels/series.json', { eager: true, import: 'default' })
)[0]

// En los tests se cargan todas las novelas a la vez; la web las carga de una en una
const files = import.meta.glob<Novel>('/data/novels/*/*.json', { eager: true, import: 'default' })
const novels = Object.values(files)

// Portadas de public/ con la ruta que usan los JSON (/images/…)
const publicImages = new Set(
  Object.keys(import.meta.glob('/public/images/novels/**/*')).map((path) =>
    path.replace(/^\/public/, '')
  )
)

const minimalNovel: Novel = {
  slug: 'novela',
  title: 'Novela',
  authors: ['Autora'],
  setting: 'dragonlance',
  kind: 'novel',
  description: 'De qué trata.\n\nDónde encaja.',
  source: 'https://example.com/novela',
  editions: [{ language: 'english', country: 'us', publisher: 'TSR', format: 'paperback' }],
}

const spanishEdition = {
  language: 'castellano' as const,
  spain: true,
  title: 'Novela en castellano',
  publisher: 'Timun Mas',
  format: 'paperback' as const,
}

const collection = (overrides: Partial<NovelCollection> = {}): NovelCollection => ({
  language: 'castellano',
  spain: true,
  title: 'Trilogía',
  publisher: 'Minotauro',
  format: 'paperback',
  novels: ['novela', 'otra'],
  ...overrides,
})

describe('esquema de novelas', () => {
  it('acepta una novela mínima', () => {
    expect(validate(minimalNovel)).toBe(true)
  })

  it('acepta audiolibros con narrador y duración, pero no esos campos en otros formatos', () => {
    const audiobook = {
      language: 'english' as const,
      country: 'us' as const,
      publisher: 'Audible Studios',
      format: 'audiobook' as const,
      narrators: ['Narradora'],
      duration: 812,
      purchase_links: [{ store: 'amazon' as const, url: 'https://www.amazon.es/dp/B0ABCDEFGH/' }],
    }
    const withAudiobook = { ...minimalNovel, editions: [...minimalNovel.editions, audiobook] }
    expect(validate(withAudiobook), ajv.errorsText(validate.errors)).toBe(true)
    const narratedPaperback = { ...minimalNovel.editions[0], narrators: ['Narradora'] }
    expect(validate({ ...minimalNovel, editions: [narratedPaperback] })).toBe(false)
  })

  it('rechaza un mundo desconocido, una novela sin edición inglesa o sin fuente y campos desconocidos', () => {
    expect(validate({ ...minimalNovel, setting: 'krynn' })).toBe(false)
    expect(validate({ ...minimalNovel, editions: [spanishEdition] })).toBe(false)
    const withoutSource: Partial<Novel> = { ...minimalNovel }
    delete withoutSource.source
    expect(validate(withoutSource)).toBe(false)
    expect(validate({ ...minimalNovel, extra: 1 })).toBe(false)
  })

  it('exige el país en las ediciones inglesas y si salió en España en las castellanas', () => {
    const [english] = minimalNovel.editions
    const withEditions = (...editions: object[]) => ({ ...minimalNovel, editions })
    expect(validate(withEditions(english, spanishEdition))).toBe(true)
    expect(validate(withEditions({ ...english, country: undefined }))).toBe(false)
    expect(validate(withEditions(english, { ...spanishEdition, spain: undefined }))).toBe(false)
    expect(validate(withEditions({ ...english, spain: true }))).toBe(false)
    expect(validate(withEditions(english, { ...spanishEdition, country: 'us' }))).toBe(false)
  })

  it('admite ediciones web con enlace al archivo, sin ISBN ni enlaces de compra', () => {
    const web = {
      language: 'english',
      country: 'us',
      publisher: 'Wizards of the Coast',
      format: 'web',
      url: 'https://web.archive.org/web/2000/https://www.wizards.com/novela',
    }
    expect(validate({ ...minimalNovel, editions: [web] })).toBe(true)
    expect(validate({ ...minimalNovel, editions: [{ ...web, url: undefined }] })).toBe(false)
    expect(validate({ ...minimalNovel, editions: [{ ...web, isbn13: 9780880381734 }] })).toBe(false)
    const [english] = minimalNovel.editions
    expect(validate({ ...minimalNovel, editions: [{ ...english, url: web.url }] })).toBe(false)
  })

  it('admite ediciones sin formato conocido, que no cuentan como web', () => {
    const [english] = minimalNovel.editions
    const withoutFormat: Partial<typeof english> = { ...english }
    delete withoutFormat.format
    expect(validate({ ...minimalNovel, editions: [withoutFormat] })).toBe(true)
  })

  it('admite un título en castellano propio de la novela', () => {
    expect(validate({ ...minimalNovel, title_es: 'Uno / Dos' })).toBe(true)
  })

  it('exige número a las novelas de una serie y solo admite tiendas conocidas', () => {
    expect(validate({ ...minimalNovel, series: { id: 'cronicas', number: 1 } })).toBe(true)
    expect(validate({ ...minimalNovel, series: { id: 'cronicas' } })).toBe(false)
    const [english] = minimalNovel.editions
    const linked = (store: string) => ({
      ...minimalNovel,
      editions: [{ ...english, purchase_links: [{ store, url: 'https://example.com/' }] }],
    })
    expect(validate(linked('amazon'))).toBe(true)
    expect(validate(linked('ebay'))).toBe(false)
  })
})

describe('esquema de series', () => {
  it('acepta una serie con un recopilatorio y rechaza recopilatorios de una sola novela', () => {
    const series = { id: 'cronicas', title: 'Chronicles', setting: 'dragonlance' }
    expect(validateSeries([{ ...series, collections: [collection()] }])).toBe(true)
    expect(validateSeries([{ ...series, collections: [collection({ novels: ['novela'] })] }])).toBe(
      false
    )
    expect(validateSeries([{ ...series, setting: 'krynn' }])).toBe(false)
  })
})

describe('esquema de antologías', () => {
  const anthology: NovelAnthology = {
    id: 'cuentos',
    title: 'Tales',
    settings: ['dragonlance'],
    description: 'Relatos de varios autores ambientados en Krynn.\n\nDónde encaja.',
    source: 'https://example.com/tales',
    series: ['cronicas'],
    editions: [{ language: 'english', country: 'us', publisher: 'TSR', isbn13: 9780880383820 }],
  }

  it('acepta una antología y exige edición en inglés y una serie o novela relacionada', () => {
    expect(validateAnthologies([anthology]), ajv.errorsText(validateAnthologies.errors)).toBe(true)
    const spanishOnly = { ...anthology, editions: [spanishEdition] }
    expect(validateAnthologies([spanishOnly])).toBe(false)
    const unrelated = { ...anthology, series: undefined }
    expect(validateAnthologies([JSON.parse(JSON.stringify(unrelated))])).toBe(false)
    expect(validateAnthologies([{ ...anthology, settings: ['krynn'] }])).toBe(false)
  })

  it('anthologiesFor devuelve las de la serie de la novela y las que la nombran', () => {
    const bySeries = { ...anthology, id: 'serie', series: ['cronicas'] }
    const byNovel = { ...anthology, id: 'novela', series: undefined, novels: ['novela'] }
    const other = { ...anthology, id: 'otra', series: ['leyendas'] }
    const novel = { ...minimalNovel, series: { id: 'cronicas', number: 1 } }
    expect(anthologiesFor([bySeries, byNovel, other], novel).map((a) => a.id)).toEqual([
      'serie',
      'novela',
    ])
    expect(anthologiesFor([bySeries, other], minimalNovel)).toEqual([])
  })
})

describe('enrichNovel', () => {
  it('toma el año de la fecha y lo deja vacío si no hay', () => {
    expect(enrichNovel({ ...minimalNovel, date: '1984-11' }, []).year).toBe(1984)
    expect(enrichNovel(minimalNovel, []).year).toBeNull()
  })

  it('usa como título en castellano el de la edición más reciente', () => {
    const novel = {
      ...minimalNovel,
      editions: [
        ...minimalNovel.editions,
        { ...spanishEdition, title: 'Antiguo', date: '1987' },
        { ...spanishEdition, title: 'Nuevo', date: '2022-03' },
      ],
    }
    expect(enrichNovel(novel, []).titleEs).toBe('Nuevo')
    // El título propio de la novela manda, para las partidas en dos tomos
    expect(enrichNovel({ ...novel, title_es: 'Uno / Dos' }, []).titleEs).toBe('Uno / Dos')
    expect(enrichNovel(minimalNovel, []).titleEs).toBeNull()
  })

  it('distingue castellano en España, solo fuera y ninguno, contando los recopilatorios', () => {
    const spanishOf = (editions: Novel['editions'], collections: NovelCollection[] = []) =>
      enrichNovel(
        { ...minimalNovel, editions: [...minimalNovel.editions, ...editions] },
        collections
      ).spanish
    expect(spanishOf([spanishEdition])).toBe('spain')
    expect(spanishOf([{ ...spanishEdition, spain: false }])).toBe('elsewhere')
    expect(spanishOf([])).toBe('none')
    expect(spanishOf([], [collection()])).toBe('spain')
  })

  it('está a la venta si alguna edición o recopilatorio tiene enlace', () => {
    const purchase_links = [{ store: 'amazon' as const, url: 'https://www.amazon.es/dp/X/' }]
    expect(enrichNovel(minimalNovel, []).availableToBuy).toBe(false)
    expect(enrichNovel(minimalNovel, [collection({ purchase_links })]).availableToBuy).toBe(true)
  })

  it('busca por títulos en inglés y castellano y por autor, sin tildes', () => {
    const novel = {
      ...minimalNovel,
      editions: [
        ...minimalNovel.editions,
        { ...spanishEdition, title: 'El retorno de los dragones' },
      ],
    }
    const { searchText } = enrichNovel(novel, [])
    expect(searchText).toContain('retorno de los dragones')
    expect(searchText).toContain('autora')
    // Un título repetido en varias ediciones solo cuenta una vez
    const twice = enrichNovel({ ...novel, editions: [...novel.editions, novel.editions[1]] }, [])
    expect(twice.searchText).toBe(searchText)
  })
})

describe('mainCover', () => {
  it('prefiere la portada castellana más reciente y, si no hay, la inglesa', () => {
    const [english] = minimalNovel.editions
    const cover = (name: string) => `/images/novels/novela/${name}.webp`
    const novel = {
      ...minimalNovel,
      editions: [
        { ...english, cover: cover('en') },
        { ...spanishEdition, date: '1987', cover: cover('es-1987') },
        { ...spanishEdition, date: '2022', cover: cover('es-2022') },
        { ...spanishEdition, date: '2024' },
      ],
    }
    expect(mainCover(novel)).toBe(cover('es-2022'))
    expect(mainCover({ ...novel, editions: [novel.editions[0]] })).toBe(cover('en'))
    expect(mainCover(minimalNovel)).toBeNull()
  })

  it('usa la portada de un audiolibro solo si no hay otra', () => {
    const [english] = minimalNovel.editions
    const cover = (name: string) => `/images/novels/novela/${name}.webp`
    const audiobook = {
      ...english,
      date: '2020',
      format: 'audiobook' as const,
      cover: cover('audio'),
    }
    const novel = {
      ...minimalNovel,
      editions: [{ ...english, date: '1990', cover: cover('en') }, audiobook],
    }
    expect(mainCover(novel)).toBe(cover('en'))
    expect(mainCover({ ...minimalNovel, editions: [english, audiobook] })).toBe(cover('audio'))
  })
})

describe('compareByDate', () => {
  it('ordena de la más reciente a la más antigua, con las que no tienen fecha al final', () => {
    const novel = (title: string, date?: string) => ({ ...minimalNovel, title, date })
    const sorted = [novel('Sin fecha'), novel('Vieja', '1984'), novel('Nueva', '2022-08')]
      .sort(compareByDate)
      .map((n) => n.title)
    expect(sorted).toEqual(['Nueva', 'Vieja', 'Sin fecha'])
  })
})

describe('datos de novelas', () => {
  const collections = allSeries.flatMap((s) =>
    (s.collections ?? []).map((c) => ({ ...c, series: s.id }))
  )
  const slugs = novels.map((n) => n.slug)

  it('hay novelas', () => {
    expect(novels.length).toBeGreaterThan(0)
  })

  it('todas cumplen el esquema, y también las series', () => {
    const errors = Object.entries(files)
      .filter(([, novel]) => !validate(novel))
      .map(([path]) => `${path}: ${ajv.errorsText(validate.errors)}`)
    expect(errors).toEqual([])
    expect(validateSeries(allSeries), ajv.errorsText(validateSeries.errors)).toBe(true)
  })

  it('cada archivo está en la carpeta de su mundo y se llama como su slug', () => {
    const mismatched = Object.entries(files)
      .filter(([path, novel]) => path !== `/data/novels/${novel.setting}/${novel.slug}.json`)
      .map(([path]) => path)
    expect(mismatched).toEqual([])
  })

  it('los slugs de novelas y los ids de series no se repiten', () => {
    expect(slugs.filter((s, i) => slugs.indexOf(s) !== i)).toEqual([])
    const ids = allSeries.map((s) => s.id)
    expect(ids.filter((id, i) => ids.indexOf(id) !== i)).toEqual([])
  })

  it('las series existen, son del mismo mundo y sus números no se repiten', () => {
    const problems = novels.flatMap((novel) => {
      if (!novel.series) return []
      const series = allSeries.find((s) => s.id === novel.series!.id)
      if (!series) return [`${novel.slug}: serie ${novel.series.id} no definida`]
      const repeated = novels.some(
        (other) =>
          other.slug !== novel.slug &&
          other.series?.id === novel.series!.id &&
          other.series.number === novel.series!.number
      )
      return [
        ...(series.setting !== novel.setting
          ? [`${novel.slug}: mundo distinto al de la serie`]
          : []),
        ...(repeated ? [`${novel.slug}: número ${novel.series.number} repetido`] : []),
      ]
    })
    expect(problems).toEqual([])
  })

  it('los ISBN son válidos y no se repiten', () => {
    const isbns = [
      ...novels.flatMap((n) => n.editions.map((e) => ({ owner: n.slug, isbn: e.isbn13 }))),
      ...collections.map((c) => ({ owner: `${c.series}: ${c.title}`, isbn: c.isbn13 })),
    ].filter((entry): entry is { owner: string; isbn: number } => entry.isbn !== undefined)
    expect(isbns.filter((e) => !isValidIsbn13(e.isbn)).map((e) => `${e.owner}: ${e.isbn}`)).toEqual(
      []
    )
    const values = isbns.map((e) => e.isbn)
    expect(
      isbns.filter((e, i) => values.indexOf(e.isbn) !== i).map((e) => `${e.owner}: ${e.isbn}`)
    ).toEqual([])
  })

  it('todas tienen una descripción de dos párrafos', () => {
    const wrong = novels
      .filter((n) => n.description.split('\n\n').filter((p) => p.trim()).length !== 2)
      .map((n) => n.slug)
    expect(wrong).toEqual([])
  })

  it('las portadas existen y cada novela tiene al menos una, salvo las solo web', () => {
    const covers = [
      ...novels.flatMap((n) => n.editions.map((e) => ({ owner: n.slug, cover: e.cover }))),
      ...collections.map((c) => ({ owner: `${c.series}: ${c.title}`, cover: c.cover })),
    ]
    expect(
      covers
        .filter((c) => c.cover && !publicImages.has(c.cover))
        .map((c) => `${c.owner}: ${c.cover}`)
    ).toEqual([])
    const withoutCover = novels
      .filter((n) => !n.editions.every((e) => e.format === 'web'))
      .filter((n) => !n.editions.some((e) => e.cover))
      .map((n) => n.slug)
    expect(withoutCover).toEqual([])
  })

  it('los enlaces de compra no llevan parámetros de afiliado', () => {
    const AFFILIATE_PARAMS = ['tag', 'aff', 'affiliate', 'ref', 'a', 'as', 'partner']
    const withAffiliate = [...novels.flatMap((n) => n.editions), ...collections]
      .flatMap((e) => e.purchase_links ?? [])
      .filter((link) => {
        const url = new URL(link.url)
        return (
          url.hostname.includes('adtraction') ||
          AFFILIATE_PARAMS.some((param) => url.searchParams.has(param))
        )
      })
      .map((link) => link.url)
    expect(withAffiliate).toEqual([])
  })

  it('los recopilatorios contienen novelas que existen', () => {
    const missing = collections.flatMap((c) =>
      c.novels.filter((slug) => !slugs.includes(slug)).map((slug) => `${c.title}: ${slug}`)
    )
    expect(missing).toEqual([])
  })

  it('los libros, videojuegos y artículos relacionados existen', () => {
    const products = getAllProducts()
    const games = getAllVideogames().map((g) => g.slug)
    const merchandise = getAllMerchandise().map((m) => m.slug)
    const missing = novels.flatMap((n) => [
      ...(n.related_products ?? [])
        .filter(
          (rel) => !products.some((p) => p.primaryEdition === rel.edition && p.code === rel.code)
        )
        .map((rel) => `${n.slug}: ${rel.edition}/${rel.code}`),
      ...(n.related_videogames ?? [])
        .filter((slug) => !games.includes(slug))
        .map((slug) => `${n.slug}: videojuego ${slug}`),
      ...(n.related_merchandise ?? [])
        .filter((slug) => !merchandise.includes(slug))
        .map((slug) => `${n.slug}: merchandising ${slug}`),
    ])
    expect(missing).toEqual([])
  })

  it('loadNovel carga una novela por su slug y devuelve undefined si no existe', async () => {
    const [first] = novels
    expect((await loadNovel(first.slug))?.title).toBe(first.title)
    expect(getCachedNovel(first.slug)?.title).toBe(first.title)
    expect(await loadNovel('no-existe')).toBeUndefined()
  })

  it('preloadNovelRoute carga el índice en las guías de novelas', async () => {
    await preloadNovelRoute('/guias/orden-de-lectura-drizzt')
    await preloadNovelRoute('/guias/novelas-en-castellano')
    expect(getNovelIndex()?.novels.length).toBe(novels.length)
  })

  it('preloadNovelRoute deja en la caché el índice y la novela de la ficha', async () => {
    const [first] = novels
    await preloadNovelRoute(`/novela/${first.slug}`)
    expect(getNovelIndex()?.novels.length).toBe(novels.length)
    expect(getCachedNovel(first.slug)).toBeDefined()
  })

  describe('índice del listado (virtual:novels-index)', () => {
    it('tiene todas las novelas, de la más reciente a la más antigua, y todas las series', () => {
      expect(novelsIndex.novels.map((n) => n.slug).sort()).toEqual([...slugs].sort())
      const dates = novelsIndex.novels.map((n) => n.date ?? '')
      expect(dates).toEqual([...dates].sort().reverse())
      expect(novelsIndex.series.map((s) => s.id)).toEqual(allSeries.map((s) => s.id))
    })

    it('no lleva descripciones, ediciones ni recopilatorios', () => {
      const json = JSON.stringify(novelsIndex)
      expect(json).not.toContain('"description"')
      expect(json).not.toContain('"editions"')
      expect(json).not.toContain('"collections"')
    })

    it('usa la miniatura de la portada principal', () => {
      const [first] = novels
      const summary = novelsIndex.novels.find((n) => n.slug === first.slug)!
      expect(summary.thumbnail).toBe(mainCover(first)?.replace('.webp', '-thumb.webp'))
      expect(publicImages.has(summary.thumbnail!)).toBe(true)
    })
  })

  describe('inventario', () => {
    // Columna «Ficha» de las tablas por mundo: el slug, o «pendiente»
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
      .filter((ficha) => ficha !== 'pendiente')

    it('cada ficha está en el inventario', () => {
      expect(slugs.filter((slug) => !inventorySlugs.includes(slug))).toEqual([])
    })

    it('cada entrada con ficha en el inventario tiene su JSON', () => {
      expect(inventorySlugs.filter((slug) => !slugs.includes(slug))).toEqual([])
    })
  })

  describe('antologías', () => {
    const editions = allAnthologies.flatMap((a) => a.editions.map((e) => ({ owner: a.id, ...e })))

    it('cumplen el esquema, sus ids no se repiten y no chocan con los slugs de novelas', () => {
      expect(validateAnthologies(allAnthologies), ajv.errorsText(validateAnthologies.errors)).toBe(
        true
      )
      const ids = allAnthologies.map((a) => a.id)
      expect(ids.filter((id, i) => ids.indexOf(id) !== i)).toEqual([])
      expect(ids.filter((id) => slugs.includes(id))).toEqual([])
    })

    it('las series y novelas relacionadas existen', () => {
      const seriesIds = allSeries.map((s) => s.id)
      const missing = allAnthologies.flatMap((a) => [
        ...(a.series ?? []).filter((id) => !seriesIds.includes(id)).map((id) => `${a.id}: ${id}`),
        ...(a.novels ?? []).filter((slug) => !slugs.includes(slug)).map((s) => `${a.id}: ${s}`),
      ])
      expect(missing).toEqual([])
    })

    it('cada antología aparece en la ficha de al menos una novela', () => {
      const orphans = allAnthologies.filter(
        (a) => !novels.some((novel) => anthologiesFor([a], novel).length > 0)
      )
      expect(orphans.map((a) => a.id)).toEqual([])
    })

    it('tienen una descripción de dos párrafos', () => {
      const wrong = allAnthologies.filter(
        (a) => a.description.split('\n\n').filter((p) => p.trim()).length !== 2
      )
      expect(wrong.map((a) => a.id)).toEqual([])
    })

    it('sus ISBN son válidos y no se repiten, tampoco con los de las novelas', () => {
      const own = editions.filter((e) => e.isbn13 !== undefined)
      expect(
        own.filter((e) => !isValidIsbn13(e.isbn13!)).map((e) => `${e.owner}: ${e.isbn13}`)
      ).toEqual([])
      const novelIsbns = new Set(novels.flatMap((n) => n.editions.map((e) => e.isbn13)))
      const values = own.map((e) => e.isbn13)
      expect(
        own
          .filter((e, i) => values.indexOf(e.isbn13) !== i || novelIsbns.has(e.isbn13))
          .map((e) => `${e.owner}: ${e.isbn13}`)
      ).toEqual([])
    })

    it('las portadas existen, cada antología tiene una y las URLs de compra están limpias', () => {
      expect(
        editions.filter((e) => e.cover && !publicImages.has(e.cover)).map((e) => e.cover)
      ).toEqual([])
      const withoutCover = allAnthologies.filter((a) => !a.editions.some((e) => e.cover))
      expect(withoutCover.map((a) => a.id)).toEqual([])
      const dirty = editions
        .flatMap((e) => e.purchase_links ?? [])
        .filter((link) => new URL(link.url).search !== '')
      expect(dirty.map((link) => link.url)).toEqual([])
    })

    it('coinciden con la sección «Antologías» del inventario', () => {
      const section = inventory.split(/^## /m).find((s) => s.startsWith('Antologías'))!
      const rows = section
        .split('\n')
        .filter(
          (line) => line.startsWith('| ') && !line.startsWith('| Mundo') && !line.startsWith('| -')
        )
      const idIndex = section
        .split('\n')
        .find((line) => line.startsWith('| Mundo'))!
        .split('|')
        .map((cell) => cell.trim())
        .indexOf('Id')
      const inventoryIds = rows.map((line) => line.split('|').map((cell) => cell.trim())[idIndex])
      const ids = allAnthologies.map((a) => a.id)
      expect(ids.filter((id) => !inventoryIds.includes(id))).toEqual([])
      expect(inventoryIds.filter((id) => id !== 'pendiente' && !ids.includes(id))).toEqual([])
    })
  })
})
