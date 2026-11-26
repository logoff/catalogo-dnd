import type { ScreenWork, ScreenWorkWithMeta } from '@/types/screen'

// Todos los JSON de cine y series, importados en tiempo de build. Son pocos: van en el
// bundle principal, y así las fichas de novelas y merchandising pueden buscar sus obras
const screenModules = import.meta.glob<ScreenWork>('/data/screen/*/*.json', {
  eager: true,
  import: 'default',
})

export function trailerThumbnail(slug: string, youtube: string): string {
  return `/images/screen/${slug}/video-${youtube}.jpg`
}

// La miniatura de un cartel va junto a él: poster-es.webp → poster-es-thumb.webp
export function posterThumbnail(image: string): string {
  return image.replace(/\.webp$/, '-thumb.webp')
}

export function enrichScreenWork(work: ScreenWork): ScreenWorkWithMeta {
  const releases = [...(work.releases ?? [])].sort((a, b) => a.date.localeCompare(b.date))
  const posters = (work.posters ?? []).map((poster) => ({
    ...poster,
    thumbnail: posterThumbnail(poster.image),
  }))
  // El tráiler en castellano, primero; el resto, en el orden de los datos
  const trailers = (work.trailers ?? [])
    .map((trailer) => ({ ...trailer, thumbnail: trailerThumbnail(work.slug, trailer.youtube) }))
    .sort((a, b) => Number(b.language === 'es') - Number(a.language === 'es'))
  const firstReleaseDate =
    releases[0]?.date ?? (work.series ? String(work.series.start_year) : null)
  const physical = work.physical_editions ?? []

  return {
    ...work,
    releases,
    posters,
    trailers,
    displayTitle: work.title_es ?? work.title,
    poster: posters.find((p) => p.language === 'es') ?? posters[0] ?? null,
    firstReleaseDate,
    year: firstReleaseDate ? Number(firstReleaseDate.slice(0, 4)) : null,
    hasSpanish:
      Boolean(work.title_es) ||
      releases.some((r) => r.country === 'es') ||
      physical.some((e) => e.spanish_audio || e.spanish_subtitles),
    availableToBuy: physical.some((e) => (e.purchase_links ?? []).length > 0),
  }
}

// De la más reciente a la más antigua; las anunciadas sin fecha, primero
export function compareByDate(a: ScreenWorkWithMeta, b: ScreenWorkWithMeta): number {
  const dateA = a.firstReleaseDate ?? '9999'
  const dateB = b.firstReleaseDate ?? '9999'
  return dateB.localeCompare(dateA) || a.title.localeCompare(b.title)
}

let cachedWorks: ScreenWorkWithMeta[] | null = null

export function getAllScreenWorks(): ScreenWorkWithMeta[] {
  if (!cachedWorks) {
    cachedWorks = Object.values(screenModules).map(enrichScreenWork).sort(compareByDate)
  }
  return cachedWorks
}

export function getScreenWorkBySlug(slug: string): ScreenWorkWithMeta | undefined {
  return getAllScreenWorks().find((work) => work.slug === slug)
}

// Relaciones en sentido inverso: las obras solo se guardan en la ficha de la obra
export function getScreenWorksForNovel(slug: string): ScreenWorkWithMeta[] {
  return getAllScreenWorks().filter((work) => work.related_novels?.includes(slug))
}

export function getScreenWorksForMerchandise(slug: string): ScreenWorkWithMeta[] {
  return getAllScreenWorks().filter((work) => work.related_merchandise?.includes(slug))
}

export function getScreenWorksForVideogame(slug: string): ScreenWorkWithMeta[] {
  return getAllScreenWorks().filter((work) => work.related_videogames?.includes(slug))
}

// Rutas de los JSON, para los tests de datos
export function getScreenFiles(): Record<string, ScreenWork> {
  return screenModules
}

// Carpeta de cada tipo de obra en data/screen/
export const KIND_DIRECTORIES: Record<ScreenWork['kind'], string> = {
  film: 'films',
  series: 'series',
  documentary: 'documentaries',
  episode: 'episodes',
}
