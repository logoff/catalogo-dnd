import { useMemo, useState } from 'react'
import { useVideogameStore } from '@/store/videogameStore'
import MetaTags from '@/components/seo/MetaTags'
import Breadcrumbs from '@/components/common/Breadcrumbs'
import ViewToggle, { type ViewMode } from '@/components/products/ViewToggle'
import VideogameCard from '@/components/videogames/VideogameCard'
import VideogameFilterPanel from '@/components/videogames/VideogameFilterPanel'
import { filterVideogames, sortVideogames } from '@/utils/videogameFilters'

export default function VideogamesPage() {
  const state = useVideogameStore()
  const { videogames, searchQuery, platforms, decades, spanish, settings, genres, availableOnly } =
    state
  const [view, setView] = useState<ViewMode>('grid')

  const results = useMemo(
    () =>
      sortVideogames(
        filterVideogames(videogames, {
          searchQuery,
          platforms,
          decades,
          spanish,
          settings,
          genres,
          availableOnly,
        }),
        state.sort
      ),
    [
      videogames,
      searchQuery,
      platforms,
      decades,
      spanish,
      settings,
      genres,
      availableOnly,
      state.sort,
    ]
  )

  return (
    <>
      <MetaTags
        title="Videojuegos de D&D"
        description="Todos los videojuegos oficiales de Dungeons & Dragons, de los años 80 a hoy: plataformas, fechas, notas, si están en castellano y dónde comprarlos."
      />

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <Breadcrumbs items={[{ label: 'Videojuegos' }]} />

        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="mb-2 text-3xl font-semibold tracking-tight sm:text-4xl">
              Videojuegos de D&D
            </h1>
            <p className="text-muted">
              {results.length} de {videogames.length} videojuegos
            </p>
          </div>
          <ViewToggle view={view} onChange={setView} />
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          <aside className="shrink-0 lg:w-64">
            <div className="lg:sticky lg:top-24">
              <VideogameFilterPanel />
            </div>
          </aside>

          <div className="min-w-0 flex-1">
            {results.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted text-lg mb-4">
                  Ningún videojuego cumple los filtros seleccionados
                </p>
                <button onClick={state.clearFilters} className="btn-primary">
                  Quitar filtros
                </button>
              </div>
            ) : view === 'list' ? (
              <div className="divide-y divide-line overflow-hidden rounded-xl border border-line bg-surface">
                {results.map((game) => (
                  <VideogameCard key={game.slug} game={game} view="list" />
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 xl:grid-cols-4">
                {results.map((game) => (
                  <VideogameCard key={game.slug} game={game} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  )
}
