import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowTopRightOnSquareIcon } from '@heroicons/react/24/outline'
import type { ScreenWorkWithMeta } from '@/types/screen'
import { getMerchandiseBySlug } from '@/services/merchandiseLoader'
import { getVideogameBySlug } from '@/services/videogameLoader'
import { useNovelIndex } from '@/hooks/useNovelData'
import {
  countryName,
  formatNames,
  kindNames,
  languageNames,
  mediumNames,
  physicalSpanishLabel,
  seasonsLabel,
  yearsLabel,
} from '@/utils/screen'
import { formatPartialDate } from '@/utils/videogameTranslations'
import { DataList, DataRow, DetailSection } from '@/components/ui/DetailSection'
import SectionNav from '@/components/ui/SectionNav'
import Badge, { SpanishMark } from '@/components/ui/Badge'
import SegmentedControl from '@/components/ui/SegmentedControl'
import PurchaseButton from '../common/PurchaseButton'
import PurchaseLinks from '../common/PurchaseLinks'
import YouTubeVideo from '../common/YouTubeVideo'
import LazyImage from '../common/LazyImage'
import { ScreenPoster } from './ScreenCard'

const linkClass =
  'underline decoration-muted underline-offset-2 transition-colors duration-150 hover:decoration-fg'

// Cartel principal (el castellano si lo hay) y, si hay otro, un selector para verlo
function Posters({ work }: { work: ScreenWorkWithMeta }) {
  const [language, setLanguage] = useState(work.poster?.language)
  const poster = work.posters.find((p) => p.language === language) ?? work.poster

  if (!poster) return <ScreenPoster work={work} className="aspect-[2/3] w-full rounded-lg" />

  return (
    <div className="flex flex-col gap-3">
      <LazyImage
        src={poster.image}
        alt={`Cartel de ${work.displayTitle} (${languageNames[poster.language].toLowerCase()})`}
        containerClassName="aspect-[2/3] w-full rounded-lg"
        className="h-full w-full object-cover"
      />
      {work.posters.length > 1 && (
        <SegmentedControl
          label="Idioma del cartel"
          fullWidth
          value={poster.language}
          onChange={setLanguage}
          options={work.posters.map((p) => ({
            value: p.language,
            label: p.language === 'es' ? 'Castellano' : 'Original',
          }))}
        />
      )}
    </div>
  )
}

