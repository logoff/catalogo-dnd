import { useEffect, useState } from 'react'
import type { NovelIndex, NovelWithMeta } from '@/types/novel'
import { getCachedNovel, getNovelIndex, loadNovel, loadNovelIndex } from '@/services/novelLoader'

// Índice de novelas. Tras el prerenderizado o la precarga de main.tsx ya está en la caché y se
// devuelve en el primer render; al llegar navegando desde otra página se carga y mientras tanto
// devuelve null.
export function useNovelIndex(): NovelIndex | null {
  const [index, setIndex] = useState(getNovelIndex)

  useEffect(() => {
    if (index) return
    let active = true
    loadNovelIndex().then((loaded) => active && setIndex(loaded))
    return () => {
      active = false
    }
  }, [index])

  return index
}

export type NovelState =
  { status: 'loading' } | { status: 'missing' } | { status: 'ready'; novel: NovelWithMeta }

function stateFor(novel: NovelWithMeta | undefined): NovelState | null {
  return novel ? { status: 'ready', novel } : null
}

// Novela de la ficha, con el mismo criterio que useNovelIndex
export function useNovel(slug: string): NovelState {
  // Slugs que no existen; las que sí existen se leen de la caché en cada render
  const [missing, setMissing] = useState<string | null>(null)
  // Fuerza un render cuando termina la carga
  const [, setLoaded] = useState<string | null>(null)
  const cached = stateFor(getCachedNovel(slug))

  useEffect(() => {
    if (cached) return
    let active = true
    loadNovel(slug).then((novel) => {
      if (!active) return
      if (novel) setLoaded(slug)
      else setMissing(slug)
    })
    return () => {
      active = false
    }
  }, [slug, cached])

  if (cached) return cached
  return missing === slug ? { status: 'missing' } : { status: 'loading' }
}
