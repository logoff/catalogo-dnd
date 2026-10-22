import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import type { ProductWithMeta, Publication } from '@/types'
import ProductDetail from './ProductDetail'

const publication: Publication = {
  type: 'book',
  subtype: 'core_rules',
  edition: '5e',
  title: "Player's Handbook",
  official_url: 'https://dnd.wizards.com/products/rpg_playershandbook',
}

const product = (pub: Publication): ProductWithMeta => ({
  code: 'PHB',
  publications: [pub],
  primaryTitle: pub.title,
  primaryEdition: '5e',
  primaryType: 'book',
  primarySubtype: 'core_rules',
  languages: [],
  dateRange: { earliest: null, latest: null },
  slug: 'phb',
})

describe('ProductDetail', () => {
  it('sin enlaces de compra no muestra la sección Dónde comprar', () => {
    render(<ProductDetail product={product(publication)} />)
    expect(screen.queryByText('Dónde comprar')).not.toBeInTheDocument()
    expect(screen.getByText('Enlaces externos')).toBeInTheDocument()
  })

  it('muestra un botón por tienda marcado como enlace patrocinado', () => {
    render(
      <ProductDetail
        product={product({
          ...publication,
          purchase_links: [
            { store: 'amazon', url: 'https://www.amazon.es/dp/0786965606' },
            { store: 'generacion_x', url: 'https://www.generacionx.es/phb' },
          ],
        })}
      />
    )

    expect(screen.getByText('Dónde comprar')).toBeInTheDocument()
    const amazon = screen.getByRole('link', { name: 'Comprar en Amazon' })
    expect(amazon).toHaveAttribute('href', 'https://www.amazon.es/dp/0786965606')
    expect(amazon).toHaveAttribute('rel', 'sponsored noopener noreferrer')
    expect(screen.getByRole('link', { name: /Comprar en Generación X/ })).toHaveAttribute(
      'href',
      'https://www.generacionx.es/phb'
    )
  })
})
