import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import ProductDetailPage from './ProductDetailPage'

const renderAt = (path: string) =>
  render(
    <MemoryRouter initialEntries={[path]}>
      <Routes>
        <Route path="/producto/:edition/:code" element={<ProductDetailPage />} />
      </Routes>
    </MemoryRouter>
  )

describe('ProductDetailPage', () => {
  it('muestra las reseñas de un libro, cada una con su nota y sin media', () => {
    const { container } = renderAt('/producto/2024/phb')
    expect(screen.getByRole('heading', { name: 'Reseñas' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Wargamer' })).toBeInTheDocument()
    expect(screen.getByText('9/10')).toBeInTheDocument()
    expect(container.textContent).not.toMatch(/\bmedia\b|promedio/i)
  })

  it('sin reseñas no muestra la sección', () => {
    renderAt('/producto/2024/dms')
    expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument()
    expect(screen.queryByRole('heading', { name: 'Reseñas' })).not.toBeInTheDocument()
  })
})
