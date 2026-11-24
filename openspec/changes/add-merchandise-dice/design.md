# Design

## Context

En merchandising, el grupo y el tipo de cada artículo son listas cerradas
que se repiten en cuatro sitios: el esquema JSON (con un `if/then` por grupo
que limita sus tipos), `MerchandiseGroup`/`MerchandiseKind` en
`src/types/merchandise.ts`, `groupNames`/`kindNames`/`kindsByGroup` en
`src/utils/merchandiseTranslations.ts` y la carpeta del grupo en
`data/merchandising/items/<grupo>/`, que comprueban los tests. El listado y
la ficha leen esos nombres, así que un grupo nuevo no necesita componentes
nuevos.

Búsqueda hecha el 2026-11-24:

- **FanRoll:** su tienda (colecciones «Dungeons & Dragons» y «Licensed» de
  fanrolldice.com, más los agotados de `/products.json`).
- **Amazon.es:** 40 búsquedas (genéricas, por fabricante y por producto) y
  ficha de cada candidato: precio, existencias y vendedor.
- **Juegos de la Mesa Redonda:** solo una bandeja de Ultra Pro, agotada.
- **Generación X:** ningún dado de D&D.

En la práctica, la tienda es Amazon.es, casi siempre a través de vendedores
externos.

## Goals / Non-Goals

**Goals:**

- Un cuarto grupo `dice` con los tipos `dice_set`, `dice_accessory` y
  `advent_calendar`.
- Las 18 fichas del inventario de abajo: todos los dados y accesorios de
  dados oficiales de D&D a la venta en España.

**Non-Goals:**

- Los productos oficiales que no se venden en España (se anotan en el
  inventario como pendientes, por si llegan).
- Lo que tiene forma de dado pero no es para tirar: las figuras sorpresa en
  un d20 de Bizak y los Dicelings de Hasbro (estos ya están en figuras), la
  copa y la jarra d20 de Nemesis Now o su bolsa de transporte.
- Fundas, tapetes, carpetas y cajas de cartas de Ultra Pro: no son de dados.
- La línea Dragon Storm de FanRoll y sus dados genéricos «para D&D»: marca
  propia, sin licencia.

## Decisions

**Grupo `dice`, «Dados y accesorios».** Los calendarios y las bandejas no
encajan en figuras ni en juegos, y un grupo propio permite filtrarlos.
Alternativa descartada: meterlos en `figures` con un tipo más, porque
mezclaría dados con juguetes en el filtro.

**Tres tipos.** `dice_set` («Juego de dados»: juegos de 7, dados sueltos
grandes, cajas ciegas), `dice_accessory` («Accesorio de dados»: bandejas,
torres, lanzadores, bolsas, cajas y pergaminos para guardarlos) y
`advent_calendar` («Calendario de adviento»). El calendario tiene tipo propio
porque es el producto que lo ha motivado, sale cada temporada y mezcla dados
con accesorios.

**Solo lo que está a la venta en España.** A diferencia del resto de
merchandising, donde todo entra aunque solo se venda en inglés, en dados
entra lo que se puede comprar en España en el momento de cargarlo, de
preferencia en una tienda de afiliados. El motivo: el valor de esta categoría
es que sea práctica para comprar; un dado no tiene edición en castellano que
seguir. Si un artículo se agota después, la ficha se queda, como con los
demás, y `just affiliate-coverage` lo avisa.

**Una ficha por línea, no por variante**, como con las figuras (Icons of the
Realms lleva varios enlaces de Amazon en la misma edición). Cada calendario de
adviento tiene ficha propia: es un producto con contenido propio.

**Ediciones sin idioma.** Los dados no tienen texto, así que llevan una
edición sin idioma, como LEGO o Funko. Los «Dice & Miscellany» de Wizards
traen cartas en inglés: llevan edición `english`.

**Fuente:** la página del producto del fabricante (fanrolldice.com,
ultrapro.com, nemesisnow.com, Wizards o D&D Beyond), en el Internet Archive si
ya no está y, solo si no existe, la ficha de Amazon.

**Inventario inicial** (Sirius Dice se añadió al cargar las fichas, al
aparecer su línea oficial en Amazon.es), con los códigos de Amazon.es a la venta el
2026-11-24 (la fecha de salida sale de la fuente al cargar cada ficha):

