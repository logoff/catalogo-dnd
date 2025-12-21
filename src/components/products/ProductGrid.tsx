import { motion } from 'framer-motion'
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

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.03,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: 'spring' as const,
      stiffness: 300,
      damping: 24,
    },
  },
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
      <motion.div
        className="text-center py-12"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <p className="text-gray-400 text-lg">{emptyMessage}</p>
      </motion.div>
    )
  }

  if (view === 'list') {
    return (
      <motion.div
        className="flex flex-col gap-3"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        key={`list-${products.length}`}
      >
        {products.map((product) => (
          <motion.div key={`${product.code}-${product.primaryEdition}`} variants={itemVariants}>
            <ProductListItem product={product} />
          </motion.div>
        ))}
      </motion.div>
    )
  }

  return (
    <motion.div
      className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      key={`grid-${products.length}`}
    >
      {products.map((product) => (
        <motion.div key={`${product.code}-${product.primaryEdition}`} variants={itemVariants}>
          <ProductCard product={product} />
        </motion.div>
      ))}
    </motion.div>
  )
}
