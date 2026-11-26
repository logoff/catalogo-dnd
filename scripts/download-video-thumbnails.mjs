// Descarga de YouTube las miniaturas de los vídeos de los videojuegos y los tráileres de cine y
// series que aún no están en public/images/{videogames,screen}/<slug>/video-<id>.jpg. Las que
// ya existen no se tocan.
// La ficha sirve siempre la copia local: así no pide nada a YouTube antes de reproducir.
import { existsSync, mkdirSync, writeFileSync } from 'fs'
import { dirname, relative } from 'path'
import { ROOT, allVideos, thumbnailPath } from './videogames.mjs'
import { allTrailers } from './screen.mjs'

// maxresdefault (1280×720) no existe en todos los vídeos; hqdefault (480×360) sí
const SIZES = ['maxresdefault', 'hqdefault']

async function download(youtube) {
  for (const size of SIZES) {
    const response = await fetch(`https://i.ytimg.com/vi/${youtube}/${size}.jpg`)
    if (response.ok) return Buffer.from(await response.arrayBuffer())
  }
  return null
}

let downloaded = 0
let failed = 0

const entries = [
  ...allVideos().map((entry) => ({
    ...entry,
    thumbnail: thumbnailPath(entry.slug, entry.video.youtube),
  })),
  ...allTrailers(),
]

for (const { file, video, thumbnail: path } of entries) {
  if (existsSync(path)) continue

  const image = await download(video.youtube)
  if (!image) {
    console.error(`✗ ${file}: no hay miniatura para ${video.youtube}`)
    failed++
    continue
  }
  mkdirSync(dirname(path), { recursive: true })
  writeFileSync(path, image)
  console.log(`✓ ${relative(ROOT, path)}`)
  downloaded++
}

console.log(
  downloaded ? `Miniaturas descargadas: ${downloaded}` : 'Todas las miniaturas están al día'
)
if (failed) process.exit(1)
