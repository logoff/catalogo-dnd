import { describe, it, expect } from 'vitest'
import { fireEvent, render, screen, within } from '@testing-library/react'
import { latestInSpanish, productPath } from '@/utils/releases'
import { MemoryRouter } from 'react-router-dom'
import Header from '@/components/layout/Header'
import HomePage, { ReleasesPreview } from './HomePage'
import releases from 'virtual:releases'
import type { ReleasesIndex } from '@/types/releases'
import { useProductStore } from '@/store/productStore'
import { getAllMerchandise } from '@/services/merchandiseLoader'
import novelsLatest from 'virtual:novels-latest'
import rpgStats from 'virtual:rpg-stats'
import rpgIndex from 'virtual:rpg-index'
import { rolSection } from '@/utils/rpg'

// Abre el grupo del menú y devuelve su enlace
const headerLink = (group: string, name: RegExp) => {
  render(
    <MemoryRouter>
      <Header />
    </MemoryRouter>
  )
  fireEvent.click(screen.getByRole('button', { name: group }))
  return screen.getByRole('link', { name })
}

describe('acceso a los videojuegos', () => {
  it('la portada enlaza a la sección y muestra los últimos juegos', () => {
    render(
      <MemoryRouter>
        <HomePage />
      </MemoryRouter>
    )
    const links = screen.getAllByRole('link', { name: /Videojuegos|Ver todos/ })
    expect(links.some((link) => link.getAttribute('href') === '/videojuegos')).toBe(true)
    expect(screen.getByRole('heading', { name: 'Videojuegos' })).toBeInTheDocument()
    const gameLinks = screen
      .getAllByRole('link')
      .filter((link) => link.getAttribute('href')?.startsWith('/videojuego/'))
    expect(gameLinks.length).toBeGreaterThan(0)
    expect(gameLinks.length).toBeLessThanOrEqual(4)
  })

  it('la cabecera enlaza a la sección', () => {
    expect(headerLink('Más de D&D', /^Videojuegos/)).toHaveAttribute('href', '/videojuegos')
  })
})

describe('acceso al merchandising', () => {
  it('la portada enlaza a la sección y muestra los últimos artículos', () => {
    render(
      <MemoryRouter>
        <HomePage />
      </MemoryRouter>
    )
    const links = screen.getAllByRole('link', { name: /Merchandising|Ver todo/ })
    expect(links.some((link) => link.getAttribute('href') === '/merchandising')).toBe(true)
    expect(screen.getByRole('heading', { name: 'Merchandising' })).toBeInTheDocument()
    // Solo los del bloque de merchandising (el de novedades también puede enlazar artículos)
    const block = screen.getByRole('heading', { name: 'Merchandising' }).closest('section')!
    const itemLinks = within(block)
      .getAllByRole('link')
      .filter((link) => link.getAttribute('href')?.startsWith('/merchandising/'))
    expect(itemLinks.length).toBeGreaterThan(0)
    expect(itemLinks.length).toBeLessThanOrEqual(4)
  })

  it('la cabecera enlaza a la sección', () => {
    expect(headerLink('Más de D&D', /^Merchandising/)).toHaveAttribute('href', '/merchandising')
  })

  it('el buscador de la cabecera sigue buscando solo libros', () => {
    // El buscador filtra el store de productos, que no incluye el merchandising
    const productTitles = useProductStore.getState().products.map((p) => p.primaryTitle)
    const merchandiseTitles = getAllMerchandise().map((item) => item.title)
    expect(productTitles.filter((title) => merchandiseTitles.includes(title))).toEqual([])
  })
})

describe('acceso a las novelas', () => {
  it('la portada enlaza a la sección y muestra las últimas novelas con el total', () => {
    render(
      <MemoryRouter>
        <HomePage />
      </MemoryRouter>
    )
    const links = screen.getAllByRole('link', { name: /Novelas|Ver todas/ })
    expect(links.some((link) => link.getAttribute('href') === '/novelas')).toBe(true)
    expect(screen.getByRole('heading', { name: 'Novelas' })).toBeInTheDocument()
    // Solo los del bloque de novelas (el de novedades también puede enlazar novelas)
    const block = screen.getByRole('heading', { name: 'Novelas' }).closest('section')!
    const novelLinks = within(block)
      .getAllByRole('link')
      .filter((link) => link.getAttribute('href')?.startsWith('/novela/'))
    expect(novelLinks.length).toBeGreaterThan(0)
    expect(novelLinks.length).toBeLessThanOrEqual(4)
    expect(screen.getByText(String(novelsLatest.total))).toBeInTheDocument()
  })

  it('la cabecera enlaza a la sección', () => {
    expect(headerLink('Más de D&D', /^Novelas/)).toHaveAttribute('href', '/novelas')
  })

  it('el buscador de la cabecera sigue buscando solo libros', () => {
    // El buscador filtra el store de productos, que no incluye las novelas
    const productTitles = useProductStore.getState().products.map((p) => p.primaryTitle)
    const novelTitles = novelsLatest.latest.map((novel) => novel.title)
    expect(productTitles.filter((title) => novelTitles.includes(title))).toEqual([])
  })
})

