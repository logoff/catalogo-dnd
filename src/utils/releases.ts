import { differenceInCalendarMonths, parseISO } from 'date-fns'
import { getProductsByEdition } from '@/services/dataLoader'
import type { Language, ProductWithMeta, Publication } from '@/types'

// URL de la ficha de un producto
export function productPath(product: ProductWithMeta): string {
  const editionPath = product.primaryEdition === '5e' ? '2014' : '2024'
  return `/producto/${editionPath}/${product.code.toLowerCase()}`
}

// Primera publicación en un idioma: la de fecha más temprana; las anunciadas sin fecha, al final
export function firstPublication(
  product: ProductWithMeta,
  language: Language
): Publication | undefined {
  return product.publications
    .filter((pub) => pub.language === language)
    .sort((a, b) => (a.date ?? '9999').localeCompare(b.date ?? '9999'))[0]
}

// Libros salidos más recientemente en castellano (sin contar los anunciados con fecha futura),
// del más reciente al más antiguo
export function latestInSpanish(
  products: ProductWithMeta[],
  limit: number,
  today = new Date().toISOString().slice(0, 10)
): ProductWithMeta[] {
  return products
    .map((product) => {
      const dates = product.publications
        .filter((pub) => pub.language === 'castellano' && pub.date && pub.date <= today)
        .map((pub) => pub.date!)
      return { product, date: dates.sort()[dates.length - 1] }
    })
    .filter((entry): entry is { product: ProductWithMeta; date: string } => !!entry.date)
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, limit)
    .map((entry) => entry.product)
}

// Meses que tardó en salir en castellano, si ambas ediciones tienen fecha
export function translationDelay(product: ProductWithMeta): number | undefined {
  const english = firstPublication(product, 'english')?.date
  const spanish = firstPublication(product, 'castellano')?.date
  if (!english || !spanish) return undefined
  return differenceInCalendarMonths(parseISO(spanish), parseISO(english))
}

// Título para buscadores: añade el título en castellano, que es como lo busca mucha gente
export function bilingualTitle(product: ProductWithMeta): string {
  const spanish = firstPublication(product, 'castellano')?.title
  if (!spanish || spanish === product.primaryTitle) return product.primaryTitle
  if (spanish.includes(product.primaryTitle)) return spanish
  return `${product.primaryTitle} (${spanish})`
}

const isEdge = (pub: Publication) => pub.publisher?.startsWith('Edge') ?? false
const isWizards = (pub: Publication) => pub.publisher === 'Wizards of the Coast'

export interface SpanishEditions {
  product: ProductWithMeta
  edge: Publication
  wizards?: Publication
}

// Libros de 2014 que publicó Edge en castellano, con la reedición de Wizards si la hay
export function getEdgeEditions(): SpanishEditions[] {
  return getProductsByEdition('5e')
    .flatMap((product) => {
      const spanish = product.publications.filter((pub) => pub.language === 'castellano')
      const edge = spanish.find(isEdge)
      return edge ? [{ product, edge, wizards: spanish.find(isWizards) }] : []
    })
    .sort((a, b) => (a.edge.date ?? '').localeCompare(b.edge.date ?? ''))
}
