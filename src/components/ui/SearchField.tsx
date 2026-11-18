import clsx from 'clsx'
import { forwardRef, type InputHTMLAttributes } from 'react'
import { MagnifyingGlassIcon, XMarkIcon } from '@heroicons/react/24/outline'

interface SearchFieldProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'size'> {
  label: string
  onClear?: () => void
  size?: 'md' | 'lg'
  containerClassName?: string
}

const SearchField = forwardRef<HTMLInputElement, SearchFieldProps>(function SearchField(
  { label, onClear, size = 'md', className, containerClassName, value, ...props },
  ref
) {
  return (
    <div className={clsx('relative', containerClassName)}>
      <MagnifyingGlassIcon
        className={clsx(
          'pointer-events-none absolute top-1/2 -translate-y-1/2 text-muted',
          size === 'lg' ? 'left-4 size-5' : 'left-3 size-4'
        )}
        aria-hidden="true"
      />
      <input
        ref={ref}
        type="search"
        aria-label={label}
        value={value}
        className={clsx(
          'w-full rounded-lg border border-line bg-surface text-fg placeholder:text-muted',
          'transition-colors duration-150 focus:border-muted focus:ring-0 focus:outline-hidden',
          '[&::-webkit-search-cancel-button]:hidden',
          size === 'lg' ? 'h-12 pr-11 pl-11 text-base' : 'h-11 pr-10 pl-9 text-sm sm:h-10',
          className
        )}
        {...props}
      />
      {onClear && value ? (
        <button
          type="button"
          onClick={onClear}
          aria-label="Borrar la búsqueda"
          className="absolute top-1/2 right-1 inline-flex size-9 -translate-y-1/2 items-center justify-center rounded-md text-muted hover:text-fg"
        >
          <XMarkIcon className="size-4" aria-hidden="true" />
        </button>
      ) : null}
    </div>
  )
})

export default SearchField
