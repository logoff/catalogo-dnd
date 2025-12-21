import { useMemo } from 'react'
import { XMarkIcon, FunnelIcon } from '@heroicons/react/24/outline'
import { useProductStore } from '@/store/productStore'
import { translateType, translateLanguage, translateEdition, translateSubtypeStandalone } from '@/utils/translations'
import { EDITIONS, TYPES, LANGUAGES, SUBTYPES_BY_TYPE } from '@/utils/constants'
import type { Edition, PublicationType, PublicationSubtype, Language } from '@/types'
import SortSelect from './SortSelect'

interface FilterPanelProps {
  showEditionFilter?: boolean
}

export default function FilterPanel({ showEditionFilter = true }: FilterPanelProps) {
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
    <div className="card-dnd p-4 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <FunnelIcon className="h-5 w-5 text-dnd-gold" />
          <h3 className="font-display text-lg text-dnd-gold">Filtros</h3>
          {activeCount > 0 && (
            <span className="badge bg-dnd-red text-white">{activeCount}</span>
          )}
        </div>
        {activeCount > 0 && (
          <button
            onClick={clearFilters}
            className="text-sm text-gray-400 hover:text-white flex items-center gap-1"
          >
            <XMarkIcon className="h-4 w-4" />
            Limpiar
          </button>
        )}
      </div>

      {/* Edition filter */}
      {showEditionFilter && (
        <FilterSection title="Edición">
          {EDITIONS.map((edition) => (
            <FilterCheckbox
              key={edition}
              label={translateEdition(edition)}
              checked={editions.includes(edition)}
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
            checked={types.includes(type)}
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
            checked={languages.includes(lang)}
            onChange={() => toggleLanguage(lang as Language)}
          />
        ))}
      </FilterSection>

      {/* Sort */}
      <FilterSection title="Ordenar por">
        <SortSelect />
      </FilterSection>
    </div>
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
