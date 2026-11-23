// Lógica pura del informe mensual de Umami: el periodo, la clasificación de los clics por
// sección y el texto del mensaje de Telegram. La consulta a Umami y el envío están en
// send-umami-report.mjs.

export const TIME_ZONE = 'Europe/Madrid'
export const TOP = 10

const MONTHS = [
  'enero',
  'febrero',
  'marzo',
  'abril',
  'mayo',
  'junio',
  'julio',
  'agosto',
  'septiembre',
  'octubre',
  'noviembre',
  'diciembre',
]

// Desfase en milisegundos de la zona horaria respecto a UTC en un instante dado
function offsetAt(instant, timeZone) {
  const name = new Intl.DateTimeFormat('en-US', { timeZone, timeZoneName: 'longOffset' })
    .formatToParts(instant)
    .find((part) => part.type === 'timeZoneName').value
  const match = name.match(/GMT([+-])(\d{2}):(\d{2})/)
  if (!match) return 0
  const minutes = Number(match[2]) * 60 + Number(match[3])
  return (match[1] === '-' ? -1 : 1) * minutes * 60_000
}

// Medianoche del día 1 de un mes en la zona horaria, en milisegundos UTC
function monthStart(year, month, timeZone) {
  const utc = Date.UTC(year, month, 1)
  return utc - offsetAt(new Date(utc), timeZone)
}

// Mes natural anterior al instante dado (o el indicado como AAAA-MM), con sus límites en
// milisegundos para la API de Umami (endAt incluido, por eso se resta 1) y el del mes anterior
// para comparar
export function reportPeriod(now = new Date(), month, timeZone = TIME_ZONE) {
  let year, index
  if (month) {
    const match = month.match(/^(\d{4})-(\d{2})$/)
    if (!match || Number(match[2]) < 1 || Number(match[2]) > 12) {
      throw new Error(`mes no válido: ${month} (se espera AAAA-MM)`)
    }
    year = Number(match[1])
    index = Number(match[2]) - 1
  } else {
    const parts = new Intl.DateTimeFormat('en-CA', {
      timeZone,
      year: 'numeric',
      month: '2-digit',
    }).formatToParts(now)
    year = Number(parts.find((p) => p.type === 'year').value)
    index = Number(parts.find((p) => p.type === 'month').value) - 2
    if (index < 0) {
      index = 11
      year -= 1
    }
  }
  const range = (y, m) => {
    const startAt = monthStart(y, m, timeZone)
    const next = m === 11 ? monthStart(y + 1, 0, timeZone) : monthStart(y, m + 1, timeZone)
    return { startAt, endAt: next - 1 }
  }
  const previous = index === 0 ? [year - 1, 11] : [year, index - 1]
  return {
    label: `${MONTHS[index]} de ${year}`,
    current: range(year, index),
    previous: range(...previous),
  }
}

// Secciones del sitio según el dato que acompaña al evento «comprar»
export const SECTIONS = [
  { property: 'producto', label: 'Libros 5E' },
  { property: 'videojuego', label: 'Videojuegos' },
  { property: 'merchandising', label: 'Merchandising' },
  { property: 'novela', label: 'Novelas' },
  { property: 'rol', label: 'Otros juegos de rol' },
  { property: 'rol', label: 'Ediciones anteriores' },
]

// En «rol» el valor es «sistema/libro»; los sistemas de ediciones anteriores empiezan por «dnd-»
function belongsTo(section, value) {
  if (section.property !== 'rol') return true
  const edition = String(value).startsWith('dnd-')
  return section.label === 'Ediciones anteriores' ? edition : !edition
}

// Clics por sección a partir de los valores de cada dato ({ producto: [{ value, total }], … }),
// de más a menos, sin las secciones a cero
export function clicksBySection(valuesByProperty) {
  return SECTIONS.map((section) => ({
    label: section.label,
    total: (valuesByProperty[section.property] ?? [])
      .filter(({ value }) => belongsTo(section, value))
      .reduce((sum, { total }) => sum + Number(total), 0),
  }))
    .filter(({ total }) => total > 0)
    .sort((a, b) => b.total - a.total)
}

// Las cifras de /stats vienen como número (Umami 3) o como { value } (Umami 2)
export function statValue(stat) {
  if (stat === undefined || stat === null) return 0
  return Number(typeof stat === 'object' ? stat.value : stat) || 0
}

export function escapeHtml(text) {
  return String(text).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
}

const number = (n) => new Intl.NumberFormat('es-ES').format(n)

// Variación respecto al mes anterior, o nada si el mes anterior no hay datos
function change(current, previous) {
  if (!previous) return ''
  const percent = Math.round(((current - previous) / previous) * 100)
  return ` (${percent > 0 ? '+' : ''}${percent} %)`
}

function list(title, rows) {
  if (!rows.length) return [`<b>${title}</b>`, 'Sin datos']
  return [
    `<b>${title}</b>`,
    ...rows.map(({ label, total }) => `${number(total)} · ${escapeHtml(label)}`),
  ]
}

// Filas { x, y } de /metrics a { label, total }, las TOP primeras
export function topRows(metrics, empty = '(directo)') {
  return (metrics ?? [])
    .map(({ x, y }) => ({ label: x || empty, total: Number(y) }))
    .sort((a, b) => b.total - a.total)
    .slice(0, TOP)
}

// Texto del mensaje en el HTML que admite Telegram
export function formatReport({
  period,
  stats,
  previousStats,
  pages,
  referrers,
  events,
  stores,
  sections,
}) {
  const line = (label, key) => {
    const value = statValue(stats[key])
    return `${label}: ${number(value)}${change(value, statValue(previousStats[key]))}`
  }
  const eventTotal = (name) => Number(events.find(({ x }) => x === name)?.y ?? 0)
  const purchases = eventTotal('comprar')
  const downloads = eventTotal('descargar')
  return [
    `<b>Catálogo D&amp;D · ${period.label}</b>`,
    '',
    line('Visitantes', 'visitors'),
    line('Visitas', 'visits'),
    line('Páginas vistas', 'pageviews'),
    `Clics en «comprar»: ${number(purchases)}`,
    ...(downloads ? [`Descargas gratuitas: ${number(downloads)}`] : []),
    '',
    ...list('Páginas más vistas', pages),
    '',
    ...list('Procedencia', referrers),
    '',
    ...list('Clics en «comprar» por tienda', stores),
    '',
    ...list('Clics en «comprar» por sección', sections),
  ].join('\n')
}
