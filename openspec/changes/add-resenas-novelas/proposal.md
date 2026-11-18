# Proposal

## Why

Las fichas de novela no dicen nada de si una novela merece la pena, y en
casi cinco décadas de novelas de D&D (619 fichas) hay mucha diferencia entre un
clásico de Salvatore y un relleno de serie. Las valoraciones de usuarios
no son una salida. Goodreads cerró su API en 2020 y no permite guardar
sus datos; Amazon exige la PA-API; StoryGraph no tiene API. Open Library
e ISFDB sí permiten reutilizar sus datos, pero tienen 0-2 votos por
novela. Sí hay dos señales fiables y citables: reseñas de medios para las
novelas más conocidas y la lista de superventas de The New York Times,
donde entraron muchas novelas de D&D.

## What Changes

- Campo opcional `reviews` en las novelas, con el mismo modelo que los
  libros de rol: medio de `data/review-outlets.json`, URL, idioma,
  fecha, autor y nota opcionales y resumen propio en castellano. No se
  calculan medias ni se emiten datos estructurados de valoración.
- **Sin cobertura obligatoria**: solo llevan reseñas las novelas que las
  tienen en un medio aceptado. Las reseñas de revistas de papel sin
  enlace legítimo (Dragon Magazine, Paperback Inferno) quedan fuera.
- Campo opcional `bestseller` con la primera semana en que la novela
  entró en la lista de superventas de The New York Times, la lista
  (tapa dura o bolsillo) y la fuente: el PDF de la lista semanal en
  hawes.com o, si no está ahí, otra fuente citable.
- La ficha de novela muestra la sección «Reseñas», con el mismo
  componente que los libros de rol, y una marca «Superventas de The New
  York Times» con la fecha y el enlace a la fuente.
- `just check-reviews` también vigila los enlaces de las reseñas de
  novelas. `just reviews-coverage` sigue siendo solo de los libros de
  rol.
- Carga inicial:
  - todas las novelas que entraron en la lista del NYT;
  - reseñas de los primeros libros de serie, la saga de Drizzt, las
    Crónicas y Leyendas de la Dragonlance y las novelas desde 2020, más
    las reseñas online que enlace ISFDB.
- Las skills `add-review` y `add-novel` se amplían a reseñas y
  superventas de novelas.

Fuera de alcance: valoraciones de usuarios de cualquier fuente, reseñas
de revistas en papel sin enlace, otras listas de superventas y filtros
del listado por reseñas o superventas.

## Capabilities

### New Capabilities

- `novel-reviews`: qué reseñas de medios y qué marca de superventas
  lleva cada novela, de qué fuentes, cómo se muestran en su ficha y cómo
  se vigilan los enlaces.

### Modified Capabilities

Ninguna. `novel-records` y `novel-detail-page` no cambian sus
requisitos; los campos y la sección nuevos son opcionales.

## Impact

- **Datos:** `data/schemas/novel.jsonschema` (`reviews`, `bestseller`)
  y las fichas de `data/novels/`. `data/review-outlets.json` puede
  ganar medios de literatura fantástica.
- **Código:** tipos de novela, `NovelDetail.tsx`, el componente de
  reseñas (que pasa de `src/components/products/` a un sitio común) y un
  módulo propio para los medios, para que la ficha de novela no cargue
  los datos de los productos. Tests en `novelLoader.test.ts`.
- **Scripts:** `scripts/reviews.mjs` y `scripts/check-reviews.mjs`.
- **Herramientas:** skills `add-review` y `add-novel`, `CLAUDE.md` y
  README.
- **Externo:** sin API ni clave. Las listas del NYT se leen de los PDF
  públicos de hawes.com.
