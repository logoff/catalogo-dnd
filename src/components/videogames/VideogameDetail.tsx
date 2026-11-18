import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ExclamationTriangleIcon, GlobeAltIcon } from '@heroicons/react/24/outline'
import type { VideogameWithMeta } from '@/types/videogame'
import { getProductByCodeAndEdition } from '@/services/dataLoader'
import { PLACEHOLDER_IMAGE } from '@/utils/constants'
import {
  formatPartialDate,
  genreNames,
  modeNames,
  rulesetNames,
  settingNames,
} from '@/utils/videogameTranslations'
import { videoStructuredData } from '@/utils/youtube'
import { DataList, DataRow, DetailSection } from '@/components/ui/DetailSection'
import SectionNav from '@/components/ui/SectionNav'
import ImageLightbox from '../common/ImageLightbox'
import LazyImage from '../common/LazyImage'
import SpanishBadge from './SpanishBadge'
import ReleaseTable from './ReleaseTable'
import ReviewScore from './ReviewScore'
import PurchaseByPlatform from './PurchaseByPlatform'
import YouTubeVideo from './YouTubeVideo'
import ScreenshotGallery from './ScreenshotGallery'

interface VideogameDetailProps {
  game: VideogameWithMeta
}

export default function VideogameDetail({ game }: VideogameDetailProps) {
  const images = game.images?.length ? game.images : [PLACEHOLDER_IMAGE]
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [lightboxIndex, setLightboxIndex] = useState(0)

  const relatedProducts = (game.related_products ?? [])
    .map((rel) => getProductByCodeAndEdition(rel.code, rel.edition))
    .filter((product) => product !== undefined)

  const sections = [
    { id: 'donde-comprar', label: 'Comprar' },
    ...(game.videos.length > 0 ? [{ id: 'videos', label: 'Vídeos' }] : []),
    ...(game.screenshots.length > 0 ? [{ id: 'capturas', label: 'Capturas' }] : []),
    { id: 'ediciones', label: 'Ediciones' },
    ...(game.reviews?.length ? [{ id: 'notas', label: 'Notas' }] : []),
    ...(game.expansions?.length
      ? [{ id: 'expansiones-y-contenido-adicional', label: 'Expansiones' }]
      : []),
    ...(relatedProducts.length > 0 ? [{ id: 'libros-relacionados', label: 'Libros' }] : []),
  ]

  return (
    <div className="space-y-10">
      {/* Cabecera */}
      <div className="flex flex-col gap-6 md:flex-row md:gap-10">
        <div className="flex w-full max-w-xs shrink-0 flex-wrap content-start gap-2 self-start rounded-xl bg-well p-4 md:w-72">
          {images.map((image, index) => (
            <button
              key={image}
              onClick={() => {
                setLightboxIndex(index)
                setLightboxOpen(true)
              }}
              aria-label={`Ampliar imagen ${index + 1}`}
              className="block cursor-zoom-in"
            >
              <LazyImage
                src={image}
                alt={`${game.title} - Imagen ${index + 1}`}
                containerClassName="max-h-96 w-auto rounded-lg "
                className="max-h-96 w-auto rounded-lg"
              />
            </button>
          ))}
        </div>

        <div className="flex min-w-0 flex-1 flex-col gap-4">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">{game.title}</h1>
            {game.title_es && <p className="mt-1 text-lg text-muted">{game.title_es}</p>}
          </div>

          <div className="flex flex-wrap gap-2">
            <SpanishBadge summary={game.spanishSummary} />
            {game.genres.map((genre) => (
              <span
                key={genre}
                className="inline-flex items-center rounded-md border border-line px-1.5 py-0.5 text-xs font-medium text-muted"
              >
                {genreNames[genre]}
              </span>
            ))}
          </div>

          {game.status === 'shut_down' && (
            <p className="flex items-center gap-2 rounded-lg border border-line bg-accent-soft px-4 py-2 text-fg">
              <ExclamationTriangleIcon className="size-5 shrink-0 text-accent" aria-hidden="true" />
              Juego cerrado: sus servidores ya no funcionan.
            </p>
          )}
          {game.status === 'announced' && (
            <p className="rounded-lg border border-line bg-well px-4 py-2 text-fg">
              Juego anunciado: todavía no se ha publicado.
            </p>
          )}

          <DataList>
            {game.firstReleaseDate && (
              <DataRow label="Lanzamiento" value={formatPartialDate(game.firstReleaseDate)} />
            )}
            <DataRow label="Desarrolladora" value={game.developers.join(', ')} />
            <DataRow label="Editora" value={game.publishers.join(', ')} />
            {game.setting && <DataRow label="Mundo" value={settingNames[game.setting]} />}
            {game.ruleset && <DataRow label="Reglas" value={rulesetNames[game.ruleset]} />}
            {game.series && <DataRow label="Saga" value={game.series} />}
            {game.modes && game.modes.length > 0 && (
              <DataRow label="Modos" value={game.modes.map((m) => modeNames[m]).join(', ')} />
            )}
          </DataList>

          <div className="max-w-3xl space-y-3 leading-relaxed">
            {game.description.split(/\n\s*\n/).map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))}
          </div>

          {game.official_url && (
            <a
              href={game.official_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-11 items-center gap-2 text-sm text-muted transition-colors duration-150 hover:text-fg sm:min-h-0"
            >
              <GlobeAltIcon className="size-4" aria-hidden="true" />
              Web oficial
            </a>
          )}
        </div>
      </div>

      <SectionNav sections={sections} />

      <DetailSection title="Dónde comprar">
        <PurchaseByPlatform slug={game.slug} releases={game.releases} />
      </DetailSection>

      {game.videos.length > 0 && (
        <DetailSection title="Vídeos">
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(videoStructuredData(game)) }}
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {game.videos.map((video) => (
              <YouTubeVideo key={video.youtube} video={video} />
            ))}
          </div>
        </DetailSection>
      )}

      {game.screenshots.length > 0 && (
        <DetailSection title="Capturas">
          <ScreenshotGallery title={game.title} screenshots={game.screenshots} />
        </DetailSection>
      )}

      <DetailSection title="Ediciones">
        <ReleaseTable releases={game.releases} />
      </DetailSection>

      {game.reviews && game.reviews.length > 0 && (
        <DetailSection title="Notas">
          <ul className="space-y-2">
            {game.reviews.map((review) => (
              <li key={review.url + (review.platform ?? '')}>
                <ReviewScore review={review} />
              </li>
            ))}
          </ul>
        </DetailSection>
      )}

      {game.expansions && game.expansions.length > 0 && (
        <DetailSection title="Expansiones y contenido adicional">
          <ul className="list-disc pl-5 space-y-1 text-fg">
            {game.expansions.map((expansion) => (
              <li key={expansion.title}>
                {expansion.title}
                {expansion.date && (
                  <span className="text-muted"> ({formatPartialDate(expansion.date)})</span>
                )}
              </li>
            ))}
          </ul>
        </DetailSection>
      )}

      {relatedProducts.length > 0 && (
        <DetailSection title="Libros relacionados">
          <ul className="space-y-1">
            {relatedProducts.map((product) => (
              <li key={product.code}>
                <Link
                  to={`/producto/${product.primaryEdition === '5e' ? '2014' : '2024'}/${product.slug}`}
                  className="underline decoration-muted underline-offset-2 transition-colors duration-150 hover:decoration-fg"
                >
                  {product.primaryTitle}
                </Link>
              </li>
            ))}
          </ul>
        </DetailSection>
      )}

      <ImageLightbox
        images={images}
        initialIndex={lightboxIndex}
        isOpen={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
      />
    </div>
  )
}
