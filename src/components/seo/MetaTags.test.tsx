import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import MetaTags from './MetaTags'
import { summarize } from '@/utils/formatters'

const canonical = () => document.head.querySelector('link[rel="canonical"]')?.getAttribute('href')
const ogUrl = () => document.head.querySelector('meta[property="og:url"]')?.getAttribute('content')

describe('MetaTags', () => {
  it('usa como canónica la URL de la página, sin parámetros', () => {
    render(
      <MemoryRouter initialEntries={['/guias/por-donde-empezar?utm_source=telegram']}>
        <MetaTags title="Por dónde empezar" />
      </MemoryRouter>
    )
    expect(canonical()).toBe('https://catalogodnd.es/guias/por-donde-empezar')
    expect(ogUrl()).toBe('https://catalogodnd.es/guias/por-donde-empezar')
  })

  it('en la portada usa la URL raíz', () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <MetaTags />
      </MemoryRouter>
    )
    expect(canonical()).toBe('https://catalogodnd.es/')
  })
})

describe('summarize', () => {
  it('deja intactas las descripciones cortas', () => {
    expect(summarize('Manual del Jugador.')).toBe('Manual del Jugador.')
  })

  it('se queda con el primer párrafo y lo corta por palabras', () => {
    const long = `${'palabra '.repeat(40).trim()}\n\nSegundo párrafo.`
    const result = summarize(long)
    expect(result.length).toBeLessThanOrEqual(200)
    expect(result).toMatch(/palabra…$/)
    expect(result).not.toContain('Segundo')
  })
})
