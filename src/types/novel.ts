import type { Edition, PurchaseLink } from './index'

export type NovelSetting =
  | 'dragonlance'
  | 'forgotten_realms'
  | 'eberron'
  | 'greyhawk'
  | 'ravenloft'
  | 'mystara'
  | 'dark_sun'
  | 'spelljammer'
  | 'planescape'
  | 'birthright'
  | 'nerath'
  | 'generic'

export type NovelKind =
  | 'novel'
  | 'young_adult'
  | 'middle_grade'
  | 'novella'
  // Relato vendido suelto, como los ebooks de Salvatore
  | 'short_story'
  // Las Bertrem's Guide de Dragonlance
  | 'fiction_guide'

// web: publicada solo en la web de Wizards o de su autor, sin ISBN ni enlaces de compra
export type NovelFormat = 'hardcover' | 'paperback' | 'mass_market' | 'ebook' | 'web'

export type NovelLanguage = 'english' | 'castellano'

export type NovelCountry = 'us' | 'uk' | 'ca' | 'au'

export interface NovelEdition {
  language: NovelLanguage
  // Solo en ediciones en inglés: país de publicación
  country?: NovelCountry
  // Solo en ediciones en castellano: publicada en España o solo fuera
  spain?: boolean
  // Solo si cambia respecto al título original
  title?: string
  publisher: string
  date?: string
  // Sin formato cuando las fuentes no lo indican
  format?: NovelFormat
  isbn13?: number
  cover?: string
  // Fuente de la edición, cuando no es la misma que la de la novela
  source?: string
  // Solo en ediciones web: copia en el Internet Archive
  url?: string
  purchase_links?: PurchaseLink[]
}

export interface Novel {
  slug: string
  title: string
  // Solo si el título calculado de las ediciones no sirve, como en las novelas partidas en
  // dos tomos en castellano («Los caballeros de Takhisis / La guerra de los dioses»)
  title_es?: string
  authors: string[]
  setting: NovelSetting
  kind: NovelKind
  series?: { id: string; number: number }
  // Primera edición en inglés
  date?: string
  description: string
  // Página que confirma que la novela es oficial
  source: string
  editions: NovelEdition[]
  related_products?: { edition: Edition; code: string }[]
  related_videogames?: string[]
  related_merchandise?: string[]
}

// Volumen que reúne varias novelas: se guarda una vez, en su serie
export interface NovelCollection extends Omit<NovelEdition, 'url' | 'format'> {
  title: string
  format?: Exclude<NovelFormat, 'web'>
  novels: string[]
}

export interface NovelSeries {
  id: string
  title: string
  title_es?: string
  setting: NovelSetting
  collections?: NovelCollection[]
}

// Antología de relatos: sin ficha propia, se muestra en las novelas de sus series o en las
// novelas que indica
export interface NovelAnthology {
  id: string
  title: string
  title_es?: string
  settings: NovelSetting[]
  description: string
  source: string
  series?: string[]
  novels?: string[]
  editions: NovelEdition[]
}

// spain: alguna edición en castellano publicada en España; elsewhere: solo fuera; none: ninguna
export type NovelSpanish = 'spain' | 'elsewhere' | 'none'

export interface NovelWithMeta extends Novel {
  year: number | null
  // Título de la edición en castellano más reciente
  titleEs: string | null
  spanish: NovelSpanish
  availableToBuy: boolean
  // Títulos en inglés y en castellano y autores, en minúsculas y sin tildes
  searchText: string
}

// Lo que el listado sabe de cada novela, sin descripción ni ediciones (virtual:novels-index)
export interface NovelSummary extends Pick<
  NovelWithMeta,
  | 'slug'
  | 'title'
  | 'titleEs'
  | 'authors'
  | 'setting'
  | 'kind'
  | 'series'
  | 'date'
  | 'year'
  | 'spanish'
  | 'availableToBuy'
  | 'searchText'
> {
  // Miniatura de la portada principal
  thumbnail: string | null
}

export interface NovelIndex {
  novels: NovelSummary[]
  // Sin recopilatorios: esos solo hacen falta en la ficha
  series: Omit<NovelSeries, 'collections'>[]
}
