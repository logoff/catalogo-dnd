import { WORLDS, worldNames, worldSlug } from '@/utils/worlds'

export type GuideGroup = 'empezar' | 'libros' | 'novelas' | 'ambientaciones'

export interface Guide {
  slug: string
  title: string
  summary: string
  group: GuideGroup
}

// Tipos de guía, en el orden en que se muestran en /guias
export const GUIDE_GROUPS: { id: GuideGroup; label: string }[] = [
  { id: 'empezar', label: 'Para empezar' },
  { id: 'libros', label: 'Libros de 5E y 5.5E' },
  { id: 'novelas', label: 'Novelas' },
  { id: 'ambientaciones', label: 'Ambientaciones' },
]

export const GUIDES: Guide[] = [
  {
    slug: 'cuando-sale-en-castellano',
    group: 'libros',
    title: '¿Cuándo sale en castellano?',
    summary:
      'Fechas de las novedades de 2024 en inglés y en castellano, y cuánto tardan en traducirse.',
  },
  {
    slug: 'por-donde-empezar',
    group: 'empezar',
    title: 'Por dónde empezar',
    summary: 'Qué comprar para tu primera partida, tanto si vas a jugar como si vas a dirigir.',
  },
  {
    slug: '2014-vs-2024',
    group: 'empezar',
    title: '2014 frente a 2024',
    summary:
      'Qué cambia en la revisión de 2024, si es compatible y qué libros sustituyen a cuáles.',
  },
  {
    slug: 'edge-o-wizards',
    group: 'libros',
    title: 'Edge o Wizards',
    summary:
      'Qué libros de 2014 publicó Edge en castellano, cuáles reeditó Wizards y cómo distinguirlos.',
  },
  {
    slug: 'orden-de-lectura-drizzt',
    group: 'novelas',
    title: 'Orden de lectura de la Leyenda de Drizzt',
    summary: 'Las novelas de Drizzt de R. A. Salvatore en orden, con su título en castellano.',
  },
  {
    slug: 'orden-de-lectura-dragonlance',
    group: 'novelas',
    title: 'Orden de lectura de la Dragonlance',
    summary: 'La línea principal de Weis y Hickman en orden, de las Crónicas a los Destinos.',
  },
  {
    slug: 'novelas-en-castellano',
    group: 'novelas',
    title: 'Novelas de D&D en castellano',
    summary: 'Qué novelas oficiales se han traducido al castellano, por mundo y serie.',
  },
  {
    slug: 'cronologia-castellano',
    group: 'libros',
    title: 'D&D en castellano: cronología',
    summary: 'Todo lo publicado en castellano de la quinta edición, por fecha y editorial.',
  },
  {
    slug: 'cronologia-ingles',
    group: 'libros',
    title: 'D&D en inglés: cronología',
    summary:
      'Todo lo publicado en inglés de la quinta edición, incluidas las novedades anunciadas.',
  },
  // Una guía por mundo, generada desde los datos (WorldGuide)
  ...WORLDS.map((world): Guide => ({
    slug: `ambientacion/${worldSlug(world)}`,
    group: 'ambientaciones',
    title: worldNames[world],
    summary: `Todo lo publicado de ${worldNames[world]}: libros de cada edición, novelas y videojuegos.`,
  })),
]
