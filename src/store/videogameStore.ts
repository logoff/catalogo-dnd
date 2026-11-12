import { create } from 'zustand'
import type { Genre, Platform, Setting, VideogameWithMeta } from '@/types/videogame'
import { getAllVideogames } from '@/services/videogameLoader'
import type { SpanishFilter, VideogameFilters, VideogameSort } from '@/utils/videogameFilters'

type ToggleableFilter = 'platforms' | 'decades' | 'spanish' | 'settings' | 'genres'

interface VideogameStore extends VideogameFilters {
  // Los juegos van en el bundle: así el HTML prerenderizado ya sale con ellos
  videogames: VideogameWithMeta[]
  sort: VideogameSort

  setSearchQuery: (query: string) => void
  togglePlatform: (platform: Platform) => void
  toggleDecade: (decade: number) => void
  toggleSpanish: (spanish: SpanishFilter) => void
  toggleSetting: (setting: Setting) => void
  toggleGenre: (genre: Genre) => void
  setAvailableOnly: (availableOnly: boolean) => void
  setSort: (sort: VideogameSort) => void
  clearFilters: () => void
  getActiveFilterCount: () => number
}

const emptyFilters: VideogameFilters = {
  searchQuery: '',
  platforms: [],
  decades: [],
  spanish: [],
  settings: [],
  genres: [],
  availableOnly: false,
}

function toggle<T>(list: T[], value: T): T[] {
  return list.includes(value) ? list.filter((item) => item !== value) : [...list, value]
}

// Sin persistencia: nada de localStorage, así el primer render coincide con el prerenderizado
export const useVideogameStore = create<VideogameStore>()((set, get) => {
  const toggler =
    <K extends ToggleableFilter>(key: K) =>
    (value: VideogameFilters[K][number]) =>
      set((state) => ({ [key]: toggle(state[key] as unknown[], value) }) as Partial<VideogameStore>)

  return {
    videogames: getAllVideogames(),
    ...emptyFilters,
    sort: { field: 'date', direction: 'asc' },

    setSearchQuery: (searchQuery) => set({ searchQuery }),
    togglePlatform: toggler('platforms'),
    toggleDecade: toggler('decades'),
    toggleSpanish: toggler('spanish'),
    toggleSetting: toggler('settings'),
    toggleGenre: toggler('genres'),
    setAvailableOnly: (availableOnly) => set({ availableOnly }),
    setSort: (sort) => set({ sort }),
    clearFilters: () => set(emptyFilters),

    getActiveFilterCount: () => {
      const state = get()
      return (
        (state.searchQuery.trim() ? 1 : 0) +
        state.platforms.length +
        state.decades.length +
        state.spanish.length +
        state.settings.length +
        state.genres.length +
        (state.availableOnly ? 1 : 0)
      )
    },
  }
})
