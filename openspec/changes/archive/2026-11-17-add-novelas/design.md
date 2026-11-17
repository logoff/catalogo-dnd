# Design

## Context

Ver `proposal.md` para la motivación y las specs `novel-records`,
`novel-listing` y `novel-detail-page` para los requisitos.

Merchandising y videojuegos ya resolvieron el patrón que se sigue: un JSON
por elemento con esquema en `data/schemas/`, un loader con campos
derivados, tests de datos (esquema, inventario, imágenes, URLs sin
afiliado, relaciones), store de Zustand sin persistencia, listado con
panel de filtros, ficha con `ImageLightbox` y `PurchaseButton`, y
`generate-sitemap.mjs` y `prerender.mjs` para las páginas.

Lo que cambia aquí es la escala. Hoy todos los datos (219 JSON, 1,2 MB)
se importan con `import.meta.glob` _eager_ y van en el bundle principal
(`index-*.js`, 371 kB). La lista de Wikipedia tiene unas 700 novelas que
entran en el alcance (338 de Reinos Olvidados, 200 de Dragonlance, 40 de
Eberron, el resto repartido en una decena de mundos), cada una con varias
ediciones y una descripción: meterlas igual duplicaría o triplicaría el
JS de todas las páginas del sitio.

## Goals / Non-Goals

**Goals:**

- Que la sección no añada peso a las páginas que no son de novelas.
- Mismas garantías de datos que en las otras secciones, más ISBN válidos
  y series coherentes.
- Que dar de alta cientos de fichas sea repetible: inventario generado,
  script de portadas y skill.

**Non-Goals:**

- Precios, stock o comparador de ediciones de segunda mano.
- Relatos, antologías y el resto de formatos excluidos: el modelo no se
  fuerza para que quepan.
- Páginas propias por serie o por autor (ver Open Questions).

## Decisions

### Rutas y nombre

`/novelas` para el listado y `/novela/<slug>` para la ficha, como
`/videojuegos` y `/videojuego/<slug>`. El slug sale del título original
(`dragons-of-autumn-twilight`); si dos novelas coinciden, se añade el
mundo o el año.

### Datos: un JSON por novela y un archivo de series

```json
{
  "slug": "dragons-of-autumn-twilight",
  "title": "Dragons of Autumn Twilight",
  "authors": ["Margaret Weis", "Tracy Hickman"],
  "setting": "dragonlance",
  "kind": "novel",
  "series": { "id": "dragonlance-chronicles", "number": 1 },
  "date": "1984-11",
  "description": "De qué trata…\n\nDónde encaja…",
  "source": "https://…",
  "editions": [
    {
      "language": "english",
      "country": "us",
      "publisher": "TSR",
      "date": "1984-11",
      "format": "paperback",
      "isbn13": 9780880381734,
      "cover": "/images/novels/dragons-of-autumn-twilight/9780880381734.webp",
      "purchase_links": []
    },
    {
      "language": "castellano",
      "spain": true,
      "title": "El retorno de los dragones",
      "publisher": "Timun Mas",
      "date": "1987",
      "format": "paperback",
      "source": "https://…",
      "purchase_links": [{ "store": "amazon", "url": "https://www.amazon.es/dp/…" }]
    }
  ],
  "related_products": [],
  "related_videogames": [],
  "related_merchandise": []
}
```

(Valores ilustrativos: cada dato se comprueba al dar de alta la novela.)

- Archivos en `data/novels/<mundo>/<slug>.json`.
- `setting`, lista cerrada: `dragonlance`, `forgotten_realms`, `eberron`,
  `greyhawk`, `ravenloft`, `mystara`, `dark_sun`, `spelljammer`,
  `planescape`, `birthright`, `nerath` (_Points of Light_) y `generic`
  (D&D sin mundo concreto). Se amplía si el inventario lo pide.
