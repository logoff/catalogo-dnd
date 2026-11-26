// Informe de cobertura de enlaces de afiliados: lista, por sección y tienda, las fichas que
// deberían tener enlace a una tienda aceptada y no lo tienen. Las revisadas que no están a la
// venta van en data/affiliate-exceptions.json ({ "<sección>": { "<tienda>": { "<id>": "motivo" } } })
// y no se listan.
//
//   node scripts/affiliate-coverage.mjs [--json]
import { globSync, readFileSync } from 'fs'
import { dirname, join } from 'path'
import { fileURLToPath } from 'url'

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..')
const read = (file) => JSON.parse(readFileSync(file, 'utf-8'))
const files = (...patterns) =>
  patterns
    .flatMap((pattern) => globSync(pattern, { cwd: ROOT }))
    .sort()
    .map((file) => join(ROOT, file))
const exceptions = read(join(ROOT, 'data', 'affiliate-exceptions.json'))
const storesOf = (items) =>
  new Set(items.flatMap((item) => (item.purchase_links ?? []).map((link) => link.store)))

// Cada regla: sección, tienda y lista de [id, tiene enlace] de las fichas que deberían tenerlo
const checks = []
const check = (section, store, entries) => checks.push({ section, store, entries })

const products = files('data/2014/products/**/*.json', 'data/2024/products/**/*.json').map(read)
check(
  'productos',
  'amazon',
  products.map((p) => [p.code, storesOf(p.publications).has('amazon')])
)
check(
  'productos',
  'juegos_mesa_redonda',
  products.map((p) => [p.code, storesOf(p.publications).has('juegos_mesa_redonda')])
)
check(
  'productos',
  'casa_del_libro',
  products.flatMap((p) =>
    p.publications
      .filter((pub) => pub.language === 'castellano')
      .map((pub) => [`${p.code} ${pub.isbn13 ?? pub.title}`, storesOf([pub]).has('casa_del_libro')])
  )
)

const merchandise = files('data/merchandising/items/*/*.json').map(read)
check(
  'merchandising',
  'amazon',
  merchandise.map((m) => [m.slug, storesOf(m.editions).has('amazon')])
)
check(
  'merchandising',
  'casa_del_libro',
  merchandise.flatMap((m) =>
    m.editions
      .filter((e) => e.language === 'castellano')
      .map((e) => [
        `${m.slug} ${e.isbn13 ?? e.ean ?? ''}`.trim(),
        storesOf([e]).has('casa_del_libro'),
      ])
  )
)

// Videojuegos a la venta en tiendas digitales (Steam o GOG): Instant Gaming vende sus claves
const games = files('data/videogames/games/*/*.json').map(read)
check(
  'videojuegos',
  'instant_gaming',
  games
    .filter((g) => ['steam', 'gog'].some((s) => storesOf(g.releases).has(s)))
    .map((g) => [g.slug, storesOf(g.releases).has('instant_gaming')])
)

const novels = files('data/novels/*/*.json').map(read)
check(
  'novelas',
  'amazon',
  novels
    .filter((n) => n.editions.some((e) => e.format !== 'web'))
    .map((n) => [n.slug, storesOf(n.editions).has('amazon')])
)

// Cómics: cada tomo con ISBN (inglés o castellano) en Amazon; los de castellano, también en Casa
// del Libro. Los tomos de varias series (collections.json) cuentan aparte, por su id
const comicTomos = [
  ...files('data/comics/*/*.json')
    .map(read)
    .flatMap((c) => (c.editions ?? []).map((e) => ({ owner: c.slug, ...e }))),
  ...read(join(ROOT, 'data', 'comics', 'collections.json')).map((e) => ({ owner: e.id, ...e })),
].filter((e) => e.format !== 'issue' && e.isbn13)
check(
  'comics',
  'amazon',
  comicTomos.map((e) => [`${e.owner} ${e.isbn13}`, storesOf([e]).has('amazon')])
)
check(
  'comics',
  'casa_del_libro',
  comicTomos
    .filter((e) => e.language === 'castellano')
    .map((e) => [`${e.owner} ${e.isbn13}`, storesOf([e]).has('casa_del_libro')])
)

