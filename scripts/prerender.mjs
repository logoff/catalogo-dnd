import { readFileSync, writeFileSync, mkdirSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath, pathToFileURL } from 'url'

// Genera un HTML completo por cada URL del sitemap a partir del build de servidor (dist-ssr),
// para que buscadores y vistas previas de redes vean el contenido y las etiquetas de cada página.

const __dirname = dirname(fileURLToPath(import.meta.url))
const DIST_DIR = join(__dirname, '..', 'dist')
const SSR_ENTRY = join(__dirname, '..', 'dist-ssr', 'entry-server.js')
const SITE_URL = 'https://catalogodnd.es'

const { render } = await import(pathToFileURL(SSR_ENTRY).href)

const template = readFileSync(join(DIST_DIR, 'index.html'), 'utf-8')
  // Quita la vista previa genérica: cada página trae la suya
  .replace(/\s*<title data-static-meta>[\s\S]*?<\/title>/, '')
  .replace(/\s*<meta\s+data-static-meta[\s\S]*?\/>/g, '')
  .replace(/\s*<!-- Vista previa genérica[\s\S]*?-->/, '')

const paths = [
  ...readFileSync(join(DIST_DIR, 'sitemap.xml'), 'utf-8').matchAll(/<loc>(.*?)<\/loc>/g),
].map(([, loc]) => loc.replace(SITE_URL, '') || '/')

// React coloca al principio las etiquetas del <head> (title, meta, link) que declaran las páginas
const HEAD_TAGS = /^(?:<title>[\s\S]*?<\/title>|<meta [^>]*\/>|<link [^>]*\/>)+/

for (const path of paths) {
  const html = render(path)
  const head = html.match(HEAD_TAGS)?.[0] ?? ''
  const body = html.slice(head.length)
  // main.tsx las retira al arrancar y deja que React gestione las suyas
  const headTags = head.replace(/<(title|meta|link)\b/g, '\n    <$1 data-static-meta')

  const page = template
    .replace('</head>', `${headTags}\n  </head>`)
    .replace('<div id="root"></div>', `<div id="root">${body}</div>`)

  // Cloudflare Pages sirve /producto/2014/phb desde producto/2014/phb.html
  const file = path === '/' ? 'index.html' : `${path.slice(1)}.html`
  mkdirSync(dirname(join(DIST_DIR, file)), { recursive: true })
  writeFileSync(join(DIST_DIR, file), page)
}

console.log(`✓ ${paths.length} páginas prerenderizadas`)
