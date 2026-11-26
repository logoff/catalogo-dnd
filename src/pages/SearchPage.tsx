import { useEffect, useMemo, useState, useSyncExternalStore } from 'react'
import { Link } from 'react-router-dom'
import MetaTags from '@/components/seo/MetaTags'
import Breadcrumbs from '@/components/common/Breadcrumbs'
import LazyImage from '@/components/common/LazyImage'
import PageHeader from '@/components/ui/PageHeader'
import SearchField from '@/components/ui/SearchField'
import { Button } from '@/components/ui/Button'
import { SpanishMark } from '@/components/ui/Badge'
import { headingClass } from '@/components/ui/styles'
import { useSearchQuery, useSiteSearchInput } from '@/hooks/useSiteSearchInput'
import { getAllProducts } from '@/services/dataLoader'
import { getAllVideogames } from '@/services/videogameLoader'
import { getAllMerchandise } from '@/services/merchandiseLoader'
import { getAllScreenWorks } from '@/services/screenLoader'
import { getNovelIndex, loadNovelIndex } from '@/services/novelLoader'
import { getComicIndex, loadComicIndex } from '@/services/comicLoader'
import { getRpgIndex, loadRpgIndex } from '@/services/rpgLoader'
import {
  comicEntries,
  merchandiseEntries,
  novelEntries,
  productEntries,
  rpgEntries,
  SEARCH_SECTIONS,
  searchSite,
  videogameEntries,
  type SearchEntry,
  type SearchGroup,
  screenEntries,
} from '@/utils/siteSearch'

// Resultados que se ven de entrada en cada grupo
export const GROUP_PREVIEW = 8

// Para saber si ya se ha hidratado: en el servidor y al hidratar devuelve false, después true
const noSubscription = () => () => {}

// Libros, videojuegos, merchandising y cine y series están siempre en memoria
const inMemory = (): SearchEntry[] => [
  ...productEntries(getAllProducts()),
  ...videogameEntries(getAllVideogames()),
  ...merchandiseEntries(getAllMerchandise()),
  ...screenEntries(getAllScreenWorks()),
]

function ResultRow({ entry }: { entry: SearchEntry }) {
  return (
    <li>
      <Link
        to={entry.path}
        className="flex items-center gap-4 py-3 transition-colors duration-150 hover:bg-well sm:px-2"
        // Evento de Umami: desde qué sección se abren los resultados del buscador
        data-umami-event="buscar"
        data-umami-event-seccion={entry.section}
      >
        {entry.image ? (
          <LazyImage
            src={entry.image}
            alt=""
            containerClassName="h-14 w-10 shrink-0 rounded"
            className="h-full w-full object-cover"
          />
        ) : (
          <span className="h-14 w-10 shrink-0 rounded bg-well" aria-hidden="true" />
        )}
        <div className="flex min-w-0 flex-col gap-0.5">
          <span className={headingClass('item', 'text-fg')}>{entry.title}</span>
          {entry.titleEs && <SpanishMark>{entry.titleEs}</SpanishMark>}
          {entry.detail && <span className="text-sm text-muted">{entry.detail}</span>}
        </div>
      </Link>
    </li>
  )
}

function ResultGroup({ group }: { group: SearchGroup }) {
  const [expanded, setExpanded] = useState(false)
  const shown = expanded ? group.entries : group.entries.slice(0, GROUP_PREVIEW)
  const rest = group.entries.length - shown.length
  const id = `resultados-${group.section}`

  return (
    <section aria-labelledby={id}>
      <h2 id={id} className={headingClass('title', 'mb-1 flex items-baseline gap-2')}>
        {group.label}
        <span className="font-mono text-sm font-normal text-muted tabular-nums">
          {group.entries.length}
        </span>
      </h2>
      <ul className="divide-y divide-line">
        {shown.map((entry) => (
          <ResultRow key={entry.path} entry={entry} />
        ))}
      </ul>
      {rest > 0 && (
        <Button size="sm" className="mt-2" onClick={() => setExpanded(true)}>
          Ver {rest === 1 ? 'el restante' : `los ${rest} restantes`}
        </Button>
      )}
    </section>
  )
}

function NoResults({ query }: { query: string }) {
  return (
    <div>
      <p className="mb-4 text-base">
        No hay resultados para «<span className="font-medium">{query}</span>».
      </p>
      <p className="mb-2 text-sm text-muted">Puedes buscar en el listado de cada sección:</p>
      <ul className="flex flex-wrap gap-x-4 gap-y-2 text-sm">
        {SEARCH_SECTIONS.map((section) => (
          <li key={section.id}>
            <Link to={section.path} className="text-fg underline">
              {section.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default function SearchPage() {
  const input = useSiteSearchInput()
  const urlQuery = useSearchQuery()
  // El texto de la URL se aplica tras hidratar: el HTML prerenderizado de /buscar va vacío
  const hydrated = useSyncExternalStore(
    noSubscription,
    () => true,
    () => false
  )
  const query = hydrated ? urlQuery : ''

  // Novelas, cómics y rol van en trozos aparte: se piden al abrir la página
  const [novels, setNovels] = useState(getNovelIndex)
  const [comics, setComics] = useState(getComicIndex)
  const [rpg, setRpg] = useState(getRpgIndex)
  useEffect(() => {
    loadNovelIndex().then(setNovels)
    loadComicIndex().then(setComics)
    loadRpgIndex().then(setRpg)
  }, [])

  const base = useMemo(() => inMemory(), [])
  const entries = useMemo(
    () => [
      ...base,
      ...(novels ? novelEntries(novels.novels) : []),
      ...(comics ? comicEntries(comics) : []),
      ...(rpg ? rpgEntries(rpg) : []),
    ],
    [base, novels, comics, rpg]
  )
  const groups = useMemo(() => searchSite(query, entries), [query, entries])
  const total = groups.reduce((sum, group) => sum + group.entries.length, 0)
  const loading = !novels || !comics || !rpg
  const hasQuery = query.trim() !== ''

  return (
    <>
      <MetaTags
        title={hasQuery ? `Buscar «${query.trim()}»` : 'Buscar en el catálogo'}
        description="Busca en todo el catálogo de D&D: libros, ediciones anteriores, videojuegos, merchandising, novelas, cómics y otros juegos de rol."
        noindex
      />
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="max-w-3xl">
          <Breadcrumbs items={[{ label: 'Buscar' }]} />
          <PageHeader
            title="Buscar en el catálogo"
            description="Por título, en inglés o en castellano, por autor o editorial y por ISBN."
            meta={
              hasQuery && !(loading && total === 0)
                ? `${total} ${total === 1 ? 'resultado' : 'resultados'}`
                : undefined
            }
          />
          <form role="search" onSubmit={input.onSubmit} className="mb-8">
            <SearchField
              label="Texto que buscar"
              value={input.value}
              onChange={input.onChange}
              onClear={input.onClear}
              placeholder="Título, autor, ISBN…"
              size="lg"
            />
          </form>
          {hasQuery && loading && (
            <p className="mb-6 text-sm text-muted" role="status">
              Buscando también en novelas, cómics y otros juegos de rol…
            </p>
          )}
          {hasQuery && groups.length > 0 && (
            <div className="space-y-10">
              {groups.map((group) => (
                // La clave con el texto vuelve a plegar los grupos en cada búsqueda
                <ResultGroup key={`${group.section}|${query}`} group={group} />
              ))}
            </div>
          )}
          {hasQuery && !loading && groups.length === 0 && <NoResults query={query.trim()} />}
        </div>
      </div>
    </>
  )
}
