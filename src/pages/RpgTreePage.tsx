import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import MetaTags from '@/components/seo/MetaTags'
import Breadcrumbs from '@/components/common/Breadcrumbs'
import PageHeader from '@/components/ui/PageHeader'
import { headingClass } from '@/components/ui/styles'
import { RpgLoading, SECTION_NAME } from '@/components/rpg/RpgSection'
import { useRpgIndex } from '@/hooks/useRpgData'
import type { DerivationKind, RpgSystem } from '@/types/rpg'
import { systemPath } from '@/utils/rpg'
import { buildRpgTree, type TreeNode } from '@/utils/rpgTree'
import { derivationKindNames, licenseLabel } from '@/utils/rpgTranslations'

export const TREE_NAME = 'Árbol genealógico'

// Medidas del dibujo, en unidades del SVG
const GUTTER = 56
const COLUMN_WIDTH = 214
const NODE_WIDTH = 196
// Los nombres más largos se comprimen para que quepan en la caja
const MAX_NAME_LENGTH = 24
const NODE_HEIGHT = 46
const ROW_HEIGHT = 62
const PADDING = 12

// El tipo de derivación se distingue por el trazo (el rojo está reservado en el sistema de diseño)
const edgeStyles: Record<DerivationKind, { strokeWidth: number; strokeDasharray?: string }> = {
  revision: { strokeWidth: 1.5 },
  compatible: { strokeWidth: 1.5, strokeDasharray: '6 4' },
  major_rewrite: { strokeWidth: 3 },
  inspiration: { strokeWidth: 1.5, strokeDasharray: '1.5 4' },
}

const edgeOrder: DerivationKind[] = ['revision', 'compatible', 'major_rewrite', 'inspiration']

const GAP = COLUMN_WIDTH - NODE_WIDTH
const RADIUS = 6
const x = (column: number) => GUTTER + column * COLUMN_WIDTH
const y = (row: number) => PADDING + row * ROW_HEIGHT

// Trazado de una derivación. En la misma columna, una vertical (en una columna solo hay una línea
// evolutiva, así que no cruza otros sistemas). Hacia otra columna sale del lateral del padre, baja
// por el pasillo entre columnas, donde nunca hay cajas, y entra por el lateral del hijo
function edgePath(from: TreeNode, to: TreeNode, offset: number): string {
  if (from.column === to.column) {
    const cx = x(to.column) + NODE_WIDTH / 2
    return `M ${cx} ${y(from.row) + NODE_HEIGHT} L ${cx} ${y(to.row)}`
  }
  const right = to.column > from.column
  const y1 = y(from.row) + NODE_HEIGHT / 2
  const y2 = y(to.row) + NODE_HEIGHT / 2
  const x1 = x(from.column) + (right ? NODE_WIDTH : 0)
  const gx = right ? x(to.column) - GAP / 2 + offset : x(to.column) + NODE_WIDTH + GAP / 2 + offset
  const x2 = right ? x(to.column) : x(to.column) + NODE_WIDTH
  const turn = right ? RADIUS : -RADIUS
  return [
    `M ${x1} ${y1}`,
    `H ${gx - turn}`,
    `Q ${gx} ${y1} ${gx} ${y1 + RADIUS}`,
    `V ${y2 - RADIUS}`,
    `Q ${gx} ${y2} ${gx + turn} ${y2}`,
    `H ${x2}`,
  ].join(' ')
}

// Las ediciones de D&D con catálogo propio (5E) llevan a él; las demás, a su ficha
const linkOf = (system: RpgSystem) => system.official_catalog ?? systemPath(system)

function EdgeSample({ kind }: { kind: DerivationKind }) {
  return (
    <svg width="36" height="10" aria-hidden="true" className="shrink-0 text-muted">
      <line x1="0" y1="5" x2="36" y2="5" stroke="currentColor" {...edgeStyles[kind]} />
    </svg>
  )
}

