import type { ProductWithMeta } from '@/types'
import ProductCard from './ProductCard'

interface ProductGridProps {
  products: ProductWithMeta[]
  emptyMessage?: string
}

export default function ProductGrid({ products, emptyMessage = 'No se encontraron productos' }: ProductGridProps) {
  if (products.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-400 text-lg">{emptyMessage}</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
      {products.map((product) => (
        <ProductCard key={`${product.code}-${product.primaryEdition}`} product={product} />
      ))}
    </div>
  )
}
