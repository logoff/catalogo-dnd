import type { ComicFormat, ComicKind, ComicSetting, ComicSummary } from '@/types/comic'

// En el orden en que se muestran en el filtro
export const settingNames: Record<ComicSetting, string> = {
  forgotten_realms: 'Reinos Olvidados',
  dragonlance: 'Dragonlance',
  ravenloft: 'Ravenloft',
  eberron: 'Eberron',
  greyhawk: 'Greyhawk',
  dark_sun: 'Dark Sun',
  spelljammer: 'Spelljammer',
  mystara: 'Mystara',
  planescape: 'Planescape',
  birthright: 'Birthright',
  nerath: 'Nerath',
  generic: 'Sin mundo concreto',
  multiple: 'Varios mundos',
  none: 'Fuera de los mundos de D&D',
}

export const kindNames: Record<ComicKind, string> = {
  ongoing: 'Serie regular',
  limited_series: 'Serie limitada',
  one_shot: 'Número único',
  graphic_novel: 'Novela gráfica',
  promotional: 'Cómic promocional',
  webcomic: 'Webcómic',
}

export const formatNames: Record<ComicFormat, string> = {
  paperback: 'Rústica',
  hardcover: 'Tapa dura',
  omnibus: 'Integral',
  digital: 'Digital',
  issue: 'Grapa',
}

export const spanishNames: Record<ComicSummary['spanish'], string> = {
  spain: 'En castellano',
  elsewhere: 'En español, no en España',
  none: 'Solo en inglés',
}

// Épocas del filtro: por la fecha del primer número
export type ComicEra = '1980s-1990s' | '2000s' | '2010s' | '2020s'

export const eraNames: Record<ComicEra, string> = {
  '1980s-1990s': 'Años ochenta y noventa',
  '2000s': '2000-2009',
  '2010s': '2010-2019',
  '2020s': 'Desde 2020',
}

export function eraOf(date: string): ComicEra {
  const year = Number(date.slice(0, 4))
  if (year < 2000) return '1980s-1990s'
  if (year < 2010) return '2000s'
  if (year < 2020) return '2010s'
  return '2020s'
}

// Editorial del filtro: la principal de cada ficha («IDW / Oni Press» cuenta como IDW)
export function publisherGroup(publisher: string): string {
  const first = publisher.split('/')[0].trim()
  return first.replace(/ Publishing$/, '').replace(/ Comics$/, '')
}

// Recuento de números de la tarjeta: «5 números», «1 número», «En curso»
export function issueCountLabel(comic: Pick<ComicSummary, 'issue_count' | 'announced' | 'kind'>) {
  if (comic.announced) return 'Anunciada'
  if (comic.kind === 'graphic_novel' || comic.issue_count === 1) return null
  return `${comic.issue_count} números`
}
