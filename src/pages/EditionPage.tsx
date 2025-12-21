import { useMemo } from 'react'
import { useProductStore } from '@/store/productStore'
import MetaTags from '@/components/seo/MetaTags'
import Breadcrumbs from '@/components/common/Breadcrumbs'
import ProductGrid from '@/components/products/ProductGrid'
import FilterPanel from '@/components/filters/FilterPanel'
import { translateEditionLong } from '@/utils/translations'
import type { Edition } from '@/types'

interface EditionPageProps {
  readonly edition: Edition
}

export default function EditionPage({ edition }: EditionPageProps) {
  const products = useProductStore((state) => state.products)
  const searchQuery = useProductStore((state) => state.searchQuery)
  const types = useProductStore((state) => state.types)
  const subtypes = useProductStore((state) => state.subtypes)
  const languages = useProductStore((state) => state.languages)
  const sortOption = useProductStore((state) => state.sortOption)

  // Filter products by this edition and apply other filters
  const filteredProducts = useMemo(() => {
    let result = products.filter(p => p.primaryEdition === edition)

    // Full-text search
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      result = result.filter(product => {
        const searchableText = [
          product.code,
          product.primaryTitle,
          ...product.publications.flatMap(p => [
            p.title,
            ...(p.authors || []),
            p.isbn13?.toString(),
            p.publisher,
          ]),
        ].filter(Boolean).join(' ').toLowerCase()

        return searchableText.includes(query)
      })
    }

    // Filter by type
    if (types.length > 0) {
      result = result.filter(p =>
        p.publications.some(pub => types.includes(pub.type))
      )
    }

    // Filter by subtype
    if (subtypes.length > 0) {
      result = result.filter(p =>
        p.publications.some(pub => subtypes.includes(pub.subtype))
      )
    }

    // Filter by language
    if (languages.length > 0) {
      result = result.filter(p =>
        p.languages.some(lang => languages.includes(lang))
      )
    }

    // Sort
    const { field, direction } = sortOption
    result.sort((a, b) => {
      let comparison = 0

      switch (field) {
        case 'title':
          comparison = a.primaryTitle.localeCompare(b.primaryTitle)
          break
        case 'date':
          const dateA = a.dateRange.earliest || '9999'
          const dateB = b.dateRange.earliest || '9999'
          comparison = dateA.localeCompare(dateB)
          break
        case 'code':
          comparison = a.code.localeCompare(b.code)
          break
      }

      return direction === 'asc' ? comparison : -comparison
    })

    return result
  }, [products, edition, searchQuery, types, subtypes, languages, sortOption])

  const editionProducts = products.filter(p => p.primaryEdition === edition)

  const editionTitle = translateEditionLong(edition)
  const editionDescription = edition === '5e'
    ? 'Todos los productos de la 5ª edición original de Dungeons & Dragons'
    : 'Los nuevos productos de la edición 2024 de Dungeons & Dragons'

  return (
    <>
      <MetaTags
        title={editionTitle}
        description={editionDescription}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Breadcrumbs
          items={[
            { label: editionTitle }
          ]}
        />

        <h1 className="font-display text-3xl text-dnd-gold mb-2">
          {editionTitle}
        </h1>
        <p className="text-gray-400 mb-8">
          {filteredProducts.length} de {editionProducts.length} productos
        </p>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar with filters */}
          <aside className="lg:w-64 flex-shrink-0">
            <div className="lg:sticky lg:top-24">
              <FilterPanel showEditionFilter={false} />
            </div>
          </aside>

          {/* Product grid */}
          <main className="flex-1">
            <ProductGrid
              products={filteredProducts}
              emptyMessage="No se encontraron productos con los filtros seleccionados"
            />
          </main>
        </div>
      </div>
    </>
  )
}
