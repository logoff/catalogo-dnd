import { describe, it, expect } from 'vitest'
import summaries from 'virtual:monthly-summaries'

describe('virtual:monthly-summaries', () => {
  it('lleva solo meses completos desde noviembre de 2026, en orden', () => {
    const months = summaries.months.map((summary) => summary.month)
    expect(months).toEqual([...months].sort())
    expect(months.every((month) => month >= '2026-11')).toBe(true)
  })

  it('cada mes respeta los topes de ejemplos y de ediciones en castellano', () => {
    for (const summary of summaries.months) {
      for (const section of summary.added) expect(section.examples.length).toBeLessThanOrEqual(10)
      expect(summary.reviews.items.length).toBeLessThanOrEqual(10)
      expect(summary.spanishEditions.length).toBeLessThanOrEqual(50)
      expect(summary.spanishDates.length).toBeLessThanOrEqual(50)
    }
  })
})
