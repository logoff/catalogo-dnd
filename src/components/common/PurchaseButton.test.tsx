import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import PurchaseButton from './PurchaseButton'

describe('botón de compra', () => {
  it('marca como patrocinado el enlace de una tienda con afiliado', () => {
    render(<PurchaseButton store="nosolorol" url="https://www.nosolorol.com/x" tracking={{}} />)
    expect(screen.getByRole('link', { name: /Comprar en NoSoloRol/ })).toHaveAttribute(
      'rel',
      'sponsored noopener noreferrer'
    )
  })

  it('no marca como patrocinado el enlace de una tienda sin afiliado', () => {
    render(
      <PurchaseButton
        store="tesoros_de_la_marca"
        url="https://tesorosdelamarca.com/producto/x/"
        tracking={{}}
      />
    )
    const link = screen.getByRole('link', { name: /Comprar en Tesoros de la Marca/ })
    expect(link).toHaveAttribute('href', 'https://tesorosdelamarca.com/producto/x/')
    expect(link).toHaveAttribute('rel', 'noopener noreferrer')
  })
})
