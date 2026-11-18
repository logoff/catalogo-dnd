import { useMemo, useState } from 'react'
import { ArrowsUpDownIcon } from '@heroicons/react/24/outline'
import { useMerchandiseStore } from '@/store/merchandiseStore'
import type { MerchandiseGroup } from '@/types/merchandise'
import { getMerchandiseFacetCounts, type MerchandiseSort } from '@/utils/merchandiseFilters'
import { groupNames, kindNames, kindsByGroup } from '@/utils/merchandiseTranslations'
import { FilterCheckbox, FilterPanelHeader, FilterSection } from '../filters/FilterControls'
import SearchField from '@/components/ui/SearchField'
import { selectClass } from '@/components/ui/styles'

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
      <SearchField
        label="Buscar por título o marca"
        value={searchQuery}
        onChange={(e) => state.setSearchQuery(e.target.value)}
        placeholder="Buscar por título o marca"
      />

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
        <div className="relative">
          <ArrowsUpDownIcon
            className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted"
            aria-hidden="true"
          />
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
