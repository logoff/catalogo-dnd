import { describe, it, expect } from 'vitest'
import type { ProductWithMeta, Publication } from '@/types'
import { filterProducts, getFacetCounts, type ProductFilters } from './productFilters'

function product(
  code: string,
  edition: ProductWithMeta['primaryEdition'],
  publications: Partial<Publication>[]
): ProductWithMeta {
  const pubs = publications.map((p) => ({
    type: 'book',
    subtype: 'adventure',
    edition,
    title: code,
    ...p,
  })) as Publication[]
  return {
    code,
    publications: pubs,
    primaryTitle: code,
    primaryEdition: edition,
    primaryType: pubs[0].type,
    primarySubtype: pubs[0].subtype,
    languages: [...new Set(pubs.map((p) => p.language).filter((l) => l !== undefined))],
    dateRange: { earliest: null, latest: null },
    slug: code.toLowerCase(),
  }
}

const products = [
  product('COS', '5e', [{ subtype: 'adventure', language: 'english' }]),
  product('SCAG', '5e', [{ subtype: 'setting', language: 'castellano' }]),
  product('PHB24', '2024', [
    { subtype: 'core_rules', language: 'english' },
    { subtype: 'core_rules', language: 'castellano' },
  ]),
  product('DMS', '2024', [{ type: 'accessory', subtype: 'screen', language: 'english' }]),
]

const noFilters: ProductFilters = {
  searchQuery: '',
  editions: [],
  types: [],
  subtypes: [],
  languages: [],
}

describe('filterProducts', () => {
  it('sin filtros devuelve todos los productos', () => {
    expect(filterProducts(products, noFilters)).toHaveLength(4)
  })

  it('combina facetas distintas con Y y opciones de una faceta con O', () => {
    const result = filterProducts(products, {
      ...noFilters,
      editions: ['2024'],
      subtypes: ['core_rules', 'screen'],
      languages: ['castellano'],
    })
    expect(result.map((p) => p.code)).toEqual(['PHB24'])
  })

  it('busca por texto', () => {
    const result = filterProducts(products, { ...noFilters, searchQuery: 'scag' })
    expect(result.map((p) => p.code)).toEqual(['SCAG'])
  })
})

describe('getFacetCounts', () => {
  it('sin filtros cuenta cada producto una vez por opción', () => {
    const counts = getFacetCounts(products, noFilters)
    expect(counts.editions).toEqual({ '5e': 2, '2024': 2 })
    expect(counts.subtypes).toEqual({ adventure: 1, setting: 1, core_rules: 1, screen: 1 })
    expect(counts.languages).toEqual({ english: 3, castellano: 2 })
  })

  it('las demás facetas se cuentan con la edición seleccionada', () => {
    const counts = getFacetCounts(products, { ...noFilters, editions: ['2024'] })
    expect(counts.subtypes).toEqual({ core_rules: 1, screen: 1 })
    expect(counts.types).toEqual({ book: 1, accessory: 1 })
  })

  it('una faceta no se filtra por sus propias opciones marcadas', () => {
    const counts = getFacetCounts(products, { ...noFilters, editions: ['2024'] })
    expect(counts.editions).toEqual({ '5e': 2, '2024': 2 })
  })

  it('respeta la búsqueda', () => {
    const counts = getFacetCounts(products, { ...noFilters, searchQuery: 'cos' })
    expect(counts.editions).toEqual({ '5e': 1 })
  })
})
