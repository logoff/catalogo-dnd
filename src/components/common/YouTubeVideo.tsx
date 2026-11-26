import { useEffect, useRef, useState } from 'react'
import { PlayIcon } from '@heroicons/react/24/solid'
import { resolveImageSrc } from '@/utils/imageResolver'
import { youtubeEmbedUrl, youtubeWatchUrl } from '@/utils/youtube'

// Lo que necesita el reproductor de un vídeo de cualquier sección (videojuegos, cine y series)
export interface PlayableVideo {
  youtube: string
  title: string
  channel: string
  // Miniatura local, para no pedir nada a YouTube antes de reproducir
  thumbnail: string
}

// Vídeo con vista previa: hasta que el lector pulsa reproducir solo se ve la miniatura
// local, sin pedir nada a YouTube. Sin JavaScript, la miniatura enlaza al vídeo en YouTube.
// `label` se añade al pie (por ejemplo, el idioma de un tráiler).
export default function YouTubeVideo({ video, label }: { video: PlayableVideo; label?: string }) {
  const [playing, setPlaying] = useState(false)
  const iframeRef = useRef<HTMLIFrameElement>(null)

  // Quien navega con teclado sigue en el reproductor al cambiar la miniatura por él
  useEffect(() => {
    if (playing) iframeRef.current?.focus()
  }, [playing])

  return (
    <figure>
      <div className="relative aspect-video overflow-hidden rounded-lg bg-black ">
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
              <span className="flex h-16 w-16 items-center justify-center rounded-full bg-accent-solid shadow-lg group-focus-visible:scale-110">
                <PlayIcon className="ml-1 h-8 w-8 text-white" aria-hidden="true" />
              </span>
            </span>
          </a>
        )}
      </div>
      <figcaption className="mt-2 text-sm text-fg">
        <span className="font-semibold text-fg">{video.title}</span>
        <span className="text-muted"> · {video.channel}</span>
        {label && <span className="text-muted"> · {label}</span>}
      </figcaption>
    </figure>
  )
}
