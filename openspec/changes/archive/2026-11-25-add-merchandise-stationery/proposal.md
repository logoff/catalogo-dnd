# Proposal

## Why

Al revisar la serie «Dungeons & Dragons» de Penguin Random House (50
títulos con licencia oficial) faltaban en el catálogo una docena de libros
que encajan en merchandising (recetarios, libros para colorear, cuadernos de
trabajo, un libro de arte) y otros dieciséis productos que hoy no tienen
sitio: diarios y cuadernos de campaña, puzles, una baraja de tarot, postales,
pegatinas y unas pizarras. Tampoco hay sitio para los librojuegos con
licencia (_Escape from Host Tower_ y los seis _Endless Quest_ de 2018-2019),
que la sección de novelas excluye. Todo se vende en Amazon.es, así que son
fichas útiles y enlaces de afiliado.

## What Changes

- Grupo nuevo «Papelería y regalo» en merchandising, con tres tipos: diario
  o cuaderno, puzle y papelería y otros regalos (postales, pegatinas,
  barajas de tarot, pizarras).
- Tipo nuevo «Librojuego» en el grupo de libros licenciados: libros de
  «elige tu camino» con licencia oficial.
- Las barajas de recetas van como libro de cocina y los cuadernos de
  trabajo, como guía ilustrada, como ya se hacía.
- Carga de lo que falta de la serie de Penguin y de los _Endless Quest_:
  12 fichas de libros (más 6 librojuegos), 13 de papelería y regalo
  (los tres minipuzles con forma, en una sola) y las ediciones especiales
  de _Art & Arcana_ y _Lore & Legends_ como ediciones de su ficha.
- El cómic _The Candlekeep Chronicles_ (2027) va a la sección de cómics.
- La ropa y los complementos siguen fuera.

## Capabilities

### New Capabilities

Ninguna.

### Modified Capabilities

- `merchandise-records`: el alcance suma el grupo de papelería y regalo; la
  lista cerrada de grupos y tipos añade el grupo con sus tres tipos y el
  tipo librojuego en libros.
- `merchandise-listing`: el filtro por grupo incluye «Papelería y regalo».

## Impact

- Datos: esquema `data/schemas/merchandise.jsonschema`, carpeta nueva
  `data/merchandising/items/stationery/`, sección nueva en
  `data/merchandising/inventory.md` e imágenes en
  `public/images/merchandising/<slug>/`. Una ficha de cómic en
  `data/comics/`.
- Código: `src/types/merchandise.ts` y `src/utils/merchandiseTranslations.ts`.
- Documentación: skill `add-merchandise` y la sección de merchandising de
  `CLAUDE.md`.
- Sin cambios en rutas, prerenderizado ni tiendas.
