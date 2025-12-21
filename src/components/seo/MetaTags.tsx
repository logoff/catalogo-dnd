import { Helmet } from 'react-helmet-async'
import { SITE_NAME, SITE_DESCRIPTION, SITE_URL } from '@/utils/constants'

interface MetaTagsProps {
  title?: string
  description?: string
  image?: string
  url?: string
}

export default function MetaTags({
  title,
  description = SITE_DESCRIPTION,
  image = `${SITE_URL}/images/dungeons-and-dragons.png`,
  url = SITE_URL,
}: MetaTagsProps) {
  const fullTitle = title ? `${title} | ${SITE_NAME}` : SITE_NAME

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />

      {/* Open Graph */}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:url" content={url} />
      <meta property="og:type" content="website" />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />

      {/* Canonical */}
      <link rel="canonical" href={url} />
    </Helmet>
  )
}
