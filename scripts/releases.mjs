// Novedades: qué ediciones de cualquier sección del catálogo han salido o van a salir, en inglés o
// en castellano. Lógica pura, sin leer archivos: la usan el feed Atom (feed.mjs) y el módulo
// virtual:releases de la página /novedades (vite.config.ts), y la prueban los tests.

const LANGUAGES = { english: 'en inglés', castellano: 'en castellano' }

// Días que una edición se queda en «Recién salido»
export const RECENT_DAYS = 90

// Fecha de un dato: solo las que tienen al menos mes; las que solo dan el año no se pueden ordenar
// con las demás. Las de mes se cuentan desde el día 1.
export function fullDate(date) {
  if (!date || !/^\d{4}-\d{2}/.test(date)) return null
  return date.length === 7 ? `${date}-01` : date
}

const yearOnly = (date) => (typeof date === 'string' && /^\d{4}$/.test(date) ? date : null)

// Ediciones de D&D sin catálogo oficial en el sitio: su sección es /ediciones y no /rol (el mismo
// criterio que isDndEdition en src/utils/rpg.ts)
export const isDndEdition = (system) => Boolean(system.official && !system.official_catalog)

const productPath = (product, folder) => `/producto/${folder}/${(product.code ?? '').toLowerCase()}`

// Recorre todas las ediciones del catálogo. Cada una lleva su fecha tal cual (`raw`), el nombre que
// se muestra en la página, la frase y el resumen del feed, la ruta de su ficha, una clave estable,
// la sección y el idioma (los videojuegos y algunos artículos no tienen idioma). `announceable`
// marca las secciones en las que una edición sin fecha es un anuncio y no un dato que falta.
function editions({
  products,
  videogames,
  merchandise,
  novels,
  comics = [],
  rpgBooks,
  rpgSystems = [],
}) {
  const dndEditions = new Set(rpgSystems.filter(isDndEdition).map((system) => system.slug))
  const systemNames = new Map(rpgSystems.map((system) => [system.slug, system.name]))
  const all = []

  for (const { product, folder } of products) {
    for (const pub of product.publications) {
      all.push({
        raw: pub.date,
        announceable: true,
        name: pub.title,
        title: `${pub.title} sale ${LANGUAGES[pub.language] ?? ''}`.trim(),
        summary: `Libro oficial de D&D${pub.publisher ? ` (${pub.publisher})` : ''}.`,
        path: productPath(product, folder),
        key: `${pub.language}-${pub.isbn13 ?? pub.title}`,
        section: 'libros',
        language: pub.language,
      })
    }
  }
  for (const game of videogames) {
    for (const release of game.releases) {
      const name = `${game.title_es ?? game.title}${release.edition ? ` (${release.edition})` : ''}`
      all.push({
        raw: release.date,
        announceable: game.status === 'announced',
        name,
        title: `${name} sale`,
        summary: 'Videojuego oficial de D&D.',
        path: `/videojuego/${game.slug}`,
        key: `${release.platform}-${release.edition ?? ''}`,
        section: 'videojuegos',
      })
    }
  }
  for (const item of merchandise) {
    // Si ninguna edición tiene fecha propia, cuenta la del artículo, una sola vez
    const dated = item.editions.some((edition) => edition.date)
    for (const edition of dated ? item.editions : item.editions.slice(0, 1)) {
      const name = edition.title ?? item.title_es ?? item.title
      all.push({
        raw: dated ? edition.date : item.date,
        name,
        title: `${name} sale${edition.language ? ` ${LANGUAGES[edition.language]}` : ''}`,
        summary: `Merchandising oficial de D&D (${edition.publisher ?? item.manufacturer}).`,
        path: `/merchandising/${item.slug}`,
        key: `${edition.language ?? 'sin-idioma'}`,
        section: 'merchandising',
        language: edition.language,
      })
    }
  }
  for (const novel of novels) {
    for (const edition of novel.editions) {
      const name = edition.title ?? novel.title
      all.push({
        raw: edition.date,
        name,
        title: `${name} sale ${LANGUAGES[edition.language]}`,
        summary: `Novela de D&D (${edition.publisher}).`,
        path: `/novela/${novel.slug}`,
        key: `${edition.language}-${edition.isbn13 ?? edition.publisher}-${edition.format ?? ''}`,
        section: 'novelas',
        language: edition.language,
      })
    }
  }
  for (const comic of comics) {
    // Cada número de la serie (en inglés) y cada edición: los tomos con su fecha y, en las grapas
    // en castellano, cada número
    for (const issue of comic.issues) {
      const name = `${comic.title} #${issue.number}`
      all.push({
        raw: issue.date,
        announceable: Boolean(comic.announced),
        name,
        title: `${name} sale ${LANGUAGES[comic.language ?? 'english']}`,
        summary: `Cómic de D&D (${comic.publisher}).`,
        path: `/comic/${comic.slug}`,
        key: `${comic.language ?? 'english'}-${issue.number}`,
        section: 'comics',
        language: comic.language ?? 'english',
      })
    }
    for (const edition of comic.editions ?? []) {
      const base = edition.title ?? comic.title
      const items =
        edition.format === 'issue'
          ? (edition.issues ?? []).map((issue) => ({
              raw: issue.date,
              name: `${base} #${issue.number}`,
              key: `${edition.language}-${edition.publisher}-${issue.number}`,
            }))
          : [
              {
                raw: edition.date,
                name: base,
                key: `${edition.language}-${edition.isbn13 ?? edition.publisher}-${edition.format}`,
              },
            ]
      for (const item of items) {
        all.push({
          ...item,
          title: `${item.name} sale ${LANGUAGES[edition.language]}`,
          summary: `Cómic de D&D (${edition.publisher}).`,
          path: `/comic/${comic.slug}`,
          section: 'comics',
          language: edition.language,
        })
      }
    }
  }
  for (const book of rpgBooks) {
    const dnd = dndEditions.has(book.system)
    for (const edition of book.editions) {
      const name = edition.title ?? book.title
      all.push({
        raw: edition.date,
        name,
        title: `${name} sale ${LANGUAGES[edition.language]}`,
        summary: `${dnd ? 'Ediciones anteriores de D&D' : 'Otros juegos de rol'} (${edition.publisher}).`,
        path: `/${dnd ? 'ediciones' : 'rol'}/${book.system}/${book.slug}`,
        key: `${edition.language}-${edition.isbn13 ?? edition.publisher}`,
        section: dnd ? 'ediciones' : 'rol',
        // El juego al que pertenece, porque los títulos de los libros no siempre lo dicen
        ...(systemNames.get(book.system) ? { context: systemNames.get(book.system) } : {}),
        language: edition.language,
      })
    }
  }
  return all
}

