# Tasks

## 1. Modelo de datos

- [ ] 1.1 Añadir el campo `screenshots` a `data/schemas/videogame.jsonschema`
      (`image` con el patrón del diseño y `source` como URI, máximo seis,
      sin propiedades extra) y el tipo en `src/types/videogame.ts`;
      verificar con un test que una ficha con una captura válida pasa y
      una con siete capturas o sin `source` falla
- [ ] 1.2 Derivar la miniatura de cada captura en `videogameLoader.ts`
      (`-thumb.webp`); verificar con un test unitario de la ruta y de que
      la lista queda vacía si no hay capturas
- [ ] 1.3 Añadir a `videogameLoader.test.ts` los tests de datos: capturas
      sin repetir por juego y existencia de la imagen ampliada y de la
      miniatura en `public/`; verificar que `just test` pasa y que la
      comprobación falla con datos de prueba incorrectos

## 2. Script de capturas

- [ ] 2.1 Crear `scripts/download-screenshots.mjs` y la receta
      `just screenshots` con los modos `--steam` y `--source` del diseño (WebP de 1280 px y miniatura de 400 px con
      `sharp`, numeración desde el siguiente libre, máximo seis);
      verificar con _Baldur's Gate 3_ en modo `--steam` que crea seis
      pares de archivos y seis entradas, y que una segunda ejecución no
      pasa de seis
- [ ] 2.2 Revisar las capturas piloto de _Baldur's Gate 3_ y quitar las
      que no sean capturas del juego; verificar con `just test`

## 3. Ficha

- [ ] 3.1 Añadir a `ImageLightbox` la prop opcional `alts`; verificar con
      tests que usa esos textos y que sin ella sigue mostrando
      «Imagen N»
- [ ] 3.2 Crear `src/components/videogames/ScreenshotGallery.tsx` según el
      diseño (botones con miniatura, texto «Juego: captura N de M»,
      visor en el índice pulsado); verificar con tests de que pinta las
      miniaturas en orden, de que al pulsar la tercera el visor muestra
      la tercera captura ampliada y de que la flecha derecha y Escape
      funcionan
- [ ] 3.3 Añadir la sección «Capturas» a `VideogameDetail.tsx` tras
      «Vídeos», omitida si no hay capturas; verificar con tests de
      componente de un juego con capturas y otro sin ellas, y tras
      `just build` que `dist/videojuego/baldurs-gate-3.html` contiene
      las miniaturas con su texto alternativo
- [ ] 3.4 Comprobar en `just dev` que la galería se ve bien en escritorio
      y en móvil, que todas sus imágenes salen del propio sitio y que el
      visor funciona con ratón y teclado
- [ ] 3.5 Mencionar las capturas en el apartado de propiedad intelectual
      de `LegalPage.tsx`; verificar con un test de la página legal

## 4. Herramientas y documentación

- [ ] 4.1 Actualizar la skill `add-videogame` con las fuentes válidas de
      capturas, el criterio de «sin fuente oficial, nada» y el uso de
      `just screenshots`; verificar leyendo la skill
- [ ] 4.2 Documentar el campo `screenshots` y la receta nueva en
      `CLAUDE.md` y el README; verificar con `just check`

## 5. Carga de capturas

- [ ] 5.1 Lote de juegos con enlace a Steam, con `--steam` y revisando
      cada juego; verificar con `just check`
- [ ] 5.2 Lote de juegos con enlace a GOG y sin Steam, con capturas
      elegidas de su página; verificar con `just check`
- [ ] 5.3 Juegos sin tienda: web oficial o kit de prensa si existen;
      verificar con `just check` y anotar en la PR los juegos que quedan
      sin capturas

## Workflow follow-up

- Archivar `add-capturas-videojuegos` tras la revisión.
