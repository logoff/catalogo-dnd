import { describe, expect, it } from 'vitest'
import novelsIndex from 'virtual:novels-index'
import comicsIndex from 'virtual:comics-index'
import rpgIndex from 'virtual:rpg-index'
import { getAllProducts } from '@/services/dataLoader'
import { getAllVideogames } from '@/services/videogameLoader'
import { getAllMerchandise } from '@/services/merchandiseLoader'
import { getAllScreenWorks } from '@/services/screenLoader'
import {
  comicEntries,
  merchandiseEntries,
  novelEntries,
  productEntries,
  rpgEntries,
  screenEntries,
  SEARCH_SECTIONS,
  searchSite,
  videogameEntries,
  type SearchEntry,
} from './siteSearch'

const entries: SearchEntry[] = [
  ...productEntries(getAllProducts()),
  ...videogameEntries(getAllVideogames()),
  ...merchandiseEntries(getAllMerchandise()),
  ...novelEntries(novelsIndex.novels),
  ...comicEntries(comicsIndex),
  ...rpgEntries(rpgIndex),
  ...screenEntries(getAllScreenWorks()),
]

const group = (query: string, section: string) =>
  searchSite(query, entries).find((g) => g.section === section)?.entries ?? []

const paths = (query: string, section: string) => group(query, section).map((e) => e.path)

describe('searchSite', () => {
  it('encuentra merchandising desde el buscador global', () => {
    expect(paths('fiends', 'merchandise')).toContain('/merchandising/fiends-and-foes')
  })

  it('busca en todas las secciones', () => {
    expect(paths('homeland', 'novels')).toContain('/novela/homeland')
    expect(paths('mindbreaker', 'comics')).toContain('/comic/mindbreaker')
    expect(paths("baldur's gate 3", 'videogames').length).toBeGreaterThan(0)
    expect(paths('pathfinder 2e', 'rpg')).toContain('/rol/pathfinder-2e')
    expect(group('pathfinder', 'rpg').length).toBeGreaterThan(10)
    expect(paths('open game license', 'licenses').length).toBeGreaterThan(0)
  })

  it('encuentra películas y series por su título original, en castellano o por su serie', () => {
    const path = '/cine-y-series/dungeons-and-dragons-honor-among-thieves'
    expect(paths('honor among thieves', 'screen')).toContain(path)
    expect(paths('HONOR ENTRE LADRONES', 'screen')).toContain(path)
    expect(paths('secret level', 'screen')).toContain(
      '/cine-y-series/secret-level-the-queens-cradle'
    )
    const vox = group('vox machina', 'screen')[0]
    expect(vox.detail).toBe('Serie · 2022– · No oficial')
  })

  it('pone los libros de las ediciones anteriores en su grupo', () => {
    const path = '/ediciones/dnd-add2/a-guide-to-the-astral-plane'
    expect(paths('guide to the astral plane', 'editions')).toContain(path)
    expect(paths('guide to the astral plane', 'rpg')).not.toContain(path)
  })

  it('ignora tildes y mayúsculas en el título en castellano', () => {
    expect(paths('GUIA DEL DUNGEON MASTER', 'books')).toContain('/producto/2014/dmg')
  })

  it('busca por autor', () => {
    expect(group('salvatore', 'novels').length).toBeGreaterThan(10)
  })

  it('busca por ISBN en todas las secciones', () => {
    expect(paths('9780593838877', 'merchandise')).toEqual(['/merchandising/fiends-and-foes'])
    expect(paths('9780880389051', 'novels')).toContain('/novela/homeland')
    expect(paths('9781684058884', 'comics')).toEqual(['/comic/mindbreaker'])
    const isbn = getAllProducts()[0].publications.find((p) => p.isbn13)!.isbn13!
    expect(searchSite(String(isbn), entries)[0].section).toBe('books')
  })

  it('no busca en las descripciones', () => {
    // «multiverso» está en la descripción de Fiends & Foes, pero no en sus títulos
    const merch = getAllMerchandise().find((item) => item.slug === 'fiends-and-foes')!
    const word = 'multiverso'
    expect(merch.description).toContain(word)
    expect(paths(word, 'merchandise')).not.toContain('/merchandising/fiends-and-foes')
  })

  it('agrupa en el orden fijo y sin grupos vacíos', () => {
    const order = SEARCH_SECTIONS.map((s) => s.id)
    const groups = searchSite('drizzt', entries)
    expect(groups.length).toBeGreaterThan(1)
    expect(groups.every((g) => g.entries.length > 0)).toBe(true)
    const indexes = groups.map((g) => order.indexOf(g.section))
    expect(indexes).toEqual([...indexes].sort((a, b) => a - b))
  })

  it('pone primero los títulos que empiezan por el texto', () => {
    const entry = (title: string, titleEs: string | null = null): SearchEntry => ({
      section: 'books',
      path: `/${title}`,
      title,
      titleEs,
      image: null,
      detail: '',
      searchText: [title, titleEs].join(' | ').toLowerCase(),
    })
    const found = searchSite('tomb', [
      entry('Adventures in the Tomb'),
      entry('Tomb of Annihilation'),
      entry('Lost Tomb'),
      entry('Grave', 'Tomb of graves'),
    ])
    expect(found[0].entries.map((e) => e.title)).toEqual([
      'Grave',
      'Tomb of Annihilation',
      'Adventures in the Tomb',
      'Lost Tomb',
    ])
  })

  it('no devuelve nada sin texto o sin coincidencias', () => {
    expect(searchSite('', entries)).toEqual([])
    expect(searchSite('   ', entries)).toEqual([])
    expect(searchSite('zzzzqx', entries)).toEqual([])
  })
})
