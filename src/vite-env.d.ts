/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_AFFILIATE_AMAZON_TAG?: string
  readonly VITE_AFFILIATE_ADTRACTION_CHANNEL?: string
  readonly VITE_AFFILIATE_GENERACION_X_PROGRAM?: string
  readonly VITE_AFFILIATE_JUEGOS_MESA_REDONDA_PROGRAM?: string
  readonly VITE_AFFILIATE_GOG_PROGRAM?: string
  readonly VITE_AFFILIATE_INSTANT_GAMING_REFERRAL?: string
  readonly VITE_AFFILIATE_AWIN_PUBLISHER?: string
  readonly VITE_AFFILIATE_FANATICAL_PROGRAM?: string
  readonly VITE_AFFILIATE_CASA_DEL_LIBRO_PROGRAM?: string
  readonly VITE_AFFILIATE_NEXTORY_PROGRAM?: string
  readonly VITE_AFFILIATE_NOSOLOROL_PROGRAM?: string
  readonly VITE_AFFILIATE_DRIVETHRU_ID?: string
}

// Índice de novelas generado en el build por el plugin novelsIndex (vite.config.ts)
declare module 'virtual:novels-index' {
  import type { NovelIndex } from '@/types/novel'
  const index: NovelIndex
  export default index
}

// Total de novelas y las más recientes, para la portada (plugin novelsIndex)
declare module 'virtual:novels-latest' {
  import type { NovelIndex, NovelSummary } from '@/types/novel'
  const latest: { total: number; latest: NovelSummary[]; series: NovelIndex['series'] }
  export default latest
}

// Índice de cómics generado en el build por el plugin comicsIndex (vite.config.ts)
declare module 'virtual:comics-index' {
  import type { ComicSummary } from '@/types/comic'
  const index: ComicSummary[]
  export default index
}

// Cuántas series de cómics hay, para la portada (plugin comicsIndex)
declare module 'virtual:comics-stats' {
  const stats: { total: number }
  export default stats
}

// Licencias, sistemas y resumen de los libros de otros juegos de rol (plugin rpgIndex)
declare module 'virtual:rpg-index' {
  import type { RpgIndex } from '@/types/rpg'
  const index: RpgIndex
  export default index
}

// Cuántos sistemas y libros hay en otros juegos de rol, para la portada (plugin rpgIndex)
declare module 'virtual:rpg-stats' {
  const stats: { systems: number; books: number }
  export default stats
}

// Novedades: lo próximo, lo reciente y lo anunciado, calculado en el build (plugin releasesIndex)
declare module 'virtual:releases' {
  import type { ReleasesIndex } from '@/types/releases'
  const releases: ReleasesIndex
  export default releases
}

// Resúmenes mensuales de cambios del catálogo, del más antiguo al más reciente (plugin monthlySummaries)
declare module 'virtual:monthly-summaries' {
  import type { MonthlySummary } from '@/types/monthlySummary'
  const summaries: { months: MonthlySummary[] }
  export default summaries
}
