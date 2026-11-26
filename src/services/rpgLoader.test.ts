import { describe, it, expect } from 'vitest'
import Ajv from 'ajv'
import addFormats from 'ajv-formats'
import licenseSchemaSource from '/data/schemas/license.jsonschema?raw'
import systemSchemaSource from '/data/schemas/rpg-system.jsonschema?raw'
import bookSchemaSource from '/data/schemas/rpg-book.jsonschema?raw'
import inventory from '/data/rol/inventory.md?raw'
import type { License, RpgBook, RpgSystem } from '@/types/rpg'
import { isValidIsbn13 } from '@/utils/isbn'
import rpgIndex from 'virtual:rpg-index'
import rpgStats from 'virtual:rpg-stats'
import {
  FEATURED_PUBLISHERS,
  bookLicenses,
  bookPath,
  buildRpgIndex,
  derivationCycle,
  derivedSystems,
  enrichBook,
  familyOf,
  isDndEdition,
  mainCover,
  movementBookProblem,
  MARCA_DEL_ESTE_SYSTEMS,
  movementProblem,
  relatedLicenses,
  rolSection,
  systemPath,
  systemsUsing,
} from '@/utils/rpg'
import { getCachedBook, getRpgIndex, loadBook, preloadRpgRoute } from './rpgLoader'

const ajv = new Ajv({ allErrors: true })
addFormats(ajv)
// Sin el tipo que infiere ajv, que estrecha a never los datos que no validan
const compile = (source: string): ((data: unknown) => boolean) => ajv.compile(JSON.parse(source))
const validateLicense = compile(licenseSchemaSource)
const validateSystem = compile(systemSchemaSource)
const validateBook = compile(bookSchemaSource)

const glob = <T>(files: Record<string, T>) => Object.entries(files)
const licenseFiles = glob(
  import.meta.glob<License>('/data/rol/licenses/*.json', { eager: true, import: 'default' })
)
const systemFiles = glob(
  import.meta.glob<RpgSystem>('/data/rol/systems/*.json', { eager: true, import: 'default' })
)
// En los tests se cargan todos los libros a la vez; la web los carga de uno en uno
const bookFiles = glob(
  import.meta.glob<RpgBook>('/data/rol/books/*/*.json', { eager: true, import: 'default' })
)
const licenses = licenseFiles.map(([, l]) => l)
const systems = systemFiles.map(([, s]) => s)
const books = bookFiles.map(([, b]) => b)

// Portadas de public/ con la ruta que usan los JSON (/images/…)
const publicImages = new Set(
  Object.keys(import.meta.glob('/public/images/rol/**/*')).map((path) =>
    path.replace(/^\/public/, '')
  )
)

const license: License = {
  slug: 'licencia',
  name: 'Licencia',
  kind: 'license',
  holder: 'Titular',
  date: '2023',
  description: 'Qué es.\n\nQué permite.',
  links: [{ label: 'Texto legal', url: 'https://example.com/licencia' }],
}

const system: RpgSystem = {
  slug: 'sistema',
  name: 'Sistema',
  family: 'familia',
  publisher: 'Editorial',
  date: '2020',
  description: 'Qué es.\n\nCómo se juega.',
  features: ['Usa d20'],
  licenses: [{ license: 'licencia' }],
  links: [{ label: 'Web', url: 'https://example.com/sistema' }],
}

const book: RpgBook = {
  slug: 'libro',
  system: 'sistema',
  title: 'Book',
  kind: 'core',
  description: 'Qué trae.\n\nPara quién es.',
  source: 'https://example.com/libro',
  editions: [{ language: 'english', publisher: 'Editorial', date: '2020-05' }],
}

describe('esquema de licencias', () => {
  it('acepta una licencia mínima y un documento de referencia publicado bajo otra', () => {
    expect(validateLicense(license)).toBe(true)
    expect(
      validateLicense({
        ...license,
        kind: 'reference_document',
        published_under: [{ license: 'otra', since: '2023-01-27' }],
      })
    ).toBe(true)
  })

  it('rechaza un tipo desconocido, sin enlace oficial o con campos desconocidos', () => {
    expect(validateLicense({ ...license, kind: 'otra' })).toBe(false)
    expect(validateLicense({ ...license, links: [] })).toBe(false)
    expect(validateLicense({ ...license, extra: true })).toBe(false)
  })

  it('solo los documentos de referencia se publican bajo otra licencia', () => {
    expect(validateLicense({ ...license, published_under: [{ license: 'otra' }] })).toBe(false)
  })

  it('las notas de estado llevan fecha, texto y fuente', () => {
    const note = { date: '2023-01-27', text: 'Cambio.', source: 'https://example.com/nota' }
    expect(validateLicense({ ...license, status_notes: [note] })).toBe(true)
    expect(validateLicense({ ...license, status_notes: [{ ...note, source: undefined }] })).toBe(
      false
    )
  })
})

