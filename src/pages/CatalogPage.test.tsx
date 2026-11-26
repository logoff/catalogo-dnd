import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import CatalogPage from './CatalogPage'

describe('catálogo de libros', () => {
  it('filtra con ?q= y muestra el texto en su propio campo de búsqueda', () => {
    render(
      <MemoryRouter initialEntries={['/catalogo?q=xanathar']}>
        <CatalogPage />
      </MemoryRouter>
    )
    expect(screen.getByLabelText('Buscar libros')).toHaveValue('xanathar')
    expect(screen.getAllByRole('link', { name: /Xanathar's Guide to Everything/ }).length).toBe(1)
    expect(screen.queryByRole('link', { name: /Player's Handbook/ })).toBeNull()
  })
})
