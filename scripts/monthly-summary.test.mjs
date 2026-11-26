import { describe, it, expect } from 'vitest'
import { summarizeMonth, summaryMonths } from './monthly-summary.mjs'

const novelFile = (slug) => `data/novels/forgotten_realms/${slug}.json`
const novel = (slug, editions, extra = {}) => ({ slug, title: slug, editions, ...extra })
const english = { language: 'english', publisher: 'WotC', date: '1990-01' }
const spanish = (date, isbn13 = 9788400000000) => ({
  language: 'castellano',
  title: 'Novela',
  publisher: 'Timun Mas',
  isbn13,
  ...(date ? { date } : {}),
})

describe('resumen del mes', () => {
  it('una ficha nueva con edición en castellano cuenta como ficha, no como edición nueva', () => {
    const summary = summarizeMonth([
      { file: novelFile('a'), before: null, after: novel('a', [english, spanish('2026-11-18')]) },
    ])
    expect(summary.added).toEqual([
      {
        section: 'novelas',
        count: 1,
        examples: [expect.objectContaining({ name: 'a', path: '/novela/a' })],
      },
    ])
    expect(summary.spanishEditions).toEqual([])
  })

  it('una ficha movida o cambiada no es nueva', () => {
    const before = novel('a', [english])
    const summary = summarizeMonth([{ file: novelFile('a'), before, after: before }])
    expect(summary.added).toEqual([])
  })

  it('detecta la edición en castellano nueva y la fecha confirmada, con la de antes', () => {
    const summary = summarizeMonth([
      {
        file: novelFile('a'),
        before: novel('a', [english]),
        after: novel('a', [english, spanish(null)]),
      },
      {
        file: novelFile('b'),
        before: novel('b', [english, spanish(null, 1)]),
        after: novel('b', [english, spanish('2027-03-15', 1)]),
      },
    ])
    expect(summary.spanishEditions).toEqual([{ name: 'Novela', path: '/novela/a', date: null }])
    expect(summary.spanishDates).toEqual([
      { name: 'Novela', path: '/novela/b', date: '2027-03-15', before: null },
    ])
  })

  it('cuenta las reseñas nuevas por su URL, con el nombre del medio', () => {
    const review = (url) => ({ outlet: 'wargamer', url, date: '2026-11-02' })
    const product = (list) => ({
      code: 'PHB',
      publications: [{ title: "Player's Handbook", language: 'english', date: '2024-09-17' }],
      reviews: list,
    })
    const file = 'data/2024/products/01_books/01_core_rules/001_phb.json'
    const summary = summarizeMonth(
      [{ file, before: product([review('u1')]), after: product([review('u1'), review('u2')]) }],
      { outlets: [{ id: 'wargamer', name: 'Wargamer' }] }
    )
    expect(summary.reviews).toEqual({
      count: 1,
      items: [
        {
          name: "Player's Handbook",
          path: '/producto/2024/phb',
          outlet: 'Wargamer',
          date: '2026-11-02',
        },
      ],
    })
  })

  it('recorta los ejemplos a diez, de la más reciente a la más antigua', () => {
    const changes = Array.from({ length: 15 }, (_, i) => ({
      file: novelFile(`n${i}`),
      before: null,
      after: novel(`n${i}`, [
        { ...english, date: `2000-${String((i % 12) + 1).padStart(2, '0')}` },
      ]),
    }))
    const [section] = summarizeMonth(changes).added
    expect(section.count).toBe(15)
    expect(section.examples).toHaveLength(10)
    expect(section.examples[0].date).toBe('2000-12')
  })

  it('recorta las ediciones en castellano a cincuenta', () => {
    const changes = Array.from({ length: 60 }, (_, i) => ({
      file: novelFile(`n${i}`),
      before: novel(`n${i}`, [english]),
      after: novel(`n${i}`, [english, spanish(null, i)]),
    }))
    expect(summarizeMonth(changes).spanishEditions).toHaveLength(50)
  })

  it('no tiene en cuenta los archivos que no son fichas ni los borrados', () => {
    const summary = summarizeMonth([
      { file: 'data/novels/series.json', before: null, after: [] },
      { file: novelFile('a'), before: novel('a', [english]), after: null },
    ])
    expect(summary).toEqual({
      added: [],
      spanishEditions: [],
      spanishDates: [],
      reviews: { count: 0, items: [] },
    })
  })
})

describe('meses con resumen', () => {
  it('van del primero al anterior al mes en curso', () => {
    expect(summaryMonths('2026-11-23')).toEqual([])
    expect(summaryMonths('2026-12-01')).toEqual(['2026-11'])
    expect(summaryMonths('2027-02-10')).toEqual(['2026-11', '2026-12', '2027-01'])
  })
})
