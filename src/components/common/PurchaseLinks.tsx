import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'

// Zona de botones de compra con el aviso de afiliado encima, cerca de los enlaces como piden
// los programas de afiliados. Toda la ficha con botones de compra los envuelve en ella
export default function PurchaseLinks({
  children,
  className,
}: {
  children: ReactNode
  className?: string
}) {
  return (
    <div data-purchase-links className={className}>
      <p className="mb-3 text-xs text-muted" data-affiliate-notice>
        Algunos enlaces de compra son de afiliado: si compras a través de ellos, el catálogo puede
        recibir una comisión sin coste para ti.{' '}
        <Link to="/aviso-legal" className="underline underline-offset-2 hover:text-fg">
          Más información
        </Link>
      </p>
      {children}
    </div>
  )
}
