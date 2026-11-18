import type { Language, PublicationType } from '@/types'
import { translateLanguage, translateType, translateEdition } from '@/utils/translations'
import Badge from '@/components/ui/Badge'

interface LanguageBadgeProps {
  language: Language
}

export function LanguageBadge({ language }: LanguageBadgeProps) {
  return (
    <Badge variant={language === 'castellano' ? 'accent' : 'neutral'}>
      {translateLanguage(language)}
    </Badge>
  )
}

interface TypeBadgeProps {
  type: PublicationType
}

export function TypeBadge({ type }: TypeBadgeProps) {
  return <Badge variant="outline">{translateType(type)}</Badge>
}

interface EditionBadgeProps {
  edition: string
}

export function EditionBadge({ edition }: EditionBadgeProps) {
  return <Badge mono>{translateEdition(edition)}</Badge>
}
