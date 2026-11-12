import type { GameRelease } from '@/types/videogame'
import { describeSpanish, formatPartialDate, platformNames } from '@/utils/videogameTranslations'

interface ReleaseTableProps {
  releases: GameRelease[]
}

// Una fila por lanzamiento, por fecha; los que no tienen fecha, al final
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
              Edición
            </th>
            <th scope="col" className="py-2 font-semibold">
              Idioma
            </th>
          </tr>
        </thead>
        <tbody className="text-gray-300">
          {sorted.map((release, index) => (
            <tr key={index} className="border-b border-dnd-gold/10">
              <td className="py-2 pr-4">{platformNames[release.platform]}</td>
              <td className="py-2 pr-4">{release.date ? formatPartialDate(release.date) : '—'}</td>
              <td className="py-2 pr-4">
                {release.edition ?? 'Original'}
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