// Sin los campos internos del recorrido; `language` solo si lo hay
function entry(edition, extra) {
  const rest = { ...edition }
  delete rest.raw
  delete rest.announceable
  delete rest.language
  return { ...rest, ...(edition.language ? { language: edition.language } : {}), ...extra }
}

// Todas las ediciones con fecha de mes o de día, pasadas y futuras. Una sola entrada por ficha,
// fecha y título (los formatos de una misma edición salen el mismo día). De la más reciente a la
// más antigua; a igual fecha, por título para que el orden sea estable
export function releaseEntries(data) {
  const dated = editions(data).flatMap((edition) => {
    const date = fullDate(edition.raw)
    // Las de mes sin día se marcan, para no mostrar un día que el dato no da
    return date
      ? [entry(edition, { date, ...(edition.raw.length === 7 ? { monthOnly: true } : {}) })]
      : []
  })
  const unique = [...new Map(dated.map((e) => [`${e.path}|${e.date}|${e.title}`, e])).values()]
  return unique.sort((a, b) => b.date.localeCompare(a.date) || a.title.localeCompare(b.title))
}

// Anunciados sin fecha concreta: los libros oficiales y los videojuegos anunciados sin fecha, y
// cualquier edición con solo un año posterior al actual (que se muestra como su fecha). Una sola
// entrada por ficha, nombre e idioma; por año (los que no tienen, al final) y por nombre
export function announcedEntries(data, today) {
  const year = today.slice(0, 4)
  const announced = editions(data).flatMap((edition) => {
    const onlyYear = yearOnly(edition.raw)
    if (onlyYear && onlyYear > year) return [entry(edition, { year: onlyYear })]
    if (!edition.raw && edition.announceable) return [entry(edition)]
    return []
  })
  const unique = [
    ...new Map(announced.map((e) => [`${e.path}|${e.name}|${e.language ?? ''}`, e])).values(),
  ]
  return unique.sort(
    (a, b) => (a.year ?? '9999').localeCompare(b.year ?? '9999') || a.name.localeCompare(b.name)
  )
}

