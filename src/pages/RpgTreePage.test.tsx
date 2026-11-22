import { describe, it, expect, beforeAll } from 'vitest'
import { fireEvent, render, screen, within } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { loadRpgIndex } from '@/services/rpgLoader'
import RpgTreePage from './RpgTreePage'

// Con los datos reales de data/rol/systems
describe('árbol genealógico de sistemas', () => {
  beforeAll(async () => {
    await loadRpgIndex()
  })

  const renderPage = () =>
    render(
      <MemoryRouter>
        <RpgTreePage />
      </MemoryRouter>
    )

  it('enlaza cada sistema a su ficha o al catálogo oficial', () => {
    renderPage()
    expect(screen.getByRole('heading', { level: 1, name: 'Árbol genealógico' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'AD&D 2.ª edición, 1989' })).toHaveAttribute(
      'href',
      '/ediciones/dnd-add2'
    )
    expect(screen.getByRole('link', { name: 'Pathfinder 2E, 2019' })).toHaveAttribute(
      'href',
      '/rol/pathfinder-2e'
    )
    expect(screen.getByRole('link', { name: /^D&D 5E \(2014\)/ })).toHaveAttribute('href', '/2014')
  })

  it('dibuja cada derivación con su tipo y explica los trazos en la leyenda', () => {
    const { container } = renderPage()
    const titles = [...container.querySelectorAll('path > title')].map((t) => t.textContent)
    expect(titles).toContain('Cambio mayor de reglas')
    expect(titles).toContain('Inspiración')
    const legend = screen.getByRole('region', { name: 'Leyenda' })
    expect(within(legend).getByText('Reescrito, pero compatible')).toBeInTheDocument()
    expect(within(legend).getByText('Edición oficial de D&D')).toBeInTheDocument()
  })

  it('oculta y muestra los juegos OSR y NSR', () => {
    renderPage()
    expect(screen.getByRole('link', { name: 'Old-School Essentials, 2019' })).toBeInTheDocument()
    fireEvent.click(screen.getByRole('radio', { name: 'Sin OSR ni NSR' }))
    expect(screen.queryByRole('link', { name: 'Old-School Essentials, 2019' })).toBeNull()
    expect(screen.getByRole('link', { name: 'Pathfinder 2E, 2019' })).toBeInTheDocument()
    fireEvent.click(screen.getByRole('radio', { name: 'Todos' }))
    expect(screen.getByRole('link', { name: 'Old-School Essentials, 2019' })).toBeInTheDocument()
  })
})
