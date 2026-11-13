import { Link, NavLink, useLocation } from 'react-router-dom'
import { Bars3Icon, ChevronDownIcon, XMarkIcon } from '@heroicons/react/24/outline'
import { useEffect, useRef, useState } from 'react'
import SearchBar from '../filters/SearchBar'
import { getAssetPath } from '@/utils/constants'

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
// Cuando lleguen las novelas, tendrán su propia entrada aquí.
const roleplayGroup: NavGroup = {
  label: 'Juego de rol',
  items: [
    { to: '/catalogo', label: 'Catálogo completo' },
    { to: '/2014', label: '5E (2014)' },
    { to: '/2024', label: '5.5E (2024)' },
    { to: '/guias', label: 'Guías' },
  ],
  extraPaths: ['/producto'],
}

const sectionLinks: NavItem[] = [
  { to: '/videojuegos', label: 'Videojuegos' },
  { to: '/merchandising', label: 'Merchandising' },
]

function isGroupActive(group: NavGroup, pathname: string) {
  return [...group.items.map((item) => item.to), ...(group.extraPaths ?? [])].some(
    (path) => pathname === path || pathname.startsWith(`${path}/`)
  )
}

const baseLinkClass = 'px-3 py-2 rounded-md text-sm font-medium transition-colors'
const activeClass = 'bg-dnd-red text-white'
const inactiveClass = 'text-gray-300 hover:bg-dnd-stone-light hover:text-white'

const navLinkClass = ({ isActive }: { isActive: boolean }) =>
  `${baseLinkClass} ${isActive ? activeClass : inactiveClass}`

const dropdownLinkClass = ({ isActive }: { isActive: boolean }) =>
  `block px-4 py-2 text-sm transition-colors ${
    isActive ? 'bg-dnd-red text-white' : 'text-gray-300 hover:bg-dnd-stone-light hover:text-white'
  }`

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
        className={`${baseLinkClass} inline-flex items-center gap-1 ${active ? activeClass : inactiveClass}`}
        aria-haspopup="true"
        aria-expanded={open}
        onClick={() => setOpen(!open)}
      >
        {group.label}
        <ChevronDownIcon
          className={`h-4 w-4 transition-transform ${open ? 'rotate-180' : ''}`}
          aria-hidden="true"
        />
      </button>
      {open && (
        <div className="absolute left-0 mt-2 w-48 py-1 rounded-md bg-dnd-stone-dark border border-dnd-gold/20 shadow-lg">
          {group.items.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={dropdownLinkClass}
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
    <header className="sticky top-0 z-50 bg-dnd-stone-dark border-b border-dnd-gold/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3">
            <img src={getAssetPath('images/logo.svg')} alt="" className="h-10 w-auto" />
            <span className="font-display text-xl text-dnd-gold hidden sm:block">Catálogo D&D</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            <NavLink to="/" end className={navLinkClass}>
              Inicio
            </NavLink>
            <NavDropdown group={roleplayGroup} />
            {sectionLinks.map((item) => (
              <NavLink key={item.to} to={item.to} className={navLinkClass}>
                {item.label}
              </NavLink>
            ))}
          </nav>

          {/* Search Bar - Desktop */}
          <div className="hidden md:block w-64">
            <SearchBar />
          </div>

          {/* Mobile menu button */}
          <button
            type="button"
            className="md:hidden p-2 rounded-md text-gray-400 hover:text-white hover:bg-dnd-stone-light"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <XMarkIcon className="h-6 w-6" /> : <Bars3Icon className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-dnd-gold/20">
            <div className="mb-4">
              <SearchBar />
            </div>
            <nav className="flex flex-col gap-2">
              <NavLink to="/" end className={navLinkClass} onClick={closeMobileMenu}>
                Inicio
              </NavLink>
              <div className="flex flex-col gap-1">
                <span className="px-3 pt-2 text-xs font-semibold uppercase tracking-wide text-dnd-gold">
                  {roleplayGroup.label}
                </span>
                {roleplayGroup.items.map((item) => (
                  <NavLink
                    key={item.to}
                    to={item.to}

                    className={(state) => `${navLinkClass(state)} ml-3`}
                    onClick={closeMobileMenu}
                  >
                    {item.label}
                  </NavLink>
                ))}
              </div>
              {sectionLinks.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={navLinkClass}
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
