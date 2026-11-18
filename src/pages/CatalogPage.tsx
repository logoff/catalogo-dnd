import { useProductStore } from '@/store/productStore'
import MetaTags from '@/components/seo/MetaTags'
import Breadcrumbs from '@/components/common/Breadcrumbs'
import ProductGrid from '@/components/products/ProductGrid'
import FilterPanel from '@/components/filters/FilterPanel'
import ViewToggle from '@/components/products/ViewToggle'
import PageHeader from '@/components/ui/PageHeader'
import { useUrlFilters } from '@/hooks/useUrlFilters'

export default function CatalogPage() {
  useUrlFilters()

  const products = useProductStore((state) => state.products)
  const isLoaded = useProductStore((state) => state.isLoaded)
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

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <Breadcrumbs items={[{ label: 'Catálogo' }]} />

        <PageHeader
          title="Catálogo completo"
          description="Libros, cajas y accesorios oficiales de 5E (2014) y 5.5E (2024), en inglés y en castellano."
          meta={`${filteredProducts.length} de ${totalProducts} productos`}
          actions={<ViewToggle view={viewMode} onChange={setViewMode} />}
        />

        <div className="flex flex-col gap-8 lg:flex-row">
          {/* Sidebar with filters */}
          <aside className="shrink-0 lg:w-64">
            <div className="lg:sticky lg:top-24">
              <FilterPanel />
            </div>
          </aside>

          {/* Product grid */}
          <div className="min-w-0 flex-1">
            <ProductGrid
              products={filteredProducts}
              view={viewMode}
              isLoading={!isLoaded}
              emptyMessage="No se encontraron productos con los filtros seleccionados"
            />
          </div>
        </div>
      </div>
    </>
  )
}
