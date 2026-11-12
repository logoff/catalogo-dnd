import { describe, it, expect } from 'vitest'
import { getAllProducts } from './dataLoader'

describe('datos de productos', () => {
  it('todos los productos tienen descripción', () => {
    const withoutDescription = getAllProducts()
      .filter((p) => !p.description?.trim())
      .map((p) => `${p.primaryEdition}/${p.code}`)
    expect(withoutDescription).toEqual([])
  })

  it('el catálogo de libros no incluye los videojuegos', () => {
    const notProducts = getAllProducts()
      .filter((p) => !Array.isArray(p.publications) || p.publications.length === 0)
      .map((p) => p.code ?? p.slug)
    expect(notProducts).toEqual([])
  })

  it('todos los ISBN-13 tienen un dígito de control válido', () => {
    const isValidIsbn13 = (isbn: number) => {
      const digits = String(isbn)
      if (!/^\d{13}$/.test(digits)) return false
      const sum = [...digits].reduce((acc, d, i) => acc + Number(d) * (i % 2 === 0 ? 1 : 3), 0)
      return sum % 10 === 0
    }
    const invalid = getAllProducts()
      .flatMap((p) => p.publications)
      .filter((pub) => pub.isbn13 !== undefined && !isValidIsbn13(pub.isbn13))
      .map((pub) => `${pub.title}: ${pub.isbn13}`)
    expect(invalid).toEqual([])
  })
})
