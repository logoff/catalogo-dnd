import type { ReleaseSection } from './releases'

// Una ficha del resumen mensual
export interface SummaryFicha {
  name: string
  path: string
  // Fecha más reciente de sus ediciones (completa o solo el año)
  date: string | null
  context?: string
}

export interface MonthlySummary {
  // AAAA-MM
  month: string
  // Fichas nuevas por sección, de la que más tiene a la que menos
  added: { section: ReleaseSection; count: number; examples: SummaryFicha[] }[]
  // Ediciones en castellano nuevas en fichas que ya existían
  spanishEditions: { name: string; path: string; date: string | null }[]
  // Fechas en castellano cambiadas, con la anterior
  spanishDates: { name: string; path: string; date: string | null; before: string | null }[]
  reviews: {
    count: number
    items: { name: string; path: string; outlet: string; date: string | null }[]
  }
}
