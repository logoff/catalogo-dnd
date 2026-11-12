# Design

## Context

El catálogo de libros guarda cada producto en un JSON
(`data/{2014,2024}/products/…`), lo importa con `import.meta.glob` en
`src/services/dataLoader.ts` y lo enriquece en `ProductWithMeta`. Las
páginas se prerenderizan a partir del sitemap (`scripts/prerender.mjs`,
`src/entry-server.tsx`), y el primer render no puede usar `window` ni
`localStorage`. Los enlaces de compra se resuelven en
`src/utils/stores.ts`: cada tienda tiene una función opcional `affiliate`
que recibe la URL limpia, y los IDs llegan por variables de entorno. Ya
existe `adtractionAffiliate`. El tipo `Edition` y la estructura de rutas
de libros dependen de la edición (2014/2024), cosa que no aplica a los
videojuegos.

La motivación está en `proposal.md`; los requisitos, en `specs/`.

## Goals / Non-Goals

**Goals:**

- Que el modelo de datos represente bien un juego con muchas versiones
  (plataformas, ediciones, editoras y castellano distintos).
- Reutilizar la infraestructura existente (tiendas, sitemap,
  prerenderizado, vistas previas, analítica) sin duplicarla.
- Poder dar de alta un centenar de juegos por lotes y con fuentes.

**Non-Goals:**

- Unificar libros y videojuegos en un solo modelo o en un solo listado.
- Obtener datos automáticamente de APIs externas en tiempo de build.
- Mostrar precios o stock de las tiendas.

## Decisions

### D1 · Datos separados de los libros

Carpeta propia `data/videogames/games/<década>/<slug>.json`, esquema
propio `data/schemas/videogame.jsonschema`, y tipos y loader propios
(`src/types/videogame.ts`, `src/services/videogameLoader.ts`). La
carpeta de década solo sirve para orientarse en el repositorio; el
loader no depende de ella.

_Alternativa descartada:_ meter los juegos como un `PublicationType` más
del modelo de libros. Obligaría a dar edición 2014/2024 y subtipos de
libro a algo que no los tiene, y complicaría los filtros y las rutas de
los libros.

### D2 · Juego con lanzamientos

Mismo patrón que producto con publicaciones:

```ts
interface Videogame {
  slug: string
  title: string
  title_es?: string
  description: string
  developers: string[]
  publishers: string[]
  genres: Genre[]
  modes?: Mode[]
  setting?: Setting
  ruleset?: Ruleset // adnd1 | adnd2 | 3e | 3_5 | 4e | 5e | 2024 | own
  series?: string
  status?: 'released' | 'shut_down' | 'announced' // anunciados del inventario
  expansions?: { title: string; date?: string }[]
  releases: GameRelease[]
  reviews?: Review[]
  images?: string[]
  official_url?: string
  related_products?: { edition: Edition; code: string }[]
}

interface GameRelease {
  platform: Platform
  date?: string // YYYY, YYYY-MM o YYYY-MM-DD
  edition?: string // «Enhanced Edition»…
  developers?: string[] // solo si difiere del juego
  publishers?: string[]
  spanish?: SpanishSupport // ausente = desconocido
  purchase_links?: PurchaseLink[]
  delisted?: boolean
}

interface SpanishSupport {
  interface: boolean
  subtitles: boolean
  audio: boolean
  note?: string // p. ej. traducción de fans
}

interface Review {
  source: ReviewSource // metacritic | opencritic | meristation | vandal | 3djuegos | ign | gamespot | pc_gamer | …
  score: number
  scale: number
  url: string
  platform?: Platform
  edition?: string
}
```

Se distingue «desconocido» (sin `spanish`) de «solo en inglés» (todo a
`false`), como pide el spec. Las fechas parciales se guardan como
cadenas ISO truncadas y se ordenan como texto, que funciona porque el
formato es de mayor a menor.

