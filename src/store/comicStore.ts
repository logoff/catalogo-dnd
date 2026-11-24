import { create } from 'zustand'
import { NO_FILTERS, type ComicFilters, type ComicSort } from '@/utils/comicFilters'

// Filtros y orden del listado de cómics. Sin persistencia: el listado arranca sin filtros (como
// el HTML prerenderizado) y los de la dirección se aplican al montar
interface ComicState {
  filters: ComicFilters
  sort: ComicSort
  setFilters: (filters: ComicFilters) => void
  setSort: (sort: ComicSort) => void
}

export const useComicStore = create<ComicState>((set) => ({
  filters: NO_FILTERS,
  sort: 'date-desc',
  setFilters: (filters) => set({ filters }),
  setSort: (sort) => set({ sort }),
}))
