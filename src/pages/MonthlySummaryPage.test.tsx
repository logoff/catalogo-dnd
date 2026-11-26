import { describe, it, expect } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import type { MonthlySummary } from '@/types/monthlySummary'
import MonthlySummaryPage from './MonthlySummaryPage'

const november: MonthlySummary = {
  month: '2026-11',
  added: [
    {
      section: 'rol',
      count: 681,
      examples: Array.from({ length: 10 }, (_, i) => ({
        name: `Libro ${i}`,
        path: `/rol/pathfinder-2e/libro-${i}`,
        date: i === 0 ? '2027' : '2026-09',
        context: 'Pathfinder 2E',
      })),
    },
    {
      section: 'libros',
      count: 2,
      examples: [
        { name: 'Dark Sun Map Pack', path: '/producto/2024/dsmp', date: null },
        { name: 'Dark Sun Dungeon Master’s Screen', path: '/producto/2024/dsdms', date: null },
      ],
    },
  ],
  spanishEditions: [{ name: 'Caja de Inicio', path: '/producto/2014/sotdq', date: '2022-10-18' }],
  spanishDates: [
    {
      name: 'Manual de juego 2',
      path: '/rol/pathfinder-2e/player-core-2',
      date: '2026-09',
      before: null,
    },
  ],
  reviews: {
    count: 139,
    items: [
      {
        name: "Player's Handbook",
        path: '/producto/2024/phb',
        outlet: 'Wargamer',
        date: '2026-11-02',
      },
    ],
  },
}
const december: MonthlySummary = {
  month: '2026-12',
  added: [],
  spanishEditions: [],
  spanishDates: [],
  reviews: { count: 0, items: [] },
}

const renderAt = (path: string, months = [november, december]) =>
  render(
    <MemoryRouter initialEntries={[path]}>
      <Routes>
        <Route path="/novedades/:month" element={<MonthlySummaryPage months={months} />} />
      </Routes>
    </MemoryRouter>
  )

const section = (name: string) =>
  screen.getByRole('heading', { name, level: 2 }).closest('section') as HTMLElement

describe('resumen mensual', () => {
  it('pone el mes en el título y los recuentos debajo', () => {
    renderAt('/novedades/2026-11')
    expect(screen.getByRole('heading', { level: 1, name: 'Noviembre de 2026' })).toBeInTheDocument()
    expect(
      screen.getByText(
        '683 fichas nuevas · 1 edición en castellano · 1 fecha en castellano · 139 reseñas'
      )
    ).toBeInTheDocument()
  })

  it('cada sección dice cuántas fichas nuevas hay, enseña los ejemplos y enlaza al listado', () => {
    renderAt('/novedades/2026-11')
    const added = section('Fichas nuevas')
    expect(within(added).getByText('681')).toBeInTheDocument()
    expect(within(added).getByRole('link', { name: 'Libro 0' })).toHaveAttribute(
      'href',
      '/rol/pathfinder-2e/libro-0'
    )
    expect(within(added).getAllByText('Pathfinder 2E')).toHaveLength(10)
    expect(within(added).getByRole('link', { name: /Ver otros juegos de rol/ })).toHaveAttribute(
      'href',
      '/rol'
    )
    // Con todas las fichas a la vista, no hace falta el enlace al listado
    expect(within(added).queryByRole('link', { name: /Ver el catálogo/ })).toBeNull()
    expect(within(added).getAllByText('sin fecha')).toHaveLength(2)
    expect(within(added).getByText('2027')).toBeInTheDocument()
    expect(within(added).getAllByText('sep 2026').length).toBeGreaterThan(0)
  })

  it('muestra las ediciones y fechas en castellano y las reseñas con su medio', () => {
    renderAt('/novedades/2026-11')
    expect(
      within(section('Ediciones en castellano nuevas')).getByText('18 oct 2022')
    ).toBeInTheDocument()
    const dates = section('Fechas en castellano')
    expect(within(dates).getByText('Antes: sin fecha')).toBeInTheDocument()
    const reviews = section('Reseñas nuevas')
    expect(
      within(reviews).getByText(/139 reseñas de medios; aquí, las 1 más recientes/)
    ).toBeInTheDocument()
    expect(within(reviews).getByText('Wargamer')).toBeInTheDocument()
  })

  it('enlaza al mes anterior y al siguiente', () => {
    renderAt('/novedades/2026-11')
    expect(screen.getByRole('link', { name: 'Diciembre de 2026' })).toHaveAttribute(
      'href',
      '/novedades/2026-12'
    )
    expect(screen.getByRole('link', { name: 'Novedades' })).toHaveAttribute('href', '/novedades')
  })

  it('un mes sin cambios lo dice', () => {
    renderAt('/novedades/2026-12')
    expect(screen.getByText('Este mes no hubo cambios en el catálogo.')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Noviembre de 2026' })).toBeInTheDocument()
  })

  it('un mes sin resumen muestra la página de no encontrado', () => {
    renderAt('/novedades/2026-10')
    expect(screen.queryByRole('heading', { level: 1, name: /2026/ })).toBeNull()
  })
})
