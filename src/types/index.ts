export type PublicationType = 'book' | 'boxed_set' | 'accessory'

export type PublicationSubtype =
  // 2014 Books
  | 'core_rules'
  | 'supplemental_rules'
  | 'setting'
  | 'adventure'
  // 2024 Books
  | 'rules_expansion'
  | 'player_expansion'
  | 'dungeon_master_expansion'
  | 'adventure_anthology'
  | 'gameplay_expansion'
  | 'adventure_expansion'
  | 'setting_expansion'
  // Boxed Sets
  | 'starter_set'
  | 'rules'
  | 'adventure_setting'
  | 'others'
  // Accessories (2024)
  | 'character_sheet'
  | 'screen'
  | 'map_pack'
  | 'card_deck'

export type Edition = '5e' | '2024'

export type Language = 'english' | 'castellano'

export interface SubPublication {
  title: string
  pages?: number
  images?: string[]
}

export interface Publication {
  type: PublicationType
  subtype: PublicationSubtype
  edition: Edition
  title: string
  language?: Language
  date?: string
  item_code?: string
  authors?: string[]
  pages?: number
  publisher?: string
  isbn13?: number
  images?: string[]
  official_url?: string
  wpn_url?: string
  openlibrary_url?: string
  amazon_link?: string
  sub_publications?: SubPublication[]
}

export interface Product {
  code: string
  publications: Publication[]
}

export interface ProductWithMeta extends Product {
  primaryTitle: string
  primaryEdition: Edition
  primaryType: PublicationType
  primarySubtype: PublicationSubtype
  languages: Language[]
  dateRange: {
    earliest: string | null
    latest: string | null
  }
  slug: string
}

export interface FilterState {
  searchQuery: string
  editions: Edition[]
  types: PublicationType[]
  subtypes: PublicationSubtype[]
  languages: Language[]
}

export interface SortOption {
  field: 'title' | 'date' | 'code'
  direction: 'asc' | 'desc'
}

export interface Category {
  id: string
  name: string
  path: string
  count: number
}
