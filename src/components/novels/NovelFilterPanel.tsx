import { useMemo, useState } from 'react'
import { ArrowsUpDownIcon } from '@heroicons/react/24/outline'
import { useNovelStore } from '@/store/novelStore'
import type { NovelIndex, NovelSetting } from '@/types/novel'
import { getNovelFacetCounts, type NovelSort } from '@/utils/novelFilters'
import { seriesName, settingNames } from '@/utils/novelTranslations'
import { FilterCheckbox, FilterPanelHeader, FilterSection } from '../filters/FilterControls'
import SearchField from '@/components/ui/SearchField'
import { selectClass } from '@/components/ui/styles'

const SORT_OPTIONS: { value: string; label: string }[] = [
  { value: 'date-desc', label: 'Fecha (reciente primero)' },
  { value: 'date-asc', label: 'Fecha (antiguo primero)' },
  { value: 'reading-asc', label: 'Orden de lectura' },
  { value: 'title-asc', label: 'Título (A-Z)' },
  { value: 'title-desc', label: 'Título (Z-A)' },
]

export default function NovelFilterPanel({ index }: { index: NovelIndex }) {
  const [isExpanded, setIsExpanded] = useState(false)
  const clearFilters = useNovelStore((state) => state.clearFilters)
  const activeCount = useNovelStore((state) => state.getActiveFilterCount())

  return (
    <div className="rounded-xl border border-line bg-surface p-4 lg:border-0 lg:bg-transparent lg:p-0">
      <FilterPanelHeader
        activeCount={activeCount}
        isExpanded={isExpanded}
        onToggle={() => setIsExpanded(!isExpanded)}
        onClear={clearFilters}
      />

      <div className="mt-5 hidden space-y-6 lg:block">
        <FilterContent index={index} />
      </div>

      {isExpanded && (
        <div className="mt-5 space-y-6 lg:hidden">
          <FilterContent index={index} />
        </div>
      )}
    </div>
  )
}

function FilterContent({ index }: { index: NovelIndex }) {
  const state = useNovelStore()
  const { searchQuery, settings, series, spanishOnly, availableOnly, sort } = state

  const counts = useMemo(
    () =>
      getNovelFacetCounts(index.novels, {
        searchQuery,
        settings,
        series,
        spanishOnly,
        availableOnly,
      }),
    [index.novels, searchQuery, settings, series, spanishOnly, availableOnly]
  )

  const visibleSettings = (Object.keys(settingNames) as NovelSetting[]).filter(
    (setting) => (counts.settings[setting] ?? 0) > 0 || settings.includes(setting)
  )
  // Las series con novelas que cumplen el resto de filtros: con un mundo elegido, solo las suyas
  const visibleSeries = index.series
    .filter((s) => (counts.series[s.id] ?? 0) > 0 || series.includes(s.id))
    .sort((a, b) => seriesName(a).localeCompare(seriesName(b)))

  return (
    <>
      <SearchField
        label="Buscar por título o autor"
        value={searchQuery}
        onChange={(e) => state.setSearchQuery(e.target.value)}
        placeholder="Buscar por título o autor"
      />

      {(counts.available > 0 || availableOnly || counts.spanish > 0 || spanishOnly) && (
        <FilterSection title="Disponibilidad">
          {(counts.spanish > 0 || spanishOnly) && (
            <FilterCheckbox
              label="Con edición en castellano"
              count={counts.spanish}
              checked={spanishOnly}
              onChange={() => state.setSpanishOnly(!spanishOnly)}
            />
          )}
          {(counts.available > 0 || availableOnly) && (
            <FilterCheckbox
              label="A la venta"
              count={counts.available}
              checked={availableOnly}
              onChange={() => state.setAvailableOnly(!availableOnly)}
            />
          )}
        </FilterSection>
      )}

      {visibleSettings.length > 0 && (
        <FilterSection title="Mundo">
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

      {visibleSeries.length > 0 && (
        <FilterSection title="Serie">
          <div className="max-h-72 overflow-y-auto space-y-1 pr-1">
            {visibleSeries.map((s) => (
              <FilterCheckbox
                key={s.id}
                label={seriesName(s)}
                count={counts.series[s.id] ?? 0}
                checked={series.includes(s.id)}
                onChange={() => state.toggleSeries(s.id)}
              />
            ))}
          </div>
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
                NovelSort['field'],
                NovelSort['direction'],
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
