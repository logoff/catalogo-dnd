import { describe, expect, it } from 'vitest'
import { coverFileName, targetFor } from './comic-covers.mjs'

const comic = {
  issues: [{ number: '1' }, { number: 'Annual 1' }],
  editions: [
    { language: 'english', format: 'paperback', isbn13: 9781684058792 },
    { language: 'english', format: 'hardcover' },
    {
      language: 'castellano',
      format: 'issue',
      issues: [{ number: '1' }, { number: '2' }],
    },
  ],
}

describe('coverFileName', () => {
  it('pasa la clave a un nombre de archivo', () => {
    expect(coverFileName('1')).toBe('1')
    expect(coverFileName('Annual 1')).toBe('annual-1')
    expect(coverFileName('castellano-2')).toBe('castellano-2')
  })
})

describe('targetFor', () => {
  it('encuentra números, tomos por ISBN o por orden y grapas en castellano', () => {
    expect(targetFor(comic, '1')).toBe(comic.issues[0])
    expect(targetFor(comic, 'Annual 1')).toBe(comic.issues[1])
    expect(targetFor(comic, '9781684058792')).toBe(comic.editions[0])
    expect(targetFor(comic, 'tomo-2')).toBe(comic.editions[1])
    expect(targetFor(comic, 'castellano-2')).toBe(comic.editions[2].issues[1])
  })

  it('devuelve undefined si la clave no corresponde a nada', () => {
    expect(targetFor(comic, '7')).toBeUndefined()
    expect(targetFor(comic, 'tomo-5')).toBeUndefined()
  })
})
