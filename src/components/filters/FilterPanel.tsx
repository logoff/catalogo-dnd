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
import { EDITIONS, TYPES, LANGUAGES, SUBTYPES_BY_TYPE } from '@/utils/constants'
import type { Edition, PublicationType, PublicationSubtype, Language } from '@/types'
import SortSelect from './SortSelect'

interface FilterPanelProps {
  showEditionFilter?: boolean
}

export default function FilterPanel({ showEditionFilter = true }: FilterPanelProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const {
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

  // Determina qué subtipos mostrar según los tipos seleccionados
  const availableSubtypes = useMemo(() => {
    if (types.length === 0) {
      // Si no hay tipos seleccionados, mostrar todos los subtipos
      return [
        ...SUBTYPES_BY_TYPE.book,
        ...SUBTYPES_BY_TYPE.boxed_set,
        ...SUBTYPES_BY_TYPE.accessory,
      ]
    }
    // Si hay tipos seleccionados, mostrar solo subtipos de esos tipos
    const result: string[] = []
    if (types.includes('book')) result.push(...SUBTYPES_BY_TYPE.book)
    if (types.includes('boxed_set')) result.push(...SUBTYPES_BY_TYPE.boxed_set)
    if (types.includes('accessory')) result.push(...SUBTYPES_BY_TYPE.accessory)
    return result
  }, [types])

  const activeCount = getActiveFilterCount()

  return (
    <div className="card-dnd p-4">
      {/* Header - siempre visible, clickeable en móvil */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex items-center justify-between w-full lg:cursor-default"
      >
        <div className="flex items-center gap-2">
          <FunnelIcon className="h-5 w-5 text-dnd-gold" />
          <h3 className="font-display text-lg text-dnd-gold">Filtros</h3>
          {activeCount > 0 && <span className="badge bg-dnd-red text-white">{activeCount}</span>}
        </div>
        <div className="flex items-center gap-2">
          {activeCount > 0 && (
            <button
              onClick={(e) => {
                e.stopPropagation()
                clearFilters()
              }}
              className="text-sm text-gray-400 hover:text-white flex items-center gap-1"
            >
              <XMarkIcon className="h-4 w-4" />
              <span className="hidden sm:inline">Limpiar</span>
            </button>
          )}
          <ChevronDownIcon
            className={`h-5 w-5 text-gray-400 transition-transform lg:hidden ${
              isExpanded ? 'rotate-180' : ''
            }`}
          />
        </div>
      </button>

      {/* Contenido de filtros - colapsable en móvil, siempre visible en desktop */}
      <div className="hidden lg:block mt-6 space-y-6">
        <FilterContent
          showEditionFilter={showEditionFilter}
          editions={editions}
          types={types}
          subtypes={subtypes}
          languages={languages}
          availableSubtypes={availableSubtypes}
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
                showEditionFilter={showEditionFilter}
                editions={editions}
                types={types}
                subtypes={subtypes}
                languages={languages}
                availableSubtypes={availableSubtypes}
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
  availableSubtypes: string[]
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
  availableSubtypes,
  toggleEdition,
  toggleType,
  toggleSubtype,
  toggleLanguage,
}: FilterContentProps) {
  return (
    <>
      {/* Edition filter */}
      {showEditionFilter && (
        <FilterSection title="Edición">
          {EDITIONS.map((edition) => (
            <FilterCheckbox
              key={edition}
              label={translateEdition(edition)}
              checked={editions.includes(edition as Edition)}
              onChange={() => toggleEdition(edition as Edition)}
            />
          ))}
        </FilterSection>
      )}

      {/* Type filter */}
      <FilterSection title="Tipo">
        {TYPES.map((type) => (
          <FilterCheckbox
            key={type}
            label={translateType(type)}
            checked={types.includes(type as PublicationType)}
            onChange={() => toggleType(type as PublicationType)}
          />
        ))}
      </FilterSection>

      {/* Subtype filter */}
      {availableSubtypes.length > 0 && (
        <FilterSection title="Categoría">
          {availableSubtypes.map((subtype) => (
            <FilterCheckbox
              key={subtype}
              label={translateSubtypeStandalone(subtype as PublicationSubtype)}
              checked={subtypes.includes(subtype as PublicationSubtype)}
              onChange={() => toggleSubtype(subtype as PublicationSubtype)}
            />
          ))}
        </FilterSection>
      )}

      {/* Language filter */}
      <FilterSection title="Idioma">
        {LANGUAGES.map((lang) => (
          <FilterCheckbox
            key={lang}
            label={translateLanguage(lang)}
            checked={languages.includes(lang as Language)}
            onChange={() => toggleLanguage(lang as Language)}
          />
        ))}
      </FilterSection>

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
}

function FilterSection({ title, children }: FilterSectionProps) {
  return (
    <div>
      <h4 className="text-sm font-semibold text-gray-300 mb-2">{title}</h4>
      <div className="space-y-2">{children}</div>
    </div>
  )
}

interface FilterCheckboxProps {
  label: string
  checked: boolean
  onChange: () => void
}

function FilterCheckbox({ label, checked, onChange }: FilterCheckboxProps) {
  return (
    <label className="flex items-center gap-2 cursor-pointer group">
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className="rounded border-dnd-gold/30 bg-dnd-stone text-dnd-red focus:ring-dnd-gold/50"
      />
      <span className="text-sm text-gray-300 group-hover:text-white transition-colors">
        {label}
      </span>
    </label>
  )
}
