import type { ReactNode } from 'react'

// Estilos de texto largo para guías y páginas legales
const proseClasses = `
  space-y-4 text-gray-300 leading-relaxed
  [&_h2]:font-display [&_h2]:text-2xl [&_h2]:text-dnd-gold [&_h2]:mt-10 [&_h2]:mb-3
  [&_h3]:font-semibold [&_h3]:text-lg [&_h3]:text-gray-100 [&_h3]:mt-6 [&_h3]:mb-2
  [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:space-y-2
  [&_strong]:text-gray-100
  [&_a]:text-dnd-gold [&_a:hover]:text-dnd-gold-light [&_a]:underline [&_a]:underline-offset-2
`

export default function Prose({ children }: { children: ReactNode }) {
  return <article className={proseClasses}>{children}</article>
}
