import { useParams, Link } from 'react-router-dom'
import { ArrowLeftIcon } from '@heroicons/react/24/outline'
import { getProductByCodeAndEdition } from '@/services/dataLoader'
import MetaTags from '@/components/seo/MetaTags'
import Breadcrumbs from '@/components/common/Breadcrumbs'
import ProductDetail from '@/components/products/ProductDetail'
import { translateEditionLong } from '@/utils/translations'
import type { Edition } from '@/types'

export default function ProductDetailPage() {
  const { code, edition: editionParam } = useParams<{ code: string; edition: string }>()

  // Convert URL edition to internal edition type
  const edition: Edition = editionParam === '2024' ? '2024' : '5e'
  const product = code ? getProductByCodeAndEdition(code, edition) : undefined

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <h1 className="font-display text-3xl text-dnd-gold mb-4">Producto no encontrado</h1>
        <p className="text-gray-400 mb-8">
          No se encontró ningún producto con el código "{code}" en la edición {editionParam}
        </p>
        <Link to="/catalogo" className="btn-primary">
          Volver al catálogo
        </Link>
      </div>
    )
  }

  const editionPath = edition === '5e' ? '2014' : '2024'
  const editionLabel = translateEditionLong(edition)

  return (
    <>
      <MetaTags
        title={product.primaryTitle}
        description={`${product.primaryTitle} - ${editionLabel}. ${product.publications.length} ediciones disponibles.`}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Breadcrumbs
          items={[{ label: editionLabel, to: `/${editionPath}` }, { label: product.primaryTitle }]}
        />

        {/* Back link */}
        <Link
          to={`/${editionPath}`}
          className="inline-flex items-center gap-2 text-gray-400 hover:text-dnd-gold mb-6 transition-colors"
        >
          <ArrowLeftIcon className="h-4 w-4" />
          Volver a {editionLabel}
        </Link>

        {/* Product header */}
        <div className="mb-8">
          <h1 className="font-display text-4xl text-dnd-gold mb-2">{product.primaryTitle}</h1>
          <p className="text-gray-400">
            Código: {product.code} · {product.publications.length} edición
            {product.publications.length !== 1 ? 'es' : ''}
          </p>
        </div>

        {/* Product details */}
        <ProductDetail product={product} />
      </div>
    </>
  )
}
