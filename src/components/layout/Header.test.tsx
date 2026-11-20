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
  it('agrupa lo oficial de D&D, los otros juegos de rol y las guías', () => {
    renderHeader()
    for (const group of ['Libros', 'Más de D&D', 'Otros juegos de rol']) {
      expect(screen.getByRole('button', { name: group })).toBeInTheDocument()
    }
    expect(screen.getByRole('link', { name: 'Guías' })).toHaveAttribute('href', '/guias')
  })

  it('el grupo «Libros» enlaza a todas las ediciones de D&D', () => {
    renderHeader()
    fireEvent.click(screen.getByRole('button', { name: 'Libros' }))
    expect(screen.getByRole('link', { name: /Todas las ediciones/ })).toHaveAttribute(
      'href',
      '/ediciones'
    )
  })

  it('los otros juegos de rol llevan al árbol y a las licencias, y cada clic se mide', () => {
    renderHeader()
    fireEvent.click(screen.getByRole('button', { name: 'Otros juegos de rol' }))
    const tree = screen.getByRole('link', { name: /Árbol genealógico/ })
    expect(tree).toHaveAttribute('href', '/rol/arbol')
    expect(tree).toHaveAttribute('data-umami-event', 'menu')
    expect(tree).toHaveAttribute('data-umami-event-seccion', 'Árbol genealógico')
    expect(screen.getByRole('link', { name: /Licencias abiertas/ })).toHaveAttribute(
      'href',
      '/licencias'
    )
  })

  it('el menú móvil tiene todos los grupos', () => {
    renderHeader()
    fireEvent.click(screen.getByRole('button', { name: 'Abrir el menú' }))
    const navs = screen.getAllByRole('navigation', { name: 'Principal' })
    const mobile = within(navs[navs.length - 1])
    expect(mobile.getByRole('link', { name: 'Todas las ediciones' })).toHaveAttribute(
      'href',
      '/ediciones'
    )
    expect(mobile.getByRole('link', { name: 'Novelas' })).toHaveAttribute('href', '/novelas')
    expect(mobile.getByRole('link', { name: 'Árbol genealógico' })).toHaveAttribute(
      'href',
      '/rol/arbol'
    )
  })
})
