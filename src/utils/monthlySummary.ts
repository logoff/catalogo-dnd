import { format, parseISO } from 'date-fns'
import { es } from 'date-fns/locale'
import type { ReleaseSection } from '@/types/releases'

// «noviembre de 2026» a partir de «2026-11»
export function monthLabel(month: string): string {
  return format(parseISO(`${month}-01`), "MMMM 'de' yyyy", { locale: es })
}

// Nombre, listado y texto del enlace al listado de cada sección en el resumen
export const SUMMARY_SECTIONS: Record<
  ReleaseSection,
  { label: string; listing: string; more: string }
> = {
  libros: { label: 'Libros de 5E y 5.5E', listing: '/catalogo', more: 'Ver el catálogo' },
  videojuegos: { label: 'Videojuegos', listing: '/videojuegos', more: 'Ver los videojuegos' },
  merchandising: {
    label: 'Merchandising',
    listing: '/merchandising',
    more: 'Ver el merchandising',
  },
  novelas: { label: 'Novelas', listing: '/novelas', more: 'Ver las novelas' },
  comics: { label: 'Cómics', listing: '/comics', more: 'Ver los cómics' },
  cine: { label: 'Cine y series', listing: '/cine-y-series', more: 'Ver cine y series' },
  rol: { label: 'Otros juegos de rol', listing: '/rol', more: 'Ver otros juegos de rol' },
  ediciones: {
    label: 'Ediciones anteriores de D&D',
    listing: '/ediciones',
    more: 'Ver las ediciones anteriores',
  },
}

// Una fecha de los datos tal cual viene: «18 nov 2026», «nov 2026», «2027» o «sin fecha»
export function formatDataDate(date: string | null | undefined): string {
  if (!date) return 'sin fecha'
  if (/^\d{4}$/.test(date)) return date
  if (date.length === 7) return format(parseISO(`${date}-01`), 'MMM yyyy', { locale: es })
  return format(parseISO(date), 'd MMM yyyy', { locale: es })
}
