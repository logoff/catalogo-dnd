import type { MerchandiseWithMeta } from '@/types/merchandise'
import { hasLanguage, spanishNames } from '@/utils/merchandiseTranslations'
import { SpanishMark } from '@/components/ui/Badge'

// Si hay edición en castellano y si salió en España; nada en artículos sin texto
export default function MerchandiseSpanishBadge({ item }: { item: MerchandiseWithMeta }) {
  if (!hasLanguage(item)) return null
  return <SpanishMark active={item.spanish === 'spain'}>{spanishNames[item.spanish]}</SpanishMark>
}
