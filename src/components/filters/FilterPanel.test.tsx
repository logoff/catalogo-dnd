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
const edition = (label: string) => screen.getAllByRole('radio', { name: label })[0]
const categoriesToggle = () => screen.getAllByRole('button', { name: /^Categoría/ })[0]
const openCategories = () => fireEvent.click(categoriesToggle())

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

  it('la edición se elige con un control segmentado', () => {
    render(<FilterPanel />)
    fireEvent.click(edition('5.5E (2024)'))
    expect(useProductStore.getState().editions).toEqual(['2024'])

    fireEvent.click(edition('5E (2014)'))
    expect(useProductStore.getState().editions).toEqual(['5e'])

    fireEvent.click(edition('Todas'))
    expect(useProductStore.getState().editions).toEqual([])
  })

  it('el contador suma los filtros de todas las secciones', () => {
    render(<FilterPanel />)
    fireEvent.click(edition('5E (2014)'))
    fireEvent.click(checkbox('Libro'))
    fireEvent.click(checkbox('Inglés'))
    expect(within(header()).getByText('3')).toBeInTheDocument()
  })

  describe('botón Limpiar', () => {
    it('quita todos los filtros', () => {
      render(<FilterPanel />)
      fireEvent.click(edition('5E (2014)'))
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
      expect(header()).toHaveAttribute('aria-expanded', 'false')
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
    const toggle = header()
    expect(screen.getAllByLabelText('Castellano')).toHaveLength(1)

    fireEvent.click(toggle)
    expect(toggle).toHaveAttribute('aria-expanded', 'true')
    expect(screen.getAllByLabelText('Castellano')).toHaveLength(2)

    fireEvent.click(toggle)
    expect(toggle).toHaveAttribute('aria-expanded', 'false')
  })

  it('en una página de edición oculta el filtro de edición', () => {
    render(<FilterPanel edition="2024" />)
    expect(screen.queryByRole('radiogroup', { name: 'Edición' })).not.toBeInTheDocument()
    expect(checkbox('Libro')).toBeInTheDocument()
  })

  describe('sección de categorías', () => {
    it('sale plegada y se despliega con su título', () => {
      render(<FilterPanel />)
      expect(categoriesToggle()).toHaveAttribute('aria-expanded', 'false')
      expect(screen.queryByLabelText('Aventura')).not.toBeInTheDocument()

      openCategories()
      expect(categoriesToggle()).toHaveAttribute('aria-expanded', 'true')
      expect(checkbox('Aventura')).toBeInTheDocument()

      openCategories()
      expect(screen.queryByLabelText('Aventura')).not.toBeInTheDocument()
    })

    it('plegada indica cuántas categorías hay marcadas', () => {
      useProductStore.setState({ subtypes: ['adventure', 'setting'] })
      render(<FilterPanel />)
      expect(within(categoriesToggle()).getByText('2')).toBeInTheDocument()
    })

    it('se limita a los tipos seleccionados', () => {
      render(<FilterPanel />)
      openCategories()
      expect(screen.queryAllByLabelText('Aventura')).not.toHaveLength(0)

      fireEvent.click(checkbox('Accesorio'))
      expect(screen.queryAllByLabelText('Aventura')).toHaveLength(0)
    })
  })

  describe('opciones sin resultados', () => {
    it('no muestra categorías que no tiene ningún producto', () => {
      render(<FilterPanel />)
      openCategories()
      expect(screen.queryByLabelText('Set de regalo')).not.toBeInTheDocument()
    })

    it('al marcar 5.5E (2024) desaparecen las categorías solo de 2014', () => {
      render(<FilterPanel />)
      openCategories()
      expect(checkbox('Escenario de campaña')).toBeInTheDocument()

      fireEvent.click(edition('5.5E (2024)'))
      expect(screen.queryByLabelText('Escenario de campaña')).not.toBeInTheDocument()
      expect(checkbox('Pantalla del DM')).toBeInTheDocument()
    })

    it('en la página de 2024 solo hay categorías de 2024', () => {
      render(<FilterPanel edition="2024" />)
      openCategories()
      expect(screen.queryByLabelText('Aventura')).not.toBeInTheDocument()
      expect(checkbox('Antología de aventuras')).toBeInTheDocument()
    })

    it('oculta una edición sin resultados para la categoría marcada', () => {
      render(<FilterPanel />)
      openCategories()
      fireEvent.click(checkbox('Escenario de campaña'))
      expect(screen.queryByRole('radio', { name: '5.5E (2024)' })).not.toBeInTheDocument()
    })

    it('mantiene visibles las opciones marcadas aunque se queden sin resultados', () => {
      // Combinación imposible, como la que puede llegar en la URL
      useProductStore.setState({ editions: ['2024'], subtypes: ['setting'] })
      render(<FilterPanel />)
      openCategories()

      expect(edition('5.5E (2024)')).toHaveAttribute('aria-checked', 'true')
      expect(checkbox('Escenario de campaña')).toBeChecked()
    })
  })
})
