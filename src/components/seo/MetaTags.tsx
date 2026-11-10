import { useLocation } from 'react-router-dom'
import { SITE_NAME, SITE_DESCRIPTION, SITE_URL } from '@/utils/constants'
import { summarize } from '@/utils/formatters'

interface MetaTagsProps {
  title?: string
  description?: string
  image?: string
  url?: string
}

export default function MetaTags({
  title,
  description = SITE_DESCRIPTION,
  image = `${SITE_URL}/images/og.png`,
  url,
}: MetaTagsProps) {
  const fullTitle = title ? `${title} | ${SITE_NAME}` : SITE_NAME
  const summary = summarize(description)
  const { pathname } = useLocation()
  // Por defecto, la URL de la página actual (sin parámetros como los UTM)
  const pageUrl = url ?? `${SITE_URL}${pathname === '/' ? '/' : pathname}`

  // React 19 lleva estas etiquetas al <head> del documento
  return (
    <>
      <title>{fullTitle}</title>
      <meta name="description" content={summary} />

      {/* Open Graph */}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={summary} />
      <meta property="og:image" content={image} />
      <meta property="og:url" content={pageUrl} />
      <meta property="og:type" content="website" />
      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:locale" content="es_ES" />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={summary} />
      <meta name="twitter:image" content={image} />

      {/* Canonical */}
      <link rel="canonical" href={pageUrl} />
    </>
  )
}
