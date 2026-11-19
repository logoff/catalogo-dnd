import { Link } from 'react-router-dom'
import MetaTags from '@/components/seo/MetaTags'
import PageHeader from '@/components/ui/PageHeader'
import Badge from '@/components/ui/Badge'
import { cardClass } from '@/components/ui/styles'
import { RpgLoading, RpgPage } from '@/components/rpg/RpgSection'
import { useRpgIndex } from '@/hooks/useRpgData'
import { systemsUsing } from '@/utils/rpg'
import { licenseKindNames } from '@/utils/rpgTranslations'

export default function LicensesPage() {
  const index = useRpgIndex()
  if (!index) return <RpgLoading what="las licencias" />

  return (
    <>
      <MetaTags
        title="Licencias abiertas de juegos de rol"
        description="Qué son la OGL, los SRD de D&D, la licencia ORC y otras licencias abiertas de juegos de rol, qué permiten y qué juegos las usan."
      />
      <RpgPage crumbs={[{ label: 'Licencias abiertas' }]}>
        <PageHeader
          title="Licencias abiertas"
          description="Las licencias y documentos de referencia que permiten publicar juegos y suplementos a partir de las reglas de otros, y los sistemas que las usan."
        />
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {index.licenses.map((license) => {
            const count = systemsUsing(index.systems, license.slug).length
            return (
              <li key={license.slug}>
                <Link to={`/licencia/${license.slug}`} className={cardClass(true, 'h-full p-4')}>
                  <span className="mb-2 flex flex-wrap gap-1.5">
                    <Badge>{licenseKindNames[license.kind]}</Badge>
                  </span>
                  <span className="text-lg font-medium text-fg">{license.name}</span>
                  <span className="text-sm text-muted">
                    {license.holder} · {license.date.slice(0, 4)}
                  </span>
                  <span className="mt-2 text-sm text-muted">
                    {count === 0
                      ? 'Ningún sistema de la sección la usa directamente'
                      : count === 1
                        ? 'La usa 1 sistema'
                        : `La usan ${count} sistemas`}
                  </span>
                </Link>
              </li>
            )
          })}
        </ul>
      </RpgPage>
    </>
  )
}
