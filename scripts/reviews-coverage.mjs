// Lista los libros publicados en inglés que aún no tienen reseñas, por edición y categoría.
// Es el punto de partida de la skill add-review para cargar reseñas por lotes.
//
//   node scripts/reviews-coverage.mjs
import { allBooks } from './reviews.mjs'

const today = new Date().toISOString().slice(0, 10)

// Los anunciados (sin fecha en inglés o con fecha futura) aún no pueden tener reseñas
const published = (product) =>
  product.publications.some((pub) => pub.language === 'english' && pub.date && pub.date <= today)

const pending = allBooks().filter(
  ({ product }) => published(product) && !(product.reviews ?? []).length
)

let group = ''
for (const { file, product } of pending) {
  // data/2014/products/01_books/04_adventures/001_hotdq.json → 2014 · 04_adventures
  const [, edition, , , category] = file.split('/')
  if (`${edition} · ${category}` !== group) {
    group = `${edition} · ${category}`
    console.log(`\n${group}`)
  }
  const title = product.publications.find((pub) => pub.language === 'english')?.title
  console.log(`  ${product.code.padEnd(8)} ${title}`)
}

console.log(
  pending.length
    ? `\n${pending.length} ${pending.length === 1 ? 'libro' : 'libros'} sin reseñas`
    : 'Todos los libros publicados tienen reseñas'
)
