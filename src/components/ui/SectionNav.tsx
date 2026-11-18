import clsx from 'clsx'

export interface SectionLink {
  id: string
  label: string
}

// Barra de enlaces a las secciones de una ficha. No oculta nada: todo el
// contenido sigue en la página (y en el HTML prerenderizado)
export default function SectionNav({
  sections,
  className,
}: {
  sections: SectionLink[]
  className?: string
}) {
  if (sections.length < 2) return null

  return (
    <nav
      aria-label="Secciones de la ficha"
      className={clsx(
        'sticky top-16 z-30 -mx-4 border-b border-line bg-bg/95 px-4 backdrop-blur-sm sm:mx-0 sm:px-0',
        className
      )}
    >
      <ul className="flex gap-6 overflow-x-auto text-sm scrollbar-hide">
        {sections.map((section) => (
          <li key={section.id}>
            <a
              href={`#${section.id}`}
              className="inline-flex min-h-11 items-center whitespace-nowrap text-muted transition-colors duration-150 hover:text-fg"
            >
              {section.label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  )
}
