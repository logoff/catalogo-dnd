import { ArrowsUpDownIcon } from '@heroicons/react/24/outline'
import { useProductStore } from '@/store/productStore'
import type { SortOption } from '@/types'
import { selectClass } from '@/components/ui/styles'

const SORT_OPTIONS: { value: string; label: string }[] = [
  { value: 'title-asc', label: 'Título (A-Z)' },
  { value: 'title-desc', label: 'Título (Z-A)' },
  { value: 'date-asc', label: 'Fecha (antigua primero)' },
  { value: 'date-desc', label: 'Fecha (reciente primero)' },
  { value: 'code-asc', label: 'Código (A-Z)' },
  { value: 'code-desc', label: 'Código (Z-A)' },
]

export default function SortSelect() {
  const { sortOption, setSortOption } = useProductStore()

  const currentValue = `${sortOption.field}-${sortOption.direction}`

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const [field, direction] = e.target.value.split('-') as [
      SortOption['field'],
      SortOption['direction'],
    ]
    setSortOption({ field, direction })
  }

  return (
    <div className="relative">
      <ArrowsUpDownIcon
        className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted"
        aria-hidden="true"
      />
      <select
        value={currentValue}
        onChange={handleChange}
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
  )
}
