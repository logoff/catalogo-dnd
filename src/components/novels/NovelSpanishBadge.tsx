import type { NovelSpanish } from '@/types/novel'
import { spanishNames } from '@/utils/novelTranslations'
import { SpanishMark } from '@/components/ui/Badge'

// Si hay edición en castellano y si salió en España
export default function NovelSpanishBadge({ spanish }: { spanish: NovelSpanish }) {
  return <SpanishMark active={spanish === 'spain'}>{spanishNames[spanish]}</SpanishMark>
}
