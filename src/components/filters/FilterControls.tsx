import { useState } from 'react'
import { ChevronDownIcon } from '@heroicons/react/24/outline'

// Piezas comunes de los paneles de filtros (catálogo de libros y videojuegos)

interface FilterSectionProps {
  title: string
  children: React.ReactNode
  // Sale plegada y se despliega con su título
  collapsible?: boolean
  // Opciones marcadas, para que se vean aunque la sección esté plegada
  selectedCount?: number
}

export function FilterSection({
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
  // Icono decorativo delante del nombre (por ejemplo, el de la plataforma)
  icon?: React.ReactNode
  count: number
  checked: boolean
  onChange: () => void
}

export function FilterCheckbox({ label, icon, count, checked, onChange }: FilterCheckboxProps) {
  return (
    <div className="flex items-center gap-2">
      <label className="flex items-center gap-2 cursor-pointer group">
        <input
          type="checkbox"
          checked={checked}
          onChange={onChange}
          className="rounded-sm border-dnd-gold/30 bg-dnd-stone text-dnd-red focus:ring-dnd-gold/50"
        />
        {icon}
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
