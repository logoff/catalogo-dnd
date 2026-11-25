import { describe, expect, it } from 'vitest'
import { campaignLabel, campaignOpen } from './crowdfunding'

const campaign = (platform: 'verkami' | 'editorial', end: string) => ({
  platform,
  url: 'https://example.com/campana',
  end,
})

describe('campañas de micromecenazgo', () => {
  it('está abierta hasta el día de cierre incluido', () => {
    expect(campaignOpen(campaign('verkami', '2026-11-25'), '2026-11-25')).toBe(true)
    expect(campaignOpen(campaign('verkami', '2026-11-24'), '2026-11-25')).toBe(false)
  })

  it('nombra la plataforma o el mecenazgo de la editorial', () => {
    expect(campaignLabel(campaign('verkami', '2026-12-27'), '2026-11-25')).toBe(
      'En campaña en Verkami hasta el 27 de diciembre de 2026'
    )
    expect(campaignLabel(campaign('editorial', '2025-05-05'), '2026-11-25')).toBe(
      'Financiado en el mecenazgo de la editorial'
    )
  })
})
