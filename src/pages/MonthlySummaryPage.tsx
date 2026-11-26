import { Link, useParams } from 'react-router-dom'
import { ArrowLeftIcon, ArrowRightIcon } from '@heroicons/react/24/outline'
import type { ReactNode } from 'react'
import summaries from 'virtual:monthly-summaries'
import MetaTags from '@/components/seo/MetaTags'
import Breadcrumbs from '@/components/common/Breadcrumbs'
import PageHeader from '@/components/ui/PageHeader'
import Badge from '@/components/ui/Badge'
import { headingClass } from '@/components/ui/styles'
import { formatDataDate, monthLabel, SUMMARY_SECTIONS } from '@/utils/monthlySummary'
import type { MonthlySummary } from '@/types/monthlySummary'
import NotFoundPage from './NotFoundPage'

const capitalize = (text: string) => text.charAt(0).toUpperCase() + text.slice(1)
const number = (n: number) => new Intl.NumberFormat('es-ES').format(n)
// «1 ficha nueva», «2.480 fichas nuevas»
const plural = (n: number, one: string, many: string) => `${number(n)} ${n === 1 ? one : many}`

// Fila de una lista: fecha en monoespaciada, enlace a la ficha y lo que haga falta debajo
function Row({
  date,
  name,
  path,
  children,
}: {
  date: string
  name: string
  path: string
  children?: ReactNode
}) {
  return (
    <li className="flex gap-4 py-3">
      <span className="w-24 shrink-0 pt-0.5 font-mono text-sm whitespace-nowrap text-muted tabular-nums">
        {date}
      </span>
      <div className="min-w-0 flex-1">
        <Link to={path} className="font-medium text-fg hover:underline">
          {name}
        </Link>
        {children && <div className="mt-1 text-sm text-muted">{children}</div>}
      </div>
    </li>
  )
}

function Section({ id, title, children }: { id: string; title: string; children: ReactNode }) {
  return (
    <section aria-labelledby={id} className="mb-12">
      <h2 id={id} className={headingClass('section', 'mb-4')}>
        {title}
      </h2>
      {children}
    </section>
  )
}

function Summary({ summary }: { summary: MonthlySummary }) {
  const addedTotal = summary.added.reduce((sum, section) => sum + section.count, 0)
  const empty =
    addedTotal === 0 &&
    summary.spanishEditions.length === 0 &&
    summary.spanishDates.length === 0 &&
    summary.reviews.count === 0

  if (empty) return <p className="text-muted">Este mes no hubo cambios en el catálogo.</p>

  return (
    <>
      {addedTotal > 0 && (
        <Section id="fichas-nuevas" title="Fichas nuevas">
          <div className="space-y-8">
            {summary.added.map(({ section, count, examples }) => {
              const { label, listing, more } = SUMMARY_SECTIONS[section]
              return (
                <section key={section}>
                  <h3 className={headingClass('group', 'mb-1')}>
                    {label} · <span className="font-mono tabular-nums">{number(count)}</span>
                  </h3>
                  <ul className="divide-y divide-line">
                    {examples.map((ficha) => (
                      <Row
                        key={ficha.path}
                        date={formatDataDate(ficha.date)}
                        name={ficha.name}
                        path={ficha.path}
                      >
                        {ficha.context && <Badge>{ficha.context}</Badge>}
                      </Row>
                    ))}
                  </ul>
                  {count > examples.length && (
                    <Link
                      to={listing}
                      className="mt-2 inline-flex min-h-11 items-center gap-1 text-sm text-muted hover:text-fg sm:min-h-0"
                    >
                      {more}
                      <ArrowRightIcon className="size-3.5" aria-hidden="true" />
                    </Link>
                  )}
                </section>
              )
            })}
          </div>
        </Section>
      )}

      {summary.spanishEditions.length > 0 && (
        <Section id="ediciones-castellano" title="Ediciones en castellano nuevas">
          <ul className="divide-y divide-line">
            {summary.spanishEditions.map((edition) => (
              <Row
                key={`${edition.path}|${edition.name}`}
                date={formatDataDate(edition.date)}
                name={edition.name}
                path={edition.path}
              />
            ))}
          </ul>
        </Section>
      )}

      {summary.spanishDates.length > 0 && (
        <Section id="fechas-castellano" title="Fechas en castellano">
          <ul className="divide-y divide-line">
            {summary.spanishDates.map((edition) => (
              <Row
                key={`${edition.path}|${edition.name}`}
                date={formatDataDate(edition.date)}
                name={edition.name}
                path={edition.path}
              >
                Antes: {formatDataDate(edition.before)}
              </Row>
            ))}
          </ul>
        </Section>
      )}

      {summary.reviews.count > 0 && (
        <Section id="resenas" title="Reseñas nuevas">
          <p className="mb-2 text-sm text-muted">
            {plural(summary.reviews.count, 'reseña de medios', 'reseñas de medios')}
            {summary.reviews.count > summary.reviews.items.length &&
              `; aquí, las ${summary.reviews.items.length} más recientes`}
            .
          </p>
          <ul className="divide-y divide-line">
            {summary.reviews.items.map((review) => (
              <Row
                key={`${review.path}|${review.outlet}|${review.date}`}
                date={formatDataDate(review.date)}
                name={review.name}
                path={review.path}
              >
                {review.outlet}
              </Row>
            ))}
          </ul>
        </Section>
      )}
    </>
  )
}

