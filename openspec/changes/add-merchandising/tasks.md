# Tasks

## 1. Inventario

- [ ] 1.1 Crear `data/merchandising/inventory.md` con los artículos con
      licencia oficial desde 2014 de los tres grupos (título, fabricante,
      año, edición en castellano y fuente), cruzando la página de
      licencias de Wizards, las webs de los fabricantes, D&D Beyond y
      Amazon.es; verificar que cada entrada tiene fuente
- [ ] 1.2 Revisar el inventario con el usuario según los criterios de
      alcance y exclusiones de `merchandise-records` y dejarlo aprobado

## 2. Modelo de datos

- [ ] 2.1 Crear `data/schemas/merchandise.jsonschema` según el diseño
      (grupos, tipos por grupo con `if`/`then`, ediciones, fuente
      obligatoria, relaciones); verificar con tests de un artículo válido
      y de inválidos (tipo de otro grupo, sin fuente, campo desconocido)
- [ ] 2.2 Crear `src/types/merchandise.ts` y
      `src/services/merchandiseLoader.ts` con `year`, `hasSpanish`,
      `availableToBuy` y el orden por fecha; verificar con tests
      unitarios
- [ ] 2.3 Añadir los tests de datos (esquema, nombre de archivo igual al
      slug, slugs únicos, descripción de dos párrafos, imágenes
      existentes, URLs sin afiliado, libros y videojuegos relacionados
      existentes, coherencia con el inventario); verificar que
      `just test` pasa
- [ ] 2.4 Crear tres fichas piloto, una por grupo, con imágenes en
      `public/images/merchandising/`; verificar que validan y que
      cubren ediciones por idioma y relaciones

## 3. Listado

- [ ] 3.1 Crear `src/store/merchandiseStore.ts` y las utilidades de
      filtrado y orden (grupo, tipo, castellano, a la venta, búsqueda
      sin tildes); verificar con tests unitarios
- [ ] 3.2 Crear `MerchandiseCard`, el panel de filtros y
      `MerchandisePage` en `/merchandising`; verificar con tests de
      página (orden por defecto, filtros combinados, búsqueda sin
      tildes, orden por título y mensaje sin resultados)

## 4. Ficha

- [ ] 4.1 Crear `MerchandiseDetail` y `MerchandiseDetailPage` en
      `/merchandising/:slug` (imágenes con visor, datos, ediciones con
      botones de compra y Umami, aviso sin enlaces, relacionados, página
      de no encontrado); verificar con tests de componente y de página
- [ ] 4.2 Añadir las URLs al sitemap y comprobar el prerenderizado;
      verificar tras `just build` que existen
      `dist/merchandising.html` y la ficha piloto con su contenido, su
      título y su vista previa de 1200×630

## 5. Navegación y textos

- [ ] 5.1 Añadir «Merchandising» a la cabecera (escritorio y móvil) y un
      bloque con los artículos recientes en la portada; verificar con
      tests de `Header` y `HomePage`, y que el buscador de la cabecera
      sigue mostrando solo libros
- [ ] 5.2 Añadir la mención de los productos licenciados a la página
      legal; verificar con un test
- [ ] 5.3 Comprobar en `just dev` el listado y una ficha en escritorio y
      en móvil, y que los botones de compra llevan el afiliado

## 6. Herramientas y documentación

- [ ] 6.1 Crear la skill `add-merchandise` con las reglas de datos, las
      fuentes y los pasos; verificar leyéndola y dando de alta con ella
      la primera ficha del lote 7.1
- [ ] 6.2 Documentar la sección en `CLAUDE.md` y el README; verificar con
      `just check`

## 7. Carga de artículos

- [ ] 7.1 Lote de libros licenciados del inventario; verificar con
      `just check` y que el inventario no tiene libros pendientes
- [ ] 7.2 Lote de juegos de mesa y cartas; verificar igual que 7.1
- [ ] 7.3 Lote de figuras y juguetes; verificar con `just check` y que el
      inventario no tiene pendientes

## Workflow follow-up

- Archivar `add-merchandising` tras la revisión.
