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
    expect(screen.queryByRole('heading', { name: 'Vídeos' })).not.toBeInTheDocument()
  })

  it('muestra los vídeos en el orden de los datos, con su título y su canal', () => {
    const video = { kind: 'trailer' as const, channel: 'Editora', date: '2020-01-01' }
    render(
      <MemoryRouter>
        <VideogameDetail
          game={enrichVideogame({
            ...base,
            videos: [
              { ...video, youtube: 'aaaaaaaaaaa', title: 'Anuncio' },
              { ...video, youtube: 'bbbbbbbbbbb', title: 'Tráiler de lanzamiento' },
            ],
          })}
        />
      </MemoryRouter>
    )
    expect(screen.getByRole('heading', { name: 'Vídeos' })).toBeInTheDocument()
    expect(
      screen.getAllByRole('link', { name: /^Reproducir/ }).map((a) => a.getAttribute('aria-label'))
    ).toEqual(['Reproducir «Anuncio»', 'Reproducir «Tráiler de lanzamiento»'])
    expect(screen.getAllByText('· Editora')).toHaveLength(2)
  })

  it('incluye un VideoObject por vídeo en los datos estructurados', () => {
    const { container } = render(
      <MemoryRouter>
        <VideogameDetail
          game={enrichVideogame({
            ...base,
            videos: [
              {
                youtube: 'aaaaaaaaaaa',
                kind: 'trailer',
                title: 'Tráiler',
                channel: 'Editora',
                date: '2020-01-01',
              },
            ],
          })}
        />
      </MemoryRouter>
    )
    const objects = [...container.querySelectorAll('script[type="application/ld+json"]')]
      .flatMap((script) => JSON.parse(script.textContent ?? '[]'))
      .filter((data) => data['@type'] === 'VideoObject')
    expect(objects).toEqual([
      {
        '@context': 'https://schema.org',
        '@type': 'VideoObject',
        name: 'Tráiler',
        description: 'Vídeo oficial de Juego, publicado por Editora.',
        thumbnailUrl: 'https://catalogodnd.es/images/videogames/juego/video-aaaaaaaaaaa.jpg',
        uploadDate: '2020-01-01',
        contentUrl: 'https://www.youtube.com/watch?v=aaaaaaaaaaa',
        embedUrl: 'https://www.youtube-nocookie.com/embed/aaaaaaaaaaa',
      },
    ])
  })
})