// Otros juegos de rol: Amazon en todos los libros; las tiendas españolas, en las ediciones en
// castellano. NoSoloRol solo vende lo que publica Nosolorol. Los libros de las ediciones
// anteriores de D&D (sistemas oficiales sin catálogo propio) están descatalogados: solo se
// revisa DMsGuild, que vende sus PDF e impresiones bajo demanda
const dndEditions = new Set(
  files('data/rol/systems/*.json')
    .map(read)
    .filter((s) => s.official && !s.official_catalog)
    .map((s) => s.slug)
)
const allRpgBooks = files('data/rol/books/*/*.json').map(read)
check(
  'ediciones',
  'dmsguild',
  allRpgBooks
    .filter((b) => dndEditions.has(b.system))
    .map((b) => [`${b.system}/${b.slug}`, storesOf(b.editions).has('dmsguild')])
)
const rpgBooks = allRpgBooks.filter((b) => !dndEditions.has(b.system))
// Los juegos OSR y NSR se venden sobre todo en DriveThruRPG (PDF e impresión bajo demanda): allí
// se revisan sus ediciones en inglés, y Amazon solo en el resto de la sección
const movementSystems = new Set(
  files('data/rol/systems/*.json')
    .map(read)
    .filter((s) => s.movement)
    .map((s) => s.slug)
)
check(
  'otros juegos de rol',
  'amazon',
  rpgBooks
    .filter((b) => !movementSystems.has(b.system))
    .map((b) => [b.slug, storesOf(b.editions).has('amazon')])
)
const englishOf = (b) => b.editions.filter((e) => e.language === 'english')
check(
  'otros juegos de rol',
  'drivethrurpg',
  rpgBooks
    .filter((b) => movementSystems.has(b.system) && englishOf(b).length > 0)
    .map((b) => [`${b.system}/${b.slug}`, storesOf(englishOf(b)).has('drivethrurpg')])
)
const spanishOf = (b, publisher) =>
  b.editions.filter((e) => e.language === 'castellano' && (!publisher || e.publisher === publisher))
for (const [store, publisher] of [
  ['juegos_mesa_redonda'],
  ['nosolorol', 'Nosolorol'],
  ['casa_del_libro'],
]) {
  check(
    'otros juegos de rol',
    store,
    rpgBooks
      .filter((b) => spanishOf(b, publisher).length > 0)
      .map((b) => [b.slug, storesOf(spanishOf(b, publisher)).has(store)])
  )
}

// Cine y series: Amazon en cada edición física editada en España (DVD, Blu-ray o 4K)
const screenWorks = files('data/screen/*/*.json').map(read)
check(
  'cine y series',
  'amazon',
  screenWorks.flatMap((w) =>
    (w.physical_editions ?? []).map((e) => [
      `${w.slug} ${e.format}${e.title ? ` (${e.title})` : ''}`,
      storesOf([e]).has('amazon'),
    ])
  )
)

const report = checks.map(({ section, store, entries }) => {
  const known = exceptions[section]?.[store] ?? {}
  const missing = entries.filter(([id, has]) => !has && !(id in known)).map(([id]) => id)
  // Excepciones que ya no hacen falta: la ficha tiene enlace o ya no existe
  const stale = Object.keys(known).filter(
    (id) => !entries.some(([other, has]) => other === id && !has)
  )
  return {
    section,
    store,
    total: entries.length,
    linked: entries.filter(([, has]) => has).length,
    excepted: Object.keys(known).length,
    missing,
    stale,
  }
})

if (process.argv.includes('--json')) {
  console.log(JSON.stringify(report, null, 2))
} else {
  for (const { section, store, total, linked, excepted, missing, stale } of report) {
    console.log(
      `${section} · ${store}: ${linked}/${total} con enlace, ${excepted} excepciones, ${missing.length} sin revisar`
    )
    for (const id of missing) console.log(`  - ${id}`)
    for (const id of stale) console.log(`  · excepción que sobra: ${id}`)
  }
}
