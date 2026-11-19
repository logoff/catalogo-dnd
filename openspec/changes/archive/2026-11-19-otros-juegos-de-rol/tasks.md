# Tasks

## 1. Inventario

- [x] 1.1 Crear `data/rol/inventory.md` con tres listas: licencias abiertas,
      sistemas (los grandes y los que tienen algo en castellano) y libros
      (todo lo publicado en castellano y los principales de los sistemas
      grandes en inglés), cada entrada con su fuente oficial y, en los
      libros, editorial en inglés y en castellano; verificar que cada
      entrada tiene fuente
- [x] 1.2 Revisar el inventario con el usuario según el alcance de
      `rpg-systems` y `rpg-books` (qué sistemas son grandes, qué libros son
      principales, editoriales en castellano y su orden) y dejarlo aprobado

## 2. Modelo de datos

- [x] 2.1 Crear `data/schemas/license.jsonschema`,
      `rpg-system.jsonschema` y `rpg-book.jsonschema` según el diseño (tipos
      cerrados de licencia, de derivación y de libro; licencias del sistema
      con versión o fecha; nota obligatoria en las derivaciones de
      inspiración; ediciones por idioma; `official_catalog` solo en D&D);
      verificar con tests de fichas válidas e inválidas (tipo desconocido,
      sin enlace oficial, inspiración sin nota, campo desconocido)
- [x] 2.2 Crear `src/types/rpg.ts` y `src/services/rpgLoader.ts` con el
      índice ligero (`virtual:rpg-index` en `vite.config.ts`, con licencias,
      sistemas y el resumen de cada libro) y cada libro en un trozo aparte,
      como novelas; campos derivados: licencias efectivas de cada libro,
      sistemas derivados en sentido inverso, familia, edición en castellano
      y año más reciente; verificar con tests unitarios
- [x] 2.3 Añadir los tests de datos: esquema, nombre de archivo igual al
      slug, slugs únicos, referencias existentes (sistema del libro,
      licencias, `derived_from`, `via_license`, licencias relacionadas),
      sin ciclos de derivación, libro solo en inglés marcado como principal o
      de una editorial destacada,
      descripciones y características presentes, URLs sin afiliado y
      coherencia con el inventario; verificar que `just test` pasa
- [x] 2.4 Crear las fichas piloto: OGL 1.0a, SRD 5.1 y ORC; D&D 3.5,
      D&D 5E (2014), Pathfinder 1E y Pathfinder 2E; un libro básico de
      Pathfinder 2E con edición en castellano y portada en
      `public/images/rol/`; verificar que validan y que cubren cambio de
      licencia, derivación por licencia y D&D enlazado al catálogo oficial

## 3. Tienda NoSoloRol

- [x] 3.1 Añadir NoSoloRol a `src/utils/stores.ts` y a los esquemas con su
      enlace de Adtraction (`VITE_AFFILIATE_NOSOLOROL_PROGRAM`), la variable
      en `.github/workflows/deploy.yml` y el README; verificar con los tests
      de `stores` que genera el enlace con afiliado y sin él la URL limpia
- [x] 3.2 Incluir la sección en `just affiliate-coverage` con las tiendas
      de `affiliate-links`; verificar que el informe lista los libros piloto
      sin enlace

## 4. Licencias

- [x] 4.1 Crear `LicensesPage` en `/licencias` y `LicenseDetailPage` en
      `/licencia/:slug` (explicación, tipo, titular, fecha, notas de estado,
      enlaces oficiales, licencias relacionadas, sistemas que la usan y sus
      libros, no encontrado); verificar con tests de página

## 5. Sistemas

- [x] 5.1 Crear `RpgSystemPage` en `/rol/:sistema` (descripción,
      características, datos, licencias con versión o fecha, «sin licencia
      abierta», derivaciones en los dos sentidos con su tipo y su nota,
      otras ediciones de la familia, libros, enlace al catálogo oficial en
      D&D, indicación de no oficial, no encontrado); verificar con tests de
      página que cubren Pathfinder 2E, D&D 3.5 y D&D 5E (2014)

## 6. Libros

- [x] 6.1 Crear `RpgBookPage` en `/rol/:sistema/:libro` (portada con visor,
      descripción, sistema y licencia efectiva enlazados, ediciones con la
      de castellano primero, botones dentro de `PurchaseLinks` con eventos
      de Umami, indicación de no oficial, no encontrado también si el libro
      no es de ese sistema); verificar con tests de página y con
      `expectAffiliateNotices`

## 7. Listado de la sección

- [x] 7.1 Crear la página `/rol` con los sistemas agrupados por familia,
      el enlace a `/licencias` y el listado de libros con filtros (sistema,
      licencia, en castellano), búsqueda sin tildes y orden por fecha o
      título; verificar con tests de página (orden por defecto, filtros
      combinados, filtro por licencia heredada y propia, búsqueda sin
      tildes, sin resultados)

## 8. Navegación, portada y prerenderizado

- [x] 8.1 Añadir «Otros juegos de rol» a la cabecera (escritorio y móvil)
      y la tarjeta con el número de sistemas y de libros a la portada;
      verificar con tests de `Header` y `HomePage`, y que el buscador de la
      cabecera no muestra libros de la sección
- [x] 8.2 Añadir a la página legal que la sección no es oficial de D&D,
      las marcas de terceros y NoSoloRol; verificar con un test
- [x] 8.3 Añadir `/rol`, `/licencias` y todas las fichas al sitemap, al
      prerenderizado (`entry-server.tsx` llena la caché de la sección) y a
      la precarga de `main.tsx`; verificar tras `just build` que existen
      `dist/rol.html`, `dist/licencias.html` y las fichas piloto con su
      contenido, su título y la vista previa del libro
- [x] 8.4 Comprobar en `just dev` el listado, una licencia, un sistema y un
      libro en escritorio y en móvil, en tema claro y oscuro, y que la
      hidratación no da avisos en la consola

## 9. Herramientas y documentación

- [x] 9.1 Crear la skill `add-rpg` con las reglas de datos, las fuentes,
      cómo verificar licencias y derivaciones y los pasos para licencias,
      sistemas y libros; verificar dando de alta con ella la primera ficha
      del lote 10.1
- [x] 9.2 Documentar la sección en `CLAUDE.md` (resumen del proyecto,
      capa de datos y rutas) y en el README; verificar con `just check`

## 10. Carga de datos

- [x] 10.1 Lote de sistemas grandes con sus licencias y libros principales
      (Pathfinder, Starfinder, Tales of the Valiant, Daggerheart y los que
      se aprueben en 1.2); verificar con `just check` y que el inventario no
      tiene pendientes de ese lote
- [x] 10.2 Lotes de libros en castellano, por editorial en el orden
      aprobado en 1.2; verificar igual que 10.1 en cada lote

## Workflow follow-up

- Actualizar #94 con el enlace a la PR y pasarla a «Midiendo» cuando se
  publique.
- Archivar el cambio cuando esté publicado (`/opsx:archive`).
