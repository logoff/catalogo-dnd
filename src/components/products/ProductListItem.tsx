import { Link } from 'react-router-dom'
import type { ProductWithMeta } from '@/types'
import { PLACEHOLDER_IMAGE } from '@/utils/constants'
import { formatDateRange } from '@/utils/formatters'
import { firstPublication } from '@/utils/releases'
import { translateType } from '@/utils/translations'
import Badge from '@/components/ui/Badge'
import { EditionBadge } from '../common/Badge'
import LazyImage from '../common/LazyImage'
import SpanishAvailability from '../common/SpanishAvailability'
import { productPath } from './ProductCard'

interface ProductListItemProps {
  product: ProductWithMeta
}

// Fila de la vista de lista: más datos y menos portada
export default function ProductListItem({ product }: ProductListItemProps) {
  const imageUrl = product.publications[0]?.images?.[0] ?? PLACEHOLDER_IMAGE
  const spanish = firstPublication(product, 'castellano')

  return (
    <Link
      to={productPath(product)}
      className="flex items-center gap-4 px-4 py-3 transition-colors duration-150 hover:bg-well"
    >
      <LazyImage
        src={imageUrl}
        alt=""
        containerClassName="h-16 w-12 shrink-0 rounded"
        className="h-full w-full object-cover"
      />
      <div className="flex min-w-0 flex-1 flex-col gap-1 sm:flex-row sm:items-center sm:gap-4">
        <div className="flex min-w-0 flex-1 flex-col gap-0.5">
          <h3 className="truncate text-[15px] font-semibold tracking-tight">
            {product.primaryTitle}
          </h3>
          <p className="flex flex-wrap items-center gap-x-2 text-sm text-muted">
            <span className="font-mono text-xs">{product.code}</span>
            {product.dateRange.earliest && (
              <span className="font-mono text-xs tabular-nums">
                {formatDateRange(product.dateRange)}
              </span>
            )}
            {product.publications.length > 1 && (
              <span>{product.publications.length} ediciones</span>
            )}
          </p>
        </div>
        <div className="flex shrink-0 flex-wrap items-center gap-2 sm:w-72 sm:justify-end">
          <EditionBadge edition={product.primaryEdition} />
          {product.primaryType !== 'book' && (
            <Badge variant="outline">{translateType(product.primaryType)}</Badge>
          )}
          <SpanishAvailability
            available={product.languages.includes('castellano')}
            date={spanish?.date}
          />
        </div>
      </div>
    </Link>
  )
}
