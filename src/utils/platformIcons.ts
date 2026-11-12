import type { Platform } from '@/types/videogame'
import type { BrandIcon } from '@/components/videogames/brandIcons'

// Logotipo de Simple Icons cuando existe; si no, un icono genérico según el tipo de plataforma
export type PlatformIconSpec =
  { kind: 'brand'; name: BrandIcon } | { kind: 'computer' | 'console' | 'mobile' | 'browser' }

const brand = (name: BrandIcon): PlatformIconSpec => ({ kind: 'brand', name })
const computer: PlatformIconSpec = { kind: 'computer' }
const console_: PlatformIconSpec = { kind: 'console' }

export const platformIcons: Record<Platform, PlatformIconSpec> = {
  // Windows no está en Simple Icons
  pc_windows: computer,
  pc_dos: computer,
  mac: brand('apple'),
  linux: brand('linux'),
  amiga: brand('commodore'),
  atari_st: brand('atari'),
  c64: brand('commodore'),
  apple_ii: brand('apple'),
  pc98: brand('nec'),
  pc88: brand('nec'),
  x68000: brand('sharp'),
  fm_towns: computer,
  msx: computer,
  amstrad_cpc: computer,
  zx_spectrum: computer,
  aquarius: computer,
  // Nintendo, Xbox, 3DO y Mattel no están en Simple Icons
  intellivision: console_,
  nes: console_,
  snes: console_,
  master_system: brand('sega'),
  genesis: brand('sega'),
  sega_cd: brand('sega'),
  saturn: brand('sega'),
  turbografx_16: brand('nec'),
  '3do': console_,
  // El símbolo de PlayStation se reconoce mejor que los logotipos de texto de cada consola
  playstation: brand('playstation'),
  ps2: brand('playstation'),
  ps3: brand('playstation'),
  ps4: brand('playstation'),
  ps5: brand('playstation'),
  xbox: console_,
  xbox_360: console_,
  xbox_one: console_,
  xbox_series: console_,
  gamecube: console_,
  wii_u: console_,
  switch: console_,
  switch_2: console_,
  game_boy_advance: console_,
  psp: brand('playstation'),
  arcade: console_,
  ios: brand('apple'),
  android: brand('android'),
  mobile_phone: { kind: 'mobile' },
  browser: { kind: 'browser' },
}
