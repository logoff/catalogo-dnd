import { describe, it, expect } from 'vitest'
import Ajv from 'ajv'
import addFormats from 'ajv-formats'
import schemaSource from '/data/schemas/product.jsonschema?raw'
import reviewSchemaSource from '/data/schemas/review.jsonschema?raw'
import outletsSchemaSource from '/data/schemas/review-outlets.jsonschema?raw'
import type { Product, Review } from '@/types'
import { getAllProducts } from './dataLoader'
import { getAllReviewOutlets, getReviewOutlet } from './reviewOutlets'
import { reviewProblems as sharedReviewProblems } from '@/utils/reviewRules'

const ajv = new Ajv({ allErrors: true })
addFormats(ajv)
ajv.addSchema(JSON.parse(reviewSchemaSource))
const validate = ajv.compile(JSON.parse(schemaSource))

const productFiles = import.meta.glob<unknown>('/data/**/products/**/*.json', {
  eager: true,
  import: 'default',
})

describe('datos de productos', () => {
  it('todos los productos cumplen el esquema', () => {
    const invalid = Object.entries(productFiles).flatMap(([path, product]) =>
      validate(product) ? [] : [`${path}: ${ajv.errorsText(validate.errors)}`]
    )
    expect(invalid).toEqual([])
  })

  it('todos los productos tienen descripción', () => {
    const withoutDescription = getAllProducts()
      .filter((p) => !p.description?.trim())
      .map((p) => `${p.primaryEdition}/${p.code}`)
    expect(withoutDescription).toEqual([])
  })

  it('el catálogo de libros no incluye los videojuegos', () => {
    const notProducts = getAllProducts()
      .filter((p) => !Array.isArray(p.publications) || p.publications.length === 0)
      .map((p) => p.code ?? p.slug)
    expect(notProducts).toEqual([])
  })

  it('todos los ISBN-13 tienen un dígito de control válido', () => {
    const isValidIsbn13 = (isbn: number) => {
      const digits = String(isbn)
      if (!/^\d{13}$/.test(digits)) return false
      const sum = [...digits].reduce((acc, d, i) => acc + Number(d) * (i % 2 === 0 ? 1 : 3), 0)
      return sum % 10 === 0
    }
    const invalid = getAllProducts()
      .flatMap((p) => p.publications)
      .filter((pub) => pub.isbn13 !== undefined && !isValidIsbn13(pub.isbn13))
      .map((pub) => `${pub.title}: ${pub.isbn13}`)
    expect(invalid).toEqual([])
  })
})

describe('esquema de las reseñas', () => {
  const review: Review = {
    outlet: 'wargamer',
    url: 'https://www.wargamer.com/dnd/2024-players-handbook-review',
    language: 'english',
    date: '2024-08-29',
    score: 9,
    summary: 'Resumen propio.',
  }
  const withReviews = (reviews: object[]): Product => ({
    code: 'PHB',
    reviews: reviews as Review[],
    publications: [{ type: 'book', subtype: 'core_rules', edition: '2024', title: 'PHB' }],
  })

  it('acepta una reseña válida', () => {
    expect(validate(withReviews([review]))).toBe(true)
  })

  it('rechaza una reseña sin resumen', () => {
    expect(validate(withReviews([{ ...review, summary: undefined }]))).toBe(false)
  })

  it('rechaza un resumen de más de 400 caracteres', () => {
    expect(validate(withReviews([{ ...review, summary: 'a'.repeat(401) }]))).toBe(false)
  })

  it('rechaza propiedades desconocidas', () => {
    expect(validate(withReviews([{ ...review, quote: 'Texto del medio' }]))).toBe(false)
  })
})

// Reglas comunes de las reseñas más las propias de los libros; devuelve un aviso por problema
function reviewProblems(product: Product): string[] {
  const reviews = product.reviews ?? []
  const problems = sharedReviewProblems(product.code, reviews, getReviewOutlet)
  if (reviews.length && !product.publications.every((pub) => pub.type === 'book')) {
    problems.push(`${product.code}: solo los libros llevan reseñas`)
  }
  const hasSpanish = product.publications.some((pub) => pub.language === 'castellano')
  if (reviews.some((review) => review.spanish_edition) && !hasSpanish) {
    problems.push(`${product.code}: reseña de la edición en castellano sin edición en castellano`)
  }
  return problems
}

