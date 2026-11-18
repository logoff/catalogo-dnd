import { useMemo, useState } from 'react'
import { XMarkIcon, FunnelIcon, ChevronDownIcon } from '@heroicons/react/24/outline'
import { useProductStore } from '@/store/productStore'
import {
  translateType,
  translateLanguage,
  translateEdition,
  translateSubtypeStandalone,
} from '@/utils/translations'
import { EDITIONS, TYPES, LANGUAGES, ALL_SUBTYPES } from '@/utils/constants'
import { getFacetCounts, type FacetCounts } from '@/utils/productFilters'
import type { Edition, PublicationType, PublicationSubtype, Language } from '@/types'
import SortSelect from './SortSelect'
import { FilterCheckbox, FilterSection } from './FilterControls'
import SegmentedControl from '@/components/ui/SegmentedControl'
import { badgeClass } from '@/components/ui/styles'

interface FilterPanelProps {
  // En las páginas de edición: los filtros se limitan a esa edición y no se muestra su filtro
  edition?: Edition
}

export default function FilterPanel({ edition }: FilterPanelProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const {
    products,
    searchQuery,
    editions,
    types,
    subtypes,
    languages,
    toggleEdition,
    toggleType,
    toggleSubtype,
    toggleLanguage,
    clearFilters,
    getActiveFilterCount,
  } = useProductStore()

  // Resultados que daría cada opción con el resto de filtros activos
  const counts = useMemo(() => {
    const scope = edition ? products.filter((p) => p.primaryEdition === edition) : products
    return getFacetCounts(scope, {
      searchQuery,
      editions: edition ? [] : editions,
      types,
      subtypes,
      languages,
    })
  }, [products, edition, searchQuery, editions, types, subtypes, languages])

  const activeCount = getActiveFilterCount()

  return (
    <div className="rounded-xl border border-line bg-surface p-4 lg:border-0 lg:bg-transparent lg:p-0">
      <FilterPanelHeader
        activeCount={activeCount}
        isExpanded={isExpanded}
        onToggle={() => setIsExpanded(!isExpanded)}
        onClear={clearFilters}
      />

      {/* Contenido de filtros - colapsable en móvil, siempre visible en desktop */}
      <div className="mt-5 hidden space-y-6 lg:block">
        <FilterContent
          showEditionFilter={!edition}
          editions={editions}
          types={types}
          subtypes={subtypes}
          languages={languages}
          counts={counts}
          toggleEdition={toggleEdition}
          toggleType={toggleType}
          toggleSubtype={toggleSubtype}
          toggleLanguage={toggleLanguage}
        />
      </div>

      {/* Versión móvil, desplegable */}
      {isExpanded && (
        <div className="mt-5 space-y-6 lg:hidden">
          <FilterContent
            showEditionFilter={!edition}
            editions={editions}
            types={types}
            subtypes={subtypes}
            languages={languages}
            counts={counts}
            toggleEdition={toggleEdition}
            toggleType={toggleType}
            toggleSubtype={toggleSubtype}
            toggleLanguage={toggleLanguage}
          />
        </div>
      )}
    </div>
  )
}

interface FilterPanelHeaderProps {
  activeCount: number
  isExpanded: boolean
  onToggle: () => void
  onClear: () => void
}

// Cabecera común de los paneles de filtros: en móvil despliega el panel
export function FilterPanelHeader({
  activeCount,
  isExpanded,
  onToggle,
  onClear,
}: FilterPanelHeaderProps) {
  return (
    <div className="relative">
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={isExpanded}
        className="flex min-h-10 w-full items-center justify-between lg:pointer-events-none"
      >
        <div className="flex items-center gap-2">
          <FunnelIcon className="size-4 text-muted" aria-hidden="true" />
          <h3 className="text-sm font-semibold">Filtros</h3>
          {activeCount > 0 && <span className={badgeClass('accent')}>{activeCount}</span>}
        </div>
        <ChevronDownIcon
          className={`size-4 text-muted lg:hidden ${isExpanded ? 'rotate-180' : ''}`}
          aria-hidden="true"
        />
      </button>

      {/* Fuera del botón de cabecera: un <button> no puede contener otro */}
      {activeCount > 0 && (
        <button
          type="button"
          onClick={onClear}
          aria-label="Limpiar filtros"
          className="absolute top-1/2 right-7 flex min-h-10 -translate-y-1/2 items-center gap-1 px-1 text-sm text-muted hover:text-fg lg:right-0"
        >
          <XMarkIcon className="size-4" aria-hidden="true" />
          <span className="hidden sm:inline">Limpiar</span>
        </button>
      )}
    </div>
  )
}

