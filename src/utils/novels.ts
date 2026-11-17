// Lógica pura de novelas, sin import.meta.glob: la usan el loader del navegador y el plugin de
// Vite que genera el índice del listado en Node (por eso las importaciones son relativas)
import type {
  Novel,
  NovelAnthology,
  NovelCollection,
  NovelEdition,
  NovelIndex,
  NovelSeries,
  NovelSpanish,
  NovelSummary,
  NovelWithMeta,
} from '../types/novel.ts'
import { normalize } from './videogameFilters.ts'

// Recopilatorios de cualquier serie que contienen la novela
export function collectionsIn(series: NovelSeries[], slug: string): NovelCollection[] {
  return series.flatMap((s) =>
    (s.collections ?? []).filter((collection) => collection.novels.includes(slug))
  )
}

// Antologías relacionadas con una novela: por su serie o por la propia novela
export function anthologiesFor(anthologies: NovelAnthology[], novel: Novel): NovelAnthology[] {
  return anthologies.filter(
    (anthology) =>
      anthology.novels?.includes(novel.slug) ||
      (novel.series && anthology.series?.includes(novel.series.id))
  )
}

function spanishOf(novel: Novel, collections: NovelCollection[]): NovelSpanish {
  const spanish = [...novel.editions, ...collections].filter((e) => e.language === 'castellano')
  if (spanish.some((edition) => edition.spain)) return 'spain'
  return spanish.length > 0 ? 'elsewhere' : 'none'
}

function byDateDesc<T extends { date?: string }>(a: T, b: T): number {
  return (b.date ?? '').localeCompare(a.date ?? '')
}

// Título de la edición en castellano más reciente; las ediciones sin título propio no cuentan
function titleEsOf(novel: Novel): string | null {
  const spanish = novel.editions
    .filter((edition) => edition.language === 'castellano' && edition.title)
    .sort(byDateDesc)
  return spanish[0]?.title ?? null
}

export function enrichNovel(novel: Novel, collections: NovelCollection[]): NovelWithMeta {
  const spanishTitles = [
    ...(novel.title_es ? [novel.title_es] : []),
    ...novel.editions
      .filter((edition) => edition.language === 'castellano' && edition.title)
      .map((edition) => edition.title!),
  ]
  return {
    ...novel,
    year: novel.date ? Number(novel.date.slice(0, 4)) : null,
    titleEs: novel.title_es ?? titleEsOf(novel),
    spanish: spanishOf(novel, collections),
    availableToBuy: [...novel.editions, ...collections].some(
      (edition) => (edition.purchase_links ?? []).length > 0
    ),
    searchText: normalize(
      [...new Set([novel.title, ...spanishTitles, ...novel.authors])].join(' | ')
    ),
  }
}

// Portada que representa a la novela: la de la edición en castellano más reciente que la
// tenga y, si no, la de la inglesa más reciente; la de un audiolibro, solo si no hay otra
export function mainCover(novel: Novel): string | null {
  const withCover = (language: NovelEdition['language'], audiobook = false) =>
    novel.editions
      .filter((e) => e.language === language && e.cover && (e.format === 'audiobook') === audiobook)
      .sort(byDateDesc)[0]?.cover
  return (
    withCover('castellano') ??
    withCover('english') ??
    withCover('castellano', true) ??
    withCover('english', true) ??
    null
  )
}

export function thumbnailOf(cover: string): string {
  return cover.replace(/\.webp$/, '-thumb.webp')
}

// De la más reciente a la más antigua; las que no tienen fecha, al final
export function compareByDate(a: Pick<Novel, 'date' | 'title'>, b: Pick<Novel, 'date' | 'title'>) {
  return (b.date ?? '').localeCompare(a.date ?? '') || a.title.localeCompare(b.title)
}

export function summarize(novel: NovelWithMeta): NovelSummary {
  const cover = mainCover(novel)
  return {
    slug: novel.slug,
    title: novel.title,
    titleEs: novel.titleEs,
    authors: novel.authors,
    setting: novel.setting,
    kind: novel.kind,
    series: novel.series,
    date: novel.date,
    year: novel.year,
    thumbnail: cover ? thumbnailOf(cover) : null,
    spanish: novel.spanish,
    availableToBuy: novel.availableToBuy,
    searchText: novel.searchText,
  }
}

// Lo que necesitan el listado y la lista de la serie: sin descripciones ni ediciones
export function buildNovelIndex(novels: Novel[], series: NovelSeries[]): NovelIndex {
  return {
    novels: novels
      .map((novel) => summarize(enrichNovel(novel, collectionsIn(series, novel.slug))))
      .sort(compareByDate),
    series: series.map((s) => ({
      id: s.id,
      title: s.title,
      title_es: s.title_es,
      setting: s.setting,
    })),
  }
}
