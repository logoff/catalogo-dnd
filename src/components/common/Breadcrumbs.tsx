import { Link } from 'react-router-dom'
import { ChevronRightIcon, HomeIcon } from '@heroicons/react/24/outline'
import { BASE_PATH } from '@/utils/constants'

interface BreadcrumbItem {
  label: string
  to?: string
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[]
}

function buildAbsoluteUrl(path: string): string {
  const base = BASE_PATH.endsWith('/') ? BASE_PATH.slice(0, -1) : BASE_PATH
  return `${window.location.origin}${base}${path}`
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
        className="flex items-center text-sm text-gray-400 mb-6 overflow-x-auto scrollbar-hide"
      >
        <ol className="flex items-center space-x-1 sm:space-x-2">
          {/* Home */}
          <li>
            <Link
              to="/"
              className="flex items-center hover:text-dnd-gold transition-colors p-1 -m-1 rounded"
              aria-label="Inicio"
            >
              <HomeIcon className="h-4 w-4" />
            </Link>
          </li>

          {/* Collapsed items on mobile */}
          {showCollapsed && (
            <li className="flex items-center sm:hidden">
              <ChevronRightIcon className="h-3 w-3 mx-1 flex-shrink-0" />
              <span className="text-gray-500">…</span>
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
                <ChevronRightIcon className="h-3 w-3 mx-1 sm:mx-2 flex-shrink-0" />
                {item.to && !isLast ? (
                  <Link
                    to={item.to}
                    className="hover:text-dnd-gold transition-colors whitespace-nowrap"
                  >
                    {item.label}
                  </Link>
                ) : (
                  <span
                    className={`whitespace-nowrap ${isLast ? 'text-gray-200 font-medium' : ''}`}
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
