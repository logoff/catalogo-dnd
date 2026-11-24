# Proposal

## Why

En Amazon.es se venden dados y accesorios con licencia oficial de D&D de
varios fabricantes (FanRoll, Sirius Dice, Ultra Pro, Nemesis Now y la propia
Wizards):
calendarios de adviento, juegos de dados, bandejas, torres, bolsas y cajas.
Ahora la sección de merchandising excluye los dados, así que todo eso queda
fuera del catálogo y de sus enlaces de afiliado.

## What Changes

- Los dados y sus accesorios con licencia oficial salen de las exclusiones
  de merchandising y forman un cuarto grupo, «Dados y accesorios».
- Tres tipos nuevos en el grupo: juego de dados (juegos completos, dados
  sueltos, cajas ciegas), accesorio de dados (bandejas, torres, lanzadores)
  y calendario de adviento de dados.
- A diferencia del resto de merchandising, en dados solo entra lo que se
  puede comprar en España al darlo de alta, con su enlace de compra.
- El listado filtra por el grupo nuevo y sus tipos, igual que por los demás.
- Carga inicial de todo lo oficial a la venta en España: 18 fichas (8 de
  FanRoll, 4 de Sirius Dice, 3 de Ultra Pro, 1 de Nemesis Now y 2 de Wizards), una por línea
  y una por calendario de adviento.
- La ropa y los complementos siguen fuera.

## Capabilities

### New Capabilities

Ninguna.

### Modified Capabilities

- `merchandise-records`: el alcance incluye los dados y accesorios de dados
  con licencia oficial; las exclusiones dejan de citarlos y la lista cerrada
  de grupos y tipos añade el grupo y sus tres tipos; requisito nuevo de que
  los dados estén a la venta en España.
- `merchandise-listing`: el filtro por grupo incluye «Dados y accesorios».

## Impact

- Datos: esquema `data/schemas/merchandise.jsonschema`, carpeta nueva
  `data/merchandising/items/dice/`, sección nueva en
  `data/merchandising/inventory.md` e imágenes en
  `public/images/merchandising/<slug>/`.
- Código: `src/types/merchandise.ts` y `src/utils/merchandiseTranslations.ts`
  (nombres y tipos por grupo), y los tests que los recorren.
- Documentación: skill `add-merchandise` y la sección de merchandising de
  `CLAUDE.md`.
- Sin cambios en rutas, prerenderizado ni tiendas: los enlaces son de Amazon,
  una tienda que el esquema ya acepta.
