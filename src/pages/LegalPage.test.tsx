import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import LegalPage from './LegalPage'

describe('LegalPage', () => {
  it('avisa de que reproducir un vídeo conecta con YouTube', () => {
    render(
      <MemoryRouter>
        <LegalPage />
      </MemoryRouter>
    )
    expect(screen.getByText(/Al pulsar reproducir/)).toHaveTextContent(
      'tu navegador se conecta con YouTube'
    )
  })

  it('menciona las capturas de los videojuegos y su origen oficial', () => {
    render(
      <MemoryRouter>
        <LegalPage />
      </MemoryRouter>
    )
    expect(screen.getByText(/capturas de los videojuegos/)).toHaveTextContent(
      'proceden de sus canales oficiales'
    )
  })

  it('menciona los productos de merchandising con licencia', () => {
    render(
      <MemoryRouter>
        <LegalPage />
      </MemoryRouter>
    )
    expect(screen.getByText(/productos de merchandising/)).toHaveTextContent(
      'licencia oficial de Dungeons & Dragons'
    )
  })
})
