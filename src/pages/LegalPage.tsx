import MetaTags from '@/components/seo/MetaTags'
import Breadcrumbs from '@/components/common/Breadcrumbs'
import Prose from '@/components/common/Prose'
import { CONTACT_EMAIL, OWNER_NAME, SITE_URL } from '@/utils/constants'

export default function LegalPage() {
  return (
    <>
      <MetaTags
        title="Aviso legal y privacidad"
        description="Titular del sitio, enlaces de afiliado, propiedad intelectual y privacidad del Catálogo D&D."
      />

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Breadcrumbs items={[{ label: 'Aviso legal y privacidad' }]} />
        <h1 className="font-display text-3xl md:text-4xl text-dnd-gold mb-2">
          Aviso legal y privacidad
        </h1>
        <p className="text-gray-400 mb-8">Última actualización: 22 de octubre de 2026</p>

        <Prose>
          <h2>Titular del sitio</h2>
          <p>
            Este sitio web, <a href={SITE_URL}>catalogodnd.es</a>, es un proyecto personal de{' '}
            <strong>{OWNER_NAME}</strong>. Para cualquier consulta puedes escribir a{' '}
            <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>.
          </p>
          <p>
            El código fuente es público y está disponible en{' '}
            <a
              href="https://github.com/logoff/catalogo-dnd"
              target="_blank"
              rel="noopener noreferrer"
            >
              GitHub
            </a>
            .
          </p>

          <h2>Qué es este sitio</h2>
          <p>
            Un catálogo informativo de los libros, cajas y accesorios de la quinta edición de
            Dungeons & Dragons publicados en inglés y en castellano. Es un sitio{' '}
            <strong>no oficial</strong>, sin relación con Wizards of the Coast ni respaldado por
            ella. No vende ningún producto: los enlaces de compra llevan a tiendas externas.
          </p>

          <h2>Enlaces de afiliado</h2>
          <p>
            Algunos enlaces de la sección «Dónde comprar» son <strong>enlaces de afiliado</strong>.
            Si compras a través de ellos, la tienda puede pagar una pequeña comisión al titular de
            este sitio, <strong>sin ningún coste adicional para ti</strong>. Esas comisiones ayudan
            a mantener el catálogo.
          </p>
          <p>
            Como Afiliado de Amazon, obtengo ingresos por las compras adscritas que cumplen los
            requisitos aplicables.
          </p>
          <p>
            La participación en programas de afiliados no influye en el contenido: las descripciones
            y guías no son publicidad pagada, y ninguna tienda ni editorial revisa ni aprueba lo que
            se publica aquí.
          </p>

          <h2>Propiedad intelectual</h2>
          <p>
            Dungeons & Dragons, D&D, sus logotipos y los nombres de sus productos, mundos y
            personajes son marcas de Wizards of the Coast LLC. Las imágenes de las portadas
            pertenecen a sus respectivos titulares y se muestran únicamente para identificar cada
            producto.
          </p>
          <p>
            Los textos propios del catálogo (descripciones y guías) y el código del sitio son de su
            titular. Si eres titular de algún derecho y consideras que algún contenido no debería
            estar aquí, escribe a <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a> y se
            retirará.
          </p>

          <h2>Privacidad</h2>
          <p>
            Este sitio <strong>no pide ni guarda datos personales</strong>: no hay registro, ni
            formularios, ni comentarios.
          </p>
          <p>
            Las visitas se cuentan de forma anónima y agregada, sin cookies y sin seguir tu
            actividad en otros sitios. Al pulsar un enlace de compra pasas a la web de la tienda,
            que aplica su propia política de privacidad. Si escribes al correo de contacto, tu
            mensaje solo se usará para responderte.
          </p>

          <h2>Cookies</h2>
          <p>
            Este sitio <strong>no usa cookies</strong>. Solo guarda en tu navegador, mediante
            almacenamiento local, tus preferencias de visualización (por ejemplo, la vista en
            cuadrícula o en lista), que nunca salen de tu dispositivo.
          </p>
        </Prose>
      </div>
    </>
  )
}
