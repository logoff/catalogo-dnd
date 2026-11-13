import { useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import {
  ArrowsUpDownIcon,
  ChevronDownIcon,
  FunnelIcon,
  MagnifyingGlassIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline'
import { useMerchandiseStore } from '@/store/merchandiseStore'
import type { MerchandiseGroup } from '@/types/merchandise'
import { getMerchandiseFacetCounts, type MerchandiseSort } from '@/utils/merchandiseFilters'
import { groupNames, kindNames, kindsByGroup } from '@/utils/merchandiseTranslations'
import { FilterCheckbox, FilterSection } from '../filters/FilterControls'

const SORT_OPTIONS: { value: string; label: string }[] = [
  { value: 'date-desc', label: 'Fecha (reciente primero)' },
  { value: 'date-asc', label: 'Fecha (antiguo primero)' },
  { value: 'title-asc', label: 'Título (A-Z)' },
  { value: 'title-desc', label: 'Título (Z-A)' },
]

export default function MerchandiseFilterPanel() {
  const [isExpanded, setIsExpanded] = useState(false)
  const clearFilters = useMerchandiseStore((state) => state.clearFilters)
  const activeCount = useMerchandiseStore((state) => state.getActiveFilterCount())

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
  const state = useMerchandiseStore()
  const { items, searchQuery, groups, kinds, spainOnly, availableOnly, sort } = state

  const counts = useMemo(
    () =>
      getMerchandiseFacetCounts(items, { searchQuery, groups, kinds, spainOnly, availableOnly }),
    [items, searchQuery, groups, kinds, spainOnly, availableOnly]
  )

  const allGroups = Object.keys(groupNames) as MerchandiseGroup[]
  const visibleGroups = allGroups.filter(
    (group) => (counts.groups[group] ?? 0) > 0 || groups.includes(group)
  )
  // Solo los tipos de los grupos elegidos (o de todos si no hay ninguno)
  const visibleKinds = (groups.length > 0 ? groups : allGroups)
    .flatMap((group) => kindsByGroup[group])
    .filter((kind) => (counts.kinds[kind] ?? 0) > 0 || kinds.includes(kind))

  return (
    <>
      <div className="relative">
        <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
        <input
          type="search"
          value={searchQuery}
          onChange={(e) => state.setSearchQuery(e.target.value)}
          placeholder="Buscar por título o marca"
          aria-label="Buscar por título o marca"
          className="input-dnd pl-9 py-1.5 text-sm"
        />
      </div>

      {(counts.available > 0 || availableOnly || counts.spain > 0 || spainOnly) && (
        <FilterSection title="Disponibilidad">
          {(counts.available > 0 || availableOnly) && (
            <FilterCheckbox
              label="A la venta"
              count={counts.available}
              checked={availableOnly}
              onChange={() => state.setAvailableOnly(!availableOnly)}
            />
          )}
          {(counts.spain > 0 || spainOnly) && (
            <FilterCheckbox
              label="En castellano, publicado en España"
              count={counts.spain}
              checked={spainOnly}
              onChange={() => state.setSpainOnly(!spainOnly)}
            />
          )}
        </FilterSection>
      )}

      {visibleGroups.length > 0 && (
        <FilterSection title="Grupo">
          {visibleGroups.map((group) => (
            <FilterCheckbox
              key={group}
              label={groupNames[group]}
              count={counts.groups[group] ?? 0}
              checked={groups.includes(group)}
              onChange={() => state.toggleGroup(group)}
            />
          ))}
        </FilterSection>
      )}

      {visibleKinds.length > 0 && (
        <FilterSection title="Tipo">
          {visibleKinds.map((kind) => (
            <FilterCheckbox
              key={kind}
              label={kindNames[kind]}
              count={counts.kinds[kind] ?? 0}
              checked={kinds.includes(kind)}
              onChange={() => state.toggleKind(kind)}
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
                MerchandiseSort['field'],
                MerchandiseSort['direction'],
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
