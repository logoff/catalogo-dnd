import { describe, it, expect, beforeAll } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { getRpgIndex, loadRpgIndex, setRpgIndex } from '@/services/rpgLoader'
import RpgSystemPage from './RpgSystemPage'

// Con los datos reales: las fichas piloto de D&D y Pathfinder
const renderAt = (path: string) =>
  render(
    <MemoryRouter initialEntries={[path]}>
      <Routes>
        <Route path="/rol/:system" element={<RpgSystemPage />} />
      </Routes>
    </MemoryRouter>
  )

const section = (name: string) => screen.getByRole('heading', { level: 2, name }).parentElement!

describe('ficha de sistema', () => {
  beforeAll(async () => {
    await loadRpgIndex()
  })

  it('Pathfinder 2E: características, licencias con su versión, derivación, familia y libros', () => {
    renderAt('/rol/pathfinder-2e')
    expect(screen.getByRole('heading', { level: 1, name: 'Pathfinder 2E' })).toBeInTheDocument()
    expect(screen.getByText(/no es un producto oficial de Dungeons & Dragons/)).toBeInTheDocument()
    expect(within(section('Características')).getAllByRole('listitem').length).toBeGreaterThan(0)
    const licenses = section('Licencias abiertas')
    expect(within(licenses).getByText('Desde Remaster (2023)')).toBeInTheDocument()
    expect(within(licenses).getByRole('link', { name: /ORC/ })).toHaveAttribute(
      'href',
      '/licencia/orc'
    )
    const derivations = section('Derivaciones')
    expect(within(derivations).getByRole('link', { name: 'Pathfinder 1E' })).toBeInTheDocument()
    expect(within(derivations).getByText('Cambio mayor de reglas')).toBeInTheDocument()
    expect(
      within(section('Otras ediciones')).getByRole('link', { name: /Pathfinder 1E/ })
    ).toHaveAttribute('href', '/rol/pathfinder-1e')
    expect(
      within(section('Libros')).getByRole('link', { name: 'Manual de juego (Remaster)' })
    ).toHaveAttribute('href', '/rol/pathfinder-2e/player-core')
  })

  it('D&D 3.5 muestra los sistemas que derivan de él, con la licencia por la que derivan', () => {
    renderAt('/rol/dnd-3-5')
    const derivations = section('Derivaciones')
    expect(within(derivations).getByText('Derivan de él')).toBeInTheDocument()
    expect(within(derivations).getByRole('link', { name: 'Pathfinder 1E' })).toBeInTheDocument()
    expect(within(derivations).getAllByText(/a través de OGL 1\.0a/).length).toBeGreaterThan(0)
  })

  it('D&D 5E (2014) enlaza al catálogo oficial sin listar libros oficiales ni el aviso', () => {
    renderAt('/rol/dnd-5e-2014')
    expect(
      screen.getByRole('link', { name: 'Ver sus libros oficiales en el catálogo' })
    ).toHaveAttribute('href', '/2014')
    expect(screen.queryByRole('heading', { level: 2, name: 'Libros' })).toBeNull()
    expect(screen.queryByText(/no es un producto oficial/)).toBeNull()
  })

  it('un sistema sin licencia abierta lo indica', () => {
    const index = getRpgIndex()!
    setRpgIndex({
      ...index,
      systems: [
        ...index.systems,
        { ...index.systems[0], slug: 'cerrado', name: 'Cerrado', family: 'cerrado', licenses: [] },
      ],
    })
    renderAt('/rol/cerrado')
    expect(
      within(section('Licencias abiertas')).getByText('No tiene licencia abierta.')
    ).toBeInTheDocument()
    setRpgIndex(index)
  })

  it('un sistema que no existe muestra la página de no encontrado', () => {
    renderAt('/rol/no-existe')
    expect(screen.queryByRole('heading', { level: 2, name: 'Características' })).toBeNull()
    expect(screen.getByText(/no encontrad/i)).toBeInTheDocument()
  })
})
