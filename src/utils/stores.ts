import type { Store } from '@/types'

interface StoreConfig {
  label: string
  // Imagen del botón, relativa a public/ (la que proporcione el programa de afiliados)
  image?: string
  // Clases de Tailwind para el fondo del botón
  color: string
  // Convierte la URL del producto en un enlace de afiliado. Sin definir, se usa la URL tal cual
  affiliate?: (url: string) => string
}

// Los IDs de afiliado no se guardan en el repositorio: llegan en el build como variables
// de entorno (secretos del repositorio en el despliegue, `.env` en local). Sin ellas, los
// enlaces se publican sin afiliado.
const env = import.meta.env

export function amazonAffiliate(tag?: string): StoreConfig['affiliate'] {
  return tag ? (url) => withParam(url, 'tag', tag) : undefined
}

export function adtractionAffiliate(
  programId?: string,
  channelId?: string
): StoreConfig['affiliate'] {
  if (!programId || !channelId) return undefined
  return (url) =>
    `https://go.adtraction.com/t/t?${new URLSearchParams({ a: programId, as: channelId, t: '2', tk: '1', url })}`
}

export const STORES: Record<Store, StoreConfig> = {
  amazon: {
    label: 'Amazon',
    image: 'images/stores/amazon.png',
    color: 'from-[#131A22] to-[#232f3e] hover:from-[#232f3e] hover:to-[#131A22]',
    affiliate: amazonAffiliate(env.VITE_AFFILIATE_AMAZON_TAG),
  },
  generacion_x: {
    label: 'Generación X',
    color: 'from-amber-600 to-amber-800 hover:from-amber-500 hover:to-amber-700',
    affiliate: adtractionAffiliate(
      env.VITE_AFFILIATE_GENERACION_X_PROGRAM,
      env.VITE_AFFILIATE_ADTRACTION_CHANNEL
    ),
  },
  juegos_mesa_redonda: {
    label: 'Juegos de la Mesa Redonda',
    color: 'from-amber-600 to-amber-800 hover:from-amber-500 hover:to-amber-700',
    affiliate: adtractionAffiliate(
      env.VITE_AFFILIATE_JUEGOS_MESA_REDONDA_PROGRAM,
      env.VITE_AFFILIATE_ADTRACTION_CHANNEL
    ),
  },
}

export function withParam(url: string, name: string, value: string): string {
  const parsed = new URL(url)
  parsed.searchParams.set(name, value)
  return parsed.toString()
}

export function getPurchaseUrl(store: Store, url: string): string {
  return STORES[store].affiliate?.(url) ?? url
}
