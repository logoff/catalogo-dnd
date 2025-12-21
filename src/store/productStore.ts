import { create } from 'zustand'
import type {
  ProductWithMeta,
  Edition,
  PublicationType,
  PublicationSubtype,
  Language,
  SortOption,
} from '@/types'
import { getAllProducts } from '@/services/dataLoader'

interface ProductStore {
  products: ProductWithMeta[]
  isLoaded: boolean

  // Filters
  searchQuery: string
  editions: Edition[]
  types: PublicationType[]
  subtypes: PublicationSubtype[]
  languages: Language[]
  sortOption: SortOption

  // Actions
  loadProducts: () => void
  setSearchQuery: (query: string) => void
  toggleEdition: (edition: Edition) => void
  toggleType: (type: PublicationType) => void
  toggleSubtype: (subtype: PublicationSubtype) => void
  toggleLanguage: (language: Language) => void
  setSortOption: (option: SortOption) => void
  clearFilters: () => void

  // Computed
  getFilteredProducts: () => ProductWithMeta[]
  getActiveFilterCount: () => number
}

export const useProductStore = create<ProductStore>((set, get) => ({
  products: [],
  isLoaded: false,

  // Initial filter state
  searchQuery: '',
  editions: [],
  types: [],
  subtypes: [],
  languages: [],
  sortOption: { field: 'date', direction: 'asc' },

  loadProducts: () => {
    if (!get().isLoaded) {
      const products = getAllProducts()
      set({ products, isLoaded: true })
    }
  },

  setSearchQuery: (query) => set({ searchQuery: query }),

  toggleEdition: (edition) =>
    set((state) => ({
      editions: state.editions.includes(edition)
        ? state.editions.filter((e) => e !== edition)
        : [...state.editions, edition],
    })),

  toggleType: (type) =>
    set((state) => ({
      types: state.types.includes(type)
        ? state.types.filter((t) => t !== type)
        : [...state.types, type],
    })),

  toggleSubtype: (subtype) =>
    set((state) => ({
      subtypes: state.subtypes.includes(subtype)
        ? state.subtypes.filter((s) => s !== subtype)
        : [...state.subtypes, subtype],
    })),

  toggleLanguage: (language) =>
    set((state) => ({
      languages: state.languages.includes(language)
        ? state.languages.filter((l) => l !== language)
        : [...state.languages, language],
    })),

  setSortOption: (option) => set({ sortOption: option }),

  clearFilters: () =>
    set({
      searchQuery: '',
      editions: [],
      types: [],
      subtypes: [],
      languages: [],
    }),

  getFilteredProducts: () => {
    const state = get()
    let result = [...state.products]

    // Full-text search
    if (state.searchQuery.trim()) {
      const query = state.searchQuery.toLowerCase()
      result = result.filter((product) => {
        const searchableText = [
          product.code,
          product.primaryTitle,
          ...product.publications.flatMap((p) => [
            p.title,
            ...(p.authors || []),
            p.isbn13?.toString(),
            p.publisher,
          ]),
        ]
          .filter(Boolean)
          .join(' ')
          .toLowerCase()

        return searchableText.includes(query)
      })
    }

    // Filter by edition
    if (state.editions.length > 0) {
      result = result.filter((p) => state.editions.includes(p.primaryEdition))
    }

    // Filter by type
    if (state.types.length > 0) {
      result = result.filter((p) => p.publications.some((pub) => state.types.includes(pub.type)))
    }

    // Filter by subtype
    if (state.subtypes.length > 0) {
      result = result.filter((p) =>
        p.publications.some((pub) => state.subtypes.includes(pub.subtype))
      )
    }

    // Filter by language
    if (state.languages.length > 0) {
      result = result.filter((p) => p.languages.some((lang) => state.languages.includes(lang)))
    }

    // Sort
    const { field, direction } = state.sortOption
    result.sort((a, b) => {
      let comparison = 0

      switch (field) {
        case 'title':
          comparison = a.primaryTitle.localeCompare(b.primaryTitle)
          break
        case 'date': {
          const dateA = a.dateRange.earliest || '9999'
          const dateB = b.dateRange.earliest || '9999'
          comparison = dateA.localeCompare(dateB)
          break
        }
        case 'code':
          comparison = a.code.localeCompare(b.code)
          break
      }

      return direction === 'asc' ? comparison : -comparison
    })

    return result
  },

  getActiveFilterCount: () => {
    const state = get()
    return (
      (state.searchQuery ? 1 : 0) +
      state.editions.length +
      state.types.length +
      state.subtypes.length +
      state.languages.length
    )
  },
}))
