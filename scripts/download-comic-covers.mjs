// Descarga portadas de una serie de cómics, las convierte a WebP (portada y miniatura) en
// public/images/comics/<slug>/ y anota la ruta y la página de origen en la ficha.
//
//   node scripts/download-comic-covers.mjs <slug> <clave>=<url>... [--source <url>]
//     Claves (ver comic-covers.mjs): <número>, <isbn>, tomo-<n>, castellano-<n>.
//     --source guarda esa página como origen de todas las portadas de la orden; si no se da,
//     el origen es la propia URL de la imagen.
//   node scripts/download-comic-covers.mjs --collection <id> <url> [--source <url>]
//     Portada de un tomo de varias series (data/comics/collections.json).
import { existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from 'fs'
import { dirname, join, relative } from 'path'
import { fileURLToPath } from 'url'
import prettier from 'prettier'
import sharp from 'sharp'
import { coverFileName, targetFor } from './comic-covers.mjs'

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..')
const COMICS_DIR = join(ROOT, 'data', 'comics')
const FULL_WIDTH = 800
const THUMB_WIDTH = 300
const MIN_WIDTH = 100
const USAGE =
  'Uso: just comic-covers <slug> <clave>=<url>... [--source <url>] | --collection <id> <url> [--source <url>]'

function fail(message) {
  console.error(`✗ ${message}`)
  process.exit(1)
}

function comicFile(slug) {
  for (const dir of readdirSync(COMICS_DIR, { withFileTypes: true })) {
    if (!dir.isDirectory()) continue
    const file = join(COMICS_DIR, dir.name, `${slug}.json`)
    if (existsSync(file)) return file
  }
}

// Devuelve la ruta pública de la portada, o null si la URL no tiene imagen
async function convert(url, dir, name) {
  const response = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0' } })
  if (!response.ok) return null
  const image = sharp(Buffer.from(await response.arrayBuffer()))
  // Amazon responde con un GIF de 1×1 cuando no tiene la portada
  const { width = 0 } = await image.metadata()
  if (width < MIN_WIDTH) return null
  mkdirSync(dir, { recursive: true })
  const full = join(dir, `${name}.webp`)
  await image
    .clone()
    .resize({ width: FULL_WIDTH, withoutEnlargement: true })
    .webp({ quality: 82 })
    .toFile(full)
  await image
    .clone()
    .resize({ width: THUMB_WIDTH, withoutEnlargement: true })
    .webp({ quality: 75 })
    .toFile(join(dir, `${name}-thumb.webp`))
  console.log(`✓ ${relative(ROOT, full)}`)
  return `/${relative(join(ROOT, 'public'), full)}`
}

async function save(file, data) {
  const options = await prettier.resolveConfig(file)
  writeFileSync(file, await prettier.format(JSON.stringify(data), { ...options, filepath: file }))
}

// Separa --source <url> del resto de argumentos
function splitSource(args) {
  const index = args.indexOf('--source')
  if (index === -1) return { args, source: null }
  return { args: [...args.slice(0, index), ...args.slice(index + 2)], source: args[index + 1] }
}

const { args, source } = splitSource(process.argv.slice(2))
const [first, ...rest] = args
if (!first) fail(USAGE)

if (first === '--collection') {
  const [id, url] = rest
  if (!id || !url) fail(USAGE)
  const file = join(COMICS_DIR, 'collections.json')
  const collections = JSON.parse(readFileSync(file, 'utf-8'))
  const edition = collections.find((e) => e.id === id)
  if (!edition) fail(`no existe el tomo ${id}`)
  const cover = await convert(url, join(ROOT, 'public', 'images', 'comics', id), 'portada')
  if (!cover) fail(`${url} no devolvió ninguna imagen`)
  edition.cover = cover
  edition.cover_source = source ?? url
  await save(file, collections)
} else {
  const file = comicFile(first)
  if (!file) fail(`no existe la serie ${first}`)
  if (rest.length === 0) fail(USAGE)
  const comic = JSON.parse(readFileSync(file, 'utf-8'))
  const dir = join(ROOT, 'public', 'images', 'comics', first)
  for (const arg of rest) {
    const index = arg.indexOf('=')
    if (index < 1) fail(`«${arg}» no tiene la forma <clave>=<url>`)
    const [key, url] = [arg.slice(0, index), arg.slice(index + 1)]
    const target = targetFor(comic, key)
    if (!target) fail(`nada en ${first} corresponde a la clave ${key}`)
    const cover = await convert(url, dir, coverFileName(key))
    if (!cover) fail(`${url} no devolvió ninguna imagen`)
    target.cover = cover
    target.cover_source = source ?? url
  }
  await save(file, comic)
}
