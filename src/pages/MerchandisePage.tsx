import { useMemo, useState } from 'react'
import { useMerchandiseStore } from '@/store/merchandiseStore'
import MetaTags from '@/components/seo/MetaTags'
import Breadcrumbs from '@/components/common/Breadcrumbs'
import ViewToggle, { type ViewMode } from '@/components/products/ViewToggle'
import MerchandiseCard from '@/components/merchandise/MerchandiseCard'
import MerchandiseFilterPanel from '@/components/merchandise/MerchandiseFilterPanel'
import { filterMerchandise, sortMerchandise } from '@/utils/merchandiseFilters'

export default function MerchandisePage() {
  const state = useMerchandiseStore()
  const { items, searchQuery, groups, kinds, spainOnly, availableOnly } = state
  const [view, setView] = useState<ViewMode>('grid')

  const results = useMemo(
    () =>
      sortMerchandise(
        filterMerchandise(items, { searchQuery, groups, kinds, spainOnly, availableOnly }),
        state.sort
      ),
    [items, searchQuery, groups, kinds, spainOnly, availableOnly, state.sort]
  )

  return (
    <>
      <MetaTags
        title="Merchandising de D&D"
        description="Productos oficiales con licencia de Dungeons & Dragons que no son de reglas: libros de cocina y de arte, figuras, LEGO, Funko y juegos de mesa, con lo que llega a España en castellano."
      />

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <Breadcrumbs items={[{ label: 'Merchandising' }]} />

        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="mb-2 text-3xl font-semibold tracking-tight sm:text-4xl">
              Merchandising de D&D
            </h1>
            <p className="text-muted">
              {results.length} de {items.length} artículos
            </p>
          </div>
          <ViewToggle view={view} onChange={setView} />
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          <aside className="shrink-0 lg:w-64">
            <div className="lg:sticky lg:top-24">
              <MerchandiseFilterPanel />
            </div>
          </aside>

          <div className="min-w-0 flex-1">
            {results.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted text-lg mb-4">
                  Ningún artículo cumple los filtros seleccionados
                </p>
                <button onClick={state.clearFilters} className="btn-primary">
                  Quitar filtros
                </button>
              </div>
            ) : view === 'list' ? (
              <div className="divide-y divide-line overflow-hidden rounded-xl border border-line bg-surface">
                {results.map((item) => (
                  <MerchandiseCard key={item.slug} item={item} view="list" />
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 xl:grid-cols-4">
                {results.map((item) => (
                  <MerchandiseCard key={item.slug} item={item} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  )
}
