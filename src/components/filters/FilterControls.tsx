import { useState } from 'react'
import { ChevronDownIcon } from '@heroicons/react/24/outline'
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
