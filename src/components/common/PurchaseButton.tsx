import { ArrowTopRightOnSquareIcon } from '@heroicons/react/24/outline'
import type { Store } from '@/types'
import { STORES, getPurchaseUrl } from '@/utils/stores'
import { buttonClass } from '@/components/ui/styles'

interface PurchaseButtonProps {
  store: Store
  // URL limpia de la tienda; el afiliado se añade aquí
  url: string
  // Datos extra del evento de Umami (data-umami-event-<clave>)
  tracking: Record<string, string | undefined>
  // Variante de la tienda que se añade al nombre, como «Kindle» en los ebooks de Amazon
  variant?: string
  // El primer enlace de cada lista es la acción principal (rojo); el resto, secundarios
  primary?: boolean
}

// Botón de compra compartido por libros, videojuegos, merchandising y novelas
export default function PurchaseButton({
  store,
  url,
  tracking,
  variant,
  primary = false,
}: PurchaseButtonProps) {
  const { label, unaffiliated } = STORES[store]
  const trackingAttributes = Object.fromEntries(
    Object.entries(tracking).map(([key, value]) => [`data-umami-event-${key}`, value])
  )

  return (
    <a
      href={getPurchaseUrl(store, url)}
      target="_blank"
      rel={unaffiliated ? 'noopener noreferrer' : 'sponsored noopener noreferrer'}
      className={buttonClass(primary ? 'primary' : 'secondary')}
      // Evento de Umami: clic en un enlace de compra, con la URL sin parámetros de afiliado
      data-umami-event="comprar"
      data-umami-event-tienda={store}
      {...trackingAttributes}
      data-umami-event-url={url}
    >
      <span>
        Comprar en {label}
        {variant && ` ${variant}`}
      </span>
      <ArrowTopRightOnSquareIcon className="size-3.5 opacity-70" aria-hidden="true" />
    </a>
  )
}
