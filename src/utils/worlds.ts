// Mundos de D&D comunes a libros (5E y ediciones anteriores), novelas y videojuegos, con los mismos
// identificadores que las carpetas de novelas y el campo setting de los videojuegos. Las guías por
// ambientación se generan a partir de aquí
export const WORLDS = [
  'forgotten_realms',
  'dragonlance',
  'greyhawk',
  'ravenloft',
  'eberron',
  'spelljammer',
  'planescape',
  'dark_sun',
  'mystara',
  'birthright',
  'al_qadim',
  'kara_tur',
  'lankhmar',
  'nerath',
  'exandria',
  'ravnica',
  'theros',
  'strixhaven',
] as const

export type World = (typeof WORLDS)[number]

export const worldNames: Record<World, string> = {
  forgotten_realms: 'Reinos Olvidados',
  dragonlance: 'Dragonlance',
  greyhawk: 'Greyhawk',
  ravenloft: 'Ravenloft',
  eberron: 'Eberron',
  spelljammer: 'Spelljammer',
  planescape: 'Planescape',
  dark_sun: 'Dark Sun',
  mystara: 'Mystara',
  birthright: 'Birthright',
  al_qadim: 'Al-Qadim',
  kara_tur: 'Kara-Tur',
  lankhmar: 'Lankhmar',
  nerath: 'Nerath',
  exandria: 'Exandria',
  ravnica: 'Ravnica',
  theros: 'Theros',
  strixhaven: 'Strixhaven',
}
