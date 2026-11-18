import clsx from 'clsx'

// Clases de los componentes base, para usarlas también en elementos que no son
// el propio componente (enlaces de react-router, <a> externos…)

export type ButtonVariant = 'primary' | 'secondary' | 'ghost'
export type ButtonSize = 'sm' | 'md'

const buttonBase =
  'inline-flex items-center justify-center gap-2 rounded-lg font-medium whitespace-nowrap ' +
  'transition-colors duration-150 disabled:pointer-events-none disabled:opacity-50'

const buttonVariants: Record<ButtonVariant, string> = {
  primary: 'bg-accent-solid text-on-accent hover:bg-accent-solid/90',
  secondary: 'border border-line bg-surface text-fg hover:bg-well',
  ghost: 'text-muted hover:bg-well hover:text-fg',
}

// En móvil los botones miden al menos 44 px de alto; en escritorio, 36 o 40
const buttonSizes: Record<ButtonSize, string> = {
  sm: 'min-h-11 px-3 text-sm sm:min-h-9',
  md: 'min-h-11 px-4 text-sm sm:min-h-10',
}

export function buttonClass(
  variant: ButtonVariant = 'secondary',
  size: ButtonSize = 'md',
  className?: string
) {
  return clsx(buttonBase, buttonVariants[variant], buttonSizes[size], className)
}

// Tarjeta: superficie con borde fino. Si es un enlace, el borde se oscurece al pasar
export function cardClass(interactive = false, className?: string) {
  return clsx(
    'flex flex-col overflow-hidden rounded-xl border border-line bg-surface',
    interactive && 'transition-colors duration-150 hover:border-muted',
    className
  )
}

export type BadgeVariant = 'neutral' | 'accent' | 'outline'

const badgeVariants: Record<BadgeVariant, string> = {
  neutral: 'bg-well text-muted',
  accent: 'bg-accent-soft text-accent',
  outline: 'border border-line text-muted',
}

export function badgeClass(variant: BadgeVariant = 'neutral', className?: string) {
  return clsx(
    'inline-flex items-center gap-1.5 rounded-md px-1.5 py-0.5 text-xs font-medium whitespace-nowrap',
    badgeVariants[variant],
    className
  )
}
