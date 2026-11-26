import { useMemo, useState } from 'react'
import { ArrowsUpDownIcon } from '@heroicons/react/24/outline'
import type { ComicSetting, ComicSummary } from '@/types/comic'
import {
  activeFilterCount,
  getComicFacetCounts,
  NO_FILTERS,
  type ComicFilters,
  type ComicSort,
} from '@/utils/comicFilters'
import { eraNames, settingNames, type ComicEra } from '@/utils/comicTranslations'
import { FilterCheckbox, FilterPanelHeader, FilterSection } from '../filters/FilterControls'
import SearchField from '@/components/ui/SearchField'
import { selectClass } from '@/components/ui/styles'

const SORT_OPTIONS: { value: ComicSort; label: string }[] = [
  { value: 'date-desc', label: 'Fecha (reciente primero)' },
  { value: 'date-asc', label: 'Fecha (antiguo primero)' },
  { value: 'title-asc', label: 'Título (A-Z)' },
]

interface Props {
  comics: ComicSummary[]
  filters: ComicFilters
  onChange: (filters: ComicFilters) => void
  sort: ComicSort
  onSort: (sort: ComicSort) => void
}

export default function ComicFilterPanel(props: Props) {
  const [isExpanded, setIsExpanded] = useState(false)
  return (
    <div className="rounded-xl border border-line bg-surface p-4 lg:border-0 lg:bg-transparent lg:p-0">
      <FilterPanelHeader
        activeCount={activeFilterCount(props.filters)}
        isExpanded={isExpanded}
        onToggle={() => setIsExpanded(!isExpanded)}
        onClear={() => props.onChange(NO_FILTERS)}
      />
      <div className="mt-5 hidden space-y-6 lg:block">
        <FilterContent {...props} />
      </div>
      {isExpanded && (
        <div className="mt-5 space-y-6 lg:hidden">
          <FilterContent {...props} />
        </div>
      )}
    </div>
  )
}

function toggle<T>(list: T[], value: T): T[] {
  return list.includes(value) ? list.filter((v) => v !== value) : [...list, value]
}

function FilterContent({ comics, filters, onChange, sort, onSort }: Props) {
  const counts = useMemo(() => getComicFacetCounts(comics, filters), [comics, filters])
  const publishers = Object.keys(counts.publishers)
    .concat(filters.publishers)
    .filter((p, i, all) => all.indexOf(p) === i)
    .sort((a, b) => (counts.publishers[b] ?? 0) - (counts.publishers[a] ?? 0) || a.localeCompare(b))
  const settings = (Object.keys(settingNames) as ComicSetting[]).filter(
    (s) => (counts.settings[s] ?? 0) > 0 || filters.settings.includes(s)
  )
  const eras = (Object.keys(eraNames) as ComicEra[]).filter(
    (e) => (counts.eras[e] ?? 0) > 0 || filters.eras.includes(e)
  )

  return (
    <>
      <SearchField
        label="Buscar por título o autor"
        value={filters.searchQuery}
        onChange={(e) => onChange({ ...filters, searchQuery: e.target.value })}
        placeholder="Buscar por título o autor"
      />

      <FilterSection title="Disponibilidad">
        <FilterCheckbox
          label="En castellano (España)"
          count={counts.spain}
          checked={filters.spainOnly}
          onChange={() => onChange({ ...filters, spainOnly: !filters.spainOnly })}
        />
        <FilterCheckbox
          label="A la venta"
          count={counts.available}
          checked={filters.availableOnly}
          onChange={() => onChange({ ...filters, availableOnly: !filters.availableOnly })}
        />
      </FilterSection>

      <FilterSection title="Editorial">
        {publishers.map((publisher) => (
          <FilterCheckbox
            key={publisher}
            label={publisher}
            count={counts.publishers[publisher] ?? 0}
            checked={filters.publishers.includes(publisher)}
            onChange={() =>
              onChange({ ...filters, publishers: toggle(filters.publishers, publisher) })
            }
          />
        ))}
      </FilterSection>

      <FilterSection title="Mundo">
        {settings.map((setting) => (
          <FilterCheckbox
            key={setting}
            label={settingNames[setting]}
            count={counts.settings[setting] ?? 0}
            checked={filters.settings.includes(setting)}
            onChange={() => onChange({ ...filters, settings: toggle(filters.settings, setting) })}
          />
        ))}
      </FilterSection>

      <FilterSection title="Época">
        {eras.map((era) => (
          <FilterCheckbox
            key={era}
            label={eraNames[era]}
            count={counts.eras[era] ?? 0}
            checked={filters.eras.includes(era)}
            onChange={() => onChange({ ...filters, eras: toggle(filters.eras, era) })}
          />
        ))}
      </FilterSection>

      <FilterSection title="Ordenar por">
        <div className="relative">
          <ArrowsUpDownIcon
            className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted"
            aria-hidden="true"
          />
          <select
            value={sort}
            onChange={(e) => onSort(e.target.value as ComicSort)}
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
