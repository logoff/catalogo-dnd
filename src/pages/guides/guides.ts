export interface Guide {
  slug: string
  title: string
  summary: string
}

export const GUIDES: Guide[] = [
  {
    slug: 'cuando-sale-en-castellano',
    title: '¿Cuándo sale en castellano?',
    summary:
      'Fechas de las novedades de 2024 en inglés y en castellano, y cuánto tardan en traducirse.',
  },
  {
    slug: 'por-donde-empezar',
    title: 'Por dónde empezar',
    summary: 'Qué comprar para tu primera partida, tanto si vas a jugar como si vas a dirigir.',
  },
  {
    slug: '2014-vs-2024',
    title: '2014 frente a 2024',
    summary:
      'Qué cambia en la revisión de 2024, si es compatible y qué libros sustituyen a cuáles.',
  },
  {
    slug: 'edge-o-wizards',
    title: 'Edge o Wizards',
    summary:
      'Qué libros de 2014 publicó Edge en castellano, cuáles reeditó Wizards y cómo distinguirlos.',
  },
  {
    slug: 'orden-de-lectura-drizzt',
    title: 'Orden de lectura de la Leyenda de Drizzt',
    summary: 'Las novelas de Drizzt de R. A. Salvatore en orden, con su título en castellano.',
  },
  {
    slug: 'orden-de-lectura-dragonlance',
    title: 'Orden de lectura de la Dragonlance',
    summary: 'La línea principal de Weis y Hickman en orden, de las Crónicas a los Destinos.',
  },
  {
    slug: 'novelas-en-castellano',
    title: 'Novelas de D&D en castellano',
    summary: 'Qué novelas oficiales se han traducido al castellano, por mundo y serie.',
  },
  {
    slug: 'cronologia-castellano',
    title: 'D&D en castellano: cronología',
    summary: 'Todo lo publicado en castellano de la quinta edición, por fecha y editorial.',
  },
  {
    slug: 'cronologia-ingles',
    title: 'D&D en inglés: cronología',
    summary:
      'Todo lo publicado en inglés de la quinta edición, incluidas las novedades anunciadas.',
  },
]
