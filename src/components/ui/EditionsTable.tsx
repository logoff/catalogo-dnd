import clsx from 'clsx'
import type { ReactNode } from 'react'

export interface TableColumn {
  key: string
  header: ReactNode
  // Cifras (fechas, ISBN, páginas) en monoespaciada y alineadas
  mono?: boolean
  align?: 'left' | 'right'
  className?: string
}

export interface TableRow {
  key: string
  cells: Record<string, ReactNode>
  highlight?: boolean
}

// Tabla de datos de las fichas (ediciones, lanzamientos…). En móvil se desplaza
// dentro de su caja para que la página no lo haga
export default function EditionsTable({
  columns,
  rows,
  caption,
  className,
}: {
  columns: TableColumn[]
  rows: TableRow[]
  caption?: string
  className?: string
}) {
  return (
    <div className={clsx('overflow-x-auto rounded-xl border border-line bg-surface', className)}>
      <table className="w-full border-collapse text-sm">
        {caption && <caption className="sr-only">{caption}</caption>}
        <thead>
          <tr className="border-b border-line text-left text-xs text-muted">
            {columns.map((column) => (
              <th
                key={column.key}
                scope="col"
                className={clsx(
                  'px-4 py-2.5 font-medium whitespace-nowrap',
                  column.align === 'right' && 'text-right',
                  column.className
                )}
              >
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.key} className="border-b border-line last:border-b-0">
              {columns.map((column) => (
                <td
                  key={column.key}
                  className={clsx(
                    'px-4 py-3 align-middle',
                    column.mono &&
                      'font-mono text-[13px] tabular-nums whitespace-nowrap text-muted',
                    column.align === 'right' && 'text-right',
                    column.className
                  )}
                >
                  {row.cells[column.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
