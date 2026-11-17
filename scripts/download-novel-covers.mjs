// Descarga las portadas de las ediciones de una novela, las convierte a WebP (portada y miniatura)
// en public/images/novels/<slug>/ y anota la ruta en el campo "cover" de cada edición.
//
//   node scripts/download-novel-covers.mjs <slug> <clave>=<url>...
//     Portadas elegidas a mano (editorial, Tercera Fundación, Amazon…). La clave es el ISBN-13 de
//     la edición o, si no tiene, <idioma>-<año>-<formato> (english-1984-paperback).
//   node scripts/download-novel-covers.mjs <slug> --openlibrary
//     Las de Open Library para las ediciones con ISBN que aún no tienen portada.
//   node scripts/download-novel-covers.mjs --series <id> <isbn>=<url>...
//     Portadas de los recopilatorios de una serie (data/novels/series.json).
import { existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from 'fs'
import { dirname, join, relative } from 'path'
import { fileURLToPath } from 'url'
import prettier from 'prettier'
import sharp from 'sharp'

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..')
const NOVELS_DIR = join(ROOT, 'data', 'novels')
const FULL_WIDTH = 600
const THUMB_WIDTH = 240
const MIN_WIDTH = 100

function fail(message) {
  console.error(`✗ ${message}`)
  process.exit(1)
}

const USAGE =
  'Uso: just novel-covers <slug> <isbn>=<url>... | <slug> --openlibrary | --series <id> <isbn>=<url>...'

function novelFile(slug) {
  for (const setting of readdirSync(NOVELS_DIR, { withFileTypes: true })) {
    if (!setting.isDirectory()) continue
    const file = join(NOVELS_DIR, setting.name, `${slug}.json`)
    if (existsSync(file)) return file
  }
}

// Clave con la que se nombra cada edición en la línea de órdenes y en el archivo de la portada
function editionKey(edition) {
  if (edition.isbn13) return String(edition.isbn13)
  return [
    edition.language,
    edition.date?.slice(0, 4) ?? 'sin-fecha',
    edition.format ?? 'sin-formato',
  ].join('-')
}

// Devuelve la ruta pública de la portada, o null si la URL no tiene imagen
async function convert(url, dir, key) {
  const response = await fetch(url)
  if (!response.ok) return null
  const image = sharp(Buffer.from(await response.arrayBuffer()))
  // Amazon responde con un GIF de 1×1 cuando no tiene la portada
  const { width = 0 } = await image.metadata()
  if (width < MIN_WIDTH) return null
  const full = join(dir, `${key}.webp`)
  await image
    .clone()
    .resize({ width: FULL_WIDTH, withoutEnlargement: true })
    .webp({ quality: 80 })
    .toFile(full)
  await image
    .clone()
    .resize({ width: THUMB_WIDTH, withoutEnlargement: true })
    .webp({ quality: 75 })
    .toFile(join(dir, `${key}-thumb.webp`))
  console.log(`✓ ${relative(ROOT, full)}`)
  return `/${relative(join(ROOT, 'public'), full)}`
}

function parsePairs(args) {
  if (args.length === 0) fail(USAGE)
  return args.map((arg) => {
    const index = arg.indexOf('=')
    if (index < 1) fail(`«${arg}» no tiene la forma <clave>=<url>`)
    return [arg.slice(0, index), arg.slice(index + 1)]
  })
}

async function save(file, data) {
  const options = await prettier.resolveConfig(file)
  const json = await prettier.format(JSON.stringify(data), { ...options, filepath: file })
  writeFileSync(file, json)
}

// Pone la portada a cada edición cuya clave aparezca en los pares; avisa de las claves sobrantes
async function applyCovers(editions, pairs, dir) {
  mkdirSync(dir, { recursive: true })
  for (const [key, url] of pairs) {
    const edition = editions.find((e) => editionKey(e) === key)
    if (!edition) fail(`ninguna edición tiene la clave ${key}`)
    const cover = await convert(url, dir, key)
    if (!cover) fail(`${url} no devolvió ninguna imagen`)
    edition.cover = cover
  }
}

const [first, ...rest] = process.argv.slice(2)
if (!first) fail(USAGE)

if (first === '--series') {
  const [id, ...args] = rest
  const seriesFile = join(NOVELS_DIR, 'series.json')
  const allSeries = JSON.parse(readFileSync(seriesFile, 'utf-8'))
  const series = allSeries.find((s) => s.id === id)
  if (!series) fail(`no existe la serie ${id}`)
  await applyCovers(
    series.collections ?? [],
    parsePairs(args),
    join(ROOT, 'public', 'images', 'novels', id)
  )
  await save(seriesFile, allSeries)
} else {
  const file = novelFile(first)
  if (!file) fail(`no existe la novela ${first}`)
  const novel = JSON.parse(readFileSync(file, 'utf-8'))
  const dir = join(ROOT, 'public', 'images', 'novels', first)
  if (rest[0] === '--openlibrary') {
    // ?default=false hace que Open Library responda 404 en vez de una imagen vacía
    const pairs = novel.editions
      .filter((e) => e.isbn13 && !e.cover)
      .map((e) => [
        String(e.isbn13),
        `https://covers.openlibrary.org/b/isbn/${e.isbn13}-L.jpg?default=false`,
      ])
    mkdirSync(dir, { recursive: true })
    for (const [key, url] of pairs) {
      const cover = await convert(url, dir, key)
      if (cover) novel.editions.find((e) => editionKey(e) === key).cover = cover
      else console.log(`· ${key}: Open Library no tiene portada`)
    }
  } else {
    await applyCovers(novel.editions, parsePairs(rest), dir)
  }
  await save(file, novel)
}
