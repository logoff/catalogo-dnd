import type {
  MerchandiseGroup,
  MerchandiseKind,
  MerchandiseSpanish,
  MerchandiseWithMeta,
} from '@/types/merchandise'

export const groupNames: Record<MerchandiseGroup, string> = {
  books: 'Libros licenciados',
  figures: 'Figuras y juguetes',
  games: 'Juegos de mesa y cartas',
}

export const kindNames: Record<MerchandiseKind, string> = {
  cookbook: 'Libro de cocina',
  craft_book: 'Manualidades',
  art_book: 'Libro de arte',
  guide_book: 'Guía ilustrada',
  funko: 'Funko',
  lego: 'LEGO',
  figure: 'Figura',
  plush: 'Peluche',
  collectible_miniature: 'Miniatura de coleccionista',
  board_game: 'Juego de mesa',
  card_game: 'Juego de cartas',
}

// Tipos de cada grupo, en el orden en que se muestran
export const kindsByGroup: Record<MerchandiseGroup, MerchandiseKind[]> = {
  books: ['cookbook', 'craft_book', 'art_book', 'guide_book'],
  figures: ['funko', 'lego', 'figure', 'plush', 'collectible_miniature'],
  games: ['board_game', 'card_game'],
}

export const spanishNames: Record<MerchandiseSpanish, string> = {
  spain: 'En castellano',
  elsewhere: 'En español, no en España',
  none: 'Solo en inglés',
}

// Los artículos sin texto (figuras, LEGO) no llevan marca de idioma
export function hasLanguage(item: MerchandiseWithMeta): boolean {
  return item.editions.some((edition) => edition.language)
}
