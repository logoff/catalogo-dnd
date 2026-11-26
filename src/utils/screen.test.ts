import { describe, it, expect } from 'vitest'
import type { ScreenWork } from '@/types/screen'
import { enrichScreenWork } from '@/services/screenLoader'
import { filterScreenWorks, sortScreenWorks, yearsLabel } from './screen'

const work = (title: string, extra: Partial<ScreenWork> = {}) =>
  enrichScreenWork({
    slug: title.toLowerCase(),
    kind: 'film',
    official: true,
    title,
    description: 'Sinopsis.',
    status: 'released',
    ...extra,
  })

const old = work('Antigua', { releases: [{ country: 'us', medium: 'cinema', date: '2000-12-08' }] })
const recent = work('Reciente', {
  title_es: 'Nueva',
  releases: [{ country: 'es', medium: 'cinema', date: '2023-03-31' }],
})
const announced = work('Anunciada', { kind: 'series', status: 'announced', series: undefined })

describe('sortScreenWorks', () => {
  it('ordena por fecha en los dos sentidos, con las anunciadas como las más nuevas', () => {
    const titles = (sort: 'date-desc' | 'date-asc') =>
      sortScreenWorks([old, announced, recent], sort).map((w) => w.title)
    expect(titles('date-desc')).toEqual(['Anunciada', 'Reciente', 'Antigua'])
    expect(titles('date-asc')).toEqual(['Antigua', 'Reciente', 'Anunciada'])
  })

  it('ordena por el título que se muestra', () => {
    expect(sortScreenWorks([recent, old], 'title').map((w) => w.displayTitle)).toEqual([
      'Antigua',
      'Nueva',
    ])
  })
})

describe('filterScreenWorks', () => {
  it('combina el tipo y el castellano', () => {
    expect(
      filterScreenWorks([old, recent, announced], { kind: 'film', spanishOnly: true })
    ).toEqual([recent])
    expect(
      filterScreenWorks([old, recent, announced], { kind: 'all', spanishOnly: false })
    ).toHaveLength(3)
  })
})

describe('yearsLabel', () => {
  it('muestra el intervalo de una serie o el año de una película', () => {
    expect(
      yearsLabel(
        work('S', { kind: 'series', series: { start_year: 1983, end_year: 1985, seasons: 3 } })
      )
    ).toBe('1983–1985')
    expect(
      yearsLabel(work('S', { kind: 'series', series: { start_year: 2022, seasons: 3 } }))
    ).toBe('2022–')
    expect(yearsLabel(old)).toBe('2000')
    expect(yearsLabel(work('Sin fecha'))).toBeNull()
  })
})
