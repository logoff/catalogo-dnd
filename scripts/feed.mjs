// Feed Atom de novedades: lo que ha salido más recientemente en cualquier sección del catálogo,
// en inglés o en castellano. Lógica pura, sin leer archivos: la usa generate-feed.mjs en el build
// y la prueban los tests.
import { releaseEntries } from './releases.mjs'

export const SITE_URL = 'https://catalogodnd.es'
export const FEED_PATH = '/feed.xml'
// Cuántas entradas lleva el feed
export const FEED_SIZE = 50
// Parámetros de campaña de los enlaces del feed, para medirlo en Umami
const UTM = 'utm_source=rss&utm_medium=feed&utm_campaign=novedades'

// Las entradas del feed: lo ya publicado, de lo más reciente a lo más antiguo (ver releases.mjs)
export function feedEntries(data, today) {
  return releaseEntries(data)
    .filter((entry) => entry.date <= today)
    .slice(0, FEED_SIZE)
}

const escape = (text) =>
  String(text)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')

export function atomFeed(entries, updated) {
  const items = entries
    .map(
      (entry) => `  <entry>
    <id>tag:catalogodnd.es,${entry.date}:${escape(entry.path)}#${escape(entry.key)}</id>
    <title>${escape(entry.title)}</title>
    <link href="${SITE_URL}${escape(entry.path)}?${UTM.replace(/&/g, '&amp;')}"/>
    <updated>${entry.date}T00:00:00Z</updated>
    <summary>${escape(entry.summary)}</summary>
  </entry>`
    )
    .join('\n')
  return `<?xml version="1.0" encoding="utf-8"?>
<feed xmlns="http://www.w3.org/2005/Atom" xml:lang="es">
  <id>${SITE_URL}/</id>
  <title>Novedades del Catálogo D&amp;D</title>
  <subtitle>Libros, videojuegos, merchandising, novelas y otros juegos de rol de la familia de D&amp;D que acaban de salir, en inglés y en castellano.</subtitle>
  <link rel="self" href="${SITE_URL}${FEED_PATH}"/>
  <link href="${SITE_URL}/"/>
  <updated>${updated}T00:00:00Z</updated>
  <author><name>Catálogo D&amp;D</name></author>
${items}
</feed>
`
}
