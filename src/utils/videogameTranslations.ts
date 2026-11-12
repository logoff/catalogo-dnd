import { format, parseISO } from 'date-fns'
import { es } from 'date-fns/locale'
import type {
  Genre,
  Mode,
  Platform,
  ReviewSource,
  Ruleset,
  Setting,
  SpanishSummary,
  SpanishSupport,
} from '@/types/videogame'
import { formatDate } from './formatters'

export const platformNames: Record<Platform, string> = {
  pc_windows: 'Windows',
  pc_dos: 'MS-DOS',
  mac: 'Mac',
  linux: 'Linux',
  amiga: 'Amiga',
  atari_st: 'Atari ST',
  c64: 'Commodore 64',
  apple_ii: 'Apple II',
  pc98: 'PC-98',
  pc88: 'PC-88',
  x68000: 'X68000',
  fm_towns: 'FM Towns',
  msx: 'MSX',
  amstrad_cpc: 'Amstrad CPC',
  zx_spectrum: 'ZX Spectrum',
  aquarius: 'Mattel Aquarius',
  intellivision: 'Intellivision',
  nes: 'NES',
  snes: 'Super Nintendo',
  master_system: 'Master System',
  genesis: 'Mega Drive',
  sega_cd: 'Mega-CD',
  saturn: 'Saturn',
  turbografx_16: 'TurboGrafx-16',
  '3do': '3DO',
  playstation: 'PlayStation',
  ps2: 'PlayStation 2',
  ps3: 'PlayStation 3',
  ps4: 'PlayStation 4',
  ps5: 'PlayStation 5',
  xbox: 'Xbox',
  xbox_360: 'Xbox 360',
  xbox_one: 'Xbox One',
  xbox_series: 'Xbox Series',
  gamecube: 'GameCube',
  wii_u: 'Wii U',
  switch: 'Nintendo Switch',
  switch_2: 'Nintendo Switch 2',
  game_boy_advance: 'Game Boy Advance',
  psp: 'PSP',
  arcade: 'Recreativa',
  ios: 'iOS',
  android: 'Android',
  mobile_phone: 'Teléfono móvil',
  browser: 'Navegador',
}

export const genreNames: Record<Genre, string> = {
  rpg: 'Rol',
  action_rpg: 'Rol de acción',
  tactical_rpg: 'Rol táctico',
  action: 'Acción',
  beat_em_up: 'Beat ’em up',
  strategy: 'Estrategia',
  real_time_strategy: 'Estrategia en tiempo real',
  mmo: 'MMO',
  roguelike: 'Roguelike',
  simulation: 'Simulación',
  flight_simulation: 'Simulador de vuelo',
  adventure: 'Aventura',
  idle: 'Idle',
  board_game: 'Juego de mesa',
  card_game: 'Juego de cartas',
  management: 'Gestión',
}

export const modeNames: Record<Mode, string> = {
  single: 'Un jugador',
  coop: 'Cooperativo',
  multiplayer: 'Multijugador',
}

export const settingNames: Record<Setting, string> = {
  forgotten_realms: 'Reinos Olvidados',
  dragonlance: 'Dragonlance',
  mystara: 'Mystara',
  dark_sun: 'Sol Oscuro',
  ravenloft: 'Ravenloft',
  planescape: 'Planescape',
  greyhawk: 'Greyhawk',
  eberron: 'Eberron',
  spelljammer: 'Spelljammer',
  al_qadim: 'Al-Qadim',
  birthright: 'Birthright',
}

export const rulesetNames: Record<Ruleset, string> = {
  adnd1: 'AD&D 1.ª edición',
  adnd2: 'AD&D 2.ª edición',
  '3e': 'D&D 3.ª edición',
  '3_5': 'D&D 3.5',
  '4e': 'D&D 4.ª edición',
  '5e': 'D&D 5.ª edición (2014)',
  '2024': 'D&D 5.5 (2024)',
  own: 'Reglas propias',
}

export const reviewSourceNames: Record<ReviewSource, string> = {
  metacritic: 'Metacritic',
  opencritic: 'OpenCritic',
  meristation: 'Meristation',
  vandal: 'Vandal',
  '3djuegos': '3DJuegos',
  ign: 'IGN',
  gamespot: 'GameSpot',
  pc_gamer: 'PC Gamer',
  eurogamer: 'Eurogamer',
  gamespy: 'GameSpy',
  computer_gaming_world: 'Computer Gaming World',
}

export const spanishSummaryNames: Record<SpanishSummary, string> = {
  full: 'En castellano',
  text: 'Textos en castellano',
  none: 'Solo en inglés',
}

// Fechas con la precisión que se conozca: «1988», «junio de 1988» o «28 de noviembre de 2012»
export function formatPartialDate(date: string): string {
  if (/^\d{4}$/.test(date)) return date
  if (/^\d{4}-\d{2}$/.test(date)) {
    return format(parseISO(`${date}-01`), "MMMM 'de' yyyy", { locale: es })
  }
  return formatDate(date)
}

// Detalle de un lanzamiento: qué partes están en castellano
export function describeSpanish(spanish?: SpanishSupport): string {
  if (!spanish) return 'Solo en inglés'
  const parts = [
    spanish.interface && 'textos',
    spanish.subtitles && 'subtítulos',
    spanish.audio && 'voces',
  ].filter((part): part is string => !!part)
  if (parts.length === 0) return 'Solo en inglés'
  const list =
    parts.length === 1 ? parts[0] : `${parts.slice(0, -1).join(', ')} y ${parts[parts.length - 1]}`
  // Frase completa, para que se entienda sin etiqueta delante
  return `${list.charAt(0).toUpperCase()}${list.slice(1)} en castellano`
}
