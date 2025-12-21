import { Link } from 'react-router-dom'
import type { ProductWithMeta } from '@/types'
import { LanguageBadge, TypeBadge, EditionBadge } from '../common/Badge'
import { PLACEHOLDER_IMAGE } from '@/utils/constants'
import { formatDateRange } from '@/utils/formatters'

interface ProductListItemProps {
  product: ProductWithMeta
}

export default function ProductListItem({ product }: ProductListItemProps) {
  const firstPub = product.publications[0]
  const imageUrl = firstPub?.images?.[0] ?? PLACEHOLDER_IMAGE
  const editionPath = product.primaryEdition === '5e' ? '2014' : '2024'

  return (
    <Link
      to={`/producto/${editionPath}/${product.code.toLowerCase()}`}
      className="card-dnd group flex gap-4 animate-fade-in"
    >
      {/* Image */}
      <div className="w-20 h-28 flex-shrink-0 overflow-hidden bg-dnd-stone-light rounded">
        <img
          src={imageUrl}
          alt={product.primaryTitle}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
        />
      </div>

      {/* Content */}
      <div className="flex-1 py-1 min-w-0">
        {/* Title */}
        <h3 className="font-display text-lg text-dnd-gold group-hover:text-dnd-gold-light transition-colors truncate">
          {product.primaryTitle}
        </h3>

        {/* Code and date */}
        <p className="text-sm text-gray-500 mt-0.5">
          {product.code}
          {product.dateRange.earliest && (
            <span className="ml-2">• {formatDateRange(product.dateRange)}</span>
          )}
        </p>

        {/* Badges */}
        <div className="flex flex-wrap gap-1.5 mt-2">
          <EditionBadge edition={product.primaryEdition} />
          <TypeBadge type={product.primaryType} />
          {product.languages.map((lang) => (
            <LanguageBadge key={lang} language={lang} />
          ))}
        </div>

        {/* Publications count */}
        {product.publications.length > 1 && (
          <p className="text-xs text-gray-400 mt-1">{product.publications.length} ediciones</p>
        )}
      </div>
    </Link>
  )
}
