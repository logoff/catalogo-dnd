import { describe, it, expect, afterEach } from 'vitest'
import { STORES, getPurchaseUrl, withParam } from './stores'

const url = 'https://www.amazon.es/dp/0786965606'

describe('stores', () => {
  afterEach(() => {
    delete STORES.amazon.affiliate
  })

  it('sin programa de afiliados devuelve la URL sin cambios', () => {
    expect(getPurchaseUrl('amazon', url)).toBe(url)
  })

  it('con programa de afiliados aplica su transformación', () => {
    STORES.amazon.affiliate = (u) => withParam(u, 'tag', 'prueba-21')
    expect(getPurchaseUrl('amazon', url)).toBe(`${url}?tag=prueba-21`)
  })

  it('withParam respeta los parámetros existentes', () => {
    expect(withParam(`${url}?ref=x`, 'tag', 'a')).toBe(`${url}?ref=x&tag=a`)
  })
})
