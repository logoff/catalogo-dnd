# Tasks

## 1. Modelo de datos

- [ ] 1.1 Añadir el campo `videos` a `data/schemas/videogame.jsonschema`
      (identificador, `kind`, `title`, `channel`, `date`, máximo tres,
      sin propiedades extra) y el tipo en `src/types/videogame.ts`;
      verificar con un test que una ficha con un vídeo válido pasa y una
      con cuatro vídeos o sin `channel` falla
- [ ] 1.2 Derivar la ruta de la miniatura
      (`/images/videogames/<slug>/video-<id>.jpg`) en `videogameLoader.ts`;
      verificar con un test unitario de la ruta
- [ ] 1.3 Añadir a `videogameLoader.test.ts` los tests de datos: identificador
      de vídeo único por juego y miniatura existente en `public/`; verificar que
      `just test` pasa y que fallan con una ficha de prueba incorrecta

## 2. Miniaturas

- [ ] 2.1 Crear `scripts/download-video-thumbnails.mjs` y la receta
      `just video-thumbnails`, que descarga las miniaturas que falten
      (`maxresdefault.jpg` y, si no existe, `hqdefault.jpg`) sin tocar
      las que ya están; verificar ejecutándolo dos veces sobre la ficha
      piloto de 2.2 y comprobando que la segunda no descarga nada
- [ ] 2.2 Añadir a _Baldur's Gate 3_ su tráiler de lanzamiento oficial
      como ficha piloto, con su miniatura; verificar con `just test`

## 3. Ficha

- [ ] 3.1 Crear `src/components/videogames/YouTubeVideo.tsx` según el
      diseño (enlace con miniatura local que se convierte en `iframe` de
      `youtube-nocookie.com` al pulsar, foco al reproductor, `title` y
      `referrerPolicy`); verificar con tests de que el primer render no
      contiene ningún `iframe` ni URL de `ytimg`/`youtube-nocookie`, que
      el enlace apunta a `youtube.com/watch?v=` y que al pulsar (ratón y
      teclado) aparece el `iframe` con `autoplay=1`
- [ ] 3.2 Añadir la sección «Vídeos» a `VideogameDetail.tsx` entre la
      cabecera y «Ediciones», con título y canal de cada vídeo, y
      omitirla si no hay vídeos; verificar con tests de componente de un
      juego con vídeos y otro sin ellos
- [ ] 3.3 Emitir los `VideoObject` en JSON-LD desde la ficha; verificar
      con un test del contenido del script y, tras `just build`, que
      `dist/videojuego/baldurs-gate-3.html` contiene la miniatura, el
      título y el `VideoObject`
- [ ] 3.4 Comprobar en `just dev` con la pestaña de red del navegador
      que la ficha de _Baldur's Gate 3_ no pide nada a dominios de
      YouTube o Google hasta pulsar reproducir, y que después el vídeo
      se reproduce (escritorio y móvil)
- [ ] 3.5 Añadir el aviso sobre YouTube en el apartado de privacidad de
      `LegalPage.tsx`; verificar que la página legal lo muestra

## 4. Vigilancia

- [ ] 4.1 Crear `scripts/check-videos.mjs` y la receta
      `just check-videos` según el diseño (oembed, aviso por vídeo
      retirado, no empotrable o de otro canal, aviso único sin red,
      formato `::warning` en Actions, código de salida siempre 0);
      verificar con la ficha piloto y con un identificador inventado en
      una ficha temporal
- [ ] 4.2 Añadir el paso `just check-videos` (o su comando `npm`) a
      `.github/workflows/test.yml` con `continue-on-error: true`;
      verificar en la PR que aparece la anotación con un vídeo
      inexistente y que el workflow termina en verde

## 5. Herramientas y documentación

- [ ] 5.1 Actualizar la skill `add-videogame` para que busque vídeos
      oficiales (con la lista de canales válidos), rellene `videos` y
      ejecute `just video-thumbnails` y `just check-videos`; verificar
      leyendo la skill que cubre los cinco campos y el criterio de
      «sin vídeo oficial, nada»
- [ ] 5.2 Actualizar la skill `novedades` para que vigile tráileres
      nuevos de los juegos anunciados o recientes y ejecute
      `just check-videos`; verificar leyendo la skill
- [ ] 5.3 Documentar el campo `videos`, las miniaturas y las dos recetas
      nuevas en `CLAUDE.md` y el README; verificar con `just check`
      (markdownlint y Prettier)

## 6. Carga de vídeos

- [ ] 6.1 Lote de juegos de 2020: añadir los vídeos oficiales que haya y
      sus miniaturas; verificar con `just check` y `just check-videos`
      sin avisos
- [ ] 6.2 Lote de juegos de 2010; verificar igual que 6.1
- [ ] 6.3 Lote de juegos de 2000 y anteriores (sobre todo
      remasterizaciones y relanzamientos); verificar igual que 6.1

## Workflow follow-up

- Archivar `add-videos-videojuegos` tras la revisión; las capturas de
  pantalla van en un cambio aparte.
