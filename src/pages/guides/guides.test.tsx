import { describe, it, expect, beforeAll } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import type { ComponentType } from 'react'
import { getProductByCodeAndEdition } from '@/services/dataLoader'
import StartGuide from './StartGuide'
import EditionsGuide from './EditionsGuide'
import SpanishTimeline from './SpanishTimeline'
import EnglishTimeline from './EnglishTimeline'
import SpanishReleases from './SpanishReleases'
import EdgeWizardsGuide from './EdgeWizardsGuide'
import { getEdgeEditions } from '@/utils/releases'
import { loadNovelIndex } from '@/services/novelLoader'
import { READING_ORDERS, resolveReadingOrder, spanishNovelsBySetting } from '@/utils/readingOrders'
import type { NovelIndex, NovelSummary } from '@/types/novel'
import DrizztReadingOrder from './DrizztReadingOrder'
import DragonlanceReadingOrder from './DragonlanceReadingOrder'
import SpanishNovelsGuide from './SpanishNovelsGuide'

const guides: Array<[string, ComponentType]> = [
  ['Por dónde empezar', StartGuide],
  ['2014 frente a 2024', EditionsGuide],
  ['Cronología en castellano', SpanishTimeline],
  ['Cronología en inglés', EnglishTimeline],
  ['Cuándo sale en castellano', SpanishReleases],
  ['Edge o Wizards', EdgeWizardsGuide],
]

describe.each(guides)('%s', (_, Guide) => {
  it('solo enlaza a productos que existen', () => {
    const { container } = render(
      <MemoryRouter>
        <Guide />
      </MemoryRouter>
    )
    const productLinks = [...container.querySelectorAll('a[href^="/producto/"]')]
    expect(productLinks.length).toBeGreaterThan(0)

    for (const link of productLinks) {
      const [, , edition, code] = link.getAttribute('href')!.split('/')
      const product = getProductByCodeAndEdition(code, edition === '2014' ? '5e' : '2024')
      expect(product, link.getAttribute('href')!).toBeDefined()
    }
  })
})

describe('Cronología en castellano', () => {
  it('lista las publicaciones en castellano agrupadas por año', () => {
    render(
      <MemoryRouter>
        <SpanishTimeline />
      </MemoryRouter>
    )
    expect(screen.getByRole('heading', { name: '2017' })).toBeInTheDocument()
    expect(screen.getAllByText("Player's Handbook: Manual del Jugador").length).toBeGreaterThan(0)
    expect(screen.queryByText("Player's Handbook")).not.toBeInTheDocument()
  })
})

