import type { Platform } from '@/types/videogame'

// Plataformas con logotipo en public/images/platforms/<plataforma>.svg, sacado de Wikimedia
// Commons (dominio público o CC0; procedencia en sources.json de esa carpeta). Las demás usan
// el pictograma propio de su tipo de aparato
export const PLATFORMS_WITH_LOGO: ReadonlySet<Platform> = new Set<Platform>([
  '3do',
  'amiga',
  'amstrad_cpc',
  'android',
  'apple_ii',
  'aquarius',
  'atari_st',
  'c64',
  'fm_towns',
  'game_boy_advance',
  'gamecube',
  'genesis',
  'intellivision',
  'ios',
  'linux',
  'mac',
  'mac_classic',
  'master_system',
  'msx',
  'nes',
  'pc88',
  'pc98',
  'pc_dos',
  'pc_windows',
  'playstation',
  'ps2',
  'ps3',
  'ps4',
  'ps5',
  'psp',
  'saturn',
  'sega_cd',
  'snes',
  'switch',
  'switch_2',
  'turbografx_16',
  'wii_u',
  'x68000',
  'xbox',
  'xbox_360',
  'xbox_one',
  'xbox_series',
  'zx_spectrum',
])

export function platformLogo(platform: Platform): string | undefined {
  return PLATFORMS_WITH_LOGO.has(platform) ? `/images/platforms/${platform}.svg` : undefined
}

// Plataformas que comparten el mismo logotipo (el de NEC), para no repetirlo en las tarjetas
const SAME_LOGO: Partial<Record<Platform, Platform>> = { pc88: 'pc98', turbografx_16: 'pc98' }

export function logoKey(platform: Platform): Platform {
  return SAME_LOGO[platform] ?? platform
}
