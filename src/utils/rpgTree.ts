// Colocación del árbol genealógico de sistemas, sin dependencias del navegador. Cada sistema ocupa
// una fila, por orden de fecha, y las columnas son líneas evolutivas: un sistema sigue en la
// columna de su padre si es su heredero y, si no, abre o reutiliza otra
import type { DerivationKind, RpgSystem } from '../types/rpg.ts'

export interface TreeNode {
  system: RpgSystem
  row: number
  column: number
}

export interface TreeEdge {
  from: string
  to: string
  kind: DerivationKind
}

export interface RpgTree {
  nodes: TreeNode[]
  edges: TreeEdge[]
  columns: number
}

const byDate = (a: RpgSystem, b: RpgSystem) =>
  a.date.localeCompare(b.date) ||
  Number(!!b.official) - Number(!!a.official) ||
  a.name.localeCompare(b.name)

// El padre principal de un sistema es el primero de sus derivaciones que esté en el árbol
function mainParent(system: RpgSystem, slugs: Set<string>): string | undefined {
  return system.derived_from?.find((d) => slugs.has(d.system))?.system
}

export function buildRpgTree(systems: RpgSystem[]): RpgTree {
  const sorted = [...systems].sort(byDate)
  const slugs = new Set(sorted.map((s) => s.slug))
  const bySlug = new Map(sorted.map((s) => [s.slug, s]))
  const children = new Map<string, RpgSystem[]>()
  for (const system of sorted) {
    const parent = mainParent(system, slugs)
    if (parent) children.set(parent, [...(children.get(parent) ?? []), system])
  }

  // Longitud de la línea que cuelga de cada sistema, para elegir qué hijo la continúa
  const depthCache = new Map<string, number>()
  const depth = (slug: string): number => {
    if (!depthCache.has(slug)) {
      const kids = children.get(slug) ?? []
      depthCache.set(slug, kids.length ? 1 + Math.max(...kids.map((k) => depth(k.slug))) : 0)
    }
    return depthCache.get(slug)!
  }

  // El heredero de un sistema continúa su columna: primero los de su misma familia y, entre
  // ellos, el de la línea más larga y, a igualdad, el más antiguo
  const heir = new Map<string, string>()
  for (const [slug, kids] of children) {
    const family = bySlug.get(slug)!.family
    const best = [...kids].sort(
      (a, b) =>
        Number(b.family === family) - Number(a.family === family) ||
        depth(b.slug) - depth(a.slug) ||
        byDate(a, b)
    )[0]
    heir.set(slug, best.slug)
  }

  const nodes: TreeNode[] = []
  const columnOf = new Map<string, number>()
  // Fila en la que termina cada columna (-1 si sigue abierta)
  const columnEnd: number[] = []
  sorted.forEach((system, row) => {
    const parent = mainParent(system, slugs)
    let column: number
    if (parent && heir.get(parent) === system.slug) {
      column = columnOf.get(parent)!
    } else {
      // La columna que lleva más tiempo libre, y nunca justo debajo de un sistema que no es su
      // padre (dejaría ver una línea que no existe); si no hay ninguna libre, una nueva
      column = columnEnd.length
      columnEnd.forEach((end, i) => {
        if (end !== -1 && end < row - 1 && (column === columnEnd.length || end < columnEnd[column]))
          column = i
      })
    }
    columnOf.set(system.slug, column)
    // La columna queda libre si nadie continúa este sistema
    columnEnd[column] = heir.has(system.slug) ? -1 : row
    nodes.push({ system, row, column })
  })

  const edges: TreeEdge[] = sorted.flatMap((system) =>
    (system.derived_from ?? [])
      .filter((d) => slugs.has(d.system))
      .map((d) => ({ from: d.system, to: system.slug, kind: d.kind }))
  )

  return { nodes, edges, columns: columnEnd.length }
}
