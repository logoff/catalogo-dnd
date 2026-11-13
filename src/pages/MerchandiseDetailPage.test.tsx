import { describe, it, expect } from 'vitest'
import { fireEvent, render, screen } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import type { Merchandise } from '@/types/merchandise'
import { enrichMerchandise } from '@/services/merchandiseLoader'
import MerchandiseDetail from '@/components/merchandise/MerchandiseDetail'
import MerchandiseDetailPage from './MerchandiseDetailPage'

const renderAt = (path: string) =>
  render(
    <MemoryRouter initialEntries={[path]}>
      <Routes>
        <Route path="/merchandising/:slug" element={<MerchandiseDetailPage />} />
      </Routes>
    </MemoryRouter>
  )

const base: Merchandise = {
  slug: 'articulo',
  title: 'Artículo',
  group: 'books',
  kind: 'guide_book',
  manufacturer: 'DK',
  description: 'Qué es.\n\nPara quién es.',
  source: 'https://example.com/articulo',
  editions: [{ language: 'english' }],
  images: ['/images/merchandising/articulo/0.jpg'],
}

const renderItem = (extra: Partial<Merchandise>) =>
  render(
    <MemoryRouter>
      <MerchandiseDetail item={enrichMerchandise({ ...base, ...extra })} />
    </MemoryRouter>
  )

const link = (url: string) => [{ store: 'amazon' as const, url }]

describe('MerchandiseDetailPage', () => {
  it('muestra la ficha con sus ediciones en inglés y en castellano', () => {
    renderAt('/merchandising/heroes-feast')
    expect(
      screen.getByRole('heading', { level: 1, name: "Heroes' Feast: The Official D&D Cookbook" })
    ).toBeInTheDocument()
    expect(screen.getByText('Festín de héroes')).toBeInTheDocument()
    expect(screen.getByText('Inglés')).toBeInTheDocument()
    expect(screen.getByText('Castellano, publicado en España')).toBeInTheDocument()
    expect(screen.getAllByRole('link', { name: /Comprar en Amazon/ })).toHaveLength(2)
  })

  it('con un slug inexistente muestra la página de no encontrado', () => {
    renderAt('/merchandising/no-existe')
    expect(screen.getByRole('heading', { name: 'Página no encontrada' })).toBeInTheDocument()
  })
})

describe('MerchandiseDetail', () => {
  it('indica que una edición en español no salió en España y enlaza a su compra', () => {
    renderItem({
      editions: [
        {
          language: 'castellano',
          spain: false,
          title: 'La leyenda de Drizzt',
          purchase_links: link('https://www.amazon.es/dp/X/'),
        },
      ],
    })
    expect(screen.getByText('Español, no publicado en España')).toBeInTheDocument()
    expect(screen.getByText('La leyenda de Drizzt')).toBeInTheDocument()
    const button = screen.getByRole('link', { name: /Comprar en Amazon/ })
    expect(button).toHaveAttribute('data-umami-event-merchandising', 'articulo')
    expect(button).toHaveAttribute('data-umami-event-idioma', 'castellano')
  })

  it('avisa cuando no está a la venta y omite los datos que no tiene', () => {
    renderItem({})
    expect(screen.getByText('No está a la venta en las tiendas del sitio.')).toBeInTheDocument()
    expect(screen.queryByText('Salida:')).not.toBeInTheDocument()
    expect(screen.queryByRole('heading', { name: 'Relacionado' })).not.toBeInTheDocument()
  })

  it('enlaza a la fuente oficial y a los libros y videojuegos relacionados', () => {
    renderItem({
      related_products: [{ edition: '2024', code: 'PHB' }],
      related_videogames: ['baldurs-gate-3'],
    })
    expect(screen.getByRole('link', { name: 'Página oficial' })).toHaveAttribute(
      'href',
      'https://example.com/articulo'
    )
    expect(screen.getByRole('link', { name: "Baldur's Gate 3" })).toHaveAttribute(
      'href',
      '/videojuego/baldurs-gate-3'
    )
    expect(
      screen.getAllByRole('link').some((a) => a.getAttribute('href')?.startsWith('/producto/2024/'))
    ).toBe(true)
  })

  it('abre las imágenes en el visor', () => {
    renderItem({})
    fireEvent.click(screen.getByAltText('Artículo - Imagen 1'))
    expect(screen.getByLabelText('Cerrar')).toBeInTheDocument()
  })
})
