import { describe, it, expect } from 'vitest'
import type { PurchaseLink } from '@/types'

// Todos los JSON con enlaces de compra: libros de rol, merchandising, novelas y antologías
const files = import.meta.glob<unknown>(
  [
    '/data/{2014,2024}/products/**/*.json',
    '/data/merchandising/items/*/*.json',
    '/data/novels/*/*.json',
    '/data/novels/anthologies.json',
  ],
  { eager: true, import: 'default' }
)

function linkLists(value: unknown): PurchaseLink[][] {
  if (Array.isArray(value)) return value.flatMap(linkLists)
  if (!value || typeof value !== 'object') return []
  return Object.entries(value).flatMap(([key, child]) =>
    key === 'purchase_links' ? [child as PurchaseLink[]] : linkLists(child)
  )
}

describe('enlaces de compra', () => {
  it('Casa del Libro va siempre detrás de Amazon', () => {
    const wrong = Object.entries(files).flatMap(([path, data]) =>
      linkLists(data)
        .filter((links) => {
          const stores = links.map((link) => link.store)
          return stores.includes('amazon') && stores.indexOf('casa_del_libro') === 0
        })
        .map(() => path)
    )
    expect(wrong).toEqual([])
  })
})
