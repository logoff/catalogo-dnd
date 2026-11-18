import { Link } from 'react-router-dom'
import { ChevronRightIcon, HomeIcon } from '@heroicons/react/24/outline'
import { BASE_PATH, SITE_URL } from '@/utils/constants'

interface BreadcrumbItem {
  label: string
  to?: string
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[]
}

function buildAbsoluteUrl(path: string): string {
  const base = BASE_PATH.endsWith('/') ? BASE_PATH.slice(0, -1) : BASE_PATH
  return `${SITE_URL}${base}${path}`
}

export default function Breadcrumbs({ items }: BreadcrumbsProps) {
  // Build structured data for SEO
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Inicio',
        item: buildAbsoluteUrl('/'),
      },
      ...items.map((item, index) => ({
        '@type': 'ListItem',
        position: index + 2,
        name: item.label,
        ...(item.to ? { item: buildAbsoluteUrl(item.to) } : {}),
      })),
    ],
  }

  // For mobile: show ellipsis if more than 2 items
  const showCollapsed = items.length > 2

  return (
    <>
      {/* Schema.org structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      <nav
        aria-label="Breadcrumb"
        className="mb-6 flex items-center overflow-x-auto text-sm text-muted scrollbar-hide"
      >
        <ol className="flex items-center space-x-1 sm:space-x-2">
          {/* Home */}
          <li>
            <Link
              to="/"
              className="-m-1 flex items-center rounded-sm p-1 transition-colors duration-150 hover:text-fg"
              aria-label="Inicio"
            >
              <HomeIcon className="size-4" aria-hidden="true" />
            </Link>
          </li>

          {/* Collapsed items on mobile */}
          {showCollapsed && (
            <li className="flex items-center sm:hidden">
              <ChevronRightIcon className="mx-1 size-3 shrink-0" aria-hidden="true" />
              <span className="text-muted">…</span>
            </li>
          )}

          {/* Items */}
          {items.map((item, index) => {
            const isLast = index === items.length - 1
            const isHiddenOnMobile = showCollapsed && index < items.length - 1

            return (
              <li
                key={item.label}
                className={`flex items-center ${isHiddenOnMobile ? 'hidden sm:flex' : 'flex'}`}
              >
                <ChevronRightIcon className="mx-1 size-3 shrink-0 sm:mx-2" aria-hidden="true" />
                {item.to && !isLast ? (
                  <Link
                    to={item.to}
                    className="whitespace-nowrap transition-colors duration-150 hover:text-fg"
                  >
                    {item.label}
                  </Link>
                ) : (
                  <span
                    className={`whitespace-nowrap ${isLast ? 'text-fg' : ''}`}
                    aria-current={isLast ? 'page' : undefined}
                  >
                    {item.label}
                  </span>
                )}
              </li>
            )
          })}
        </ol>
      </nav>
    </>
  )
}
