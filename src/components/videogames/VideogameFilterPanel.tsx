import { useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import {
  ArrowsUpDownIcon,
  ChevronDownIcon,
  FunnelIcon,
  MagnifyingGlassIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline'
import { useVideogameStore } from '@/store/videogameStore'
import type { Genre, Platform, Setting } from '@/types/videogame'
import {
  getVideogameFacetCounts,
  type SpanishFilter,
  type VideogameSort,
} from '@/utils/videogameFilters'
import {
  genreNames,
  platformNames,
  settingNames,
  spanishSummaryNames,
} from '@/utils/videogameTranslations'
import { FilterCheckbox, FilterSection } from '../filters/FilterControls'
import PlatformIcon from './PlatformIcon'

const SPANISH_OPTIONS: SpanishFilter[] = ['full', 'text', 'none']

const SORT_OPTIONS: { value: string; label: string }[] = [
  { value: 'date-asc', label: 'Fecha (antiguo primero)' },
  { value: 'date-desc', label: 'Fecha (reciente primero)' },
  { value: 'title-asc', label: 'Título (A-Z)' },
  { value: 'title-desc', label: 'Título (Z-A)' },
  { value: 'score-desc', label: 'Nota (mejor primero)' },
  { value: 'score-asc', label: 'Nota (peor primero)' },
]

export default function VideogameFilterPanel() {
  const [isExpanded, setIsExpanded] = useState(false)
  const clearFilters = useVideogameStore((state) => state.clearFilters)
  const activeCount = useVideogameStore((state) => state.getActiveFilterCount())

  return (
    <div className="card-dnd p-4">
      <div className="relative">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          aria-expanded={isExpanded}
          className="flex items-center justify-between w-full lg:cursor-default"
        >
          <div className="flex items-center gap-2">
            <FunnelIcon className="h-5 w-5 text-dnd-gold" />
            <h3 className="font-display text-lg text-dnd-gold">Filtros</h3>
            {activeCount > 0 && <span className="badge bg-dnd-red text-white">{activeCount}</span>}
          </div>
          <ChevronDownIcon
            className={`h-5 w-5 text-gray-400 transition-transform lg:hidden ${isExpanded ? 'rotate-180' : ''}`}
          />
        </button>
        {activeCount > 0 && (
          <button
            onClick={clearFilters}
            aria-label="Limpiar filtros"
            className="absolute top-1/2 -translate-y-1/2 right-7 lg:right-0 text-sm text-gray-400 hover:text-white flex items-center gap-1"
          >
            <XMarkIcon className="h-4 w-4" />
            <span className="hidden sm:inline">Limpiar</span>
          </button>
        )}
      </div>

      <div className="hidden lg:block mt-6 space-y-6">
        <FilterContent />
      </div>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="lg:hidden overflow-hidden"
          >
            <div className="mt-6 space-y-6">
              <FilterContent />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

function FilterContent() {
  const state = useVideogameStore()
  const {
    videogames,
    searchQuery,
    platforms,
    decades,
    spanish,
    settings,
    genres,
    availableOnly,
    sort,
  } = state

  const counts = useMemo(
    () =>
      getVideogameFacetCounts(videogames, {
        searchQuery,
        platforms,
        decades,
        spanish,
        settings,
        genres,
        availableOnly,
      }),
    [videogames, searchQuery, platforms, decades, spanish, settings, genres, availableOnly]
  )

  // Opciones con resultados y las ya marcadas, en el orden de sus nombres
  const visible = <T extends string | number>(
    options: T[],
    selected: T[],
    facet: Record<string, number>
  ) => options.filter((option) => (facet[String(option)] ?? 0) > 0 || selected.includes(option))

  const allPlatforms = Object.keys(platformNames) as Platform[]
  const allDecades = [...new Set(videogames.map((g) => g.decade).filter((d) => d !== null))].sort()
  const allSettings = Object.keys(settingNames) as Setting[]
  const allGenres = Object.keys(genreNames) as Genre[]

  const visiblePlatforms = visible(allPlatforms, platforms, counts.platforms)
  const visibleDecades = visible(allDecades, decades, counts.decades)
  const visibleSpanish = visible(SPANISH_OPTIONS, spanish, counts.spanish)
  const visibleSettings = visible(allSettings, settings, counts.settings)
  const visibleGenres = visible(allGenres, genres, counts.genres)

  return (
    <>
      <div className="relative">
        <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
        <input
          type="search"
          value={searchQuery}
          onChange={(e) => state.setSearchQuery(e.target.value)}
          placeholder="Buscar por título"
          aria-label="Buscar por título"
          className="input-dnd pl-9 py-1.5 text-sm"
        />
      </div>

      {(counts.available > 0 || availableOnly) && (
        <FilterSection title="Disponibilidad">
          <FilterCheckbox
            label="A la venta"
            count={counts.available}
            checked={availableOnly}
            onChange={() => state.setAvailableOnly(!availableOnly)}
          />
        </FilterSection>
      )}

      {visibleSpanish.length > 0 && (
        <FilterSection title="Castellano">
          {visibleSpanish.map((option) => (
            <FilterCheckbox
              key={option}
              label={spanishSummaryNames[option]}
              count={counts.spanish[option] ?? 0}
              checked={spanish.includes(option)}
              onChange={() => state.toggleSpanish(option)}
            />
          ))}
        </FilterSection>
      )}

      {visibleDecades.length > 0 && (
        <FilterSection title="Década">
          {visibleDecades.map((decade) => (
            <FilterCheckbox
              key={decade}
              label={`Años ${String(decade).slice(2)}`}
              count={counts.decades[decade] ?? 0}
              checked={decades.includes(decade)}
              onChange={() => state.toggleDecade(decade)}
            />
          ))}
        </FilterSection>
      )}

      {visiblePlatforms.length > 0 && (
        <FilterSection title="Plataforma" collapsible selectedCount={platforms.length}>
          {visiblePlatforms.map((platform) => (
            <FilterCheckbox
              key={platform}
              label={platformNames[platform]}
              icon={
                <PlatformIcon platform={platform} decorative className="h-4 w-4 text-gray-400" />
              }
              count={counts.platforms[platform] ?? 0}
              checked={platforms.includes(platform)}
              onChange={() => state.togglePlatform(platform)}
            />
          ))}
        </FilterSection>
      )}

      {visibleSettings.length > 0 && (
        <FilterSection title="Mundo" collapsible selectedCount={settings.length}>
          {visibleSettings.map((setting) => (
            <FilterCheckbox
              key={setting}
              label={settingNames[setting]}
              count={counts.settings[setting] ?? 0}
              checked={settings.includes(setting)}
              onChange={() => state.toggleSetting(setting)}
            />
          ))}
        </FilterSection>
      )}

      {visibleGenres.length > 0 && (
        <FilterSection title="Género" collapsible selectedCount={genres.length}>
          {visibleGenres.map((genre) => (
            <FilterCheckbox
              key={genre}
              label={genreNames[genre]}
              count={counts.genres[genre] ?? 0}
              checked={genres.includes(genre)}
              onChange={() => state.toggleGenre(genre)}
            />
          ))}
        </FilterSection>
      )}

      <FilterSection title="Ordenar por">
        <div className="flex items-center gap-2">
          <ArrowsUpDownIcon className="h-5 w-5 text-dnd-gold" />
          <select
            value={`${sort.field}-${sort.direction}`}
            onChange={(e) => {
              const [field, direction] = e.target.value.split('-') as [
                VideogameSort['field'],
                VideogameSort['direction'],
              ]
              state.setSort({ field, direction })
            }}
            aria-label="Ordenar por"
            className="input-dnd py-1.5 text-sm bg-dnd-stone border-dnd-gold/30"
          >
            {SORT_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </FilterSection>
    </>
  )
}
