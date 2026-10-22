import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import type { ComponentType } from 'react'
import { getProductByCodeAndEdition } from '@/services/dataLoader'
import StartGuide from './StartGuide'
import EditionsGuide from './EditionsGuide'
import SpanishTimeline from './SpanishTimeline'

const guides: Array<[string, ComponentType]> = [
  ['Por dónde empezar', StartGuide],
  ['2014 frente a 2024', EditionsGuide],
  ['Cronología en castellano', SpanishTimeline],
]

describe.each(guides)('%s', (_, Guide) => {
  it('solo enlaza a productos que existen', () => {
    const { container } = render(
      <MemoryRouter>
        <Guide />
      </MemoryRouter>
    )
    const productLinks = [...container.querySelectorAll('a[href^="/producto/"]')]
    expect(productLinks.length).toBeGreaterThan(0)

    for (const link of productLinks) {
      const [, , edition, code] = link.getAttribute('href')!.split('/')
      const product = getProductByCodeAndEdition(code, edition === '2014' ? '5e' : '2024')
      expect(product, link.getAttribute('href')!).toBeDefined()
    }
  })
})

describe('Cronología en castellano', () => {
  it('lista las publicaciones en castellano agrupadas por año', () => {
    render(
      <MemoryRouter>
        <SpanishTimeline />
      </MemoryRouter>
    )
    expect(screen.getByRole('heading', { name: '2017' })).toBeInTheDocument()
    expect(screen.getAllByText("Player's Handbook: Manual del Jugador").length).toBeGreaterThan(0)
    expect(screen.queryByText("Player's Handbook")).not.toBeInTheDocument()
  })
})