describe('esquema de sistemas', () => {
  it('acepta un sistema mínimo y uno sin licencia abierta', () => {
    expect(validateSystem(system)).toBe(true)
    expect(validateSystem({ ...system, licenses: [] })).toBe(true)
  })

  it('rechaza un sistema sin editorial, sin características o con campos desconocidos', () => {
    expect(validateSystem({ ...system, publisher: undefined })).toBe(false)
    expect(validateSystem({ ...system, features: [] })).toBe(false)
    expect(validateSystem({ ...system, extra: true })).toBe(false)
  })

  it('las derivaciones tienen un tipo conocido y las de inspiración, nota', () => {
    const derived = (derivation: object) => ({ ...system, derived_from: [derivation] })
    expect(validateSystem(derived({ system: 'otro', kind: 'compatible' }))).toBe(true)
    expect(validateSystem(derived({ system: 'otro', kind: 'clon' }))).toBe(false)
    expect(validateSystem(derived({ system: 'otro', kind: 'inspiration' }))).toBe(false)
    expect(validateSystem(derived({ system: 'otro', kind: 'inspiration', note: 'Matiz.' }))).toBe(
      true
    )
  })

  it('el catálogo oficial solo puede ser el de 2014 o el de 2024', () => {
    expect(validateSystem({ ...system, official_catalog: '/2014' })).toBe(true)
    expect(validateSystem({ ...system, official_catalog: '/1977' })).toBe(false)
  })
})

describe('esquema de libros', () => {
  it('acepta un libro mínimo y uno con edición en castellano', () => {
    expect(validateBook(book)).toBe(true)
    expect(
      validateBook({
        ...book,
        editions: [
          ...book.editions,
          { language: 'castellano', title: 'Libro', publisher: 'Otra', format: 'hardcover' },
        ],
      })
    ).toBe(true)
  })

  it('rechaza un tipo desconocido, sin fuente, tiendas desconocidas o campos desconocidos', () => {
    expect(validateBook({ ...book, kind: 'novela' })).toBe(false)
    expect(validateBook({ ...book, source: undefined })).toBe(false)
    expect(
      validateBook({
        ...book,
        editions: [
          { ...book.editions[0], purchase_links: [{ store: 'fnac', url: 'https://fnac.es/x' }] },
        ],
      })
    ).toBe(false)
    expect(validateBook({ ...book, extra: true })).toBe(false)
  })

  it('acepta la campaña de micromecenazgo solo con una plataforma conocida', () => {
    const campaign = (crowdfunding: object) => ({
      ...book,
      editions: [{ ...book.editions[0], crowdfunding }],
    })
    const url = 'https://www.verkami.com/projects/1-x'
    expect(validateBook(campaign({ platform: 'verkami', url, end: '2026-12-27' }))).toBe(true)
    expect(validateBook(campaign({ platform: 'editorial', url, end: '2025-05-05' }))).toBe(true)
    expect(validateBook(campaign({ platform: 'patreon', url, end: '2026-12-27' }))).toBe(false)
    expect(validateBook(campaign({ platform: 'verkami', url, end: '2026-12' }))).toBe(false)
    expect(validateBook(campaign({ platform: 'verkami', url }))).toBe(false)
  })
})

describe('enrichBook', () => {
  it('separa la fecha del original de la de castellano y toma el título en castellano más reciente', () => {
    const enriched = enrichBook(
      {
        ...book,
        editions: [
          ...book.editions,
          { language: 'castellano', title: 'Libro', publisher: 'Otra', date: '2022' },
        ],
      },
      [system]
    )
    expect(enriched.originalDate).toBe(book.editions[0].date)
    expect(enriched.spanishDate).toBe('2022')
    expect(enriched.latestDate).toBe('2022')
    expect(enriched.titleEs).toBe('Libro')
    expect(enriched.spanish).toBe(true)
    expect(enriched.publishers).toEqual(['Editorial', 'Otra'])
    expect(enriched.searchText).toContain('libro')
  })

  it('hereda las licencias del sistema salvo que el libro indique otra o ninguna', () => {
    expect(bookLicenses(book, [system])).toEqual(['licencia'])
    expect(bookLicenses({ ...book, license: 'otra' }, [system])).toEqual(['otra'])
    expect(bookLicenses({ ...book, license: 'none' }, [system])).toEqual([])
  })

  it('prefiere la portada castellana y, si no hay, la inglesa', () => {
    const cover = (language: 'english' | 'castellano', path: string) => ({
      language,
      publisher: 'Editorial',
      cover: path,
    })
    expect(mainCover({ ...book, editions: [cover('english', '/en.webp')] })).toBe('/en.webp')
    expect(
      mainCover({
        ...book,
        editions: [cover('english', '/en.webp'), cover('castellano', '/es.webp')],
      })
    ).toBe('/es.webp')
    expect(mainCover(book)).toBeNull()
  })
})

