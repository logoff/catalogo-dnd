import { useEffect, useRef, useState, type ChangeEvent, type FormEvent } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useDebounce } from './useDebounce'

export const SEARCH_PATH = '/buscar'

export function searchUrl(query: string): string {
  const q = query.trim()
  return q ? `${SEARCH_PATH}?q=${encodeURIComponent(q)}` : SEARCH_PATH
}

// Texto buscado en la URL de /buscar, o vacío en cualquier otra página
export function useSearchQuery(): string {
  const { pathname, search } = useLocation()
  return pathname === SEARCH_PATH ? (new URLSearchParams(search).get('q') ?? '') : ''
}

// Estado de una caja del buscador global: al dejar de escribir (o al pulsar Intro) lleva a
// /buscar?q=. En /buscar sustituye la entrada del historial en vez de añadir una por letra, y la
// caja muestra el texto de la URL. Empieza vacía para que el primer render coincida con el
// prerenderizado; el texto de la URL llega en el efecto.
export function useSiteSearchInput() {
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const onSearchPage = pathname === SEARCH_PATH
  const urlQuery = useSearchQuery()
  const [value, setValue] = useState('')
  const debounced = useDebounce(value, 300)
  // Lo último que esta caja sabe que está en la URL, para no pisar lo que se escribe
  const lastSynced = useRef<string | null>(null)
  // Solo navega lo que ha escrito la persona, no lo que llega de la URL
  const typed = useRef(false)

  useEffect(() => {
    if (urlQuery === lastSynced.current) return
    lastSynced.current = urlQuery
    typed.current = false
    setValue(urlQuery)
  }, [urlQuery])

  const go = (text: string) => {
    typed.current = false
    const q = text.trim()
    if (!q && !onSearchPage) return
    lastSynced.current = q
    navigate(searchUrl(q), { replace: onSearchPage })
  }

  useEffect(() => {
    if (typed.current && debounced.trim() !== (lastSynced.current ?? '')) go(debounced)
    // go depende de la ruta, pero solo hay que navegar cuando cambia el texto
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debounced])

  return {
    value,
    onChange: (event: ChangeEvent<HTMLInputElement>) => {
      typed.current = true
      setValue(event.target.value)
    },
    onClear: () => {
      typed.current = true
      setValue('')
    },
    onSubmit: (event: FormEvent) => {
      event.preventDefault()
      go(value)
    },
  }
}
