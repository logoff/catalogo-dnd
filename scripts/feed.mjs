// Feed Atom de novedades: lo que ha salido más recientemente en cualquier sección del catálogo,
// en inglés o en castellano. Lógica pura, sin leer archivos: la usa generate-feed.mjs en el build
// y la prueban los tests.

export const SITE_URL = 'https://catalogodnd.es'
export const FEED_PATH = '/feed.xml'
// Cuántas entradas lleva el feed
export const FEED_SIZE = 50
// Parámetros de campaña de los enlaces del feed, para medirlo en Umami
const UTM = 'utm_source=rss&utm_medium=feed&utm_campaign=novedades'

const LANGUAGES = { english: 'en inglés', castellano: 'en castellano' }

// Fecha de un dato: solo las que tienen al menos mes; las que solo dan el año no se pueden ordenar
// con las demás. Las de mes se cuentan desde el día 1.
function fullDate(date) {
  if (!date || !/^\d{4}-\d{2}/.test(date)) return null
  return date.length === 7 ? `${date}-01` : date
}

// Ediciones de D&D sin catálogo oficial en el sitio: su sección es /ediciones y no /rol (el mismo
// criterio que isDndEdition en src/utils/rpg.ts)
export const isDndEdition = (system) => Boolean(system.official && !system.official_catalog)

const productPath = (product, folder) => `/producto/${folder}/${(product.code ?? '').toLowerCase()}`

// Una entrada por cada edición con fecha: libros oficiales, videojuegos, merchandising, novelas y
// otros juegos de rol o ediciones anteriores de D&D
export function feedEntries(
  { products, videogames, merchandise, novels, rpgBooks, rpgSystems = [] },
  today
) {
  const editions = new Set(rpgSystems.filter(isDndEdition).map((system) => system.slug))
  const entries = []
  const add = (date, entry) => {
    const day = fullDate(date)
    if (day && day <= today) entries.push({ ...entry, date: day })
  }

  for (const { product, folder } of products) {
    for (const pub of product.publications) {
      add(pub.date, {
        title: `${pub.title} sale ${LANGUAGES[pub.language] ?? ''}`.trim(),
        summary: `Libro oficial de D&D${pub.publisher ? ` (${pub.publisher})` : ''}.`,
        path: productPath(product, folder),
        key: `${pub.language}-${pub.isbn13 ?? pub.title}`,
      })
    }
  }
  for (const game of videogames) {
    for (const release of game.releases) {
      add(release.date, {
        title: `${game.title_es ?? game.title}${release.edition ? ` (${release.edition})` : ''} sale`,
        summary: 'Videojuego oficial de D&D.',
        path: `/videojuego/${game.slug}`,
        key: `${release.platform}-${release.edition ?? ''}`,
      })
    }
  }
  for (const item of merchandise) {
    // Si ninguna edición tiene fecha propia, cuenta la del artículo, una sola vez
    const dated = item.editions.some((edition) => edition.date)
    for (const edition of dated ? item.editions : item.editions.slice(0, 1)) {
      add(dated ? edition.date : item.date, {
        title: `${edition.title ?? item.title_es ?? item.title} sale${edition.language ? ` ${LANGUAGES[edition.language]}` : ''}`,
        summary: `Merchandising oficial de D&D (${edition.publisher ?? item.manufacturer}).`,
        path: `/merchandising/${item.slug}`,
        key: `${edition.language ?? 'sin-idioma'}`,
      })
    }
  }
  for (const novel of novels) {
    for (const edition of novel.editions) {
      add(edition.date, {
        title: `${edition.title ?? novel.title} sale ${LANGUAGES[edition.language]}`,
        summary: `Novela de D&D (${edition.publisher}).`,
        path: `/novela/${novel.slug}`,
        key: `${edition.language}-${edition.isbn13 ?? edition.publisher}-${edition.format ?? ''}`,
      })
    }
  }
  for (const book of rpgBooks) {
    const dnd = editions.has(book.system)
    for (const edition of book.editions) {
      add(edition.date, {
        title: `${edition.title ?? book.title} sale ${LANGUAGES[edition.language]}`,
        summary: `${dnd ? 'Ediciones anteriores de D&D' : 'Otros juegos de rol'} (${edition.publisher}).`,
        path: `/${dnd ? 'ediciones' : 'rol'}/${book.system}/${book.slug}`,
        key: `${edition.language}-${edition.isbn13 ?? edition.publisher}`,
      })
    }
  }

  // Una sola entrada por ficha, fecha y título (los formatos de una misma edición salen el mismo
  // día). Del más reciente al más antiguo; a igual fecha, por título para que el orden sea estable
  const unique = [...new Map(entries.map((e) => [`${e.path}|${e.date}|${e.title}`, e])).values()]
  return unique
    .sort((a, b) => b.date.localeCompare(a.date) || a.title.localeCompare(b.title))
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
