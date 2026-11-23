import { format, parseISO } from 'date-fns'
import { es } from 'date-fns/locale'
import type { Release } from '@/types/releases'

// Nombre de la sección de una novedad; los libros oficiales se distinguen por edición
export function releaseSectionLabel(release: Release): string {
  switch (release.section) {
    case 'libros':
      return release.path.startsWith('/producto/2014/') ? 'Libro 5E (2014)' : 'Libro 5.5E (2024)'
    case 'videojuegos':
      return 'Videojuego'
    case 'merchandising':
      return 'Merchandising'
    case 'novelas':
      return 'Novela'
    case 'rol':
      return 'Otros juegos de rol'
    case 'ediciones':
      return 'Ediciones anteriores'
  }
}

// «noviembre de 2026», para el título de cada grupo
function monthLabel(date: string): string {
  return format(parseISO(date), "MMMM 'de' yyyy", { locale: es })
}

// Grupos por mes, en el orden en que llegan las entradas
export function groupByMonth(releases: Release[]): { month: string; releases: Release[] }[] {
  const groups = new Map<string, Release[]>()
  for (const release of releases) {
    const month = release.date!.slice(0, 7)
    groups.set(month, [...(groups.get(month) ?? []), release])
  }
  return [...groups].map(([month, items]) => ({
    month: monthLabel(`${month}-01`),
    releases: items,
  }))
}
