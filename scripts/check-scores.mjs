// Comprueba que las notas de Metacritic y OpenCritic guardadas siguen coincidiendo con las que
// publica cada agregador (aggregateRating del JSON-LD de su página) y que el enlace sigue vivo.
// En Metacritic el JSON-LD solo trae la nota de la plataforma principal, así que de cada URL se
// compara solo la primera nota; de las demás se comprueba el enlace. Los 403, 429, 5xx, tiempos
// agotados y páginas sin nota se cuentan como no comprobados. Si no responde ninguna URL, es que
// no hay red, y se da un único aviso. Termina siempre con código 0 para no bloquear la build.
import { allScores } from './videogames.mjs'

const inActions = process.env.GITHUB_ACTIONS === 'true'
const USER_AGENT =
  'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0 Safari/537.36'
const CONCURRENCY = 4

function warn(file, message) {
  console.log(inActions ? `::warning file=${file}::${message}` : `⚠ ${file}: ${message}`)
}

// Nota publicada en el JSON-LD, o null si no aparece
function publishedScore(html) {
  for (const [, json] of html.matchAll(
    /<script[^>]*application\/ld\+json[^>]*>([\s\S]*?)<\/script>/g
  )) {
    const match = json.match(/"aggregateRating"[\s\S]*?"ratingValue"\s*:\s*"?([\d.]+)/)
    if (match) return Number(match[1])
  }
  return null
}

// 'ok', 'unchecked', un mensaje de aviso o, si no hay respuesta, el error
async function check({ url, entries }) {
  let response
  try {
    response = await fetch(url, {
      headers: { 'User-Agent': USER_AGENT, Accept: 'text/html' },
      signal: AbortSignal.timeout(20_000),
    })
  } catch (error) {
    return error.name === 'TimeoutError' ? 'unchecked' : error
  }
  if (response.status === 404 || response.status === 410) {
    response.body?.cancel()
    return `la página ${url} ya no existe (${response.status})`
  }
  if (!response.ok) {
    response.body?.cancel()
    return 'unchecked'
  }
  const score = publishedScore(await response.text())
  if (score === null) return 'unchecked'
  const saved = entries[0].review.score
  return score === saved ? 'ok' : `la nota de ${url} es ${score}, no ${saved}`
}

// Agrupadas por URL: la primera nota de cada URL es la de la plataforma principal
const groups = new Map()
for (const entry of allScores()) {
  const group = groups.get(entry.review.url) ?? { url: entry.review.url, entries: [] }
  group.entries.push(entry)
  groups.set(entry.review.url, group)
}

const results = new Map()
const queue = [...groups.values()]
const worker = async () => {
  for (let group = queue.shift(); group; group = queue.shift()) {
    results.set(group, await check(group))
  }
}
await Promise.all(Array.from({ length: CONCURRENCY }, worker))

const failed = [...results.values()].filter((result) => result instanceof Error)
if (groups.size && failed.length === groups.size) {
  const reason = failed[0].cause?.code ?? failed[0].message
  const message = `no se han podido comprobar las notas: ${reason}`
  console.log(inActions ? `::warning::${message}` : `⚠ ${message}`)
} else {
  let warnings = 0
  let unchecked = 0
  for (const [{ url, entries }, result] of results) {
    if (result === 'ok') continue
    if (result === 'unchecked') unchecked++
    else {
      warnings++
      const reason = result.cause?.code ?? result.message
      warn(entries[0].file, result instanceof Error ? `${url} no responde (${reason})` : result)
    }
  }
  const total = `${groups.size} ${groups.size === 1 ? 'página' : 'páginas'}`
  const extra = unchecked ? `, ${unchecked} sin poder comprobar` : ''
  console.log(warnings ? `${warnings} avisos en ${total}${extra}` : `${total} sin avisos${extra}`)
}
