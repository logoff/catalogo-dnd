import { Link, NavLink, useLocation } from 'react-router-dom'
import {
  Bars3Icon,
  ChevronDownIcon,
  MagnifyingGlassIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline'
import { useEffect, useRef, useState } from 'react'
import clsx from 'clsx'
import SearchBar from '../filters/SearchBar'
import Logo from '@/components/ui/Logo'
import ThemeToggle from '@/components/ui/ThemeToggle'

interface NavItem {
  to: string
  label: string
}

interface NavGroup {
  label: string
  items: NavItem[]
  // Rutas que, sin estar en el menú, pertenecen al grupo (fichas de producto)
  extraPaths?: string[]
}

// Libros y accesorios de rol primero; luego las secciones de lo demás.
const booksGroup: NavGroup = {
  label: 'Libros',
  items: [
    { to: '/catalogo', label: 'Catálogo completo' },
    { to: '/2014', label: '5E (2014)' },
    { to: '/2024', label: '5.5E (2024)' },
  ],
  extraPaths: ['/producto'],
}

const sectionLinks: NavItem[] = [
  { to: '/videojuegos', label: 'Videojuegos' },
  { to: '/merchandising', label: 'Merchandising' },
  { to: '/novelas', label: 'Novelas' },
  { to: '/cine-y-series', label: 'Cine y series' },
  { to: '/rol', label: 'Otros juegos de rol' },
  { to: '/guias', label: 'Guías' },
]

function isGroupActive(group: NavGroup, pathname: string) {
  return [...group.items.map((item) => item.to), ...(group.extraPaths ?? [])].some(
    (path) => pathname === path || pathname.startsWith(`${path}/`)
  )
}

const linkClass = (active: boolean) =>
  clsx(
    'inline-flex min-h-10 items-center rounded-md px-3 text-sm transition-colors duration-150',
    active ? 'font-medium text-fg' : 'text-muted hover:text-fg'
  )

const navLinkClass = ({ isActive }: { isActive: boolean }) => linkClass(isActive)

const mobileLinkClass = ({ isActive }: { isActive: boolean }) =>
  clsx(
    'flex min-h-11 items-center rounded-md px-3 text-base transition-colors duration-150',
    isActive ? 'bg-well font-medium text-fg' : 'text-fg hover:bg-well'
  )

function NavDropdown({ group }: { group: NavGroup }) {
  const [open, setOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const { pathname } = useLocation()
  const active = isGroupActive(group, pathname)

  useEffect(() => {
    if (!open) return
    const handlePointer = (event: MouseEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) setOpen(false)
    }
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false)
    }
    document.addEventListener('mousedown', handlePointer)
    document.addEventListener('keydown', handleKey)
    return () => {
      document.removeEventListener('mousedown', handlePointer)
      document.removeEventListener('keydown', handleKey)
    }
  }, [open])

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        className={clsx(linkClass(active), 'gap-1')}
        aria-haspopup="true"
        aria-expanded={open}
        onClick={() => setOpen(!open)}
      >
        {group.label}
        <ChevronDownIcon className="size-3.5" aria-hidden="true" />
      </button>
      {open && (
        <div className="absolute left-0 mt-1 w-52 rounded-xl border border-line bg-surface p-1 shadow-lg shadow-black/10">
          {group.items.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end
              className={({ isActive }) =>
                clsx(
                  'flex min-h-10 items-center rounded-lg px-3 text-sm transition-colors duration-150',
                  isActive ? 'bg-well font-medium text-fg' : 'text-fg hover:bg-well'
                )
              }
              onClick={() => setOpen(false)}
            >
              {item.label}
            </NavLink>
          ))}
        </div>
      )}
    </div>
  )
}

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const closeMobileMenu = () => setMobileMenuOpen(false)

  return (
    <header className="sticky top-0 z-50 border-b border-line bg-surface">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center gap-4">
          <Link to="/" className="flex items-center gap-2.5 font-semibold tracking-tight">
            <Logo className="size-8" />
            <span className="text-base">Catálogo D&amp;D</span>
          </Link>

          <nav aria-label="Principal" className="ml-4 hidden items-center gap-1 md:flex">
            <NavDropdown group={booksGroup} />
            {sectionLinks.map((item) => (
              <NavLink key={item.to} to={item.to} className={navLinkClass}>
                {item.label}
              </NavLink>
            ))}
          </nav>

          <div className="ml-auto hidden w-64 lg:block">
            <SearchBar />
          </div>

          <div className="ml-auto flex items-center gap-2 lg:ml-0">
            {/* Entre md y lg no cabe el buscador: se llega al del catálogo */}
            <Link
              to="/catalogo"
              aria-label="Buscar libros"
              className="hidden size-10 items-center justify-center rounded-lg border border-line text-fg hover:bg-well md:inline-flex lg:hidden"
            >
              <MagnifyingGlassIcon className="size-5" aria-hidden="true" />
            </Link>
            <ThemeToggle />
            <button
              type="button"
              className="inline-flex size-10 items-center justify-center rounded-lg text-fg hover:bg-well md:hidden"
              aria-label={mobileMenuOpen ? 'Cerrar el menú' : 'Abrir el menú'}
              aria-expanded={mobileMenuOpen}
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? (
                <XMarkIcon className="size-6" aria-hidden="true" />
              ) : (
                <Bars3Icon className="size-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="border-t border-line py-4 md:hidden">
            <div className="mb-4">
              <SearchBar />
            </div>
            <nav aria-label="Principal" className="flex flex-col gap-1">
              <span className="px-3 pt-1 pb-1 text-xs font-medium text-muted">
                {booksGroup.label}
              </span>
              {booksGroup.items.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end
                  className={mobileLinkClass}
                  onClick={closeMobileMenu}
                >
                  {item.label}
                </NavLink>
              ))}
              <span className="mt-2 border-t border-line" aria-hidden="true" />
              {sectionLinks.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={mobileLinkClass}
                  onClick={closeMobileMenu}
                >
                  {item.label}
                </NavLink>
              ))}
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}
