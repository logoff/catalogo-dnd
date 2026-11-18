import { describe, it, expect } from 'vitest'
import { getProductByCodeAndEdition } from '@/services/dataLoader'
import { bilingualTitle, firstPublication, latestInSpanish, translationDelay } from './releases'
import type { ProductWithMeta } from '@/types'

const product = (code: string, edition: '5e' | '2024') => getProductByCodeAndEdition(code, edition)!

describe('firstPublication', () => {
  it('devuelve la publicación más temprana en ese idioma', () => {
    expect(firstPublication(product('PHB', '2024'), 'castellano')?.title).toBe('Manual del Jugador')
    expect(firstPublication(product('PHB', '2024'), 'english')?.date).toBe('2024-09-17')
  })

  it('no devuelve nada si no hay edición en ese idioma', () => {
    expect(firstPublication(product('WttHC', '2024'), 'castellano')).toBeUndefined()
  })
})

describe('translationDelay', () => {
  it('cuenta los meses entre la edición inglesa y la castellana', () => {
    expect(translationDelay(product('PHB', '2024'))).toBe(6)
  })

  it('no da plazo si falta alguna de las dos', () => {
    expect(translationDelay(product('WttHC', '2024'))).toBeUndefined()
  })
})

describe('bilingualTitle', () => {
  it('añade el título en castellano entre paréntesis', () => {
    expect(bilingualTitle(product('PHB', '2024'))).toBe("Player's Handbook (Manual del Jugador)")
  })

  it('usa solo el título en castellano si ya incluye el original', () => {
    expect(bilingualTitle(product('PHB', '5e'))).toBe("Player's Handbook: Manual del Jugador")
  })

  it('deja el título original si no hay edición en castellano', () => {
    expect(bilingualTitle(product('WttHC', '2024'))).toBe(
      'Stranger Things: Welcome to the Hellfire Club'
    )
  })
})

describe('latestInSpanish', () => {
  const book = (code: string, dates: (string | undefined)[]) =>
    ({
      code,
      publications: dates.map((date) => ({ language: 'castellano', date })),
    }) as unknown as ProductWithMeta

  it('ordena por la última fecha en castellano y deja fuera las futuras y sin fecha', () => {
    const products = [
      book('A', ['2021-07-21']),
      book('B', ['2025-03-31', '2027-01-01']),
      book('C', [undefined]),
      book('D', ['2026-12-01']),
      book('E', ['2024-01-10']),
    ]
    const codes = latestInSpanish(products, 3, '2026-11-18').map((p) => p.code)
    expect(codes).toEqual(['B', 'E', 'A'])
  })
})
