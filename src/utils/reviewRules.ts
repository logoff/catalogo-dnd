import type { Review, ReviewOutlet } from '@/types'

// Reglas de las reseñas que el esquema no puede expresar y que valen para libros y novelas:
// medio de la lista, nota dentro de su escala y ninguna URL repetida. Devuelve un aviso por
// problema, con `id` (código del libro o slug de la novela) delante.
export function reviewProblems(
  id: string,
  reviews: Review[],
  outletLookup: (outletId: string) => ReviewOutlet | undefined
): string[] {
  const problems: string[] = []
  const urls = new Set<string>()
  for (const review of reviews) {
    const outlet = outletLookup(review.outlet)
    if (!outlet) problems.push(`${id}: el medio «${review.outlet}» no está en la lista`)
    else if (review.score !== undefined && !outlet.scale) {
      problems.push(`${id}: ${outlet.name} no pone nota`)
    } else if (review.score !== undefined && review.score > outlet.scale!) {
      problems.push(`${id}: nota ${review.score} fuera de la escala de ${outlet.name}`)
    }
    if (urls.has(review.url)) problems.push(`${id}: reseña repetida ${review.url}`)
    urls.add(review.url)
  }
  return problems
}
