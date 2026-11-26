import { useEffect, useMemo, useRef } from 'react'
import { useSearchParams } from 'react-router-dom'
import { buttonClass } from '@/components/ui/styles'
import { useComicIndex } from '@/hooks/useComicData'
import { useComicStore } from '@/store/comicStore'
import MetaTags from '@/components/seo/MetaTags'
import Breadcrumbs from '@/components/common/Breadcrumbs'
import ComicCard from '@/components/comics/ComicCard'
import ComicFilterPanel from '@/components/comics/ComicFilterPanel'
import type { ComicSetting } from '@/types/comic'
import { filterComics, NO_FILTERS, sortComics, type ComicFilters } from '@/utils/comicFilters'
import { eraNames, settingNames, type ComicEra } from '@/utils/comicTranslations'

const TITLE = 'Cómics de D&D'
const DESCRIPTION =
  'Todos los cómics oficiales de Dungeons & Dragons, de TSR y DC a IDW y Dark Horse, con sus números, sus tomos en inglés y en castellano y dónde comprarlos.'

// Parámetros de la dirección: /comics?editorial=IDW&mundo=dragonlance&epoca=2010s
function filtersFromUrl(params: URLSearchParams): ComicFilters {
  return {
    ...NO_FILTERS,
    publishers: params.getAll('editorial'),
    settings: params.getAll('mundo').filter((s): s is ComicSetting => s in settingNames),
    eras: params.getAll('epoca').filter((e): e is ComicEra => e in eraNames),
    spainOnly: params.get('castellano') === '1',
    availableOnly: params.get('venta') === '1',
  }
}

function urlFromFilters(filters: ComicFilters): URLSearchParams {
  const params = new URLSearchParams()
  filters.publishers.forEach((p) => params.append('editorial', p))
  filters.settings.forEach((s) => params.append('mundo', s))
  filters.eras.forEach((e) => params.append('epoca', e))
  if (filters.spainOnly) params.set('castellano', '1')
  if (filters.availableOnly) params.set('venta', '1')
  return params
}

export default function ComicsPage() {
  const comics = useComicIndex()
  const [searchParams, setSearchParams] = useSearchParams()
  // El primer render va sin filtros para coincidir con el HTML prerenderizado; los de la
  // dirección se aplican al montar
  const { filters, sort, setFilters, setSort } = useComicStore()
  const initialized = useRef(false)

  useEffect(() => {
    if (initialized.current) return
    initialized.current = true
    const fromUrl = filtersFromUrl(searchParams)
    setFilters(fromUrl)
  }, [searchParams, setFilters])

  useEffect(() => {
    if (!initialized.current) return
    const params = urlFromFilters(filters)
    if (params.toString() !== searchParams.toString()) setSearchParams(params, { replace: true })
  }, [filters, searchParams, setSearchParams])

  const results = useMemo(
    () => (comics ? sortComics(filterComics(comics, filters), sort) : []),
    [comics, filters, sort]
  )

  return (
    <>
      <MetaTags title={TITLE} description={DESCRIPTION} />

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <Breadcrumbs items={[{ label: 'Cómics' }]} />

        {!comics ? (
          <p className="text-muted py-12 text-center">Cargando cómics…</p>
        ) : (
          <>
            <div className="mb-8">
              <h1 className="mb-2 text-3xl font-semibold tracking-tight sm:text-4xl">{TITLE}</h1>
              <p className="text-muted">
                {results.length} de {comics.length} series
              </p>
            </div>

            <div className="flex flex-col gap-8 lg:flex-row">
              <aside className="shrink-0 lg:w-64">
                <div className="lg:sticky lg:top-24">
                  <ComicFilterPanel
                    comics={comics}
                    filters={filters}
                    onChange={setFilters}
                    sort={sort}
                    onSort={setSort}
                  />
                </div>
              </aside>

              <div className="min-w-0 flex-1">
                {results.length === 0 ? (
                  <div className="py-12 text-center">
                    <p className="mb-4 text-lg text-muted">
                      Ninguna serie cumple los filtros seleccionados
                    </p>
                    <button
                      onClick={() => setFilters(NO_FILTERS)}
                      type="button"
                      className={buttonClass('secondary')}
                    >
                      Quitar filtros
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 xl:grid-cols-4">
                    {results.map((comic) => (
                      <ComicCard key={comic.slug} comic={comic} />
                    ))}
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </>
  )
}
