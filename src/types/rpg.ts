import type { World } from '../utils/worlds.ts'
import type { PurchaseLink } from './index'

// license: texto legal que permite publicar; reference_document: reglas publicadas bajo una
// licencia (SRD); community_license: licencia de un editor para su propio juego
export type LicenseKind = 'license' | 'reference_document' | 'community_license'

export interface LicenseLink {
  label: string
  url: string
}

export interface License {
  slug: string
  name: string
  // Nombre corto para etiquetas y filtros (OGL 1.0a, SRD 5.1, ORC…)
  short_name?: string
  kind: LicenseKind
  holder: string
  date: string
  // Explicación propia: qué es, qué permite y qué no
  description: string
  links: LicenseLink[]
  // Solo en documentos de referencia: licencias bajo las que se publican
  published_under?: { license: string; since?: string }[]
  status_notes?: { date: string; text: string; source: string }[]
}

// revision: revisión con cambios menores; compatible: reescrito, pero en general compatible;
// major_rewrite: cambio mayor de reglas; inspiration: inspiración, sin compatibilidad
export type DerivationKind = 'revision' | 'compatible' | 'major_rewrite' | 'inspiration'

export interface Derivation {
  system: string
  kind: DerivationKind
  // Licencia a través de la que deriva, si la hay
  via_license?: string
  // Matiza la relación; obligatoria en las de inspiración
  note?: string
}

export interface SystemLicense {
  license: string
  // Fecha o versión desde la que la usa (por ejemplo, «Remaster»)
  since?: string
  note?: string
}

// Una edición concreta de un juego (Pathfinder 1E y 2E son sistemas distintos)
export type RpgMovement = 'osr' | 'nsr'

export interface RpgSystem {
  slug: string
  name: string
  // Agrupa las ediciones del mismo juego
  family: string
  publisher: string
  date: string
  description: string
  features: string[]
  // Vacío si no tiene licencia abierta
  licenses: SystemLicense[]
  derived_from?: Derivation[]
  // Movimiento OSR o NSR; nunca en las ediciones de D&D
  movement?: RpgMovement
  // Editoriales de la línea propia de un juego OSR o NSR si hay más de una (por defecto, publisher)
  line_publishers?: string[]
  // Edición oficial de D&D; si no tiene official_catalog, va en la sección de ediciones anteriores
  official?: boolean
  // Solo en los sistemas de D&D: ruta del catálogo oficial del sitio, sin duplicar sus libros
  official_catalog?: '/2014' | '/2024'
  links: LicenseLink[]
}

export type RpgBookKind = 'core' | 'starter' | 'supplement' | 'adventure' | 'setting' | 'other'

export type RpgLanguage = 'english' | 'castellano'

export type RpgFormat = 'hardcover' | 'paperback' | 'boxed_set' | 'pdf'

export interface RpgEdition {
  language: RpgLanguage
  // Solo si cambia respecto al título original
  title?: string
  publisher: string
  date?: string
  format?: RpgFormat
  isbn13?: number
  cover?: string
  // Fuente de la edición, cuando no es la misma que la del libro
  source?: string
  purchase_links?: PurchaseLink[]
}

export interface RpgBook {
  slug: string
  system: string
  title: string
  title_es?: string
  kind: RpgBookKind
  // Mundos en los que transcurre o que describe
  settings?: World[]
  // Básico o caja de inicio de un sistema grande
  core?: boolean
  // Solo si no usa las licencias de su sistema: otra licencia, o «none» si solo se declara
  // compatible
  license?: string
  description: string
  source: string
  editions: RpgEdition[]
}

export interface RpgBookWithMeta extends RpgBook {
  // Título de la edición en castellano más reciente, o title_es
  titleEs: string | null
  // Fecha de la edición original (la primera en inglés o, si no la hay, la primera de todas)
  originalDate: string | null
  // Fecha de la primera edición en castellano
  spanishDate: string | null
  // Fecha de la edición más reciente, para ordenar
  latestDate: string | null
  spanish: boolean
  // Licencias que se le aplican: la propia o las de su sistema; vacío si no usa ninguna
  licenses: string[]
  publishers: string[]
  // Títulos y editoriales, en minúsculas y sin tildes
  searchText: string
  // Movimiento de su sistema (OSR o NSR), o null si no tiene
  movement: RpgMovement | null
}

// Lo que el listado sabe de cada libro, sin descripción ni ediciones (virtual:rpg-index)
export interface RpgBookSummary extends Pick<
  RpgBookWithMeta,
  | 'slug'
  | 'system'
  | 'title'
  | 'titleEs'
  | 'kind'
  | 'settings'
  | 'originalDate'
  | 'spanishDate'
  | 'latestDate'
  | 'spanish'
  | 'licenses'
  | 'publishers'
  | 'searchText'
  | 'movement'
> {
  // Miniatura de la portada principal
  thumbnail: string | null
}

// Licencias y sistemas son pocos y los necesitan el listado, los filtros y las fichas: van
// enteros en el índice
export interface RpgIndex {
  licenses: License[]
  systems: RpgSystem[]
  books: RpgBookSummary[]
}
