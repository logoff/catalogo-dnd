export const BASE_PATH = import.meta.env.BASE_URL
export const SITE_NAME = 'Catálogo D&D 5E'
export const SITE_DESCRIPTION =
  'Catálogo completo de productos Dungeons & Dragons 5ª edición y 5.5 (2024)'
export const SITE_URL = 'https://logoff.github.io/catalogo-dnd'

export const PLACEHOLDER_IMAGE =
  'https://upload.wikimedia.org/wikipedia/commons/thumb/d/da/Imagen_no_disponible.svg/240px-Imagen_no_disponible.svg.png'

// Helper to get asset paths that work in both dev and prod
export const getAssetPath = (path: string) =>
  `${BASE_PATH}${path.startsWith('/') ? path.slice(1) : path}`

export const EDITIONS = ['5e', '2024'] as const
export const TYPES = ['book', 'boxed_set', 'accessory'] as const
export const LANGUAGES = ['english', 'castellano'] as const

// Subtipos agrupados por tipo de publicación
export const SUBTYPES_BY_TYPE = {
  book: [
    'core_rules',
    'supplemental_rules',
    'setting',
    'adventure',
    'rules_expansion',
    'player_expansion',
    'dungeon_master_expansion',
    'adventure_anthology',
    'gameplay_expansion',
    'adventure_expansion',
  ],
  boxed_set: ['starter_set', 'rules', 'adventure_setting', 'others'],
  accessory: ['character_sheet', 'screen'],
} as const

export const ALL_SUBTYPES = [
  ...SUBTYPES_BY_TYPE.book,
  ...SUBTYPES_BY_TYPE.boxed_set,
  ...SUBTYPES_BY_TYPE.accessory,
] as const
