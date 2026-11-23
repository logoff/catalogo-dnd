// Lógica pura de la sección de otros juegos de rol, sin import.meta.glob: la usan el loader del
// navegador y el plugin de Vite que genera el índice en Node (por eso las importaciones son
// relativas)
import type {
  License,
  RpgBook,
  RpgBookSummary,
  RpgBookWithMeta,
  RpgEdition,
  RpgIndex,
  RpgSystem,
} from '../types/rpg.ts'
import { normalize } from './videogameFilters.ts'

// Editoriales de 5E destacadas: entra su catálogo impreso principal aunque solo esté en inglés
export const FEATURED_PUBLISHERS = ['Kobold Press']

// Juegos del grupo La Marca del Este: entra todo lo que publican y solo sus libros enlazan a su
// tienda, Tesoros de la Marca
export const MARCA_DEL_ESTE_SYSTEMS = [
  'aventuras-en-la-marca-del-este',
  'leyendas-de-la-marca-del-este',
  'cronicas-de-la-marca-del-este',
  'la-marca-estelar',
]

function byDateDesc<T extends { date?: string }>(a: T, b: T): number {
  return (b.date ?? '').localeCompare(a.date ?? '')
}

// Título de la edición en castellano más reciente; las ediciones sin título propio no cuentan
function titleEsOf(book: RpgBook): string | null {
  const spanish = book.editions
    .filter((edition) => edition.language === 'castellano' && edition.title)
    .sort(byDateDesc)
  return book.title_es ?? spanish[0]?.title ?? null
}

// Licencias que se aplican a un libro: la suya si la indica («none» si solo se declara
// compatible) o, si no, las de su sistema
export function bookLicenses(book: Pick<RpgBook, 'license' | 'system'>, systems: RpgSystem[]) {
  if (book.license) return book.license === 'none' ? [] : [book.license]
  return systems.find((s) => s.slug === book.system)?.licenses.map((l) => l.license) ?? []
}

// Fecha más antigua de las ediciones de un idioma (o de todas)
function firstDate(book: RpgBook, language?: RpgEdition['language']): string | null {
  const dates = book.editions
    .filter((e) => e.date && (!language || e.language === language))
    .map((e) => e.date!)
    .sort()
  return dates[0] ?? null
}

export function enrichBook(book: RpgBook, systems: RpgSystem[]): RpgBookWithMeta {
  const latest = [...book.editions].filter((e) => e.date).sort(byDateDesc)[0]?.date ?? null
  const titles = [
    book.title,
    ...(book.title_es ? [book.title_es] : []),
    ...book.editions.filter((e) => e.title).map((e) => e.title!),
  ]
  const publishers = [...new Set(book.editions.map((e) => e.publisher))]
  return {
    ...book,
    titleEs: titleEsOf(book),
    originalDate: firstDate(book, 'english') ?? firstDate(book),
    spanishDate: firstDate(book, 'castellano'),
    latestDate: latest,
    spanish: book.editions.some((e) => e.language === 'castellano'),
    licenses: bookLicenses(book, systems),
    publishers,
    searchText: normalize([...new Set([...titles, ...publishers])].join(' | ')),
    movement: systems.find((s) => s.slug === book.system)?.movement ?? null,
  }
}

// Portada que representa al libro: la de la edición en castellano más reciente que la tenga y,
// si no, la de la inglesa más reciente
export function mainCover(book: RpgBook): string | null {
  const withCover = (language: RpgEdition['language']) =>
    book.editions.filter((e) => e.language === language && e.cover).sort(byDateDesc)[0]?.cover
  return withCover('castellano') ?? withCover('english') ?? null
}

export function thumbnailOf(cover: string): string {
  return cover.replace(/\.webp$/, '-thumb.webp')
}

// Del más reciente al más antiguo; los que no tienen fecha, al final
export function compareBooks(
  a: Pick<RpgBookWithMeta, 'latestDate' | 'title'>,
  b: Pick<RpgBookWithMeta, 'latestDate' | 'title'>
) {
  return (b.latestDate ?? '').localeCompare(a.latestDate ?? '') || a.title.localeCompare(b.title)
}

export function summarize(book: RpgBookWithMeta): RpgBookSummary {
  const cover = mainCover(book)
  return {
    slug: book.slug,
    system: book.system,
    title: book.title,
    titleEs: book.titleEs,
    kind: book.kind,
    ...(book.settings && { settings: book.settings }),
    originalDate: book.originalDate,
    spanishDate: book.spanishDate,
    latestDate: book.latestDate,
    spanish: book.spanish,
    licenses: book.licenses,
    publishers: book.publishers,
    searchText: book.searchText,
    movement: book.movement,
    thumbnail: cover ? thumbnailOf(cover) : null,
  }
}

export function buildRpgIndex(
  licenses: License[],
  systems: RpgSystem[],
  books: RpgBook[]
): RpgIndex {
  return {
    licenses: [...licenses].sort((a, b) => a.name.localeCompare(b.name)),
    systems: [...systems].sort((a, b) => a.date.localeCompare(b.date)),
    books: books.map((book) => summarize(enrichBook(book, systems))).sort(compareBooks),
  }
}

// Ediciones de D&D sin catálogo oficial en el sitio (las anteriores a la 5E): tienen su propia
// sección en /ediciones, fuera de la de otros juegos de rol
export function isDndEdition(system: Pick<RpgSystem, 'official' | 'official_catalog'>): boolean {
  return Boolean(system.official && !system.official_catalog)
}