| Ficha (slug)                                | Fabricante  | Tipo           | Amazon.es                                                                                                  |
| ------------------------------------------- | ----------- | -------------- | ---------------------------------------------------------------------------------------------------------- |
| fanroll-frostmaidens-aurora-advent-calendar | FanRoll     | calendario     | B0GW8RBWLV                                                                                                 |
| fanroll-50th-anniversary-holmes-dice        | FanRoll     | juego de dados | B0DDZ8H2GF, B0DDZ22YQM, B0DDZ2F988                                                                         |
| fanroll-liquid-core-dice-set                | FanRoll     | juego de dados | B0DTJ8R896                                                                                                 |
| fanroll-beholder-dice-set                   | FanRoll     | juego de dados | B0DVKCJZMD                                                                                                 |
| fanroll-gelatinous-cube                     | FanRoll     | juego de dados | B0GW8RGY2N                                                                                                 |
| fanroll-fizbans-fortune                     | FanRoll     | juego de dados | B0GT6DBM9K                                                                                                 |
| fanroll-orb-of-possibility                  | FanRoll     | accesorio      | B0DDZF8KCZ                                                                                                 |
| fanroll-masterworks-series                  | FanRoll     | accesorio      | B0FHXV6Q9W, B0FLF3RTXX                                                                                     |
| ultra-pro-heavy-metal-dice                  | Ultra Pro   | juego de dados | B09F5742P9, B09F62DDDN, B09F5Y2TPF, B097Z6MCVH, B097Z8ZT21, B093TW2CYD, B0DCGR5BJP                         |
| ultra-pro-dice-bags                         | Ultra Pro   | accesorio      | B01BKMT566, B07YP1MSQD, B0971RHGQ3, B09WW3Y563                                                             |
| ultra-pro-dice-trays-and-towers             | Ultra Pro   | accesorio      | B0CCZJWZGS, B0BJYNPQSH, B0DCGSS63K                                                                         |
| nemesis-now-dice-boxes                      | Nemesis Now | accesorio      | B08XMMYS8T, B08XMHFCVW, B0CH5TB6G3, B0D31LD524                                                             |
| sirius-dice-adventure-dice                  | Sirius Dice | juego de dados | B0DJDV6PJC, B0DJDWLQ7T, B0DJDVMLJG, B0GY3ZLBJD, B0GY2L241Z, B0GY2BB5XW, B0GY2QKRNY, B0H6GV3KM6, B0FZY1BZQ2 |
| sirius-dice-treasure-packs                  | Sirius Dice | juego de dados | B0H6H2TYLJ, B0DX2KLH5Y                                                                                     |
| sirius-dice-mini-dice-cups                  | Sirius Dice | juego de dados | B0DW6JQTS2                                                                                                 |
| sirius-dice-pride-dice-set                  | Sirius Dice | juego de dados | B0DX2LPYXV                                                                                                 |
| dice-and-miscellany                         | Wizards     | juego de dados | 0786967145, 0786967218                                                                                     |
| dungeons-and-dragons-official-dice-set      | Wizards     | juego de dados | B0B58GPRVG                                                                                                 |

Productos oficiales de FanRoll que no están a la venta en España y van al
inventario como pendientes: Mind Flayer Dice Set, Dragon Scale (metal dorado
y silicona roja), d20 gigante de Mists of Ravenloft, bandeja octogonal del
dragón rojo antiguo, las bandejas y torres Masterworks de Erol Otus y Larry
Elmore, y los calendarios Halloween Haunt (2025), Halloween (2026) y Red
Robes & Winter Woes (2026). Del resto de «Dice & Miscellany» de Wizards
(2017-2021) se anotan los que no se encuentren.

## Risks / Trade-offs

- [Amazon.es mezcla lo oficial con dados genéricos «para D&D»] → Solo entra lo
  que el fabricante vende como licencia de D&D o lo que la ficha muestra con el
  logotipo oficial; se comprueba el título de cada enlace.
- [Casi todo lo venden terceros en Amazon.es, con stock corto y precios
  altos] → Se enlaza igualmente (es la única vía en España); `just
affiliate-coverage` y la skill `novedades` avisan cuando desaparece.
- [B0GT6DBM9K se anuncia como «Fizban's Treasure Misfit», quizá una variante
  de Fizban's Fortune] → Se comprueba con la ficha de FanRoll al cargarla; si
  es otro producto, se ajusta el nombre de la ficha.
- [Las fichas de dados tienen poco que contar] → La descripción de dos
  párrafos explica qué trae y para quién es, igual que en las figuras.
