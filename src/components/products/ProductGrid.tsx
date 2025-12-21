import type { ProductWithMeta } from '@/types'
import ProductCard from './ProductCard'
import ProductListItem from './ProductListItem'
import { ProductGridSkeleton } from '../common/Skeleton'
import type { ViewMode } from './ViewToggle'

interface ProductGridProps {
  products: ProductWithMeta[]
  emptyMessage?: string
  view?: ViewMode
  isLoading?: boolean
}

export default function ProductGrid({
  products,
  emptyMessage = 'No se encontraron productos',
  view = 'grid',
  isLoading = false,
}: ProductGridProps) {
  if (isLoading) {
    return <ProductGridSkeleton view={view} />
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-400 text-lg">{emptyMessage}</p>
      </div>
    )
  }

  if (view === 'list') {
    return (
      <div className="flex flex-col gap-3">
        {products.map((product) => (
          <ProductListItem key={`${product.code}-${product.primaryEdition}`} product={product} />
        ))}
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
