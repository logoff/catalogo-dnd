import type { VideogameWithMeta } from '@/types/videogame'
import { SITE_URL } from './constants'

export function youtubeWatchUrl(youtube: string): string {
  return `https://www.youtube.com/watch?v=${youtube}`
}

// Modo de privacidad mejorada de YouTube: no guarda cookies hasta que se reproduce
export function youtubeEmbedUrl(youtube: string): string {
  return `https://www.youtube-nocookie.com/embed/${youtube}`
}

// Datos estructurados de Schema.org de los vídeos de un juego, para los resultados de vídeo
export function videoStructuredData(game: VideogameWithMeta) {
  return game.videos.map((video) => ({
    '@context': 'https://schema.org',
    '@type': 'VideoObject',
    name: video.title,
    description: `Vídeo oficial de ${game.title}, publicado por ${video.channel}.`,
    thumbnailUrl: `${SITE_URL}${video.thumbnail}`,
    uploadDate: video.date,
    contentUrl: youtubeWatchUrl(video.youtube),
    embedUrl: youtubeEmbedUrl(video.youtube),
  }))
}
