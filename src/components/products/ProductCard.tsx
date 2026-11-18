import { Link } from 'react-router-dom'
import type { ProductWithMeta } from '@/types'
import { PLACEHOLDER_IMAGE } from '@/utils/constants'
import { firstPublication } from '@/utils/releases'
import { translateType } from '@/utils/translations'
import { cardClass } from '@/components/ui/styles'
import { CardBody, CardCover } from '@/components/ui/Card'
import Badge from '@/components/ui/Badge'
import { EditionBadge } from '../common/Badge'
import LazyImage from '../common/LazyImage'
import SpanishAvailability from '../common/SpanishAvailability'

interface ProductCardProps {
  product: ProductWithMeta
}

export function productPath(product: ProductWithMeta) {
  const editionPath = product.primaryEdition === '5e' ? '2014' : '2024'
  return `/producto/${editionPath}/${product.code.toLowerCase()}`
}

export default function ProductCard({ product }: ProductCardProps) {
  const imageUrl = product.publications[0]?.images?.[0] ?? PLACEHOLDER_IMAGE
  const spanish = firstPublication(product, 'castellano')

  return (
    <Link to={productPath(product)} className={cardClass(true, 'h-full')}>
      <CardCover>
        <LazyImage
          src={imageUrl}
          alt={product.primaryTitle}
          containerClassName="h-full"
          className="h-full w-full object-cover"
        />
      </CardCover>
      <CardBody>
        <div className="flex flex-wrap items-center gap-1.5">
          <EditionBadge edition={product.primaryEdition} />
          <span className="font-mono text-xs text-muted">{product.code}</span>
          {product.primaryType !== 'book' && (
            <Badge variant="outline">{translateType(product.primaryType)}</Badge>
          )}
        </div>
        <h3 className="line-clamp-3 text-[15px] leading-snug font-semibold tracking-tight">
          {product.primaryTitle}
        </h3>
        <SpanishAvailability
          className="mt-auto pt-1"
          available={product.languages.includes('castellano')}
          date={spanish?.date}
        />
      </CardBody>
    </Link>
  )
}
