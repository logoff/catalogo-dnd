import { Outlet, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import Header from './Header'
import Footer from './Footer'
import { useProductStore } from '@/store/productStore'

const pageVariants = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -12 },
}

export default function Layout() {
  const loadProducts = useProductStore((state) => state.loadProducts)
  const location = useLocation()

  useEffect(() => {
    loadProducts()
  }, [loadProducts])

  return (
    <div className="min-h-screen flex flex-col bg-dnd-stone-dark">
      <Header />
      <main className="flex-1">
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial="initial"
            animate="animate"
            exit="exit"
            variants={pageVariants}
            transition={{ duration: 0.2, ease: 'easeOut' }}
          >
            <Outlet />
          </motion.div>
        </AnimatePresence>
      </main>
      <Footer />
    </div>
  )
}
