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
        <h1 className="mb-2 text-3xl font-semibold tracking-tight sm:text-4xl">
          Aviso legal y privacidad
        </h1>
        <p className="text-muted mb-8">Última actualización: 22 de octubre de 2026</p>

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
            Dungeons & Dragons publicados en inglés y en castellano, y de los videojuegos oficiales
            de D&D. Es un sitio <strong>no oficial</strong>, sin relación con Wizards of the Coast
            ni respaldado por ella. No vende ningún producto: los enlaces de compra llevan a tiendas
            externas.
          </p>
          <p>
            La sección «Otros juegos de rol» reúne juegos y libros de otras editoriales de la
            familia de D&D (Pathfinder, Tales of the Valiant, Daggerheart, suplementos de terceros
            para 5E…). <strong>No es contenido oficial de Dungeons & Dragons</strong> ni de Wizards
            of the Coast, y las explicaciones de las licencias abiertas son informativas, no
            asesoramiento jurídico.
          </p>

          <h2>Enlaces de afiliado</h2>
          <p>
            Algunos enlaces de la sección «Dónde comprar» de libros y videojuegos son{' '}
            <strong>enlaces de afiliado</strong>. Si compras a través de ellos, la tienda puede
            pagar una pequeña comisión al titular de este sitio,{' '}
            <strong>sin ningún coste adicional para ti</strong>. Esas comisiones ayudan a mantener
            el catálogo.
          </p>
          <p>
            Como Afiliado de Amazon, obtengo ingresos por las compras adscritas que cumplen los
            requisitos aplicables.
          </p>
          <p>
            En la sección «Otros juegos de rol» se enlaza también a NoSoloRol, con su programa de
            afiliados.
          </p>
          <p>
            Las fichas de videojuegos enlazan también a tiendas sin programa de afiliados, como
            Steam, porque son útiles para elegir dónde comprar; esos enlaces no generan ninguna
            comisión.
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
            Los nombres, logotipos, portadas y capturas de los videojuegos son de sus
            desarrolladoras y editoras. Las capturas proceden de sus canales oficiales (tiendas,
            webs y kits de prensa) y, como el resto, se muestran solo para dar a conocer cada juego.
            Las notas de cada ficha son de los medios que se citan, con enlace a la fuente; aquí
            solo se recoge la cifra.
          </p>
          <p>
            Los nombres e imágenes de los productos de merchandising (libros, figuras, juguetes y
            juegos de mesa) son de sus fabricantes y de Wizards of the Coast, que los publican con
            licencia oficial de Dungeons & Dragons; se muestran solo para identificarlos.
          </p>
          <p>
            Los títulos y las portadas de las novelas y antologías son de sus editoriales y de
            Wizards of the Coast; se muestran solo para identificar cada obra y cada edición.
          </p>
          <p>
            Los títulos y las portadas de los cómics y de sus tomos son de sus editoriales (TSR, DC
            Comics, Devil's Due, IDW, Dark Horse, Norma y las demás) y de Wizards of the Coast; se
            muestran solo para identificar cada serie y cada edición.
          </p>
          <p>
            Los nombres, logotipos y portadas de los juegos y libros de la sección «Otros juegos de
            rol» son de sus editoriales (Paizo, Kobold Press, Darrington Press y las demás que se
            citan en cada ficha), sin relación con este sitio ni su respaldo; se muestran solo para
            identificar cada obra.
          </p>
          <p>
            Los logotipos de consolas, ordenadores y sistemas (PlayStation, Xbox, Nintendo, Sega,
            Windows, macOS y otros) son marcas de sus respectivos propietarios. Se usan solo para
            indicar en qué plataformas está disponible cada juego, sin que eso suponga ninguna
            relación con esas empresas ni su respaldo, como uso referencial de la marca (artículo 14
            del Reglamento (UE) 2017/1001). Las imágenes proceden de{' '}
            <a href="https://commons.wikimedia.org/">Wikimedia Commons</a>, donde figuran en dominio
            público o con licencia CC0. Cuando una plataforma no tiene logotipo disponible se
            muestra un dibujo propio del tipo de aparato.
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
          <p>
            Las fichas de videojuegos pueden incluir vídeos oficiales de YouTube. El sitio no carga
            nada de YouTube por su cuenta: solo ves una imagen guardada aquí. Al pulsar reproducir,
            tu navegador se conecta con YouTube en su modo de privacidad mejorada, y se aplica la
            política de privacidad de Google.
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
