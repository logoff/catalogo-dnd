# Design

## Context

Ver `proposal.md` para la motivación y las specs `comic-records`,
`comic-listing` y `comic-detail-page` para los requisitos.

Novelas ya resolvió casi todo lo que hace falta: un JSON por ficha con
esquema, un plugin de `vite.config.ts` que genera un índice ligero en un trozo
aparte (`virtual:novels-index`) y un trozo por ficha, una caché síncrona que
llena `entry-server.tsx` para el prerenderizado y que `main.tsx` precarga
antes de hidratar, portadas en WebP con miniatura (`just novel-covers`),
inventario maestro con test de coherencia, ISBN-13 validados y skill de alta
por lotes. Los cómics siguen ese patrón.

Lo propio de los cómics es que la unidad que se lee (el número) no es la que
se compra hoy (el tomo), y que un tomo puede recoger varias series. La lista
de Wikipedia da unas 56 series en inglés y unos 340 números; en castellano hay
al menos _Dragones y Mazmorras_ (Planeta DeAgostini, 1985-1986, 27 números) y
tomos de Norma (_Los mundos de Dungeons & Dragons_, _Stranger Things y
Dungeons & Dragons_). El inventario en castellano se completa en la primera
tarea.

## Goals / Non-Goals

**Goals:**

- Que cada serie diga qué números tiene, en qué tomos están y cuáles se
  pueden comprar hoy, en inglés y en castellano.
- Portadas buenas: la de cada número y la de cada tomo, en local y en WebP.
- Enlaces de afiliado en todos los tomos a la venta, con la misma vigilancia
  (`just affiliate-coverage`) que el resto del catálogo.
- Que la sección no añada peso a las demás páginas.

**Non-Goals:**

- Portadas variantes, precios de segunda mano o grados de conservación.
- Una ficha por número: el número se ve dentro de la ficha de su serie.
- Páginas por autor o por editorial (el filtro las cubre).

## Decisions

### Rutas

`/comics` y `/comic/<slug>`, como `/novelas` y `/novela/<slug>`. El slug sale
del título original (`mindbreaker`, `legend-of-drizzt-devils-due`); si dos
series coinciden, se añade la editorial o el año.

### Una ficha por serie, con sus números y sus tomos

Alternativa descartada: una ficha por número, que daría unas 400 páginas casi
vacías y repartiría la compra, que es por tomo. Otra descartada: una ficha
por tomo, que no sirve para las series de los noventa sin recopilar ni para
saber qué falta por leer.

```json
{
  "slug": "mindbreaker",
  "title": "Dungeons & Dragons: Mindbreaker",
  "publisher": "IDW Publishing",
  "setting": "forgotten_realms",
  "kind": "limited_series",
  "date": "2021-10",
  "issue_count": 5,
  "writers": ["Jim Zub"],
  "artists": ["Eduardo Mello"],
  "description": "De qué trata…\n\nDónde encaja…",
  "source": "https://www.comics.org/series/…",
  "issues": [
    {
      "number": "1",
      "date": "2021-10",
      "cover": "/images/comics/mindbreaker/1.webp",
      "cover_source": "https://www.comics.org/issue/…"
    }
  ],
  "editions": [
    {
      "language": "english",
      "title": "Dungeons & Dragons: Mindbreaker",
      "publisher": "IDW Publishing",
      "date": "2022-05",
      "format": "paperback",
      "isbn13": 9781684059…,
      "contents": [{ "series": "mindbreaker", "issues": "1-5" }],
      "cover": "/images/comics/mindbreaker/9781684059….webp",
      "purchase_links": [{ "store": "amazon", "url": "https://www.amazon.es/dp/…/" }]
    }
  ],
  "continues": null,
  "related_novels": [],
  "related_products": [],
  "related_videogames": ["baldurs-gate-3"],
  "related_merchandise": []
}
```

(Valores ilustrativos: cada dato se comprueba al dar de alta la serie.)

- Archivos en `data/comics/<editorial>/<slug>.json` (`dc`, `devils-due`,
  `idw`, `dark-horse`, `kenzer`, `harpercollins`, `planeta`, `otras`).
- `kind`: `ongoing`, `limited_series`, `one_shot`, `graphic_novel`,
  `promotional` y `webcomic`.
- `setting`, la misma lista cerrada que las novelas más `multiple` y `none`.
- `issues[].number` es texto (`"1"`, `"Annual 1"`, `"0"`); `title`, `date`,
  `writers` y `artists` opcionales. `cover` opcional; el test exige que la
  ficha tenga al menos una portada (de número o de tomo).
- `editions[].format`: `paperback`, `hardcover`, `omnibus`, `digital` e
  `issue` (grapa). Las grapas en castellano son ediciones con
  `format: "issue"` y su propia lista de `issues` (número, fecha, portada),
  porque la numeración y las fechas españolas no coinciden con las
  originales.