export default function MonthlySummaryPage({
  months = summaries.months,
}: {
  months?: MonthlySummary[]
}) {
  const { month } = useParams()
  const index = months.findIndex((summary) => summary.month === month)
  if (index === -1) return <NotFoundPage />
  const summary = months[index]
  const previous = months[index - 1]
  const next = months[index + 1]
  const label = monthLabel(summary.month)
  const addedTotal = summary.added.reduce((sum, section) => sum + section.count, 0)

  return (
    <>
      <MetaTags
        title={`Este mes en el catálogo: ${label}`}
        description={`Lo que cambió en el Catálogo D&D en ${label}: fichas nuevas, ediciones y fechas en castellano y reseñas de medios.`}
      />

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="max-w-3xl">
          <Breadcrumbs
            items={[{ label: 'Novedades', to: '/novedades' }, { label: capitalize(label) }]}
          />
          <PageHeader
            title={capitalize(label)}
            description="Este mes en el catálogo: lo que cambió en los datos, sacado de su historial."
            meta={[
              plural(addedTotal, 'ficha nueva', 'fichas nuevas'),
              plural(
                summary.spanishEditions.length,
                'edición en castellano',
                'ediciones en castellano'
              ),
              plural(summary.spanishDates.length, 'fecha en castellano', 'fechas en castellano'),
              plural(summary.reviews.count, 'reseña', 'reseñas'),
            ].join(' · ')}
          />

          <Summary summary={summary} />

          <nav
            aria-label="Otros meses"
            className="flex justify-between gap-4 border-t border-line pt-6"
          >
            {previous ? (
              <Link
                to={`/novedades/${previous.month}`}
                className="inline-flex min-h-11 items-center gap-1 text-sm text-muted hover:text-fg"
              >
                <ArrowLeftIcon className="size-3.5" aria-hidden="true" />
                {capitalize(monthLabel(previous.month))}
              </Link>
            ) : (
              <span />
            )}
            {next && (
              <Link
                to={`/novedades/${next.month}`}
                className="inline-flex min-h-11 items-center gap-1 text-sm text-muted hover:text-fg"
              >
                {capitalize(monthLabel(next.month))}
                <ArrowRightIcon className="size-3.5" aria-hidden="true" />
              </Link>
            )}
          </nav>
        </div>
      </div>
    </>
  )
}
