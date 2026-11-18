// Tema claro u oscuro. El script en línea de index.html aplica el tema antes de
// pintar con la misma lógica; si se cambia una, cambiar la otra.

export type Theme = 'light' | 'dark'

const STORAGE_KEY = 'theme'
const THEME_COLORS: Record<Theme, string> = { light: '#fafafa', dark: '#0a0a0a' }

export const darkQuery = '(prefers-color-scheme: dark)'

export function getStoredTheme(): Theme | null {
  try {
    const value = localStorage.getItem(STORAGE_KEY)
    return value === 'light' || value === 'dark' ? value : null
  } catch {
    return null
  }
}

export function storeTheme(theme: Theme): void {
  try {
    localStorage.setItem(STORAGE_KEY, theme)
  } catch {
    // Sin almacenamiento el cambio dura lo que dure la visita
  }
}

export function getSystemTheme(): Theme {
  return window.matchMedia?.(darkQuery).matches ? 'dark' : 'light'
}

export function getCurrentTheme(): Theme {
  return document.documentElement.getAttribute('data-theme') === 'dark' ? 'dark' : 'light'
}

export function applyTheme(theme: Theme): void {
  const root = document.documentElement
  root.setAttribute('data-theme', theme)
  root.style.colorScheme = theme
  document.querySelector('meta[name="theme-color"]')?.setAttribute('content', THEME_COLORS[theme])
}
