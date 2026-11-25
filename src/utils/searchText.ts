// ISBN-13 de unas ediciones, como texto, para el texto de búsqueda de las fichas
export function isbnsOf(editions: { isbn13?: number }[]): string[] {
  return editions.flatMap((edition) => (edition.isbn13 ? [String(edition.isbn13)] : []))
}