export default function RpgTreePage() {
  const index = useRpgIndex()
  const tree = useMemo(() => (index ? buildRpgTree(index.systems) : null), [index])
  if (!index || !tree) return <RpgLoading what="el árbol" />

  const licenseName = (slug: string) => {
    const license = index.licenses.find((l) => l.slug === slug)
    return license ? licenseLabel(license) : slug
  }
  const position = new Map(tree.nodes.map((n) => [n.system.slug, n]))
  const width = GUTTER + tree.columns * COLUMN_WIDTH
  const height = PADDING * 2 + tree.nodes.length * ROW_HEIGHT - (ROW_HEIGHT - NODE_HEIGHT)

  // Las líneas que bajan por el mismo pasillo entre columnas se separan un poco para no fundirse
  const gapCount = new Map<string, number>()
  const gapOffsets = tree.edges.map((edge) => {
    const from = position.get(edge.from)!
    const to = position.get(edge.to)!
    if (from.column === to.column) return 0
    const key = `${to.column > from.column ? 'l' : 'r'}${to.column}`
    const k = gapCount.get(key) ?? 0
    gapCount.set(key, k + 1)
    return ((k % 3) - 1) * 4
  })

  // Marca de década en la primera fila de cada una
  const decades = tree.nodes.filter(
    (n, i) => i === 0 || n.system.date.slice(0, 3) !== tree.nodes[i - 1].system.date.slice(0, 3)
  )

  return (
    <>
      <MetaTags
        title="Árbol genealógico de D&D y los juegos de su familia"
        description="Todas las ediciones de Dungeons & Dragons y los juegos que derivan de ellas, como Pathfinder, Starfinder o Tales of the Valiant, en un árbol con el tipo de cada relación y sus licencias abiertas."
      />
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <Breadcrumbs items={[{ label: SECTION_NAME, to: '/rol' }, { label: TREE_NAME }]} />
        <PageHeader
          title={TREE_NAME}
          description="Las ediciones de Dungeons & Dragons y los juegos de su familia por orden de aparición, con lo que deriva de cada uno y el tipo de relación. Cada sistema lleva a su ficha."
        />

        <section aria-labelledby="leyenda" className="mb-6">
          <h2 id="leyenda" className={headingClass('group', 'mb-2')}>
            Leyenda
          </h2>
          <ul className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted">
            {edgeOrder.map((kind) => (
              <li key={kind} className="flex items-center gap-2">
                <EdgeSample kind={kind} />
                {derivationKindNames[kind]}
              </li>
            ))}
            <li className="flex items-center gap-2">
              <span className="h-3 w-5 shrink-0 rounded-sm border-2 border-fg" aria-hidden="true" />
              Edición oficial de D&D
            </li>
          </ul>
        </section>

        <div className="overflow-x-auto rounded-xl border border-line bg-well">
          <svg
            viewBox={`0 0 ${width} ${height}`}
            width={width}
            height={height}
            role="group"
            aria-label="Árbol genealógico de sistemas"
            className="block"
          >
            {decades.map((n) => (
              <g key={n.system.slug} className="text-muted">
                <line
                  x1={0}
                  x2={width}
                  y1={y(n.row) - (ROW_HEIGHT - NODE_HEIGHT) / 2}
                  y2={y(n.row) - (ROW_HEIGHT - NODE_HEIGHT) / 2}
                  className="stroke-line"
                />
                <text
                  x={10}
                  y={y(n.row) + 18}
                  fontSize="12"
                  fill="currentColor"
                  className="font-mono"
                >
                  {n.system.date.slice(0, 3)}0
                </text>
              </g>
            ))}

            {tree.edges.map((edge, i) => {
              const from = position.get(edge.from)!
              const to = position.get(edge.to)!
              return (
                <path
                  key={`${edge.from}-${edge.to}`}
                  d={edgePath(from, to, gapOffsets[i])}
                  fill="none"
                  stroke="currentColor"
                  className="text-muted"
                  {...edgeStyles[edge.kind]}
                >
                  <title>{derivationKindNames[edge.kind]}</title>
                </path>
              )
            })}

            {tree.nodes.map(({ system, row, column }) => {
              const licenses = system.licenses.map((l) => licenseName(l.license)).join(', ')
              const year = system.date.slice(0, 4)
              return (
                <Link
                  key={system.slug}
                  to={linkOf(system)}
                  aria-label={`${system.name}, ${year}`}
                  className="group"
                >
                  <rect
                    x={x(column)}
                    y={y(row)}
                    width={NODE_WIDTH}
                    height={NODE_HEIGHT}
                    rx={8}
                    strokeWidth={system.official ? 2 : 1}
                    className={`fill-surface ${system.official ? 'stroke-fg' : 'stroke-line group-hover:stroke-muted'}`}
                  />
                  <text
                    x={x(column) + 10}
                    y={y(row) + 19}
                    fontSize="13"
                    className="fill-fg font-semibold"
                    {...(system.name.length > MAX_NAME_LENGTH && {
                      textLength: NODE_WIDTH - 20,
                      lengthAdjust: 'spacingAndGlyphs',
                    })}
                  >
                    {system.name}
                  </text>
                  <text x={x(column) + 10} y={y(row) + 35} fontSize="11" className="fill-muted">
                    <tspan className="font-mono">{year}</tspan>
                    {licenses && ` · ${licenses}`}
                  </text>
                </Link>
              )
            })}
          </svg>
        </div>
      </div>
    </>
  )
}
