import { describe, it, expect } from 'vitest'
import { fireEvent, render, screen, within } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import Header from './Header'

const renderHeader = () =>
  render(
    <MemoryRouter>
      <Header />
    </MemoryRouter>
  )

describe('cabecera', () => {
  it('el grupo «Libros» enlaza a todas las ediciones de D&D', () => {
    renderHeader()
    fireEvent.click(screen.getByRole('button', { name: 'Libros' }))
    expect(screen.getByRole('link', { name: 'Todas las ediciones' })).toHaveAttribute(
      'href',
      '/ediciones'
    )
  })

  it('el menú móvil también', () => {
    renderHeader()
    fireEvent.click(screen.getByRole('button', { name: 'Abrir el menú' }))
    const navs = screen.getAllByRole('navigation', { name: 'Principal' })
    expect(
      within(navs[navs.length - 1]).getByRole('link', { name: 'Todas las ediciones' })
    ).toHaveAttribute('href', '/ediciones')
  })
})
