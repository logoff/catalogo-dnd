import { describe, it, expect } from 'vitest'
import { fireEvent, render, screen, waitFor, within } from '@testing-library/react'
import { MemoryRouter, Route, Routes, useLocation } from 'react-router-dom'
import SearchPage, { GROUP_PREVIEW } from './SearchPage'

function Location() {
  const { pathname, search } = useLocation()
  return <span data-testid="location">{pathname + search}</span>
}

const renderAt = (url: string) =>
  render(
    <MemoryRouter initialEntries={[url]}>
      <Routes>
        <Route path="/buscar" element={<SearchPage />} />
      </Routes>
      <Location />
    </MemoryRouter>
  )

const group = (name: RegExp) => screen.getByRole('region', { name })

describe('página de búsqueda', () => {
  it('encuentra merchandising desde el buscador global', async () => {
    renderAt('/buscar?q=fiends')
    const link = await screen.findByRole('link', { name: /Fiends & Foes/ })
    expect(link).toHaveAttribute('href', '/merchandising/fiends-and-foes')
    expect(within(group(/Merchandising/)).getByRole('link', { name: /Fiends & Foes/ })).toBe(link)
    expect(screen.getByLabelText('Texto que buscar')).toHaveValue('fiends')
  })

  it('muestra ocho resultados por grupo y el resto al pulsar', async () => {
    renderAt('/buscar?q=salvatore')
    await screen.findByRole('region', { name: /Novelas/ })
    // Espera a que estén cargados todos los índices
    await waitFor(() => expect(screen.queryByRole('status')).toBeNull())
    const novels = group(/Novelas/)
    expect(within(novels).getAllByRole('link')).toHaveLength(GROUP_PREVIEW)
    const more = within(novels).getByRole('button', { name: /Ver los \d+ restantes/ })
    const rest = Number(more.textContent!.match(/\d+/)![0])
    fireEvent.click(more)
    expect(within(novels).getAllByRole('link')).toHaveLength(GROUP_PREVIEW + rest)
  })

  it('dice cuándo no hay resultados y enlaza las secciones', async () => {
    renderAt('/buscar?q=zzzzqx')
    expect(await screen.findByText(/No hay resultados para/)).toHaveTextContent('«zzzzqx»')
    expect(screen.getByRole('link', { name: 'Novelas' })).toHaveAttribute('href', '/novelas')
  })

  it('sin texto no muestra resultados', () => {
    renderAt('/buscar')
    expect(screen.getByLabelText('Texto que buscar')).toHaveValue('')
    expect(screen.queryAllByRole('region')).toHaveLength(0)
  })

  it('cambia la URL al escribir en el campo', async () => {
    renderAt('/buscar?q=drizzt')
    const field = screen.getByLabelText('Texto que buscar')
    await waitFor(() => expect(field).toHaveValue('drizzt'))
    fireEvent.change(field, { target: { value: 'ravenloft' } })
    await waitFor(() =>
      expect(screen.getByTestId('location')).toHaveTextContent('/buscar?q=ravenloft')
    )
    expect(await screen.findByRole('region', { name: /Cómics/ })).toBeInTheDocument()
  })
})
