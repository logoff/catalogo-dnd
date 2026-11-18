import type { ReviewOutlet } from '@/types'
import reviewOutlets from '../../data/review-outlets.json'

// Medios aceptados para las reseñas de libros y novelas. Va aparte de dataLoader para que la
// ficha de novela no cargue los datos de todos los productos.
const outlets = reviewOutlets as ReviewOutlet[]
const outletsById = new Map(outlets.map((outlet) => [outlet.id, outlet]))

export function getAllReviewOutlets(): ReviewOutlet[] {
  return outlets
}

export function getReviewOutlet(id: string): ReviewOutlet | undefined {
  return outletsById.get(id)
}
