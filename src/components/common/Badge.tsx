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
  const is2024 = edition === '5e24' || edition === '2024'

  return (
    <span
      className={clsx('badge', {
        'bg-amber-500/20 text-amber-300 border border-amber-500/40': !is2024,
        'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40': is2024,
      })}
    >
      {translateEdition(edition)}
    </span>
  )
}