export function systemPath(system: Pick<RpgSystem, 'slug' | 'official' | 'official_catalog'>) {
  return `${isDndEdition(system) ? '/ediciones' : '/rol'}/${system.slug}`
}

export function bookPath(book: Pick<RpgBook, 'slug' | 'system'>, systems: RpgSystem[]) {
  const system = systems.find((s) => s.slug === book.system)
  return `${system ? systemPath(system) : `/rol/${book.system}`}/${book.slug}`
}

// Lo que es de la sección de otros juegos de rol: todo menos las ediciones anteriores de D&D y
// sus libros
export function rolSection<T extends { system: string }>(systems: RpgSystem[], books: T[]) {
  const rol = systems.filter((s) => !isDndEdition(s))
  const slugs = new Set(rol.map((s) => s.slug))
  return { systems: rol, books: books.filter((b) => slugs.has(b.system)) }
}

// Sistemas que derivan directamente de uno, con el tipo de cada derivación
export function derivedSystems(systems: RpgSystem[], slug: string) {
  return systems.flatMap((system) =>
    (system.derived_from ?? [])
      .filter((derivation) => derivation.system === slug)
      .map((derivation) => ({ system, derivation }))
  )
}

// Otras ediciones del mismo juego, de la más antigua a la más reciente
export function familyOf(systems: RpgSystem[], system: RpgSystem): RpgSystem[] {
  return systems
    .filter((s) => s.family === system.family && s.slug !== system.slug)
    .sort((a, b) => a.date.localeCompare(b.date))
}

// Sistemas que usan una licencia
export function systemsUsing(systems: RpgSystem[], license: string): RpgSystem[] {
  return systems.filter((system) => system.licenses.some((l) => l.license === license))
}

// Licencias relacionadas en los dos sentidos: bajo las que se publica un documento de referencia
// y los documentos que se publican bajo una licencia
export function relatedLicenses(licenses: License[], license: License): License[] {
  const under = (license.published_under ?? []).map((p) => p.license)
  return licenses.filter(
    (l) =>
      l.slug !== license.slug &&
      (under.includes(l.slug) || (l.published_under ?? []).some((p) => p.license === license.slug))
  )
}

// Primer sistema de un ciclo de derivaciones, o null si no hay ninguno
export function derivationCycle(systems: RpgSystem[]): string | null {
  const parents = new Map(systems.map((s) => [s.slug, (s.derived_from ?? []).map((d) => d.system)]))
  const visiting = new Set<string>()
  const done = new Set<string>()
  const visit = (slug: string): boolean => {
    if (done.has(slug)) return false
    if (visiting.has(slug)) return true
    visiting.add(slug)
    const cycle = (parents.get(slug) ?? []).some(visit)
    visiting.delete(slug)
    done.add(slug)
    return cycle
  }
  return systems.find((s) => visit(s.slug))?.slug ?? null
}

// Si un sistema llega a una edición de D&D siguiendo sus derivaciones hacia arriba. Sin
// withInspiration, las derivaciones de inspiración no cuentan (regla de los OSR); con ella, sí
// (regla de los NSR). Supone que no hay ciclos, que ya vigila derivationCycle
export function reachesDnd(
  systems: RpgSystem[],
  system: RpgSystem,
  withInspiration: boolean
): boolean {
  const bySlug = new Map(systems.map((s) => [s.slug, s]))
  const reaches = (current: RpgSystem): boolean =>
    (current.derived_from ?? []).some((derivation) => {
      if (!withInspiration && derivation.kind === 'inspiration') return false
      const parent = bySlug.get(derivation.system)
      return Boolean(parent && (parent.official || reaches(parent)))
    })
  return reaches(system)
}

// Editoriales de la línea propia de un juego OSR o NSR
export function linePublishers(system: Pick<RpgSystem, 'publisher' | 'line_publishers'>) {
  return system.line_publishers ?? [system.publisher]
}

// Por qué un sistema incumple las reglas de su movimiento, o null si las cumple: solo los que no
// son D&D llevan movimiento, un OSR llega a D&D sin inspiración y un NSR llega con ella
export function movementProblem(systems: RpgSystem[], system: RpgSystem): string | null {
  if (!system.movement) return system.line_publishers ? 'line_publishers sin movimiento' : null
  if (system.official) return 'una edición de D&D no lleva movimiento'
  if (!reachesDnd(systems, system, system.movement === 'nsr')) {
    return system.movement === 'osr'
      ? 'un OSR tiene que derivar de D&D sin quedarse en la inspiración'
      : 'un NSR tiene que llegar a D&D por sus derivaciones'
  }
  return null
}

// Por qué un libro de un sistema OSR o NSR queda fuera del alcance, o null si entra: necesita
// formato en cada edición, una edición impresa (o liberada gratis por la editorial en Codex de la
// Marca) y estar en castellano o ser de la línea propia
export function movementBookProblem(
  book: Pick<RpgBook, 'editions'>,
  system: Pick<RpgSystem, 'publisher' | 'line_publishers'>
): string | null {
  if (book.editions.some((e) => !e.format)) return 'cada edición tiene que indicar su formato'
  if (!book.editions.some((e) => e.format !== 'pdf' || e.free_download)) {
    return 'necesita una edición impresa'
  }
  const line = linePublishers(system)
  const inScope = book.editions.some(
    (e) => e.language === 'castellano' || (e.language === 'english' && line.includes(e.publisher))
  )
  return inScope ? null : 'solo en inglés y de otra editorial que la del sistema'
}
