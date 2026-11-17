import { useEffect, useRef } from 'react'
import { useLocation, useSearchParams } from 'react-router-dom'
import { useNovelStore } from '@/store/novelStore'
import type { NovelSetting } from '@/types/novel'
import { settingNames } from '@/utils/novelTranslations'

const VALID_SETTINGS = Object.keys(settingNames) as NovelSetting[]

// Filtros de mundo y serie en la dirección (/novelas?mundo=dragonlance&serie=…), para compartir
// un listado filtrado. Se leen tras montar, como cualquier cambio de filtro, para que el primer
// render coincida con el HTML prerenderizado, que no lleva parámetros.
export function useNovelUrlFilters() {
  const [searchParams, setSearchParams] = useSearchParams()
  const { pathname } = useLocation()
  const settings = useNovelStore((state) => state.settings)
  const series = useNovelStore((state) => state.series)
  const applyUrlFilters = useNovelStore((state) => state.applyUrlFilters)
  const initialized = useRef(false)

  useEffect(() => {
    if (initialized.current) return
    initialized.current = true
    const fromUrl = {
      settings: searchParams
        .getAll('mundo')
        .filter((s): s is NovelSetting => VALID_SETTINGS.includes(s as NovelSetting)),
      series: searchParams.getAll('serie'),
    }
    if (fromUrl.settings.length > 0 || fromUrl.series.length > 0) applyUrlFilters(fromUrl)
  }, [searchParams, applyUrlFilters])

  useEffect(() => {
    // La página sigue montada durante la animación de salida: no tocar la dirección de otra
    if (!initialized.current || !/^\/novelas\/?$/.test(pathname)) return
    const params = new URLSearchParams()
    settings.forEach((s) => params.append('mundo', s))
    series.forEach((s) => params.append('serie', s))
    if (params.toString() !== searchParams.toString()) setSearchParams(params, { replace: true })
  }, [settings, series, searchParams, setSearchParams, pathname])
}
