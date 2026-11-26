import { describe, it, expect, beforeAll } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { loadRpgIndex } from '@/services/rpgLoader'
import DndEditionsPage from './DndEditionsPage'

// Con los datos reales
describe('ediciones anteriores de D&D', () => {
  beforeAll(async () => {
    await loadRpgIndex()
  })

  it('lista las ediciones por fecha: las anteriores, a su ficha; las de 5E, al catálogo', () => {
    render(
      <MemoryRouter>
        <DndEditionsPage />
      </MemoryRouter>
    )
    expect(screen.getByRole('heading', { level: 1, name: 'Ediciones de D&D' })).toBeInTheDocument()
    const links = screen.getAllByRole('link').filter((link) => link.closest('ol'))
    const names = links.map((link) => link.querySelector('span')?.textContent)
    expect(names.indexOf('D&D 3.5')).toBeLessThan(names.indexOf('D&D 5E (2014)'))
    expect(names.indexOf('D&D 5E (2014)')).toBeLessThan(names.indexOf('D&D 5E (2024)'))
    const href = (name: string) => links[names.indexOf(name)].getAttribute('href')
    expect(href('D&D 3.5')).toBe('/ediciones/dnd-3-5')
    expect(href('D&D 5E (2014)')).toBe('/2014')
    expect(href('D&D 5E (2024)')).toBe('/2024')
    expect(screen.queryByText(/no es un producto oficial/)).toBeNull()
  })
})
