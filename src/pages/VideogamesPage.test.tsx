import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen, fireEvent, within } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { useVideogameStore } from '@/store/videogameStore'
import VideogamesPage from './VideogamesPage'

const initialState = useVideogameStore.getState()

// El panel pinta los filtros dos veces (escritorio y móvil); se usa la primera copia
const checkbox = (label: string) => screen.getAllByLabelText(label)[0] as HTMLInputElement
const cards = () =>
  screen
    .getAllByRole('link')
    .filter((link) => link.getAttribute('href')?.startsWith('/videojuego/'))
const titles = () => cards().map((card) => within(card).getByRole('heading').textContent)

const renderPage = () =>
  render(
    <MemoryRouter>
      <VideogamesPage />
    </MemoryRouter>
  )

describe('VideogamesPage', () => {
  beforeEach(() => useVideogameStore.setState(initialState, true))

  it('lista todos los juegos, del más antiguo al más reciente', () => {
    renderPage()
    const total = initialState.videogames.length
    expect(screen.getByText(`${total} de ${total} videojuegos`)).toBeInTheDocument()
    expect(titles()).toEqual(['Pool of Radiance', "Baldur's Gate", "Baldur's Gate 3"])
  })

  it('cada tarjeta enlaza a su ficha y muestra año, castellano y nota', () => {
    renderPage()
    const card = cards().find((c) => c.getAttribute('href') === '/videojuego/baldurs-gate-3')!
    expect(within(card).getByText('2023')).toBeInTheDocument()
    expect(within(card).getByText('Textos en castellano')).toBeInTheDocument()
    expect(within(card).getByText('96')).toBeInTheDocument()
  })

  it('filtra por castellano y por década', () => {
    renderPage()
    fireEvent.click(checkbox('Solo en inglés'))
    expect(titles()).toEqual(['Pool of Radiance'])

    fireEvent.click(checkbox('Solo en inglés'))
    fireEvent.click(checkbox('Años 20'))
    expect(titles()).toEqual(["Baldur's Gate 3"])
  })

  it('busca por título sin tildes', () => {
    renderPage()
    fireEvent.change(screen.getAllByLabelText('Buscar por título')[0], {
      target: { value: 'POOL' },
    })
    expect(titles()).toEqual(['Pool of Radiance'])
  })

  it('ordena por nota con los juegos sin nota al final', () => {
    renderPage()
    fireEvent.change(screen.getAllByLabelText('Ordenar por')[0], {
      target: { value: 'score-desc' },
    })
    expect(titles()).toEqual(["Baldur's Gate 3", "Baldur's Gate", 'Pool of Radiance'])
  })

  it('sin resultados lo dice y permite quitar los filtros', () => {
    renderPage()
    fireEvent.change(screen.getAllByLabelText('Buscar por título')[0], {
      target: { value: 'no existe' },
    })
    expect(
      screen.getByText('Ningún videojuego cumple los filtros seleccionados')
    ).toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: 'Quitar filtros' }))
    expect(cards()).toHaveLength(initialState.videogames.length)
  })
})
