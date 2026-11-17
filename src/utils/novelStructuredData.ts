import type { NovelEdition, NovelFormat, NovelIndex, NovelWithMeta } from '@/types/novel'
import { SITE_URL } from '@/utils/constants'
import { mainCover } from '@/utils/novels'
import { seriesName } from '@/utils/novelTranslations'

// Formatos de schema.org; las ediciones web no tienen equivalente
const BOOK_FORMATS: Partial<Record<NovelFormat, string>> = {
  hardcover: 'https://schema.org/Hardcover',
  paperback: 'https://schema.org/Paperback',
  mass_market: 'https://schema.org/Paperback',
  ebook: 'https://schema.org/EBook',
  audiobook: 'https://schema.org/AudiobookFormat',
}

const person = (name: string) => ({ '@type': 'Person', name })

function editionData(edition: NovelEdition, fallbackTitle: string) {
  return {
    '@type': 'Book',
    name: edition.title ?? fallbackTitle,
    inLanguage: edition.language === 'castellano' ? 'es' : 'en',
    publisher: { '@type': 'Organization', name: edition.publisher },
    ...(edition.date && { datePublished: edition.date }),
    ...(edition.format &&
      BOOK_FORMATS[edition.format] && {
        bookFormat: BOOK_FORMATS[edition.format],
      }),
    ...(edition.isbn13 && { isbn: String(edition.isbn13) }),
    ...(edition.narrators && { readBy: edition.narrators.map(person) }),
    ...(edition.cover && { image: `${SITE_URL}${edition.cover}` }),
  }
}

// Datos estructurados de la ficha: la obra, su serie y cada edición como workExample
export function novelStructuredData(novel: NovelWithMeta, index: NovelIndex) {
  const cover = mainCover(novel)
  const series = novel.series && index.series.find((s) => s.id === novel.series!.id)
  return {
    '@context': 'https://schema.org',
    '@type': 'Book',
    name: novel.title,
    ...(novel.titleEs && novel.titleEs !== novel.title && { alternateName: novel.titleEs }),
    url: `${SITE_URL}/novela/${novel.slug}`,
    author: novel.authors.map(person),
    description: novel.description.split(/\n\s*\n/)[0],
    inLanguage: 'en',
    ...(novel.date && { datePublished: novel.date }),
    ...(cover && { image: `${SITE_URL}${cover}` }),
    ...(series && {
      isPartOf: { '@type': 'BookSeries', name: seriesName(series) },
      position: novel.series!.number,
    }),
    workExample: novel.editions
      .filter((edition) => edition.format !== 'web')
      .map((edition) => editionData(edition, novel.title)),
  }
}
