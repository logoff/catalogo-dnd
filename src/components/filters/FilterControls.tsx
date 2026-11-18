import { useState } from 'react'
import { ChevronDownIcon, FunnelIcon, XMarkIcon } from '@heroicons/react/24/outline'
import { badgeClass } from '@/components/ui/styles'

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
        <h4 className="mb-2 text-xs font-medium text-muted">{title}</h4>
        <div className="space-y-0.5">{children}</div>
      </div>
    )
  }

  return (
    <div>
      <h4 className="mb-1 text-xs font-medium text-muted">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          aria-expanded={isOpen}
          className="flex min-h-9 w-full items-center gap-2 transition-colors duration-150 hover:text-fg"
        >
          {title}
          {selectedCount > 0 && (
            <span className={badgeClass('accent')} aria-label={`${selectedCount} marcadas`}>
              {selectedCount}
            </span>
          )}
          <ChevronDownIcon
            className={`ml-auto size-4 ${isOpen ? 'rotate-180' : ''}`}
            aria-hidden="true"
          />
        </button>
      </h4>
      {isOpen && <div className="space-y-0.5">{children}</div>}
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
    <div className="flex min-h-9 items-center gap-2">
      <label className="flex cursor-pointer items-center gap-2.5 py-1">
        <input
          type="checkbox"
          checked={checked}
          onChange={onChange}
          className="size-4 rounded border-line bg-surface text-accent-solid focus:ring-0 focus:ring-offset-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"
        />
        {icon}
        <span className="text-sm text-fg">{label}</span>
      </label>
      {/* Fuera de la etiqueta para que el nombre de la casilla sea solo la opción */}
      <span aria-hidden="true" className="ml-auto font-mono text-xs text-muted tabular-nums">
        {count}
      </span>
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
