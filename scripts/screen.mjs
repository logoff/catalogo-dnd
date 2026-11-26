// Lectura de las fichas de cine y series para los scripts de tráileres y carteles
import { readFileSync, readdirSync, statSync } from 'fs'
import { join, relative } from 'path'
import { ROOT } from './videogames.mjs'

export const SCREEN_DIR = join(ROOT, 'data', 'screen')

// JSON de las obras: data/screen/<tipo>/<slug>.json
export function screenFiles() {
  return readdirSync(SCREEN_DIR)
    .map((item) => join(SCREEN_DIR, item))
    .filter((path) => statSync(path).isDirectory())
    .flatMap((dir) =>
      readdirSync(dir)
        .filter((file) => file.endsWith('.json'))
        .map((file) => join(dir, file))
    )
}

// Ruta del JSON de una obra a partir de su slug
export function screenFile(slug) {
  return screenFiles().find((file) => file.endsWith(`/${slug}.json`))
}

// Misma ruta que trailerThumbnail() en src/services/screenLoader.ts
export function trailerThumbnailPath(slug, youtube) {
  return join(ROOT, 'public', 'images', 'screen', slug, `video-${youtube}.jpg`)
}

// Tráileres de todas las obras, con la ruta del JSON y la de su miniatura local
export function allTrailers() {
  return screenFiles().flatMap((file) => {
    const work = JSON.parse(readFileSync(file, 'utf-8'))
    return (work.trailers ?? []).map((video) => ({
      file: relative(ROOT, file),
      slug: work.slug,
      video,
      thumbnail: trailerThumbnailPath(work.slug, video.youtube),
    }))
  })
}
