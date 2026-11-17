/// <reference types="vitest" />
import { defineConfig, loadEnv, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { readFileSync, readdirSync } from 'fs'
import { join, resolve } from 'path'
import { buildNovelIndex } from './src/utils/novels.ts'
import type { Novel, NovelSeries } from './src/types/novel.ts'

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

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), 'VITE_UMAMI_')

  return {
    plugins: [
      react(),
      tailwindcss(),
      umami(env.VITE_UMAMI_URL, env.VITE_UMAMI_WEBSITE_ID),
      novelsIndex(),
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
      },
    },
  }
})
