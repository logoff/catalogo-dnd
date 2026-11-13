import { describe, it, expect } from 'vitest'
import Ajv from 'ajv'
import addFormats from 'ajv-formats'
import schemaSource from '/data/schemas/merchandise.jsonschema?raw'
import inventory from '/data/merchandising/inventory.md?raw'
import type { Merchandise } from '@/types/merchandise'
import { getAllProducts } from './dataLoader'
import { getAllVideogames } from './videogameLoader'
import {
  compareByDate,
  enrichMerchandise,
  getAllMerchandise,
  getMerchandiseFiles,
} from './merchandiseLoader'

const ajv = new Ajv({ allErrors: true })
addFormats(ajv)
const validate = ajv.compile(JSON.parse(schemaSource))

// Imágenes de public/ con la ruta que usan los JSON (/images/…)
const publicImages = new Set(
  Object.keys(import.meta.glob('/public/images/merchandising/**/*')).map((path) =>
    path.replace(/^\/public/, '')
  )
)

const minimalItem: Merchandise = {
  slug: 'articulo',
  title: 'Artículo',
  group: 'books',
  kind: 'cookbook',
  manufacturer: 'Editorial',
  description: 'Qué es.\n\nPara quién es.',
  source: 'https://example.com/articulo',
  editions: [{ language: 'english' }],
  images: ['/images/merchandising/articulo/0.jpg'],
}

describe('esquema de merchandising', () => {
  it('acepta un artículo mínimo', () => {
    expect(validate(minimalItem)).toBe(true)
  })

  it('rechaza un tipo de otro grupo, un artículo sin fuente y campos desconocidos', () => {
    expect(validate({ ...minimalItem, kind: 'funko' })).toBe(false)
    const withoutSource: Partial<typeof minimalItem> = { ...minimalItem }
    delete withoutSource.source
    expect(validate(withoutSource)).toBe(false)
    expect(validate({ ...minimalItem, extra: 1 })).toBe(false)
  })

  it('acepta un juguete con una edición sin idioma', () => {
    expect(
      validate({
        ...minimalItem,
        group: 'figures',
        kind: 'lego',
        editions: [{ ean: '5702017583570' }],
      })
    ).toBe(true)
  })

  it('exige indicar si una edición en castellano salió en España, y solo en esas', () => {
    const spanish = { language: 'castellano', title: 'Artículo' }
    expect(validate({ ...minimalItem, editions: [spanish] })).toBe(false)
    expect(validate({ ...minimalItem, editions: [{ ...spanish, spain: false }] })).toBe(true)
    expect(validate({ ...minimalItem, editions: [{ language: 'english', spain: true }] })).toBe(
      false
    )
  })

  it('solo admite tiendas conocidas en los enlaces de compra', () => {
    const edition = (store: string) => ({
      language: 'english',
      purchase_links: [{ store, url: 'https://example.com/' }],
    })
    expect(validate({ ...minimalItem, editions: [edition('amazon')] })).toBe(true)
    expect(validate({ ...minimalItem, editions: [edition('ebay')] })).toBe(false)
  })
})

describe('enrichMerchandise', () => {
  it('toma el año de la fecha y lo deja vacío si no hay', () => {
    expect(enrichMerchandise({ ...minimalItem, date: '2020-10-20' }).year).toBe(2020)
    expect(enrichMerchandise(minimalItem).year).toBeNull()
  })

  it('distingue castellano publicado en España, solo fuera y ninguno', () => {
    const spanish = (spain: boolean) => ({ language: 'castellano' as const, spain })
    const spanishOf = (editions: Merchandise['editions']) =>
      enrichMerchandise({ ...minimalItem, editions }).spanish
    expect(spanishOf([{ language: 'english' }, spanish(true)])).toBe('spain')
    expect(spanishOf([spanish(false), spanish(true)])).toBe('spain')
    expect(spanishOf([{ language: 'english' }, spanish(false)])).toBe('elsewhere')
    expect(spanishOf([{ language: 'english' }])).toBe('none')
  })

  it('está a la venta si alguna edición tiene enlace de compra', () => {
    const link = { store: 'amazon' as const, url: 'https://www.amazon.es/dp/X/' }
    expect(enrichMerchandise(minimalItem).availableToBuy).toBe(false)
    expect(
      enrichMerchandise({
        ...minimalItem,
        editions: [{ language: 'english' }, { language: 'english', purchase_links: [link] }],
      }).availableToBuy
    ).toBe(true)
  })
})

