import { describe, it, expect, beforeAll } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { loadNovelIndex } from '@/services/novelLoader'
import { loadRpgIndex } from '@/services/rpgLoader'
import WorldGuide from './WorldGuide'

const renderAt = (path: string) =>
  render(
    <MemoryRouter initialEntries={[path]}>
      <Routes>
        <Route path="/guias/ambientacion/:world" element={<WorldGuide />} />
      </Routes>
    </MemoryRouter>
  )

// Con los datos reales
describe('guía por ambientación', () => {
  beforeAll(async () => {
    await Promise.all([loadRpgIndex(), loadNovelIndex()])
  })

  it('reúne libros de todas las ediciones, novelas y videojuegos del mundo', () => {
    renderAt('/guias/ambientacion/forgotten-realms')
    expect(screen.getByRole('heading', { level: 1, name: /Reinos Olvidados/ })).toBeInTheDocument()
    for (const section of [
      'Libros de 5E y 5.5E',
      'Ediciones anteriores de D&D',
      'Novelas',
      'Videojuegos',
    ]) {
      expect(screen.getByRole('heading', { level: 2, name: section })).toBeInTheDocument()
    }
    expect(screen.getByRole('link', { name: "Sword Coast Adventurer's Guide" })).toHaveAttribute(
      'href',
      '/producto/2014/scag'
    )
    expect(screen.getByRole('heading', { level: 3, name: /AD&D 2\.ª edición/ })).toBeInTheDocument()
    expect(
      screen.getByRole('link', { name: 'Orden de lectura de la Leyenda de Drizzt' })
    ).toBeInTheDocument()
  })

  it('muestra la página de no encontrado si el mundo no existe', () => {
    renderAt('/guias/ambientacion/oerik')
    expect(screen.queryByRole('heading', { name: /guía de todo lo publicado/ })).toBeNull()
  })
})
