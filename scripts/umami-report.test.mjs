import { describe, it, expect } from 'vitest'
import {
  clicksBySection,
  escapeHtml,
  formatReport,
  reportPeriod,
  statValue,
  topRows,
} from './umami-report.mjs'

describe('periodo del informe de Umami', () => {
  it('es el mes anterior, con sus límites a medianoche en Madrid', () => {
    const period = reportPeriod(new Date('2026-12-01T07:00:00Z'))
    expect(period.label).toBe('noviembre de 2026')
    // Noviembre en Madrid es UTC+1
    expect(new Date(period.current.startAt).toISOString()).toBe('2026-10-31T23:00:00.000Z')
    expect(new Date(period.current.endAt + 1).toISOString()).toBe('2026-11-30T23:00:00.000Z')
    expect(new Date(period.previous.startAt).toISOString()).toBe('2026-09-30T22:00:00.000Z')
  })

  it('en enero informa de diciembre del año anterior', () => {
    const period = reportPeriod(new Date('2027-01-01T07:00:00Z'))
    expect(period.label).toBe('diciembre de 2026')
    expect(new Date(period.previous.startAt).toISOString()).toBe('2026-10-31T23:00:00.000Z')
  })

  it('usa la fecha de Madrid aunque en UTC aún sea el mes anterior', () => {
    expect(reportPeriod(new Date('2026-11-30T23:30:00Z')).label).toBe('noviembre de 2026')
  })

  it('acepta un mes concreto y rechaza los mal escritos', () => {
    expect(reportPeriod(new Date(), '2026-03').label).toBe('marzo de 2026')
    expect(() => reportPeriod(new Date(), '2026-13')).toThrow()
    expect(() => reportPeriod(new Date(), 'marzo')).toThrow()
  })
})

describe('clics por sección', () => {
  it('separa las ediciones anteriores del resto de juegos de rol y quita las vacías', () => {
    expect(
      clicksBySection({
        producto: [
          { value: '2014/PHB', total: 3 },
          { value: '2024/DMG', total: 2 },
        ],
        rol: [
          { value: 'dnd-3-5/players-handbook', total: 4 },
          { value: 'pathfinder-2e/player-core', total: 1 },
        ],
        novela: [],
      })
    ).toEqual([
      { label: 'Libros 5E', total: 5 },
      { label: 'Ediciones anteriores', total: 4 },
      { label: 'Otros juegos de rol', total: 1 },
    ])
  })
})

describe('mensaje del informe', () => {
  it('admite las cifras de Umami 2 y de Umami 3', () => {
    expect(statValue({ value: 12, prev: 3 })).toBe(12)
    expect(statValue(12)).toBe(12)
    expect(statValue(undefined)).toBe(0)
  })

  it('ordena, recorta y nombra la procedencia directa', () => {
    const rows = topRows(Array.from({ length: 12 }, (_, i) => ({ x: i ? `sitio${i}` : '', y: i })))
    expect(rows).toHaveLength(10)
    expect(rows[0]).toEqual({ label: 'sitio11', total: 11 })
    expect(topRows([{ x: '', y: 5 }])).toEqual([{ label: '(directo)', total: 5 }])
  })

  it('escapa el HTML de Telegram', () => {
    expect(escapeHtml('<a> & b')).toBe('&lt;a&gt; &amp; b')
  })

  it('reúne cifras, comparación con el mes anterior y listas', () => {
    const text = formatReport({
      period: { label: 'noviembre de 2026' },
      stats: { visitors: 1200, visits: 1500, pageviews: 4000 },
      previousStats: { visitors: 1000, visits: 0, pageviews: 4000 },
      pages: [{ label: '/novelas', total: 300 }],
      referrers: [],
      events: [
        { x: 'comprar', y: 42 },
        { x: 'menu', y: 10 },
      ],
      stores: [{ label: 'amazon', total: 30 }],
      sections: [{ label: 'Novelas', total: 42 }],
    })
    expect(text).toContain('<b>Catálogo D&amp;D · noviembre de 2026</b>')
    expect(text).toContain('Visitantes: 1200 (+20 %)')
    expect(text).toContain('Visitas: 1500\n')
    expect(text).toContain('Páginas vistas: 4000 (0 %)')
    expect(text).toContain('Clics en «comprar»: 42')
    expect(text).not.toContain('Descargas')
    expect(text).toContain('<b>Procedencia</b>\nSin datos')
    expect(text).toContain('30 · amazon')
  })
})