Campos derivados (`VideogameWithMeta`): `firstReleaseDate`, `decade`,
`platforms`, `spanishSummary` (`full` con voces, `text` si solo tiene
textos o subtítulos, `none`, `unknown`), `bestScore` (normalizada a 100)
y `availableToBuy`.

_Alternativa descartada:_ un juego por plataforma. Repetiría la
descripción, las notas y las imágenes, y rompería la idea de «un juego,
una ficha».

### D3 · Rutas

`/videojuegos` y `/videojuego/:slug`, decididas con el usuario. Se
añaden a `AppRoutes.tsx` y a `generate-sitemap.mjs`. Con eso ya entran
en el prerenderizado, que genera un HTML por cada URL del sitemap. Para
las vistas previas de 1200×630 se reutiliza la conversión con `sharp`
de las portadas de libros.

### D4 · Tiendas en la configuración común

Se amplía `Store` y `STORES` en `src/utils/stores.ts` con `gog`, `steam`
y, cuando se verifiquen, las demás. `gog` usa
`adtractionAffiliate(VITE_AFFILIATE_GOG_PROGRAM,
VITE_AFFILIATE_ADTRACTION_CHANNEL)`; `steam` no define `affiliate`.
`getPurchaseUrl` y el botón con `rel="sponsored"` y el evento de Umami
se reutilizan tal cual.

Tiendas candidatas, según el usuario:

| Prioridad    | Tienda                                                                 | Uso                         | Afiliación (verificado el 2026-11-12)                                                                                        |
| ------------ | ---------------------------------------------------------------------- | --------------------------- | ---------------------------------------------------------------------------------------------------------------------------- |
| Principal    | GOG                                                                    | Digital PC                  | Adtraction, 6 % en España (visto en el panel)                                                                                |
| Principal    | Amazon                                                                 | Digital y físico (consolas) | Amazon Afiliados, ya integrado                                                                                               |
| Principal    | Humble Bundle                                                          | Digital PC                  | Humble Partner, en CJ Affiliate; comisión según directorios entre el 4 % y el 15 %, sin fuente oficial                       |
| Principal    | Eneba                                                                  | Claves digitales            | Programa propio y en redes (Awin, Daisycon); 2–5 % según directorios                                                         |
| Principal    | Instant Gaming                                                         | Claves digitales            | Programa propio con enlaces de referido (`igr`); condiciones sin confirmar                                                   |
| Opcional     | Green Man Gaming                                                       | Digital PC                  | Programa propio: hasta un 5 % por venta, 10 % en packs (su página de afiliados); red no confirmada (Impact, CJ o FlexOffers) |
| Opcional     | Fanatical                                                              | Digital PC                  | CJ Affiliate para webs; hasta un 5 % según directorios                                                                       |
| Sin afiliado | Steam, Epic Games Store, PlayStation Store, Nintendo eShop, Xbox Store | Digital                     | Sin programa útil para una web; enlace limpio                                                                                |

Las cifras de directorios son orientativas: las condiciones reales se ven
al solicitar cada programa, y se apuntan aquí entonces.

Juegos de móvil: las redes Impact, Partnerize, Admitad y Awin tienen
ofertas de instalación (CPI), pero no se ha encontrado ninguna de un
juego de D&D. Casi todos los juegos de móvil del inventario están
cerrados, y los que siguen (Idle Champions, Lords of Waterdeep, las
Enhanced Edition) se enlazan a sus tiendas de apps sin afiliado. Se
revisa si aparece un programa concreto.

Todas las tiendas se muestran igual; los botones de cada plataforma
siguen el orden de declaración de `STORES`, que es estable. Los enlaces
llevan además `format: 'digital' | 'physical'` para distinguir las
ediciones físicas.

_Alternativa descartada:_ una configuración de tiendas aparte para
videojuegos. Duplicaría la lógica de afiliados y el tratamiento de las
variables de entorno.