describe('relaciones entre sistemas y licencias', () => {
  const parent: RpgSystem = { ...system, slug: 'padre', family: 'juego', date: '2000' }
  const child: RpgSystem = {
    ...system,
    slug: 'hijo',
    family: 'juego',
    derived_from: [{ system: 'padre', kind: 'major_rewrite' }],
  }

  it('derivedSystems da los sistemas que derivan de uno, con su tipo', () => {
    expect(derivedSystems([parent, child], 'padre')).toEqual([
      { system: child, derivation: child.derived_from![0] },
    ])
  })

  it('familyOf da las otras ediciones del mismo juego', () => {
    expect(familyOf([parent, child, system], child)).toEqual([parent])
  })

  it('systemsUsing da los sistemas que usan una licencia', () => {
    expect(systemsUsing([parent, { ...child, licenses: [] }], 'licencia')).toEqual([parent])
  })

  it('relatedLicenses enlaza el documento con su licencia en los dos sentidos', () => {
    const document: License = {
      ...license,
      slug: 'documento',
      kind: 'reference_document',
      published_under: [{ license: 'licencia' }],
    }
    expect(relatedLicenses([license, document], license)).toEqual([document])
    expect(relatedLicenses([license, document], document)).toEqual([license])
  })

  it('derivationCycle detecta ciclos directos e indirectos', () => {
    expect(derivationCycle([parent, child])).toBeNull()
    const loop: RpgSystem = {
      ...parent,
      derived_from: [{ system: 'hijo', kind: 'revision' }],
    }
    expect(derivationCycle([loop, child])).not.toBeNull()
  })

  it('las ediciones anteriores de D&D van en /ediciones y el resto en /rol', () => {
    const edition: RpgSystem = { ...system, slug: 'edicion', official: true }
    const fifth: RpgSystem = {
      ...system,
      slug: 'quinta',
      official: true,
      official_catalog: '/2014',
    }
    expect([edition, fifth, system].map(isDndEdition)).toEqual([true, false, false])
    expect(systemPath(edition)).toBe('/ediciones/edicion')
    expect(systemPath(fifth)).toBe('/rol/quinta')
    expect(bookPath({ slug: 'libro', system: 'edicion' }, [edition, system])).toBe(
      '/ediciones/edicion/libro'
    )
    expect(bookPath(book, [edition, system])).toBe('/rol/sistema/libro')
  })

  it('buildRpgIndex ordena los libros del más reciente al más antiguo', () => {
    const newer = { ...book, slug: 'nuevo', editions: [{ ...book.editions[0], date: '2024' }] }
    const index = buildRpgIndex([license], [system], [book, newer])
    expect(index.books.map((b) => b.slug)).toEqual(['nuevo', 'libro'])
  })
})

