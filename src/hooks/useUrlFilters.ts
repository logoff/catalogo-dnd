import { useEffect, useRef } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useProductStore } from '@/store/productStore'
import type { Edition, PublicationType, PublicationSubtype, Language, SortOption } from '@/types'

const VALID_EDITIONS: Edition[] = ['5e', '2024']
const VALID_TYPES: PublicationType[] = ['book', 'boxed_set', 'accessory']
const VALID_LANGUAGES: Language[] = ['english', 'castellano']
const VALID_SORT_FIELDS = ['title', 'date', 'code'] as const
const VALID_SORT_DIRECTIONS = ['asc', 'desc'] as const

export function useUrlFilters() {
  const [searchParams, setSearchParams] = useSearchParams()
  const isInitialized = useRef(false)

  const searchQuery = useProductStore((state) => state.searchQuery)
  const editions = useProductStore((state) => state.editions)
  const types = useProductStore((state) => state.types)
  const subtypes = useProductStore((state) => state.subtypes)
  const languages = useProductStore((state) => state.languages)
  const sortOption = useProductStore((state) => state.sortOption)
  const viewMode = useProductStore((state) => state.viewMode)

  const setSearchQuery = useProductStore((state) => state.setSearchQuery)
  const toggleEdition = useProductStore((state) => state.toggleEdition)
  const toggleType = useProductStore((state) => state.toggleType)
  const toggleSubtype = useProductStore((state) => state.toggleSubtype)
  const toggleLanguage = useProductStore((state) => state.toggleLanguage)
  const setSortOption = useProductStore((state) => state.setSortOption)
  const setViewMode = useProductStore((state) => state.setViewMode)
  const clearFilters = useProductStore((state) => state.clearFilters)

  // Initialize filters from URL on mount
  useEffect(() => {
    if (isInitialized.current) return
    isInitialized.current = true

    // Clear existing filters first
    clearFilters()

    // Search query
    const q = searchParams.get('q')
    if (q) setSearchQuery(q)

    // Editions
    const editionParams = searchParams.getAll('edition')
    editionParams.forEach((e) => {
      if (VALID_EDITIONS.includes(e as Edition)) {
        toggleEdition(e as Edition)
      }
    })

    // Types
    const typeParams = searchParams.getAll('type')
    typeParams.forEach((t) => {
      if (VALID_TYPES.includes(t as PublicationType)) {
        toggleType(t as PublicationType)
      }
    })

    // Subtypes
    const subtypeParams = searchParams.getAll('subtype')
    subtypeParams.forEach((s) => {
      toggleSubtype(s as PublicationSubtype)
    })

    // Languages
    const langParams = searchParams.getAll('lang')
    langParams.forEach((l) => {
      if (VALID_LANGUAGES.includes(l as Language)) {
        toggleLanguage(l as Language)
      }
    })

    // Sort
    const sortField = searchParams.get('sort')
    const sortDir = searchParams.get('dir')
    if (
      sortField &&
      VALID_SORT_FIELDS.includes(sortField as SortOption['field']) &&
      sortDir &&
      VALID_SORT_DIRECTIONS.includes(sortDir as SortOption['direction'])
    ) {
      setSortOption({
        field: sortField as SortOption['field'],
        direction: sortDir as SortOption['direction'],
      })
    }

    // View mode
    const view = searchParams.get('view')
    if (view === 'list' || view === 'grid') {
      setViewMode(view)
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  // Update URL when filters change
  useEffect(() => {
    if (!isInitialized.current) return

    const params = new URLSearchParams()

    if (searchQuery) params.set('q', searchQuery)

    editions.forEach((e) => params.append('edition', e))
    types.forEach((t) => params.append('type', t))
    subtypes.forEach((s) => params.append('subtype', s))
    languages.forEach((l) => params.append('lang', l))

    if (sortOption.field !== 'date' || sortOption.direction !== 'asc') {
      params.set('sort', sortOption.field)
      params.set('dir', sortOption.direction)
    }

    if (viewMode !== 'grid') {
      params.set('view', viewMode)
    }

    setSearchParams(params, { replace: true })
  }, [searchQuery, editions, types, subtypes, languages, sortOption, viewMode, setSearchParams])
}
