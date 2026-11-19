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

// Otros juegos de rol: Amazon en todos los libros; las tiendas españolas, en las ediciones en
// castellano
const rpgBooks = files('data/rol/books/*/*.json').map(read)
check(
  'otros juegos de rol',
  'amazon',
  rpgBooks.map((b) => [b.slug, storesOf(b.editions).has('amazon')])
)
for (const store of ['juegos_mesa_redonda', 'nosolorol', 'casa_del_libro']) {
  check(
    'otros juegos de rol',
    store,
    rpgBooks
      .filter((b) => b.editions.some((e) => e.language === 'castellano'))
      .map((b) => [
        b.slug,
        storesOf(b.editions.filter((e) => e.language === 'castellano')).has(store),
      ])
  )
}

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
