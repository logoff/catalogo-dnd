import { TrophyIcon } from '@heroicons/react/24/outline'
import { formatPartialDate } from '@/utils/videogameTranslations'
import type { NovelBestseller as Bestseller } from '@/types/novel'

const listNames = { hardcover: 'tapa dura', paperback: 'bolsillo' } as const

// Primera semana en la lista de superventas del NYT, con enlace a la fuente que lo demuestra
export default function NovelBestseller({ bestseller }: { bestseller: Bestseller }) {
  return (
    <a
      href={bestseller.source}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex min-h-11 items-center gap-2 text-sm text-muted transition-colors duration-150 hover:text-fg sm:min-h-0"
    >
      <TrophyIcon className="h-5 w-5" />
      <span>
        Superventas de The New York Times
        <span className="text-muted">
          {' '}
          · {formatPartialDate(bestseller.date.slice(0, 7))} ({listNames[bestseller.list]})
        </span>
      </span>
    </a>
  )
}
