import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen, fireEvent, within } from '@testing-library/react'
import { useProductStore } from '@/store/productStore'
import FilterPanel from './FilterPanel'

const initialState = useProductStore.getState()

// El panel pinta los filtros dos veces (escritorio y móvil desplegado);
// en jsdom no se aplica el CSS, así que se usa siempre la primera copia
const checkbox = (label: string) => screen.getAllByLabelText(label)[0] as HTMLInputElement
const header = () => screen.getByRole('heading', { name: 'Filtros' }).closest('button')!
const clearButton = () => screen.queryByRole('button', { name: 'Limpiar filtros' })

describe('FilterPanel', () => {
  beforeEach(() => {
    useProductStore.setState(initialState, true)
  })

  it('sin filtros activos no muestra contador ni botón Limpiar', () => {
    render(<FilterPanel />)
    expect(screen.getByRole('heading', { name: 'Filtros' })).toBeInTheDocument()
    expect(clearButton()).not.toBeInTheDocument()
  })

  it('marcar un filtro lo guarda en el store y muestra el contador', () => {
    render(<FilterPanel />)
    fireEvent.click(checkbox('Castellano'))

    expect(useProductStore.getState().languages).toEqual(['castellano'])
    expect(checkbox('Castellano')).toBeChecked()
    expect(within(header()).getByText('1')).toBeInTheDocument()
    expect(clearButton()).toBeInTheDocument()
  })

  it('desmarcar un filtro lo quita del store', () => {
    render(<FilterPanel />)
    fireEvent.click(checkbox('Castellano'))
    fireEvent.click(checkbox('Castellano'))
    expect(useProductStore.getState().languages).toEqual([])
    expect(clearButton()).not.toBeInTheDocument()
  })

  it('el contador suma los filtros de todas las secciones', () => {
    render(<FilterPanel />)
    fireEvent.click(checkbox('5E (2014)'))
    fireEvent.click(checkbox('Libro'))
    fireEvent.click(checkbox('Inglés'))
    expect(within(header()).getByText('3')).toBeInTheDocument()
  })

  describe('botón Limpiar', () => {
    it('quita todos los filtros', () => {
      render(<FilterPanel />)
      fireEvent.click(checkbox('5E (2014)'))
      fireEvent.click(checkbox('Castellano'))
      fireEvent.click(clearButton()!)

      const { editions, languages } = useProductStore.getState()
      expect(editions).toEqual([])
      expect(languages).toEqual([])
      expect(checkbox('Castellano')).not.toBeChecked()
      expect(clearButton()).not.toBeInTheDocument()
    })

    it('no pliega ni despliega el panel', () => {
      render(<FilterPanel />)
      fireEvent.click(checkbox('Castellano'))
      fireEvent.click(clearButton()!)
      expect(screen.getByRole('button', { expanded: false })).toBeInTheDocument()
    })

    it('no está dentro del botón de cabecera', () => {
      // Un <button> dentro de otro es HTML inválido
      render(<FilterPanel />)
      fireEvent.click(checkbox('Castellano'))
      expect(within(header()).queryByRole('button')).not.toBeInTheDocument()
    })
  })

  it('la cabecera despliega y pliega el panel en móvil', () => {
    render(<FilterPanel />)
    const toggle = screen.getByRole('button', { expanded: false })
    expect(screen.getAllByLabelText('Castellano')).toHaveLength(1)

    fireEvent.click(toggle)
    expect(toggle).toHaveAttribute('aria-expanded', 'true')
    expect(screen.getAllByLabelText('Castellano')).toHaveLength(2)

    fireEvent.click(toggle)
    expect(toggle).toHaveAttribute('aria-expanded', 'false')
  })

  it('oculta el filtro de edición si se pide', () => {
    render(<FilterPanel showEditionFilter={false} />)
    expect(screen.queryByLabelText('5E (2014)')).not.toBeInTheDocument()
    expect(checkbox('Libro')).toBeInTheDocument()
  })

  it('las categorías se limitan a los tipos seleccionados', () => {
    render(<FilterPanel />)
    expect(screen.queryAllByLabelText('Aventura')).not.toHaveLength(0)

    fireEvent.click(checkbox('Accesorio'))
    expect(screen.queryAllByLabelText('Aventura')).toHaveLength(0)
  })
})
