import type { Edition, Store } from './index'

export type Platform =
  // PC
  | 'pc_windows'
  | 'pc_dos'
  | 'mac'
  | 'mac_classic'
  | 'linux'
  // Ordenadores domésticos
  | 'amiga'
  | 'atari_st'
  | 'c64'
  | 'apple_ii'
  | 'pc98'
  | 'pc88'
  | 'x68000'
  | 'fm_towns'
  | 'msx'
  | 'amstrad_cpc'
  | 'zx_spectrum'
  | 'aquarius'
  // Consolas de sobremesa
  | 'intellivision'
  | 'nes'
  | 'snes'
  | 'master_system'
  | 'genesis'
  | 'sega_cd'
  | 'saturn'
  | 'turbografx_16'
  | '3do'
  | 'playstation'
  | 'ps2'
  | 'ps3'
  | 'ps4'
  | 'ps5'
  | 'xbox'
  | 'xbox_360'
  | 'xbox_one'
  | 'xbox_series'
  | 'gamecube'
  | 'wii_u'
  | 'switch'
  | 'switch_2'
  // Portátiles
  | 'game_boy_advance'
  | 'psp'
  // Otras
  | 'arcade'
  | 'ios'
  | 'android'
  | 'mobile_phone'
  | 'browser'

export type Genre =
  | 'rpg'
  | 'action_rpg'
  | 'tactical_rpg'
  | 'action'
  | 'beat_em_up'
  | 'strategy'
  | 'real_time_strategy'
  | 'mmo'
  | 'roguelike'
  | 'simulation'
  | 'flight_simulation'
  | 'adventure'
  | 'idle'
  | 'board_game'
  | 'card_game'
  | 'management'

export type Mode = 'single' | 'coop' | 'multiplayer'

export type Setting =
  | 'forgotten_realms'
  | 'dragonlance'
  | 'mystara'
  | 'dark_sun'
  | 'ravenloft'
  | 'planescape'
  | 'greyhawk'
  | 'eberron'
  | 'spelljammer'
  | 'al_qadim'
  | 'birthright'

export type Ruleset = 'adnd1' | 'adnd2' | '3e' | '3_5' | '4e' | '5e' | '2024' | 'own'

export type ReviewSource =
  | 'metacritic'
  | 'opencritic'
  | 'meristation'
  | 'vandal'
  | '3djuegos'
  | 'ign'
  | 'gamespot'
  | 'pc_gamer'
  | 'eurogamer'
  | 'gamespy'
  | 'computer_gaming_world'

export interface SpanishSupport {
  interface: boolean
  subtitles: boolean
  audio: boolean
  // Por ejemplo, «traducción de fans disponible»: nunca cuenta como castellano oficial
  note?: string
}

export interface VideogamePurchaseLink {
  store: Store
  url: string
  format?: 'digital' | 'physical'
}

export interface GameRelease {
  platform: Platform
  // ISO truncada a la precisión conocida: YYYY, YYYY-MM o YYYY-MM-DD
  date?: string
  edition?: string
  // Se vende dentro de una recopilación (id de data/videogames/bundles); sus enlaces están allí
  bundle?: string
  // Solo si difieren de las del juego
  developers?: string[]
  publishers?: string[]
  // Solo se rellena con castellano confirmado; sin dato, el lanzamiento cuenta como solo en inglés
  spanish?: SpanishSupport
  purchase_links?: VideogamePurchaseLink[]
  delisted?: boolean
}

export interface Review {
  source: ReviewSource
  score: number
  scale: number
  url: string
  platform?: Platform
  edition?: string
}

export interface Expansion {
  title: string
  date?: string
}

export interface Videogame {
  slug: string
  title: string
  title_es?: string
  description: string
  developers: string[]
  publishers: string[]
  genres: Genre[]
  modes?: Mode[]
  setting?: Setting
  ruleset?: Ruleset
  series?: string
  status?: 'released' | 'shut_down' | 'announced'
  expansions?: Expansion[]
  releases: GameRelease[]
  reviews?: Review[]
  images?: string[]
  official_url?: string
  related_products?: { edition: Edition; code: string }[]
}

export interface BundleRelease {
  platform: Platform
  date?: string
  publishers?: string[]
  purchase_links?: VideogamePurchaseLink[]
  delisted?: boolean
}

// Recopilación que se vende como un solo producto con varios juegos del catálogo
export interface VideogameBundle {
  id: string
  title: string
  games: string[]
  releases: BundleRelease[]
}

// full: con voces; text: textos o subtítulos; none: solo en inglés (también si no hay dato)
export type SpanishSummary = 'full' | 'text' | 'none'

export interface VideogameWithMeta extends Videogame {
  firstReleaseDate: string | null
  decade: number | null
  platforms: Platform[]
  spanishSummary: SpanishSummary
  // Mejor nota normalizada a 100
  bestScore: number | null
  availableToBuy: boolean
}
