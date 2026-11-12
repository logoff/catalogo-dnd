import { useMemo, useState } from 'react'
import { XMarkIcon, FunnelIcon, ChevronDownIcon } from '@heroicons/react/24/outline'
import { AnimatePresence, motion } from 'framer-motion'
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
    <div className="card-dnd p-4">
      {/* Header - siempre visible, clickeable en móvil */}
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
            className={`h-5 w-5 text-gray-400 transition-transform lg:hidden ${
              isExpanded ? 'rotate-180' : ''
            }`}
          />
        </button>

        {/* Fuera del botón de cabecera: un <button> no puede contener otro */}
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

      {/* Contenido de filtros - colapsable en móvil, siempre visible en desktop */}
      <div className="hidden lg:block mt-6 space-y-6">
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

      {/* Versión móvil - animada */}
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
          </motion.div>
        )}
      </AnimatePresence>
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

  return (
    <>
      {/* Edition filter */}
      {showEditionFilter && visibleEditions.length > 0 && (
        <FilterSection title="Edición">
          {visibleEditions.map((edition) => (
            <FilterCheckbox
              key={edition}
              label={translateEdition(edition)}
              count={counts.editions[edition] ?? 0}
              checked={editions.includes(edition)}
              onChange={() => toggleEdition(edition)}
            />
          ))}
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

      {/* Language filter */}
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

      {/* Sort */}
      <FilterSection title="Ordenar por">
        <SortSelect />
      </FilterSection>
    </>
  )
}

interface FilterSectionProps {
  title: string
  children: React.ReactNode
  // Sale plegada y se despliega con su título
  collapsible?: boolean
  // Opciones marcadas, para que se vean aunque la sección esté plegada
  selectedCount?: number
}

function FilterSection({
  title,
  children,
  collapsible = false,
  selectedCount = 0,
}: FilterSectionProps) {
  const [isOpen, setIsOpen] = useState(false)

  if (!collapsible) {
    return (
      <div>
        <h4 className="text-sm font-semibold text-gray-300 mb-2">{title}</h4>
        <div className="space-y-2">{children}</div>
      </div>
    )
  }

  return (
    <div>
      <h4 className="text-sm font-semibold text-gray-300 mb-2">
        <button
          onClick={() => setIsOpen(!isOpen)}
          aria-expanded={isOpen}
          className="flex items-center gap-2 w-full hover:text-white transition-colors"
        >
          {title}
          {selectedCount > 0 && (
            <span className="badge bg-dnd-red text-white" aria-label={`${selectedCount} marcadas`}>
              {selectedCount}
            </span>
          )}
          <ChevronDownIcon
            className={`ml-auto h-4 w-4 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          />
        </button>
      </h4>
      {isOpen && <div className="space-y-2">{children}</div>}
    </div>
  )
}

interface FilterCheckboxProps {
  label: string
  count: number
  checked: boolean
  onChange: () => void
}

function FilterCheckbox({ label, count, checked, onChange }: FilterCheckboxProps) {
  return (
    <div className="flex items-center gap-2">
      <label className="flex items-center gap-2 cursor-pointer group">
        <input
          type="checkbox"
          checked={checked}
          onChange={onChange}
          className="rounded-sm border-dnd-gold/30 bg-dnd-stone text-dnd-red focus:ring-dnd-gold/50"
        />
        <span className="text-sm text-gray-300 group-hover:text-white transition-colors">
          {label}
        </span>
      </label>
      {/* Fuera de la etiqueta para que el nombre de la casilla sea solo la opción */}
      <span aria-hidden="true" className="ml-auto text-xs text-gray-500">
        {count}
      </span>
    </div>
  )
}
