import { describe, expect, it } from 'vitest'
import novelsIndex from 'virtual:novels-index'
import comicsIndex from 'virtual:comics-index'
import rpgIndex from 'virtual:rpg-index'
import { filterNovels } from './novelFilters'
import { filterComics, NO_FILTERS } from './comicFilters'
import { filterBooks } from './rpgFilters'
import { isbnsOf } from './searchText'

describe('isbnsOf', () => {
  it('devuelve los ISBN-13 como texto y se salta las ediciones sin ISBN', () => {
    expect(isbnsOf([{ isbn13: 9780880389051 }, {}])).toEqual(['9780880389051'])
  })
})

// Los listados de novelas, cómics y rol encuentran una ficha por el ISBN de una edición
describe('búsqueda por ISBN en los índices', () => {
  it('novelas', () => {
    const found = filterNovels(novelsIndex.novels, {
      searchQuery: '9780880389051',
      settings: [],
      series: [],
      spanishOnly: false,
      availableOnly: false,
    })
    expect(found.map((n) => n.slug)).toContain('homeland')
  })

  it('cómics', () => {
    const found = filterComics(comicsIndex, { ...NO_FILTERS, searchQuery: '9781684058884' })
    expect(found.map((c) => c.slug)).toEqual(['mindbreaker'])
  })

  it('libros de rol', () => {
    const found = filterBooks(rpgIndex.books, {
      searchQuery: '9781640782570',
      system: '',
      license: '',
      spanishOnly: false,
    })
    expect(found.map((b) => b.slug)).toEqual(['advanced-players-guide'])
  })
})
