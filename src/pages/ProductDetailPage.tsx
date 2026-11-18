import { useParams, Link } from 'react-router-dom'
import { getProductByCodeAndEdition } from '@/services/dataLoader'
import MetaTags from '@/components/seo/MetaTags'
import Breadcrumbs from '@/components/common/Breadcrumbs'
import ProductDetail from '@/components/products/ProductDetail'
import MediaReviews from '@/components/common/MediaReviews'
import { translateEditionLong } from '@/utils/translations'
import { SITE_URL } from '@/utils/constants'
import { formatDate, formatISBN, formatShortDate } from '@/utils/formatters'
import { resolveImageSrc } from '@/utils/imageResolver'
import { EditionBadge, LanguageBadge } from '@/components/common/Badge'
import PurchaseButton from '@/components/common/PurchaseButton'
import EditionsTable from '@/components/ui/EditionsTable'
import SectionNav from '@/components/ui/SectionNav'
import { ButtonLink } from '@/components/ui/Button'
import { bilingualTitle, firstPublication } from '@/utils/releases'
import type { Edition, ProductWithMeta, Publication } from '@/types'

const releaseDate = (pub: Publication) => (pub.date ? formatDate(pub.date) : 'anunciado, sin fecha')

// Cuándo salió (o sale) en cada idioma: es lo que más se busca de las novedades
function ReleaseDates({ product }: { product: ProductWithMeta }) {
  const english = firstPublication(product, 'english')
  const spanish = firstPublication(product, 'castellano')
  const is2024 = product.primaryEdition === '2024'

  return (
    <dl className="grid grid-cols-[7rem_1fr] gap-x-4 gap-y-2 rounded-xl border border-line bg-surface p-4 text-sm">
      {english && (
        <>
          <dt className="text-muted">En inglés</dt>
          <dd>{releaseDate(english)}</dd>
        </>
      )}
      <dt className="text-muted">En castellano</dt>
      <dd>
        {spanish ? (
          <span className="text-accent">
            {releaseDate(spanish)} <span className="text-muted">({spanish.title})</span>
          </span>
        ) : is2024 ? (
          'sin anunciar todavía'
        ) : (
          'no se ha publicado'
        )}
        {is2024 && (
          <Link
            to="/guias/cuando-sale-en-castellano"
            className="mt-1 block text-muted underline underline-offset-2 hover:text-fg"
          >
            Fechas de todas las novedades
          </Link>
        )}
      </dd>
    </dl>
  )
}

// Tabla de ediciones: lo esencial de cada publicación y su primer enlace de compra
function EditionsSummary({ product }: { product: ProductWithMeta }) {
  return (
    <EditionsTable
      caption={`Ediciones de ${product.primaryTitle}`}
      columns={[
        { key: 'title', header: 'Título' },
        { key: 'language', header: 'Idioma' },
        { key: 'date', header: 'Fecha', mono: true },
        { key: 'isbn', header: 'ISBN', mono: true, className: 'hidden md:table-cell' },
        { key: 'buy', header: <span className="sr-only">Comprar</span>, align: 'right' },
      ]}
      rows={product.publications.map((pub, index) => {
        const link = pub.purchase_links?.[0]
        return {
          key: `${index}-${pub.title}`,
          cells: {
            title: <span className="font-medium">{pub.title}</span>,
            language: pub.language ? <LanguageBadge language={pub.language} /> : null,
            date: pub.date ? formatShortDate(pub.date) : 'Sin fecha',
            isbn: pub.isbn13 ? formatISBN(pub.isbn13) : '—',
            buy: link ? (
              <PurchaseButton
                store={link.store}
                url={link.url}
                primary={pub.language === 'castellano'}
                tracking={{
                  producto: `${product.primaryEdition === '5e' ? '2014' : '2024'}/${product.code}`,
                  publicacion: pub.title,
                  idioma: pub.language,
                }}
              />
            ) : null,
          },
        }
      })}
    />
  )
}

export default function ProductDetailPage() {
  const { code, edition: editionParam } = useParams<{ code: string; edition: string }>()

  // Convert URL edition to internal edition type
  const edition: Edition = editionParam === '2024' ? '2024' : '5e'
  const product = code ? getProductByCodeAndEdition(code, edition) : undefined

  if (!product) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-16 text-center sm:px-6 lg:px-8">
        <h1 className="mb-4 text-3xl font-semibold tracking-tight">Producto no encontrado</h1>
        <p className="text-muted mb-8">
          No se encontró ningún producto con el código "{code}" en la edición {editionParam}
        </p>
        <ButtonLink to="/catalogo" variant="primary">
          Volver al catálogo
        </ButtonLink>
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

  const sections = [
    { id: 'ediciones', label: 'Ediciones' },
    ...(product.reviews?.length ? [{ id: 'resenas', label: 'Reseñas' }] : []),
    { id: 'detalles', label: 'Detalles' },
  ]

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

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <Breadcrumbs
          items={[{ label: editionLabel, to: `/${editionPath}` }, { label: product.primaryTitle }]}
        />

        <div className="mb-8 flex flex-col gap-6 md:flex-row md:gap-10">
          {cover && (
            <div className="w-36 shrink-0 self-start rounded-xl bg-well p-3 sm:w-48 sm:p-5 md:w-64">
              <img
                src={resolveImageSrc(cover)}
                alt={`Portada de ${product.primaryTitle}`}
                className="mx-auto max-h-80 w-auto rounded md:w-full"
              />
            </div>
          )}
          <div className="flex min-w-0 flex-1 flex-col gap-4">
            <div className="flex flex-wrap items-center gap-2">
              <EditionBadge edition={product.primaryEdition} />
              <span className="font-mono text-xs text-muted">{product.code}</span>
              <span className="text-xs text-muted">
                · {product.publications.length}{' '}
                {product.publications.length === 1 ? 'edición' : 'ediciones'}
              </span>
            </div>
            <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
              {product.primaryTitle}
            </h1>
            <ReleaseDates product={product} />
            {product.description && (
              <div className="max-w-3xl space-y-3 leading-relaxed text-fg">
                {product.description.split(/\n\s*\n/).map((paragraph, index) => (
                  <p key={index}>{paragraph}</p>
                ))}
              </div>
            )}
          </div>
        </div>

        <SectionNav sections={sections} className="mb-8" />

        <div className="space-y-12">
          <section id="ediciones" className="scroll-mt-32">
            <h2 className="mb-4 text-xl">Ediciones</h2>
            <EditionsSummary product={product} />
          </section>

          {product.reviews?.length ? (
            <section id="resenas" className="scroll-mt-32">
              <MediaReviews reviews={product.reviews} />
            </section>
          ) : null}

          <section id="detalles" className="scroll-mt-32">
            <h2 className="mb-4 text-xl">Detalles de cada edición</h2>
            <ProductDetail product={product} />
          </section>
        </div>
      </div>
    </>
  )
}
