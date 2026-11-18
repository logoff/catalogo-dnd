import type { ReactNode } from 'react'

// Estilos de texto largo para guías y páginas legales
const proseClasses = `
  max-w-3xl space-y-4 text-base leading-relaxed text-fg
  [&_h2]:mt-12 [&_h2]:mb-3 [&_h2]:text-2xl
  [&_h3]:mt-8 [&_h3]:mb-2 [&_h3]:text-lg
  [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:space-y-2 [&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:space-y-2
  [&_strong]:font-semibold
  [&_a]:underline [&_a]:decoration-muted [&_a]:underline-offset-2 [&_a:hover]:decoration-fg
`

export default function Prose({ children }: { children: ReactNode }) {
  return <article className={proseClasses}>{children}</article>
}
