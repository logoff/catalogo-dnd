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
import { headingClass } from '@/components/ui/styles'

interface NavItem {
  to: string
  label: string
  // Línea breve bajo el enlace en el desplegable, para descubrir lo que hay en cada sección
  description?: string
}

interface NavGroup {
  label: string
  items: NavItem[]
  // Rutas que, sin estar en el menú, pertenecen al grupo (fichas de producto)
  extraPaths?: string[]
}

// Lo oficial de D&D primero (libros y lo demás), luego los otros juegos de rol y las guías
const navGroups: NavGroup[] = [
  {
    label: 'Libros',
    items: [
      {
        to: '/catalogo',
        label: 'Catálogo completo',
        description: 'Libros y accesorios de 5E y 5.5E',
      },
      { to: '/2014', label: '5E (2014)' },
      { to: '/2024', label: '5.5E (2024)' },
      { to: '/ediciones', label: 'Todas las ediciones', description: 'De D&D original a la 5.5E' },
    ],
    extraPaths: ['/producto'],
  },
  {
    label: 'Más de D&D',
    items: [
      {
        to: '/novelas',
        label: 'Novelas',
        description: 'Todas las oficiales, con su edición en castellano',
      },
      { to: '/videojuegos', label: 'Videojuegos', description: 'De los años 70 a hoy' },
      {
        to: '/merchandising',
        label: 'Merchandising',
        description: 'Figuras, juegos de mesa y libros con licencia',
      },
    ],
    extraPaths: ['/novela', '/videojuego'],
  },
  {
    label: 'Otros juegos de rol',
    items: [
      {
        to: '/rol',
        label: 'Juegos y libros',
        description: 'Pathfinder, Daggerheart, libros de terceros…',
      },
      { to: '/rol/arbol', label: 'Árbol genealógico', description: 'Cómo se relacionan con D&D' },
      { to: '/licencias', label: 'Licencias abiertas', description: 'OGL, SRD, ORC y demás' },
    ],
    extraPaths: ['/licencia'],
  },
]

const guidesLink: NavItem = { to: '/guias', label: 'Guías' }

// Evento de Umami de cada enlace del menú, para medir qué secciones se visitan desde la cabecera
const trackMenu = (label: string) => ({
  'data-umami-event': 'menu',
  'data-umami-event-seccion': label,
})

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
        <div className="absolute left-0 mt-1 w-72 rounded-xl border border-line bg-surface p-1 shadow-lg shadow-black/10">
          {group.items.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end
              className={({ isActive }) =>
                clsx(
                  'flex min-h-10 flex-col justify-center rounded-lg px-3 py-1.5 text-sm transition-colors duration-150',
                  isActive ? 'bg-well font-medium text-fg' : 'text-fg hover:bg-well'
                )
              }
              onClick={() => setOpen(false)}
              {...trackMenu(item.label)}
            >
              {item.label}
              {item.description && (
                <span className="text-xs font-normal text-muted">{item.description}</span>
              )}
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
            {navGroups.map((group) => (
              <NavDropdown key={group.label} group={group} />
            ))}
            <NavLink to={guidesLink.to} className={navLinkClass} {...trackMenu(guidesLink.label)}>
              {guidesLink.label}
            </NavLink>
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
              {navGroups.map((group, i) => (
                <div key={group.label} className={clsx('flex flex-col gap-1', i > 0 && 'mt-2')}>
                  <span className={headingClass('group', 'px-3 pt-1 pb-1')}>{group.label}</span>
                  {group.items.map((item) => (
                    <NavLink
                      key={item.to}
                      to={item.to}
                      end
                      className={mobileLinkClass}
                      onClick={closeMobileMenu}
                      {...trackMenu(item.label)}
                    >
                      {item.label}
                    </NavLink>
                  ))}
                </div>
              ))}
              <span className="mt-2 border-t border-line" aria-hidden="true" />
              <NavLink
                to={guidesLink.to}
                className={mobileLinkClass}
                onClick={closeMobileMenu}
                {...trackMenu(guidesLink.label)}
              >
                {guidesLink.label}
              </NavLink>
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}
