// Genera dist/feed.xml, el feed Atom de novedades (ver feed.mjs), a partir de los JSON de data/
//
//   node scripts/generate-feed.mjs
import { globSync, readFileSync, writeFileSync } from 'fs'
import { dirname, join } from 'path'
import { fileURLToPath } from 'url'
import { atomFeed, feedEntries } from './feed.mjs'

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..')
const read = (file) => JSON.parse(readFileSync(join(ROOT, file), 'utf-8'))
const files = (pattern) => globSync(pattern, { cwd: ROOT }).sort()

const today = new Date().toISOString().slice(0, 10)
const entries = feedEntries(
  {
    products: ['2014', '2024'].flatMap((folder) =>
      files(`data/${folder}/products/**/*.json`).map((file) => ({ product: read(file), folder }))
    ),
    videogames: files('data/videogames/games/*/*.json').map(read),
    merchandise: files('data/merchandising/items/*/*.json').map(read),
    novels: files('data/novels/*/*.json').map(read),
    rpgBooks: files('data/rol/books/*/*.json').map(read),
  },
  today
)

writeFileSync(join(ROOT, 'dist', 'feed.xml'), atomFeed(entries, entries[0]?.date ?? today))
console.log(`✓ Feed generated with ${entries.length} entries`)