describe('compareByDate', () => {
  it('ordena del más reciente al más antiguo, con los que no tienen fecha al final', () => {
    const item = (title: string, date?: string) => ({ ...minimalItem, title, date })
    const sorted = [item('Sin fecha'), item('Viejo', '2016'), item('Nuevo', '2024-04-01')]
      .sort(compareByDate)
      .map((i) => i.title)
    expect(sorted).toEqual(['Nuevo', 'Viejo', 'Sin fecha'])
  })
})

describe('datos de merchandising', () => {
  const files = getMerchandiseFiles()
  const items = getAllMerchandise()

  it('hay artículos', () => {
    expect(items.length).toBeGreaterThan(0)
  })

  it('todos cumplen el esquema', () => {
    const errors = Object.entries(files)
      .filter(([, item]) => !validate(item))
      .map(([path]) => `${path}: ${ajv.errorsText(validate.errors)}`)
    expect(errors).toEqual([])
  })

  it('cada archivo está en la carpeta de su grupo y se llama como su slug', () => {
    const mismatched = Object.entries(files)
      .filter(([path, item]) => !path.endsWith(`/items/${item.group}/${item.slug}.json`))
      .map(([path]) => path)
    expect(mismatched).toEqual([])
  })

  it('los slugs no se repiten', () => {
    const slugs = items.map((i) => i.slug)
    expect(slugs.filter((s, i) => slugs.indexOf(s) !== i)).toEqual([])
  })

  it('todos tienen una descripción de dos párrafos', () => {
    const wrong = items
      .filter((i) => i.description.split('\n\n').filter((p) => p.trim()).length !== 2)
      .map((i) => i.slug)
    expect(wrong).toEqual([])
  })

  it('todas las imágenes existen', () => {
    const missing = items.flatMap((i) =>
      i.images.filter((img) => !publicImages.has(img)).map((img) => `${i.slug}: ${img}`)
    )
    expect(missing).toEqual([])
  })

  it('los enlaces de compra no llevan parámetros de afiliado', () => {
    const AFFILIATE_PARAMS = ['tag', 'aff', 'affiliate', 'ref', 'a', 'as', 'partner']
    const withAffiliate = items.flatMap((i) =>
      i.editions
        .flatMap((e) => e.purchase_links ?? [])
        .filter((link) => {
          const url = new URL(link.url)
          return (
            url.hostname.includes('adtraction') ||
            AFFILIATE_PARAMS.some((param) => url.searchParams.has(param))
          )
        })
        .map((link) => `${i.slug}: ${link.url}`)
    )
    expect(withAffiliate).toEqual([])
  })

  it('los libros y videojuegos relacionados existen', () => {
    const products = getAllProducts()
    const games = getAllVideogames().map((g) => g.slug)
    const missing = items.flatMap((i) => [
      ...(i.related_products ?? [])
        .filter(
          (rel) => !products.some((p) => p.primaryEdition === rel.edition && p.code === rel.code)
        )
        .map((rel) => `${i.slug}: ${rel.edition}/${rel.code}`),
      ...(i.related_videogames ?? [])
        .filter((slug) => !games.includes(slug))
        .map((slug) => `${i.slug}: videojuego ${slug}`),
    ])
    expect(missing).toEqual([])
  })

  describe('inventario', () => {
    // Columna «Ficha» de las tablas del inventario: el slug, o «pendiente»
    const header = inventory
      .split('\n')
      .find((line) => line.startsWith('| #'))!
      .split('|')
      .map((cell) => cell.trim())
    const fichaIndex = header.indexOf('Ficha')
    const inventorySlugs = inventory
      .split('\n')
      .filter((line) => /^\|\s*\d+\s*\|/.test(line))
      .map((line) => line.split('|').map((cell) => cell.trim())[fichaIndex])
      .filter((ficha) => ficha !== 'pendiente')

    it('cada ficha está en el inventario', () => {
      const missing = items.map((i) => i.slug).filter((slug) => !inventorySlugs.includes(slug))
      expect(missing).toEqual([])
    })

    it('cada entrada con ficha en el inventario tiene su JSON', () => {
      const slugs = items.map((i) => i.slug)
      expect(inventorySlugs.filter((slug) => !slugs.includes(slug))).toEqual([])
    })
  })
})
