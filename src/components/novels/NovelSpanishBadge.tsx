import clsx from 'clsx'
import type { NovelSpanish } from '@/types/novel'
import { spanishNames } from '@/utils/novelTranslations'

// Si hay edición en castellano y si salió en España
export default function NovelSpanishBadge({ spanish }: { spanish: NovelSpanish }) {
  return (
    <span
      className={clsx('badge', {
        'badge-castellano': spanish === 'spain',
        'badge-english': spanish !== 'spain',
      })}
    >
      {spanishNames[spanish]}
    </span>
  )
}
