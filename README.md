# Catálogo Dungeons & Dragons

[![Deploy to GitHub Pages](https://github.com/logoff/catalogo-dnd/actions/workflows/deploy.yml/badge.svg)](https://github.com/logoff/catalogo-dnd/actions/workflows/deploy.yml)

<https://logoff.github.io/catalogo-dnd/>

Te encuentras en el repositorio del **Catálogo Dungeons & Dragons**,
que ofrece una lista completa de todos los libros y accesorios publicados
en inglés y en castellano de Dungeons & Dragons de las ediciones
5E (2014) y 5.5E (2024).

## Cómo poner en marcha el proyecto

### Requisitos

- [Node.js](https://nodejs.org/) 22+
- [just](https://just.systems/)
- [Docker](https://www.docker.com/) (opcional)

### Desarrollo local

```sh
just dev
```

Abrir <http://localhost:5173/>.

### Con Docker

```sh
just docker-run
```

Abrir <http://localhost:5173/>.

## Comandos disponibles

- `just dev` - Servidor de desarrollo
- `just build` - Construir para producción
- `just preview` - Previsualizar build
- `just docker-run` - Ejecutar con Docker
- `just deploy` - Publicar a GitHub Pages

## Analítica

El sitio publicado envía visitas a una instancia propia de
[Umami](https://umami.is/). El script se añade en el build solo si
están definidas las variables `VITE_UMAMI_URL` y
`VITE_UMAMI_WEBSITE_ID`. En el despliegue se leen de los secretos
del repositorio `UMAMI_URL` y `UMAMI_WEBSITE_ID`. En desarrollo local
no se envía nada.