### D5 · Componentes

Componentes nuevos en `src/components/videogames/`: `VideogameCard`,
`VideogameDetail`, `ReleaseTable`, `PurchaseByPlatform`, `SpanishBadge`,
`ReviewScore` y un panel de filtros propio. Se reutilizan `Layout`,
`Breadcrumbs`, `ImageLightbox`, `SearchBar`, `SortSelect` y `MetaTags`.
El botón de compra de libros (`ProductDetail.tsx`) se extrae a un
componente común para que libros y videojuegos compartan el mismo
marcado y el mismo evento de analítica, sin cambiar lo que se ve en los
libros.

### D6 · Estado de filtros

Un store de Zustand propio (`videogameStore`) con el patrón de
`productStore`. La preferencia de vista (tarjetas o lista) puede ir en
`localStorage`, pero solo leída tras la hidratación.

### D7 · Inventario y método de investigación

`data/videogames/inventory.md` es la lista maestra: título, año,
plataformas, fuente y estado (pendiente o con ficha). Se construye
cruzando la lista de videojuegos de D&D de la Wikipedia en inglés,
MobyGames (como fuente de fechas, plataformas y editoras, no de notas)
y los catálogos de GOG y Steam. Un test comprueba que cada ficha está en
el inventario y que cada entrada marcada con ficha la tiene.

Fuentes por campo: castellano según las tablas de idiomas de Steam y GOG
para los juegos a la venta, y según páginas oficiales, cajas españolas y
medios españoles para los antiguos; notas solo de las fuentes del spec.

_Alternativa descartada por ahora:_ poblar desde la API de IGDB. Acelera
fechas y portadas, pero aporta poco sobre castellano y añade
condiciones de uso y credenciales. Se puede valorar si el ritmo a mano
resulta insuficiente.

### D8 · Tests

Mismo enfoque que los tests de datos de libros: esquema válido, dos
párrafos de descripción, imágenes existentes, URLs sin afiliado, slugs
únicos, libros relacionados existentes y coherencia con el inventario.
Tests de componentes para el resumen de castellano, la agrupación por
plataforma, los filtros y el orden por nota.

## Risks / Trade-offs

- [Mucho trabajo de investigación en juegos antiguos con datos escasos]
  → Campos opcionales, fichas mínimas válidas y lotes por épocas.
- [Castellano de juegos antiguos difícil de comprobar] → El valor
  «desconocido» evita afirmar sin fuente.
- [Sin MobyGames como fuente de notas, muchos juegos de los 80 y 90 se
  quedan sin nota] → Se acepta: el listado los pone al final al ordenar
  por nota.
- [Juegos que se retiran de la venta, por ejemplo al cambiar las
  licencias] → El campo `delisted` y una revisión periódica desde
  `novedades`.
- [El sitemap y el prerenderizado crecen con unas cien páginas más] → Ya
  se generan unas cien de libros; el coste de build es asumible.
- [Cambiar el botón de compra de los libros] → El componente común se
  extrae con tests que fijan el marcado actual antes de reutilizarlo.

## Migration Plan

No hay migración de datos: todo es nuevo. Se despliega por fases, y la
sección no se enlaza desde la cabecera hasta tener el lote piloto. El
rollback consiste en quitar las rutas y el enlace de la cabecera; los
datos pueden quedarse en el repositorio sin efecto.

## Open Questions

- Condiciones reales de los programas de Humble, Fanatical, Green Man
  Gaming, Instant Gaming y Eneba, y de las redes Impact, Partnerize,
  Admitad y Awin (comisión, aprobación, mercado España). Se resuelve en
  la tarea de verificación y solo añade entradas a `STORES`.
- Epic Games Store y Steam quedan como enlaces sin afiliado, salvo que
  la verificación encuentre algo utilizable.
- Si GOG ofrece product feed en Adtraction, para rellenar sus enlaces
  con un script en vez de a mano.