// Libros publicados en inglés hace más de 90 días sin ninguna reseña (las reseñas tardan en salir)
function booksWithoutReviews(products: Product[], today: string): string[] {
  const limit = new Date(today)
  limit.setDate(limit.getDate() - 90)
  const cutoff = limit.toISOString().slice(0, 10)
  return products
    .filter((product) => product.publications.every((pub) => pub.type === 'book'))
    .filter((product) =>
      product.publications.some(
        (pub) => pub.language === 'english' && pub.date && pub.date <= cutoff
      )
    )
    .filter((product) => !product.reviews?.length)
    .map((product) => product.code)
}

describe('cobertura de las reseñas', () => {
  const book = (date: string | undefined, reviews: Review[] = []): Product => ({
    code: 'TEST',
    reviews,
    publications: [
      {
        type: 'book',
        subtype: 'core_rules',
        edition: '2024',
        title: 'T',
        language: 'english',
        date,
      },
    ],
  })
  const review: Review = {
    outlet: 'wargamer',
    url: 'https://www.wargamer.com/dnd/review',
    language: 'english',
    date: '2024-01-01',
    summary: 'Resumen propio.',
  }
  const today = new Date().toISOString().slice(0, 10)

  it('todo libro publicado hace más de 90 días tiene al menos una reseña', () => {
    expect(booksWithoutReviews(getAllProducts(), today)).toEqual([])
  })

  it('un libro publicado sin reseñas falla', () => {
    expect(booksWithoutReviews([book('2020-01-01')], '2026-11-18')).toEqual(['TEST'])
    expect(booksWithoutReviews([book('2020-01-01', [review])], '2026-11-18')).toEqual([])
  })

  it('quedan exentos los anunciados y los publicados hace menos de 90 días', () => {
    expect(booksWithoutReviews([book(undefined), book('2027-01-01')], '2026-11-18')).toEqual([])
    expect(booksWithoutReviews([book('2026-09-15')], '2026-11-18')).toEqual([])
    expect(booksWithoutReviews([book('2026-08-01')], '2026-11-18')).toEqual(['TEST'])
  })
})

describe('reglas de las reseñas', () => {
  const review: Review = {
    outlet: 'wargamer',
    url: 'https://www.wargamer.com/dnd/review',
    language: 'english',
    date: '2024-08-29',
    summary: 'Resumen propio.',
  }
  const book = (reviews: Review[], language: 'english' | 'castellano' = 'english'): Product => ({
    code: 'TEST',
    reviews,
    publications: [{ type: 'book', subtype: 'core_rules', edition: '2024', title: 'T', language }],
  })

  it('los datos reales cumplen las reglas', () => {
    expect(getAllProducts().flatMap(reviewProblems)).toEqual([])
  })

  it('una reseña correcta no da problemas', () => {
    expect(reviewProblems(book([{ ...review, score: 9 }]))).toEqual([])
  })

  it('el medio tiene que estar en la lista', () => {
    expect(reviewProblems(book([{ ...review, outlet: 'blog-de-un-amigo' }]))).toHaveLength(1)
  })

  it('la nota tiene que caber en la escala del medio', () => {
    expect(reviewProblems(book([{ ...review, score: 12 }]))).toHaveLength(1)
  })

  it('un medio sin escala no puede tener nota', () => {
    expect(reviewProblems(book([{ ...review, outlet: 'polygon', score: 8 }]))).toHaveLength(1)
  })

  it('un libro no repite la URL de una reseña', () => {
    expect(reviewProblems(book([review, review]))).toHaveLength(1)
  })

  it('la marca de edición en castellano exige una edición en castellano', () => {
    const marked = { ...review, spanish_edition: true as const }
    expect(reviewProblems(book([marked]))).toHaveLength(1)
    expect(reviewProblems(book([marked], 'castellano'))).toEqual([])
  })

  it('solo los libros llevan reseñas', () => {
    const accessory: Product = {
      code: 'SCREEN',
      reviews: [review],
      publications: [{ type: 'accessory', subtype: 'screen', edition: '2024', title: 'S' }],
    }
    expect(reviewProblems(accessory)).toHaveLength(1)
  })
})

describe('medios de las reseñas', () => {
  const validateOutlets = ajv.compile(JSON.parse(outletsSchemaSource))

  it('la lista de medios cumple el esquema', () => {
    const valid = validateOutlets(getAllReviewOutlets())
    expect(ajv.errorsText(validateOutlets.errors)).toBe('No errors')
    expect(valid).toBe(true)
  })

  it('cada medio tiene un id único', () => {
    const ids = getAllReviewOutlets().map((outlet) => outlet.id)
    expect(ids.filter((id, index) => ids.indexOf(id) !== index)).toEqual([])
  })
})
