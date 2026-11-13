import type { Merchandise, MerchandiseSpanish, MerchandiseWithMeta } from '@/types/merchandise'

// Todos los JSON de merchandising, importados en tiempo de build
const merchandiseModules = import.meta.glob<Merchandise>('/data/merchandising/items/**/*.json', {
  eager: true,
  import: 'default',
})

function spanishOf(item: Merchandise): MerchandiseSpanish {
  const spanish = item.editions.filter((edition) => edition.language === 'castellano')
  if (spanish.some((edition) => edition.spain)) return 'spain'
  return spanish.length > 0 ? 'elsewhere' : 'none'
}

export function enrichMerchandise(item: Merchandise): MerchandiseWithMeta {
  return {
    ...item,
    year: item.date ? Number(item.date.slice(0, 4)) : null,
    spanish: spanishOf(item),
    availableToBuy: item.editions.some((edition) => (edition.purchase_links ?? []).length > 0),
  }
}

// Del más reciente al más antiguo; los que no tienen fecha, al final
export function compareByDate(a: Merchandise, b: Merchandise): number {
  return (b.date ?? '').localeCompare(a.date ?? '') || a.title.localeCompare(b.title)
}

let cachedMerchandise: MerchandiseWithMeta[] | null = null

export function getAllMerchandise(): MerchandiseWithMeta[] {
  if (!cachedMerchandise) {
    cachedMerchandise = Object.values(merchandiseModules).map(enrichMerchandise).sort(compareByDate)
  }
  return cachedMerchandise
}

export function getMerchandiseBySlug(slug: string): MerchandiseWithMeta | undefined {
  return getAllMerchandise().find((item) => item.slug === slug)
}

// Rutas de los JSON, para los tests de datos
export function getMerchandiseFiles(): Record<string, Merchandise> {
  return merchandiseModules
}
