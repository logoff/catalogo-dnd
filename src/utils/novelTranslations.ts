import type {
  NovelCountry,
  NovelFormat,
  NovelKind,
  NovelSetting,
  NovelSpanish,
} from '@/types/novel'

// En el orden en que se muestran en el filtro: de más a menos novelas
export const settingNames: Record<NovelSetting, string> = {
  forgotten_realms: 'Reinos Olvidados',
  dragonlance: 'Dragonlance',
  eberron: 'Eberron',
  ravenloft: 'Ravenloft',
  greyhawk: 'Greyhawk',
  mystara: 'Mystara',
  dark_sun: 'Dark Sun',
  spelljammer: 'Spelljammer',
  planescape: 'Planescape',
  birthright: 'Birthright',
  nerath: 'Nerath',
  generic: 'Sin mundo concreto',
}

export const kindNames: Record<NovelKind, string> = {
  novel: 'Novela',
  young_adult: 'Novela juvenil',
  middle_grade: 'Novela infantil',
  novella: 'Novela corta',
  short_story: 'Relato',
  fiction_guide: 'Guía narrativa',
}

export const formatNames: Record<NovelFormat, string> = {
  hardcover: 'Tapa dura',
  paperback: 'Rústica',
  mass_market: 'Bolsillo',
  ebook: 'Ebook',
  web: 'Web',
}

export const countryNames: Record<NovelCountry, string> = {
  us: 'Estados Unidos',
  uk: 'Reino Unido',
  ca: 'Canadá',
  au: 'Australia',
}

export const spanishNames: Record<NovelSpanish, string> = {
  spain: 'En castellano',
  elsewhere: 'En español, no en España',
  none: 'Solo en inglés',
}

// Nombre de una serie en el idioma del sitio
export function seriesName(series: { title: string; title_es?: string }): string {
  return series.title_es ?? series.title
}
