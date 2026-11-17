import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen, fireEvent, within } from '@testing-library/react'
import { MemoryRouter, Route, Routes, useLocation } from 'react-router-dom'
import type { Novel, NovelIndex } from '@/types/novel'
import { buildNovelIndex } from '@/utils/novels'
import { setNovelIndex } from '@/services/novelLoader'
import { NOVELS_PAGE_SIZE, useNovelStore } from '@/store/novelStore'
import NovelsPage from './NovelsPage'

const english = {
  language: 'english' as const,
  country: 'us' as const,
  publisher: 'TSR',
  format: 'paperback' as const,
}

const novel = (title: string, extra: Partial<Novel>): Novel => ({
  slug: title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
  title,
  authors: ['Margaret Weis', 'Tracy Hickman'],
  setting: 'dragonlance',
  kind: 'novel',
  description: 'a\n\nb',
  source: 'https://example.com/',
  editions: [english],
  ...extra,
})

const novels = [
  novel('Dragons of Autumn Twilight', {
    series: { id: 'chronicles', number: 1 },
    date: '1984-11',
    editions: [
      english,
      {
        language: 'castellano',
        spain: true,
        title: 'El retorno de los dragones',
        publisher: 'Timun Mas',
        format: 'hardcover',
      },
    ],
  }),
  novel('Dragons of Winter Night', { series: { id: 'chronicles', number: 2 }, date: '1985-07' }),
  novel('The Legend of Huma', { date: '1988-02' }),
  novel('Homeland', {
    setting: 'forgotten_realms',
    authors: ['R. A. Salvatore'],
    series: { id: 'dark-elf', number: 1 },
    date: '1990-08',
  }),
]

const series = [
  {
    id: 'chronicles',
    title: 'Dragonlance Chronicles',
    title_es: 'Crónicas de la Dragonlance',
    setting: 'dragonlance' as const,
  },
  { id: 'dark-elf', title: 'The Dark Elf Trilogy', setting: 'forgotten_realms' as const },
]

const index: NovelIndex = buildNovelIndex(novels, series)

// El panel pinta los filtros dos veces (escritorio y móvil); se usa la primera copia
const checkbox = (label: string) => screen.getAllByLabelText(label)[0] as HTMLInputElement
const cards = () =>
  screen.getAllByRole('link').filter((link) => link.getAttribute('href')?.startsWith('/novela/'))
const titles = () => cards().map((card) => within(card).getByRole('heading').textContent)

function Search() {
  return <span data-testid="search">{useLocation().search}</span>
}

const renderPage = (url = '/novelas') =>
  render(
    <MemoryRouter initialEntries={[url]}>
      <Routes>
        <Route
          path="/novelas"
          element={
            <>
              <NovelsPage />
              <Search />
            </>
          }
        />
      </Routes>
    </MemoryRouter>
  )

describe('NovelsPage', () => {
  beforeEach(() => {
    setNovelIndex(index)
    useNovelStore.getState().clearFilters()
    useNovelStore.getState().setSort({ field: 'date', direction: 'desc' })
  })

  it('lista las novelas de la más reciente a la más antigua', () => {
    renderPage()
    expect(titles()).toEqual([
      'Homeland',
      'The Legend of Huma',
      'Dragons of Winter Night',
      'Dragons of Autumn Twilight',
    ])
    expect(screen.getByText('4 de 4 novelas')).toBeInTheDocument()
  })

  it('cada tarjeta enlaza a su ficha y muestra título en castellano, serie y marca', () => {
    renderPage()
    const card = cards().find((c) => c.textContent?.includes('Autumn'))!
    expect(card).toHaveAttribute('href', '/novela/dragons-of-autumn-twilight')
    expect(within(card).getByText('El retorno de los dragones')).toBeInTheDocument()
    expect(within(card).getByText('Crónicas de la Dragonlance 1')).toBeInTheDocument()
    expect(within(card).getByText('En castellano')).toBeInTheDocument()
    const huma = cards().find((c) => c.textContent?.includes('Huma'))!
    expect(within(huma).getByText('Solo en inglés')).toBeInTheDocument()
  })

  it('combina mundo y serie, y solo ofrece las series del mundo elegido', () => {
    renderPage()
    fireEvent.click(checkbox('Reinos Olvidados'))
    expect(titles()).toEqual(['Homeland'])
    expect(screen.queryAllByLabelText('Crónicas de la Dragonlance')).toHaveLength(0)
    fireEvent.click(checkbox('Reinos Olvidados'))
    fireEvent.click(checkbox('Crónicas de la Dragonlance'))
    expect(titles()).toEqual(['Dragons of Winter Night', 'Dragons of Autumn Twilight'])
    fireEvent.click(checkbox('Con edición en castellano'))
    expect(titles()).toEqual(['Dragons of Autumn Twilight'])
  })

  it('busca por título en castellano y por autor, sin tildes', () => {
    renderPage()
    const search = screen.getAllByLabelText('Buscar por título o autor')[0]
    fireEvent.change(search, { target: { value: 'el retorno de los dragones' } })
    expect(titles()).toEqual(['Dragons of Autumn Twilight'])
    fireEvent.change(search, { target: { value: 'SALVATORE' } })
    expect(titles()).toEqual(['Homeland'])
  })

  it('ordena por orden de lectura', () => {
    renderPage()
    fireEvent.change(screen.getAllByLabelText('Ordenar por')[0], {
      target: { value: 'reading-asc' },
    })
    expect(titles()).toEqual([
      'Dragons of Autumn Twilight',
      'Dragons of Winter Night',
      'The Legend of Huma',
      'Homeland',
    ])
  })

  it('aplica los filtros de la dirección y refleja en ella los que se eligen', () => {
    renderPage('/novelas?serie=dark-elf')
    expect(titles()).toEqual(['Homeland'])
    fireEvent.click(checkbox('Reinos Olvidados'))
    expect(screen.getByTestId('search').textContent).toBe('?mundo=forgotten_realms&serie=dark-elf')
  })

  it('muestra las novelas por tandas', () => {
    const many = Array.from({ length: NOVELS_PAGE_SIZE + 5 }, (_, i) =>
      novel(`Novel ${String(i).padStart(2, '0')}`, { date: `20${String(i).padStart(2, '0')}` })
    )
    setNovelIndex(buildNovelIndex(many, []))
    renderPage()
    expect(cards()).toHaveLength(NOVELS_PAGE_SIZE)
    fireEvent.click(screen.getByRole('button', { name: 'Ver más (5 restantes)' }))
    expect(cards()).toHaveLength(NOVELS_PAGE_SIZE + 5)
  })

  it('sin resultados lo dice y permite quitar los filtros', () => {
    renderPage()
    fireEvent.change(screen.getAllByLabelText('Buscar por título o autor')[0], {
      target: { value: 'nada que coincida' },
    })
    expect(screen.getByText('Ninguna novela cumple los filtros seleccionados')).toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: 'Quitar filtros' }))
    expect(titles()).toHaveLength(4)
  })
})
