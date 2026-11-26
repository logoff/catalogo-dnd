import { describe, expect, it } from 'vitest'
import type { RpgBookSummary } from '@/types/rpg'
import { filterBooks } from './rpgFilters'

const book = (slug: string, extra: Partial<RpgBookSummary> = {}): RpgBookSummary => ({
  slug,
  system: 'sistema',
  title: slug,
  titleEs: null,
  kind: 'core',
  originalDate: '2020',
  spanishDate: null,
  latestDate: '2020',
  spanish: false,
  licenses: [],
  publishers: [],
  searchText: slug,
  movement: null,
  thumbnail: null,
  ...extra,
})

const books = [
  book('pathfinder'),
  book('ose', { movement: 'osr', spanish: true }),
  book('ose-en', { movement: 'osr' }),
  book('mork-borg', { movement: 'nsr', spanish: true }),
]
const none = { searchQuery: '', system: '', license: '', spanishOnly: false }
const slugs = (list: RpgBookSummary[]) => list.map((b) => b.slug)

describe('filterBooks', () => {
  it('sin movimiento no filtra', () => {
    expect(slugs(filterBooks(books, none))).toHaveLength(4)
  })

  it('filtra por movimiento y lo combina con el castellano', () => {
    expect(slugs(filterBooks(books, { ...none, movement: 'nsr' }))).toEqual(['mork-borg'])
    expect(slugs(filterBooks(books, { ...none, movement: 'osr', spanishOnly: true }))).toEqual([
      'ose',
    ])
  })
})
