import type {
  BundleRelease,
  Platform,
  SpanishSummary,
  Videogame,
  VideogameBundle,
  VideogameWithMeta,
  GameRelease,
} from '@/types/videogame'

export function videoThumbnail(slug: string, youtube: string): string {
  return `/images/videogames/${slug}/video-${youtube}.jpg`
}

// Todos los JSON de videojuegos, importados en tiempo de build
const videogameModules = import.meta.glob<Videogame>('/data/videogames/games/**/*.json', {
  eager: true,
  import: 'default',
})

// Recopilaciones: un JSON por paquete, con sus juegos y sus enlaces de compra
const bundleModules = import.meta.glob<VideogameBundle>('/data/videogames/bundles/*.json', {
  eager: true,
  import: 'default',
})

const bundlesById = new Map(Object.values(bundleModules).map((bundle) => [bundle.id, bundle]))

export function getBundle(id: string): VideogameBundle | undefined {
  return bundlesById.get(id)
}

// Versión de la recopilación en la plataforma de un lanzamiento
export function getBundleRelease(release: GameRelease): BundleRelease | undefined {
  if (!release.bundle) return undefined
  return getBundle(release.bundle)?.releases.find((r) => r.platform === release.platform)
}

// Enlaces de compra vigentes de un lanzamiento: los suyos o los de su recopilación
export function purchaseLinksOf(release: GameRelease) {
  const source = release.bundle ? getBundleRelease(release) : release
  if (!source || release.delisted || source.delisted) return []
  return source.purchase_links ?? []
}

function spanishLevel(release: GameRelease): SpanishSummary {
  const { spanish } = release
  // Sin castellano confirmado, el lanzamiento cuenta como solo en inglés
  if (!spanish) return 'none'
  if (spanish.audio) return 'full'
  if (spanish.interface || spanish.subtitles) return 'text'
  return 'none'
}

// De mejor a peor
const SPANISH_RANK: SpanishSummary[] = ['full', 'text', 'none']

export function enrichVideogame(game: Videogame): VideogameWithMeta {
  // Las fechas ISO truncadas se ordenan bien como texto
  const dates = game.releases
    .map((r) => r.date)
    .filter((d): d is string => !!d)
    .sort()
  const firstReleaseDate = dates[0] ?? null

  const platforms = [...new Set(game.releases.map((r) => r.platform))] as Platform[]

  const levels = game.releases.map(spanishLevel)
  const spanishSummary = SPANISH_RANK.find((level) => levels.includes(level)) ?? 'none'

  const scores = (game.reviews ?? []).map((r) => Math.round((r.score / r.scale) * 100))
  const bestScore = scores.length > 0 ? Math.max(...scores) : null

  const availableToBuy = game.releases.some((r) => purchaseLinksOf(r).length > 0)

  return {
    ...game,
    videos: (game.videos ?? []).map((video) => ({
      ...video,
      thumbnail: videoThumbnail(game.slug, video.youtube),
    })),
    firstReleaseDate,
    decade: firstReleaseDate ? Math.floor(Number(firstReleaseDate.slice(0, 4)) / 10) * 10 : null,
    platforms,
    spanishSummary,
    bestScore,
    availableToBuy,
  }
}

let cachedVideogames: VideogameWithMeta[] | null = null

// Ordenados por fecha del primer lanzamiento; los anunciados sin fecha, al final
export function getAllVideogames(): VideogameWithMeta[] {
  if (!cachedVideogames) {
    cachedVideogames = Object.values(videogameModules)
      .map(enrichVideogame)
      .sort(
        (a, b) =>
          (a.firstReleaseDate ?? '9999').localeCompare(b.firstReleaseDate ?? '9999') ||
          a.title.localeCompare(b.title)
      )
  }
  return cachedVideogames
}

export function getVideogameBySlug(slug: string): VideogameWithMeta | undefined {
  return getAllVideogames().find((game) => game.slug === slug)
}

// Rutas de los JSON, para los tests de datos
export function getVideogameFiles(): Record<string, Videogame> {
  return videogameModules
}

export function getBundleFiles(): Record<string, VideogameBundle> {
  return bundleModules
}
