import { Link } from 'react-router-dom'
import { RssIcon } from '@heroicons/react/24/outline'
import Logo from '@/components/ui/Logo'

const footerLinks = [
  { to: '/catalogo', label: 'Libros' },
  { to: '/videojuegos', label: 'Videojuegos' },
  { to: '/merchandising', label: 'Merchandising' },
  { to: '/novelas', label: 'Novelas' },
  { to: '/guias', label: 'Guías' },
  { to: '/aviso-legal', label: 'Aviso legal y privacidad' },
]

export default function Footer() {
  return (
    <footer className="mt-auto border-t border-line bg-surface">
      <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-10 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <Link to="/" className="flex items-center gap-2.5 font-semibold tracking-tight">
            <Logo className="size-7" />
            Catálogo D&amp;D
          </Link>
          <nav aria-label="Pie de página">
            <ul className="flex flex-wrap gap-x-5 gap-y-1 text-sm">
              {footerLinks.map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="inline-flex min-h-11 items-center text-muted transition-colors duration-150 hover:text-fg sm:min-h-0"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
              <li>
                <a
                  href="/feed.xml"
                  className="inline-flex min-h-11 items-center gap-1.5 text-muted transition-colors duration-150 hover:text-fg sm:min-h-0"
                >
                  <RssIcon className="size-4" aria-hidden="true" />
                  Novedades (RSS)
                </a>
              </li>
              <li>
                <a
                  href="https://github.com/logoff/catalogo-dnd"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex min-h-11 items-center text-muted transition-colors duration-150 hover:text-fg sm:min-h-0"
                >
                  GitHub
                </a>
              </li>
            </ul>
          </nav>
        </div>

        <div className="flex max-w-3xl flex-col gap-2 text-xs leading-relaxed text-muted">
          <p>
            Sitio no oficial, sin relación con Wizards of the Coast ni respaldado por ella. Dungeons
            &amp; Dragons y D&amp;D son marcas registradas de Wizards of the Coast LLC.
          </p>
          <p>
            Algunos enlaces de compra son de afiliado: si compras a través de ellos, el catálogo
            puede recibir una comisión sin coste para ti. Como Afiliado de Amazon, obtengo ingresos
            por las compras adscritas que cumplen los requisitos aplicables.
          </p>
          <p>Copyright © {new Date().getFullYear()} logoff</p>
        </div>
      </div>
    </footer>
  )
}
