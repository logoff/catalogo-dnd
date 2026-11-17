import { describe, it, expect } from 'vitest'
import { isbn10To13, isValidIsbn13 } from './isbn'

describe('isValidIsbn13', () => {
  it('acepta ISBN reales en inglés y en castellano', () => {
    // Dragons of Autumn Twilight (TSR, 1984)
    expect(isValidIsbn13(9780880381734)).toBe(true)
    // Crónicas de la Dragonlance nº 01/03 (Minotauro, ebook)
    expect(isValidIsbn13('9788448008086')).toBe(true)
  })

  it('rechaza un dígito de control incorrecto, otra longitud u otro prefijo', () => {
    expect(isValidIsbn13(9780880381735)).toBe(false)
    expect(isValidIsbn13(978088038173)).toBe(false)
    expect(isValidIsbn13(9770880381734)).toBe(false)
  })
})

describe('isbn10To13', () => {
  it('convierte un ISBN-10 con guiones de TSR', () => {
    expect(isbn10To13('0-88038-173-6')).toBe(9780880381734)
  })

  it('convierte un ISBN-10 de Timun Mas', () => {
    // El retorno de los dragones (Timun Mas, 1986)
    expect(isbn10To13('84-7176-877-1')).toBe(9788471768773)
  })

  it('convierte un ISBN-10 terminado en X', () => {
    // Sea of Death (Ace, 1987)
    expect(isbn10To13('0-441-75676-X')).toBe(9780441756766)
  })

  it('rechaza un ISBN-10 mal formado', () => {
    expect(() => isbn10To13('12345')).toThrow()
  })
})
