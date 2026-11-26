import { Link, useParams } from 'react-router-dom'
import { ArrowTopRightOnSquareIcon } from '@heroicons/react/24/outline'
import MetaTags from '@/components/seo/MetaTags'
import Badge from '@/components/ui/Badge'
import { DataList, DataRow, DetailSection } from '@/components/ui/DetailSection'
import { cardClass } from '@/components/ui/styles'
import { BookList, RpgLoading, RpgPage } from '@/components/rpg/RpgSection'
import { useRpgIndex } from '@/hooks/useRpgData'
import { relatedLicenses, rolSection, systemPath, systemsUsing } from '@/utils/rpg'
import { licenseKindNames, licenseLabel } from '@/utils/rpgTranslations'
import { formatPartialDate } from '@/utils/videogameTranslations'
import NotFoundPage from './NotFoundPage'

export default function LicenseDetailPage() {
  const { slug = '' } = useParams<{ slug: string }>()
  const index = useRpgIndex()
  if (!index) return <RpgLoading what="la licencia" />

  const license = index.licenses.find((l) => l.slug === slug)
  if (!license) return <NotFoundPage />

  const related = relatedLicenses(index.licenses, license)
  const systems = systemsUsing(index.systems, license.slug)
  // Los libros de las ediciones anteriores de D&D se ven en la ficha de su edición
  const books = rolSection(index.systems, index.books).books.filter((book) =>
    book.licenses.includes(license.slug)
  )
  const paragraphs = license.description.split('\n\n')

  return (
    <>
      <MetaTags
        title={`${license.name}: qué es y qué juegos la usan`}
        description={paragraphs[0]}
      />
      <RpgPage
        crumbs={[
          { label: 'Licencias abiertas', to: '/licencias' },
          { label: licenseLabel(license) },
        ]}
      >
        <div className="mb-8 flex max-w-3xl flex-col gap-3">
          <span className="flex flex-wrap gap-1.5">
            <Badge>{licenseKindNames[license.kind]}</Badge>
          </span>
          <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">{license.name}</h1>
          {paragraphs.map((paragraph) => (
            <p key={paragraph} className="text-base leading-relaxed text-fg">
              {paragraph}
            </p>
          ))}
        </div>

        <div className="space-y-10">
          <DetailSection title="Datos">
            <DataList>
              <DataRow label="Titular" value={license.holder} />
              <DataRow label="Fecha" value={formatPartialDate(license.date)} />
              {(license.published_under ?? []).length > 0 && (
                <DataRow
                  label="Se publica bajo"
                  value={license.published_under!.map((p) => {
                    const under = index.licenses.find((l) => l.slug === p.license)
                    return (
                      <span key={p.license} className="block">
                        {under ? licenseLabel(under) : p.license}
                        {p.since && ` (desde ${formatPartialDate(p.since)})`}
                      </span>
                    )
                  })}
                />
              )}
            </DataList>
          </DetailSection>

          {(license.status_notes ?? []).length > 0 && (
            <DetailSection title="Cambios de estado">
              <ul className="max-w-3xl space-y-3">
                {license.status_notes!.map((note) => (
                  <li key={note.date + note.text}>
                    <span className="font-mono text-sm text-muted">
                      {formatPartialDate(note.date)}
                    </span>
                    <p className="text-fg">
                      {note.text}{' '}
                      <a
                        href={note.source}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-muted underline underline-offset-2 hover:text-fg"
                      >
                        Fuente
                      </a>
                    </p>
                  </li>
                ))}
              </ul>
            </DetailSection>
          )}

          <DetailSection title="Enlaces oficiales">
            <ul className="space-y-2">
              {license.links.map((link) => (
                <li key={link.url}>
                  <a
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-fg underline underline-offset-2 hover:text-accent"
                  >
                    {link.label}
                    <ArrowTopRightOnSquareIcon className="size-3.5 opacity-70" aria-hidden="true" />
                  </a>
                </li>
              ))}
            </ul>
          </DetailSection>

          {related.length > 0 && (
            <DetailSection title="Licencias relacionadas">
              <ul className="flex flex-wrap gap-2">
                {related.map((other) => (
                  <li key={other.slug}>
                    <Link
                      to={`/licencia/${other.slug}`}
                      className="text-fg underline underline-offset-2 hover:text-accent"
                    >
                      {other.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </DetailSection>
          )}

          <DetailSection title="Sistemas que la usan">
            {systems.length > 0 ? (
              <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {systems.map((system) => {
                  const use = system.licenses.find((l) => l.license === license.slug)!
                  return (
                    <li key={system.slug}>
                      <Link to={systemPath(system)} className={cardClass(true, 'h-full p-4')}>
                        <span className="text-lg font-medium text-fg">{system.name}</span>
                        <span className="text-sm text-muted">
                          {system.publisher} · {system.date.slice(0, 4)}
                        </span>
                        {(use.since || use.note) && (
                          <span className="mt-1 text-sm text-muted">
                            {[use.since && `Desde ${use.since}`, use.note]
                              .filter(Boolean)
                              .join('. ')}
                          </span>
                        )}
                      </Link>
                    </li>
                  )
                })}
              </ul>
            ) : (
              <p className="text-muted">
                Ningún sistema de la sección la usa directamente.
                {related.length > 0 && ' Mira las licencias relacionadas.'}
              </p>
            )}
          </DetailSection>

          {books.length > 0 && (
            <DetailSection title="Libros">
              <BookList books={books} systems={index.systems} />
            </DetailSection>
          )}
        </div>
      </RpgPage>
    </>
  )
}
