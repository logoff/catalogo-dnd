// Comprueba que los enlaces de las reseñas de los libros siguen vivos. Solo da por roto un 404,
// un 410, una redirección a la portada del medio o un dominio que no responde: los 403 y 429
// (Cloudflare, límites de peticiones), los 5xx y los tiempos agotados se cuentan como no
// comprobados. Si no responde ninguna, es que no hay red, y se da un único aviso. Solo avisa: termina siempre con código 0
// para no bloquear la build. En GitHub Actions los avisos salen como anotaciones.
import { allReviews } from './reviews.mjs'

const inActions = process.env.GITHUB_ACTIONS === 'true'
const USER_AGENT =
  'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0 Safari/537.36'
const CONCURRENCY = 4

function warn(file, message) {
  console.log(inActions ? `::warning file=${file}::${message}` : `⚠ ${file}: ${message}`)
}

// 'ok', 'broken', 'unchecked' o, si no hay respuesta (dominio inexistente, sin red), el error
async function check({ review }) {
  let response
  try {
    response = await fetch(review.url, {
      headers: { 'User-Agent': USER_AGENT, Accept: 'text/html' },
      redirect: 'follow',
      signal: AbortSignal.timeout(20_000),
    })
  } catch (error) {
    return error.name === 'TimeoutError' ? 'unchecked' : error
  }
  response.body?.cancel()

  if (response.status === 404 || response.status === 410) return `ya no existe (${response.status})`
  if (!response.ok) return 'unchecked'
  if (new URL(response.url).pathname === '/' && new URL(review.url).pathname !== '/') {
    return 'redirige a la portada del medio'
  }
  return 'ok'
}

const reviews = allReviews()
const results = new Map()
const queue = [...reviews]
const worker = async () => {
  for (let entry = queue.shift(); entry; entry = queue.shift()) {
    results.set(entry, await check(entry))
  }
}
await Promise.all(Array.from({ length: CONCURRENCY }, worker))

const failed = [...results.values()].filter((result) => result instanceof Error)
if (reviews.length && failed.length === reviews.length) {
  // Sin red no se sabe nada: un único aviso y adelante
  const message = `no se han podido comprobar las reseñas: ${failed[0].cause?.code ?? failed[0].message}`
  console.log(inActions ? `::warning::${message}` : `⚠ ${message}`)
} else {
  let broken = 0
  let unchecked = 0
  for (const [{ file, review }, result] of results) {
    if (result === 'ok') continue
    if (result === 'unchecked') unchecked++
    else {
      broken++
      const problem =
        result instanceof Error ? `no responde (${result.cause?.code ?? result.message})` : result
      warn(file, `la reseña ${review.url} ${problem}`)
    }
  }
  const total = `${reviews.length} ${reviews.length === 1 ? 'reseña' : 'reseñas'}`
  const extra = unchecked ? `, ${unchecked} sin poder comprobar` : ''
  console.log(broken ? `${broken} avisos en ${total}${extra}` : `${total} sin avisos${extra}`)
}
