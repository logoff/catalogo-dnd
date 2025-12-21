import { ArrowsUpDownIcon } from '@heroicons/react/24/outline'
import { useProductStore } from '@/store/productStore'
import type { SortOption } from '@/types'

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
    const [field, direction] = e.target.value.split('-') as [SortOption['field'], SortOption['direction']]
    setSortOption({ field, direction })
  }

  return (
    <div className="flex items-center gap-2">
      <ArrowsUpDownIcon className="h-5 w-5 text-dnd-gold" />
      <select
        value={currentValue}
        onChange={handleChange}
        className="input-dnd py-1.5 text-sm bg-dnd-stone border-dnd-gold/30"
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
