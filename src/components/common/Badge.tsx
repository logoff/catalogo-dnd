import clsx from 'clsx'
import type { Language, PublicationType } from '@/types'
import { translateLanguage, translateType, translateEdition } from '@/utils/translations'

interface LanguageBadgeProps {
  language: Language
}

export function LanguageBadge({ language }: LanguageBadgeProps) {
  return (
    <span
      className={clsx('badge', {
        'badge-english': language === 'english',
        'badge-castellano': language === 'castellano',
      })}
    >
      {translateLanguage(language)}
    </span>
  )
}

interface TypeBadgeProps {
  type: PublicationType
}

export function TypeBadge({ type }: TypeBadgeProps) {
  return (
    <span
      className={clsx('badge', {
        'badge-book': type === 'book',
        'badge-boxed-set': type === 'boxed_set',
        'badge-accessory': type === 'accessory',
      })}
    >
      {translateType(type)}
    </span>
  )
}

interface EditionBadgeProps {
  edition: string
}

export function EditionBadge({ edition }: EditionBadgeProps) {
  return (
    <span className="badge bg-dnd-gold/20 text-dnd-gold border border-dnd-gold/40">
      {translateEdition(edition)}
    </span>
  )
}
