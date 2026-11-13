// Lectura de las fichas de videojuegos para los scripts de vídeos y capturas
import { readFileSync, readdirSync, statSync } from 'fs'
import { join, dirname, relative } from 'path'
import { fileURLToPath } from 'url'

export const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..')
const VIDEOGAMES_DIR = join(ROOT, 'data', 'videogames', 'games')

function walk(dir) {
  return readdirSync(dir).flatMap((item) => {
    const path = join(dir, item)
    if (statSync(path).isDirectory()) return walk(path)
    return item.endsWith('.json') ? [path] : []
  })
}

// Misma ruta que videoThumbnail() en src/services/videogameLoader.ts
export function thumbnailPath(slug, youtube) {
  return join(ROOT, 'public', 'images', 'videogames', slug, `video-${youtube}.jpg`)
}

// Ruta del JSON de un juego a partir de su slug
export function gameFile(slug) {
  return walk(VIDEOGAMES_DIR).find((file) => file.endsWith(`/${slug}.json`))
}

export function allVideos() {
  return walk(VIDEOGAMES_DIR).flatMap((file) => {
    const game = JSON.parse(readFileSync(file, 'utf-8'))
    return (game.videos ?? []).map((video) => ({
      file: relative(ROOT, file),
      slug: game.slug,
      video,
    }))
  })
}
