import clsx from 'clsx'
import type { MerchandiseWithMeta } from '@/types/merchandise'
import { hasLanguage, spanishNames } from '@/utils/merchandiseTranslations'

// Si hay edición en castellano y si salió en España; nada en artículos sin texto
export default function MerchandiseSpanishBadge({ item }: { item: MerchandiseWithMeta }) {
  if (!hasLanguage(item)) return null
  return (
    <span
      className={clsx('badge', {
        'badge-castellano': item.spanish === 'spain',
        'badge-english': item.spanish !== 'spain',
      })}
    >
      {spanishNames[item.spanish]}
    </span>
  )
}
