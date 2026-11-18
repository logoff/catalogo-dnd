import { useMemo, useState } from 'react'
import { ArrowsUpDownIcon } from '@heroicons/react/24/outline'
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
import { FilterCheckbox, FilterPanelHeader, FilterSection } from '../filters/FilterControls'
import SearchField from '@/components/ui/SearchField'
import { selectClass } from '@/components/ui/styles'
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
    <div className="rounded-xl border border-line bg-surface p-4 lg:border-0 lg:bg-transparent lg:p-0">
      <FilterPanelHeader
        activeCount={activeCount}
        isExpanded={isExpanded}
        onToggle={() => setIsExpanded(!isExpanded)}
        onClear={clearFilters}
      />

      <div className="mt-5 hidden space-y-6 lg:block">
        <FilterContent />
      </div>

      {isExpanded && (
        <div className="mt-5 space-y-6 lg:hidden">
          <FilterContent />
        </div>
      )}
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
      <SearchField
        label="Buscar por título"
        value={searchQuery}
        onChange={(e) => state.setSearchQuery(e.target.value)}
        placeholder="Buscar por título"
      />

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
              icon={<PlatformIcon platform={platform} decorative />}
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
        <div className="relative">
          <ArrowsUpDownIcon
            className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted"
            aria-hidden="true"
          />
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
            className={selectClass}
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
