import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import LegalPage from './LegalPage'

describe('LegalPage', () => {
  it('avisa de que reproducir un vídeo conecta con YouTube', () => {
    render(
      <MemoryRouter>
        <LegalPage />
      </MemoryRouter>
    )
    expect(screen.getByText(/Al pulsar reproducir/)).toHaveTextContent(
      'tu navegador se conecta con YouTube'
    )
  })
})
