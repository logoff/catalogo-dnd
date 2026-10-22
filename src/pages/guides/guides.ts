export interface Guide {
  slug: string
  title: string
  summary: string
}

export const GUIDES: Guide[] = [
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
    slug: 'cronologia-castellano',
    title: 'D&D en castellano: cronología',
    summary: 'Todo lo publicado en castellano de la quinta edición, por fecha y editorial.',
  },
]
