import { Outlet } from 'react-router-dom'
import { useEffect } from 'react'
import Header from './Header'
import Footer from './Footer'
import { useProductStore } from '@/store/productStore'

export default function Layout() {
  const loadProducts = useProductStore((state) => state.loadProducts)

  useEffect(() => {
    loadProducts()
  }, [loadProducts])

  return (
    <div className="min-h-screen flex flex-col bg-dnd-stone-dark">
      <Header />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}
