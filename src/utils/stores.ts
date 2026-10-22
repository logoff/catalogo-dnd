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

// Para activar un programa de afiliados basta con añadir aquí su función `affiliate`
// y, si lo hay, su logo en `image`.
// Ej. Amazon: (url) => withParam(url, 'tag', 'mi-id-21')
// Ej. Adtraction: (url) => `https://go.adtraction.com/t/t?a=…&as=…&t=2&tk=1&url=${encodeURIComponent(url)}`
export const STORES: Record<Store, StoreConfig> = {
  amazon: {
    label: 'Amazon',
    image: 'images/stores/amazon.png',
    color: 'from-[#131A22] to-[#232f3e] hover:from-[#232f3e] hover:to-[#131A22]',
  },
  generacion_x: {
    label: 'Generación X',
    color: 'from-amber-600 to-amber-800 hover:from-amber-500 hover:to-amber-700',
  },
  juegos_mesa_redonda: {
    label: 'Juegos de la Mesa Redonda',
    color: 'from-amber-600 to-amber-800 hover:from-amber-500 hover:to-amber-700',
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
