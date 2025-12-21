import { format, parseISO } from 'date-fns'
import { es } from 'date-fns/locale'

export function formatDate(dateString: string): string {
  try {
    const date = parseISO(dateString)
    return format(date, "d 'de' MMMM 'de' yyyy", { locale: es })
  } catch {
    return dateString
  }
}

export function formatISBN(isbn: number): string {
  const str = isbn.toString()
  // Format as ISBN-13: 978-0-12345-678-9
  if (str.length === 13) {
    return `${str.slice(0, 3)}-${str.slice(3, 4)}-${str.slice(4, 9)}-${str.slice(9, 12)}-${str.slice(12)}`
  }
  return str
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remove diacritics
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

export function formatDateRange(dateRange: {
  earliest?: string | null
  latest?: string | null
}): string {
  if (!dateRange.earliest) return ''

  const formatYear = (date: string) => date.slice(0, 4)

  if (!dateRange.latest || dateRange.earliest === dateRange.latest) {
    return formatYear(dateRange.earliest)
  }

  const earliestYear = formatYear(dateRange.earliest)
  const latestYear = formatYear(dateRange.latest)

  if (earliestYear === latestYear) {
    return earliestYear
  }

  return `${earliestYear}–${latestYear}`
}