describe('portada', () => {
  it('empieza los bloques con las novedades, que enlazan a /novedades', () => {
    render(
      <MemoryRouter>
        <HomePage />
      </MemoryRouter>
    )
    const headings = screen.getAllByRole('heading', { level: 2 }).map((h) => h.textContent)
    expect(headings[0]).toBe('Novedades')
    const block = screen.getByRole('heading', { name: 'Novedades', level: 2 }).closest('section')!
    expect(within(block).getByRole('link', { name: /Ver todas/ })).toHaveAttribute(
      'href',
      '/novedades'
    )
    const shown = releases.recent.slice(0, 3).map((r) => r.name)
    for (const name of shown) expect(within(block).getAllByText(name).length).toBeGreaterThan(0)
  })

  it('el bloque de novedades muestra hasta tres próximas y tres recientes', () => {
    const release = (name: string, date: string): ReleasesIndex['recent'][number] => ({
      name,
      date,
      path: `/novela/${name}`,
      section: 'novelas',
      key: name,
    })
    const data: ReleasesIndex = {
      today: '2026-11-23',
      upcoming: ['p1', 'p2', 'p3', 'p4'].map((n) => release(n, '2026-12-01')),
      recent: ['r1', 'r2', 'r3', 'r4'].map((n) => release(n, '2026-11-01')),
      announced: [],
    }
    const { unmount } = render(
      <MemoryRouter>
        <ReleasesPreview data={data} />
      </MemoryRouter>
    )
    expect(screen.getByRole('heading', { name: 'Próximamente' })).toBeInTheDocument()
    expect(screen.getAllByRole('link', { name: /^[pr]\d$/ }).map((l) => l.textContent)).toEqual([
      'p1',
      'p2',
      'p3',
      'r1',
      'r2',
      'r3',
    ])
    unmount()

    render(
      <MemoryRouter>
        <ReleasesPreview data={{ ...data, upcoming: [] }} />
      </MemoryRouter>
    )
    expect(screen.queryByRole('heading', { name: 'Próximamente' })).toBeNull()
    expect(screen.getByRole('heading', { name: 'Recién salido' })).toBeInTheDocument()
  })

  it('muestra los libros salidos más recientemente en castellano', () => {
    render(
      <MemoryRouter>
        <HomePage />
      </MemoryRouter>
    )
    const block = screen.getByRole('heading', { name: 'Últimos en castellano' }).closest('section')!
    const shown = within(block)
      .getAllByRole('link')
      .map((link) => link.getAttribute('href'))
      .filter((href) => href?.startsWith('/producto/'))
    const expected = latestInSpanish(useProductStore.getState().products, 5).map(productPath)
    expect(shown).toEqual(expected)
  })

  it('cada sección tiene su acceso con el recuento', () => {
    render(
      <MemoryRouter>
        <HomePage />
      </MemoryRouter>
    )
    const sections = screen.getByRole('region', { name: 'Secciones del catálogo' })
    for (const href of ['/2024', '/2014', '/videojuegos', '/merchandising', '/novelas', '/guias']) {
      expect(
        within(sections)
          .getAllByRole('link')
          .some((l) => l.getAttribute('href') === href)
      ).toBe(true)
    }
  })
})

describe('acceso a otros juegos de rol', () => {
  it('la portada enlaza a la sección con el número de sistemas y de libros', () => {
    render(
      <MemoryRouter>
        <HomePage />
      </MemoryRouter>
    )
    const card = screen.getByRole('link', { name: /Otros juegos de rol/ })
    expect(card).toHaveAttribute('href', '/rol')
    expect(card).toHaveTextContent(`otros ${rpgStats.systems} sistemas`)
    expect(within(card).getByText(String(rpgStats.books))).toBeInTheDocument()
  })

  it('la cabecera enlaza a la sección', () => {
    expect(headerLink('Otros juegos de rol', /^Juegos y libros/)).toHaveAttribute('href', '/rol')
  })

  it('el buscador de la cabecera no muestra libros de la sección', () => {
    // El buscador filtra el store de productos, que no incluye los libros de la sección
    const productTitles = useProductStore.getState().products.map((p) => p.primaryTitle)
    // Los básicos de las ediciones anteriores de D&D se llaman como los de 5E: no cuentan
    const rpgTitles = rolSection(rpgIndex.systems, rpgIndex.books).books.map((book) => book.title)
    expect(productTitles.filter((title) => rpgTitles.includes(title))).toEqual([])
  })
})
