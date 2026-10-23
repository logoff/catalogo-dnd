# Catálogo Dungeons & Dragons

[![Deploy](https://github.com/logoff/catalogo-dnd/actions/workflows/deploy.yml/badge.svg)](https://github.com/logoff/catalogo-dnd/actions/workflows/deploy.yml)

Te encuentras en el repositorio del **Catálogo Dungeons & Dragons**,
que ofrece una lista completa de todos los libros y accesorios publicados
en inglés y en castellano de Dungeons & Dragons de las ediciones
5E (2014) y 5.5E (2024).

**🌐 Consulta el catálogo en [catalogodnd.es](https://catalogodnd.es/)**

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
- `just deploy` - Publicar en Cloudflare Pages
- `just indexnow` - Avisar a Bing y otros buscadores (IndexNow) de todas las URLs del sitemap

## Despliegue

Cada push a `main` construye el sitio y lo publica en el proyecto
`catalogodnd` de Cloudflare Pages, que sirve `catalogodnd.es`.
`catalogodnd.com` redirige al `.es` con una regla de Cloudflare. El
workflow necesita los secretos del repositorio `CLOUDFLARE_API_TOKEN`
(permiso _Cloudflare Pages: Edit_) y `CLOUDFLARE_ACCOUNT_ID`.

La antigua dirección `logoff.github.io/catalogo-dnd/` sirve una página
que redirige cada ruta al dominio nuevo. Se publica ejecutando a mano
el workflow _Redirección desde GitHub Pages_.

## Enlaces de afiliado

Los botones de compra llevan ID de afiliado solo si están definidas
estas variables en el build. Si falta alguna, el enlace de esa tienda
se publica sin afiliado:

| Variable                                     | Uso                                             |
| -------------------------------------------- | ----------------------------------------------- |
| `VITE_AFFILIATE_AMAZON_TAG`                  | Tag de Amazon Afiliados                         |
| `VITE_AFFILIATE_ADTRACTION_CHANNEL`          | ID de canal en Adtraction (común a sus tiendas) |
| `VITE_AFFILIATE_GENERACION_X_PROGRAM`        | ID del programa de Generación X en Adtraction   |
| `VITE_AFFILIATE_JUEGOS_MESA_REDONDA_PROGRAM` | ID del programa de Juegos de la Mesa Redonda    |

En el despliegue se leen de los secretos del repositorio con el mismo
nombre sin el prefijo `VITE_`. En local se pueden poner en `.env`.

## Analítica

El sitio publicado mide visitas con [Umami](https://umami.is/). El
script se añade en el build solo si
están definidas las variables `VITE_UMAMI_URL` y
`VITE_UMAMI_WEBSITE_ID`. En el despliegue se leen de los secretos
del repositorio `UMAMI_URL` y `UMAMI_WEBSITE_ID`. En desarrollo local
no se envía nada.
