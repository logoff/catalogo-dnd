// Lee del historial de git cómo estaba data/ al empezar y al acabar un mes, para el resumen mensual
// (monthly-summary.mjs). Necesita el historial completo: en un clon superficial no hay con qué
// comparar.
import { execFileSync } from 'child_process'

const TIME_ZONE = 'Europe/Madrid'

const git = (cwd, args, input) =>
  execFileSync('git', args, { cwd, input, maxBuffer: 1024 * 1024 * 1024 })

// Desfase de la zona horaria respecto a UTC en un instante, como «+01:00»
function offsetAt(instant) {
  const name = new Intl.DateTimeFormat('en-US', { timeZone: TIME_ZONE, timeZoneName: 'longOffset' })
    .formatToParts(instant)
    .find((part) => part.type === 'timeZoneName').value
  return name === 'GMT' ? '+00:00' : name.replace('GMT', '')
}

// Medianoche del día 1 del mes (AAAA-MM) en Madrid, en ISO con su desfase
function monthStart(month) {
  const noon = new Date(`${month}-01T12:00:00Z`)
  return `${month}-01T00:00:00${offsetAt(noon)}`
}

const nextMonth = (month) => {
  const [year, m] = month.split('-').map(Number)
  return m === 12 ? `${year + 1}-01` : `${year}-${String(m + 1).padStart(2, '0')}`
}

// Inicio del mes y del siguiente
export function monthBounds(month) {
  return { start: monthStart(month), end: monthStart(nextMonth(month)) }
}

export function isShallow(cwd) {
  return git(cwd, ['rev-parse', '--is-shallow-repository']).toString().trim() === 'true'
}

// Último commit de la rama actual anterior a un instante, o null si no hay
export function revisionBefore(cwd, instant) {
  const sha = git(cwd, ['rev-list', '-1', '--first-parent', `--before=${instant}`, 'HEAD'])
    .toString()
    .trim()
  return sha || null
}

// Archivos de data/ que cambian entre dos revisiones: { file, previous } con `previous` la ruta de
// antes si se movió. Sin revisión de partida, todos los de la de llegada son nuevos. Los borrados
// no interesan al resumen
export function changedFiles(cwd, from, to) {
  if (!from) {
    return git(cwd, ['ls-tree', '-r', '--name-only', to, '--', 'data'])
      .toString()
      .split('\n')
      .filter(Boolean)
      .map((file) => ({ file, previous: null, added: true }))
  }
  return git(cwd, ['diff', '--name-status', '-M', from, to, '--', 'data'])
    .toString()
    .split('\n')
    .filter(Boolean)
    .flatMap((line) => {
      const [status, first, second] = line.split('\t')
      if (status === 'A') return [{ file: first, previous: null, added: true }]
      if (status === 'M') return [{ file: first, previous: first, added: false }]
      if (status.startsWith('R')) return [{ file: second, previous: first, added: false }]
      return []
    })
}

// Contenido de varios archivos en revisiones concretas, de una sola vez: [{ rev, file }] → textos
// (null si no existe)
export function readFiles(cwd, requests) {
  if (requests.length === 0) return []
  const input = requests.map(({ rev, file }) => `${rev}:${file}`).join('\n') + '\n'
  const output = git(cwd, ['cat-file', '--batch'], input)
  const contents = []
  let offset = 0
  for (let i = 0; i < requests.length; i++) {
    const lineEnd = output.indexOf(10, offset)
    const header = output.subarray(offset, lineEnd).toString()
    offset = lineEnd + 1
    if (header.endsWith(' missing')) {
      contents.push(null)
      continue
    }
    const size = Number(header.split(' ')[2])
    contents.push(output.subarray(offset, offset + size).toString('utf-8'))
    // El contenido va seguido de un salto de línea
    offset += size + 1
  }
  return contents
}

const parse = (text) => {
  if (text === null) return null
  try {
    return JSON.parse(text)
  } catch {
    return null
  }
}

// Cambios de data/ en un mes: [{ file, before, after }] listos para summarizeMonth, y el JSON de
// llegada de los archivos que se piden aparte (sistemas de rol, medios de las reseñas)
export function monthChanges(cwd, month, extraFiles = []) {
  const { start, end } = monthBounds(month)
  const from = revisionBefore(cwd, start)
  const to = revisionBefore(cwd, end)
  if (!to) return { changes: [], extra: extraFiles.map(() => null) }
  const files = changedFiles(cwd, from, to).filter((entry) => entry.file.endsWith('.json'))
  const requests = [
    ...files.map(({ file }) => ({ rev: to, file })),
    ...files
      .map(({ previous }) => (previous ? { rev: from, file: previous } : null))
      .filter(Boolean),
    ...extraFiles.map((file) => ({ rev: to, file })),
  ]
  const texts = readFiles(cwd, requests)
  const after = texts.slice(0, files.length)
  let index = files.length
  const changes = files.map((entry, i) => {
    const before = entry.previous ? parse(texts[index++]) : null
    return { file: entry.file, before, after: parse(after[i]) }
  })
  const extra = texts.slice(index).map(parse)
  return { changes, extra }
}
