import type {
  Edition,
  Language,
  ProductWithMeta,
  PublicationSubtype,
  PublicationType,
} from '@/types'

export interface ProductFilters {
  searchQuery: string
  editions: Edition[]
  types: PublicationType[]
  subtypes: PublicationSubtype[]
  languages: Language[]
}

type Facet = 'editions' | 'types' | 'subtypes' | 'languages'

export interface FacetCounts {
  editions: Partial<Record<Edition, number>>
  types: Partial<Record<PublicationType, number>>
  subtypes: Partial<Record<PublicationSubtype, number>>
  languages: Partial<Record<Language, number>>
}

function matchesSearch(product: ProductWithMeta, searchQuery: string): boolean {
  if (!searchQuery.trim()) return true
  const query = searchQuery.toLowerCase()
  const searchableText = [
    product.code,
    product.primaryTitle,
    ...product.publications.flatMap((p) => [
      p.title,
      ...(p.authors || []),
      p.isbn13?.toString(),
      p.publisher,
    ]),
  ]
    .filter(Boolean)
    .join(' ')
    .toLowerCase()
  return searchableText.includes(query)
}

// Valores de cada faceta que tiene un producto
function facetValues(product: ProductWithMeta, facet: Facet): string[] {
  switch (facet) {
    case 'editions':
      return [product.primaryEdition]
    case 'types':
      return product.publications.map((p) => p.type)
    case 'subtypes':
      return product.publications.map((p) => p.subtype)
    case 'languages':
      return product.languages
  }
}

const FACETS: Facet[] = ['editions', 'types', 'subtypes', 'languages']

// Cumple todos los filtros salvo, si se indica, el de una faceta
function matchesFilters(product: ProductWithMeta, filters: ProductFilters, except?: Facet) {
  if (!matchesSearch(product, filters.searchQuery)) return false
  return FACETS.every((facet) => {
    const selected: string[] = filters[facet]
    if (facet === except || selected.length === 0) return true
    return facetValues(product, facet).some((value) => selected.includes(value))
  })
}

export function filterProducts(
  products: ProductWithMeta[],
  filters: ProductFilters
): ProductWithMeta[] {
  return products.filter((product) => matchesFilters(product, filters))
}

// Cuántos productos daría cada opción si se marcara, teniendo en cuenta el resto de
// filtros activos pero no los de su propia faceta (dentro de una faceta las opciones se suman)
export function getFacetCounts(products: ProductWithMeta[], filters: ProductFilters): FacetCounts {
  const counts: Record<Facet, Record<string, number>> = {
    editions: {},
    types: {},
    subtypes: {},
    languages: {},
  }
  for (const facet of FACETS) {
    for (const product of products) {
      if (!matchesFilters(product, filters, facet)) continue
      for (const value of new Set(facetValues(product, facet))) {
        counts[facet][value] = (counts[facet][value] ?? 0) + 1
      }
    }
  }
  return counts
}
