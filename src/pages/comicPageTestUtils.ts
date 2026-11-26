// Ayudas de los tests de las páginas de cómics: rellenan las cachés que en la web llenan el
// prerenderizado y la precarga de main.tsx
export { cacheComic, setCollections, setComicIndex } from '@/services/comicLoader'
import { loadNovelIndex } from '@/services/novelLoader'

export async function loadNovelIndexForTests(): Promise<void> {
  await loadNovelIndex()
}
