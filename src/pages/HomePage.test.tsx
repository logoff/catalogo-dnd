import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import Header from '@/components/layout/Header'
import HomePage from './HomePage'
import { useProductStore } from '@/store/productStore'
import { getAllMerchandise } from '@/services/merchandiseLoader'

describe('acceso a los videojuegos', () => {
  it('la portada enlaza a la sección y muestra los últimos juegos', () => {
    render(
      <MemoryRouter>
        <HomePage />
      </MemoryRouter>
    )
    const links = screen.getAllByRole('link', { name: /Videojuegos|Ver todos/ })
    expect(links.some((link) => link.getAttribute('href') === '/videojuegos')).toBe(true)
    expect(screen.getByRole('heading', { name: 'Videojuegos' })).toBeInTheDocument()
    const gameLinks = screen
      .getAllByRole('link')
      .filter((link) => link.getAttribute('href')?.startsWith('/videojuego/'))
    expect(gameLinks.length).toBeGreaterThan(0)
    expect(gameLinks.length).toBeLessThanOrEqual(4)
  })

  it('la cabecera enlaza a la sección', () => {
    render(
      <MemoryRouter>
        <Header />
      </MemoryRouter>
    )
    expect(screen.getByRole('link', { name: 'Videojuegos' })).toHaveAttribute(
      'href',
      '/videojuegos'
    )
  })
})

describe('acceso al merchandising', () => {
  it('la portada enlaza a la sección y muestra los últimos artículos', () => {
    render(
      <MemoryRouter>
        <HomePage />
      </MemoryRouter>
    )
    const links = screen.getAllByRole('link', { name: /Merchandising|Ver todo/ })
    expect(links.some((link) => link.getAttribute('href') === '/merchandising')).toBe(true)
    expect(screen.getByRole('heading', { name: 'Merchandising' })).toBeInTheDocument()
    const itemLinks = screen
      .getAllByRole('link')
      .filter((link) => link.getAttribute('href')?.startsWith('/merchandising/'))
    expect(itemLinks.length).toBeGreaterThan(0)
    expect(itemLinks.length).toBeLessThanOrEqual(4)
  })

  it('la cabecera enlaza a la sección', () => {
    render(
      <MemoryRouter>
        <Header />
      </MemoryRouter>
    )
    expect(screen.getByRole('link', { name: 'Merchandising' })).toHaveAttribute(
      'href',
      '/merchandising'
    )
  })

  it('el buscador de la cabecera sigue buscando solo libros', () => {
    // El buscador filtra el store de productos, que no incluye el merchandising
    const productTitles = useProductStore.getState().products.map((p) => p.primaryTitle)
    const merchandiseTitles = getAllMerchandise().map((item) => item.title)
    expect(productTitles.filter((title) => merchandiseTitles.includes(title))).toEqual([])
  })
})
