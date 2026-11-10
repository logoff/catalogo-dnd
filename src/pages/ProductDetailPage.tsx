import { useParams, Link } from 'react-router-dom'
import { ArrowLeftIcon } from '@heroicons/react/24/outline'
import { getProductByCodeAndEdition } from '@/services/dataLoader'
import MetaTags from '@/components/seo/MetaTags'
import Breadcrumbs from '@/components/common/Breadcrumbs'
import ProductDetail from '@/components/products/ProductDetail'
import { translateEditionLong } from '@/utils/translations'
import { SITE_URL } from '@/utils/constants'
import { formatDate } from '@/utils/formatters'
import { bilingualTitle, firstPublication } from '@/utils/releases'
import type { Edition, ProductWithMeta, Publication } from '@/types'

const releaseDate = (pub: Publication) => (pub.date ? formatDate(pub.date) : 'anunciado, sin fecha')

// Cuándo salió (o sale) en cada idioma: es lo que más se busca de las novedades
function ReleaseDates({ product }: { product: ProductWithMeta }) {
  const english = firstPublication(product, 'english')
  const spanish = firstPublication(product, 'castellano')
  const is2024 = product.primaryEdition === '2024'

  return (
    <div className="mt-3 text-gray-300 space-y-1">
      {english && (
        <p>
          <strong className="text-gray-100">En inglés:</strong> {releaseDate(english)}
        </p>
      )}
      <p>
        <strong className="text-gray-100">En castellano:</strong>{' '}
        {spanish
          ? `${releaseDate(spanish)} (${spanish.title})`
          : is2024
            ? 'sin anunciar todavía'
            : 'no se ha publicado'}
        {is2024 && (
          <>
            {' · '}
            <Link
              to="/guias/cuando-sale-en-castellano"
              className="text-dnd-gold hover:text-dnd-gold-light underline underline-offset-2"
            >
              fechas de todas las novedades
            </Link>
          </>
        )}
      </p>
    </div>
  )
}

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

  // Portada para la vista previa en redes: mejor la de la edición en castellano
  const cover = [...product.publications]
    .sort((a, b) => Number(b.language === 'castellano') - Number(a.language === 'castellano'))
    .find((pub) => pub.images?.length)?.images?.[0]
  const coverUrl = cover && (cover.startsWith('http') ? cover : `${SITE_URL}${cover}`)

  return (
    <>
      <MetaTags
        title={bilingualTitle(product)}
        description={
          product.description ??
          `${product.primaryTitle} - ${editionLabel}. ${product.publications.length} ediciones disponibles.`
        }
        image={coverUrl}
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
            Código: {product.code} · {product.publications.length}{' '}
            {product.publications.length === 1 ? 'edición' : 'ediciones'}
          </p>
          <ReleaseDates product={product} />
          {product.description && (
            <div className="mt-4 max-w-3xl space-y-3 text-gray-300 leading-relaxed">
              {product.description.split(/\n\s*\n/).map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              ))}
            </div>
          )}
        </div>

        {/* Product details */}
        <ProductDetail product={product} />
      </div>
    </>
  )
}