describe('datos de otros juegos de rol', () => {
  const licenseSlugs = licenses.map((l) => l.slug)
  const systemSlugs = systems.map((s) => s.slug)

  it('hay licencias, sistemas y libros', () => {
    expect(licenses.length).toBeGreaterThan(0)
    expect(systems.length).toBeGreaterThan(0)
    expect(books.length).toBeGreaterThan(0)
  })

  it('todos cumplen su esquema', () => {
    const invalid = [
      ...licenses.filter((l) => !validateLicense(l)).map((l) => l.slug),
      ...systems.filter((s) => !validateSystem(s)).map((s) => s.slug),
      ...books.filter((b) => !validateBook(b)).map((b) => b.slug),
    ]
    expect(invalid).toEqual([])
  })

  it('cada archivo se llama como su slug y los libros están en la carpeta de su sistema', () => {
    const misnamed = [
      ...licenseFiles.filter(([path, l]) => !path.endsWith(`/licenses/${l.slug}.json`)),
      ...systemFiles.filter(([path, s]) => !path.endsWith(`/systems/${s.slug}.json`)),
      ...bookFiles.filter(([path, b]) => !path.endsWith(`/books/${b.system}/${b.slug}.json`)),
    ].map(([path]) => path)
    expect(misnamed).toEqual([])
  })

  it('los slugs no se repiten', () => {
    const repeated = (slugs: string[]) => slugs.filter((s, i) => slugs.indexOf(s) !== i)
    expect(repeated(licenseSlugs)).toEqual([])
    expect(repeated(systemSlugs)).toEqual([])
    expect(repeated(books.map((b) => b.slug))).toEqual([])
  })

  it('las licencias, sistemas y derivaciones a los que se refieren existen', () => {
    const missing = [
      ...licenses.flatMap((l) => (l.published_under ?? []).map((p) => p.license)),
      ...systems.flatMap((s) => s.licenses.map((l) => l.license)),
      ...systems.flatMap((s) => (s.derived_from ?? []).flatMap((d) => d.via_license ?? [])),
      ...books.flatMap((b) => (b.license && b.license !== 'none' ? [b.license] : [])),
    ].filter((slug) => !licenseSlugs.includes(slug))
    const missingSystems = [
      ...systems.flatMap((s) => (s.derived_from ?? []).map((d) => d.system)),
      ...books.map((b) => b.system),
    ].filter((slug) => !systemSlugs.includes(slug))
    expect(missing).toEqual([])
    expect(missingSystems).toEqual([])
  })

  it('no hay ciclos de derivación', () => {
    expect(derivationCycle(systems)).toBeNull()
  })

  it('solo los sistemas de D&D enlazan al catálogo oficial', () => {
    const wrong = systems.filter((s) => s.official_catalog && s.family !== 'dungeons-and-dragons')
    expect(wrong.map((s) => s.slug)).toEqual([])
  })

  it('solo los sistemas de D&D son oficiales y los que enlazan al catálogo lo son', () => {
    const wrong = systems.filter(
      (s) =>
        (s.official && s.family !== 'dungeons-and-dragons') || (s.official_catalog && !s.official)
    )
    expect(wrong.map((s) => s.slug)).toEqual([])
  })

  it('ningún libro de Wizards cuelga de un sistema con catálogo oficial', () => {
    const withCatalog = systems.filter((s) => s.official_catalog).map((s) => s.slug)
    const duplicated = books.filter(
      (b) =>
        withCatalog.includes(b.system) &&
        b.editions.some((e) => e.publisher === 'Wizards of the Coast')
    )
    expect(duplicated.map((b) => b.slug)).toEqual([])
  })

  // Están descatalogados: solo se venden en PDF o impresión bajo demanda en DMsGuild
  it('los libros de las ediciones anteriores de D&D solo enlazan a DMsGuild', () => {
    const editions = systems.filter(isDndEdition).map((s) => s.slug)
    const wrong = books.filter(
      (b) =>
        editions.includes(b.system) &&
        b.editions.some((e) => (e.purchase_links ?? []).some((l) => l.store !== 'dmsguild'))
    )
    expect(wrong.map((b) => b.slug)).toEqual([])
  })

  it('DMsGuild solo en las ediciones anteriores de D&D y DriveThruRPG solo fuera de ellas', () => {
    const editions = systems.filter(isDndEdition).map((s) => s.slug)
    const wrong = books.filter((b) =>
      b.editions.some((e) =>
        (e.purchase_links ?? []).some(
          (l) =>
            (l.store === 'drivethrurpg' && editions.includes(b.system)) ||
            (l.store === 'dmsguild' && !editions.includes(b.system))
        )
      )
    )
    expect(wrong.map((b) => b.slug)).toEqual([])
  })

  it('Tesoros de la Marca solo en los libros de los juegos de La Marca del Este', () => {
    const wrong = books.filter((b) =>
      b.editions.some((e) =>
        (e.purchase_links ?? []).some(
          (l) =>
            l.store === 'tesoros_de_la_marca' &&
            (!MARCA_DEL_ESTE_SYSTEMS.includes(b.system) ||
              !l.url.startsWith('https://tesorosdelamarca.com/producto/'))
        )
      )
    )
    expect(wrong.map((b) => b.slug)).toEqual([])
  })

  // Las ediciones anteriores de D&D llevan todo su catálogo, aunque solo esté en inglés; los OSR y
  // NSR siguen su propia regla
  it('un libro solo en inglés es principal o de una editorial destacada', () => {
    const exempt = systems.filter((s) => isDndEdition(s) || s.movement).map((s) => s.slug)
    const outOfScope = books.filter(
      (b) =>
        !exempt.includes(b.system) &&
        !b.editions.some((e) => e.language === 'castellano') &&
        !b.core &&
        !b.editions.some((e) => FEATURED_PUBLISHERS.includes(e.publisher))
    )
    expect(outOfScope.map((b) => b.slug)).toEqual([])
  })

  it('los sistemas OSR y NSR cumplen las reglas de su movimiento', () => {
    const wrong = systems
      .map((s) => [s.slug, movementProblem(systems, s)])
      .filter(([, problem]) => problem)
    expect(wrong).toEqual([])
  })

  it('los libros OSR y NSR son impresos y están en castellano o son de la línea propia', () => {
    const wrong = books.flatMap((b) => {
      const system = systems.find((s) => s.slug === b.system)
      const problem = system?.movement ? movementBookProblem(b, system) : null
      return problem ? [[b.slug, problem]] : []
    })
    expect(wrong).toEqual([])
  })

  it('todos tienen una descripción de dos párrafos', () => {
    const paragraphs = (text: string) => text.split('\n\n').filter((p) => p.trim()).length
    const wrong = [...licenses, ...systems, ...books]
      .filter((item) => paragraphs(item.description) !== 2)
      .map((item) => item.slug)
    expect(wrong).toEqual([])
  })

  it('los ISBN son válidos y no se repiten', () => {
    const isbns = books.flatMap((b) => b.editions.flatMap((e) => e.isbn13 ?? []))
    expect(isbns.filter((isbn) => !isValidIsbn13(isbn))).toEqual([])
    expect(isbns.filter((isbn, i) => isbns.indexOf(isbn) !== i)).toEqual([])
  })

  it('las portadas existen con su miniatura', () => {
    const covers = books.flatMap((b) => b.editions.flatMap((e) => e.cover ?? []))
    const missing = covers.flatMap((cover) =>
      [cover, cover.replace(/\.webp$/, '-thumb.webp')].filter((path) => !publicImages.has(path))
    )
    expect(missing).toEqual([])
  })

  it('los enlaces de compra no llevan parámetros de afiliado', () => {
    const tagged = books
      .flatMap((b) => b.editions.flatMap((e) => e.purchase_links ?? []))
      .filter((link) => /[?&](tag|a|awinaffid|igr|affiliate_id)=/.test(link.url))
    expect(tagged).toEqual([])
  })

  describe('índice (virtual:rpg-index)', () => {
    it('tiene todas las licencias, los sistemas y los libros, sin descripciones de libros', () => {
      expect(rpgIndex.licenses).toHaveLength(licenses.length)
      expect(rpgIndex.systems).toHaveLength(systems.length)
      expect(rpgIndex.books).toHaveLength(books.length)
      expect(rpgIndex.books.every((b) => !('description' in b) && !('editions' in b))).toBe(true)
      const movementOf = (slug: string) => systems.find((s) => s.slug === slug)?.movement ?? null
      expect(rpgIndex.books.every((b) => b.movement === movementOf(b.system))).toBe(true)
      const rol = rolSection(systems, books)
      expect(rpgStats).toEqual({ systems: rol.systems.length, books: rol.books.length })
    })
  })

  describe('cargador', () => {
    it('loadBook carga un libro de su sistema y devuelve undefined si no es de ese sistema', async () => {
      const [first] = books
      expect((await loadBook(first.system, first.slug))?.slug).toBe(first.slug)
      expect(await loadBook('otro-sistema', first.slug)).toBeUndefined()
      expect(await loadBook(first.system, 'no-existe')).toBeUndefined()
    })

    it('preloadRpgRoute deja en la caché el índice y el libro de la ficha', async () => {
      const [first] = books
      await preloadRpgRoute(`/rol/${first.system}/${first.slug}`)
      expect(getRpgIndex()).not.toBeNull()
      expect(getCachedBook(first.slug)?.licenses).toEqual(bookLicenses(first, systems))
    })
  })

  describe('inventario', () => {
    // Columna «Ficha» de cada tabla del inventario: el slug, o «pendiente»
    const slugs: string[] = []
    let fichaIndex = -1
    for (const line of inventory.split('\n')) {
      const cells = line.split('|').map((cell) => cell.trim())
      if (/^\|\s*#\s*\|/.test(line)) fichaIndex = cells.indexOf('Ficha')
      else if (/^\|\s*\d+\s*\|/.test(line) && fichaIndex > 0 && cells[fichaIndex] !== 'pendiente')
        slugs.push(cells[fichaIndex])
    }
    const all = [...licenseSlugs, ...systemSlugs, ...books.map((b) => b.slug)]

    it('cada ficha está en el inventario', () => {
      expect(all.filter((slug) => !slugs.includes(slug))).toEqual([])
    })

    it('cada entrada con ficha en el inventario tiene su JSON', () => {
      expect(slugs.filter((slug) => !all.includes(slug))).toEqual([])
    })
  })
})
