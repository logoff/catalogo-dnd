import { describe, it, expect } from 'vitest'
import { getAllProducts } from './dataLoader'

describe('datos de productos', () => {
  it('todos los productos tienen descripción', () => {
    const withoutDescription = getAllProducts()
      .filter((p) => !p.description?.trim())
      .map((p) => `${p.primaryEdition}/${p.code}`)
    expect(withoutDescription).toEqual([])
  })
})
