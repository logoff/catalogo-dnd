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
      <div className="rounded-xl border border-dashed border-line py-12 text-center">
        <p className="text-muted">{emptyMessage}</p>
      </div>
    )
  }

  if (view === 'list') {
    return (
      <ul className="divide-y divide-line overflow-hidden rounded-xl border border-line bg-surface">
        {products.map((product) => (
          <li key={`${product.code}-${product.primaryEdition}`}>
            <ProductListItem product={product} />
          </li>
        ))}
      </ul>
    )
  }

  return (
    <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 md:grid-cols-4 xl:grid-cols-5">
      {products.map((product) => (
        <li key={`${product.code}-${product.primaryEdition}`}>
          <ProductCard product={product} />
        </li>
      ))}
    </ul>
  )
}
