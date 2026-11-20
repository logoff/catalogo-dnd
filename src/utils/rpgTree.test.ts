import { describe, it, expect } from 'vitest'
import type { DerivationKind, RpgSystem } from '@/types/rpg'
import { buildRpgTree } from './rpgTree'

const system = (
  slug: string,
  date: string,
  family: string,
  derived: [string, DerivationKind][] = [],
  official = false
): RpgSystem => ({
  slug,
  name: slug,
  family,
  publisher: 'Editorial',
  date,
  description: 'Qué es.',
  features: [],
  licenses: [],
  derived_from: derived.map(([s, kind]) => ({ system: s, kind })),
  official,
  links: [],
})

const systems = [
  system('pf1', '2009', 'pf', [['dnd35', 'compatible']]),
  system('od', '1974', 'dnd', [], true),
  system('basic', '1977-07', 'dnd', [['od', 'compatible']], true),
  system('add1', '1977-12', 'dnd', [['od', 'compatible']], true),
  system('dnd35', '2003', 'dnd', [['add1', 'major_rewrite']], true),
  system('dnd4', '2008', 'dnd', [['dnd35', 'major_rewrite']], true),
  system('pf2', '2019', 'pf', [['pf1', 'major_rewrite']]),
]

describe('buildRpgTree', () => {
  const tree = buildRpgTree(systems)
  const node = (slug: string) => tree.nodes.find((n) => n.system.slug === slug)!

  it('pone una fila por sistema, por orden de fecha', () => {
    expect(tree.nodes.map((n) => n.system.slug)).toEqual([
      'od',
      'basic',
      'add1',
      'dnd35',
      'dnd4',
      'pf1',
      'pf2',
    ])
    expect(tree.nodes.map((n) => n.row)).toEqual([0, 1, 2, 3, 4, 5, 6])
  })

  it('continúa la columna con el heredero de la misma familia y la línea más larga', () => {
    // AD&D continúa la línea de D&D original (su línea es más larga que la de D&D básico)
    expect(node('add1').column).toBe(node('od').column)
    expect(node('basic').column).not.toBe(node('od').column)
    // La 4.ª continúa la línea de D&D aunque Pathfinder también derive de 3.5
    expect(node('dnd4').column).toBe(node('od').column)
    expect(node('pf2').column).toBe(node('pf1').column)
  })

  it('reutiliza las columnas de las líneas que terminan', () => {
    // D&D básico no tiene descendientes: Pathfinder ocupa su columna
    expect(node('pf1').column).toBe(node('basic').column)
    expect(tree.columns).toBe(2)
  })

  it('genera una arista por derivación, con su tipo', () => {
    expect(tree.edges).toContainEqual({ from: 'pf1', to: 'pf2', kind: 'major_rewrite' })
    expect(tree.edges).toHaveLength(6)
  })
})
