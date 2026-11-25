# Design

## Context

Merchandising tiene cuatro grupos con su lista cerrada de tipos en el
esquema (`enum` y un `if/then` por grupo), en `src/types/merchandise.ts` y
en `merchandiseTranslations.ts` (`groupNames`, `kindNames`, `kindsByGroup`).
El listado construye los filtros de grupo y tipo a partir de esas listas, y
los tests del loader comprueban que cada archivo está en la carpeta de su
grupo. Ver proposal.md para el motivo.

## Goals / Non-Goals

**Goals:**

- Dar sitio a la papelería y los regalos con licencia y a los librojuegos sin
  tocar el resto de la sección.
- Cargar todo lo que falta de la serie de Penguin Random House y los
  _Endless Quest_ de 2018-2019.

**Non-Goals:**

- Revisar otras editoriales de papelería (Insight Editions, Paladone…): se
  anota como pendiente en el inventario.
- Cambiar el criterio de los dados (solo lo que se vende en España).

## Decisions

### 1. Un grupo con tres tipos

`stationery` («Papelería y regalo») con `journal` («Diario o cuaderno»),
`puzzle` («Puzle») y `stationery_gift` («Papelería y otros regalos»: postales,
pegatinas, barajas de tarot, pizarras). Tres tipos bastan para filtrar sin
crear tipos de un solo artículo.

Alternativa descartada: meterlos en «Libros licenciados». Muchos no son
libros (puzles, postales, pizarras) y mezclarlos ensuciaría el filtro.

### 2. Librojuego como tipo de libro

`gamebook` («Librojuego») en `books`: son libros con texto y edición por
idioma, como el resto del grupo. Cada _Endless Quest_ tiene ficha propia, con
su edición en tapa dura y en rústica (dos ediciones en inglés con su ISBN).

### 3. Ediciones especiales y variantes

Las ediciones especiales en caja de _Art & Arcana_ y _Lore & Legends_ son
otra edición en inglés de su ficha, con su título y su ISBN. Los tres
minipuzles con forma (Demogorgon, Mimic y Beholder) van en una ficha con
una edición por puzle, como una línea.

### 4. Fuentes y compra

Fuente: la ficha de Penguin Random House de cada producto (y Candlewick o
gamebooks.org para los _Endless Quest_). Enlaces de Amazon.es comprobados en
Chrome; lo que no esté a la venta va a `data/affiliate-exceptions.json` con
su motivo, como el resto de la sección.

## Risks / Trade-offs

- [«Papelería y otros regalos» es un cajón de sastre] → Se acota en la
  descripción del tipo y en la skill; si crece una familia (por ejemplo,
  barajas), tendrá tipo propio.
- [Productos agotados de 2019-2022] → Se mantienen con excepción de afiliado,
  igual que el resto del merchandising.
