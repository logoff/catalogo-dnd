/// <reference types="vitest" />
import { defineConfig, loadEnv, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { globSync, readFileSync, readdirSync } from 'fs'
import { join, resolve } from 'path'
import { buildNovelIndex } from './src/utils/novels.ts'
import type { Novel, NovelSeries } from './src/types/novel.ts'
import { buildComicIndex } from './src/utils/comics.ts'
import type { Comic, ComicEdition } from './src/types/comic.ts'
import { buildRpgIndex, rolSection } from './src/utils/rpg.ts'
import type { License, RpgBook, RpgSystem } from './src/types/rpg.ts'
import { announcedEntries, releaseEntries, splitReleases } from './scripts/releases.mjs'
import { summarizeMonth, summaryMonths } from './scripts/monthly-summary.mjs'
import { isShallow, monthChanges } from './scripts/git-history.mjs'

// Inyecta el script de Umami solo si están definidas las variables de entorno
function umami(url?: string, websiteId?: string): Plugin {
  return {
    name: 'umami',
    transformIndexHtml() {
      if (!url || !websiteId) return []
      return [
        {
          tag: 'script',
          attrs: {
            defer: true,
            src: `${url.replace(/\/$/, '')}/script.js`,
            'data-website-id': websiteId,
            'data-domains': 'catalogodnd.es',
          },
          injectTo: 'head',
        },
      ]
    },
  }
}

// Datos de novelas generados leyendo los JSON de data/novels:
// - virtual:novels-index, índice ligero del listado, en un trozo aparte que solo descargan las
//   páginas de novelas.
// - virtual:novels-latest, el total y las más recientes, para la portada del sitio.
const NOVELS_LATEST = 4

function novelsIndex(): Plugin {
  const MODULES = ['virtual:novels-index', 'virtual:novels-latest']
  const dataDir = resolve(import.meta.dirname, 'data/novels')
  const readJson = <T>(path: string): T => JSON.parse(readFileSync(path, 'utf-8'))

  return {
    name: 'novels-index',
    resolveId: (id) => (MODULES.includes(id) ? '\0' + id : undefined),
    load(id) {
      if (!MODULES.includes(id.slice(1))) return
      const novels = readdirSync(dataDir, { withFileTypes: true })
        .filter((entry) => entry.isDirectory())
        .flatMap((dir) =>
          readdirSync(join(dataDir, dir.name))
            .filter((file) => file.endsWith('.json'))
            .map((file) => join(dataDir, dir.name, file))
        )
      // Para que el servidor de desarrollo regenere los módulos al cambiar cualquier JSON
      for (const file of novels) this.addWatchFile(file)
      this.addWatchFile(join(dataDir, 'series.json'))
      const index = buildNovelIndex(
        novels.map((file) => readJson<Novel>(file)),
        readJson<NovelSeries[]>(join(dataDir, 'series.json'))
      )
      const data =
        id === '\0virtual:novels-latest'
          ? (() => {
              const latest = index.novels.slice(0, NOVELS_LATEST)
              // Solo las series de esas novelas, para el nombre en sus tarjetas
              const series = index.series.filter((s) => latest.some((n) => n.series?.id === s.id))
              return { total: index.novels.length, latest, series }
            })()
          : index
      return `export default ${JSON.stringify(data)}`
    },
  }
}

// Datos de cómics generados leyendo los JSON de data/comics, como los de novelas:
// - virtual:comics-index, índice ligero del listado, en un trozo aparte.
// - virtual:comics-stats, cuántas series hay, para la portada del sitio.
function comicsIndex(): Plugin {
  const MODULES = ['virtual:comics-index', 'virtual:comics-stats']
  const dataDir = resolve(import.meta.dirname, 'data/comics')
  const readJson = <T>(path: string): T => JSON.parse(readFileSync(path, 'utf-8'))

  return {
    name: 'comics-index',
    resolveId: (id) => (MODULES.includes(id) ? '\0' + id : undefined),
    load(id) {
      if (!MODULES.includes(id.slice(1))) return
      const comics = readdirSync(dataDir, { withFileTypes: true })
        .filter((entry) => entry.isDirectory())
        .flatMap((dir) =>
          readdirSync(join(dataDir, dir.name))
            .filter((file) => file.endsWith('.json'))
            .map((file) => join(dataDir, dir.name, file))
        )
      const collectionsFile = join(dataDir, 'collections.json')
      for (const file of [...comics, collectionsFile]) this.addWatchFile(file)
      const index = buildComicIndex(
        comics.map((file) => readJson<Comic>(file)),
        readJson<ComicEdition[]>(collectionsFile)
      )
      const data = id === '\0virtual:comics-stats' ? { total: index.length } : index
      return `export default ${JSON.stringify(data)}`
    },
  }
}

// Datos de la sección de otros juegos de rol generados leyendo los JSON de data/rol:
// - virtual:rpg-index, licencias, sistemas y resumen de los libros, en un trozo aparte que solo
//   descargan las páginas de la sección.
// - virtual:rpg-stats, cuántos sistemas y libros hay en la sección (sin las ediciones anteriores
//   de D&D), para la portada del sitio.
function rpgIndex(): Plugin {
  const MODULES = ['virtual:rpg-index', 'virtual:rpg-stats']
  const dataDir = resolve(import.meta.dirname, 'data/rol')
  const jsonIn = (dir: string): string[] =>
    readdirSync(dir)
      .filter((file) => file.endsWith('.json'))
      .map((file) => join(dir, file))

  return {
    name: 'rpg-index',
    resolveId: (id) => (MODULES.includes(id) ? '\0' + id : undefined),
    load(id) {
      if (!MODULES.includes(id.slice(1))) return
      const booksDir = join(dataDir, 'books')
      const files = {
        licenses: jsonIn(join(dataDir, 'licenses')),
        systems: jsonIn(join(dataDir, 'systems')),
        books: readdirSync(booksDir, { withFileTypes: true })
          .filter((entry) => entry.isDirectory())
          .flatMap((dir) => jsonIn(join(booksDir, dir.name))),
      }
      // Para que el servidor de desarrollo regenere los módulos al cambiar cualquier JSON
      for (const file of Object.values(files).flat()) this.addWatchFile(file)
      const read = <T>(paths: string[]): T[] =>
        paths.map((path) => JSON.parse(readFileSync(path, 'utf-8')) as T)
      const index = buildRpgIndex(
        read<License>(files.licenses),
        read<RpgSystem>(files.systems),
        read<RpgBook>(files.books)
      )
      const rol = rolSection(index.systems, index.books)
      const data =
        id === '\0virtual:rpg-stats'
          ? { systems: rol.systems.length, books: rol.books.length }
          : index
      return `export default ${JSON.stringify(data)}`
    },
  }
}

// Novedades para /novedades y la portada (virtual:releases), con la lógica de scripts/releases.mjs:
// lo salido en los últimos 90 días, lo que tiene fecha futura y lo anunciado sin fecha. «Hoy» es el
// día del build en hora de Madrid, el mismo en el servidor y en el navegador; el sitio se despliega
// cada día para que avance solo. Solo lleva los campos que pinta la página, no las fichas.
function releasesIndex(): Plugin {
  const MODULE = 'virtual:releases'
  const root = import.meta.dirname
  const files = (pattern: string) => globSync(pattern, { cwd: root }).sort()
  const read = (file: string) => JSON.parse(readFileSync(join(root, file), 'utf-8'))
  const pick = ({
    name,
    path,
    section,
    context,
    language,
    date,
    year,
    key,
    monthOnly,
  }: Record<string, string>) => ({
    name,
    path,
    section,
    key,
    ...(context ? { context } : {}),
    ...(language ? { language } : {}),
    ...(date ? { date } : {}),
    ...(year ? { year } : {}),
    ...(monthOnly ? { monthOnly } : {}),
  })

  return {
    name: 'releases-index',
    resolveId: (id) => (id === MODULE ? '\0' + id : undefined),
    load(id) {
      if (id !== '\0' + MODULE) return
      const groups = {
        products: ['2014', '2024'].flatMap((folder) =>
          files(`data/${folder}/products/**/*.json`).map((file) => ({ file, folder }))
        ),
        videogames: files('data/videogames/games/*/*.json'),
        merchandise: files('data/merchandising/items/*/*.json'),
        novels: files('data/novels/*/*.json'),
        rpgBooks: files('data/rol/books/*/*.json'),
        rpgSystems: files('data/rol/systems/*.json'),
      }
      // Para que el servidor de desarrollo regenere el módulo al cambiar cualquier JSON
      for (const file of Object.values(groups).flat()) {
        this.addWatchFile(join(root, typeof file === 'string' ? file : file.file))
      }
      const data = {
        products: groups.products.map(({ file, folder }) => ({ product: read(file), folder })),
        videogames: groups.videogames.map(read),
        merchandise: groups.merchandise.map(read),
        novels: groups.novels.map(read),
        rpgBooks: groups.rpgBooks.map(read),
        rpgSystems: groups.rpgSystems.map(read),
      }
      const today = new Intl.DateTimeFormat('en-CA', { timeZone: 'Europe/Madrid' }).format(
        new Date()
      )
      const { recent, upcoming } = splitReleases(releaseEntries(data), today)
      return `export default ${JSON.stringify({
        today,
        upcoming: upcoming.map(pick),
        recent: recent.map(pick),
        announced: announcedEntries(data, today).map(pick),
      })}`
    },
  }
}

// Resumen mensual de cambios del catálogo (virtual:monthly-summaries): por cada mes completo desde
// noviembre de 2026, qué cambió en data/ según el historial de git (scripts/monthly-summary.mjs y
// git-history.mjs). Necesita el historial completo: en un clon superficial avisa y no exporta
// meses, y en el build de producción falla para no publicar resúmenes vacíos.
function monthlySummaries(mode: string): Plugin {
  const MODULE = 'virtual:monthly-summaries'
  const root = import.meta.dirname
  let cached: string | undefined

  return {
    name: 'monthly-summaries',
    resolveId: (id) => (id === MODULE ? '\0' + id : undefined),
    load(id) {
      if (id !== '\0' + MODULE) return
      if (cached) return cached
      // SUMMARY_TODAY=AAAA-MM-DD permite probar en local cómo quedará un mes antes de que acabe
      const today =
        process.env.SUMMARY_TODAY ??
        new Intl.DateTimeFormat('en-CA', { timeZone: 'Europe/Madrid' }).format(new Date())
      let months: unknown[] = []
      if (isShallow(root)) {
        const message =
          'El clon de git es superficial: el resumen mensual necesita el historial completo (fetch-depth: 0)'
        if (mode === 'production') throw new Error(message)
        this.warn(message)
      } else {
        months = summaryMonths(today).map((month) => {
          // Los sistemas de rol y los medios, como estaban al acabar el mes
          const { changes, extra } = monthChanges(root, month, ['data/review-outlets.json'])
          const rpgSystems = changes
            .filter((change) => change.file.startsWith('data/rol/systems/') && change.after)
            .map((change) => change.after)
          const current = globSync('data/rol/systems/*.json', { cwd: root }).map((file) =>
            JSON.parse(readFileSync(join(root, file), 'utf-8'))
          )
          return {
            month,
            ...summarizeMonth(changes, {
              rpgSystems: [...rpgSystems, ...current],
              outlets: extra[0] ?? [],
            }),
          }
        })
      }
      cached = `export default ${JSON.stringify({ months })}`
      return cached
    },
  }
}

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), 'VITE_UMAMI_')

  return {
    plugins: [
      react(),
      tailwindcss(),
      umami(env.VITE_UMAMI_URL, env.VITE_UMAMI_WEBSITE_ID),
      novelsIndex(),
      comicsIndex(),
      rpgIndex(),
      releasesIndex(),
      monthlySummaries(mode),
    ],
    resolve: {
      alias: {
        '@': resolve(import.meta.dirname, './src'),
      },
    },
    build: {
      outDir: 'dist',
      rolldownOptions: {
        output: {
          codeSplitting: {
            groups: [
              {
                name: 'vendor',
                test: /node_modules[\\/](react|react-dom|react-router|react-router-dom|scheduler|cookie|set-cookie-parser)[\\/]/,
              },
              {
                name: 'ui',
                test: /node_modules[\\/](@heroicons[\\/]react|zustand)[\\/]/,
              },
            ],
          },
        },
      },
    },
    test: {
      globals: true,
      environment: 'jsdom',
      setupFiles: ['./src/test/setup.ts'],
      // El test de contraste lee los colores de globals.css (?raw); sin esto llega vacío
      css: { include: [/globals\.css/] },
      // Los worktrees de .claude/ son copias del repositorio con sus propias dependencias
      exclude: ['**/node_modules/**', '**/dist/**', '.claude/**'],
      // La caché de módulos no detecta los JSON nuevos que recoge import.meta.glob en data/
      fsModuleCache: false,
      // Los tests no deben depender de los IDs de afiliado que haya en el .env local
      env: {
        VITE_AFFILIATE_AMAZON_TAG: '',
        VITE_AFFILIATE_ADTRACTION_CHANNEL: '',
        VITE_AFFILIATE_GENERACION_X_PROGRAM: '',
        VITE_AFFILIATE_JUEGOS_MESA_REDONDA_PROGRAM: '',
        VITE_AFFILIATE_GOG_PROGRAM: '',
        VITE_AFFILIATE_INSTANT_GAMING_REFERRAL: '',
        VITE_AFFILIATE_AWIN_PUBLISHER: '',
        VITE_AFFILIATE_FANATICAL_PROGRAM: '',
        VITE_AFFILIATE_CASA_DEL_LIBRO_PROGRAM: '',
        VITE_AFFILIATE_NEXTORY_PROGRAM: '',
        VITE_AFFILIATE_NOSOLOROL_PROGRAM: '',
      },
    },
  }
})
