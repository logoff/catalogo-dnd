// Dígito de control de un ISBN-13 a partir de sus 12 primeras cifras
function isbn13CheckDigit(first12: string): number {
  const sum = [...first12].reduce((acc, digit, i) => acc + Number(digit) * (i % 2 === 0 ? 1 : 3), 0)
  return (10 - (sum % 10)) % 10
}

export function isValidIsbn13(isbn: number | string): boolean {
  const digits = String(isbn)
  if (!/^97[89]\d{10}$/.test(digits)) return false
  return isbn13CheckDigit(digits.slice(0, 12)) === Number(digits[12])
}

// Convierte un ISBN-10 (con o sin guiones) en ISBN-13: prefijo 978 y nuevo dígito de control
export function isbn10To13(isbn10: string): number {
  const digits = isbn10.replace(/[^\dX]/gi, '').toUpperCase()
  if (!/^\d{9}[\dX]$/.test(digits)) throw new Error(`ISBN-10 no válido: ${isbn10}`)
  const first12 = `978${digits.slice(0, 9)}`
  return Number(`${first12}${isbn13CheckDigit(first12)}`)
}
