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

  it('menciona los títulos y las portadas de las novelas', () => {
    render(
      <MemoryRouter>
        <LegalPage />
      </MemoryRouter>
    )
    expect(screen.getByText(/portadas de las novelas/)).toHaveTextContent(
      'para identificar cada obra y cada edición'
    )
  })

  it('dice que otros juegos de rol no es oficial, cita a sus editoriales y a NoSoloRol', () => {
    render(
      <MemoryRouter>
        <LegalPage />
      </MemoryRouter>
    )
    expect(screen.getByText(/reúne juegos y libros de otras editoriales/)).toHaveTextContent(
      'No es contenido oficial de Dungeons & Dragons'
    )
    expect(screen.getByText(/juegos y libros de la sección/)).toHaveTextContent(
      'Paizo, Kobold Press'
    )
    expect(screen.getByText(/se enlaza también a NoSoloRol/)).toBeInTheDocument()
  })
})
