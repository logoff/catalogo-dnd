import { describe, expect, it } from 'vitest'
import type { RpgSystem } from '@/types/rpg'
import {
  linePublishers,
  movementBookProblem,
  movementProblem,
  reachesDnd,
  freeDownloadLabel,
} from './rpg'

const system = (slug: string, extra: Partial<RpgSystem> = {}): RpgSystem => ({
  slug,
  name: slug,
  family: slug,
  publisher: 'Editorial',
  date: '2000',
  description: '',
  features: [],
  licenses: [],
  links: [],
  ...extra,
})

const dnd = system('dnd-basic', { official: true })
const ose = system('ose', { derived_from: [{ system: 'dnd-basic', kind: 'compatible' }] })
const dolmenwood = system('dolmenwood', { derived_from: [{ system: 'ose', kind: 'compatible' }] })
const ito = system('into-the-odd', {
  derived_from: [{ system: 'dnd-basic', kind: 'inspiration', note: 'nota' }],
})
const cairn = system('cairn', { derived_from: [{ system: 'into-the-odd', kind: 'major_rewrite' }] })
const loose = system('suelto')
const systems = [dnd, ose, dolmenwood, ito, cairn, loose]

describe('reachesDnd', () => {
  it('llega directamente por una derivación real', () => {
    expect(reachesDnd(systems, ose, false)).toBe(true)
  })

  it('llega a través de otro sistema', () => {
    expect(reachesDnd(systems, dolmenwood, false)).toBe(true)
  })

  it('la inspiración solo cuenta si se admite', () => {
    expect(reachesDnd(systems, ito, false)).toBe(false)
    expect(reachesDnd(systems, ito, true)).toBe(true)
    expect(reachesDnd(systems, cairn, false)).toBe(false)
    expect(reachesDnd(systems, cairn, true)).toBe(true)
  })

  it('un sistema sin derivaciones no llega', () => {
    expect(reachesDnd(systems, loose, true)).toBe(false)
  })
})

describe('linePublishers', () => {
  it('por defecto es la editorial del sistema', () => {
    expect(linePublishers(ose)).toEqual(['Editorial'])
  })

  it('usa las editoriales de la línea si las hay', () => {
    expect(linePublishers(system('x', { line_publishers: ['A', 'B'] }))).toEqual(['A', 'B'])
  })
})

describe('movementProblem', () => {
  it('acepta un OSR que deriva de D&D y un NSR inspirado', () => {
    expect(movementProblem(systems, { ...dolmenwood, movement: 'osr' })).toBeNull()
    expect(movementProblem(systems, { ...cairn, movement: 'nsr' })).toBeNull()
  })

  it('rechaza un OSR solo inspirado, un NSR sin relación y una edición de D&D etiquetada', () => {
    expect(movementProblem(systems, { ...cairn, movement: 'osr' })).not.toBeNull()
    expect(movementProblem(systems, { ...loose, movement: 'nsr' })).not.toBeNull()
    expect(movementProblem(systems, { ...dnd, movement: 'osr' })).not.toBeNull()
  })

  it('las editoriales de la línea solo tienen sentido con movimiento', () => {
    expect(movementProblem(systems, ose)).toBeNull()
    expect(movementProblem(systems, { ...ose, line_publishers: ['A'] })).not.toBeNull()
  })
})

describe('movementBookProblem', () => {
  const edition = (
    language: 'english' | 'castellano',
    publisher: string,
    format?: 'pdf' | 'paperback'
  ) => ({
    language,
    publisher,
    ...(format ? { format } : {}),
  })

  it('acepta la línea propia en inglés, la impresión bajo demanda y lo de terceros en castellano', () => {
    expect(
      movementBookProblem({ editions: [edition('english', 'Editorial', 'paperback')] }, ose)
    ).toBeNull()
    expect(
      movementBookProblem({ editions: [edition('castellano', 'Otra', 'paperback')] }, ose)
    ).toBeNull()
  })

  it('rechaza lo de terceros solo en inglés, lo solo en PDF y las ediciones sin formato', () => {
    expect(
      movementBookProblem({ editions: [edition('english', 'Otra', 'paperback')] }, ose)
    ).not.toBeNull()
    expect(
      movementBookProblem({ editions: [edition('english', 'Editorial', 'pdf')] }, ose)
    ).not.toBeNull()
    expect(movementBookProblem({ editions: [edition('english', 'Editorial')] }, ose)).not.toBeNull()
  })

  it('acepta lo solo en PDF si la editorial lo ha liberado en Codex de la Marca', () => {
    const free = {
      ...edition('castellano', 'La Marca del Este', 'pdf'),
      free_download: 'https://codexdelamarca.com/posts/libre/',
    }
    expect(movementBookProblem({ editions: [free] }, ose)).toBeNull()
  })
})

describe('freeDownloadLabel', () => {
  it('nombra Codex de la Marca y deja genéricas las demás descargas', () => {
    expect(freeDownloadLabel('https://codexdelamarca.com/posts/libre/')).toBe(
      'Descarga gratuita en Codex de la Marca'
    )
    expect(freeDownloadLabel('https://nogarung.com/ve-revisada')).toBe('Descarga gratuita')
    expect(freeDownloadLabel('https://otrocodexdelamarca.com/x')).toBe('Descarga gratuita')
  })
})
