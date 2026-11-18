import type { Product, ProductWithMeta, Language, Edition } from '@/types'
import { slugify } from '@/utils/formatters'

// Import all JSON files at build time
const productModules = import.meta.glob<Product>('/data/**/products/**/*.json', {
  eager: true,
  import: 'default',
})

function extractEditionFromPath(path: string): Edition {
  if (path.includes('/2024/')) return '2024'
  return '5e'
}

function extractCategoryFromPath(path: string): { category: string; subcategory: string } {
  // Example path: /data/2024/products/01_books/01_core_rules/001_phb.json
  const parts = path.split('/')
  const productsIndex = parts.indexOf('products')

  if (productsIndex >= 0 && parts.length > productsIndex + 2) {
    return {
      category: parts[productsIndex + 1] || '',
      subcategory: parts[productsIndex + 2] || '',
    }
  }

  return { category: '', subcategory: '' }
}

function enrichProduct(product: Product, path: string): ProductWithMeta {
  const firstPub = product.publications[0]
  const edition = extractEditionFromPath(path)

  // Extract all unique languages
  const languages = [
    ...new Set(
      product.publications.map((p) => p.language).filter((lang): lang is Language => !!lang)
    ),
  ]

  // Calculate date range
  const dates = product.publications
    .map((p) => p.date)
    .filter((d): d is string => !!d)
    .sort()

  return {
    ...product,
    primaryTitle: firstPub?.title ?? product.code,
    primaryEdition: edition,
    primaryType: firstPub?.type ?? 'book',
    primarySubtype: firstPub?.subtype ?? 'core_rules',
    languages,
    dateRange: {
      earliest: dates[0] ?? null,
      latest: dates[dates.length - 1] ?? null,
    },
    slug: slugify(product.code),
  }
}

// Load and process all products
export function loadAllProducts(): ProductWithMeta[] {
  const products: ProductWithMeta[] = []

  for (const [path, product] of Object.entries(productModules)) {
    products.push(enrichProduct(product, path))
  }

  // Sort by code
  products.sort((a, b) => a.code.localeCompare(b.code))

  return products
}

// Get products by edition
export function getProductsByEdition(edition: Edition): ProductWithMeta[] {
  return loadAllProducts().filter((p) => p.primaryEdition === edition)
}

// Get product by code
export function getProductByCode(code: string): ProductWithMeta | undefined {
  return loadAllProducts().find(
    (p) => p.code.toLowerCase() === code.toLowerCase() || p.slug === code.toLowerCase()
  )
}

// Get product by code and edition
export function getProductByCodeAndEdition(
  code: string,
  edition: Edition
): ProductWithMeta | undefined {
  return loadAllProducts().find(
    (p) =>
      (p.code.toLowerCase() === code.toLowerCase() || p.slug === code.toLowerCase()) &&
      p.primaryEdition === edition
  )
}

// Get category structure for navigation
export interface CategoryNode {
  id: string
  name: string
  path: string
  count: number
  children: CategoryNode[]
}

export function getCategoryTree(edition: Edition): CategoryNode[] {
  const editionPath = edition === '5e' ? '2014' : '2024'
  const categories: Map<string, CategoryNode> = new Map()

  for (const [path] of Object.entries(productModules)) {
    if (!path.includes(`/${editionPath}/`)) continue

    const { category, subcategory } = extractCategoryFromPath(path)
    if (!category) continue

    // Get or create category
    if (!categories.has(category)) {
      categories.set(category, {
        id: category,
        name: category,
        path: `/${editionPath === '2014' ? '2014' : '2024'}/${category}`,
        count: 0,
        children: [],
      })
    }

    const categoryNode = categories.get(category)!
    categoryNode.count++

    // Get or create subcategory
    if (subcategory) {
      let subNode = categoryNode.children.find((c) => c.id === subcategory)
      if (!subNode) {
        subNode = {
          id: subcategory,
          name: subcategory,
          path: `/${editionPath === '2014' ? '2014' : '2024'}/${category}/${subcategory}`,
          count: 0,
          children: [],
        }
        categoryNode.children.push(subNode)
      }
      subNode.count++
    }
  }

  return Array.from(categories.values()).sort((a, b) => a.id.localeCompare(b.id))
}

// Cached products for performance
let cachedProducts: ProductWithMeta[] | null = null

export function getAllProducts(): ProductWithMeta[] {
  if (!cachedProducts) {
    cachedProducts = loadAllProducts()
  }
  return cachedProducts
}
