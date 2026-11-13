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

  return (
    <div className="space-y-8">
      {/* Cabecera */}
      <div className="flex flex-col md:flex-row gap-8">
        <div className="md:w-1/3 flex flex-wrap gap-2 justify-center md:justify-start">
          {images.map((image, index) => (
            <button
              key={image}
              onClick={() => {
                setLightboxIndex(index)
                setLightboxOpen(true)
              }}
              className="block cursor-zoom-in"
            >
              <LazyImage
                src={image}
                alt={`${game.title} - Imagen ${index + 1}`}
                containerClassName="max-h-96 w-auto rounded-lg shadow-card"
                className="max-h-96 w-auto rounded-lg"
              />
            </button>
          ))}
        </div>

        <div className="md:w-2/3 space-y-4">
          <div>
            <h1 className="font-display text-4xl text-dnd-gold">{game.title}</h1>
            {game.title_es && <p className="text-lg text-gray-300 mt-1">{game.title_es}</p>}
          </div>

          <div className="flex flex-wrap gap-2">
            <SpanishBadge summary={game.spanishSummary} />
            {game.genres.map((genre) => (
              <span
                key={genre}
                className="badge bg-dnd-stone text-gray-300 border border-dnd-gold/20"
              >
                {genreNames[genre]}
              </span>
            ))}
          </div>

          {game.status === 'shut_down' && (
            <p className="flex items-center gap-2 rounded-lg border border-dnd-red/50 bg-dnd-red/10 px-4 py-2 text-gray-100">
              <ExclamationTriangleIcon className="h-5 w-5 text-dnd-red" />
              Juego cerrado: sus servidores ya no funcionan.
            </p>
          )}
          {game.status === 'announced' && (
            <p className="rounded-lg border border-dnd-gold/40 bg-dnd-gold/10 px-4 py-2 text-gray-100">
              Juego anunciado: todavía no se ha publicado.
            </p>
          )}

          <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2 text-gray-300">
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
          </dl>

          <div className="max-w-3xl space-y-3 text-gray-300 leading-relaxed">
            {game.description.split(/\n\s*\n/).map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))}
          </div>

          {game.official_url && (
            <a
              href={game.official_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-dnd-gold hover:text-dnd-gold-light"
            >
              <GlobeAltIcon className="h-4 w-4" />
              Web oficial
            </a>
          )}
        </div>
      </div>

      <Section title="Dónde comprar">
        <PurchaseByPlatform slug={game.slug} releases={game.releases} />
      </Section>

      {game.videos.length > 0 && (
        <Section title="Vídeos">
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(videoStructuredData(game)) }}
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {game.videos.map((video) => (
              <YouTubeVideo key={video.youtube} video={video} />
            ))}
          </div>
        </Section>
      )}

      {game.screenshots.length > 0 && (
        <Section title="Capturas">
          <ScreenshotGallery title={game.title} screenshots={game.screenshots} />
        </Section>
      )}

      <Section title="Ediciones">
        <ReleaseTable releases={game.releases} />
      </Section>

      {game.reviews && game.reviews.length > 0 && (
        <Section title="Notas">
          <ul className="space-y-2">
            {game.reviews.map((review) => (
              <li key={review.url + (review.platform ?? '')}>
                <ReviewScore review={review} />
              </li>
            ))}
          </ul>
        </Section>
      )}

      {game.expansions && game.expansions.length > 0 && (
        <Section title="Expansiones y contenido adicional">
          <ul className="list-disc pl-5 space-y-1 text-gray-300">
            {game.expansions.map((expansion) => (
              <li key={expansion.title}>
                {expansion.title}
                {expansion.date && (
                  <span className="text-gray-400"> ({formatPartialDate(expansion.date)})</span>
                )}
              </li>
            ))}
          </ul>
        </Section>
      )}

      {relatedProducts.length > 0 && (
        <Section title="Libros relacionados">
          <ul className="space-y-1">
            {relatedProducts.map((product) => (
              <li key={product.code}>
                <Link
                  to={`/producto/${product.primaryEdition === '5e' ? '2014' : '2024'}/${product.slug}`}
                  className="text-dnd-gold hover:text-dnd-gold-light underline underline-offset-2"
                >
                  {product.primaryTitle}
                </Link>
              </li>
            ))}
          </ul>
        </Section>
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

function DataRow({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="inline font-semibold text-gray-100">{label}:</dt>{' '}
      <dd className="inline">{value}</dd>
    </div>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="card-dnd p-6">
      <h2 className="font-display text-2xl text-dnd-gold mb-4">{title}</h2>
      {children}
    </section>
  )
}
