import { Link } from 'react-router-dom'
import type { MerchandiseWithMeta } from '@/types/merchandise'
import { kindNames } from '@/utils/merchandiseTranslations'
import LazyImage from '../common/LazyImage'
import MerchandiseSpanishBadge from './MerchandiseSpanishBadge'
import { cardClass } from '@/components/ui/styles'
import { CardBody } from '@/components/ui/Card'

interface MerchandiseCardProps {
  item: MerchandiseWithMeta
  view?: 'grid' | 'list'
}

export default function MerchandiseCard({ item, view = 'grid' }: MerchandiseCardProps) {
  const details = [kindNames[item.kind], item.year].filter(Boolean).join(' · ')

  if (view === 'list') {
    return (
      <Link
        to={`/merchandising/${item.slug}`}
        className="flex items-center gap-4 px-4 py-3 transition-colors duration-150 hover:bg-well"
      >
        {/* Fotos de producto sobre blanco en los dos temas: muchas traen el fondo blanco */}
        <LazyImage
          src={item.images[0]}
          alt=""
          containerClassName="aspect-square w-14 shrink-0 rounded bg-white"
          className="h-full w-full object-contain p-1"
        />
        <div className="flex min-w-0 flex-1 flex-col gap-1 sm:flex-row sm:items-center sm:gap-4">
          <div className="flex min-w-0 flex-1 flex-col gap-0.5">
            <h3 className="truncate text-[15px] font-semibold tracking-tight">{item.title}</h3>
            <p className="text-sm text-muted">{details}</p>
          </div>
          <div className="shrink-0 sm:w-56 sm:text-right">
            <MerchandiseSpanishBadge item={item} />
          </div>
        </div>
      </Link>
    )
  }

  return (
    <Link to={`/merchandising/${item.slug}`} className={cardClass(true, 'h-full')}>
      {/* Fotos de producto sobre blanco en los dos temas: muchas traen el fondo blanco */}
      <LazyImage
        src={item.images[0]}
        alt={item.title}
        containerClassName="aspect-square border-b border-line bg-white"
        className="h-full w-full object-contain p-4"
      />
      <CardBody>
        <p className="text-xs text-muted">{details}</p>
        <h3 className="line-clamp-3 text-[15px] leading-snug font-semibold tracking-tight">
          {item.title}
        </h3>
        <MerchandiseSpanishBadge item={item} />
      </CardBody>
    </Link>
  )
}
