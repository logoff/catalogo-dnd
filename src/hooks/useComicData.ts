import { useEffect, useState } from 'react'
import type { ComicSummary, ComicWithMeta } from '@/types/comic'
import { getCachedComic, getComicIndex, loadComic, loadComicIndex } from '@/services/comicLoader'

// Índice de cómics. Tras el prerenderizado o la precarga de main.tsx ya está en la caché y se
// devuelve en el primer render; al llegar navegando desde otra página se carga y mientras tanto
// devuelve null.
export function useComicIndex(): ComicSummary[] | null {
  const [index, setIndex] = useState(getComicIndex)

  useEffect(() => {
    if (index) return
    let active = true
    loadComicIndex().then((loaded) => active && setIndex(loaded))
    return () => {
      active = false
    }
  }, [index])

  return index
}

export type ComicState =
  { status: 'loading' } | { status: 'missing' } | { status: 'ready'; comic: ComicWithMeta }

// Serie de la ficha, con el mismo criterio que useComicIndex
export function useComic(slug: string): ComicState {
  const [missing, setMissing] = useState<string | null>(null)
  const [, setLoaded] = useState<string | null>(null)
  const cached = getCachedComic(slug)

  useEffect(() => {
    if (cached) return
    let active = true
    loadComic(slug).then((comic) => {
      if (!active) return
      if (comic) setLoaded(slug)
      else setMissing(slug)
    })
    return () => {
      active = false
    }
  }, [slug, cached])

  if (cached) return { status: 'ready', comic: cached }
  return missing === slug ? { status: 'missing' } : { status: 'loading' }
}
