// Informe mensual de Umami: consulta la API del Umami propio y envía un resumen del mes anterior
// a un chat privado de Telegram. El repositorio es público y los registros de Actions también,
// así que en Actions nunca se escriben los datos en la salida: solo si se ha enviado o no.
//
// Variables: UMAMI_URL, UMAMI_WEBSITE_ID, UMAMI_USERNAME, UMAMI_PASSWORD, TELEGRAM_BOT_TOKEN y
// TELEGRAM_CHAT_ID. Opciones: --month AAAA-MM para otro mes y --dry-run para ver el mensaje en
// la terminal sin enviarlo (no se permite en Actions).
import {
  SECTIONS,
  TIME_ZONE,
  clicksBySection,
  formatReport,
  reportPeriod,
  topRows,
} from './umami-report.mjs'

const inActions = process.env.GITHUB_ACTIONS === 'true'
const args = process.argv.slice(2)
const dryRun = args.includes('--dry-run')
const monthIndex = args.indexOf('--month')
const month = monthIndex >= 0 ? args[monthIndex + 1] : undefined

function fail(message) {
  console.log(inActions ? `::error::${message}` : `✗ ${message}`)
  process.exit(1)
}

if (dryRun && inActions) fail('--dry-run no se permite en Actions: los registros son públicos')

const required = ['UMAMI_URL', 'UMAMI_WEBSITE_ID', 'UMAMI_USERNAME', 'UMAMI_PASSWORD']
if (!dryRun) required.push('TELEGRAM_BOT_TOKEN', 'TELEGRAM_CHAT_ID')
const missing = required.filter((name) => !process.env[name])
if (missing.length) fail(`faltan variables: ${missing.join(', ')}`)

const base = process.env.UMAMI_URL.replace(/\/$/, '')
const website = process.env.UMAMI_WEBSITE_ID

// Los mensajes de error solo llevan la ruta y el código, nunca la respuesta ni la consulta
async function request(path, options = {}) {
  const response = await fetch(`${base}/api${path}`, {
    ...options,
    headers: { Accept: 'application/json', ...options.headers },
    signal: AbortSignal.timeout(30_000),
  })
  if (!response.ok) {
    response.body?.cancel()
    const error = new Error(`Umami respondió ${response.status} en ${path.split('?')[0]}`)
    error.status = response.status
    throw error
  }
  return response.json()
}

const { token } = await request('/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    username: process.env.UMAMI_USERNAME,
    password: process.env.UMAMI_PASSWORD,
  }),
}).catch((error) => fail(`no se ha podido iniciar sesión en Umami: ${error.message}`))

const auth = { Authorization: `Bearer ${token}` }
const get = (path, range, params = {}) =>
  request(
    `/websites/${website}${path}?${new URLSearchParams({
      startAt: String(range.startAt),
      endAt: String(range.endAt),
      timezone: TIME_ZONE,
      ...params,
    })}`,
    { headers: auth }
  )

// Umami 2 antiguo llamaba «url» a las rutas; los nuevos, «path»
async function pageMetrics(range) {
  try {
    return await get('/metrics', range, { type: 'path', limit: '50' })
  } catch (error) {
    if (error.status !== 400) throw error
    return get('/metrics', range, { type: 'url', limit: '50' })
  }
}

const eventValues = (range, propertyName) =>
  get('/event-data/values', range, { eventName: 'comprar', propertyName })

const period = reportPeriod(new Date(), month)
const { current, previous } = period

let report
try {
  const properties = [...new Set(SECTIONS.map((s) => s.property))]
  const [stats, previousStats, pages, referrers, events, stores, ...values] = await Promise.all([
    get('/stats', current),
    get('/stats', previous),
    pageMetrics(current),
    get('/metrics', current, { type: 'referrer', limit: '50' }),
    get('/metrics', current, { type: 'event', limit: '50' }),
    eventValues(current, 'tienda'),
    ...properties.map((property) => eventValues(current, property)),
  ])
  report = formatReport({
    period,
    stats,
    previousStats,
    pages: topRows(pages),
    referrers: topRows(referrers),
    events,
    stores: topRows(stores.map(({ value, total }) => ({ x: value, y: total }))),
    sections: clicksBySection(Object.fromEntries(properties.map((p, i) => [p, values[i]]))),
  })
} catch (error) {
  fail(`no se ha podido preparar el informe: ${error.message}`)
}

if (dryRun) {
  console.log(report)
  process.exit(0)
}

const telegram = await fetch(
  `https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMessage`,
  {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      chat_id: process.env.TELEGRAM_CHAT_ID,
      text: report,
      parse_mode: 'HTML',
      disable_web_page_preview: true,
    }),
    signal: AbortSignal.timeout(30_000),
  }
).catch((error) => fail(`no se ha podido contactar con Telegram: ${error.name}`))

if (!telegram.ok) {
  telegram.body?.cancel()
  fail(`Telegram respondió ${telegram.status}`)
}
console.log(`Informe de ${period.label} enviado`)
