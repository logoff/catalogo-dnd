// Resumen mensual del catálogo: qué cambió en data/ entre el principio y el final de un mes. Lógica
// pura: recibe los archivos que cambiaron con su JSON de antes y de después (los lee
// git-history.mjs) y la usa el módulo virtual:monthly-summaries de vite.config.ts.
import { describeFicha, fichaKind, fullDate } from './releases.mjs'

// Primer mes con resumen: el del alta del catálogo
export const FIRST_MONTH = '2026-11'
// Cuántas fichas de ejemplo por sección y cuántas reseñas se enseñan
export const EXAMPLES = 10
// Tope de ediciones y fechas en castellano (normalmente son pocas y se enseñan todas)
export const SPANISH_LIMIT = 50

// Ediciones en castellano de una ficha, cada una con una clave estable: el ISBN o, sin él, el
// título y la editorial. Los videojuegos no tienen ediciones por idioma
function spanishEditions(file, json) {
  const kind = fichaKind(file)?.kind
  const list =
    kind === 'product'
      ? json.publications
      : ['merchandise', 'novel', 'rpgBook'].includes(kind)
        ? json.editions
        : []
  return (list ?? [])
    .filter((edition) => edition.language === 'castellano')
    .map((edition) => ({
      id: String(edition.isbn13 ?? `${edition.title ?? ''}|${edition.publisher ?? ''}`),
      title: edition.title ?? null,
      date: edition.date ?? null,
    }))
}

// Reseñas de una ficha (libros oficiales y novelas), por su URL o, sin ella, por el medio
function reviews(json) {
  return (json?.reviews ?? []).map((review) => ({ id: review.url ?? review.outlet, ...review }))
}

// Lo más reciente primero; lo que no tiene fecha, al final
// Para ordenar, las fechas de mes cuentan desde el día 1 y las de solo año desde el 1 de enero
const sortKey = (date) => (date ? (date.length === 4 ? `${date}-01-01` : fullDate(date)) : '')
const byDateDesc = (a, b) =>
  sortKey(b.date).localeCompare(sortKey(a.date)) || a.name.localeCompare(b.name)

// changes: [{ file, before, after }] con `before` null si el archivo no existía al empezar el mes
// (un archivo movido llega con el JSON de su ruta anterior). Devuelve fichas nuevas por sección
// (recuento y ejemplos), ediciones en castellano nuevas, fechas en castellano cambiadas y reseñas
// nuevas (recuento y las primeras), sin entradas repetidas
export function summarizeMonth(changes, { rpgSystems = [], outlets = [] } = {}) {
  const outletNames = new Map(outlets.map((outlet) => [outlet.id, outlet.name]))
  const added = new Map()
  const spanishNew = []
  const spanishDates = []
  const newReviews = []

  for (const { file, before, after } of changes) {
    if (!after) continue
    const ficha = describeFicha(file, after, rpgSystems)
    if (!ficha) continue
    const { path, name } = ficha

    if (!before) {
      const list = added.get(ficha.section) ?? []
      list.push(ficha)
      added.set(ficha.section, list)
    } else {
      const old = new Map(spanishEditions(file, before).map((edition) => [edition.id, edition]))
      for (const edition of spanishEditions(file, after)) {
        const previous = old.get(edition.id)
        const entry = { name: edition.title ?? name, path, date: edition.date }
        if (!previous) spanishNew.push(entry)
        else if (previous.date !== edition.date) {
          spanishDates.push({ ...entry, before: previous.date })
        }
      }
    }

    const known = new Set(reviews(before).map((review) => review.id))
    for (const review of reviews(after)) {
      if (known.has(review.id)) continue
      newReviews.push({
        name,
        path,
        outlet: outletNames.get(review.outlet) ?? review.outlet,
        date: review.date ?? null,
      })
    }
  }

  const unique = (list) => [
    ...new Map(list.map((e) => [`${e.path}|${e.name}|${e.date}`, e])).values(),
  ]
  return {
    added: [...added]
      .map(([section, fichas]) => ({
        section,
        count: fichas.length,
        examples: fichas.sort(byDateDesc).slice(0, EXAMPLES),
      }))
      .sort((a, b) => b.count - a.count || a.section.localeCompare(b.section)),
    spanishEditions: unique(spanishNew).sort(byDateDesc).slice(0, SPANISH_LIMIT),
    spanishDates: unique(spanishDates).sort(byDateDesc).slice(0, SPANISH_LIMIT),
    reviews: {
      count: newReviews.length,
      items: newReviews.sort(byDateDesc).slice(0, EXAMPLES),
    },
  }
}

// Meses completos con resumen, del primero al anterior al de `today` (AAAA-MM-DD)
export function summaryMonths(today, first = FIRST_MONTH) {
  const months = []
  let [year, month] = first.split('-').map(Number)
  const current = today.slice(0, 7)
  for (;;) {
    const key = `${year}-${String(month).padStart(2, '0')}`
    if (key >= current) break
    months.push(key)
    month += 1
    if (month === 13) {
      month = 1
      year += 1
    }
  }
  return months
}
