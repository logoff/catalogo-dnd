import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type {
  ProductWithMeta,
  Edition,
  PublicationType,
  PublicationSubtype,
  Language,
  SortOption,
} from '@/types'
import { getAllProducts } from '@/services/dataLoader'
import { filterProducts } from '@/utils/productFilters'

type ViewMode = 'grid' | 'list'

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

  // View preferences
  viewMode: ViewMode

  // Actions
  loadProducts: () => void
  setSearchQuery: (query: string) => void
  toggleEdition: (edition: Edition) => void
  toggleType: (type: PublicationType) => void
  toggleSubtype: (subtype: PublicationSubtype) => void
  toggleLanguage: (language: Language) => void
  setSortOption: (option: SortOption) => void
  setViewMode: (mode: ViewMode) => void
  clearFilters: () => void

  // Computed
  getFilteredProducts: () => ProductWithMeta[]
  getActiveFilterCount: () => number
}

export const useProductStore = create<ProductStore>()(
  persist(
    (set, get) => ({
      // Los productos van en el bundle: forman parte del estado inicial, que es el que usa
      // Zustand al prerenderizar y al hidratar, así el HTML ya sale con ellos
      products: getAllProducts(),
      isLoaded: true,

      // Initial filter state
      searchQuery: '',
      editions: [],
      types: [],
      subtypes: [],
      languages: [],
      sortOption: { field: 'date', direction: 'asc' },
      viewMode: 'grid',

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

      setViewMode: (mode) => set({ viewMode: mode }),

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
        const result = filterProducts(state.products, state)

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
    }),
    {
      name: 'catalogo-dnd-preferences',
      partialize: (state) => ({ viewMode: state.viewMode }),
      // Se recupera tras el primer render (Layout) para que coincida con el HTML prerenderizado
      skipHydration: true,
    }
  )
)
