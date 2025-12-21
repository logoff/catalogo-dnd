import { Link, NavLink } from 'react-router-dom'
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline'
import { useState } from 'react'
import SearchBar from '../filters/SearchBar'
import { getAssetPath } from '@/utils/constants'

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    `px-3 py-2 rounded-md text-sm font-medium transition-colors ${
      isActive ? 'bg-dnd-red text-white' : 'text-gray-300 hover:bg-dnd-stone-light hover:text-white'
    }`

  return (
    <header className="sticky top-0 z-50 bg-dnd-stone-dark border-b border-dnd-gold/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3">
            <img
              src={getAssetPath('images/dungeons-and-dragons.png')}
              alt="D&D Logo"
              className="h-10 w-auto"
            />
            <span className="font-display text-xl text-dnd-gold hidden sm:block">Catálogo D&D</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            <NavLink to="/" end className={navLinkClass}>
              Inicio
            </NavLink>
            <NavLink to="/catalogo" className={navLinkClass}>
              Catálogo
            </NavLink>
            <NavLink to="/2014" className={navLinkClass}>
              5E (2014)
            </NavLink>
            <NavLink to="/2024" className={navLinkClass}>
              5E (2024)
            </NavLink>
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
              <NavLink to="/" end className={navLinkClass} onClick={() => setMobileMenuOpen(false)}>
                Inicio
              </NavLink>
              <NavLink
                to="/catalogo"
                className={navLinkClass}
                onClick={() => setMobileMenuOpen(false)}
              >
                Catálogo
              </NavLink>
              <NavLink to="/2014" className={navLinkClass} onClick={() => setMobileMenuOpen(false)}>
                5E (2014)
              </NavLink>
              <NavLink to="/2024" className={navLinkClass} onClick={() => setMobileMenuOpen(false)}>
                5E (2024)
              </NavLink>
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}
