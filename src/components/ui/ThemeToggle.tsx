import { MoonIcon, SunIcon } from '@heroicons/react/24/outline'
import { useTheme } from '@/hooks/useTheme'

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme()
  // Hasta montar no se sabe el tema: los dos iconos están en el HTML y el CSS
  // enseña el que toca según data-theme
  const label =
    theme === 'dark'
      ? 'Cambiar a tema claro'
      : theme === 'light'
        ? 'Cambiar a tema oscuro'
        : 'Cambiar de tema'

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={label}
      title={label}
      className="inline-flex size-10 shrink-0 items-center justify-center rounded-lg border border-line text-fg transition-colors duration-150 hover:bg-well"
    >
      <MoonIcon className="size-5 dark:hidden" aria-hidden="true" />
      <SunIcon className="hidden size-5 dark:block" aria-hidden="true" />
    </button>
  )
}
