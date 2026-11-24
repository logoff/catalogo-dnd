import type { Edition, PurchaseLink } from './index'

// Mundo de campaña: el de las novelas más «varios» (antologías como The Worlds of D&D) y «sin
// mundo» (cruces y cómics que no pasan en ningún mundo concreto)
export type ComicSetting =
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
  | 'multiple'
  | 'none'

export type ComicKind =
  'ongoing' | 'limited_series' | 'one_shot' | 'graphic_novel' | 'promotional' | 'webcomic'

export type ComicFormat = 'paperback' | 'hardcover' | 'omnibus' | 'digital' | 'issue'

export interface ComicIssue {
  // Texto: «1», «0», «Annual 1»
  number: string
  title?: string
  date?: string
  writers?: string[]
  artists?: string[]
  cover?: string
  cover_source?: string
}

// Qué números de qué serie recoge un tomo; issues es un rango: «1-5», «1-3, 6»
export interface ComicContents {
  series: string
  issues: string
}

export interface ComicEdition {
  // Solo en collections.json (tomos de varias series)
  id?: string
  language: 'english' | 'castellano'
  // Solo en castellano: publicada en España o solo fuera
  spain?: boolean
  title?: string
  publisher: string
  date?: string
  format: ComicFormat
  isbn13?: number
  cover?: string
  cover_source?: string
  // Tomos: qué números recoge
  contents?: ComicContents[]
  // Grapas (format: issue): sus números, con la numeración y las fechas de esa edición
  issues?: ComicIssue[]
  source?: string
  purchase_links?: PurchaseLink[]
}

export interface Comic {
  slug: string
  title: string
  title_es?: string
  // Solo en las series publicadas primero en castellano (Planeta, Timun Mas)
  language?: 'castellano'
  publisher: string
  setting: ComicSetting
  kind: ComicKind
  date: string
  end_date?: string
  // Anunciada y todavía sin publicar entera: issue_count es el anunciado
  announced?: boolean
  issue_count: number
  writers?: string[]
  artists?: string[]
  description: string
  source: string
  issues: ComicIssue[]
  editions?: ComicEdition[]
  // Slug de la serie que continúa
  continues?: string
  related_novels?: string[]
  related_videogames?: string[]
  related_merchandise?: string[]
  related_products?: { edition: Edition; code: string }[]
}

// Una edición tal como la ve una serie: las suyas y los tomos de collections.json que la recogen
export interface ComicEditionWithMeta extends ComicEdition {
  // Otras series que recoge el tomo, además de esta
  otherSeries: string[]
}

export interface ComicWithMeta extends Comic {
  // Años de publicación: «2021» o «1988-1991»
  years: string
  editions: ComicEditionWithMeta[]
  // Título en castellano que se muestra: el de la serie o el de su edición en castellano más reciente
  spanishTitle: string | null
  // spain: alguna edición en castellano publicada en España; elsewhere: solo fuera; none: ninguna
  spanish: 'spain' | 'elsewhere' | 'none'
  availableToBuy: boolean
  // Portada principal: la del primer número con portada o, si no hay, la del primer tomo
  cover: string | null
  // Tomos en los que se recoge cada número, por número
  collectedIn: Record<string, string[]>
  // Serie que continúa a esta (el inverso de continues)
  continuedBy: string | null
}

// Lo que lleva el índice ligero del listado (virtual:comics-index)
export interface ComicSummary {
  slug: string
  title: string
  spanishTitle: string | null
  publisher: string
  setting: ComicSetting
  kind: ComicKind
  date: string
  years: string
  issue_count: number
  announced: boolean
  // Miniatura de la portada principal
  thumbnail: string | null
  spanish: 'spain' | 'elsewhere' | 'none'
  availableToBuy: boolean
  // Serie que continúa a esta, para la ficha
  continuedBy: string | null
  // Títulos de la serie y de sus tomos y autores, normalizados, para la búsqueda
  searchText: string
}

// Cómics que enlazan a cada ficha de otra sección (virtual:comics-related)
export type ComicRelations = Record<
  'novels' | 'videogames' | 'merchandise' | 'products',
  Record<string, { slug: string; title: string }[]>
>
