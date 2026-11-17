import type { NovelIndex, NovelSetting, NovelSummary } from '@/types/novel'
import { seriesName } from '@/utils/novelTranslations'
import orders from '../../data/novels/reading-orders.json'

// Un bloque es una serie entera (en su orden) o una lista de novelas sueltas con título propio
export interface ReadingOrderBlock {
  series?: string
  title?: string
  novels?: string[]
}

export type ReadingOrderId = keyof typeof orders

export const READING_ORDERS: Record<ReadingOrderId, ReadingOrderBlock[]> = orders

export interface ResolvedBlock {
  title: string
  // Para enlazar al listado filtrado por la serie
  seriesId?: string
  novels: NovelSummary[]
}

export function resolveReadingOrder(
  blocks: ReadingOrderBlock[],
  index: NovelIndex
): ResolvedBlock[] {
  return blocks.map((block) => {
    if (block.series) {
      const series = index.series.find((s) => s.id === block.series)!
      return {
        title: block.title ?? seriesName(series),
        seriesId: series.id,
        novels: index.novels
          .filter((n) => n.series?.id === block.series)
          .sort((a, b) => a.series!.number - b.series!.number),
      }
    }
    return {
      title: block.title!,
      novels: (block.novels ?? []).map((slug) => index.novels.find((n) => n.slug === slug)!),
    }
  })
}

export interface SpanishSeries {
  id: string
  name: string
  translated: NovelSummary[]
  total: number
}

export interface SpanishSetting {
  setting: NovelSetting
  series: SpanishSeries[]
  standalone: NovelSummary[]
}

const byNumber = (a: NovelSummary, b: NovelSummary) =>
  (a.series?.number ?? 0) - (b.series?.number ?? 0)

// Novelas con alguna edición en castellano, por mundo y serie, en el orden de los mundos dado
export function spanishNovelsBySetting(
  index: NovelIndex,
  settings: NovelSetting[]
): SpanishSetting[] {
  const translated = index.novels.filter((n) => n.spanish !== 'none')
  return settings
    .map((setting) => {
      const inSetting = translated.filter((n) => n.setting === setting)
      const series = index.series
        .filter((s) => inSetting.some((n) => n.series?.id === s.id))
        .map((s) => ({
          id: s.id,
          name: seriesName(s),
          translated: inSetting.filter((n) => n.series?.id === s.id).sort(byNumber),
          total: index.novels.filter((n) => n.series?.id === s.id).length,
        }))
      const standalone = inSetting
        .filter((n) => !n.series)
        .sort((a, b) => (a.titleEs ?? a.title).localeCompare(b.titleEs ?? b.title))
      return { setting, series, standalone }
    })
    .filter((group) => group.series.length > 0 || group.standalone.length > 0)
}
