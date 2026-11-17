import { create } from 'zustand'
import type { NovelSetting } from '@/types/novel'
import type { NovelFilters, NovelSort } from '@/utils/novelFilters'

// Tarjetas por tanda en el listado: el prerenderizado solo pinta la primera
export const NOVELS_PAGE_SIZE = 48

interface NovelStore extends NovelFilters {
  sort: NovelSort
  // Cuántas tarjetas se muestran; vuelve a la primera tanda al cambiar filtros u orden
  visibleCount: number

  setSearchQuery: (query: string) => void
  toggleSetting: (setting: NovelSetting) => void
  toggleSeries: (series: string) => void
  setSpanishOnly: (spanishOnly: boolean) => void
  setAvailableOnly: (availableOnly: boolean) => void
  setSort: (sort: NovelSort) => void
  showMore: () => void
  // Filtros de mundo y serie de la dirección (?mundo=…&serie=…)
  applyUrlFilters: (filters: Pick<NovelFilters, 'settings' | 'series'>) => void
  clearFilters: () => void
  getActiveFilterCount: () => number
}

const emptyFilters: NovelFilters = {
  searchQuery: '',
  settings: [],
  series: [],
  spanishOnly: false,
  availableOnly: false,
}

function toggle<T>(list: T[], value: T): T[] {
  return list.includes(value) ? list.filter((item) => item !== value) : [...list, value]
}

const firstPage = { visibleCount: NOVELS_PAGE_SIZE }

// Sin persistencia: nada de localStorage, así el primer render coincide con el prerenderizado
export const useNovelStore = create<NovelStore>()((set, get) => ({
  ...emptyFilters,
  sort: { field: 'date', direction: 'desc' },
  ...firstPage,

  setSearchQuery: (searchQuery) => set({ searchQuery, ...firstPage }),
  toggleSetting: (setting) =>
    set((state) => ({ settings: toggle(state.settings, setting), ...firstPage })),
  toggleSeries: (series) =>
    set((state) => ({ series: toggle(state.series, series), ...firstPage })),
  setSpanishOnly: (spanishOnly) => set({ spanishOnly, ...firstPage }),
  setAvailableOnly: (availableOnly) => set({ availableOnly, ...firstPage }),
  setSort: (sort) => set({ sort, ...firstPage }),
  showMore: () => set((state) => ({ visibleCount: state.visibleCount + NOVELS_PAGE_SIZE })),
  applyUrlFilters: ({ settings, series }) =>
    set({ ...emptyFilters, settings, series, ...firstPage }),
  clearFilters: () => set({ ...emptyFilters, ...firstPage }),

  getActiveFilterCount: () => {
    const state = get()
    return (
      (state.searchQuery.trim() ? 1 : 0) +
      state.settings.length +
      state.series.length +
      (state.spanishOnly ? 1 : 0) +
      (state.availableOnly ? 1 : 0)
    )
  },
}))
