# Proposal

## Why

Las fichas de videojuegos ya tienen notas de agregadores, pero solo 11
de los 77 juegos publicados las llevan, y muchos de los que no la tienen
sí tienen página en Metacritic (al menos 15). Además, el esquema admite
notas sueltas de nueve medios, y eso choca con el orden del listado por
nota: un 10 de una revista pasaría por delante de una media de
Metacritic. Quedarse solo con los agregadores da notas comparables y
fáciles de mantener.

## What Changes

- **BREAKING (datos):** las notas solo pueden ser de Metacritic u
  OpenCritic. Meristation, Vandal, 3DJuegos, IGN, GameSpot, PC Gamer,
  Eurogamer, GameSpy y Computer Gaming World salen del esquema, de los
  tipos y de la spec. Hoy ningún juego las usa.
- Las notas se muestran como un dato citado: la cifra, el nombre del
  agregador en texto (sin logotipos) y el enlace a su página. No se
  copian reseñas ni listas de críticas.
- Carga de las notas de todos los juegos publicados que tengan página
  con nota en Metacritic u OpenCritic, incluidas las ediciones
  remasterizadas con página propia.
- Receta `just check-scores`, en Actions y sin bloquear, como
  `check-videos`. Avisa si la nota publicada en el agregador ya no
  coincide con la guardada o si el enlace ha dejado de existir.
- Las skills `add-videogame` y `novedades` se ajustan a las dos fuentes
  y a la nueva receta.

La sección «Notas» de la ficha, el componente que la pinta y el orden
del listado por nota no cambian.

Fuera de alcance: reseñas de medios con resumen, valoraciones de
usuarios de las tiendas (Steam, GOG, Amazon) y notas de revistas
antiguas.

## Capabilities

### New Capabilities

Ninguna.

### Modified Capabilities

- `videogame-records`: el requisito «Notas de medios» pasa a admitir
  solo Metacritic y OpenCritic, con la nota como dato citado y enlazado,
  y se añade la vigilancia de las notas guardadas.

## Impact

- **Datos:** `data/schemas/videogame.jsonschema` (fuentes de `reviews`)
  y las fichas de `data/videogames/games/`.
- **Código:** `ReviewSource` en `src/types/videogame.ts` y
  `reviewSourceNames` en `src/utils/videogameTranslations.ts`.
- **Build y CI:** `scripts/check-scores.mjs`, una receta en el
  `justfile` y un paso no bloqueante en `.github/workflows/test.yml`.
- **Herramientas:** skills `add-videogame` y `novedades`, `CLAUDE.md` y
  README.
- **Externo:** sin API ni clave. La comprobación lee la nota del JSON-LD
  (`aggregateRating`) de las páginas públicas de los dos agregadores.
