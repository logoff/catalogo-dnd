// Descarga los carteles de una película, serie o documental, los convierte a WebP (cartel y
// miniatura) en public/images/screen/<slug>/poster-<idioma>.webp y los anota en "posters".
//
//   node scripts/download-screen-posters.mjs <slug> --source <página> <idioma>=<url>...
//
// <página> es la fuente oficial de donde sale el cartel (distribuidora, web oficial, kit de
// prensa o la ficha de la edición física en la tienda); vale para los carteles que la siguen,
// así que puede repetirse: --source <a> en=<url> --source <b> es=<url>. El idioma es el original
// (en, pt) o el castellano (es). Un idioma que ya tenga cartel se sustituye.
import { mkdirSync, readFileSync, writeFileSync } from 'fs'
import { join, relative } from 'path'
import prettier from 'prettier'
import sharp from 'sharp'
import { ROOT } from './videogames.mjs'
import { screenFile } from './screen.mjs'

const FULL_WIDTH = 600
const THUMB_WIDTH = 240
const MIN_WIDTH = 100
const LANGUAGES = ['en', 'es', 'pt']
const USAGE = 'Uso: just screen-posters <slug> --source <página> <idioma>=<url>...'

function fail(message) {
  console.error(`✗ ${message}`)
  process.exit(1)
}

// Pares [idioma, url, página] en el orden de la línea de órdenes
function parseArgs(args) {
  const posters = []
  let source = null
  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--source') {
      source = args[++i]
      if (!source) fail(USAGE)
      continue
    }
    const index = args[i].indexOf('=')
    if (index < 1) fail(`«${args[i]}» no tiene la forma <idioma>=<url>`)
    const language = args[i].slice(0, index)
    if (!LANGUAGES.includes(language)) fail(`idioma desconocido: ${language}`)
    if (!source) fail(`falta --source antes de ${args[i]}`)
    posters.push([language, args[i].slice(index + 1), source])
  }
  if (posters.length === 0) fail(USAGE)
  return posters
}

// Devuelve la ruta pública del cartel, o null si la URL no tiene imagen
async function convert(url, dir, language) {
  const response = await fetch(url)
  if (!response.ok) return null
  const image = sharp(Buffer.from(await response.arrayBuffer()))
  const { width = 0 } = await image.metadata()
  if (width < MIN_WIDTH) return null
  const full = join(dir, `poster-${language}.webp`)
  await image
    .clone()
    .resize({ width: FULL_WIDTH, withoutEnlargement: true })
    .webp({ quality: 80 })
    .toFile(full)
  await image
    .clone()
    .resize({ width: THUMB_WIDTH, withoutEnlargement: true })
    .webp({ quality: 75 })
    .toFile(join(dir, `poster-${language}-thumb.webp`))
  console.log(`✓ ${relative(ROOT, full)}`)
  return `/${relative(join(ROOT, 'public'), full)}`
}

const [slug, ...args] = process.argv.slice(2)
if (!slug) fail(USAGE)
const file = screenFile(slug)
if (!file) fail(`no existe ninguna obra con el slug ${slug}`)
const work = JSON.parse(readFileSync(file, 'utf-8'))
const dir = join(ROOT, 'public', 'images', 'screen', slug)
mkdirSync(dir, { recursive: true })

const posters = (work.posters ?? []).slice()
for (const [language, url, source] of parseArgs(args)) {
  const image = await convert(url, dir, language)
  if (!image) fail(`${url} no devolvió ninguna imagen`)
  const poster = { language, image, source }
  const index = posters.findIndex((p) => p.language === language)
  if (index >= 0) posters[index] = poster
  else posters.push(poster)
}
// El castellano, primero
work.posters = posters.sort((a, b) => Number(b.language === 'es') - Number(a.language === 'es'))

const options = await prettier.resolveConfig(file)
writeFileSync(file, await prettier.format(JSON.stringify(work), { ...options, filepath: file }))
console.log(`✓ ${relative(ROOT, file)}`)
