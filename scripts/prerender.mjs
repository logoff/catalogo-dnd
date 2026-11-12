import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath, pathToFileURL } from 'url'
import sharp from 'sharp'

// Genera un HTML completo por cada URL del sitemap a partir del build de servidor (dist-ssr),
// para que buscadores y vistas previas de redes vean el contenido y las etiquetas de cada página.

const __dirname = dirname(fileURLToPath(import.meta.url))
const DIST_DIR = join(__dirname, '..', 'dist')
const SSR_ENTRY = join(__dirname, '..', 'dist-ssr', 'entry-server.js')
const SITE_URL = 'https://catalogodnd.es'

// Tamaño de tarjeta grande en redes; WhatsApp además descarta las imágenes pesadas
const PREVIEW_WIDTH = 1200
const PREVIEW_HEIGHT = 630
const PREVIEW_BACKGROUND = '#1a1a1a'

const { render } = await import(pathToFileURL(SSR_ENTRY).href)

const template = readFileSync(join(DIST_DIR, 'index.html'), 'utf-8')
  // Quita la vista previa genérica: cada página trae la suya
  .replace(/\s*<title data-static-meta>[\s\S]*?<\/title>/, '')
  .replace(/\s*<meta\s+data-static-meta[\s\S]*?\/>/g, '')
  .replace(/\s*<!-- Vista previa genérica[\s\S]*?-->/, '')

const paths = [
  ...readFileSync(join(DIST_DIR, 'sitemap.xml'), 'utf-8').matchAll(/<loc>(.*?)<\/loc>/g),
].map(([, loc]) => loc.replace(SITE_URL, '') || '/')

// Convierte una portada en una imagen de vista previa ligera, centrada sobre el fondo de la web
async function previewImage(imageUrl) {
  const source = join(DIST_DIR, imageUrl.replace(SITE_URL, ''))
  const previewPath = imageUrl
    .replace(`${SITE_URL}/images/products/`, '/images/previews/')
    .replace(`${SITE_URL}/images/videogames/`, '/images/previews/videogames/')
    .replace(/\.\w+$/, '.jpg')
  const target = join(DIST_DIR, previewPath)

  if (!existsSync(target)) {
    mkdirSync(dirname(target), { recursive: true })
    await sharp(source)
      .resize(PREVIEW_WIDTH, PREVIEW_HEIGHT, { fit: 'contain', background: PREVIEW_BACKGROUND })
      .flatten({ background: PREVIEW_BACKGROUND })
      .jpeg({ quality: 82, mozjpeg: true })
      .toFile(target)
  }
  return `${SITE_URL}${previewPath}`
}

// React coloca al principio las etiquetas del <head> (title, meta, link) que declaran las páginas
const HEAD_TAGS = /^(?:<title>[\s\S]*?<\/title>|<meta [^>]*\/>|<link [^>]*\/>)+/

for (const path of paths) {
  const html = render(path)
  let head = html.match(HEAD_TAGS)?.[0] ?? ''
  const body = html.slice(head.length)

  // Las portadas originales pueden pesar varios MB: se sustituyen por su vista previa
  const image = head.match(/property="og:image" content="([^"]+)"/)?.[1]
  if (
    image?.startsWith(`${SITE_URL}/images/products/`) ||
    image?.startsWith(`${SITE_URL}/images/videogames/`)
  ) {
    head = head.replaceAll(image, await previewImage(image))
  }
  // Con el tamaño declarado, WhatsApp y otras redes muestran la tarjeta grande
  head = head.replace(
    /(<meta property="og:image" [^>]*\/>)/,
    `$1<meta property="og:image:width" content="${PREVIEW_WIDTH}"/><meta property="og:image:height" content="${PREVIEW_HEIGHT}"/>`
  )

  // main.tsx las retira al arrancar y deja que React gestione las suyas. La marca va al final
  // de cada etiqueta: WhatsApp ignora las <meta> cuyo primer atributo no es property o name
  const headTags = head
    .replace(/<title>/, '<title data-static-meta>')
    .replace(/<(meta|link) ([^>]*?)\/>/g, '<$1 $2 data-static-meta/>')
    .replace(/<(title|meta|link)\b/g, '\n    <$1')

  // Justo tras el charset: algunos lectores de vistas previas solo miran el principio del HTML
  const page = template
    .replace('<meta charset="UTF-8" />', `<meta charset="UTF-8" />${headTags}`)
    .replace('<div id="root"></div>', `<div id="root">${body}</div>`)

  // Cloudflare Pages sirve /producto/2014/phb desde producto/2014/phb.html
  const file = path === '/' ? 'index.html' : `${path.slice(1)}.html`
  mkdirSync(dirname(join(DIST_DIR, file)), { recursive: true })
  writeFileSync(join(DIST_DIR, file), page)
}

console.log(`✓ ${paths.length} páginas prerenderizadas`)
