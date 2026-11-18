import { describe, it, expect } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import type { Review } from '@/types'
import ProductReviews from './ProductReviews'

const wargamer: Review = {
  outlet: 'wargamer',
  url: 'https://www.wargamer.com/dnd/2024-players-handbook-review',
  language: 'english',
  date: '2024-08-29',
  author: 'Mollie Russell',
  score: 9,
  summary: 'Más accesible que nunca.',
}

const vidaextra: Review = {
  outlet: 'vidaextra',
  url: 'https://www.vidaextra.com/juegos-de-mesa/manual-jugador',
  language: 'castellano',
  date: '2025-04-02',
  summary: 'La traducción es cuidada.',
  spanish_edition: true,
}

describe('ProductReviews', () => {
  it('muestra el medio, el idioma, la nota con su escala, el resumen y el enlace', () => {
    render(<ProductReviews reviews={[wargamer]} />)
    expect(screen.getByRole('heading', { name: 'Wargamer' })).toBeInTheDocument()
    expect(screen.getByText('9/10')).toBeInTheDocument()
    expect(
      screen.getByText('En inglés · Mollie Russell · 29 de agosto de 2024')
    ).toBeInTheDocument()
    expect(screen.getByText('Más accesible que nunca.')).toBeInTheDocument()
    const link = screen.getByRole('link', { name: /Leer la reseña en Wargamer/ })
    expect(link).toHaveAttribute('href', wargamer.url)
    expect(link).toHaveAttribute('target', '_blank')
    expect(link).toHaveAttribute('rel', 'noopener noreferrer')
  })

  it('una reseña sin nota ni autor no deja huecos', () => {
    const { container } = render(<ProductReviews reviews={[vidaextra]} />)
    expect(screen.getByText(/^En castellano · 2 de abril de 2025/)).toBeInTheDocument()
    expect(container.textContent).not.toMatch(/\d+\/\d+/)
  })

  it('marca las reseñas de la edición en castellano', () => {
    render(<ProductReviews reviews={[vidaextra, { ...wargamer }]} />)
    expect(screen.getAllByText('Edición en castellano')).toHaveLength(1)
  })

  it('ordena de la más reciente a la más antigua', () => {
    render(<ProductReviews reviews={[wargamer, vidaextra]} />)
    const items = screen.getAllByRole('listitem')
    expect(within(items[0]).getByRole('heading')).toHaveTextContent('Vidaextra')
    expect(within(items[1]).getByRole('heading')).toHaveTextContent('Wargamer')
  })
})
