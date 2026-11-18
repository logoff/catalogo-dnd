// Lectura de los libros y sus reseñas para los scripts de reseñas
import { globSync, readFileSync } from 'fs'
import { dirname, join } from 'path'
import { fileURLToPath } from 'url'

export const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..')

// Libros de 2014 y de 2024, con la ruta de su JSON relativa a la raíz
export function allBooks() {
  return globSync('data/{2014,2024}/products/01_books/*/*.json', { cwd: ROOT })
    .sort()
    .map((file) => ({ file, product: JSON.parse(readFileSync(join(ROOT, file), 'utf-8')) }))
}

export function allReviews() {
  return allBooks().flatMap(({ file, product }) =>
    (product.reviews ?? []).map((review) => ({ file, code: product.code, review }))
  )
}
