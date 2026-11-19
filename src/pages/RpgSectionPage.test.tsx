import { describe, it, expect, beforeEach } from 'vitest'
import { fireEvent, render, screen, within } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import type { License, RpgBook, RpgSystem } from '@/types/rpg'
import { buildRpgIndex } from '@/utils/rpg'
import { setRpgIndex } from '@/services/rpgLoader'
import RpgSectionPage from './RpgSectionPage'

const license = (slug: string, short_name: string): License => ({
  slug,
  name: short_name,
  short_name,
  kind: 'license',
  holder: 'Titular',
  date: '2000',
  description: 'Qué es.\n\nQué permite.',
  links: [{ label: 'Texto', url: `https://example.com/${slug}` }],
})
const system = (slug: string, name: string, family: string, licenses: string[]): RpgSystem => ({
  slug,
  name,
  family,
  publisher: 'Editorial',
  date: '2010',
  description: 'Qué es.\n\nCómo se juega.',
  features: ['d20'],
  licenses: licenses.map((l) => ({ license: l })),
  links: [{ label: 'Web', url: 'https://example.com' }],
})
const book = (
  slug: string,
  title: string,
  sys: string,
  date: string,
  extra: Partial<RpgBook> = {}
): RpgBook => ({
  slug,
  system: sys,
  title,
  kind: 'core',
  core: true,
  description: 'Qué trae.\n\nPara quién es.',
  source: 'https://example.com',
  editions: [{ language: 'english', publisher: 'Editorial', date }],
  ...extra,
})

const spanish = {
  language: 'castellano' as const,
  title: 'Guía del jugador',
  publisher: 'Nosolorol',
  date: '2026',
}

const titles = () =>
  within(screen.getByRole('region', { name: 'Libros' }))
    .queryAllByRole('heading', { level: 3 })
    .map((h) => h.textContent)

describe('página de otros juegos de rol', () => {
  beforeEach(() =>
    setRpgIndex(
      buildRpgIndex(
        [license('ogl', 'OGL'), license('orc', 'ORC')],
        [
          system('pathfinder-1e', 'Pathfinder 1E', 'pathfinder', ['ogl']),
          system('pathfinder-2e', 'Pathfinder 2E', 'pathfinder', ['orc']),
          system('tov', 'Tales of the Valiant', 'tov', ['orc']),
        ],
        [
          book('core', 'Core Rulebook', 'pathfinder-1e', '2009'),
          book('player-core', 'Player Core', 'pathfinder-2e', '2023'),
          book('players-guide', "Player's Guide", 'tov', '2024', {
            editions: [{ language: 'english', publisher: 'Kobold Press', date: '2024' }, spanish],
          }),
          book('compatible', 'Libro Compatible', 'pathfinder-1e', '2015', { license: 'orc' }),
        ]
      )
    )
  )

  const renderPage = () =>
    render(
      <MemoryRouter>
        <RpgSectionPage />
      </MemoryRouter>
    )

  it('presenta los sistemas por familia con su número de libros y enlaza a las licencias', () => {
    renderPage()
    expect(screen.getByRole('link', { name: 'Pathfinder 1E' })).toHaveAttribute(
      'href',
      '/rol/pathfinder-1e'
    )
    expect(screen.getByRole('link', { name: 'Pathfinder 1E' }).parentElement).toHaveTextContent(
      '2 libros'
    )
    expect(screen.getByRole('link', { name: 'Licencias abiertas' })).toHaveAttribute(
      'href',
      '/licencias'
    )
  })

  it('ordena por defecto del más reciente al más antiguo y permite ordenar por título', () => {
    renderPage()
    expect(titles()).toEqual([
      'Guía del jugador',
      'Player Core',
      'Libro Compatible',
      'Core Rulebook',
    ])
    fireEvent.change(screen.getByLabelText('Orden'), { target: { value: 'title' } })
    expect(titles()).toEqual([
      'Core Rulebook',
      'Guía del jugador',
      'Libro Compatible',
      'Player Core',
    ])
  })

  it('filtra por licencia, heredada del sistema o propia del libro', () => {
    renderPage()
    fireEvent.change(screen.getByLabelText('Licencia'), { target: { value: 'orc' } })
    expect(titles()).toEqual(['Guía del jugador', 'Player Core', 'Libro Compatible'])
  })

  it('combina sistema y castellano, y avisa cuando no hay resultados', () => {
    renderPage()
    fireEvent.click(screen.getByLabelText('En castellano'))
    expect(titles()).toEqual(['Guía del jugador'])
    fireEvent.change(screen.getByLabelText('Sistema'), { target: { value: 'pathfinder-2e' } })
    expect(titles()).toEqual([])
    expect(screen.getByText('Ningún libro coincide con los filtros.')).toBeInTheDocument()
  })

  it('busca por título y editorial sin distinguir tildes', () => {
    renderPage()
    fireEvent.change(screen.getByLabelText('Buscar libros'), { target: { value: 'guia' } })
    expect(titles()).toEqual(['Guía del jugador'])
    fireEvent.change(screen.getByLabelText('Buscar libros'), { target: { value: 'kobold' } })
    expect(titles()).toEqual(['Guía del jugador'])
  })
})
