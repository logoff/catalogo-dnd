import type { Edition, PurchaseLink } from './index'

export type MerchandiseGroup = 'books' | 'figures' | 'games'

export type MerchandiseKind =
  // Libros licenciados
  | 'cookbook'
  | 'craft_book'
  | 'art_book'
  | 'guide_book'
  // Figuras y juguetes
  | 'funko'
  | 'lego'
  | 'figure'
  | 'plush'
  | 'collectible_miniature'
  // Juegos de mesa y cartas
  | 'board_game'
  | 'card_game'

export interface MerchandiseEdition {
  // Sin idioma en artículos sin texto, como una figura
  language?: 'english' | 'castellano'
  // Solo en ediciones en castellano: publicada en España o solo fuera (por ejemplo, en EE. UU.)
  spain?: boolean
  title?: string
  publisher?: string
  date?: string
  isbn13?: number
  ean?: string
  purchase_links?: PurchaseLink[]
}

export interface Merchandise {
  slug: string
  title: string
  title_es?: string
  group: MerchandiseGroup
  kind: MerchandiseKind
  manufacturer: string
  date?: string
  description: string
  // Página oficial que confirma la licencia
  source: string
  editions: MerchandiseEdition[]
  images: string[]
  related_products?: { edition: Edition; code: string }[]
  related_videogames?: string[]
}

// spain: alguna edición en castellano publicada en España; elsewhere: solo fuera; none: ninguna
export type MerchandiseSpanish = 'spain' | 'elsewhere' | 'none'

export interface MerchandiseWithMeta extends Merchandise {
  year: number | null
  spanish: MerchandiseSpanish
  availableToBuy: boolean
}
