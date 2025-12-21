import { useParams, Link } from 'react-router-dom'
import { ArrowLeftIcon } from '@heroicons/react/24/outline'
import { getProductByCode } from '@/services/dataLoader'
import MetaTags from '@/components/seo/MetaTags'
import Breadcrumbs from '@/components/common/Breadcrumbs'
import ProductDetail from '@/components/products/ProductDetail'
import { translateEditionLong } from '@/utils/translations'

export default function ProductDetailPage() {
  const { code } = useParams<{ code: string }>()
  const product = code ? getProductByCode(code) : undefined

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <h1 className="font-display text-3xl text-dnd-gold mb-4">
          Producto no encontrado
        </h1>
        <p className="text-gray-400 mb-8">
          No se encontró ningún producto con el código "{code}"
        </p>
        <Link to="/catalogo" className="btn-primary">
          Volver al catálogo
        </Link>
      </div>
    )
  }

  const editionPath = product.primaryEdition === '5e' ? '2014' : '2024'
  const editionLabel = translateEditionLong(product.primaryEdition)

  return (
    <>
      <MetaTags
        title={product.primaryTitle}
        description={`${product.primaryTitle} - ${editionLabel}. ${product.publications.length} ediciones disponibles.`}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Breadcrumbs
          items={[
            { label: editionLabel, to: `/${editionPath}` },
            { label: product.primaryTitle }
          ]}
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
          <h1 className="font-display text-4xl text-dnd-gold mb-2">
            {product.primaryTitle}
          </h1>
          <p className="text-gray-400">
            Código: {product.code} · {product.publications.length} edición{product.publications.length !== 1 ? 'es' : ''}
          </p>
        </div>

        {/* Product details */}
        <ProductDetail product={product} />
      </div>
    </>
  )
}
