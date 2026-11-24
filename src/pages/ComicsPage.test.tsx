import { describe, it, expect } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import type { Comic } from '@/types/comic'
import { buildComicIndex } from '@/utils/comics'
import {
  cacheComic,
  loadNovelIndexForTests,
  setCollections,
  setComicIndex,
} from './comicPageTestUtils'
import ComicsPage from './ComicsPage'
import ComicDetailPage from './ComicDetailPage'

const comic = (slug: string, extra: Partial<Comic> = {}): Comic => ({
  slug,
  title: slug,
  publisher: 'IDW Publishing',
  setting: 'forgotten_realms',
  kind: 'limited_series',
  date: '2021-10',
  issue_count: 2,
  description: 'De qué trata.\n\nDónde encaja.',
  source: 'https://www.comics.org/series/1/',
  issues: [
    { number: '1', date: '2021-10-20' },
    { number: '2', date: '2021-11-24' },
  ],
  ...extra,
})

const comics = [
  comic('mindbreaker', {
    title: 'Dungeons & Dragons: Mindbreaker',
    writers: ['Jim Zub'],
    editions: [
      {
        language: 'english',
        title: 'Mindbreaker TPB',
        publisher: 'IDW Publishing',
        format: 'paperback',
        isbn13: 9781684058884,
        contents: [{ series: 'mindbreaker', issues: '1-2' }],
        purchase_links: [{ store: 'amazon', url: 'https://www.amazon.es/dp/1684058880/' }],
      },
    ],
  }),
  comic('dragonlance-dc', {
    title: 'Dragonlance',
    publisher: 'DC Comics',
    setting: 'dragonlance',
    date: '1988-08',
    editions: [
      {
        language: 'castellano',
        spain: true,
        title: 'Dragonlance',
        publisher: 'Ediciones Zinco',
        format: 'issue',
        issues: [{ number: '1', date: '1990-07' }],
      },
    ],
  }),
]

function setup() {
  setCollections([])
  setComicIndex(buildComicIndex(comics, []))
  comics.forEach(cacheComic)
}

describe('ComicsPage', () => {
  it('muestra todas las series y filtra por editorial', () => {
    setup()
    render(
      <MemoryRouter initialEntries={['/comics']}>
        <ComicsPage />
      </MemoryRouter>
    )
    expect(screen.getByText('2 de 2 series')).toBeInTheDocument()
    fireEvent.click(screen.getAllByLabelText('DC')[0])
    expect(screen.getByText('1 de 2 series')).toBeInTheDocument()
    expect(screen.getByRole('heading', { level: 3, name: 'Dragonlance' })).toBeInTheDocument()
  })

  it('aplica los filtros de la dirección', async () => {
    setup()
    render(
      <MemoryRouter initialEntries={['/comics?mundo=dragonlance']}>
        <ComicsPage />
      </MemoryRouter>
    )
    await waitFor(() => expect(screen.getByText('1 de 2 series')).toBeInTheDocument())
  })

  it('busca por autor', () => {
    setup()
    render(
      <MemoryRouter initialEntries={['/comics']}>
        <ComicsPage />
      </MemoryRouter>
    )
    fireEvent.change(screen.getAllByLabelText('Buscar por título o autor')[0], {
      target: { value: 'zub' },
    })
    expect(screen.getByText('1 de 2 series')).toBeInTheDocument()
  })
})

describe('ComicDetailPage', () => {
  const renderDetail = (slug: string) =>
    render(
      <MemoryRouter initialEntries={[`/comic/${slug}`]}>
        <Routes>
          <Route path="/comic/:slug" element={<ComicDetailPage />} />
        </Routes>
      </MemoryRouter>
    )

  it('muestra los tomos con su compra y los números con el tomo que los recoge', async () => {
    setup()
    await loadNovelIndexForTests()
    renderDetail('mindbreaker')
    expect(
      screen.getByRole('heading', { level: 1, name: 'Dungeons & Dragons: Mindbreaker' })
    ).toBeInTheDocument()
    expect(screen.getByText('Mindbreaker TPB')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /Amazon/ })).toBeInTheDocument()
    expect(screen.getAllByText(/En Mindbreaker TPB/).length).toBe(2)
    expect(screen.getByText('No se ha publicado en castellano.')).toBeInTheDocument()
  })

  it('muestra aparte las grapas en castellano y avisa de que está descatalogada', async () => {
    setup()
    await loadNovelIndexForTests()
    renderDetail('dragonlance-dc')
    expect(screen.getByText(/Ediciones Zinco/)).toBeInTheDocument()
    expect(screen.getByText(/está descatalogada/)).toBeInTheDocument()
    expect(
      screen.getByText('Solo se publicó en castellano en grapa (ver más abajo).')
    ).toBeInTheDocument()
  })
})
