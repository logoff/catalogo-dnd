import { useState } from 'react'
import releases from 'virtual:releases'
import MetaTags from '@/components/seo/MetaTags'
import Breadcrumbs from '@/components/common/Breadcrumbs'
import PageHeader from '@/components/ui/PageHeader'
import SegmentedControl from '@/components/ui/SegmentedControl'
import { headingClass } from '@/components/ui/styles'
import { ReleaseList, ReleasesByMonth } from '@/components/releases/ReleaseList'
import type { Release } from '@/types/releases'
import type { Language } from '@/types'

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

export default function ReleasesPage({ data = releases }: { data?: typeof releases }) {
  // «Todos» en el primer render, igual en el servidor que en el navegador
  const [language, setLanguage] = useState<LanguageFilter>('todos')
  const keep = byLanguage(language)
  const upcoming = data.upcoming.filter(keep)
  const announced = data.announced.filter(keep)
  const recent = data.recent.filter(keep)

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
        </div>
      </div>
    </>
  )
}
