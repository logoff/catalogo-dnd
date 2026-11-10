import { differenceInCalendarMonths, parseISO } from 'date-fns'
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