- `kind`: `novel`, `young_adult`, `middle_grade`, `novella`,
  `short_story` (relato vendido suelto, como los ebooks de Salvatore) y
  `fiction_guide` (las _Bertrem's Guide_ de Dragonlance); `ebook` no es un
  tipo sino un formato de edición.
- `format` de cada edición: `hardcover`, `paperback`, `mass_market`,
  `ebook` y `web` (novelas publicadas solo en la web de Wizards o de su
  autor: sin ISBN ni enlaces de compra, con `url` a la copia del Internet
  Archive y portada genérica si no tienen).
- Las ediciones en inglés y en castellano tienen el mismo nivel de
  detalle (decisión del usuario): todas las que tienen ISBN propio, con
  `country` (`us`, `uk`…) en las inglesas como `spain` en las
  castellanas. Las reimpresiones con el mismo ISBN y los audiolibros no
  constan.
- En la ficha, cada idioma lista sus ediciones de la más reciente a la
  más antigua; la de compra recomendada es la más reciente a la venta.
- `source` en la novela (que es oficial) y opcional en cada edición
  cuando la confirma otra fuente, que es lo normal en las de castellano.
- `title` en la edición solo si cambia; el título en castellano que se
  muestra es el de la edición en castellano más reciente.
- `cover` opcional por edición; el test exige que al menos una edición
  tenga portada.
- ISBN siempre en ISBN-13: los ISBN-10 de las ediciones antiguas se
  convierten (prefijo 978 y nuevo dígito de control) con una utilidad
  que también usan los tests.

`data/novels/series.json` define las series:

```json
{
  "id": "dragonlance-chronicles",
  "title": "Dragonlance Chronicles",
  "title_es": "Crónicas de la Dragonlance",
  "setting": "dragonlance",
  "collections": [
    {
      "language": "castellano",
      "spain": true,
      "title": "Crónicas de la Dragonlance",
      "publisher": "…",
      "date": "…",
      "isbn13": 0,
      "novels": ["dragons-of-autumn-twilight", "…"],
      "purchase_links": []
    }
  ]
}
```

Los recopilatorios viven en la serie porque son de varias novelas a la
vez: así su ISBN consta una sola vez y la ficha de cada novela los
encuentra por su slug. Un recopilatorio que mezcla series (raro) va en la
serie de su primera novela.

Alternativas descartadas: reutilizar el esquema de merchandising (no
tiene series, autores ni recopilatorios, y su `group`/`kind` no encaja) o
una ficha por serie (decisión del usuario: ficha por novela).

### Campos derivados

`novelLoader.ts` añade `year`, `titleEs` (título de la edición en
castellano más reciente), `spanish` (`spain`, `elsewhere` o `none`,
contando ediciones y recopilatorios), `availableToBuy` (alguna edición o
recopilatorio con enlace) y `searchText` normalizado sin tildes (títulos
en inglés y en castellano y autores).

### Peso: índice ligero y fichas en trozos aparte

- Un plugin de Vite expone un módulo virtual `virtual:novels-index` que
  lee los JSON en el build y emite solo lo que necesita el listado y la
  lista de la serie: slug, títulos, autores, mundo, tipo, serie y número,
  fecha, miniatura de portada, `spanish` y `availableToBuy` (unos
  200 B por novela). Las series van completas, sin recopilatorios.
- La ficha carga su JSON con `import.meta.glob` **no** _eager_: cada
  novela es un trozo de unos pocos kB. `series.json`, con los
  recopilatorios, es otro trozo que solo carga la ficha.
- Lo que va aparte son los **datos**; las páginas, que son código
  pequeño, van en el bundle principal. Leen los datos de una caché
  síncrona (`novelLoader.ts`) mediante `useNovelIndex` y `useNovel`.
- Hidratación: `main.tsx` precarga, antes de `hydrateRoot`, los datos
  de la ruta cuando es `/novelas` o `/novela/<slug>`, así que el primer
  render coincide con el HTML prerenderizado. Al llegar navegando desde
  otra página, los hooks cargan los datos y la página muestra «Cargando…»
  mientras tanto. En el servidor (`entry-server.tsx`) se cargan todos de
  forma síncrona antes de pintar.

Alternativas descartadas: importar todo _eager_ como en merchandising
(simple, pero cientos de kB más en cada página del sitio) y cargar las
páginas con `React.lazy` (`renderToString` no espera a los componentes
diferidos, y la hidratación con `Suspense` complicaría el prerenderizado
sin ahorrar casi nada, porque lo que pesa son los datos). Si el trozo del
índice crece mucho, se puede servir como JSON estático sin cambiar las
páginas.

### Listado

- Mismo esqueleto que `MerchandisePage`: búsqueda, panel de filtros
  (mundo, serie, castellano, a la venta), orden y rejilla de
  `NovelCard`.
- El filtro de serie solo ofrece las series de los mundos elegidos.
- Orden de lectura: agrupa por serie (en el orden de la primera novela de
  cada serie) y dentro por número; las novelas sueltas van por fecha.
- Carga progresiva: 48 tarjetas y un botón «Ver más» que añade otras 48;
  portadas con `LazyImage` (`loading="lazy"`). El prerenderizado pinta
  solo la primera tanda, para que el HTML no pese cientos de kB.
- Mundo y serie van en la dirección (`?mundo=dragonlance&serie=…`). Para
  que el primer render coincida con el HTML prerenderizado (sin
  parámetros), los filtros de la dirección se aplican en un efecto tras
  montar, como cualquier cambio de filtro.
- `novelStore.ts` sin persistencia.

### Ficha

`NovelDetail` con la cabecera de portada y datos de `MerchandiseDetail`
y las secciones:

1. «Ediciones en castellano» y «Ediciones en inglés»: una fila por
   edición con su portada en pequeño (ampliable), título, editorial, año,
   formato, ISBN y botones de compra; aviso si no hay en castellano.
2. «Recopilatorios»: los que contienen la novela.
3. «La serie»: lista ordenada con la actual destacada y anterior y
   siguiente; enlace al listado filtrado por la serie.
4. «Relacionado»: libros, videojuegos y merchandising.

Los botones de compra llevan los datos de Umami de los demás, con
`data-umami-event-novela` (el slug) y `data-umami-event-idioma`.

### Portadas

- WebP en `public/images/novels/<slug>/<isbn>.webp` (sin ISBN,
  `<idioma>-<año>-<formato>.webp`, porque puede haber varias ediciones
  del mismo año) (unos 600 px
  de ancho) y `-thumb.webp` (unos 240 px) para tarjetas y filas.
- Script `scripts/download-novel-covers.mjs` (receta `just novel-covers`)
  que recibe el slug y las URLs de origen, convierte con `sharp`, como
  `download-screenshots.mjs`, y anota la ruta en la edición.
- Orígenes: la web de la editorial, Open Library por ISBN y la ficha de
  Amazon para las inglesas (reediciones y ebooks incluidos) y, para las de
  castellano, la editorial, Tercera Fundación o la ficha de Amazon.
- Para encontrar todas las ediciones inglesas de una novela se parte de
  ISFDB, que lista cada edición con su ISBN, y de Open Library; cada
  edición se confirma después con la editorial, el ISBN o Amazon.
- Las fichas usan como `og:image` la portada de la edición en castellano
  más reciente si existe, si no la inglesa; `prerender.mjs` genera su
  vista previa de 1200×630 como en las demás secciones.

### Fuentes

- Lista de partida: Wikipedia (referencia, no fuente). El inventario se
  genera con un script de un solo uso a partir de su wikitexto, filtrando
  por tipo (novelas, juveniles, infantiles, ebook, novelas cortas sueltas)
  y se revisa con el usuario.
- Novela y edición inglesa: páginas de la editorial (Penguin Random House
  para Del Rey, HarperCollins para Harper Voyager), el archivo de
  productos de Wizards en el Internet Archive y, si no queda nada, ISFDB.
- Ediciones en castellano: web de la editorial (Minotauro, Timun Mas en
  el Internet Archive…), la base de datos de libros editados en España de
  la Agencia del ISBN (Ministerio de Cultura) y, como base bibliográfica,
  Tercera Fundación.
- Enlaces de compra: Amazon.es por ISBN (también la ficha Kindle si
  existe) y, si sigue a la venta, la editorial cuando sea tienda conocida.
  No se enlazan ediciones agotadas sin oferta.

### Inventario y skill

- `data/novels/inventory.md`: una tabla por mundo con serie y número,
  título, autores, fecha, tipo, si hay edición en castellano (sí, no o
  sin comprobar) y ficha (slug o «pendiente»). Un test exige que cada
  ficha esté en él y al revés.
- Skill `add-novel` con las reglas de datos, el orden de fuentes, cómo
  buscar ediciones en castellano, las portadas y los pasos (inventario,
  JSON, serie, portadas, descripción, `just check`).

### Navegación y textos

- «Novelas» en la cabecera (escritorio y móvil) junto a «Videojuegos» y
  «Merchandising».
- Bloque en la portada con las novelas más recientes.
- Página legal: portadas y títulos son de sus editoriales y de Wizards y
  se muestran para identificar las obras.

### Orden de carga

Por mundo, de más a menos popular (decisión del usuario): Dragonlance
(Crónicas y Leyendas primero), Reinos Olvidados (Drizzt primero),
Eberron, Ravenloft, Greyhawk y el resto. Lotes de unas 40–60 fichas por
PR, cada uno con su serie completa para que la lista de la serie no quede
coja.

## Risks / Trade-offs

- [Volumen: unas 700 fichas con descripción propia y varias ediciones] →
  Lotes por serie, inventario generado, script de portadas y skill; la
  sección se publica con el primer lote.
- [Ediciones en castellano mal documentadas, sobre todo las de Timun Mas
  de los ochenta y noventa] → Solo constan con fuente; la columna «sin
  comprobar» del inventario deja claro lo que falta, y una novela sin
  edición confirmada se muestra como no traducida.
- [Títulos en castellano distintos según la edición o partidos en dos
  volúmenes] → Cada edición guarda su título; un volumen partido se
  guarda como dos ediciones de la misma novela, con su ISBN cada una.
- [Volumen de ediciones inglesas: las novelas populares (Crónicas,
  Drizzt) tienen diez o más ediciones con ISBN propio] → El criterio de
  «qué cuenta como edición» las acota; ISFDB sirve para inventariarlas y
  el script de portadas descarga por lotes.
- [Peso de las imágenes: unas 3.000 portadas] → WebP con miniatura, carga
  diferida en el listado; se vigila el tamaño de `public/images` y el
  límite de archivos de Cloudflare Pages (20 000).
- [Tiempo de build con 700 páginas más] → El prerenderizado ya recorre el
  sitemap; se mide tras el primer lote grande.
- [Enlaces de Amazon a ediciones antiguas solo de segunda mano] → Se
  enlazan si hay oferta en Amazon.es; la skill `novedades` puede revisar
  enlaces rotos más adelante.
- [Lazy loading y prerenderizado] → La precarga antes de hidratar evita
  el _fallback_; un test de página comprueba que la ficha prerenderizada
  hidrata sin avisos.

## Migration Plan

Todo es nuevo. La sección se publica en cuanto estén la infraestructura
y el primer lote (Dragonlance); los demás lotes llegan en PR sucesivas.
Para deshacer basta con quitar las rutas y el enlace de la cabecera.

## Open Questions

- Si solicitar afiliación en librerías (Casa del Libro por Awin, IberLibro
  para segunda mano). Añadir una tienda solo toca `stores.ts` y los
  enlaces; no cambia el modelo.
- Páginas propias por serie o autor (`/novelas/serie/<id>`) cuando haya
  muchas novelas cargadas: el índice ya trae lo necesario.
- Si más adelante entran antologías y relatos, si van en esta sección con
  otro `kind` o en una aparte.
