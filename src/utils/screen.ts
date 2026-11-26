import type {
  ScreenKind,
  ScreenLanguage,
  ScreenMedium,
  ScreenPhysicalEdition,
  ScreenWorkWithMeta,
} from '@/types/screen'
import { SITE_URL } from './constants'
import { videoObject } from './youtube'

export const kindNames: Record<ScreenKind, string> = {
  film: 'Película',
  series: 'Serie',
  documentary: 'Documental',
  episode: 'Episodio',
}

export const kindPluralNames: Record<ScreenKind, string> = {
  film: 'Películas',
  series: 'Series',
  documentary: 'Documentales',
  episode: 'Episodios',
}

export const mediumNames: Record<ScreenMedium, string> = {
  cinema: 'Cines',
  tv: 'Televisión',
  streaming: 'Streaming',
  home_video: 'Directo a vídeo',
}

export const formatNames: Record<ScreenPhysicalEdition['format'], string> = {
  dvd: 'DVD',
  bluray: 'Blu-ray',
  uhd: '4K Ultra HD',
}

export const languageNames: Record<ScreenLanguage, string> = {
  en: 'Versión original en inglés',
  es: 'En castellano',
  pt: 'Versión original en portugués',
}

const COUNTRY_NAMES: Record<string, string> = {
  us: 'EE. UU.',
  es: 'España',
  gb: 'Reino Unido',
  br: 'Brasil',
}

export function countryName(code: string): string {
  return COUNTRY_NAMES[code] ?? code.toUpperCase()
}

// Años de una serie («1983–1985», «2022–» si sigue) o año de estreno del resto
export function yearsLabel(work: ScreenWorkWithMeta): string | null {
  if (work.series) {
    const { start_year: start, end_year: end } = work.series
    return end ? (end === start ? String(start) : `${start}–${end}`) : `${start}–`
  }
  return work.year ? String(work.year) : null
}

export function seasonsLabel(seasons: number): string {
  return seasons === 1 ? '1 temporada' : `${seasons} temporadas`
}

// Audio y subtítulos en castellano de una edición física
export function physicalSpanishLabel(edition: ScreenPhysicalEdition): string {
  if (edition.spanish_audio && edition.spanish_subtitles) return 'Audio y subtítulos en castellano'
  if (edition.spanish_audio) return 'Audio en castellano'
  if (edition.spanish_subtitles) return 'Subtítulos en castellano'
  return 'Sin castellano'
}

export type ScreenSort = 'date-desc' | 'date-asc' | 'title'

export interface ScreenFilters {
  kind: ScreenKind | 'all'
  spanishOnly: boolean
}

export function filterScreenWorks(
  works: ScreenWorkWithMeta[],
  { kind, spanishOnly }: ScreenFilters
): ScreenWorkWithMeta[] {
  return works.filter(
    (work) => (kind === 'all' || work.kind === kind) && (!spanishOnly || work.hasSpanish)
  )
}

// Las anunciadas sin fecha van al principio en «más recientes» y al final en «más antiguas»
export function sortScreenWorks(
  works: ScreenWorkWithMeta[],
  sort: ScreenSort
): ScreenWorkWithMeta[] {
  const byTitle = (a: ScreenWorkWithMeta, b: ScreenWorkWithMeta) =>
    a.displayTitle.localeCompare(b.displayTitle, 'es')
  return [...works].sort((a, b) => {
    if (sort === 'title') return byTitle(a, b)
    const dateA = a.firstReleaseDate ?? '9999'
    const dateB = b.firstReleaseDate ?? '9999'
    const order = sort === 'date-desc' ? dateB.localeCompare(dateA) : dateA.localeCompare(dateB)
    return order || byTitle(a, b)
  })
}

// Datos estructurados de Schema.org: Movie o TVSeries, sin valoraciones
export function screenStructuredData(work: ScreenWorkWithMeta) {
  const isSeries = Boolean(work.series)
  const sameAs = [work.official_url, work.external?.imdb, work.external?.filmaffinity].filter(
    Boolean
  )
  return {
    '@context': 'https://schema.org',
    '@type': isSeries ? 'TVSeries' : 'Movie',
    name: work.title,
    ...(work.title_es && { alternateName: work.title_es }),
    description: work.description.split(/\n\s*\n/)[0],
    url: `${SITE_URL}/cine-y-series/${work.slug}`,
    ...(work.poster && { image: `${SITE_URL}${work.poster.image}` }),
    ...(isSeries
      ? {
          startDate: String(work.series!.start_year),
          ...(work.series!.end_year && { endDate: String(work.series!.end_year) }),
          numberOfSeasons: work.series!.seasons,
        }
      : work.firstReleaseDate && { datePublished: work.firstReleaseDate }),
    ...(sameAs.length > 0 && { sameAs }),
    ...(work.trailers.length > 0 && {
      trailer: work.trailers.map((trailer) =>
        videoObject(trailer, `Tráiler de ${work.title}, publicado por ${trailer.channel}.`)
      ),
    }),
  }
}
