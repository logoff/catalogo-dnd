# Design

## Context

Ver `proposal.md` para la motivación y las specs `merchandise-records`,
`merchandise-listing` y `merchandise-detail-page` para los requisitos.

La sección de videojuegos (`add-videojuegos`) resolvió ya casi todo lo
que hace falta y es el modelo que se sigue:

- Un JSON por elemento importado con `import.meta.glob`, un esquema en
  `data/schemas/`, un loader que añade campos derivados y tests de datos
  que validan esquema, descripción, imágenes, enlaces e inventario.
- Store de Zustand sin persistencia, para que el primer render coincida
  con el HTML prerenderizado.
- Listado con panel de filtros y tarjetas, ficha con `Section`,
  `ImageLightbox` para las imágenes y `PurchaseButton` con
  `getPurchaseUrl` de `src/utils/stores.ts` para los afiliados.
- `generate-sitemap.mjs` añade las URLs y `prerender.mjs` genera el HTML
  y la vista previa de 1200×630 de la primera imagen.
- Las tiendas que ya tienen afiliado (Amazon, Juegos de la Mesa Redonda,
  Generación X cuando la acepten) cubren libros, juguetes y juegos de
  mesa.
- El buscador de la cabecera (`SearchBar`) solo usa el store de libros.

## Goals / Non-Goals

**Goals:**

- Reutilizar componentes y utilidades existentes antes que crear nuevos.
- Un modelo de datos único para los tres grupos, con lo que cambia entre
  ellos limitado al tipo.
- Mismas garantías de datos que en videojuegos: todo lo que se publica
  está en el inventario y tiene fuente.

**Non-Goals:**

- Precios o stock en tiempo real.
- Integrar los artículos en el buscador de la cabecera o en el catálogo
  de libros.
- Variantes de un mismo artículo (colores, ediciones limitadas) como
  fichas separadas: van en la descripción.

## Decisions

### Nombre y rutas

Sección «Merchandising», en `/merchandising` y
`/merchandising/<slug>`. Es el término que se usa en España para este
tipo de productos y cubre libros, juguetes y juegos sin forzar ninguno.
Alternativas descartadas: «Coleccionables» (un libro de cocina no lo
es) y «Productos licenciados» (preciso pero poco natural en un menú).

### Datos: un JSON por artículo

```json
{
  "slug": "heroes-feast",
  "title": "Heroes' Feast: The Official D&D Cookbook",
  "title_es": "Festín de héroes",
  "group": "books",
  "kind": "cookbook",
  "manufacturer": "Ten Speed Press",
  "date": "2020-10-20",
  "description": "Qué es…\n\nPara quién…",
  "source": "https://…",
  "editions": [
    {
      "language": "english",
      "title": "Heroes' Feast",
      "isbn13": 9781984858900,
      "purchase_links": [{ "store": "amazon", "url": "https://www.amazon.es/dp/…" }]
    }
  ],
  "images": ["/images/merchandising/heroes-feast/0.jpg"],
  "related_products": [{ "edition": "5e", "code": "PHB" }],
  "related_videogames": ["baldurs-gate-3"]
}
```

(Los valores del ejemplo son ilustrativos; cada dato real se comprueba
al dar de alta el artículo.)

- Archivos en `data/merchandising/items/<grupo>/<slug>.json`, con el
  nombre igual al slug, como en videojuegos.
- `group`: `books`, `figures` o `games`.
- `kind`, lista cerrada por grupo:
  - `books`: `cookbook`, `craft_book`, `art_book`, `guide_book`.
  - `figures`: `funko`, `lego`, `figure`, `plush`, `collectible_miniature`.
  - `games`: `board_game`, `card_game`.
    El esquema valida la pareja grupo y tipo con `if`/`then`.
- `editions`: `language` opcional (`english` o `castellano`), porque una
  figura no tiene idioma; `title`, `publisher` y `date` solo si cambian
  respecto al artículo; `isbn13` o `ean` cuando existan;
  `purchase_links` con el mismo formato que los libros.
