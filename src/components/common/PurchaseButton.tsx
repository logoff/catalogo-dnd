import { ArrowTopRightOnSquareIcon, ShoppingCartIcon } from '@heroicons/react/24/outline'
import type { Store } from '@/types'
import { getAssetPath } from '@/utils/constants'
import { STORES, getPurchaseUrl } from '@/utils/stores'

const buttonClasses = `
  group inline-flex items-center gap-2 px-4 py-2 rounded-lg
  text-white text-sm font-medium
  shadow-md hover:shadow-lg
  transform hover:scale-105 hover:-translate-y-0.5
  transition-all duration-200
`

interface PurchaseButtonProps {
  store: Store
  // URL limpia de la tienda; el afiliado se añade aquí
  url: string
  // Datos extra del evento de Umami (data-umami-event-<clave>)
  tracking: Record<string, string | undefined>
}

// Botón de compra compartido por libros y videojuegos
export default function PurchaseButton({ store, url, tracking }: PurchaseButtonProps) {
  const { label, image, color } = STORES[store]
  const trackingAttributes = Object.fromEntries(
    Object.entries(tracking).map(([key, value]) => [`data-umami-event-${key}`, value])
  )

  return (
    <a
      href={getPurchaseUrl(store, url)}
      target="_blank"
      rel="sponsored noopener noreferrer"
      className={`${buttonClasses} bg-linear-to-r ${color}`}
      // Evento de Umami: clic en un enlace de compra, con la URL sin parámetros de afiliado
      data-umami-event="comprar"
      data-umami-event-tienda={store}
      {...trackingAttributes}
      data-umami-event-url={url}
    >
      {image ? (
        <img src={getAssetPath(image)} alt="" className="h-4" />
      ) : (
        <ShoppingCartIcon className="h-4 w-4" />
      )}
      <span>Comprar en {label}</span>
      <ArrowTopRightOnSquareIcon className="h-3 w-3 opacity-60 group-hover:opacity-100 transition-opacity" />
    </a>
  )
}
