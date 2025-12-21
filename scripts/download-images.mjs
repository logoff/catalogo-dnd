#!/usr/bin/env node

/**
 * Script para descargar todas las imágenes externas y organizarlas localmente
 *
 * Uso: node scripts/download-images.mjs
 *
 * Las imágenes se guardarán en public/images/products/{code}/{index}.jpg
 * y se actualizarán los archivos JSON con las nuevas rutas
 */

import { readFileSync, writeFileSync, readdirSync, statSync, mkdirSync, existsSync } from 'fs'
import { join, dirname, extname } from 'path'
import { fileURLToPath } from 'url'
import https from 'https'
import http from 'http'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const DATA_DIR = join(__dirname, '..', 'data')
const IMAGES_DIR = join(__dirname, '..', 'public', 'images', 'products')

// Extensiones de imagen válidas
const IMAGE_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.gif', '.webp']

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

function getExtensionFromUrl(url) {
  try {
    const urlObj = new URL(url)
    const pathname = urlObj.pathname
    const ext = extname(pathname).toLowerCase()
    if (IMAGE_EXTENSIONS.includes(ext)) {
      return ext
    }
  } catch (e) {
    // ignore
  }
  return '.jpg' // default
}

function downloadImage(url, destPath) {
  return new Promise((resolve, reject) => {
    const protocol = url.startsWith('https') ? https : http

    const request = protocol.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; DnD-Catalog/1.0)'
      },
      timeout: 30000
    }, (response) => {
      // Handle redirects
      if (response.statusCode >= 300 && response.statusCode < 400 && response.headers.location) {
        downloadImage(response.headers.location, destPath).then(resolve).catch(reject)
        return
      }

      if (response.statusCode !== 200) {
        reject(new Error(`HTTP ${response.statusCode} for ${url}`))
        return
      }

      const chunks = []
      response.on('data', (chunk) => chunks.push(chunk))
      response.on('end', () => {
        const buffer = Buffer.concat(chunks)
        writeFileSync(destPath, buffer)
        resolve(destPath)
      })
      response.on('error', reject)
    })

    request.on('error', reject)
    request.on('timeout', () => {
      request.destroy()
      reject(new Error(`Timeout downloading ${url}`))
    })
  })
}

function isExternalUrl(url) {
  return url.startsWith('http://') || url.startsWith('https://')
}

async function processProduct(filePath) {
  const content = JSON.parse(readFileSync(filePath, 'utf-8'))
  const code = content.code.toLowerCase()
  let modified = false
  const results = { downloaded: 0, errors: [], skipped: 0 }

  for (let pubIndex = 0; pubIndex < content.publications.length; pubIndex++) {
    const pub = content.publications[pubIndex]

    if (!pub.images || pub.images.length === 0) continue

    const newImages = []

    for (let imgIndex = 0; imgIndex < pub.images.length; imgIndex++) {
      const imageUrl = pub.images[imgIndex]

      if (!isExternalUrl(imageUrl)) {
        // Ya es local, mantener
        newImages.push(imageUrl)
        results.skipped++
        continue
      }

      // Crear directorio para el producto
      const productDir = join(IMAGES_DIR, code)
      if (!existsSync(productDir)) {
        mkdirSync(productDir, { recursive: true })
      }

      // Nombre del archivo: pub{pubIndex}_img{imgIndex}.ext
      const ext = getExtensionFromUrl(imageUrl)
      const filename = `pub${pubIndex}_img${imgIndex}${ext}`
      const destPath = join(productDir, filename)
      const localPath = `/images/products/${code}/${filename}`

      // Si ya existe, no descargar de nuevo
      if (existsSync(destPath)) {
        newImages.push(localPath)
        results.skipped++
        modified = true
        continue
      }

      try {
        console.log(`  Descargando: ${imageUrl}`)
        await downloadImage(imageUrl, destPath)
        newImages.push(localPath)
        results.downloaded++
        modified = true

        // Pequeña pausa para no sobrecargar servidores
        await new Promise(r => setTimeout(r, 200))
      } catch (error) {
        console.error(`  Error: ${error.message}`)
        // Mantener URL original si falla
        newImages.push(imageUrl)
        results.errors.push({ url: imageUrl, error: error.message })
      }
    }

    pub.images = newImages

    // También procesar sub_publications si existen
    if (pub.sub_publications) {
      for (let subIndex = 0; subIndex < pub.sub_publications.length; subIndex++) {
        const subPub = pub.sub_publications[subIndex]

        if (!subPub.images || subPub.images.length === 0) continue

        const newSubImages = []

        for (let imgIndex = 0; imgIndex < subPub.images.length; imgIndex++) {
          const imageUrl = subPub.images[imgIndex]

          if (!isExternalUrl(imageUrl)) {
            newSubImages.push(imageUrl)
            results.skipped++
            continue
          }

          const productDir = join(IMAGES_DIR, code)
          if (!existsSync(productDir)) {
            mkdirSync(productDir, { recursive: true })
          }

          const ext = getExtensionFromUrl(imageUrl)
          const filename = `pub${pubIndex}_sub${subIndex}_img${imgIndex}${ext}`
          const destPath = join(productDir, filename)
          const localPath = `/images/products/${code}/${filename}`

          if (existsSync(destPath)) {
            newSubImages.push(localPath)
            results.skipped++
            modified = true
            continue
          }

          try {
            console.log(`  Descargando (sub): ${imageUrl}`)
            await downloadImage(imageUrl, destPath)
            newSubImages.push(localPath)
            results.downloaded++
            modified = true
            await new Promise(r => setTimeout(r, 200))
          } catch (error) {
            console.error(`  Error (sub): ${error.message}`)
            newSubImages.push(imageUrl)
            results.errors.push({ url: imageUrl, error: error.message })
          }
        }

        subPub.images = newSubImages
      }
    }
  }

  // Guardar cambios si hubo modificaciones
  if (modified) {
    writeFileSync(filePath, JSON.stringify(content, null, 2) + '\n')
  }

  return results
}

async function main() {
  console.log('🔍 Buscando productos...\n')

  const productFiles = getProductFiles(DATA_DIR)
  console.log(`📦 Encontrados ${productFiles.length} productos\n`)

  let totalDownloaded = 0
  let totalSkipped = 0
  let totalErrors = []

  for (const filePath of productFiles) {
    const relativePath = filePath.replace(DATA_DIR + '/', '')
    console.log(`\n📄 ${relativePath}`)

    const results = await processProduct(filePath)
    totalDownloaded += results.downloaded
    totalSkipped += results.skipped
    totalErrors.push(...results.errors)

    if (results.downloaded > 0) {
      console.log(`   ✓ ${results.downloaded} descargadas`)
    }
    if (results.skipped > 0) {
      console.log(`   ⏭ ${results.skipped} omitidas (ya locales)`)
    }
  }

  console.log('\n' + '='.repeat(50))
  console.log('📊 RESUMEN')
  console.log('='.repeat(50))
  console.log(`✓ Descargadas: ${totalDownloaded}`)
  console.log(`⏭ Omitidas: ${totalSkipped}`)
  console.log(`✗ Errores: ${totalErrors.length}`)

  if (totalErrors.length > 0) {
    console.log('\n❌ Errores:')
    for (const err of totalErrors) {
      console.log(`   ${err.url}`)
      console.log(`     → ${err.error}`)
    }
  }

  console.log('\n✅ Proceso completado')
}

main().catch(console.error)