export default function ScreenDetail({ work }: { work: ScreenWorkWithMeta }) {
  const novelIndex = useNovelIndex()
  const relatedNovels = (work.related_novels ?? [])
    .map((slug) => novelIndex?.novels.find((novel) => novel.slug === slug))
    .filter((novel) => novel !== undefined)
  const relatedMerchandise = (work.related_merchandise ?? [])
    .map((slug) => getMerchandiseBySlug(slug))
    .filter((item) => item !== undefined)
  const relatedGames = (work.related_videogames ?? [])
    .map((slug) => getVideogameBySlug(slug))
    .filter((game) => game !== undefined)
  const hasRelated =
    relatedNovels.length > 0 || relatedMerchandise.length > 0 || relatedGames.length > 0
  const physical = work.physical_editions ?? []

  const sections = [
    { id: 'estrenos', label: 'Estrenos' },
    ...(work.trailers.length > 0 ? [{ id: 'traileres', label: 'Tráileres' }] : []),
    { id: 'ediciones', label: 'Ediciones' },
    ...(hasRelated ? [{ id: 'relacionado', label: 'Relacionado' }] : []),
  ]
  const years = yearsLabel(work)

  return (
    <div className="space-y-10">
      {/* Cabecera */}
      <div className="flex flex-col gap-6 md:flex-row md:gap-10">
        <div className="w-full max-w-60 shrink-0 self-start md:w-64 md:max-w-none">
          <Posters work={work} />
        </div>

        <div className="flex min-w-0 flex-1 flex-col gap-4">
          <div>
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
                {work.displayTitle}
              </h1>
              {!work.official && <Badge variant="outline">No oficial</Badge>}
            </div>
            {work.title_es && <p className="mt-1 text-lg text-muted">{work.title}</p>}
            {!work.official && work.unofficial_reason && (
              <p className="mt-3 max-w-3xl text-sm text-muted">{work.unofficial_reason}</p>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {work.hasSpanish ? (
              <SpanishMark>En castellano</SpanishMark>
            ) : (
              <SpanishMark active={false}>Solo en versión original</SpanishMark>
            )}
            <Badge variant="outline">{kindNames[work.kind]}</Badge>
          </div>

          <DataList>
            {work.parent_series && <DataRow label="Serie" value={work.parent_series} />}
            {work.status === 'announced' && !years ? (
              <DataRow label="Estreno" value="Anunciada, sin fecha" />
            ) : (
              years && <DataRow label={work.series ? 'Años' : 'Año'} value={years} />
            )}
            {work.series && (
              <DataRow label="Temporadas" value={seasonsLabel(work.series.seasons)} />
            )}
          </DataList>

          <div className="max-w-3xl space-y-3 leading-relaxed">
            {work.description.split(/\n\s*\n/).map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))}
          </div>

          {(work.external?.imdb || work.external?.filmaffinity) && (
            <ul className="flex flex-wrap gap-x-5 gap-y-2 text-sm">
              {work.external.imdb && (
                <li>
                  <a
                    href={work.external.imdb}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex min-h-11 items-center gap-1.5 text-muted transition-colors duration-150 hover:text-fg sm:min-h-0"
                  >
                    IMDb
                    <ArrowTopRightOnSquareIcon className="size-4" aria-hidden="true" />
                  </a>
                </li>
              )}
              {work.external.filmaffinity && (
                <li>
                  <a
                    href={work.external.filmaffinity}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex min-h-11 items-center gap-1.5 text-muted transition-colors duration-150 hover:text-fg sm:min-h-0"
                  >
                    FilmAffinity
                    <ArrowTopRightOnSquareIcon className="size-4" aria-hidden="true" />
                  </a>
                </li>
              )}
            </ul>
          )}
        </div>
      </div>

      <SectionNav sections={sections} />

      <DetailSection title="Estrenos" id="estrenos">
        {work.releases.length > 0 ? (
          <ul className="space-y-2">
            {work.releases.map((release, index) => (
              <li key={index} className="flex flex-wrap gap-x-3">
                <span className="w-full shrink-0 font-mono text-sm text-muted sm:w-60">
                  {formatPartialDate(release.date)}
                </span>
                <span>
                  <span className="font-semibold">{countryName(release.country)}</span>
                  {' · '}
                  {mediumNames[release.medium]}
                  {release.network && <span className="text-muted"> ({release.network})</span>}
                </span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-fg">
            {work.status === 'announced'
              ? 'Anunciada, todavía sin fecha de estreno.'
              : 'No constan fechas de estreno.'}
          </p>
        )}
      </DetailSection>

      {work.trailers.length > 0 && (
        <DetailSection title="Tráileres" id="traileres">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {work.trailers.map((trailer) => (
              <YouTubeVideo
                key={trailer.youtube}
                video={trailer}
                label={languageNames[trailer.language]}
              />
            ))}
          </div>
        </DetailSection>
      )}

      <DetailSection title="Ediciones en España" id="ediciones">
        {physical.length === 0 ? (
          <p className="text-fg">No consta ninguna edición en DVD o Blu-ray en España.</p>
        ) : (
          <PurchaseLinks>
            <ul className="space-y-4">
              {physical.map((edition, index) => (
                <li key={index}>
                  <p className="text-fg">
                    <span className="font-semibold">{formatNames[edition.format]}</span>
                    {edition.title && <span>: {edition.title}</span>}
                  </p>
                  <p className="text-sm text-muted">
                    {[edition.year, physicalSpanishLabel(edition)].filter(Boolean).join(' · ')}
                  </p>
                  {(edition.purchase_links ?? []).length > 0 ? (
                    <div className="mt-2 flex flex-wrap gap-2">
                      {edition.purchase_links!.map((link, linkIndex) => (
                        <PurchaseButton
                          key={link.url}
                          primary={index === 0 && linkIndex === 0}
                          store={link.store}
                          url={link.url}
                          tracking={{ obra: work.slug, formato: edition.format }}
                        />
                      ))}
                    </div>
                  ) : (
                    <p className="mt-1 text-sm text-muted">
                      Esta edición no está a la venta en las tiendas del sitio.
                    </p>
                  )}
                </li>
              ))}
            </ul>
            {!work.availableToBuy && (
              <p className="mt-4 text-fg">No está a la venta en las tiendas del sitio.</p>
            )}
          </PurchaseLinks>
        )}
      </DetailSection>

      {hasRelated && (
        <DetailSection title="Relacionado" id="relacionado">
          <ul className="space-y-1">
            {relatedNovels.map((novel) => (
              <li key={novel.slug}>
                <Link to={`/novela/${novel.slug}`} className={linkClass}>
                  {novel.titleEs ?? novel.title}
                </Link>{' '}
                <span className="text-sm text-muted">(novela)</span>
              </li>
            ))}
            {relatedMerchandise.map((item) => (
              <li key={item.slug}>
                <Link to={`/merchandising/${item.slug}`} className={linkClass}>
                  {item.title_es ?? item.title}
                </Link>{' '}
                <span className="text-sm text-muted">(merchandising)</span>
              </li>
            ))}
            {relatedGames.map((game) => (
              <li key={game.slug}>
                <Link to={`/videojuego/${game.slug}`} className={linkClass}>
                  {game.title}
                </Link>{' '}
                <span className="text-sm text-muted">(videojuego)</span>
              </li>
            ))}
          </ul>
        </DetailSection>
      )}
    </div>
  )
}
