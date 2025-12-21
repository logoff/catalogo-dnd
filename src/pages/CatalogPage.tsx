import { useProductStore } from '@/store/productStore'
import MetaTags from '@/components/seo/MetaTags'
import Breadcrumbs from '@/components/common/Breadcrumbs'
import ProductGrid from '@/components/products/ProductGrid'
import FilterPanel from '@/components/filters/FilterPanel'
import ViewToggle from '@/components/products/ViewToggle'
import { useUrlFilters } from '@/hooks/useUrlFilters'

export default function CatalogPage() {
  useUrlFilters()

  const products = useProductStore((state) => state.products)
  const getFilteredProducts = useProductStore((state) => state.getFilteredProducts)
  const viewMode = useProductStore((state) => state.viewMode)
  const setViewMode = useProductStore((state) => state.setViewMode)

  const filteredProducts = getFilteredProducts()
  const totalProducts = products.length

  return (
    <>
      <MetaTags
        title="Catálogo"
        description="Explora todos los productos oficiales de Dungeons & Dragons"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Breadcrumbs items={[{ label: 'Catálogo' }]} />

        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-display text-3xl text-dnd-gold mb-2">Catálogo completo</h1>
            <p className="text-gray-400">
              {filteredProducts.length} de {totalProducts} productos
            </p>
          </div>
          <ViewToggle view={viewMode} onChange={setViewMode} />
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar with filters */}
          <aside className="lg:w-64 flex-shrink-0">
            <div className="lg:sticky lg:top-24">
              <FilterPanel />
            </div>
          </aside>

          {/* Product grid */}
          <main className="flex-1">
            <ProductGrid
              products={filteredProducts}
              view={viewMode}
              emptyMessage="No se encontraron productos con los filtros seleccionados"
            />
          </main>
        </div>
      </div>
    </>
  )
}
