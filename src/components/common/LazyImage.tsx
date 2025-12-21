import { useEffect, useRef, useState } from 'react'
import clsx from 'clsx'
import { getAssetPath } from '@/utils/constants'

// Cache de imágenes ya cargadas para evitar parpadeo en re-renders
const loadedCache = new Set<string>()

// Aplica getAssetPath solo a rutas locales (no URLs externas)
function resolveImageSrc(src: string): string {
  if (src.startsWith('http://') || src.startsWith('https://')) {
    return src
  }
  return getAssetPath(src)
}

interface LazyImageProps {
  src: string
  alt: string
  className?: string
  containerClassName?: string
}

export default function LazyImage({ src, alt, className, containerClassName }: LazyImageProps) {
  const resolvedSrc = resolveImageSrc(src)
  const [loaded, setLoaded] = useState(() => loadedCache.has(resolvedSrc))
  const imgRef = useRef<HTMLImageElement>(null)

  useEffect(() => {
    const img = imgRef.current
    if (!loaded && img?.complete && img?.naturalHeight > 0) {
      loadedCache.add(resolvedSrc)
      setLoaded(true)
    }
  }, [resolvedSrc, loaded])

  const handleLoad = () => {
    loadedCache.add(resolvedSrc)
    setLoaded(true)
  }

  return (
    <div className={clsx('relative overflow-hidden bg-dnd-stone-light', containerClassName)}>
      {/* Placeholder con animación pulse */}
      {!loaded && (
        <div className="absolute inset-0 bg-gradient-to-br from-dnd-stone-light to-dnd-stone animate-pulse" />
      )}

      <img
        ref={imgRef}
        src={resolvedSrc}
        alt={alt}
        loading="lazy"
        className={clsx(
          'transition-opacity duration-500 ease-out',
          loaded ? 'opacity-100' : 'opacity-0',
          className
        )}
        onLoad={handleLoad}
      />
    </div>
  )
}
