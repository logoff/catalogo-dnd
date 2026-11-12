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

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Breadcrumbs items={[{ label: 'Videojuegos' }]} />

        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-display text-3xl text-dnd-gold mb-2">Videojuegos de D&D</h1>
            <p className="text-gray-400">
              {results.length} de {videogames.length} videojuegos
            </p>
          </div>
          <ViewToggle view={view} onChange={setView} />
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          <aside className="lg:w-64 shrink-0">
            <div className="lg:sticky lg:top-24">
              <VideogameFilterPanel />
            </div>
          </aside>

          <main className="flex-1">
            {results.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-400 text-lg mb-4">
                  Ningún videojuego cumple los filtros seleccionados
                </p>
                <button onClick={state.clearFilters} className="btn-primary">
                  Quitar filtros
                </button>
              </div>
            ) : view === 'list' ? (
              <div className="flex flex-col gap-3">
                {results.map((game) => (
                  <VideogameCard key={game.slug} game={game} view="list" />
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 md:gap-6">
                {results.map((game) => (
                  <VideogameCard key={game.slug} game={game} />
                ))}
              </div>
            )}
          </main>
        </div>
      </div>
    </>
  )
}
