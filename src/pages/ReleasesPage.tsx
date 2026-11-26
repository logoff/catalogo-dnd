import { useState } from 'react'
import { Link } from 'react-router-dom'
import releases from 'virtual:releases'
import summaries from 'virtual:monthly-summaries'
import MetaTags from '@/components/seo/MetaTags'
import Breadcrumbs from '@/components/common/Breadcrumbs'
import PageHeader from '@/components/ui/PageHeader'
import SegmentedControl from '@/components/ui/SegmentedControl'
import { headingClass } from '@/components/ui/styles'
import { ReleaseList, ReleasesByMonth } from '@/components/releases/ReleaseList'
import type { Release } from '@/types/releases'
import type { Language } from '@/types'
import type { MonthlySummary } from '@/types/monthlySummary'
import { monthLabel } from '@/utils/monthlySummary'

type LanguageFilter = 'todos' | Language

const LANGUAGE_OPTIONS: { value: LanguageFilter; label: string }[] = [
  { value: 'todos', label: 'Todos' },
  { value: 'castellano', label: 'Castellano' },
  { value: 'english', label: 'Inglés' },
]

const EMPTY_TEXT: Record<LanguageFilter, string> = {
  todos: 'No ha salido nada en los últimos 90 días.',
  castellano: 'No ha salido nada en castellano en los últimos 90 días.',
  english: 'No ha salido nada en inglés en los últimos 90 días.',
}

// Con un idioma elegido, quedan fuera las entradas sin idioma (videojuegos y algún artículo)
const byLanguage = (filter: LanguageFilter) => (release: Release) =>
  filter === 'todos' || release.language === filter

const capitalize = (text: string) => text.charAt(0).toUpperCase() + text.slice(1)

// El último resumen mensual y el archivo de todos, del más reciente al más antiguo
function MonthlySummaries({ months }: { months: MonthlySummary[] }) {
  const latest = months[months.length - 1]
  return (
    <section aria-labelledby="este-mes" className="mt-12 border-t border-line pt-8">
      <h2 id="este-mes" className={headingClass('section', 'mb-2')}>
        Este mes en el catálogo
      </h2>
      <p className="mb-4 text-sm text-muted">
        Lo que cambió en el catálogo cada mes: fichas nuevas, ediciones y fechas en castellano y
        reseñas.
      </p>
      <Link to={`/novedades/${latest.month}`} className="font-medium text-fg underline">
        Último resumen: {monthLabel(latest.month)}
      </Link>
      {months.length > 1 && (
        <>
          <h3 className={headingClass('group', 'mt-6 mb-2')}>Archivo</h3>
          <ul className="flex flex-wrap gap-x-4 gap-y-2 text-sm">
            {[...months].reverse().map(({ month }) => (
              <li key={month}>
                <Link to={`/novedades/${month}`} className="text-muted hover:text-fg">
                  {capitalize(monthLabel(month))}
                </Link>
              </li>
            ))}
          </ul>
        </>
      )}
    </section>
  )
}

export default function ReleasesPage({
  data = releases,
  months = summaries.months,
}: {
  data?: typeof releases
  months?: MonthlySummary[]
}) {
  // «Todos» en el primer render, igual en el servidor que en el navegador
  const [language, setLanguage] = useState<LanguageFilter>('todos')
  const keep = byLanguage(language)
  const upcoming = data.upcoming.filter(keep)
  const announced = data.announced.filter(keep)
  const recent = data.recent.filter(keep)
  const campaigns = data.campaigns.filter(keep)

  return (
    <>
      <MetaTags
        title="Novedades de D&D"
        description="Novedades de Dungeons & Dragons en inglés y en castellano: lo que acaba de salir y lo que está por llegar en libros, videojuegos, merchandising, novelas y otros juegos de rol."
      />

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="max-w-3xl">
          <Breadcrumbs items={[{ label: 'Novedades' }]} />
          <PageHeader
            title="Novedades"
            description="Lo que acaba de salir y lo que está por llegar de D&D, en inglés y en castellano. Se actualiza cada día."
            meta={
              <>
                También en el{' '}
                <a href="/feed.xml" className="text-fg underline">
                  feed de novedades
                </a>
                , para seguirlas con un lector de RSS.
              </>
            }
          />

          <SegmentedControl
            label="Idioma"
            options={LANGUAGE_OPTIONS}
            value={language}
            onChange={setLanguage}
            className="mb-8"
          />

          {campaigns.length > 0 && (
            <section aria-labelledby="micromecenazgo" className="mb-12">
              <h2 id="micromecenazgo" className={headingClass('section', 'mb-1')}>
                En micromecenazgo
              </h2>
              <p className="mb-4 text-sm text-muted">
                Campañas abiertas, con su fecha de cierre: es cuando se pueden conseguir.
              </p>
              <ReleaseList releases={campaigns} />
            </section>
          )}

          {(upcoming.length > 0 || announced.length > 0) && (
            <section aria-labelledby="proximamente" className="mb-12">
              <h2 id="proximamente" className={headingClass('section', 'mb-1')}>
                Próximamente
              </h2>
              <p className="mb-4 text-sm text-muted">Las fechas anunciadas pueden cambiar.</p>
              <div className="space-y-6">
                {upcoming.length > 0 && <ReleasesByMonth releases={upcoming} />}
                {announced.length > 0 && (
                  <section>
                    <h3 className={headingClass('group', 'mb-1')}>Anunciados sin fecha concreta</h3>
                    <ReleaseList releases={announced} />
                  </section>
                )}
              </div>
            </section>
          )}

          <section aria-labelledby="recien-salido">
            <h2 id="recien-salido" className={headingClass('section', 'mb-4')}>
              Recién salido
            </h2>
            {recent.length > 0 ? (
              <ReleasesByMonth releases={recent} />
            ) : (
              <p className="text-sm text-muted">{EMPTY_TEXT[language]}</p>
            )}
          </section>

          {months.length > 0 && <MonthlySummaries months={months} />}
        </div>
      </div>
    </>
  )
}
