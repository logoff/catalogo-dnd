import { Link } from 'react-router-dom'
import related from 'virtual:comics-related'
import type { ComicRelations } from '@/types/comic'
import { DetailSection } from '@/components/ui/DetailSection'

// Sección «Cómics» de las fichas de otras secciones: los cómics que las adaptan o se relacionan
// con ellas. No pinta nada si no hay ninguno
export default function RelatedComics({ group, id }: { group: keyof ComicRelations; id: string }) {
  const comics = related[group][id] ?? []
  if (comics.length === 0) return null
  return (
    <DetailSection title="Cómics">
      <ul className="space-y-2">
        {comics.map((comic) => (
          <li key={comic.slug}>
            <Link
              to={`/comic/${comic.slug}`}
              className="underline decoration-muted underline-offset-2 transition-colors duration-150 hover:decoration-fg"
            >
              {comic.title}
            </Link>
          </li>
        ))}
      </ul>
    </DetailSection>
  )
}
