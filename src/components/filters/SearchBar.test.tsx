import { describe, it, expect } from 'vitest'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { MemoryRouter, useLocation } from 'react-router-dom'
import SearchBar from './SearchBar'

function Location() {
  const { pathname, search } = useLocation()
  return <span data-testid="location">{pathname + search}</span>
}

const renderAt = (url: string) =>
  render(
    <MemoryRouter initialEntries={[url]}>
      <SearchBar />
      <Location />
    </MemoryRouter>
  )

describe('buscador de la cabecera', () => {
  it('lleva a /buscar al dejar de escribir', async () => {
    renderAt('/videojuegos')
    fireEvent.change(screen.getByLabelText('Buscar en el catálogo'), {
      target: { value: 'fiends' },
    })
    expect(screen.getByTestId('location')).toHaveTextContent('/videojuegos')
    await waitFor(() =>
      expect(screen.getByTestId('location')).toHaveTextContent('/buscar?q=fiends')
    )
  })

  it('lleva a /buscar al pulsar Intro', () => {
    renderAt('/novelas')
    const field = screen.getByLabelText('Buscar en el catálogo')
    fireEvent.change(field, { target: { value: 'drizzt' } })
    fireEvent.submit(field.closest('form')!)
    expect(screen.getByTestId('location')).toHaveTextContent('/buscar?q=drizzt')
  })

  it('en /buscar muestra el texto buscado', async () => {
    renderAt('/buscar?q=homeland')
    await waitFor(() =>
      expect(screen.getByLabelText('Buscar en el catálogo')).toHaveValue('homeland')
    )
  })

  it('sin texto no navega', () => {
    renderAt('/novelas')
    fireEvent.submit(screen.getByLabelText('Buscar en el catálogo').closest('form')!)
    expect(screen.getByTestId('location')).toHaveTextContent('/novelas')
  })
})
