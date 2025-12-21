import { Squares2X2Icon, ListBulletIcon } from '@heroicons/react/24/outline'
import clsx from 'clsx'

export type ViewMode = 'grid' | 'list'

interface ViewToggleProps {
  view: ViewMode
  onChange: (view: ViewMode) => void
}

export default function ViewToggle({ view, onChange }: ViewToggleProps) {
  return (
    <div className="flex items-center gap-1 bg-dnd-stone-light rounded-lg p-1">
      <button
        onClick={() => onChange('grid')}
        className={clsx(
          'p-2 rounded transition-colors',
          view === 'grid' ? 'bg-dnd-gold text-dnd-stone-dark' : 'text-gray-400 hover:text-white'
        )}
        aria-label="Vista cuadrícula"
        title="Vista cuadrícula"
      >
        <Squares2X2Icon className="h-5 w-5" />
      </button>
      <button
        onClick={() => onChange('list')}
        className={clsx(
          'p-2 rounded transition-colors',
          view === 'list' ? 'bg-dnd-gold text-dnd-stone-dark' : 'text-gray-400 hover:text-white'
        )}
        aria-label="Vista lista"
        title="Vista lista"
      >
        <ListBulletIcon className="h-5 w-5" />
      </button>
    </div>
  )
}
