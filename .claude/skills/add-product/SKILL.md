---
name: add-product
description: Añadir un nuevo producto D&D al catálogo. Usa esta skill cuando el usuario quiera añadir un libro, accesorio o caja al catálogo.
argument-hint: "[código] [título] [edición]"
allowed-tools: Read, Write, Glob, Bash, Grep
---

# Añadir producto al catálogo D&D

El usuario quiere añadir un nuevo producto. Usa los argumentos y el
contexto de la conversación para rellenar el máximo de campos posible.
**Pregunta al usuario por cualquier dato que no puedas determinar.**

## Argumentos

`$ARGUMENTS`

## Pasos

### 1. Recopilar información

Necesitas estos datos. Los marcados con **(R)** son obligatorios; el
resto son opcionales pero debes intentar cubrirlos todos.

**Producto:**

- **code** (R): Código corto en mayúsculas (ej. "PHB", "VGM", "HOTB")

**Por cada publicación** (puede haber varias: inglés, castellano,
portada alternativa...):

- **type** (R): `book` | `boxed_set` | `accessory`
- **subtype** (R): Según type:
  - book (2014): `core_rules`, `supplemental_rules`, `setting`, `adventure`
  - book (2024): `core_rules`, `rules_expansion`, `player_expansion`,
    `dungeon_master_expansion`, `adventure_anthology`,
    `gameplay_expansion`, `adventure_expansion`
  - boxed_set: `starter_set`, `rules`, `adventure_setting`, `others`
  - accessory: `character_sheet`, `screen`
- **edition** (R): `5e` (para 2014) | `2024`
- **title** (R): Título completo de esta publicación
- **language**: `english` | `castellano`
- **date**: Fecha de publicación en formato ISO `YYYY-MM-DD`
- **item_code**: Código de producto WotC (ej. "D3709000")
- **authors**: Array de autores
- **pages**: Número de páginas (entero)
- **publisher**: Editorial (normalmente "Wizards of the Coast")
- **isbn13**: ISBN-13 como número entero (sin guiones)
- **images**: Array de rutas relativas (ver convención abajo)
- **official_url**: URL oficial del producto
- **wpn_url**: URL de Wizards Play Network
- **openlibrary_url**: URL de OpenLibrary
- **amazon_link**: URL de Amazon

**Sub-publicaciones** (solo para boxed_set con componentes):

- **title** (R): Nombre del componente
- **pages**: Número de páginas (opcional)
- **images**: Array de rutas de imagen (opcional)

### 2. Determinar ubicación del archivo

**Directorio base:** `data/{año}/products/` donde año es `2014` o `2024`
según la edición.

**Estructura de directorios por edición y tipo:**

```text
2014:
  01_books/
    01_core_rules/
    02_supplemental_rules/
    03_settings/
    04_adventures/
  02_boxed_sets/
    01_starter_sets/
    02_adventure_settings/
    03_others/

2024:
  01_books/
    01_core_rules/
    02_rules_expansion/
    03_player_expansion/
    04_dungeon_master_expansion/
    05_gameplay_expansion/
    06_adventure_anthology/
    07_adventure_expansion/
  02_accessories/
    01_screens/
    02_character_sheets/
  03_boxed_sets/
    01_starter_sets/
    03_others/
```

**Nombre del archivo:** `NNN_código.json` donde:

- `NNN` es el siguiente número secuencial de 3 dígitos dentro del
  subdirectorio (lista los archivos existentes para determinarlo)
- `código` es el code del producto en minúsculas

### 3. Convención de imágenes

Las imágenes van en `public/images/products/{año}/{código_minúsculas}/`

**Patrón de nombres:**

- `pub{P}_img{I}.{ext}` — Imagen I de la publicación P
- `pub{P}_sub{S}_img{I}.{ext}` — Imagen I de la sub-publicación S de
  la publicación P

Donde P, S, I son índices desde 0. Extensiones: `.jpg` o `.png`.

Si el usuario proporciona imágenes, crea el directorio. Si no las tiene
aún, usa las rutas correctas en el JSON igualmente y avisa al usuario
de que debe añadir las imágenes manualmente.

### 4. Crear el archivo JSON

Escribe el JSON siguiendo el esquema de `data/schemas/product.jsonschema`.
Usa 2 espacios de indentación. Asegúrate de que:

- Los campos requeridos (type, subtype, edition, title) están presentes
  en cada publicación
- Las fechas usan formato ISO `YYYY-MM-DD`
- isbn13 es un número entero, no string
- Las URLs son strings válidos
- El array images usa rutas relativas desde la raíz:
  `/images/products/{año}/{código}/pub0_img0.jpg`

### 5. Verificar

- Ejecuta `npm run build` para verificar que el producto se carga bien
- Comprueba que el número total de URLs en el sitemap ha aumentado

### Ejemplo de JSON completo

```json
{
  "code": "PHB",
  "publications": [
    {
      "type": "book",
      "subtype": "core_rules",
      "language": "english",
      "edition": "2024",
      "title": "Player's Handbook",
      "date": "2024-09-17",
      "item_code": "D3709000",
      "authors": ["Jeremy Crawford", "Christopher Perkins"],
      "pages": 384,
      "publisher": "Wizards of the Coast",
      "isbn13": 9780786969517,
      "images": [
        "/images/products/2024/phb/pub0_img0.jpg",
        "/images/products/2024/phb/pub0_img1.jpg"
      ],
      "official_url": "https://marketplace.dndbeyond.com/core-rules/3709000",
      "wpn_url": "https://wpn.wizards.com/en/products/2024-players-handbook",
      "amazon_link": "https://www.amazon.es/dp/0786969512"
    },
    {
      "type": "book",
      "subtype": "core_rules",
      "language": "castellano",
      "edition": "2024",
      "title": "Manual del Jugador",
      "date": "2025-03-28",
      "authors": ["Jeremy Crawford", "Christopher Perkins"],
      "pages": 384,
      "publisher": "Wizards of the Coast",
      "isbn13": 9780786969999,
      "images": [
        "/images/products/2024/phb/pub2_img0.jpg"
      ]
    }
  ]
}
```
