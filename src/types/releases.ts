import type { Language } from './index'

// Sección del catálogo a la que pertenece una novedad
export type ReleaseSection =
  'libros' | 'videojuegos' | 'merchandising' | 'novelas' | 'comics' | 'rol' | 'ediciones'

// Una edición de la página de novedades (ver scripts/releases.mjs)
export interface Release {
  name: string
  // Ruta de su ficha
  path: string
  section: ReleaseSection
  // El juego de los libros de otros juegos de rol y de ediciones anteriores
  context?: string
  // Clave estable dentro de la ficha
  key: string
  // Los videojuegos y algunos artículos de merchandising no tienen idioma
  language?: Language
  // Fecha completa (las de mes cuentan desde el día 1); los anunciados no la tienen
  date?: string
  // La fecha solo da el mes (y se cuenta desde el día 1)
  monthOnly?: boolean
  // Solo el año, en los anunciados que lo dan
  year?: string
}

export interface ReleasesIndex {
  // Día del build, en hora de Madrid
  today: string
  upcoming: Release[]
  recent: Release[]
  announced: Release[]
}
