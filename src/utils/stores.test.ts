import { describe, it, expect, vi } from 'vitest'
import {
  adtractionAffiliate,
  amazonAffiliate,
  awinAffiliate,
  getPurchaseUrl,
  instantGamingAffiliate,
  withParam,
} from './stores'

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
      'https://track.adtraction.com/t/t?a=123&as=456&t=2&tk=1&url=https%3A%2F%2Fwww.generacionx.es%2Fphb%3Fx%3D1'
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
      'https://track.adtraction.com/t/t?a=123&as=456&t=2&tk=1&url=https%3A%2F%2Fwww.gog.com%2Fen%2Fgame%2Fbaldurs_gate_iii'
    )
    vi.unstubAllEnvs()
  })

  it('Instant Gaming añade el código de referido', () => {
    const url = 'https://www.instant-gaming.com/es/12345-comprar-baldurs-gate-3-pc-steam/'
    expect(instantGamingAffiliate()).toBeUndefined()
    expect(getPurchaseUrl('instant_gaming', url)).toBe(url)
    expect(instantGamingAffiliate('gamer-prueba')!(url)).toBe(`${url}?igr=gamer-prueba`)
  })

  it('Awin necesita anunciante y publisher, y codifica la URL de destino', () => {
    const eneba = 'https://www.eneba.com/es/steam-baldurs-gate-3-pc-steam-key-global'
    expect(awinAffiliate('20385')).toBeUndefined()
    expect(getPurchaseUrl('eneba', eneba)).toBe(eneba)
    expect(awinAffiliate('20385', '3153372')!(eneba)).toBe(
      `https://www.awin1.com/cread.php?awinmid=20385&awinaffid=3153372&ued=${encodeURIComponent(eneba)}`
    )
  })

  it('withParam respeta los parámetros existentes', () => {
    expect(withParam(`${url}?ref=x`, 'tag', 'a')).toBe(`${url}?ref=x&tag=a`)
  })
})
