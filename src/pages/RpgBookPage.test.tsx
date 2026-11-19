import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import type { License, RpgBook, RpgSystem } from '@/types/rpg'
import { buildRpgIndex } from '@/utils/rpg'
import { cacheBook, setRpgIndex } from '@/services/rpgLoader'
import { expectAffiliateNotices } from '@/test/affiliate'
import RpgBookPage from './RpgBookPage'

const orc: License = {
  slug: 'orc',
  name: 'ORC License',
  short_name: 'ORC',
  kind: 'license',
  holder: 'Azora Law',
  date: '2023',
  description: 'Qué es.\n\nQué permite.',
  links: [{ label: 'Texto', url: 'https://example.com/orc' }],
}
const system: RpgSystem = {
  slug: 'pathfinder-2e',
  name: 'Pathfinder 2E',
  family: 'pathfinder',
  publisher: 'Paizo',
  date: '2019',
  description: 'Qué es.\n\nCómo se juega.',
  features: ['Tres acciones'],
  licenses: [{ license: 'orc' }],
  links: [{ label: 'Paizo', url: 'https://paizo.com' }],
}
const book: RpgBook = {
  slug: 'player-core',
  system: 'pathfinder-2e',
  title: 'Player Core',
  kind: 'core',
  core: true,
  description: 'Qué trae.\n\nPara quién es.',
  source: 'https://paizo.com/player-core',
  editions: [
    {
      language: 'english',
      publisher: 'Paizo',
      date: '2023-11-15',
      format: 'hardcover',
      isbn13: 9781640785533,
      purchase_links: [{ store: 'amazon', url: 'https://www.amazon.es/dp/1640785531' }],
    },
    {
      language: 'castellano',
      title: 'Manual de juego',
      publisher: 'Devir',
      date: '2024',
      purchase_links: [{ store: 'nosolorol', url: 'https://www.nosolorol.com/manual-de-juego' }],
    },
  ],
}
const compatibleOnly: RpgBook = {
  ...book,
  slug: 'compatible',
  title: 'Compatible',
  license: 'none',
  editions: [{ language: 'english', publisher: 'Otra' }],
}

const renderAt = (path: string) =>
  render(
    <MemoryRouter initialEntries={[path]}>
      <Routes>
        <Route path="/rol/:system/:book" element={<RpgBookPage />} />
      </Routes>
    </MemoryRouter>
  )

describe('ficha de libro', () => {
  beforeEach(() => {
    setRpgIndex(buildRpgIndex([orc], [system], [book, compatibleOnly]))
    cacheBook(book)
    cacheBook(compatibleOnly)
  })

  it('muestra título, sistema, licencia heredada, descripción y aviso de no oficial', () => {
    renderAt('/rol/pathfinder-2e/player-core')
    expect(screen.getByRole('heading', { level: 1, name: 'Player Core' })).toBeInTheDocument()
    expect(screen.getByText('Manual de juego', { selector: 'p' })).toBeInTheDocument()
    expect(screen.getByText(/no es un producto oficial de Dungeons & Dragons/)).toBeInTheDocument()
    // En las migas de pan y en los datos del libro
    expect(screen.getAllByRole('link', { name: 'Pathfinder 2E' })[1]).toHaveAttribute(
      'href',
      '/rol/pathfinder-2e'
    )
    expect(screen.getByRole('link', { name: 'ORC' })).toHaveAttribute('href', '/licencia/orc')
    expect(screen.getByText('Qué trae.')).toBeInTheDocument()
  })

  it('pone primero la edición en castellano, con sus botones y el aviso de afiliado', () => {
    renderAt('/rol/pathfinder-2e/player-core')
    const editions = screen.getByRole('heading', { level: 2, name: 'Ediciones' }).parentElement!
    const rows = within(editions).getAllByRole('listitem')
    expect(rows[0]).toHaveTextContent('Castellano: Manual de juego')
    expect(rows[1]).toHaveTextContent('ISBN 978-1-64078-553-3')
    const nosolorol = within(rows[0]).getByRole('link', { name: /Comprar en NoSoloRol/ })
    expect(nosolorol).toHaveAttribute('data-umami-event-rol', 'pathfinder-2e/player-core')
    expect(nosolorol).toHaveAttribute('data-umami-event-idioma', 'castellano')
    expectAffiliateNotices()
  })

  it('indica cuando el libro solo se declara compatible y no está a la venta', () => {
    renderAt('/rol/pathfinder-2e/compatible')
    expect(screen.getByText('Sin licencia abierta: se declara compatible')).toBeInTheDocument()
    expect(screen.getByText('No está a la venta en las tiendas del sitio.')).toBeInTheDocument()
  })

  it('un libro en la URL de otro sistema muestra la página de no encontrado', async () => {
    renderAt('/rol/otro-sistema/player-core')
    expect(await screen.findByText(/no encontrad/i)).toBeInTheDocument()
  })
})
