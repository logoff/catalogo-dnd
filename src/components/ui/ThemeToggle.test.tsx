import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import ThemeToggle from './ThemeToggle'

describe('ThemeToggle', () => {
  beforeEach(() => {
    localStorage.clear()
    document.documentElement.setAttribute('data-theme', 'dark')
  })

  afterEach(() => {
    vi.restoreAllMocks()
    document.documentElement.removeAttribute('data-theme')
  })

  it('ofrece el tema contrario al activo', () => {
    render(<ThemeToggle />)
    expect(screen.getByRole('button', { name: 'Cambiar a tema claro' })).toBeInTheDocument()
  })

  it('cambia de tema y guarda la elección', async () => {
    render(<ThemeToggle />)
    fireEvent.click(screen.getByRole('button'))

    expect(document.documentElement.getAttribute('data-theme')).toBe('light')
    expect(localStorage.getItem('theme')).toBe('light')
    // El botón se entera del cambio por un MutationObserver, que es asíncrono
    expect(await screen.findByRole('button', { name: 'Cambiar a tema oscuro' })).toBeInTheDocument()
  })

  it('funciona aunque no se pueda guardar', () => {
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('bloqueado')
    })
    render(<ThemeToggle />)
    fireEvent.click(screen.getByRole('button'))

    expect(document.documentElement.getAttribute('data-theme')).toBe('light')
  })
})
