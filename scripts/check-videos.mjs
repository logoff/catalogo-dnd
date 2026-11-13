// Comprueba con el oEmbed de YouTube (sin clave de API) que los vídeos de las fichas siguen
// disponibles, se pueden empotrar y son del canal anotado. Solo avisa: termina siempre con
// código 0 para no bloquear la build. En GitHub Actions los avisos salen como anotaciones.
import { allVideos } from './videogames.mjs'

const inActions = process.env.GITHUB_ACTIONS === 'true'

function warn(file, message) {
  console.log(inActions ? `::warning file=${file}::${message}` : `⚠ ${file}: ${message}`)
}

async function check({ file, video }) {
  const url = `https://www.youtube.com/oembed?format=json&url=${encodeURIComponent(
    `https://www.youtube.com/watch?v=${video.youtube}`
  )}`
  const response = await fetch(url)

  if (response.status === 401 || response.status === 403) {
    warn(file, `el vídeo ${video.youtube} ya no se puede empotrar`)
    return false
  }
  if (!response.ok) {
    warn(file, `el vídeo ${video.youtube} no está disponible (retirado o privado)`)
    return false
  }
  const { author_name: author } = await response.json()
  if (author !== video.channel) {
    warn(file, `el vídeo ${video.youtube} es del canal «${author}», no de «${video.channel}»`)
    return false
  }
  return true
}

const videos = allVideos()
let problems = 0

try {
  for (const entry of videos) {
    if (!(await check(entry))) problems++
  }
  const total = `${videos.length} ${videos.length === 1 ? 'vídeo' : 'vídeos'}`
  console.log(problems ? `${problems} avisos en ${total}` : `${total} sin avisos`)
} catch (error) {
  // Sin red o con YouTube caído no se sabe nada: un único aviso y adelante
  const message = `no se han podido comprobar los vídeos: ${error.cause?.code ?? error.message}`
  console.log(inActions ? `::warning::${message}` : `⚠ ${message}`)
}
