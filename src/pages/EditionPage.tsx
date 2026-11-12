import { useMemo } from 'react'
import { useProductStore } from '@/store/productStore'
import MetaTags from '@/components/seo/MetaTags'
import Breadcrumbs from '@/components/common/Breadcrumbs'
import ProductGrid from '@/components/products/ProductGrid'
import FilterPanel from '@/components/filters/FilterPanel'
import ViewToggle from '@/components/products/ViewToggle'
import { translateEditionLong } from '@/utils/translations'
import { useUrlFilters } from '@/hooks/useUrlFilters'
import { filterProducts } from '@/utils/productFilters'
import type { Edition } from '@/types'

interface EditionPageProps {
  readonly edition: Edition
}

export default function EditionPage({ edition }: EditionPageProps) {
  useUrlFilters()
  const products = useProductStore((state) => state.products)
  const isLoaded = useProductStore((state) => state.isLoaded)
  const searchQuery = useProductStore((state) => state.searchQuery)
  const types = useProductStore((state) => state.types)
  const subtypes = useProductStore((state) => state.subtypes)
  const languages = useProductStore((state) => state.languages)
  const sortOption = useProductStore((state) => state.sortOption)
  const viewMode = useProductStore((state) => state.viewMode)
  const setViewMode = useProductStore((state) => state.setViewMode)

  const editionProducts = useMemo(
    () => products.filter((p) => p.primaryEdition === edition),
    [products, edition]
  )

  // Filter products by this edition and apply other filters
  const filteredProducts = useMemo(() => {
    const result = filterProducts(editionProducts, {
      searchQuery,
      editions: [],
      types,
      subtypes,
      languages,
    })

    // Sort
    const { field, direction } = sortOption
    result.sort((a, b) => {
      let comparison = 0

      switch (field) {
        case 'title':
          comparison = a.primaryTitle.localeCompare(b.primaryTitle)
          break
        case 'date': {
          const dateA = a.dateRange.earliest || '9999'
          const dateB = b.dateRange.earliest || '9999'
          comparison = dateA.localeCompare(dateB)
          break
        }
        case 'code':
          comparison = a.code.localeCompare(b.code)
          break
      }

      return direction === 'asc' ? comparison : -comparison
    })

    return result
  }, [editionProducts, searchQuery, types, subtypes, languages, sortOption])

  const editionTitle = translateEditionLong(edition)
  const editionDescription =
    edition === '5e'
      ? 'Todos los productos de la 5ª edición original de Dungeons & Dragons'
      : 'Los nuevos productos de la edición 5.5 (2024) de Dungeons & Dragons'

  return (
    <>
      <MetaTags title={editionTitle} description={editionDescription} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Breadcrumbs items={[{ label: editionTitle }]} />

        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-display text-3xl text-dnd-gold mb-2">{editionTitle}</h1>
            <p className="text-gray-400">
              {filteredProducts.length} de {editionProducts.length} productos
            </p>
          </div>
          <ViewToggle view={viewMode} onChange={setViewMode} />
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar with filters */}
          <aside className="lg:w-64 shrink-0">
            <div className="lg:sticky lg:top-24">
              <FilterPanel edition={edition} />
            </div>
          </aside>

          {/* Product grid */}
          <main className="flex-1">
            <ProductGrid
              products={filteredProducts}
              view={viewMode}
              isLoading={!isLoaded}
              emptyMessage="No se encontraron productos con los filtros seleccionados"
            />
          </main>
        </div>
      </div>
    </>
  )
}
