// Lectura de los libros, las novelas y sus reseñas para los scripts de reseñas
import { globSync, readFileSync } from 'fs'
import { dirname, join } from 'path'
import { fileURLToPath } from 'url'

export const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..')

const read = (pattern) =>
  globSync(pattern, { cwd: ROOT })
    .sort()
    .map((file) => ({ file, data: JSON.parse(readFileSync(join(ROOT, file), 'utf-8')) }))

// Libros de 2014 y de 2024, con la ruta de su JSON relativa a la raíz
export function allBooks() {
  return read('data/{2014,2024}/products/01_books/*/*.json').map(({ file, data }) => ({
    file,
    product: data,
  }))
}

// Reseñas de las novelas (opcionales: no hay cobertura obligatoria)
export function allNovelReviews() {
  return read('data/novels/*/*.json').flatMap(({ file, data }) =>
    (data.reviews ?? []).map((review) => ({ file, code: data.slug, review }))
  )
}

// Reseñas de libros y novelas, para vigilar sus enlaces
export function allReviews() {
  const books = allBooks().flatMap(({ file, product }) =>
    (product.reviews ?? []).map((review) => ({ file, code: product.code, review }))
  )
  return [...books, ...allNovelReviews()]
}
