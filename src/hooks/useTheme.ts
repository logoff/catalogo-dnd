import { useCallback, useSyncExternalStore } from 'react'
import {
  applyTheme,
  darkQuery,
  getCurrentTheme,
  getStoredTheme,
  storeTheme,
  type Theme,
} from '@/utils/theme'

// El tema vive en el atributo data-theme de <html>: se observa ese atributo y,
// sin elección guardada, la preferencia del sistema
function subscribe(onChange: () => void) {
  const observer = new MutationObserver(onChange)
  observer.observe(document.documentElement, { attributeFilter: ['data-theme'] })

  const media = window.matchMedia?.(darkQuery)
  const onSystemChange = (event: MediaQueryListEvent) => {
    if (!getStoredTheme()) applyTheme(event.matches ? 'dark' : 'light')
  }
  media?.addEventListener('change', onSystemChange)

  return () => {
    observer.disconnect()
    media?.removeEventListener('change', onSystemChange)
  }
}

/**
 * Tema activo y función para alternarlo. En el servidor y al hidratar es
 * `null`: el HTML prerenderizado no sabe qué tema verá cada visitante.
 */
export function useTheme(): { theme: Theme | null; toggleTheme: () => void } {
  const theme = useSyncExternalStore<Theme | null>(subscribe, getCurrentTheme, () => null)

  const toggleTheme = useCallback(() => {
    const next: Theme = getCurrentTheme() === 'dark' ? 'light' : 'dark'
    applyTheme(next)
    storeTheme(next)
  }, [])

  return { theme, toggleTheme }
}
