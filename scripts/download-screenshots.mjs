// Descarga capturas oficiales de un videojuego, las convierte a WebP (ampliada y miniatura) en
// public/images/videogames/<slug>/ y las añade al campo "screenshots" de su ficha.
//
//   node scripts/download-screenshots.mjs <slug> --steam
//     Las capturas de su página de Steam (el appid sale del enlace de compra de la ficha).
//   node scripts/download-screenshots.mjs <slug> --source <página oficial> <url imagen>...
//     Capturas elegidas a mano de GOG, la web oficial o un kit de prensa.
//
// Nunca pasa de seis capturas por juego y numera a partir del siguiente archivo libre.
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'fs'
import { join, relative } from 'path'
import sharp from 'sharp'
import { ROOT, gameFile } from './videogames.mjs'

const MAX_SCREENSHOTS = 6
const FULL_WIDTH = 1280
const THUMB_WIDTH = 400

function fail(message) {
  console.error(`✗ ${message}`)
  process.exit(1)
}

// El appid del primer enlace a Steam de cualquier lanzamiento de la ficha
function steamAppId(game) {
  const url = game.releases
    .flatMap((release) => release.purchase_links ?? [])
    .find((link) => link.store === 'steam')?.url
  return url?.match(/\/app\/(\d+)/)?.[1]
}

async function steamScreenshots(appid) {
  const response = await fetch(
    `https://store.steampowered.com/api/appdetails?appids=${appid}&filters=screenshots`
  )
  const data = (await response.json())[appid]?.data
  return (data?.screenshots ?? []).map((screenshot) => screenshot.path_full)
}

async function convert(url, dir, number) {
  const response = await fetch(url)
  if (!response.ok) fail(`${url} respondió ${response.status}`)
  const image = sharp(Buffer.from(await response.arrayBuffer()))
  const full = join(dir, `screenshot-${number}.webp`)
  const thumb = join(dir, `screenshot-${number}-thumb.webp`)
  await image
    .clone()
    .resize({ width: FULL_WIDTH, withoutEnlargement: true })
    .webp({ quality: 80 })
    .toFile(full)
  await image
    .clone()
    .resize({ width: THUMB_WIDTH, withoutEnlargement: true })
    .webp({ quality: 75 })
    .toFile(thumb)
  return full
}

const [slug, mode, ...rest] = process.argv.slice(2)
const file = slug && gameFile(slug)
if (!file) fail('Uso: just screenshots <slug> --steam | --source <página> <url>...')
const game = JSON.parse(readFileSync(file, 'utf-8'))

let source
let urls
if (mode === '--steam') {
  const appid = steamAppId(game)
  if (!appid) fail(`${slug} no tiene enlace de compra a Steam`)
  source = `https://store.steampowered.com/app/${appid}/`
  urls = await steamScreenshots(appid)
} else if (mode === '--source' && rest.length >= 2) {
  ;[source, ...urls] = rest
} else {
  fail('Uso: just screenshots <slug> --steam | --source <página> <url>...')
}

const screenshots = game.screenshots ?? []
const free = MAX_SCREENSHOTS - screenshots.length
if (free <= 0) fail(`${slug} ya tiene ${MAX_SCREENSHOTS} capturas`)
if (urls.length === 0) fail(`no hay capturas en ${source}`)

const dir = join(ROOT, 'public', 'images', 'videogames', slug)
mkdirSync(dir, { recursive: true })
let number = 1
for (const url of urls.slice(0, free)) {
  while (existsSync(join(dir, `screenshot-${number}.webp`))) number++
  const path = await convert(url, dir, number)
  screenshots.push({ image: `/${relative(join(ROOT, 'public'), path)}`, source })
  console.log(`✓ ${relative(ROOT, path)}`)
}

// "screenshots" va después de "videos" (o de "images"), como en el esquema
const output = {}
for (const [key, value] of Object.entries(game)) {
  if (key === 'screenshots') continue
  output[key] = value
  if (key === (game.videos ? 'videos' : 'images')) output.screenshots = screenshots
}
writeFileSync(file, JSON.stringify(output, null, 2) + '\n')
console.log(`${slug}: ${screenshots.length} capturas`)
