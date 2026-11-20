import { describe, it, expect, vi } from 'vitest'
import { useState } from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import SegmentedControl from './SegmentedControl'
import SectionNav from './SectionNav'
import { headingClass } from './styles'

function Edition({ onChange }: { onChange?: (value: string) => void }) {
  const [value, setValue] = useState('all')
  return (
    <SegmentedControl
      label="Edición"
      value={value}
      onChange={(next) => {
        setValue(next)
        onChange?.(next)
      }}
      options={[
        { value: 'all', label: 'Todas' },
        { value: '5e', label: '5E (2014)' },
        { value: '2024', label: '5.5E (2024)' },
      ]}
    />
  )
}

describe('SegmentedControl', () => {
  it('es un grupo de opciones con la elegida marcada', () => {
    render(<Edition />)
    expect(screen.getByRole('radiogroup', { name: 'Edición' })).toBeInTheDocument()
    expect(screen.getByRole('radio', { name: 'Todas' })).toHaveAttribute('aria-checked', 'true')
    expect(screen.getByRole('radio', { name: '5E (2014)' })).toHaveAttribute(
      'aria-checked',
      'false'
    )
  })

  it('cambia con un clic', () => {
    const onChange = vi.fn()
    render(<Edition onChange={onChange} />)
    fireEvent.click(screen.getByRole('radio', { name: '5.5E (2024)' }))
    expect(onChange).toHaveBeenCalledWith('2024')
    expect(screen.getByRole('radio', { name: '5.5E (2024)' })).toHaveAttribute(
      'aria-checked',
      'true'
    )
  })

  it('se recorre con las flechas y da la vuelta', () => {
    render(<Edition />)
    const first = screen.getByRole('radio', { name: 'Todas' })
    fireEvent.keyDown(first, { key: 'ArrowLeft' })
    expect(screen.getByRole('radio', { name: '5.5E (2024)' })).toHaveAttribute(
      'aria-checked',
      'true'
    )
    expect(screen.getByRole('radio', { name: '5.5E (2024)' })).toHaveFocus()
  })

  it('solo la opción elegida entra en el orden del tabulador', () => {
    render(<Edition />)
    expect(screen.getByRole('radio', { name: 'Todas' })).toHaveAttribute('tabindex', '0')
    expect(screen.getByRole('radio', { name: '5E (2014)' })).toHaveAttribute('tabindex', '-1')
  })
})

describe('SectionNav', () => {
  it('enlaza a cada sección de la página', () => {
    render(
      <SectionNav
        sections={[
          { id: 'ediciones', label: 'Ediciones' },
          { id: 'resenas', label: 'Reseñas' },
        ]}
      />
    )
    expect(screen.getByRole('navigation', { name: 'Secciones de la ficha' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Reseñas' })).toHaveAttribute('href', '#resenas')
  })

  it('no se muestra con una sola sección', () => {
    render(<SectionNav sections={[{ id: 'ediciones', label: 'Ediciones' }]} />)
    expect(screen.queryByRole('navigation')).not.toBeInTheDocument()
  })
})

describe('headingClass', () => {
  it('cada nivel de título se distingue por algo más que el tamaño', () => {
    expect(headingClass('section')).toContain('text-2xl')
    // El grupo de una lista va en versalitas grises para no confundirse con sus elementos
    expect(headingClass('group')).toContain('uppercase')
    expect(headingClass('group')).toContain('text-muted')
    expect(headingClass('item')).not.toContain('text-muted')
    expect(headingClass('group', 'mb-2')).toContain('mb-2')
  })
})
