import { useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import {
  ArrowsUpDownIcon,
  ChevronDownIcon,
  FunnelIcon,
  MagnifyingGlassIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline'
import { useNovelStore } from '@/store/novelStore'
import type { NovelIndex, NovelSetting } from '@/types/novel'
import { getNovelFacetCounts, type NovelSort } from '@/utils/novelFilters'
import { seriesName, settingNames } from '@/utils/novelTranslations'
import { FilterCheckbox, FilterSection } from '../filters/FilterControls'

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
        <FilterContent index={index} />
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
              <FilterContent index={index} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
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
      <div className="relative">
        <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
        <input
          type="search"
          value={searchQuery}
          onChange={(e) => state.setSearchQuery(e.target.value)}
          placeholder="Buscar por título o autor"
          aria-label="Buscar por título o autor"
          className="input-dnd pl-9 py-1.5 text-sm"
        />
      </div>

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
        <div className="flex items-center gap-2">
          <ArrowsUpDownIcon className="h-5 w-5 text-dnd-gold" />
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
