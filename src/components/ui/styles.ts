import clsx from 'clsx'

// Clases de los componentes base, para usarlas también en elementos que no son
// el propio componente (enlaces de react-router, <a> externos…)

export type ButtonVariant = 'primary' | 'secondary' | 'ghost'
export type ButtonSize = 'sm' | 'md'

const buttonBase =
  'inline-flex max-w-full items-center justify-center gap-2 rounded-lg py-1.5 text-center font-medium ' +
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

// Escala de títulos. Cada nivel se distingue del siguiente por algo más que el tamaño:
// la sección es grande, el título de un bloque es mediano, el grupo de una lista va en
// versalitas grises (para no confundirse con los elementos que agrupa) y el elemento de
// una tarjeta o una lista es del tamaño del texto
export type HeadingLevel = 'section' | 'title' | 'group' | 'item'

const headingLevels: Record<HeadingLevel, string> = {
  section: 'text-2xl font-semibold tracking-tight',
  title: 'text-lg font-semibold tracking-tight',
  group: 'text-xs font-semibold tracking-wider text-muted uppercase',
  item: 'text-[15px] font-semibold tracking-tight',
}

export function headingClass(level: HeadingLevel, className?: string) {
  return clsx(headingLevels[level], className)
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

// Desplegable nativo con el aspecto de los campos (icono a la izquierda)
export const selectClass =
  'h-11 w-full rounded-lg border border-line bg-surface pl-9 text-sm text-fg ' +
  'focus:border-muted focus:ring-0 sm:h-10'
