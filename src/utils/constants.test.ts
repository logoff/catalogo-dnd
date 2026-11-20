import { describe, it, expect } from 'vitest'
import { PLACEHOLDER_IMAGE } from './constants'

describe('imagen sin portada', () => {
  it('se sirve desde el propio sitio y existe', () => {
    expect(PLACEHOLDER_IMAGE.startsWith('/images/')).toBe(true)
    const files = Object.keys(import.meta.glob('/public/images/*.svg'))
    expect(files).toContain(`/public${PLACEHOLDER_IMAGE}`)
  })
})
