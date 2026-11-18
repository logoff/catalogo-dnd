import { buttonClass } from '@/components/ui/styles'
import { useMemo, useState } from 'react'
import { useNovelStore } from '@/store/novelStore'
import { useNovelIndex } from '@/hooks/useNovelData'
import { useNovelUrlFilters } from '@/hooks/useNovelUrlFilters'
import MetaTags from '@/components/seo/MetaTags'
import Breadcrumbs from '@/components/common/Breadcrumbs'
import ViewToggle, { type ViewMode } from '@/components/products/ViewToggle'
import NovelCard from '@/components/novels/NovelCard'
import NovelFilterPanel from '@/components/novels/NovelFilterPanel'
import { filterNovels, sortNovels } from '@/utils/novelFilters'

const TITLE = 'Novelas de D&D'
const DESCRIPTION =
  'Todas las novelas oficiales de Dungeons & Dragons en inglés (Dragonlance, Reinos Olvidados, Eberron, Ravenloft…) y sus ediciones en castellano, con el orden de lectura de cada serie.'

export default function NovelsPage() {
  const index = useNovelIndex()
  useNovelUrlFilters()
  const state = useNovelStore()
  const { searchQuery, settings, series, spanishOnly, availableOnly, sort, visibleCount } = state
  const [view, setView] = useState<ViewMode>('grid')

  const results = useMemo(
    () =>
      index
        ? sortNovels(
            filterNovels(index.novels, {
              searchQuery,
              settings,
              series,
              spanishOnly,
              availableOnly,
            }),
            sort
          )
        : [],
    [index, searchQuery, settings, series, spanishOnly, availableOnly, sort]
  )
  const visible = results.slice(0, visibleCount)

  return (
    <>
      <MetaTags title={TITLE} description={DESCRIPTION} />

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <Breadcrumbs items={[{ label: 'Novelas' }]} />

        {!index ? (
          <p className="text-muted py-12 text-center">Cargando novelas…</p>
        ) : (
          <>
            <div className="flex items-center justify-between mb-8">
              <div>
                <h1 className="mb-2 text-3xl font-semibold tracking-tight sm:text-4xl">{TITLE}</h1>
                <p className="text-muted">
                  {results.length} de {index.novels.length} novelas
                </p>
              </div>
              <ViewToggle view={view} onChange={setView} />
            </div>

            <div className="flex flex-col lg:flex-row gap-8">
              <aside className="shrink-0 lg:w-64">
                <div className="lg:sticky lg:top-24">
                  <NovelFilterPanel index={index} />
                </div>
              </aside>

              <div className="min-w-0 flex-1">
                {results.length === 0 ? (
                  <div className="text-center py-12">
                    <p className="text-muted text-lg mb-4">
                      Ninguna novela cumple los filtros seleccionados
                    </p>
                    <button
                      onClick={state.clearFilters}
                      type="button"
                      className={buttonClass('secondary')}
                    >
                      Quitar filtros
                    </button>
                  </div>
                ) : (
                  <>
                    {view === 'list' ? (
                      <div className="divide-y divide-line overflow-hidden rounded-xl border border-line bg-surface">
                        {visible.map((novel) => (
                          <NovelCard
                            key={novel.slug}
                            novel={novel}
                            series={index.series}
                            view="list"
                          />
                        ))}
                      </div>
                    ) : (
                      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 xl:grid-cols-4">
                        {visible.map((novel) => (
                          <NovelCard key={novel.slug} novel={novel} series={index.series} />
                        ))}
                      </div>
                    )}
                    {results.length > visible.length && (
                      <div className="text-center mt-8">
                        <button
                          onClick={state.showMore}
                          type="button"
                          className={buttonClass('secondary')}
                        >
                          Ver más ({results.length - visible.length} restantes)
                        </button>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </>
  )
}
