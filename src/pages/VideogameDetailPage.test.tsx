import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { enrichVideogame } from '@/services/videogameLoader'
import VideogameDetail from '@/components/videogames/VideogameDetail'
import VideogameDetailPage from './VideogameDetailPage'

const renderAt = (path: string) =>
  render(
    <MemoryRouter initialEntries={[path]}>
      <Routes>
        <Route path="/videojuego/:slug" element={<VideogameDetailPage />} />
      </Routes>
    </MemoryRouter>
  )

describe('VideogameDetailPage', () => {
  it('muestra la ficha del juego', () => {
    renderAt('/videojuego/baldurs-gate-3')
    expect(screen.getByRole('heading', { level: 1, name: "Baldur's Gate 3" })).toBeInTheDocument()
    // Desarrolladora y editora
    expect(screen.getAllByText('Larian Studios', { selector: 'dd' })).toHaveLength(2)
    expect(screen.getByText('Reinos Olvidados')).toBeInTheDocument()
    expect(screen.getByText('Textos en castellano')).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Ediciones' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Notas' })).toBeInTheDocument()
  })

  it('enlaza a los libros relacionados', () => {
    renderAt('/videojuego/baldurs-gate-3')
    const link = screen.getByRole('link', { name: /Descent into Avernus/ })
    expect(link).toHaveAttribute('href', '/producto/2014/bgdia')
  })

  it('lista expansiones y ediciones', () => {
    renderAt('/videojuego/baldurs-gate')
    expect(screen.getByText('Tales of the Sword Coast')).toBeInTheDocument()
    expect(screen.getAllByText('Enhanced Edition').length).toBeGreaterThan(0)
  })

  it('con un slug inexistente muestra la página de no encontrado', () => {
    renderAt('/videojuego/no-existe')
    expect(screen.getByRole('heading', { name: 'Página no encontrada' })).toBeInTheDocument()
  })
})

describe('VideogameDetail', () => {
  const base = {
    slug: 'juego',
    title: 'Juego',
    description: 'Qué es.\n\nPara quién es.',
    developers: ['Estudio'],
    publishers: ['Editora'],
    genres: ['mmo' as const],
    releases: [{ platform: 'browser' as const, date: '2008' }],
  }

  it('avisa de que un juego online está cerrado y no está a la venta', () => {
    render(
      <MemoryRouter>
        <VideogameDetail game={enrichVideogame({ ...base, status: 'shut_down' })} />
      </MemoryRouter>
    )
    expect(screen.getByText(/Juego cerrado/)).toBeInTheDocument()
    expect(screen.getByText('No disponible a la venta.')).toBeInTheDocument()
  })

  it('omite los datos que no tiene', () => {
    render(
      <MemoryRouter>
        <VideogameDetail game={enrichVideogame(base)} />
      </MemoryRouter>
    )
    expect(screen.queryByText('Mundo:')).not.toBeInTheDocument()
    expect(screen.queryByText('Reglas:')).not.toBeInTheDocument()
    expect(screen.queryByRole('heading', { name: 'Notas' })).not.toBeInTheDocument()
    expect(screen.queryByRole('heading', { name: 'Libros relacionados' })).not.toBeInTheDocument()
  })
})
