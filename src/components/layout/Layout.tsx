import { useLocation, useOutlet } from 'react-router-dom'
import { useEffect, useLayoutEffect } from 'react'
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
  const outlet = useOutlet()

  // Antes que los useEffect de las páginas, para que los filtros de la URL (?view=) tengan prioridad
  useLayoutEffect(() => {
    useProductStore.persist.rehydrate()
  }, [])

  useEffect(() => {
    loadProducts()
  }, [loadProducts])

  return (
    <div className="min-h-screen flex flex-col bg-dnd-stone-dark">
      <Header />
      <main className="flex-1">
        {/* Sin animación en la primera carga: el HTML prerenderizado debe verse desde el inicio */}
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={location.pathname}
            initial="initial"
            animate="animate"
            exit="exit"
            variants={pageVariants}
            transition={{ duration: 0.2, ease: 'easeOut' }}
          >
            {/* El elemento de la ruta, no <Outlet />: así la página que sale conserva su
                contenido mientras se desvanece en vez de pintar ya la nueva */}
            {outlet}
          </motion.div>
        </AnimatePresence>
      </main>
      <Footer />
    </div>
  )
}
