import { describe, it, expect } from 'vitest'
import css from './globals.css?raw'

// Variables --c-* de un bloque (`:root` o `[data-theme='dark']`)
function readTokens(selector: string): Record<string, string> {
  const start = css.indexOf(`${selector} {`)
  const block = css.slice(start, css.indexOf('}', start))
  return Object.fromEntries(
    [...block.matchAll(/--c-([a-z-]+):\s*(#[0-9a-f]{6})/gi)].map(([, name, value]) => [name, value])
  )
}

function luminance(hex: string): number {
  const [r, g, b] = [1, 3, 5].map((i) => {
    const c = parseInt(hex.slice(i, i + 2), 16) / 255
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4
  })
  return 0.2126 * r + 0.7152 * g + 0.0722 * b
}

function contrast(a: string, b: string): number {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x)
  return (hi + 0.05) / (lo + 0.05)
}

// Texto sobre fondo que aparece en la interfaz; todas deben cumplir AA (4,5:1)
const textPairs: [string, string][] = [
  ['fg', 'bg'],
  ['fg', 'surface'],
  ['fg', 'well'],
  ['muted', 'bg'],
  ['muted', 'surface'],
  ['muted', 'well'],
  ['accent', 'bg'],
  ['accent', 'surface'],
  ['accent', 'accent-soft'],
  ['on-accent', 'accent-solid'],
]

describe.each([
  ['claro', ':root'],
  ['oscuro', "[data-theme='dark']"],
])('contraste del tema %s', (_, selector) => {
  const tokens = readTokens(selector)

  it('define todos los colores', () => {
    for (const [text, background] of textPairs) {
      expect(tokens[text], text).toMatch(/^#/)
      expect(tokens[background], background).toMatch(/^#/)
    }
  })

  it.each(textPairs)('%s sobre %s cumple AA', (text, background) => {
    expect(contrast(tokens[text], tokens[background])).toBeGreaterThanOrEqual(4.5)
  })

  it('el foco se distingue del fondo (3:1)', () => {
    expect(contrast(tokens.focus, tokens.bg)).toBeGreaterThanOrEqual(3)
    expect(contrast(tokens.focus, tokens.surface)).toBeGreaterThanOrEqual(3)
  })
})
