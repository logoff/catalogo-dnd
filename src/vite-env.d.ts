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