interface FilterContentProps {
  showEditionFilter: boolean
  editions: Edition[]
  types: PublicationType[]
  subtypes: PublicationSubtype[]
  languages: Language[]
  counts: FacetCounts
  toggleEdition: (edition: Edition) => void
  toggleType: (type: PublicationType) => void
  toggleSubtype: (subtype: PublicationSubtype) => void
  toggleLanguage: (language: Language) => void
}

function FilterContent({
  showEditionFilter,
  editions,
  types,
  subtypes,
  languages,
  counts,
  toggleEdition,
  toggleType,
  toggleSubtype,
  toggleLanguage,
}: FilterContentProps) {
  // Se ocultan las opciones sin resultados, salvo las ya marcadas para poder desmarcarlas
  const visible = <T extends string>(
    options: readonly T[],
    selected: T[],
    facet: Partial<Record<T, number>>
  ) => options.filter((option) => (facet[option] ?? 0) > 0 || selected.includes(option))

  const visibleEditions = visible(EDITIONS, editions, counts.editions)
  const visibleTypes = visible(TYPES, types, counts.types)
  const visibleSubtypes = visible(ALL_SUBTYPES, subtypes, counts.subtypes)
  const visibleLanguages = visible(LANGUAGES, languages, counts.languages)

  // El control segmentado elige una edición o ninguna (todas)
  const setEdition = (next: Edition | null) => {
    editions.filter((e) => e !== next).forEach(toggleEdition)
    if (next && !editions.includes(next)) toggleEdition(next)
  }

  return (
    <>
      {/* Idioma, lo primero: lo que más se busca es si está en castellano */}
      {visibleLanguages.length > 0 && (
        <FilterSection title="Idioma">
          {visibleLanguages.map((lang) => (
            <FilterCheckbox
              key={lang}
              label={translateLanguage(lang)}
              count={counts.languages[lang] ?? 0}
              checked={languages.includes(lang)}
              onChange={() => toggleLanguage(lang)}
            />
          ))}
        </FilterSection>
      )}

      {/* Edición: una o todas, con control segmentado */}
      {showEditionFilter && (visibleEditions.length > 1 || editions.length > 0) && (
        <FilterSection title="Edición">
          <SegmentedControl
            fullWidth
            label="Edición"
            value={editions.length === 1 ? editions[0] : 'all'}
            onChange={(value) => setEdition(value === 'all' ? null : value)}
            options={[
              { value: 'all', label: 'Todas' },
              ...visibleEditions.map((option) => ({
                value: option,
                label: translateEdition(option),
              })),
            ]}
          />
        </FilterSection>
      )}

      {/* Type filter */}
      {visibleTypes.length > 0 && (
        <FilterSection title="Tipo">
          {visibleTypes.map((type) => (
            <FilterCheckbox
              key={type}
              label={translateType(type)}
              count={counts.types[type] ?? 0}
              checked={types.includes(type)}
              onChange={() => toggleType(type)}
            />
          ))}
        </FilterSection>
      )}

      {/* Subtype filter */}
      {visibleSubtypes.length > 0 && (
        <FilterSection title="Categoría" collapsible selectedCount={subtypes.length}>
          {visibleSubtypes.map((subtype) => (
            <FilterCheckbox
              key={subtype}
              label={translateSubtypeStandalone(subtype)}
              count={counts.subtypes[subtype] ?? 0}
              checked={subtypes.includes(subtype)}
              onChange={() => toggleSubtype(subtype)}
            />
          ))}
        </FilterSection>
      )}

      {/* Sort */}
      <FilterSection title="Ordenar por">
        <SortSelect />
      </FilterSection>
    </>
  )
}
