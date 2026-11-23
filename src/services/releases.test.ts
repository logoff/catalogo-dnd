import { describe, it, expect } from 'vitest'
import releases from 'virtual:releases'

const FIELDS = [
  'name',
  'path',
  'section',
  'key',
  'context',
  'language',
  'date',
  'year',
  'monthOnly',
]

describe('virtual:releases', () => {
  it('lleva solo los campos de cada entrada, sin descripciones de las fichas', () => {
    const all = [...releases.upcoming, ...releases.recent, ...releases.announced]
    expect(all.length).toBeGreaterThan(0)
    for (const entry of all) {
      expect(Object.keys(entry).every((key) => FIELDS.includes(key))).toBe(true)
    }
  })

  it('reparte las entradas según el día del build', () => {
    const { today, upcoming, recent, announced } = releases
    expect(today).toMatch(/^\d{4}-\d{2}-\d{2}$/)
    expect(upcoming.every((e) => e.date! > today)).toBe(true)
    expect(recent.every((e) => e.date! <= today)).toBe(true)
    expect(announced.every((e) => !e.date)).toBe(true)
  })
})
