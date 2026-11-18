import { Squares2X2Icon, ListBulletIcon } from '@heroicons/react/24/outline'
import clsx from 'clsx'

export type ViewMode = 'grid' | 'list'

interface ViewToggleProps {
  view: ViewMode
  onChange: (view: ViewMode) => void
}

const options = [
  { value: 'grid' as const, label: 'Vista cuadrícula', Icon: Squares2X2Icon },
  { value: 'list' as const, label: 'Vista lista', Icon: ListBulletIcon },
]

export default function ViewToggle({ view, onChange }: ViewToggleProps) {
  return (
    <div className="inline-flex rounded-[10px] bg-well p-[3px]">
      {options.map(({ value, label, Icon }) => (
        <button
          key={value}
          type="button"
          onClick={() => onChange(value)}
          aria-label={label}
          aria-pressed={view === value}
          title={label}
          className={clsx(
            'inline-flex size-10 items-center justify-center rounded-[7px] transition-colors duration-150 sm:size-8',
            view === value
              ? 'bg-surface text-fg shadow-[0_1px_2px_rgba(0,0,0,0.08)]'
              : 'text-muted hover:text-fg'
          )}
        >
          <Icon className="size-4" aria-hidden="true" />
        </button>
      ))}
    </div>
  )
}