- `contents` indica qué números recoge cada tomo (rangos por serie). El
  loader comprueba que existen y calcula, para cada número, en qué tomos está.
- Un tomo que recoge varias series se guarda una vez en
  `data/comics/collections.json` con el mismo formato de edición; el loader lo
  añade a cada serie que aparece en su `contents`.
- Ediciones en castellano con `spain` como en novelas y merchandising.
- ISBN-13 con la utilidad de novelas (`src/utils/isbn.ts`), que convierte los
  ISBN-10.

### Fuentes

- **Datos de series y números:** Grand Comics Database (comics.org), que
  tiene fechas de portada, autores, tomos y también ediciones españolas, y la
  web de la editorial (IDW, Dark Horse, HarperCollins) o de Wizards.
- **Castellano:** Tebeosfera (en Chrome: carga con JavaScript), la web de
  Norma y la ficha de la Biblioteca Nacional o de la Agencia del ISBN cuando
  haya ISBN.
- **Portadas:** de números, la de GCD o la de la editorial; de tomos, la de la
  editorial o la imagen principal de Amazon (`data-old-hires`), como en
  novelas. Cada portada guarda su página de origen.

### Portadas en WebP con miniatura

`just comic-covers <slug> <número|isbn>=<url>…` descarga cada portada, la
convierte a WebP (máximo 1200 px de alto) con miniatura `-thumb.webp` de 300
px con `sharp`, y la anota en la ficha, como `just novel-covers`. La
cuadrícula de números y los tomos usan la miniatura y el visor, la grande.

### Datos fuera del bundle principal

Un plugin de `vite.config.ts` genera `virtual:comics-index` (para el listado:
slug, títulos, editorial, mundo, años, recuento, portada en miniatura,
castellano, a la venta, autores y títulos de tomos para la búsqueda) en un
trozo aparte, y cada ficha va en su propio trozo. `comicLoader.ts` ofrece
`useComicIndex` y `useComic` con caché síncrona; `entry-server.tsx` la llena
entera y `main.tsx` precarga lo de la ruta antes de hidratar, como
`novelLoader.ts`.

Alternativa descartada: `import.meta.glob` eager como merchandising. Con ~60
fichas y cientos de números sumaría a todas las páginas del sitio.

### Componentes

- `ComicsPage` (listado) con `ComicFilterPanel` y `ComicCard`, sobre
  `ui/` (buscador, control segmentado, tarjeta, insignia).
- `ComicPage` (ficha) con la cabecera de datos, «Dónde leerla» (tomos con
  `PurchaseButton`, primero castellano), la cuadrícula de números
  (`ComicIssueGrid`, con `ImageLightbox` navegable) y el contenido
  relacionado.
- Títulos con la escala de `headingClass`; título original primero y el de
  castellano debajo con `SpanishMark`, como en las listas de libros.

### Novedades, feed y resumen mensual

`scripts/releases.mjs` añade la sección «Cómics»: cada edición con fecha
(tomo o grapa, inglés o castellano) es una entrada con enlace a la ficha;
los números en inglés sueltos cuentan solo si son de los últimos 90 días o
futuros, para no llenar la página de grapas. `monthly-summary.mjs` cuenta las
fichas nuevas de cómics y las ediciones en castellano nuevas o con fecha
cambiada.

### Afiliados

Amazon (tomos impresos y Kindle) y Casa del Libro (tomos con ISBN en
castellano), igual que novelas. `just affiliate-coverage` revisa cada tomo
publicado; los descatalogados van a `data/affiliate-exceptions.json` con su
motivo. Generación X, que es librería de cómics, entra cuando acepten la
solicitud de afiliado.

### Relaciones inversas

La ficha de una novela, un videojuego o un artículo de merchandising muestra
los cómics que la enlazan, calculado en el build a partir de los cómics (no
se duplica el dato en las otras secciones).

## Risks / Trade-offs

- [Datos en castellano dispersos y con lagunas] → El inventario anota la
  fuente de cada edición y lo que no se pueda confirmar no consta; se revisa
  con el usuario antes de cargar fichas, como en novelas.
- [Portadas de números antiguos de baja calidad o ausentes] → Se usa la mejor
  disponible (GCD, editorial); si no hay, el número consta sin portada y la
  ficha usa la del tomo.
- [GCD y Tebeosfera piden no rascar en masa] → Consultas por serie y a mano
  con Chrome, no descargas masivas; las portadas se bajan una vez.
- [Tomos de varias series] → `collections.json` y un test que comprueba que
  cada serie de `contents` existe y que los rangos son válidos.
- [Recuentos de números que no cuadran con Wikipedia] → `issue_count` es el
  de la fuente principal y un test exige que coincida con la lista de
  `issues`.

## Migration Plan

Sección nueva sin migración de datos. Se publica cuando estén todas las
fichas en inglés y lo encontrado en castellano; hasta entonces el enlace de
la cabecera y la tarjeta de la portada no se añaden.
