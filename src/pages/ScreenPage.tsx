import { useMemo, useState } from 'react'
import { ArrowsUpDownIcon } from '@heroicons/react/24/outline'
import type { ScreenKind, ScreenWorkWithMeta } from '@/types/screen'
import { getAllScreenWorks } from '@/services/screenLoader'
import MetaTags from '@/components/seo/MetaTags'
import Breadcrumbs from '@/components/common/Breadcrumbs'
import PageHeader from '@/components/ui/PageHeader'
import SegmentedControl from '@/components/ui/SegmentedControl'
import { buttonClass, selectClass } from '@/components/ui/styles'
import ScreenCard from '@/components/screen/ScreenCard'
import {
  filterScreenWorks,
  kindPluralNames,
  sortScreenWorks,
  type ScreenSort,
} from '@/utils/screen'

const KINDS: ScreenKind[] = ['film', 'series', 'documentary', 'episode']

const SORT_OPTIONS: { value: ScreenSort; label: string }[] = [
  { value: 'date-desc', label: 'Más recientes primero' },
  { value: 'date-asc', label: 'Más antiguas primero' },
  { value: 'title', label: 'Título (A-Z)' },
]

function Grid({ works }: { works: ScreenWorkWithMeta[] }) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4 xl:grid-cols-5">
      {works.map((work) => (
        <ScreenCard key={work.slug} work={work} />
      ))}
    </div>
  )
}

export default function ScreenPage() {
  const works = getAllScreenWorks()
  const [kind, setKind] = useState<ScreenKind | 'all'>('all')
  const [spanishOnly, setSpanishOnly] = useState(false)
  const [sort, setSort] = useState<ScreenSort>('date-desc')

  const results = useMemo(
    () => sortScreenWorks(filterScreenWorks(works, { kind, spanishOnly }), sort),
    [works, kind, spanishOnly, sort]
  )
  const official = results.filter((work) => work.official)
  const unofficial = results.filter((work) => !work.official)
  // Solo los tipos que hay en la sección
  const kinds = KINDS.filter((k) => works.some((work) => work.kind === k))

  return (
    <>
      <MetaTags
        title="Cine y series de D&D"
        description="Todas las películas, series y documentales de Dungeons & Dragons, con sus títulos y estrenos en España, carteles, tráileres y ediciones en castellano, y aparte las obras no oficiales sobre el juego."
      />

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <Breadcrumbs items={[{ label: 'Cine y series' }]} />

        <PageHeader
          title="Cine y series de D&D"
          description="Películas, series y documentales oficiales de Dungeons & Dragons y, aparte, obras sin licencia que tratan del juego."
          meta={`${results.length} de ${works.length} obras`}
        />

        <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
          <SegmentedControl
            label="Tipo de obra"
            value={kind}
            onChange={setKind}
            options={[
              { value: 'all', label: 'Todo' },
              ...kinds.map((k) => ({ value: k, label: kindPluralNames[k] })),
            ]}
          />
          <label className="inline-flex min-h-11 items-center gap-2 text-sm sm:min-h-0">
            <input
              type="checkbox"
              checked={spanishOnly}
              onChange={(event) => setSpanishOnly(event.target.checked)}
              className="size-4 rounded border-line bg-surface text-accent-solid focus:ring-0 focus:ring-offset-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"
            />
            Solo en castellano
          </label>
          <div className="relative sm:ml-auto sm:w-60">
            <ArrowsUpDownIcon
              className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted"
              aria-hidden="true"
            />
            <select
              value={sort}
              onChange={(event) => setSort(event.target.value as ScreenSort)}
              aria-label="Ordenar por"
              className={selectClass}
            >
              {SORT_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {results.length === 0 ? (
          <div className="py-12 text-center">
            <p className="mb-4 text-lg text-muted">Ninguna obra cumple los filtros seleccionados</p>
            <button
              type="button"
              onClick={() => {
                setKind('all')
                setSpanishOnly(false)
              }}
              className={buttonClass('secondary')}
            >
              Quitar filtros
            </button>
          </div>
        ) : (
          <div className="space-y-12">
            {official.length > 0 && (
              <section aria-labelledby="oficiales">
                <h2 id="oficiales" className="mb-4 text-xl">
                  Oficiales
                </h2>
                <Grid works={official} />
              </section>
            )}
            {unofficial.length > 0 && (
              <section aria-labelledby="no-oficiales">
                <h2 id="no-oficiales" className="mb-2 text-xl">
                  No oficiales
                </h2>
                <p className="mb-4 max-w-3xl text-sm text-muted">
                  Obras sin licencia de Wizards of the Coast cuyo tema principal es D&D: el juego,
                  sus creadores, sus jugadores o una campaña. No entran las que solo muestran una
                  partida de pasada.
                </p>
                <Grid works={unofficial} />
              </section>
            )}
          </div>
        )}
      </div>
    </>
  )
}
