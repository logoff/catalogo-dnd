import { describe, expect, it } from 'vitest'
import type { Comic, ComicEdition } from '@/types/comic'
import { buildComicIndex, enrichComic, expandIssueRange, issuesOf, thumbnailOf } from './comics'

const comic = (slug: string, extra: Partial<Comic> = {}): Comic => ({
  slug,
  title: slug,
  publisher: 'IDW Publishing',
  setting: 'forgotten_realms',
  kind: 'limited_series',
  date: '2021-10',
  issue_count: 2,
  description: 'a\n\nb',
  source: 'https://www.comics.org/series/1/',
  issues: [{ number: '1', cover: `/images/comics/${slug}/1.webp` }, { number: '2' }],
  ...extra,
})

const link = [{ store: 'amazon' as const, url: 'https://www.amazon.es/dp/X/' }]

describe('expandIssueRange', () => {
  it('expande rangos y listas y deja tal cual lo que no es un número', () => {
    expect(expandIssueRange('1-3')).toEqual(['1', '2', '3'])
    expect(expandIssueRange('1-2, 5')).toEqual(['1', '2', '5'])
    expect(expandIssueRange('Annual 1')).toEqual(['Annual 1'])
    expect(expandIssueRange('0')).toEqual(['0'])
  })
})

describe('issuesOf', () => {
  it('solo cuenta los números de la serie pedida', () => {
    const edition: ComicEdition = {
      language: 'english',
      publisher: 'IDW Publishing',
      format: 'omnibus',
      contents: [
        { series: 'a', issues: '1-2' },
        { series: 'b', issues: '1' },
      ],
    }
    expect(issuesOf(edition, 'a')).toEqual(['1', '2'])
    expect(issuesOf(edition, 'b')).toEqual(['1'])
  })
})

describe('enrichComic', () => {
  const tomo: ComicEdition = {
    language: 'english',
    title: 'Tomo A',
    publisher: 'IDW Publishing',
    date: '2022-05',
    format: 'paperback',
    contents: [{ series: 'a', issues: '1-2' }],
  }
  const integral: ComicEdition = {
    id: 'integral',
    language: 'castellano',
    spain: true,
    title: 'Integral',
    publisher: 'Norma',
    date: '2024',
    format: 'omnibus',
    contents: [
      { series: 'a', issues: '1-2' },
      { series: 'b', issues: '1-2' },
    ],
    purchase_links: link,
  }

  it('suma los tomos de varias series, del más reciente al más antiguo, y dice qué otras recogen', () => {
    const enriched = enrichComic(comic('a', { editions: [tomo] }), [integral])
    expect(enriched.editions.map((e) => e.title)).toEqual(['Integral', 'Tomo A'])
    expect(enriched.editions[0].otherSeries).toEqual(['b'])
    expect(enriched.editions[1].otherSeries).toEqual([])
  })

  it('calcula castellano, venta, título en castellano y en qué tomos está cada número', () => {
    const enriched = enrichComic(comic('a', { editions: [tomo] }), [integral])
    expect(enriched.spanish).toBe('spain')
    expect(enriched.availableToBuy).toBe(true)
    expect(enriched.spanishTitle).toBe('Integral')
    expect(enriched.collectedIn['1']).toEqual(['Integral (2024)', 'Tomo A (2022)'])
  })

  it('sin tomos en castellano ni a la venta', () => {
    const enriched = enrichComic(comic('a', { editions: [tomo] }), [])
    expect(enriched.spanish).toBe('none')
    expect(enriched.availableToBuy).toBe(false)
    expect(enriched.spanishTitle).toBeNull()
  })

  it('años de publicación y portada principal', () => {
    expect(enrichComic(comic('a'), []).years).toBe('2021')
    expect(enrichComic(comic('a', { date: '1988-11', end_date: '1991-09' }), []).years).toBe(
      '1988-1991'
    )
    expect(enrichComic(comic('a'), []).cover).toBe('/images/comics/a/1.webp')
    const sinPortadas = comic('a', { issues: [{ number: '1' }], issue_count: 1 })
    const conTomo = enrichComic(sinPortadas, [
      { ...integral, cover: '/images/comics/a/9788467900000.webp' },
    ])
    expect(conTomo.cover).toBe('/images/comics/a/9788467900000.webp')
  })
})

describe('buildComicIndex', () => {
  it('ordena de la más reciente a la más antigua e indexa títulos de tomos y autores', () => {
    const index = buildComicIndex(
      [
        comic('vieja', { date: '1990-01' }),
        comic('nueva', {
          date: '2023-01',
          writers: ['Jim Zub'],
          editions: [
            {
              language: 'english',
              title: "Fell's Five",
              publisher: 'IDW Publishing',
              format: 'paperback',
              contents: [{ series: 'nueva', issues: '1-2' }],
            },
          ],
        }),
      ],
      []
    )
    expect(index.map((c) => c.slug)).toEqual(['nueva', 'vieja'])
    expect(index[0].searchText).toContain("fell's five")
    expect(index[0].searchText).toContain('jim zub')
    expect(index[0].thumbnail).toBe(thumbnailOf('/images/comics/nueva/1.webp'))
  })
})
