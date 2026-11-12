import { describe, it, expect, vi } from 'vitest'
import { adtractionAffiliate, amazonAffiliate, getPurchaseUrl, withParam } from './stores'

const url = 'https://www.amazon.es/dp/0786965606'

describe('stores', () => {
  it('sin IDs de afiliado devuelve la URL sin cambios', () => {
    expect(getPurchaseUrl('amazon', url)).toBe(url)
    expect(getPurchaseUrl('generacion_x', 'https://www.generacionx.es/phb')).toBe(
      'https://www.generacionx.es/phb'
    )
  })

  it('Amazon añade el tag de afiliado', () => {
    expect(amazonAffiliate()).toBeUndefined()
    expect(amazonAffiliate('prueba-21')!(url)).toBe(`${url}?tag=prueba-21`)
  })

  it('Adtraction necesita programa y canal, y codifica la URL de destino', () => {
    expect(adtractionAffiliate('123')).toBeUndefined()
    expect(adtractionAffiliate(undefined, '456')).toBeUndefined()
    expect(adtractionAffiliate('123', '456')!('https://www.generacionx.es/phb?x=1')).toBe(
      'https://go.adtraction.com/t/t?a=123&as=456&t=2&tk=1&url=https%3A%2F%2Fwww.generacionx.es%2Fphb%3Fx%3D1'
    )
  })

  it('GOG sin IDs de afiliado devuelve la URL sin cambios', () => {
    const gog = 'https://www.gog.com/en/game/baldurs_gate_iii'
    expect(getPurchaseUrl('gog', gog)).toBe(gog)
  })

  it('Steam nunca lleva afiliado', async () => {
    vi.stubEnv('VITE_AFFILIATE_ADTRACTION_CHANNEL', '456')
    vi.resetModules()
    const { getPurchaseUrl: purchaseUrl } = await import('./stores')
    const steam = 'https://store.steampowered.com/app/1086940/'
    expect(purchaseUrl('steam', steam)).toBe(steam)
    vi.unstubAllEnvs()
  })

  it('GOG con programa y canal usa el enlace de Adtraction', async () => {
    vi.stubEnv('VITE_AFFILIATE_GOG_PROGRAM', '123')
    vi.stubEnv('VITE_AFFILIATE_ADTRACTION_CHANNEL', '456')
    vi.resetModules()
    const { getPurchaseUrl: purchaseUrl } = await import('./stores')
    expect(purchaseUrl('gog', 'https://www.gog.com/en/game/baldurs_gate_iii')).toBe(
      'https://go.adtraction.com/t/t?a=123&as=456&t=2&tk=1&url=https%3A%2F%2Fwww.gog.com%2Fen%2Fgame%2Fbaldurs_gate_iii'
    )
    vi.unstubAllEnvs()
  })

  it('withParam respeta los parámetros existentes', () => {
    expect(withParam(`${url}?ref=x`, 'tag', 'a')).toBe(`${url}?ref=x&tag=a`)
  })
})
