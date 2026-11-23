import { describe, it, expect } from 'vitest'
import { fireEvent, render, screen, within } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import type { ReleasesIndex } from '@/types/releases'
import ReleasesPage from './ReleasesPage'

const data: ReleasesIndex = {
  today: '2026-11-23',
  upcoming: [
    {
      name: 'Fiends & Foes',
      path: '/merchandising/fiends-and-foes',
      section: 'merchandising',
      key: 'english',
      language: 'english',
      date: '2026-11-24',
    },
    {
      name: 'Dungeons!',
      path: '/merchandising/dungeons',
      section: 'merchandising',
      key: 'english',
      language: 'english',
      date: '2027-04-27',
    },
  ],
  announced: [
    {
      name: 'Core Set',
      path: '/rol/daggerheart/daggerheart-core-set',
      section: 'rol',
      context: 'Daggerheart',
      key: 'castellano-Devir',
      language: 'castellano',
      year: '2027',
    },
    {
      name: 'Dark Sun: Blood and Power',
      path: '/producto/2024/dsbap',
      section: 'libros',
      key: 'english-Dark Sun',
      language: 'english',
    },
  ],
  recent: [
    {
      name: 'Condena',
      path: '/novela/condemnation',
      section: 'novelas',
      key: 'castellano',
      language: 'castellano',
      date: '2026-11-18',
    },
    {
      name: 'Guía del mundo de Tian Xia',
      path: '/rol/pathfinder-2e/tian-xia-world-guide',
      section: 'rol',
      context: 'Pathfinder 2E',
      key: 'castellano-Devir',
      language: 'castellano',
      date: '2026-11-01',
      monthOnly: true,
    },
    {
      name: 'D&D: World of Warcraft',
      path: '/producto/2024/ddwow',
      section: 'libros',
      key: 'english',
      language: 'english',
      date: '2026-11-17',
    },
    {
      name: 'Juego',
      path: '/videojuego/juego',
      section: 'videojuegos',
      key: 'pc',
      date: '2026-10-02',
    },
  ],
}

const renderPage = (index: ReleasesIndex = data) =>
  render(
    <MemoryRouter>
      <ReleasesPage data={index} />
    </MemoryRouter>
  )

const section = (name: string) =>
  screen.getByRole('heading', { name, level: 2 }).closest('section') as HTMLElement

describe('página de novedades', () => {
  it('agrupa por meses lo próximo y lo reciente, con los anunciados aparte', () => {
    renderPage()
    const upcoming = section('Próximamente')
    expect(within(upcoming).getByText('noviembre de 2026')).toBeInTheDocument()
    expect(within(upcoming).getByText('abril de 2027')).toBeInTheDocument()
    expect(within(upcoming).getByText('Anunciados sin fecha concreta')).toBeInTheDocument()
    expect(within(upcoming).getByText('2027')).toBeInTheDocument()
    expect(within(upcoming).getByText('Sin fecha')).toBeInTheDocument()

    const recent = section('Recién salido')
    expect(within(recent).getByText('noviembre de 2026')).toBeInTheDocument()
    expect(within(recent).getByText('octubre de 2026')).toBeInTheDocument()
  })

  it('muestra la sección, el juego, el idioma y solo el mes si el dato no da el día', () => {
    renderPage()
    const item = screen.getByRole('link', { name: 'Guía del mundo de Tian Xia' }).closest('li')!
    expect(within(item).getByText('Otros juegos de rol · Pathfinder 2E')).toBeInTheDocument()
    expect(within(item).getByText('Castellano')).toBeInTheDocument()
    expect(within(item).getByText('nov')).toBeInTheDocument()
    const book = screen.getByRole('link', { name: 'D&D: World of Warcraft' }).closest('li')!
    expect(within(book).getByText('Libro 5.5E (2024)')).toBeInTheDocument()
    expect(within(book).getByText('17 nov')).toBeInTheDocument()
  })

  it('cada enlace lanza el evento de Umami con la sección y el idioma', () => {
    renderPage()
    const link = screen.getByRole('link', { name: 'Condena' })
    expect(link).toHaveAttribute('href', '/novela/condemnation')
    expect(link).toHaveAttribute('data-umami-event', 'novedades')
    expect(link).toHaveAttribute('data-umami-event-seccion', 'novelas')
    expect(link).toHaveAttribute('data-umami-event-idioma', 'castellano')
  })

  it('no muestra «Próximamente» si no hay nada anunciado', () => {
    renderPage({ ...data, upcoming: [], announced: [] })
    expect(screen.queryByRole('heading', { name: 'Próximamente' })).toBeNull()
    expect(screen.getByRole('heading', { name: 'Recién salido' })).toBeInTheDocument()
  })

  it('el filtro de castellano deja solo esas entradas y quita los meses vacíos', () => {
    renderPage()
    expect(screen.getByRole('radio', { name: 'Todos' })).toHaveAttribute('aria-checked', 'true')
    fireEvent.click(screen.getByRole('radio', { name: 'Castellano' }))
    expect(screen.queryByRole('link', { name: 'D&D: World of Warcraft' })).toBeNull()
    expect(screen.queryByRole('link', { name: 'Juego' })).toBeNull()
    expect(screen.getByRole('link', { name: 'Condena' })).toBeInTheDocument()
    expect(within(section('Recién salido')).queryByText('octubre de 2026')).toBeNull()
    // Lo próximo solo tenía inglés: quedan los anunciados en castellano
    expect(within(section('Próximamente')).queryByText('abril de 2027')).toBeNull()
    expect(screen.getByRole('link', { name: 'Core Set' })).toBeInTheDocument()
  })

  it('enlaza al feed Atom', () => {
    renderPage()
    expect(screen.getByRole('link', { name: 'feed de novedades' })).toHaveAttribute(
      'href',
      '/feed.xml'
    )
  })
})
