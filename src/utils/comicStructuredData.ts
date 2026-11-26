import type { ComicWithMeta } from '@/types/comic'
import { SITE_URL } from './constants'

// Datos estructurados de schema.org para la ficha de una serie: ComicSeries con sus tomos como
// Book (los que tienen ISBN). Sin precios ni valoraciones.
export function comicStructuredData(comic: ComicWithMeta) {
  const people = (names?: string[]) => names?.map((name) => ({ '@type': 'Person', name }))
  return {
    '@context': 'https://schema.org',
    '@type': 'ComicSeries',
    name: comic.title,
    ...(comic.spanishTitle && comic.spanishTitle !== comic.title
      ? { alternateName: comic.spanishTitle }
      : {}),
    url: `${SITE_URL}/comic/${comic.slug}`,
    description: comic.description.split(/\n\s*\n/)[0],
    publisher: { '@type': 'Organization', name: comic.publisher },
    startDate: comic.date,
    ...(comic.end_date ? { endDate: comic.end_date } : {}),
    ...(comic.cover ? { image: `${SITE_URL}${comic.cover}` } : {}),
    ...(comic.writers ? { author: people(comic.writers) } : {}),
    ...(comic.artists ? { artist: people(comic.artists) } : {}),
    hasPart: comic.editions
      .filter((edition) => edition.isbn13)
      .map((edition) => ({
        '@type': 'Book',
        name: edition.title ?? comic.title,
        isbn: String(edition.isbn13),
        inLanguage: edition.language === 'castellano' ? 'es' : 'en',
        publisher: { '@type': 'Organization', name: edition.publisher },
        ...(edition.date ? { datePublished: edition.date } : {}),
      })),
  }
}
