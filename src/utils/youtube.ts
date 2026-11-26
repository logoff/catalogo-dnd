import type { VideogameWithMeta } from '@/types/videogame'
import { SITE_URL } from './constants'

export function youtubeWatchUrl(youtube: string): string {
  return `https://www.youtube.com/watch?v=${youtube}`
}

// Modo de privacidad mejorada de YouTube: no guarda cookies hasta que se reproduce
export function youtubeEmbedUrl(youtube: string): string {
  return `https://www.youtube-nocookie.com/embed/${youtube}`
}

interface VideoData {
  youtube: string
  title: string
  channel: string
  thumbnail: string
  date: string
}

// VideoObject de Schema.org de un vídeo de YouTube con su miniatura local
export function videoObject(video: VideoData, description: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'VideoObject',
    name: video.title,
    description,
    thumbnailUrl: `${SITE_URL}${video.thumbnail}`,
    uploadDate: video.date,
    contentUrl: youtubeWatchUrl(video.youtube),
    embedUrl: youtubeEmbedUrl(video.youtube),
  }
}

// Datos estructurados de Schema.org de los vídeos de un juego, para los resultados de vídeo
export function videoStructuredData(game: VideogameWithMeta) {
  return game.videos.map((video) =>
    videoObject(video, `Vídeo oficial de ${game.title}, publicado por ${video.channel}.`)
  )
}
