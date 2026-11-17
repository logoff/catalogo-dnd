import { Link } from 'react-router-dom'
import type { NovelSetting } from '@/types/novel'
import { useNovelIndex } from '@/hooks/useNovelData'
import { spanishNovelsBySetting } from '@/utils/readingOrders'
import { settingNames } from '@/utils/novelTranslations'
import GuideLayout from './GuideLayout'
import { NovelRow } from './ReadingOrderGuide'

const SETTINGS = Object.keys(settingNames) as NovelSetting[]

export default function SpanishNovelsGuide() {
  const index = useNovelIndex()
  const groups = index ? spanishNovelsBySetting(index, SETTINGS) : []
  const total = index ? index.novels.filter((n) => n.spanish !== 'none').length : 0

  return (
    <GuideLayout
      title="Novelas de D&D en castellano"
      description="Qué novelas oficiales de Dungeons & Dragons se han publicado en castellano, por mundo y serie."
    >
      <p>
        De las más de seiscientas novelas oficiales de Dungeons & Dragons, una parte se ha traducido
        al castellano, sobre todo de la Dragonlance y de los Reinos Olvidados, con Timun Mas y
        después Minotauro. Aquí están todas, agrupadas por mundo y por serie, con cuántas novelas de
        cada serie se han publicado en castellano. Cada título lleva a su ficha, con sus ediciones y
        dónde comprarlas.
      </p>
      {!index ? (
        <p className="text-gray-400">Cargando novelas…</p>
      ) : (
        <>
          <p>
            En total, <strong>{total} novelas</strong> tienen al menos una edición en castellano.
            Para ver también las que solo están en inglés, usa el{' '}
            <Link to="/novelas">listado de novelas</Link>.
          </p>
          {groups.map((group) => (
            <section key={group.setting}>
              <h2>{settingNames[group.setting]}</h2>
              {group.series.map((series) => (
                <div key={series.id}>
                  <h3>
                    <Link to={`/novelas?serie=${series.id}`}>{series.name}</Link>{' '}
                    <span className="text-sm font-normal text-gray-400">
                      {series.translated.length} de {series.total}
                    </span>
                  </h3>
                  <ul className="!list-none !pl-0 space-y-3">
                    {series.translated.map((novel) => (
                      <NovelRow key={novel.slug} novel={novel} />
                    ))}
                  </ul>
                </div>
              ))}
              {group.standalone.length > 0 && (
                <div>
                  <h3>Novelas sueltas</h3>
                  <ul className="!list-none !pl-0 space-y-3">
                    {group.standalone.map((novel) => (
                      <NovelRow key={novel.slug} novel={novel} />
                    ))}
                  </ul>
                </div>
              )}
            </section>
          ))}
        </>
      )}
    </GuideLayout>
  )
}
