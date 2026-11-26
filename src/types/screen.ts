// Películas, series, documentales y episodios de D&D (data/screen/), oficiales o no

export type ScreenKind = 'film' | 'series' | 'documentary' | 'episode'

export type ScreenMedium = 'cinema' | 'tv' | 'streaming' | 'home_video'

// Idioma original o castellano de carteles y tráileres
export type ScreenLanguage = 'en' | 'es' | 'pt'

export interface ScreenRelease {
  // Código ISO 3166-1 en minúsculas: us, es…
  country: string
  medium: ScreenMedium
  // Año, año y mes o fecha completa
  date: string
  network?: string
}

export interface ScreenPhysicalEdition {
  format: 'dvd' | 'bluray' | 'uhd'
  year?: number
  title?: string
  spanish_audio: boolean
  spanish_subtitles: boolean
  purchase_links?: { store: 'amazon'; url: string }[]
}

export interface ScreenPoster {
  language: ScreenLanguage
  image: string
  // Página oficial de donde sale
  source: string
}

export interface ScreenTrailer {
  youtube: string
  language: ScreenLanguage
  title: string
  channel: string
  date: string
}

export interface ScreenWork {
  slug: string
  kind: ScreenKind
  official: boolean
  // Solo en las obras no oficiales: por qué no lo son y qué relación tienen con D&D
  unofficial_reason?: string
  title: string
  title_es?: string
  // Solo en los episodios: la serie a la que pertenecen
  parent_series?: string
  description: string
  status: 'released' | 'announced'
  series?: { start_year: number; end_year?: number; seasons: number }
  releases?: ScreenRelease[]
  physical_editions?: ScreenPhysicalEdition[]
  posters?: ScreenPoster[]
  trailers?: ScreenTrailer[]
  external?: { imdb?: string; filmaffinity?: string; wikidata?: string }
  // Web oficial de la obra, si sigue activa
  official_url?: string
  related_novels?: string[]
  related_merchandise?: string[]
  related_videogames?: string[]
}

export interface ScreenPosterWithMeta extends ScreenPoster {
  thumbnail: string
}

export interface ScreenTrailerWithMeta extends ScreenTrailer {
  // Miniatura local, para no pedir nada a YouTube antes de reproducir
  thumbnail: string
}

export interface ScreenWorkWithMeta extends ScreenWork {
  posters: ScreenPosterWithMeta[]
  trailers: ScreenTrailerWithMeta[]
  // Releases ordenados por fecha
  releases: ScreenRelease[]
  // Título que se muestra: el de España si lo hay
  displayTitle: string
  // Cartel principal: el castellano si lo hay
  poster: ScreenPosterWithMeta | null
  // Primera fecha de estreno (o año de inicio de la serie)
  firstReleaseDate: string | null
  year: number | null
  // Estrenada o editada en España, o con título en España
  hasSpanish: boolean
  availableToBuy: boolean
}
