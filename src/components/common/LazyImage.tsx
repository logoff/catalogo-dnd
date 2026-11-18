import clsx from 'clsx'
import { resolveImageSrc } from '@/utils/imageResolver'

interface LazyImageProps {
  src: string
  alt: string
  className?: string
  containerClassName?: string
}

// Imagen con carga diferida sobre el fondo «well», que hace de hueco mientras llega
export default function LazyImage({ src, alt, className, containerClassName }: LazyImageProps) {
  return (
    <div className={clsx('relative overflow-hidden bg-well', containerClassName)}>
      <img src={resolveImageSrc(src)} alt={alt} loading="lazy" className={className} />
    </div>
  )
}
