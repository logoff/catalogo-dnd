import { differenceInCalendarMonths, parseISO } from 'date-fns'
import { getProductsByEdition } from '@/services/dataLoader'
import type { Language, ProductWithMeta, Publication } from '@/types'

// Primera publicación en un idioma: la de fecha más temprana; las anunciadas sin fecha, al final
export function firstPublication(
  product: ProductWithMeta,
  language: Language
): Publication | undefined {
  return product.publications
    .filter((pub) => pub.language === language)
    .sort((a, b) => (a.date ?? '9999').localeCompare(b.date ?? '9999'))[0]
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
