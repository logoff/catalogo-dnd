import { getAssetPath } from './constants'

/**
 * Resuelve rutas de imágenes aplicando el base path para rutas locales.
 * Las URLs externas (http/https) se devuelven sin modificar.
 */
export function resolveImageSrc(src: string): string {
  if (src.startsWith('http://') || src.startsWith('https://')) {
    return src
  }
  return getAssetPath(src)
}
