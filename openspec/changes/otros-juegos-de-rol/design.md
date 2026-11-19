# Design

## Context

El catálogo ya tiene cuatro modelos de datos. El de los libros oficiales
(`product.jsonschema`) está atado a WotC: `edition` solo admite `5e` o `2024`,
y lleva `item_code`, `wpn_url` y subtipos propios. Los de novelas y
merchandising son más recientes: una obra con `slug` y un array de ediciones
por idioma, cada una con su editorial, fecha, ISBN y tiendas. Novelas, con
cientos de fichas, se carga por trozos (`virtual:novels-index` y una ficha por
trozo); merchandising, con unas decenas, va en el bundle.

Los botones de compra ya pasan por `PurchaseLinks`, que pone el aviso de
afiliado, y un test exige que todo botón esté dentro de esa zona.

## Goals / Non-Goals

**Goals:**

- Un modelo de tres entidades (licencia, sistema, libro) que sirva también
  para OSR (#95), el árbol genealógico (#99) y las ediciones anteriores de
  D&D (#100) sin cambiar el esquema.
- Derivaciones con su tipo y su matiz, para no presentar como absoluta una
  relación difusa.
- Que lo oficial de D&D no se duplique ni se mezcle.

**Non-Goals:**

- Dibujar el árbol genealógico (#99): aquí solo se guardan los datos.
- Reseñas de los libros de la sección (se puede añadir después con el
  esquema común `review.jsonschema`).
- Notas o valoraciones de los sistemas.

## Decisions

### Rutas y nombre

La sección se llama **«Otros juegos de rol»**:

```text
/rol                              listado de sistemas y libros
/rol/:sistema                     ficha de sistema
/rol/:sistema/:libro              ficha de libro
/licencias                        listado de licencias abiertas
/licencia/:slug                   ficha de licencia
```

El libro cuelga de su sistema en la URL porque siempre tiene uno y así la
ruta ya dice de qué juego es. `/licencias` va aparte porque una licencia
agrupa varios sistemas y no pertenece a ninguno.

### Tres esquemas propios, no `product.jsonschema`

Alternativa descartada: reutilizar `product.jsonschema` ampliando `edition`.
Obligaría a abrir campos de WotC y a mezclar los tests de los libros
oficiales (cobertura de reseñas, etc.) con libros de terceros.

```text
data/rol/
  licenses/<slug>.json      license.jsonschema
  systems/<slug>.json       rpg-system.jsonschema
  books/<sistema>/<slug>.json   rpg-book.jsonschema
  inventory.md
```

- **Licencia**: `slug`, `name`, `kind` (licencia, documento de referencia o
  marca de compatibilidad), `holder`, `date`, `description` propia, `links`
  oficiales (texto legal, documento de referencia, FAQ), `revoked` o notas de
  estado si aplica (caso de la OGL 1.0a en 2023), y `related_licenses` (por
  ejemplo, el SRD 5.1 bajo OGL 1.0a y bajo CC BY 4.0).
- **Sistema**: `slug` (una edición concreta: `pathfinder-1e`,
  `pathfinder-2e`), `name`, `family` (agrupa ediciones del mismo juego),
  `publisher`, `date`, `description` propia, `features` (lista corta de
  características principales), `licenses` (cada una con desde qué fecha o
  versión, porque un sistema puede cambiar de licencia entre ediciones o
  revisiones), `derived_from`, `official_catalog` (solo D&D: enlace a la
  sección oficial) y `links`.
- **Libro**: `slug`, `system`, `title`, `title_es`, `kind` (básico, caja de
  inicio, suplemento, aventura, ambientación…), `core` (si es principal para
  el alcance de lo solo en inglés), `description` propia, `source` y
  `editions` por idioma con el mismo patrón que novelas (editorial, fecha,
  ISBN, formato, portada y `purchase_links`). `license` opcional solo para un
  libro de terceros que no usa la licencia de su sistema (por ejemplo, el que
  solo se declara «compatible»).

### Derivaciones tipadas

```json
"derived_from": [
  {
    "system": "dnd-3-5",
    "kind": "major_rewrite",
    "via_license": "ogl-1-0a",
    "note": "Parte del SRD 3.5 y reescribe buena parte de las reglas."
  }
]
```

`kind` sigue la leyenda habitual de los árboles de ediciones:

| `kind`          | Significado                           |
| --------------- | ------------------------------------- |
| `revision`      | Revisión con cambios menores          |
| `compatible`    | Reescrito, pero en general compatible |
| `major_rewrite` | Cambio mayor de reglas                |
| `inspiration`   | Inspiración, sin compatibilidad       |

`note` es obligatorio para `inspiration` y recomendable en el resto: es donde
se matiza una derivación difusa. Solo se guarda la relación directa; la
genealogía completa se reconstruye recorriendo el grafo. Un test comprueba que
cada `system` y `via_license` existe y que no hay ciclos.

### D&D como sistema enlazado

Los sistemas de D&D (`dnd-5e-2014`, `dnd-5e-2024` y, cuando haga falta,
`dnd-3-5` como origen de Pathfinder) tienen ficha mínima con descripción,
licencias y `official_catalog`. Su ficha enlaza a `/2014` o `/2024` en vez de
listar libros oficiales. Los libros de terceros para 5E cuelgan de estos
sistemas. Las ediciones anteriores de D&D (#100) completarán esas fichas.

### Carga de datos como en novelas

Con «todo lo publicado en castellano» el volumen puede llegar a cientos de
libros. Se reutiliza el patrón de novelas: un índice ligero para el listado
(`virtual:rpg-index`), cada ficha de libro en un trozo aparte y licencias y
sistemas en el índice, porque son pocos y los necesitan el listado y los
filtros. `entry-server.tsx` llena la caché entera para prerenderizar.

### Separación visual de lo oficial

Además de la ruta y la entrada de menú propias, las fichas de la sección
llevan una franja o insignia «No oficial de D&D» o el nombre del sistema
en la cabecera, con los tokens del sistema de diseño (sin colores nuevos).

### Tiendas

NoSoloRol entra en `stores.ts` con su programa de Adtraction ya aceptado,
como Juegos de la Mesa Redonda. Amazon y Casa del Libro también se enlazan en
esta sección. `just affiliate-coverage` incluye la sección nueva.

## Risks / Trade-offs

- [Volumen de lo publicado en castellano, que no se conoce de antemano] →
  inventario maestro por editorial y altas por lotes con una skill, como en
  novelas; se publica la sección con los sistemas grandes y se va
  completando.
- [Datos de licencias que cambian o son discutibles, como la OGL en 2023 o
  los cambios de licencia de un sistema] → cada licencia de sistema con su
  fecha o versión y enlace a la fuente oficial; textos propios, prudentes y
  sin interpretación legal.
- [Derivaciones opinables] → tipo explícito y `note`; solo relaciones con
  fuente o ampliamente reconocidas.
- [Que la sección diluya la identidad del sitio de D&D] → separación en ruta,
  menú y aspecto; lo oficial sigue siendo la portada y el buscador.
- [Marcas de terceros (Paizo, Darrington Press, Kobold Press)] → mismo
  tratamiento que con WotC: aviso de que no hay relación y textos propios.

## Open Questions

- Qué licencias concretas tiene cada sistema grande y desde qué versión
  (por ejemplo, el paso de Pathfinder 2E de la OGL a la ORC): se verifica con
  fuentes oficiales al dar de alta cada ficha.
- Orden de las primeras editoriales en castellano: se decide con el
  inventario.
