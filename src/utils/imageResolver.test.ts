import { describe, it, expect, vi } from 'vitest'
import { resolveImageSrc } from './imageResolver'

// Mock import.meta.env.BASE_URL para simular diferentes entornos
vi.mock('./constants', () => ({
  getAssetPath: (path: string) => {
    const basePath = '/catalogo-dnd/' // Simula producción
    return `${basePath}${path.startsWith('/') ? path.slice(1) : path}`
  },
}))

describe('resolveImageSrc', () => {
  describe('rutas locales (producción)', () => {
    it('añade el base path a rutas que empiezan con /', () => {
      const result = resolveImageSrc('/images/products/phb/pub0_img0.jpg')
      expect(result).toBe('/catalogo-dnd/images/products/phb/pub0_img0.jpg')
    })

    it('añade el base path a rutas relativas', () => {
      const result = resolveImageSrc('images/products/phb/pub0_img0.jpg')
      expect(result).toBe('/catalogo-dnd/images/products/phb/pub0_img0.jpg')
    })

    it('maneja rutas del placeholder correctamente', () => {
      const result = resolveImageSrc('/images/placeholder.png')
      expect(result).toBe('/catalogo-dnd/images/placeholder.png')
    })
  })

  describe('URLs externas', () => {
    it('no modifica URLs https', () => {
      const url = 'https://example.com/image.jpg'
      expect(resolveImageSrc(url)).toBe(url)
    })

    it('no modifica URLs http', () => {
      const url = 'http://example.com/image.jpg'
      expect(resolveImageSrc(url)).toBe(url)
    })

    it('no modifica el placeholder de Wikipedia', () => {
      const url =
        'https://upload.wikimedia.org/wikipedia/commons/thumb/d/da/Imagen_no_disponible.svg/240px-Imagen_no_disponible.svg.png'
      expect(resolveImageSrc(url)).toBe(url)
    })
  })
})
