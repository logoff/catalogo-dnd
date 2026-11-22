import { Link, Navigate, useParams } from 'react-router-dom'
import { ArrowTopRightOnSquareIcon } from '@heroicons/react/24/outline'
import MetaTags from '@/components/seo/MetaTags'
import Badge from '@/components/ui/Badge'
import { MovementBadge } from '@/components/rpg/RpgMovements'
import { DataList, DataRow, DetailSection } from '@/components/ui/DetailSection'
import { buttonClass, cardClass, headingClass } from '@/components/ui/styles'
import {
  BookList,
  BooksByKind,
  RpgLoading,
  RpgPage,
  UnofficialNotice,
  type RpgSectionId,
} from '@/components/rpg/RpgSection'
import { useRpgIndex } from '@/hooks/useRpgData'
import type { Derivation, RpgSystem } from '@/types/rpg'
import { derivedSystems, familyOf, isDndEdition, systemPath } from '@/utils/rpg'
import { derivationKindNames, licenseLabel } from '@/utils/rpgTranslations'
import { formatPartialDate } from '@/utils/videogameTranslations'
import NotFoundPage from './NotFoundPage'

function DerivationItem({
  system,
  derivation,
  viaName,
}: {
  system: RpgSystem | undefined
  derivation: Derivation
  viaName?: string
}) {
  return (
    <li className="max-w-3xl">
      <p>
        {system ? (
          <Link
            to={systemPath(system)}
            className="font-medium text-fg underline underline-offset-2 hover:text-accent"
          >
            {system.name}
          </Link>
        ) : (
          derivation.system
        )}{' '}
        <Badge variant="outline">{derivationKindNames[derivation.kind]}</Badge>
        {viaName && <span className="text-sm text-muted"> · a través de {viaName}</span>}
      </p>
      {derivation.note && <p className="text-sm text-muted">{derivation.note}</p>}
    </li>
  )
}

// También es la ficha de las ediciones anteriores de D&D, en /ediciones (section="ediciones")
export default function RpgSystemPage({ section = 'rol' }: { section?: RpgSectionId }) {
  const { system: slug = '' } = useParams<{ system: string }>()
  const index = useRpgIndex()
  if (!index) return <RpgLoading what="el sistema" />

  const system = index.systems.find((s) => s.slug === slug)
  if (!system) return <NotFoundPage />
  const edition = isDndEdition(system)
  if (edition && section === 'rol') return <Navigate to={systemPath(system)} replace />
  if (!edition && section === 'ediciones') return <NotFoundPage />

  const findSystem = (s: string) => index.systems.find((other) => other.slug === s)
  const findLicense = (l: string) => index.licenses.find((other) => other.slug === l)
  const parents = system.derived_from ?? []
  const children = derivedSystems(index.systems, system.slug)
  const family = familyOf(index.systems, system)
  const books = index.books.filter((book) => book.system === system.slug)
  const paragraphs = system.description.split('\n\n')
  const official = Boolean(system.official)

  return (
    <>
      <MetaTags title={system.name} description={paragraphs[0]} />
      <RpgPage section={section} crumbs={[{ label: system.name }]}>
        {!official && <UnofficialNotice />}

        <div className="mb-8 flex max-w-3xl flex-col gap-3">
          <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">{system.name}</h1>
          <p className="flex flex-wrap items-center gap-2 text-muted">
            <span>
              {system.publisher} · {formatPartialDate(system.date)}
            </span>
            {system.movement && <MovementBadge movement={system.movement} />}
          </p>
          {paragraphs.map((paragraph) => (
            <p key={paragraph} className="text-base leading-relaxed text-fg">
              {paragraph}
            </p>
          ))}
          {system.official_catalog && (
            <p>
              <Link to={system.official_catalog} className={buttonClass('primary')}>
                Ver sus libros oficiales en el catálogo
              </Link>
            </p>
          )}
        </div>

        <div className="space-y-10">
          <DetailSection title="Características">
            <ul className="max-w-3xl list-disc space-y-1 pl-6 text-fg">
              {system.features.map((feature) => (
                <li key={feature}>{feature}</li>
              ))}
            </ul>
          </DetailSection>

          <DetailSection title="Licencias abiertas">
            {system.licenses.length > 0 ? (
              <DataList>
                {system.licenses.map((use) => {
                  const license = findLicense(use.license)
                  return (
                    <DataRow
                      key={use.license}
                      label={use.since ? `Desde ${use.since}` : 'Licencia'}
                      value={
                        <>
                          <Link
                            to={`/licencia/${use.license}`}
                            className="text-fg underline underline-offset-2 hover:text-accent"
                          >
                            {license ? license.name : use.license}
                          </Link>
                          {use.note && <span className="text-muted"> · {use.note}</span>}
                        </>
                      }
                    />
                  )
                })}
              </DataList>
            ) : (
              <p className="text-fg">No tiene licencia abierta.</p>
            )}
          </DetailSection>

          {(parents.length > 0 || children.length > 0) && (
            <DetailSection title="Derivaciones">
              {parents.length > 0 && (
                <>
                  <h3 className={headingClass('group', 'mb-2')}>Deriva de</h3>
                  <ul className="mb-6 space-y-3">
                    {parents.map((derivation) => {
                      const via = derivation.via_license && findLicense(derivation.via_license)
                      return (
                        <DerivationItem
                          key={derivation.system}
                          system={findSystem(derivation.system)}
                          derivation={derivation}
                          viaName={via ? licenseLabel(via) : derivation.via_license}
                        />
                      )
                    })}
                  </ul>
                </>
              )}
              {children.length > 0 && (
                <>
                  <h3 className={headingClass('group', 'mb-2')}>
                    {edition ? 'Derivan de ella' : 'Derivan de él'}
                  </h3>
                  <ul className="space-y-3">
                    {children.map(({ system: child, derivation }) => {
                      const via = derivation.via_license && findLicense(derivation.via_license)
                      return (
                        <DerivationItem
                          key={child.slug}
                          system={child}
                          derivation={derivation}
                          viaName={via ? licenseLabel(via) : derivation.via_license}
                        />
                      )
                    })}
                  </ul>
                </>
              )}
            </DetailSection>
          )}

          {family.length > 0 && (
            <DetailSection title="Otras ediciones">
              <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {family.map((other) => (
                  <li key={other.slug}>
                    <Link to={systemPath(other)} className={cardClass(true, 'h-full p-4')}>
                      <span className="text-lg font-medium text-fg">{other.name}</span>
                      <span className="text-sm text-muted">
                        {other.publisher} · {other.date.slice(0, 4)}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </DetailSection>
          )}

          {!official && (
            <DetailSection title="Libros">
              {books.length > 0 ? (
                <BookList books={books} systems={index.systems} />
              ) : (
                <p className="text-muted">Todavía no hay libros de este sistema en el catálogo.</p>
              )}
            </DetailSection>
          )}

          {edition && (
            <DetailSection title="Libros">
              {books.length > 0 ? (
                <BooksByKind books={books} systems={index.systems} />
              ) : (
                <p className="text-muted">Todavía no hay libros de esta edición en el catálogo.</p>
              )}
            </DetailSection>
          )}

          {system.official_catalog && books.length > 0 && (
            <DetailSection title="Libros de otras editoriales">
              <BookList books={books} systems={index.systems} />
            </DetailSection>
          )}

          <DetailSection title="Enlaces">
            <ul className="space-y-2">
              {system.links.map((link) => (
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
        </div>
      </RpgPage>
    </>
  )
}
