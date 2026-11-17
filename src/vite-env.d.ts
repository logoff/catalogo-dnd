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
