import clsx from 'clsx'

interface SkeletonProps {
  className?: string
}

export function Skeleton({ className }: SkeletonProps) {
  return <div className={clsx('animate-pulse bg-dnd-stone-light rounded', className)} />
}

export function ProductCardSkeleton() {
  return (
    <div className="card-dnd">
      {/* Image */}
      <Skeleton className="aspect-[3/4]" />

      {/* Content */}
      <div className="p-4">
        {/* Badges */}
        <div className="flex gap-1.5 mb-2">
          <Skeleton className="h-5 w-12" />
          <Skeleton className="h-5 w-16" />
          <Skeleton className="h-5 w-10" />
        </div>

        {/* Title */}
        <Skeleton className="h-6 w-full mb-1" />
        <Skeleton className="h-6 w-3/4 mb-2" />

        {/* Code */}
        <Skeleton className="h-4 w-16" />
      </div>
    </div>
  )
}

export function ProductListItemSkeleton() {
  return (
    <div className="card-dnd flex gap-4">
      {/* Image */}
      <Skeleton className="w-20 h-28 flex-shrink-0 rounded" />

      {/* Content */}
      <div className="flex-1 py-1">
        {/* Title */}
        <Skeleton className="h-6 w-3/4 mb-2" />

        {/* Code and date */}
        <Skeleton className="h-4 w-32 mb-2" />

        {/* Badges */}
        <div className="flex gap-1.5">
          <Skeleton className="h-5 w-12" />
          <Skeleton className="h-5 w-16" />
          <Skeleton className="h-5 w-10" />
        </div>
      </div>
    </div>
  )
}

interface ProductGridSkeletonProps {
  count?: number
  view?: 'grid' | 'list'
}

export function ProductGridSkeleton({ count = 10, view = 'grid' }: ProductGridSkeletonProps) {
  const items = Array.from({ length: count }, (_, i) => i)

  if (view === 'list') {
    return (
      <div className="flex flex-col gap-3">
        {items.map((i) => (
          <ProductListItemSkeleton key={i} />
        ))}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
      {items.map((i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  )
}
