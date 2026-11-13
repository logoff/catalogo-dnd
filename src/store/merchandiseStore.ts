import { create } from 'zustand'
import type { MerchandiseGroup, MerchandiseKind, MerchandiseWithMeta } from '@/types/merchandise'
import { getAllMerchandise } from '@/services/merchandiseLoader'
import type { MerchandiseFilters, MerchandiseSort } from '@/utils/merchandiseFilters'

interface MerchandiseStore extends MerchandiseFilters {
  // Los artículos van en el bundle: así el HTML prerenderizado ya sale con ellos
  items: MerchandiseWithMeta[]
  sort: MerchandiseSort

  setSearchQuery: (query: string) => void
  toggleGroup: (group: MerchandiseGroup) => void
  toggleKind: (kind: MerchandiseKind) => void
  setSpainOnly: (spainOnly: boolean) => void
  setAvailableOnly: (availableOnly: boolean) => void
  setSort: (sort: MerchandiseSort) => void
  clearFilters: () => void
  getActiveFilterCount: () => number
}

const emptyFilters: MerchandiseFilters = {
  searchQuery: '',
  groups: [],
  kinds: [],
  spainOnly: false,
  availableOnly: false,
}

function toggle<T>(list: T[], value: T): T[] {
  return list.includes(value) ? list.filter((item) => item !== value) : [...list, value]
}

// Sin persistencia: nada de localStorage, así el primer render coincide con el prerenderizado
export const useMerchandiseStore = create<MerchandiseStore>()((set, get) => ({
  items: getAllMerchandise(),
  ...emptyFilters,
  sort: { field: 'date', direction: 'desc' },

  setSearchQuery: (searchQuery) => set({ searchQuery }),
  toggleGroup: (group) => set((state) => ({ groups: toggle(state.groups, group) })),
  toggleKind: (kind) => set((state) => ({ kinds: toggle(state.kinds, kind) })),
  setSpainOnly: (spainOnly) => set({ spainOnly }),
  setAvailableOnly: (availableOnly) => set({ availableOnly }),
  setSort: (sort) => set({ sort }),
  clearFilters: () => set(emptyFilters),

  getActiveFilterCount: () => {
    const state = get()
    return (
      (state.searchQuery.trim() ? 1 : 0) +
      state.groups.length +
      state.kinds.length +
      (state.spainOnly ? 1 : 0) +
      (state.availableOnly ? 1 : 0)
    )
  },
}))
