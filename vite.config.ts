/// <reference types="vitest" />
import { defineConfig, loadEnv, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { resolve } from 'path'

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

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), 'VITE_UMAMI_')

  return {
    plugins: [react(), tailwindcss(), umami(env.VITE_UMAMI_URL, env.VITE_UMAMI_WEBSITE_ID)],
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
    },
  }
})
