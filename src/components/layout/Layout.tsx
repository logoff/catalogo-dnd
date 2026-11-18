import { Outlet } from 'react-router-dom'
import { useEffect, useLayoutEffect } from 'react'
import Header from './Header'
import Footer from './Footer'
import { useProductStore } from '@/store/productStore'

export default function Layout() {
  const loadProducts = useProductStore((state) => state.loadProducts)

  // Antes que los useEffect de las páginas, para que los filtros de la URL (?view=) tengan prioridad
  useLayoutEffect(() => {
    useProductStore.persist.rehydrate()
  }, [])

  useEffect(() => {
    loadProducts()
  }, [loadProducts])

  return (
    <div className="flex min-h-screen flex-col bg-bg">
      <Header />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}
