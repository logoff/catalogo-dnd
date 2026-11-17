# Proposal

## Why

Los programas de afiliados aceptados (Amazon, Casa del Libro, Instant
Gaming y Juegos de la Mesa Redonda) solo se usan en parte: Casa del Libro
únicamente enlaza novelas, Instant Gaming solo 11 de los 77 videojuegos,
y hay libros de rol y artículos de merchandising sin ningún enlace. Además,
muchas novelas de D&D tienen audiolibro en Audible, que Amazon.es vende y
que entra en el programa de Amazon; ahora las fichas los excluyen.

## What Changes

- **Audiolibros**: las novelas admiten ediciones con formato «audiolibro»
  (inglés o castellano), con narrador, duración si se conoce y enlace a su
  ficha de Amazon.es (ASIN de Audible). Solo los que se venden en
  Amazon.es. Se muestran junto al resto de ediciones de su idioma, con un
  botón «Comprar en Audible» y el afiliado de Amazon.
- **Casa del Libro** pasa a ser tienda válida en libros de rol y
  merchandising: enlace en cada edición en castellano que venda.
- **Cobertura de enlaces**: se completan los enlaces de las tiendas
  aceptadas donde falten (Amazon en libros de rol, merchandising y
  novelas; Instant Gaming en videojuegos; Juegos de la Mesa Redonda en
  libros de rol), y un informe lista lo que sigue sin enlace.
- No se añaden tiendas rechazadas (Fnac, Green Man Gaming, Humble Bundle,
  Eneba) ni pendientes de aprobación.

## Capabilities

### New Capabilities

- `affiliate-links`: qué tiendas se enlazan en cada sección del catálogo
  y cómo se comprueba que los enlaces de las tiendas aceptadas estén
  completos.

### Modified Capabilities

- `novel-records`: los audiolibros pasan a contar como edición.
- `novel-detail-page`: la ficha muestra los audiolibros con su narrador y
  su botón de compra.

## Impact

- Esquemas `novel.jsonschema` (formato `audiobook`, campos `narrators` y
  `duration`), `product.jsonschema` y `merchandise.jsonschema` (tienda
  `casa_del_libro`); tipos `Store` y `NovelFormat`.
- `src/utils/stores.ts` (etiqueta de Audible), `NovelDetail.tsx`,
  `novelTranslations.ts`, `PurchaseButton`.
- Datos: fichas de novelas, productos, merchandising y videojuegos.
- Skill `add-novel` y las de productos, merchandising y videojuegos
  (dónde buscar audiolibros y enlaces de cada tienda).
