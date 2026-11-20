import { describe, it, expect } from 'vitest'
import productSchema from '../../data/schemas/product.jsonschema?raw'
import rpgBookSchema from '../../data/schemas/rpg-book.jsonschema?raw'
import videogameSchema from '../../data/schemas/videogame.jsonschema?raw'
import { WORLDS, worldNames } from './worlds'

const settingsEnum = (raw: string) => JSON.parse(raw).properties.settings.items.enum as string[]

describe('mundos comunes', () => {
  it('los esquemas de libros usan la misma lista de mundos', () => {
    expect(settingsEnum(productSchema)).toEqual([...WORLDS])
    expect(settingsEnum(rpgBookSchema)).toEqual([...WORLDS])
  })

  it('las novelas y los videojuegos usan identificadores de la lista', () => {
    const novelFiles = Object.keys(import.meta.glob('/data/novels/*/*.json'))
    const novelWorlds = [...new Set(novelFiles.map((f) => f.split('/')[3]))].filter(
      (w) => w !== 'generic'
    )
    expect(novelWorlds.length).toBeGreaterThan(5)
    const videogameWorlds = JSON.parse(videogameSchema).properties.setting.enum as string[]
    for (const world of [...novelWorlds, ...videogameWorlds]) expect(WORLDS).toContain(world)
  })

  it('cada mundo tiene nombre', () => {
    for (const world of WORLDS) expect(worldNames[world]).toBeTruthy()
  })
})