- `source`: página oficial del fabricante o de Wizards que confirma la
  licencia (obligatorio).
- `related_products` con el mismo formato que en videojuegos y
  `related_videogames` con slugs.

Alternativas descartadas: reutilizar el esquema de productos (exige
edición de reglas y códigos de WotC) o el de videojuegos (todo gira en
torno a plataformas y lanzamientos).

### Campos derivados

`merchandiseLoader.ts` añade a cada artículo `year`, `hasSpanish` (alguna
edición en castellano) y `availableToBuy` (alguna edición con enlace),
y los ordena por fecha descendente con los que no tienen fecha al final.

### Listado y filtros

- `MerchandisePage` con el mismo esqueleto que `VideogamesPage`: barra
  de búsqueda, panel de filtros (grupo, tipo, castellano, a la venta),
  selector de orden y rejilla de `MerchandiseCard`.
- Búsqueda sin tildes reutilizando la normalización que ya usa el
  listado de videojuegos.
- El filtro de tipo solo muestra los tipos de los grupos elegidos.
- `merchandiseStore.ts` sin persistencia.

### Ficha

`MerchandiseDetail` con la cabecera de imágenes y datos de
`VideogameDetail`, una sección «Dónde comprar» con una fila por edición
(idioma, título y `PurchaseButton` por enlace) y una sección
«Relacionado» con enlaces a libros y videojuegos. Los botones llevan los
datos de Umami de los demás botones de compra, con
`data-umami-event-section="merchandising"`.

### Navegación y textos

- Enlace «Merchandising» en la cabecera (escritorio y menú móvil), tras
  «Videojuegos».
- Bloque en la portada con los artículos más recientes, como el de
  videojuegos.
- Página legal: los nombres e imágenes de los productos son de sus
  fabricantes y de Wizards of the Coast y se muestran para identificarlos.

### Inventario y skill

- `data/merchandising/inventory.md`: tabla con grupo, título, fabricante,
  año, si hay edición en castellano, fuente y ficha (slug o
  «pendiente»), igual que el de videojuegos. Un test exige que cada
  ficha esté en el inventario y al revés.
- Fuentes para el inventario: la página de productos con licencia de
  Wizards, las webs de los fabricantes (Funko, LEGO, WizKids, Ten Speed
  Press, Hasbro), D&D Beyond y Amazon.es, cruzadas con noticias.
- Skill `add-merchandise` con las reglas de datos, las fuentes y los
  pasos (inventario, datos, imágenes en
  `public/images/merchandising/<slug>/`, JSON, descripción, `just check`).

### Carga inicial

Un lote por grupo, empezando por libros (pocos y con ISBN, fáciles de
verificar), después juegos de mesa y al final figuras y juguetes, que
son los más numerosos y los que más cambian.

## Risks / Trade-offs

- [El inventario de figuras puede ser enorme (cada ola de Funko o de
  miniaturas)] → Una ficha por línea o set reconocible, no por cada
  variante; el inventario se revisa con el usuario antes de cargarlo.
- [Productos que se agotan pronto] → `availableToBuy` y el aviso de la
  ficha; la skill `novedades` puede revisar enlaces más adelante.
- [Confundir productos oficiales con imitaciones en Amazon] → Solo
  enlaces a fichas cuyo vendedor y licencia se comprueban, y `source`
  obligatorio.
- [Peso de las imágenes] → Una o dos imágenes por artículo, como en
  libros y videojuegos.

## Migration Plan

Todo es nuevo: la sección puede publicarse en cuanto haya un primer lote
de artículos. Para deshacer basta con quitar la ruta y el enlace de la
cabecera.

## Open Questions

- Si conviene un filtro por mundo de campaña (Reinos Olvidados,
  Dragonlance…) cuando haya suficientes artículos. Se puede añadir
  después sin cambiar el modelo, con un campo opcional `setting` como en
  videojuegos.
