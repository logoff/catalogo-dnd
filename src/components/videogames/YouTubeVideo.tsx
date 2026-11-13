import { useEffect, useRef, useState } from 'react'
import { PlayIcon } from '@heroicons/react/24/solid'
import type { VideoWithMeta } from '@/types/videogame'
import { resolveImageSrc } from '@/utils/imageResolver'
import { youtubeEmbedUrl, youtubeWatchUrl } from '@/utils/youtube'

// Vídeo con vista previa: hasta que el lector pulsa reproducir solo se ve la miniatura
// local, sin pedir nada a YouTube. Sin JavaScript, la miniatura enlaza al vídeo en YouTube.
export default function YouTubeVideo({ video }: { video: VideoWithMeta }) {
  const [playing, setPlaying] = useState(false)
  const iframeRef = useRef<HTMLIFrameElement>(null)

  // Quien navega con teclado sigue en el reproductor al cambiar la miniatura por él
  useEffect(() => {
    if (playing) iframeRef.current?.focus()
  }, [playing])

  return (
    <figure>
      <div className="relative aspect-video overflow-hidden rounded-lg bg-black shadow-card">
        {playing ? (
          <iframe
            ref={iframeRef}
            src={`${youtubeEmbedUrl(video.youtube)}?autoplay=1`}
            title={video.title}
            allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
            allowFullScreen
            // YouTube rechaza los vídeos empotrados sin cabecera Referer
            referrerPolicy="strict-origin-when-cross-origin"
            className="absolute inset-0 h-full w-full"
          />
        ) : (
          <a
            href={youtubeWatchUrl(video.youtube)}
            onClick={(event) => {
              event.preventDefault()
              setPlaying(true)
            }}
            onKeyDown={(event) => {
              if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault()
                setPlaying(true)
              }
            }}
            aria-label={`Reproducir «${video.title}»`}
            className="group absolute inset-0 block"
          >
            <img
              src={resolveImageSrc(video.thumbnail)}
              alt=""
              loading="lazy"
              className="h-full w-full object-cover transition-opacity group-hover:opacity-80"
            />
            <span className="absolute inset-0 flex items-center justify-center">
              <span className="flex h-16 w-16 items-center justify-center rounded-full bg-dnd-red/90 shadow-lg transition-transform group-hover:scale-110 group-focus-visible:scale-110">
                <PlayIcon className="ml-1 h-8 w-8 text-white" aria-hidden="true" />
              </span>
            </span>
          </a>
        )}
      </div>
      <figcaption className="mt-2 text-sm text-gray-300">
        <span className="font-semibold text-gray-100">{video.title}</span>
        <span className="text-gray-400"> · {video.channel}</span>
      </figcaption>
    </figure>
  )
}
