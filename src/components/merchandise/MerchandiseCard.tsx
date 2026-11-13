import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import type { MerchandiseWithMeta } from '@/types/merchandise'
import { kindNames } from '@/utils/merchandiseTranslations'
import LazyImage from '../common/LazyImage'
import MerchandiseSpanishBadge from './MerchandiseSpanishBadge'

interface MerchandiseCardProps {
  item: MerchandiseWithMeta
  view?: 'grid' | 'list'
}

export default function MerchandiseCard({ item, view = 'grid' }: MerchandiseCardProps) {
  const details = [kindNames[item.kind], item.year].filter(Boolean).join(' · ')

  if (view === 'list') {
    return (
      <Link to={`/merchandising/${item.slug}`} className="card-dnd group flex gap-4 p-3">
        <LazyImage
          src={item.images[0]}
          alt={item.title}
          containerClassName="w-16 aspect-square shrink-0 bg-white rounded"
          className="w-full h-full object-contain rounded"
        />
        <div className="flex-1 min-w-0">
          <h3 className="font-display text-lg text-dnd-gold group-hover:text-dnd-gold-light truncate">
            {item.title}
          </h3>
          <p className="text-sm text-gray-400">{details}</p>
          <div className="mt-1">
            <MerchandiseSpanishBadge item={item} />
          </div>
        </div>
      </Link>
    )
  }

  return (
    <motion.div whileHover={{ y: -4 }} whileTap={{ scale: 0.98 }} className="h-full">
      <Link to={`/merchandising/${item.slug}`} className="card-dnd group flex flex-col h-full">
        <LazyImage
          src={item.images[0]}
          alt={item.title}
          containerClassName="aspect-square bg-white"
          className="w-full h-full object-contain p-2 group-hover:scale-105 transition-transform duration-300"
        />
        <div className="p-4 flex flex-col flex-1">
          <div className="flex flex-wrap gap-1.5 mb-2">
            <MerchandiseSpanishBadge item={item} />
          </div>
          <h3 className="font-display text-lg text-dnd-gold group-hover:text-dnd-gold-light transition-colors line-clamp-3">
            {item.title}
          </h3>
          <p className="mt-auto pt-2 text-sm text-gray-400">{details}</p>
        </div>
      </Link>
    </motion.div>
  )
}
