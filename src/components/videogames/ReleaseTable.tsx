import type { GameRelease } from '@/types/videogame'
import { getBundle } from '@/services/videogameLoader'
import { describeSpanish, formatPartialDate, platformNames } from '@/utils/videogameTranslations'
import PlatformIcon from './PlatformIcon'

interface ReleaseTableProps {
  releases: GameRelease[]
}

// Versión de un lanzamiento: su edición, la recopilación en la que se vende o el original
function versionOf(release: GameRelease): string {
  if (release.bundle) return `En ${getBundle(release.bundle)?.title ?? release.bundle}`
  return release.edition ?? 'Original'
}

// Una fila por versión y plataforma, por fecha; las que no tienen fecha, al final
export default function ReleaseTable({ releases }: ReleaseTableProps) {
  const sorted = [...releases].sort((a, b) => (a.date ?? '9999').localeCompare(b.date ?? '9999'))

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm text-left">
        <thead className="text-gray-400 border-b border-dnd-gold/20">
          <tr>
            <th scope="col" className="py-2 pr-4 font-semibold">
              Plataforma
            </th>
            <th scope="col" className="py-2 pr-4 font-semibold">
              Fecha
            </th>
            <th scope="col" className="py-2 pr-4 font-semibold">
              Versión
            </th>
            <th scope="col" className="py-2 font-semibold">
              Idioma
            </th>
          </tr>
        </thead>
        <tbody className="text-gray-300">
          {sorted.map((release, index) => (
            <tr key={index} className="border-b border-dnd-gold/10">
              <td className="py-2 pr-4">
                <span className="inline-flex items-center gap-2">
                  <PlatformIcon platform={release.platform} />
                  {platformNames[release.platform]}
                </span>
              </td>
              <td className="py-2 pr-4">{release.date ? formatPartialDate(release.date) : '—'}</td>
              <td className="py-2 pr-4">
                {versionOf(release)}
                {release.delisted && <span className="text-gray-500"> (retirado)</span>}
              </td>
              <td className="py-2">
                {describeSpanish(release.spanish)}
                {release.spanish?.note && (
                  <span className="block text-xs text-gray-500">{release.spanish.note}</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
