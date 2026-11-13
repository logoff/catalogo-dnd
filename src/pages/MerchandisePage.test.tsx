import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen, fireEvent, within } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import type { Merchandise } from '@/types/merchandise'
import { enrichMerchandise } from '@/services/merchandiseLoader'
import { useMerchandiseStore } from '@/store/merchandiseStore'
import MerchandisePage from './MerchandisePage'

const initialState = useMerchandiseStore.getState()

const item = (title: string, extra: Partial<Merchandise>) =>
  enrichMerchandise({
    slug: title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
    title,
    group: 'books',
    kind: 'cookbook',
    manufacturer: 'Ten Speed Press',
    description: 'a\n\nb',
    source: 'https://example.com/',
    editions: [{ language: 'english' }],
    images: ['/images/merchandising/x/0.jpg'],
    ...extra,
  })

const items = [
  item('Heroes Feast', {
    title_es: 'Festín de héroes',
    date: '2020-10-27',
    editions: [{ language: 'english' }, { language: 'castellano', spain: true }],
  }),
  item('Legend of Drizzt', {
    kind: 'guide_book',
    date: '2023',
    editions: [{ language: 'castellano', spain: false }],
  }),
  item('LEGO 21348', {
    group: 'figures',
    kind: 'lego',
    manufacturer: 'LEGO',
    date: '2024-04-01',
    editions: [{}],
  }),
  item('Dungeon Mayhem', { group: 'games', kind: 'card_game' }),
]

// El panel pinta los filtros dos veces (escritorio y móvil); se usa la primera copia
const checkbox = (label: string) => screen.getAllByLabelText(label)[0] as HTMLInputElement
const cards = () =>
  screen
    .getAllByRole('link')
    .filter((link) => link.getAttribute('href')?.startsWith('/merchandising/'))
const titles = () => cards().map((card) => within(card).getByRole('heading').textContent)

const renderPage = () =>
  render(
    <MemoryRouter>
      <MerchandisePage />
    </MemoryRouter>
  )

describe('MerchandisePage', () => {
  beforeEach(() => useMerchandiseStore.setState({ ...initialState, items }, true))

  it('lista los artículos del más reciente al más antiguo, con los que no tienen fecha al final', () => {
    renderPage()
    expect(titles()).toEqual(['LEGO 21348', 'Legend of Drizzt', 'Heroes Feast', 'Dungeon Mayhem'])
    expect(screen.getByText('4 de 4 artículos')).toBeInTheDocument()
  })

  it('cada tarjeta enlaza a su ficha y distingue el castellano de España del de fuera', () => {
    renderPage()
    const card = (title: string) => cards().find((c) => c.textContent?.includes(title))!
    expect(card('Heroes Feast')).toHaveAttribute('href', '/merchandising/heroes-feast')
    expect(within(card('Heroes Feast')).getByText('En castellano')).toBeInTheDocument()
    expect(
      within(card('Legend of Drizzt')).getByText('En español, no en España')
    ).toBeInTheDocument()
    expect(within(card('Dungeon Mayhem')).getByText('Solo en inglés')).toBeInTheDocument()
    // Sin texto, sin marca de idioma
    expect(within(card('LEGO 21348')).queryByText(/castellano|español|inglés/)).toBeNull()
  })

  it('combina filtros de grupo y tipo, y el de castellano publicado en España', () => {
    renderPage()
    fireEvent.click(checkbox('Libros licenciados'))
    expect(titles()).toEqual(['Legend of Drizzt', 'Heroes Feast'])
    fireEvent.click(checkbox('Guía ilustrada'))
    expect(titles()).toEqual(['Legend of Drizzt'])
    fireEvent.click(checkbox('Guía ilustrada'))
    fireEvent.click(checkbox('En castellano, publicado en España'))
    expect(titles()).toEqual(['Heroes Feast'])
  })

  it('busca sin tildes', () => {
    renderPage()
    fireEvent.change(screen.getAllByLabelText('Buscar por título o marca')[0], {
      target: { value: 'festin' },
    })
    expect(titles()).toEqual(['Heroes Feast'])
  })

  it('ordena por título', () => {
    renderPage()
    fireEvent.change(screen.getAllByLabelText('Ordenar por')[0], {
      target: { value: 'title-asc' },
    })
    expect(titles()).toEqual(['Dungeon Mayhem', 'Heroes Feast', 'Legend of Drizzt', 'LEGO 21348'])
  })

  it('sin resultados lo dice y permite quitar los filtros', () => {
    renderPage()
    fireEvent.change(screen.getAllByLabelText('Buscar por título o marca')[0], {
      target: { value: 'nada que coincida' },
    })
    expect(screen.getByText('Ningún artículo cumple los filtros seleccionados')).toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: 'Quitar filtros' }))
    expect(titles()).toHaveLength(4)
  })
})
