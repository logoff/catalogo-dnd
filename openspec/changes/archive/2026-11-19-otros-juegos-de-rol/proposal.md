# Proposal

## Why

El catálogo cubre todo lo oficial de D&D, pero eso da poco movimiento: las
novedades oficiales son pocas al año y una página de novedades o un resumen
mensual (#89, #91) se quedarían cortos. Alrededor de D&D hay juegos grandes
(Pathfinder, Starfinder, Tales of the Valiant, Daggerheart) y mucho rol
publicado en castellano que nadie reúne, y que venden tiendas con las que ya
hay afiliación (NoSoloRol, Juegos de la Mesa Redonda). Además, las licencias
abiertas (OGL, SRD, ORC) explican cómo se relacionan esos juegos con D&D y
son una duda habitual sin una referencia clara en castellano.

## What Changes

- Sección nueva de **otros juegos de rol**, claramente separada del catálogo
  oficial de D&D en rutas, navegación y aspecto, con tres tipos de ficha:
  - **Licencia abierta** (OGL 1.0a, SRD 5.1, SRD 5.2, ORC y otras): qué
    permite, explicación propia, enlaces oficiales y todo lo que agrupa
    (los sistemas que la usan y sus libros).
  - **Sistema**: cada edición de un juego (por ejemplo, Pathfinder 1E y 2E
    son fichas distintas), con texto descriptivo propio y sus características
    principales, editorial, año, licencias abiertas que usa y sus relaciones
    de derivación con otros sistemas, cada una con su tipo (no se da por
    absoluta una derivación difusa).
  - **Libro**: obra con sus ediciones en inglés y en castellano (editorial,
    fecha, ISBN, portada) y enlaces de compra con el aviso de afiliado.
- Alcance de salida, sin ser completistas, limitado a la familia de D&D (lo
  que deriva de D&D o usa sus licencias abiertas, y los grandes juegos de
  fantasía comparables, como Daggerheart):
  - los sistemas grandes, con sus libros principales (básicos y caja de
    inicio) aunque solo estén en inglés;
  - todo lo publicado en castellano de esos sistemas, grande o no;
  - el catálogo impreso principal de las editoriales de 5E destacadas, aunque
    solo esté en inglés, empezando por Kobold Press (que además escribió para
    Wizards las primeras aventuras de 5E).
- D&D aparece como sistema en la sección (licencias, derivaciones), pero su
  ficha enlaza al catálogo oficial sin duplicarlo. Los libros de terceros
  para 5E van en la sección nueva, bajo su sistema.
- Listado con filtros por sistema, licencia e idioma; las páginas se
  prerenderizan y entran en el sitemap.
- Inventario maestro y skill para dar de alta sistemas, licencias y libros.
- Enlace en la cabecera y tarjeta en la portada; NoSoloRol como tienda de la
  sección.

Fuera de alcance: juegos de rol de otras familias (La llamada de Cthulhu,
Vampiro, Aquelarre…), OSR (#95, reutilizará este modelo más adelante), el árbol
genealógico de sistemas (#99), las fichas de ediciones anteriores de D&D
(#100), los libros solo en inglés que no sean principales, el contenido solo
digital de plataformas comunitarias (DMsGuild y similares) y el buscador de la
cabecera.

## Capabilities

### New Capabilities

- `open-licenses`: qué licencias abiertas tienen ficha, qué datos
  verificables se guardan de cada una y qué muestra su ficha.
- `rpg-systems`: qué sistemas entran, sus datos (descripción, características,
  licencias, derivaciones con su tipo) y su ficha.
- `rpg-books`: qué libros entran según el alcance, sus ediciones por idioma y
  su ficha.
- `rpg-listing`: el listado de la sección, con filtros, orden y su lugar en
  la navegación del sitio.

### Modified Capabilities

- `home-page`: la portada enlaza también a la sección nueva con su tarjeta y
  su recuento.
- `affiliate-links`: tiendas que se enlazan en la sección nueva (NoSoloRol,
  Juegos de la Mesa Redonda, Amazon y las que se acepten).

## Impact

- Datos nuevos en `data/` con sus esquemas JSON y sus tests de validación e
  inventario, como en novelas y merchandising.
- Cargador, páginas y rutas nuevas; sitemap y prerenderizado.
- Cabecera, portada y página legal.
- El resumen del proyecto (`CLAUDE.md`, README) deja de ser solo de D&D.
- Base para novedades (#89), resumen mensual (#91), OSR (#95), árbol (#99) y
  ediciones anteriores de D&D (#100).