describe('Cronología en inglés', () => {
  it('lista las publicaciones en inglés, sin duplicados y con los anunciados aparte', () => {
    render(
      <MemoryRouter>
        <EnglishTimeline />
      </MemoryRouter>
    )
    expect(screen.getByRole('heading', { name: '2014' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Anunciados, sin fecha' })).toBeInTheDocument()
    expect(screen.queryByText('Manual del Jugador')).not.toBeInTheDocument()

    const monsterManual2025 = screen
      .getAllByRole('link', { name: 'Monster Manual' })
      .filter((link) => link.getAttribute('href') === '/producto/2024/mm')
    expect(monsterManual2025).toHaveLength(1)
  })
})

describe('Cuándo sale en castellano', () => {
  it('muestra cada novedad con su fecha en castellano o como pendiente', () => {
    render(
      <MemoryRouter>
        <SpanishReleases />
      </MemoryRouter>
    )
    const row = (name: string) => screen.getByRole('link', { name }).closest('tr')!
    expect(row("Player's Handbook")).toHaveTextContent('31 de marzo de 2025')
    expect(row("Player's Handbook")).toHaveTextContent('Manual del Jugador')
    expect(row('Stranger Things: Welcome to the Hellfire Club')).toHaveTextContent('Sin anunciar')
    expect(
      screen.queryByRole('link', { name: "2024 Dungeon Master's Screen" })
    ).not.toBeInTheDocument()
  })
})

describe('Edge o Wizards', () => {
  it('separa los títulos reeditados por Wizards de los que solo publicó Edge', () => {
    const editions = getEdgeEditions()
    const phb = editions.find((e) => e.product.code === 'PHB')
    expect(phb?.wizards).toBeDefined()
    expect(editions.find((e) => e.product.code === 'TOA')?.wizards).toBeUndefined()
  })

  // La guía explica cómo distinguir las ediciones por estos prefijos
  it('los códigos de cada editorial siguen los prefijos que cuenta la guía', () => {
    for (const { edge, wizards } of getEdgeEditions()) {
      expect(String(edge.isbn13), edge.title).toMatch(/^(97884|8435407)/)
      if (wizards) expect(String(wizards.isbn13), wizards.title).toMatch(/^97807869/)
    }
  })
})

describe('guías de novelas', () => {
  let index: NovelIndex
  beforeAll(async () => {
    index = await loadNovelIndex()
  })

  const renderGuide = (Guide: ComponentType) =>
    render(
      <MemoryRouter>
        <Guide />
      </MemoryRouter>
    )

  it('los órdenes de lectura solo nombran series y novelas que existen', () => {
    const missing = Object.entries(READING_ORDERS).flatMap(([id, blocks]) =>
      blocks.flatMap((block) => [
        ...(block.series && !index.series.some((s) => s.id === block.series)
          ? [`${id}: ${block.series}`]
          : []),
        ...(block.novels ?? [])
          .filter((slug) => !index.novels.some((n) => n.slug === slug))
          .map((slug) => `${id}: ${slug}`),
      ])
    )
    expect(missing).toEqual([])
    for (const blocks of Object.values(READING_ORDERS)) {
      for (const block of resolveReadingOrder(blocks, index)) {
        expect(block.novels.length, block.title).toBeGreaterThan(0)
      }
    }
  })

  it('la guía de Drizzt empieza por La morada y enlaza a las fichas', () => {
    const { container } = renderGuide(DrizztReadingOrder)
    const first = container.querySelector('article ol li')!
    expect(first).toHaveTextContent('Homeland')
    expect(first).toHaveTextContent('La morada')
    expect(screen.getByRole('link', { name: 'Homeland' })).toHaveAttribute(
      'href',
      '/novela/homeland'
    )
    expect(screen.getByRole('heading', { name: 'Elfo oscuro', level: 2 })).toBeInTheDocument()
  })

  it('la guía de la Dragonlance incluye la novela suelta de la guerra de Caos', () => {
    const { container } = renderGuide(DragonlanceReadingOrder)
    expect(screen.getByRole('link', { name: 'Dragons of Summer Flame' })).toBeInTheDocument()
    expect(container.querySelector('article ol li')).toHaveTextContent('Dragons of Autumn Twilight')
  })

  it('la guía en castellano solo lista novelas traducidas', () => {
    renderGuide(SpanishNovelsGuide)
    expect(screen.getByRole('heading', { name: 'Dragonlance', level: 2 })).toBeInTheDocument()
    const linked = screen
      .getAllByRole('link')
      .map((a) => a.getAttribute('href') ?? '')
      .filter((href) => href.startsWith('/novela/'))
      .map((href) => href.split('/')[2])
    const untranslated = index.novels.filter((n) => n.spanish === 'none').map((n) => n.slug)
    expect(linked.length).toBeGreaterThan(0)
    expect(linked.filter((slug) => untranslated.includes(slug))).toEqual([])
  })

  it('cuenta las novelas traducidas de cada serie y omite los mundos sin traducciones', () => {
    const novel = (slug: string, spanish: NovelSummary['spanish'], extra = {}) =>
      ({
        slug,
        title: slug,
        titleEs: null,
        authors: [],
        setting: 'dragonlance',
        kind: 'novel',
        year: 1990,
        thumbnail: null,
        spanish,
        availableToBuy: false,
        searchText: slug,
        ...extra,
      }) as NovelSummary
    const fake: NovelIndex = {
      series: [{ id: 'trilogia', title: 'Trilogy', title_es: 'Trilogía', setting: 'dragonlance' }],
      novels: [
        novel('a', 'spain', { series: { id: 'trilogia', number: 1 } }),
        novel('b', 'none', { series: { id: 'trilogia', number: 2 } }),
        novel('c', 'elsewhere', { series: { id: 'trilogia', number: 3 } }),
        novel('d', 'none', { setting: 'eberron' }),
      ],
    }
    const groups = spanishNovelsBySetting(fake, ['dragonlance', 'eberron'])
    expect(groups.map((g) => g.setting)).toEqual(['dragonlance'])
    expect(groups[0].series[0]).toMatchObject({ name: 'Trilogía', total: 3 })
    expect(groups[0].series[0].translated.map((n) => n.slug)).toEqual(['a', 'c'])
  })
})
