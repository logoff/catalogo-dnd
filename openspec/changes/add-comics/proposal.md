# Proposal

## Why

Desde 1987 se han publicado unas 56 series de cómics oficiales de D&D en
inglés (TSR y DC, Kenzer, Devil's Due, IDW, HarperCollins y, desde 2025, Dark
Horse) con unos 340 números, recopilados en decenas de tomos, y una parte se
tradujo al castellano (Planeta DeAgostini, Zinco, Norma…). No hay ningún
sitio en castellano que diga qué existe, qué se tradujo, en qué tomos está
cada número y dónde comprarlo. Muchos tomos siguen a la venta en Amazon y en
librerías, así que la sección suma visitas e ingresos por afiliados, y
completa lo que dejó fuera la de novelas («cómics y novelas gráficas»).

## What Changes

- Sección nueva «Cómics» con **todos** los cómics oficiales de D&D
  publicados en inglés y **todo** lo publicado en castellano, partiendo de la
  [lista de cómics de D&D de Wikipedia](https://en.wikipedia.org/wiki/List_of_Dungeons_%26_Dragons_comic_books)
  y de catálogos en castellano (Tebeosfera, Norma, Planeta):
  - Entran series regulares y limitadas, números únicos y especiales,
    novelas gráficas originales, cruces con otras marcas (_Rick y Morty_,
    _Stranger Things_), cómics infantiles y juveniles (_Dungeon Club_),
    cómics promocionales con número propio (Free Comic Book Day, _TSR Limited
    Edition_, el de _Baldur's Gate_) y webcómics oficiales.
  - También entran series publicadas solo en castellano, como _Dragones y
    Mazmorras_ (Planeta DeAgostini, 1985-1986).
  - Quedan fuera las tiras publicadas solo dentro de revistas (_Dragon_), los
    cómics de fans, los anuncios en cómic de los años ochenta y los libros de
    arte (_Arte y arcanos_), que no son cómics.
- Una ficha por **serie** (o por novela gráfica u obra única), con su
  editorial, mundo de campaña, fechas, guionistas y dibujantes, descripción
  propia, portada y:
  - la lista de sus **números**, cada uno con su fecha, autores si cambian y
    su portada (la principal; las variantes no);
  - todas sus **ediciones recopiladas**, en inglés y en castellano con la
    misma profundidad (tomos, integrales, ediciones de tapa dura, reediciones
    con ISBN propio), cada una con editorial, fecha, formato, ISBN, portada,
    qué números recoge y enlaces de compra con afiliado cuando sigue a la
    venta;
  - las ediciones en castellano en grapa, número a número, cuando las hubo
    (Zinco, Planeta), con su portada si se encuentra.
- Listado en `/comics` con búsqueda (título en inglés o en castellano,
  autores), filtros por editorial, mundo, época, castellano y a la venta, y
  orden por fecha o título. Ficha en `/comic/<slug>`. Las dos se prerenderizan
  y entran en el sitemap.
- Enlaces entre cómics y novelas (las adaptaciones de _La leyenda de Drizzt_ o
  las _Crónicas de la Dragonlance_), videojuegos (_Mindbreaker_ y _Baldur's
  Gate 3_), libros de reglas (_Ravenloft_) y merchandising.
- Las ediciones de cómics cuentan en `/novedades`, en el feed y en el resumen
  mensual, como las de las demás secciones.
- Inventario maestro de cómics con su fuente, script para descargar portadas
  y skill `add-comic` para darlos de alta por lotes.
- Enlace en el menú «Más de D&D» de la cabecera, tarjeta en la portada y
  mención en la página legal.

Fuera de alcance: precios, valoración de números sueltos para coleccionistas,
portadas variantes, cómics de otros juegos de TSR o Wizards que no son de D&D
(_Magic_), de _Critical Role_ u otras marcas sin licencia de D&D, y el
buscador de la cabecera, que sigue buscando solo libros de reglas.

## Capabilities

### New Capabilities

- `comic-records`: qué cómics entran en la sección y qué datos verificables se
  guardan de cada serie, de sus números y de sus ediciones recopiladas en
  inglés y en castellano, con sus portadas y enlaces de compra.
- `comic-listing`: el listado de la sección, con búsqueda, filtros y orden,
  su lugar en la navegación y su presencia en novedades y resumen mensual.
- `comic-detail-page`: la ficha pública de cada serie, con sus números, sus
  ediciones recopiladas, la compra y el contenido relacionado.

### Modified Capabilities

- `home-page`: la portada enlaza también a la sección de cómics con su
  recuento.
- `affiliate-links`: los cómics enlazan a Amazon y a Casa del Libro, como
  las novelas.

## Impact

- **Datos:** carpeta nueva `data/comics/` con un JSON por serie, esquema
  `data/schemas/comic.jsonschema`, inventario `data/comics/inventory.md` y
  portadas en `public/images/comics/` en WebP con miniatura (unas 400 de
  números más las de los tomos).
- **Código:** tipos, loader, páginas y componentes nuevos, con los datos en
  un trozo aparte del bundle como las novelas (`virtual:comics-index`);
  `AppRoutes.tsx`, `Header.tsx`, `HomePage.tsx`, `LegalPage.tsx`,
  `entry-server.tsx` y `main.tsx`. Se reutilizan `stores.ts`,
  `PurchaseButton`, `ImageLightbox`, `SpanishMark` y los componentes de
  `ui/`.
- **Build:** `vite.config.ts` (índice virtual), `generate-sitemap.mjs`,
  `prerender.mjs`, `releases.mjs` y `monthly-summary.mjs`.
- **Afiliados:** Amazon y Casa del Libro; Generación X (librería de cómics)
  se añadirá cuando acepten la solicitud, que sigue pendiente.
- **Herramientas:** skill nueva `add-comic`, receta `just comic-covers`,
  `just affiliate-coverage`, `CLAUDE.md` y README.
