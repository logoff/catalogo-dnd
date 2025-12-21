import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import type { ProductWithMeta } from '@/types'
import { LanguageBadge, TypeBadge, EditionBadge } from '../common/Badge'
import { PLACEHOLDER_IMAGE } from '@/utils/constants'
import LazyImage from '../common/LazyImage'

interface ProductCardProps {
  product: ProductWithMeta
}

export default function ProductCard({ product }: ProductCardProps) {
  const firstPub = product.publications[0]
  const imageUrl = firstPub?.images?.[0] ?? PLACEHOLDER_IMAGE
  const editionPath = product.primaryEdition === '5e' ? '2014' : '2024'

  return (
    <motion.div
      whileHover={{ y: -4 }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.2 }}
      className="h-full"
    >
      <Link
        to={`/producto/${editionPath}/${product.code.toLowerCase()}`}
        className="card-dnd group flex flex-col h-full"
      >
        {/* Image */}
        <LazyImage
          src={imageUrl}
          alt={product.primaryTitle}
          containerClassName="aspect-[3/4] bg-dnd-stone-light"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />

        {/* Content */}
        <div className="p-4 flex flex-col flex-1">
          {/* Badges */}
          <div className="flex flex-wrap gap-1.5 mb-2">
            <EditionBadge edition={product.primaryEdition} />
            <TypeBadge type={product.primaryType} />
            {product.languages.map((lang) => (
              <LanguageBadge key={lang} language={lang} />
            ))}
          </div>

          {/* Title - min 3 lines height */}
          <h3 className="font-display text-lg text-dnd-gold group-hover:text-dnd-gold-light transition-colors line-clamp-3 min-h-[4.5rem]">
            {product.primaryTitle}
          </h3>

          {/* Code and editions - pushed to bottom */}
          <div className="mt-auto pt-2">
            <p className="text-sm text-gray-500">{product.code}</p>
            {product.publications.length > 1 ? (
              <p className="text-xs text-gray-400 mt-1">{product.publications.length} ediciones</p>
            ) : (
              <p className="text-xs text-gray-400 mt-1 invisible">1 edición</p>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  )
}
