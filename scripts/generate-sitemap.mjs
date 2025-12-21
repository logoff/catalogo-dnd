import { writeFileSync, readFileSync, readdirSync, statSync } from 'fs'
import { join, basename } from 'path'
import { fileURLToPath } from 'url'
import { dirname } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const SITE_URL = 'https://logoff.co/catalogo-dnd'
const DATA_DIR = join(__dirname, '..', 'data')
const OUTPUT_DIR = join(__dirname, '..', 'dist')

function getProductFiles(dir) {
  const files = []

  function walk(currentDir) {
    const items = readdirSync(currentDir)
    for (const item of items) {
      const fullPath = join(currentDir, item)
      const stat = statSync(fullPath)
      if (stat.isDirectory()) {
        walk(fullPath)
      } else if (item.endsWith('.json')) {
        files.push(fullPath)
      }
    }
  }

  walk(dir)
  return files
}

function extractEditionFromPath(path) {
  return path.includes('/2024/') ? '2024' : '2014'
}

function extractCodeFromFile(filePath) {
  const content = JSON.parse(readFileSync(filePath, 'utf-8'))
  return content.code?.toLowerCase() || basename(filePath, '.json')
}

function generateSitemap() {
  const today = new Date().toISOString().split('T')[0]

  const urls = [
    // Static pages
    { loc: '/', priority: 1.0, changefreq: 'weekly', lastmod: today },
    { loc: '/catalogo', priority: 0.9, changefreq: 'weekly', lastmod: today },
    { loc: '/2014', priority: 0.8, changefreq: 'weekly', lastmod: today },
    { loc: '/2024', priority: 0.8, changefreq: 'weekly', lastmod: today },
  ]

  // Product pages
  const productFiles = getProductFiles(DATA_DIR)
  for (const file of productFiles) {
    const edition = extractEditionFromPath(file)
    const code = extractCodeFromFile(file)
    urls.push({
      loc: `/producto/${edition}/${code}`,
      priority: 0.7,
      changefreq: 'monthly',
      lastmod: today,
    })
  }

  // Generate XML
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(
    (url) => `  <url>
    <loc>${SITE_URL}${url.loc}</loc>
    ${url.lastmod ? `<lastmod>${url.lastmod}</lastmod>` : ''}
    ${url.changefreq ? `<changefreq>${url.changefreq}</changefreq>` : ''}
    ${url.priority !== undefined ? `<priority>${url.priority}</priority>` : ''}
  </url>`
  )
  .join('\n')}
</urlset>`

  writeFileSync(join(OUTPUT_DIR, 'sitemap.xml'), xml)
  console.log(`✓ Sitemap generated with ${urls.length} URLs`)
}

function generateRobots() {
  const robots = `User-agent: *
Allow: /

Sitemap: ${SITE_URL}/sitemap.xml
`
  writeFileSync(join(OUTPUT_DIR, 'robots.txt'), robots)
  console.log('✓ robots.txt generated')
}

generateSitemap()
generateRobots()
