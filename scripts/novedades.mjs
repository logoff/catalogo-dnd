// Lista lo que hay que vigilar de las novedades de 2024: anunciados sin fecha, fechas futuras
// (pueden moverse) y libros y cajas que aún no tienen edición en castellano. También los
// videojuegos anunciados y los que se venden sin dato de castellano (figuran como solo en inglés).
// Lo usa la skill `novedades` como punto de partida para buscar información nueva.
import { readFileSync, readdirSync, statSync } from 'fs'
import { join, dirname, relative } from 'path'
import { fileURLToPath } from 'url'

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..')
const DATA_DIR = join(ROOT, 'data', '2024', 'products')
const VIDEOGAMES_DIR = join(ROOT, 'data', 'videogames', 'games')
const today = new Date().toISOString().slice(0, 10)

function walk(dir) {
  return readdirSync(dir).flatMap((item) => {
    const path = join(dir, item)
    if (statSync(path).isDirectory()) return walk(path)
    return item.endsWith('.json') ? [path] : []
  })
}

// Primera publicación en un idioma: la de fecha más temprana; las anunciadas sin fecha, al final
function first(publications, language) {
  return publications
    .filter((pub) => pub.language === language)
    .sort((a, b) => (a.date ?? '9999').localeCompare(b.date ?? '9999'))[0]
}

const products = walk(DATA_DIR).map((file) => {
  const product = JSON.parse(readFileSync(file, 'utf-8'))
  return {
    file: relative(ROOT, file),
    code: product.code,
    type: product.publications[0].type,
    english: first(product.publications, 'english'),
    spanish: first(product.publications, 'castellano'),
  }
})

const sections = [
  ['Anunciados en inglés, sin fecha', (p) => p.english && !p.english.date],
  ['Fecha en inglés futura (comprobar que no se ha movido)', (p) => p.english?.date > today],
  ['En castellano sin fecha', (p) => p.spanish && !p.spanish.date],
  ['Fecha en castellano futura (comprobar que no se ha movido)', (p) => p.spanish?.date > today],
  ['Libros y cajas sin edición en castellano', (p) => !p.spanish && p.type !== 'accessory'],
  ['Accesorios sin edición en castellano', (p) => !p.spanish && p.type === 'accessory'],
]

console.log(`Novedades de 2024 a vigilar (hoy: ${today})`)
for (const [title, test] of sections) {
  const matches = products.filter(test)
  if (matches.length === 0) continue
  console.log(`\n## ${title}`)
  for (const p of matches) {
    const en = p.english ? `${p.english.title} (${p.english.date ?? 'sin fecha'})` : '-'
    const es = p.spanish ? `${p.spanish.title} (${p.spanish.date ?? 'sin fecha'})` : '-'
    console.log(`- ${p.code}: EN ${en} · ES ${es}  [${p.file}]`)
  }
}

// Videojuegos: anunciados (fecha que puede moverse) y lanzamientos a la venta sin dato de castellano
const videogames = walk(VIDEOGAMES_DIR).map((file) => ({
  file: relative(ROOT, file),
  ...JSON.parse(readFileSync(file, 'utf-8')),
}))

const gameSections = [
  ['Videojuegos anunciados', (g) => g.status === 'announced'],
  [
    'Videojuegos a la venta sin dato de castellano (figuran como solo en inglés)',
    (g) =>
      g.releases.some((r) => (r.purchase_links?.length || r.bundle) && !r.delisted && !r.spanish),
  ],
]

for (const [title, test] of gameSections) {
  const matches = videogames.filter(test)
  if (matches.length === 0) continue
  console.log(`\n## ${title}`)
  for (const g of matches) {
    const dates = [...new Set(g.releases.map((r) => r.date ?? 'sin fecha'))].join(', ')
    console.log(`- ${g.title} (${dates})  [${g.file}]`)
  }
}

console.log(
  `\nVideojuegos en el catálogo: ${videogames.length}. Revisa también juegos anunciados que aún no estén y retiradas de la venta.`
)
