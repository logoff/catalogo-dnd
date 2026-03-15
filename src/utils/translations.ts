import type { PublicationType, PublicationSubtype, Language } from '@/types'

const subtypeTranslations: Record<PublicationType, Partial<Record<PublicationSubtype, string>>> = {
  book: {
    core_rules: 'Libro básico',
    supplemental_rules: 'Expansión del reglamento',
    setting: 'Escenario de campaña',
    adventure: 'Aventura',
    rules_expansion: 'Expansión del reglamento',
    player_expansion: 'Expansión del jugador',
    dungeon_master_expansion: 'Expansión del Dungeon Master',
    adventure_anthology: 'Antología de aventuras',
  },
  boxed_set: {
    starter_set: 'Caja de inicio',
    rules: 'Set de regalo de los reglamentos básicos',
    adventure_setting: 'Colección de campaña',
    others: 'Otro',
  },
  accessory: {
    character_sheet: 'Hoja de personaje',
    screen: 'Pantalla del Dungeon Master',
  },
}

// Traducciones de subtipo sin contexto de tipo (para filtros)
const standaloneSubtypeTranslations: Record<PublicationSubtype, string> = {
  // Books
  core_rules: 'Reglas básicas',
  supplemental_rules: 'Expansión de reglas',
  setting: 'Escenario de campaña',
  adventure: 'Aventura',
  rules_expansion: 'Expansión de reglas (2024)',
  player_expansion: 'Expansión del jugador',
  dungeon_master_expansion: 'Expansión del DM',
  adventure_anthology: 'Antología de aventuras',
  // Boxed sets
  starter_set: 'Caja de inicio',
  rules: 'Set de regalo',
  adventure_setting: 'Colección de campaña',
  others: 'Otros',
  // Accessories
  character_sheet: 'Hoja de personaje',
  screen: 'Pantalla del DM',
}

const typeTranslations: Record<PublicationType, string> = {
  book: 'Libro',
  boxed_set: 'Caja',
  accessory: 'Accesorio',
}

const languageTranslations: Record<Language, string> = {
  english: 'Inglés',
  castellano: 'Castellano',
}

export function translateSubtype(type: PublicationType, subtype: PublicationSubtype): string {
  return subtypeTranslations[type]?.[subtype] ?? subtype
}

export function translateSubtypeStandalone(subtype: PublicationSubtype): string {
  return standaloneSubtypeTranslations[subtype] ?? subtype
}

export function translateType(type: PublicationType): string {
  return typeTranslations[type] ?? type
}

export function translateLanguage(language: Language): string {
  return languageTranslations[language] ?? language
}

export function translateEdition(edition: string): string {
  return edition === '5e' ? '5E (2014)' : '5.5E (2024)'
}

export function translateEditionLong(edition: string): string {
  return edition === '5e' ? 'D&D 5E (2014)' : 'D&D 5.5E (2024)'
}

// Category translations for navigation
export const categoryTranslations: Record<string, string> = {
  // 2014
  '01_books': 'Libros',
  '01_core_rules': 'Libros básicos',
  '02_supplemental_rules': 'Expansiones del reglamento',
  '03_settings': 'Escenarios de campaña',
  '04_adventures': 'Aventuras',
  '02_boxed_sets': 'Cajas',
  '01_starter_sets': 'Cajas de inicio',
  '02_adventure_settings': 'Colecciones de campaña',
  '03_others': 'Otros',
  // 2024
  '02_rules_expansion': 'Expansiones del reglamento',
  '03_player_expansion': 'Expansiones del jugador',
  '04_dungeon_master_expansion': 'Expansiones del DM',
  '06_adventure_anthology': 'Antologías de aventuras',
  '02_accessories': 'Accesorios',
  '01_screens': 'Pantallas',
  '02_character_sheets': 'Hojas de personaje',
  '03_boxed_sets': 'Cajas',
}

export function translateCategory(category: string): string {
  return categoryTranslations[category] ?? category.replace(/_/g, ' ').replace(/^\d+_/, '')
}
