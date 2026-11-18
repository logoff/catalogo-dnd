import clsx from 'clsx'
import { useRef, type KeyboardEvent } from 'react'

export interface SegmentedOption<T extends string> {
  value: T
  label: string
}

interface SegmentedControlProps<T extends string> {
  label: string
  options: SegmentedOption<T>[]
  value: T
  onChange: (value: T) => void
  className?: string
}

// Grupo de opciones excluyentes (radiogroup): se elige con clic o con las flechas
export default function SegmentedControl<T extends string>({
  label,
  options,
  value,
  onChange,
  className,
}: SegmentedControlProps<T>) {
  const refs = useRef<(HTMLButtonElement | null)[]>([])

  const onKeyDown = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
    const step = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 }[event.key]
    if (!step) return
    event.preventDefault()
    const next = (index + step + options.length) % options.length
    onChange(options[next].value)
    refs.current[next]?.focus()
  }

  return (
    <div
      role="radiogroup"
      aria-label={label}
      className={clsx(
        'inline-flex max-w-full overflow-x-auto rounded-[10px] bg-well p-[3px]',
        className
      )}
    >
      {options.map((option, index) => {
        const selected = option.value === value
        return (
          <button
            key={option.value}
            ref={(el) => {
              refs.current[index] = el
            }}
            type="button"
            role="radio"
            aria-checked={selected}
            tabIndex={selected ? 0 : -1}
            onClick={() => onChange(option.value)}
            onKeyDown={(event) => onKeyDown(event, index)}
            className={clsx(
              'min-h-10 rounded-[7px] px-3 text-sm whitespace-nowrap transition-colors duration-150 sm:min-h-8',
              selected
                ? 'bg-surface font-medium text-fg shadow-[0_1px_2px_rgba(0,0,0,0.08)]'
                : 'text-muted hover:text-fg'
            )}
          >
            {option.label}
          </button>
        )
      })}
    </div>
  )
}
