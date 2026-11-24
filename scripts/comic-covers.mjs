// Lógica pura de las portadas de cómics (la usa download-comic-covers.mjs y tiene tests): qué
// elemento de la ficha corresponde a cada clave de la línea de órdenes y cómo se llama su archivo.
//
// Claves:
//   <número>           un número de la serie: «1», «0», «Annual 1»
//   <isbn>             un tomo con ISBN-13
//   tomo-<n>           el tomo n-ésimo de la ficha (1, 2…), para los que no tienen ISBN
//   castellano-<n>     el número n de la primera edición en grapa en castellano

// Nombre de archivo de una portada a partir de su clave: «Annual 1» → «annual-1»
export function coverFileName(key) {
  return String(key)
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}

// Devuelve el objeto (número o edición) al que hay que ponerle la portada, o undefined
export function targetFor(comic, key) {
  const editions = comic.editions ?? []
  if (/^\d{13}$/.test(key)) return editions.find((e) => String(e.isbn13) === key)
  const tomo = key.match(/^tomo-(\d+)$/)
  if (tomo) return editions.filter((e) => e.format !== 'issue')[Number(tomo[1]) - 1]
  const spanish = key.match(/^castellano-(.+)$/)
  if (spanish) {
    const grapa = editions.find((e) => e.format === 'issue' && e.language === 'castellano')
    return grapa?.issues?.find((issue) => issue.number === spanish[1])
  }
  return comic.issues.find((issue) => issue.number === key)
}
