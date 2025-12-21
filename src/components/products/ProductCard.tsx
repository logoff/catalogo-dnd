import { Link } from 'react-router-dom'
import type { ProductWithMeta } from '@/types'
import { LanguageBadge, TypeBadge, EditionBadge } from '../common/Badge'
import { PLACEHOLDER_IMAGE } from '@/utils/constants'

interface ProductCardProps {
  product: ProductWithMeta
}

export default function ProductCard({ product }: ProductCardProps) {
  const firstPub = product.publications[0]
  const imageUrl = firstPub?.images?.[0] ?? PLACEHOLDER_IMAGE

  return (
    <Link
      to={`/producto/${product.code.toLowerCase()}`}
      className="card-dnd group block animate-fade-in"
    >
      {/* Image */}
      <div className="aspect-[3/4] overflow-hidden bg-dnd-stone-light">
        <img
          src={imageUrl}
          alt={product.primaryTitle}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
        />
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Badges */}
        <div className="flex flex-wrap gap-1.5 mb-2">
          <EditionBadge edition={product.primaryEdition} />
          <TypeBadge type={product.primaryType} />
          {product.languages.map((lang) => (
            <LanguageBadge key={lang} language={lang} />
          ))}
        </div>

        {/* Title */}
        <h3 className="font-display text-lg text-dnd-gold group-hover:text-dnd-gold-light transition-colors line-clamp-3">
          {product.primaryTitle}
        </h3>

        {/* Code */}
        <p className="text-sm text-gray-500 mt-1">{product.code}</p>

        {/* Publications count */}
        {product.publications.length > 1 && (
          <p className="text-xs text-gray-400 mt-2">{product.publications.length} ediciones</p>
        )}
      </div>
    </Link>
  )
}
