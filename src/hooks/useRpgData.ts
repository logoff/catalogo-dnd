import { useEffect, useState } from 'react'
import type { RpgBookWithMeta, RpgIndex } from '@/types/rpg'
import { getCachedBook, getRpgIndex, loadBook, loadRpgIndex } from '@/services/rpgLoader'

// Índice de otros juegos de rol (licencias, sistemas y resumen de los libros). Tras el
// prerenderizado o la precarga de main.tsx ya está en la caché y se devuelve en el primer render;
// al llegar navegando desde otra página se carga y mientras tanto devuelve null.
export function useRpgIndex(): RpgIndex | null {
  const [index, setIndex] = useState(getRpgIndex)

  useEffect(() => {
    if (index) return
    let active = true
    loadRpgIndex().then((loaded) => active && setIndex(loaded))
    return () => {
      active = false
    }
  }, [index])

  return index
}

export type RpgBookState =
  { status: 'loading' } | { status: 'missing' } | { status: 'ready'; book: RpgBookWithMeta }

// Libro de la ficha, con el mismo criterio que useRpgIndex. Un libro de otro sistema no existe
// en esa ruta.
export function useRpgBook(system: string, slug: string): RpgBookState {
  const key = `${system}/${slug}`
  const [missing, setMissing] = useState<string | null>(null)
  // Fuerza un render cuando termina la carga
  const [, setLoaded] = useState<string | null>(null)
  const cachedBook = getCachedBook(slug)
  const cached = cachedBook && getRpgIndex() ? cachedBook : undefined

  useEffect(() => {
    if (cached) return
    let active = true
    loadBook(system, slug).then((book) => {
      if (!active) return
      if (book) setLoaded(key)
      else setMissing(key)
    })
    return () => {
      active = false
    }
  }, [system, slug, key, cached])

  if (cached)
    return cached.system === system ? { status: 'ready', book: cached } : { status: 'missing' }
  return missing === key ? { status: 'missing' } : { status: 'loading' }
}