// Fecha ISO de hace `days` días
function daysBefore(today, days) {
  const date = new Date(`${today}T00:00:00Z`)
  date.setUTCDate(date.getUTCDate() - days)
  return date.toISOString().slice(0, 10)
}

// Lo de la página: lo salido en los últimos RECENT_DAYS días (hoy incluido), de lo más reciente a
// lo más antiguo, y lo que tiene fecha posterior a hoy, de lo más próximo a lo más lejano
export function splitReleases(entries, today) {
  const since = daysBefore(today, RECENT_DAYS)
  return {
    recent: entries.filter((e) => e.date <= today && e.date >= since),
    upcoming: entries.filter((e) => e.date > today).reverse(),
  }
}

// Qué es un archivo de data/ según su ruta: el tipo de ficha y, en los libros oficiales, la carpeta
// de la edición. Los demás archivos (esquemas, inventarios, series…) no son fichas
export function fichaKind(file) {
  const parts = file.split('/')
  if (parts[0] !== 'data' || !file.endsWith('.json')) return null
  if ((parts[1] === '2014' || parts[1] === '2024') && parts[2] === 'products') {
    return { kind: 'product', folder: parts[1] }
  }
  if (parts[1] === 'videogames' && parts[2] === 'games' && parts.length === 5) {
    return { kind: 'videogame' }
  }
  if (parts[1] === 'merchandising' && parts[2] === 'items' && parts.length === 5) {
    return { kind: 'merchandise' }
  }
  if (parts[1] === 'novels' && parts.length === 4) return { kind: 'novel' }
  if (parts[1] === 'comics' && parts.length === 4) return { kind: 'comic' }
  if (parts[1] === 'rol' && parts[2] === 'books' && parts.length === 5) return { kind: 'rpgBook' }
  if (parts[1] === 'rol' && parts[2] === 'systems' && parts.length === 4)
    return { kind: 'rpgSystem' }
  return null
}

// La ficha de un archivo: sección, ruta, nombre y su fecha más reciente (completa o solo el año),
// con las mismas reglas que las novedades. null si el archivo no es una ficha
export function describeFicha(file, json, rpgSystems = []) {
  const type = fichaKind(file)
  if (!type) return null
  if (type.kind === 'rpgSystem') {
    const edition = isDndEdition(json)
    // Los sistemas de D&D con catálogo oficial no tienen sección propia en el sitio
    if (json.official && json.official_catalog) return null
    return {
      section: edition ? 'ediciones' : 'rol',
      path: `/${edition ? 'ediciones' : 'rol'}/${json.slug}`,
      name: json.name,
      date: json.date ?? null,
    }
  }
  const empty = {
    products: [],
    videogames: [],
    merchandise: [],
    novels: [],
    comics: [],
    rpgBooks: [],
    rpgSystems,
  }
  const data = {
    product: () => ({ ...empty, products: [{ product: json, folder: type.folder }] }),
    videogame: () => ({ ...empty, videogames: [json] }),
    merchandise: () => ({ ...empty, merchandise: [json] }),
    novel: () => ({ ...empty, novels: [json] }),
    comic: () => ({ ...empty, comics: [json] }),
    rpgBook: () => ({ ...empty, rpgBooks: [json] }),
  }[type.kind]()
  const all = editions(data)
  if (all.length === 0) return null
  const name = {
    product: () => json.publications[0]?.title ?? json.code,
    videogame: () => json.title_es ?? json.title,
    merchandise: () => json.title_es ?? json.title,
    novel: () => json.title,
    comic: () => json.title,
    rpgBook: () => json.title,
  }[type.kind]()
  // La fecha más reciente, tal como viene en los datos (día, mes o solo año); para ordenar, las de
  // mes cuentan desde el día 1
  const dated = all
    .map((e) => ({ raw: e.raw, sort: fullDate(e.raw) ?? yearOnly(e.raw) }))
    .filter((d) => d.sort)
    .sort((a, b) => b.sort.localeCompare(a.sort))
  const date = dated[0]?.raw ?? null
  const { section, path, context } = all[0]
  return { section, path, name, date, ...(context ? { context } : {}) }
}
