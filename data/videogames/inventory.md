# Inventario de videojuegos oficiales de D&D

Lista maestra de los videojuegos que tendrán ficha en el catálogo. Sirve
para medir lo que falta: un juego con «pendiente» en la columna Ficha aún
no tiene su JSON en `data/videogames/games/`.

Actualizado: 2026-11-12.

## Fuentes

- **W:** [List of _Dungeons & Dragons_ video games][wiki], Wikipedia en
  inglés (texto del 2026-11-12).
- **G:** catálogo de GOG (API `catalog.gog.com`, mercado España).
- **S:** tienda de Steam (API `storesearch` y `appdetails`, mercado
  España).
- **N:** noticias y páginas oficiales citadas en la nota del juego.

No se ha podido cruzar con MobyGames (la web bloquea las consultas
automáticas). Queda como revisión manual pendiente para encontrar juegos
que falten.

[wiki]: https://en.wikipedia.org/wiki/List_of_Dungeons_%26_Dragons_video_games

## Leyenda

- **Venta hoy:** dónde se puede comprar o jugar hoy. «Recopilación»
  significa que se vende dentro de un pack (indicado en la nota).
  «No» significa que no aparece en GOG ni en Steam; puede venderse en
  otras tiendas o en formato físico de segunda mano, y se comprueba al
  hacer la ficha.
- **Estado:** `a la venta`, `no a la venta`, `cerrado` (juego online sin
  servidores), `anunciado` (aún no publicado).

## Juegos con ficha

### Reinos Olvidados

| #   | Juego                                            | Año  | Plataformas originales                | Venta hoy                 | Estado        | Fuente | Ficha                                      | Nota                                                                                                                                                                                                                                                  |
| --- | ------------------------------------------------ | ---- | ------------------------------------- | ------------------------- | ------------- | ------ | ------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | Pool of Radiance                                 | 1988 | Ordenadores domésticos, NES           | GOG, Steam (recopilación) | a la venta    | W G S  | pool-of-radiance                           | Gold Box. En _The Archives – Collection Two_.                                                                                                                                                                                                         |
| 2   | Hillsfar                                         | 1989 | Ordenadores domésticos, NES           | Steam (recopilación)      | a la venta    | W S    | hillsfar                                   | En _The Archives – Collection Two_ (Steam); comprobar GOG.                                                                                                                                                                                            |
| 3   | Curse of the Azure Bonds                         | 1989 | Ordenadores domésticos                | Steam (recopilación)      | a la venta    | W S    | curse-of-the-azure-bonds                   | Gold Box. Recopilación por confirmar.                                                                                                                                                                                                                 |
| 4   | Secret of the Silver Blades                      | 1990 | Ordenadores domésticos                | Steam (recopilación)      | a la venta    | W S    | secret-of-the-silver-blades                | Gold Box. Recopilación por confirmar.                                                                                                                                                                                                                 |
| 5   | Eye of the Beholder                              | 1990 | Ordenadores domésticos, Sega CD, SNES | GOG, Steam (recopilación) | a la venta    | W G S  | eye-of-the-beholder                        | En _The Archives – Collection One_. Steam indica castellano.                                                                                                                                                                                          |
| 6   | Eye of the Beholder II: The Legend of Darkmoon   | 1991 | Ordenadores domésticos                | GOG, Steam (recopilación) | a la venta    | W G S  | eye-of-the-beholder-ii                     | En _The Archives – Collection One_. Steam indica castellano.                                                                                                                                                                                          |
| 7   | Pools of Darkness                                | 1991 | Ordenadores domésticos                | Steam (recopilación)      | a la venta    | W S    | pools-of-darkness                          | Gold Box. Recopilación por confirmar.                                                                                                                                                                                                                 |
| 8   | Gateway to the Savage Frontier                   | 1991 | Ordenadores domésticos                | GOG, Steam (recopilación) | a la venta    | W G S  | gateway-to-the-savage-frontier             | Gold Box. En _The Archives – Collection Two_.                                                                                                                                                                                                         |
| 9   | Treasures of the Savage Frontier                 | 1992 | MS-DOS, Amiga                         | GOG, Steam (recopilación) | a la venta    | W G S  | treasures-of-the-savage-frontier           | Gold Box. En _The Archives – Collection Two_.                                                                                                                                                                                                         |
| 10  | Eye of the Beholder III: Assault on Myth Drannor | 1993 | MS-DOS, PC-98                         | GOG, Steam (recopilación) | a la venta    | W G S  | eye-of-the-beholder-iii                    | En _The Archives – Collection One_.                                                                                                                                                                                                                   |
| 11  | Forgotten Realms: Unlimited Adventures           | 1993 | MS-DOS, Mac                           | GOG, Steam (recopilación) | a la venta    | W G S  | forgotten-realms-unlimited-adventures      | Editor de aventuras Gold Box. En _The Archives – Collection Two_.                                                                                                                                                                                     |
| 12  | Dungeon Hack                                     | 1993 | MS-DOS                                | GOG, Steam (recopilación) | a la venta    | W G S  | dungeon-hack                               | En _The Archives – Collection Three_.                                                                                                                                                                                                                 |
| 13  | Menzoberranzan                                   | 1994 | MS-DOS                                | GOG, Steam (recopilación) | a la venta    | W G S  | menzoberranzan                             | En _The Archives – Collection Three_.                                                                                                                                                                                                                 |
| 14  | Blood & Magic                                    | 1996 | MS-DOS                                | No                        | no a la venta | W      | blood-and-magic                            |                                                                                                                                                                                                                                                       |
| 15  | Descent to Undermountain                         | 1998 | MS-DOS, Windows                       | No                        | no a la venta | W      | descent-to-undermountain                   |                                                                                                                                                                                                                                                       |
| 16  | Baldur's Gate                                    | 1998 | Windows, Mac                          | GOG, Steam                | a la venta    | W G S  | baldurs-gate                               | Expansión _Tales of the Sword Coast_ (1999). Edición _Enhanced Edition_ (2012) con DLC _Siege of Dragonspear_ (2016), _Faces of Good and Evil_ y _Reflections of Myth & Valor_ (2025).                                                                |
| 17  | Icewind Dale                                     | 2000 | Windows, Mac                          | GOG, Steam                | a la venta    | W G S  | icewind-dale                               | Expansiones _Heart of Winter_ (2001) y _Trials of the Luremaster_ (2001). Edición _Enhanced Edition_ (2014).                                                                                                                                          |
| 18  | Baldur's Gate II: Shadows of Amn                 | 2000 | Windows, Mac                          | GOG, Steam                | a la venta    | W G S  | baldurs-gate-ii                            | Expansión _Throne of Bhaal_ (2001). Edición _Enhanced Edition_ (2013) con DLC _Reflections of Myth & Valor_ (2025).                                                                                                                                   |
| 19  | Pool of Radiance: Ruins of Myth Drannor          | 2001 | Windows                               | GOG, Steam                | a la venta    | W G S  | pool-of-radiance-ruins-of-myth-drannor     | Relanzado en GOG y Steam el 2026-11-06.                                                                                                                                                                                                               |
| 20  | Baldur's Gate: Dark Alliance                     | 2001 | PS2, Xbox, GameCube, GBA              | GOG, Steam                | a la venta    | W G S  | baldurs-gate-dark-alliance                 | Relanzamiento en PC y consolas (2021).                                                                                                                                                                                                                |
| 21  | Neverwinter Nights                               | 2002 | Windows, Mac, Linux                   | GOG, Steam                | a la venta    | W G S  | neverwinter-nights                         | Expansiones _Shadows of Undrentide_ (2003) y _Hordes of the Underdark_ (2003); módulos premium (2004–2006); _Enhanced Edition_ (2018) con DLC _Darkness Over Daggerford_, _Tyrants of the Moonsea_, _Dark Dreams of Furiae_ y _Doom of Icewind Dale_. |
| 22  | Icewind Dale II                                  | 2002 | Windows                               | GOG                       | a la venta    | W G    | icewind-dale-ii                            | En GOG como _Icewind Dale 2 Complete_.                                                                                                                                                                                                                |
| 23  | Dungeons & Dragons: Eye of the Beholder          | 2002 | Game Boy Advance                      | No                        | no a la venta | W      | eye-of-the-beholder-gba                    | Juego distinto del de 1990.                                                                                                                                                                                                                           |
| 24  | Baldur's Gate: Dark Alliance II                  | 2004 | PS2, Xbox                             | GOG, Steam                | a la venta    | W G S  | baldurs-gate-dark-alliance-ii              | Relanzamiento en PC y consolas (2022).                                                                                                                                                                                                                |
| 25  | Forgotten Realms: Demon Stone                    | 2004 | Windows, PS2, Xbox                    | GOG, Steam                | a la venta    | W G S  | demon-stone                                | Steam indica castellano.                                                                                                                                                                                                                              |
| 26  | Neverwinter Nights 2                             | 2006 | Windows, Mac                          | GOG, Steam                | a la venta    | W G S  | neverwinter-nights-2                       | Expansiones _Mask of the Betrayer_ (2007), _Storm of Zehir_ (2008) y _Mysteries of Westgate_ (2009). _Enhanced Edition_ (2025).                                                                                                                       |
| 27  | Dungeons & Dragons: Daggerdale                   | 2011 | PS3, Xbox 360, Windows                | Steam                     | a la venta    | W S    | daggerdale                                 | Steam indica castellano.                                                                                                                                                                                                                              |
| 28  | Neverwinter                                      | 2013 | Windows, Xbox One, PS4                | Steam                     | a la venta    | W S    | neverwinter                                | MMO gratuito.                                                                                                                                                                                                                                         |
| 29  | D&D Lords of Waterdeep                           | 2013 | iOS, Android                          | Steam                     | a la venta    | W S    | lords-of-waterdeep                         | Adaptación del juego de mesa. Expansiones _Undermountain_ y _Skullport_.                                                                                                                                                                              |
| 30  | Sword Coast Legends                              | 2015 | Windows, OS X, Linux, PS4, Xbox One   | No                        | no a la venta | W      | sword-coast-legends                        | Retirado de la venta.                                                                                                                                                                                                                                 |
| 31  | Idle Champions of the Forgotten Realms           | 2017 | Windows, Mac, iOS, Android, PS4, Xbox | Steam                     | a la venta    | W S    | idle-champions                             | Gratuito.                                                                                                                                                                                                                                             |
| 32  | Tales from Candlekeep: Tomb of Annihilation      | 2017 | Windows, Mac                          | No                        | no a la venta | W      | tales-from-candlekeep-tomb-of-annihilation |                                                                                                                                                                                                                                                       |
| 33  | Dungeons & Dragons: Dark Alliance                | 2021 | Windows, PS4, PS5, Xbox One, Series   | No (por verificar)        | por verificar | W      | dungeons-and-dragons-dark-alliance         | No aparece en la búsqueda de Steam; comprobar si se ha retirado.                                                                                                                                                                                      |
| 34  | Baldur's Gate 3                                  | 2023 | Windows, macOS, PS5, Xbox Series      | GOG, Steam                | a la venta    | W G S  | baldurs-gate-3                             |                                                                                                                                                                                                                                                       |
| 35  | Neverwinter Nights (AOL)                         | 1991 | Ordenadores domésticos                | —                         | cerrado       | W      | neverwinter-nights-aol                     | Juego online; cerró en 1997.                                                                                                                                                                                                                          |
| 36  | Neverwinter Nights: Mobile                       | 2004 | Teléfonos móviles                     | —                         | cerrado       | W      | neverwinter-nights-mobile                  | Retirado hacia 2011.                                                                                                                                                                                                                                  |
| 37  | Dungeons & Dragons: Tiny Adventures              | 2008 | Facebook                              | —                         | cerrado       | W      | tiny-adventures                            | Cerró en 2010.                                                                                                                                                                                                                                        |
| 38  | Heroes of Neverwinter                            | 2011 | Facebook                              | —                         | cerrado       | W      | heroes-of-neverwinter                      | Cerró en 2012.                                                                                                                                                                                                                                        |
| 39  | Dungeons & Dragons: Arena of War                 | 2013 | iOS, Android                          | —                         | cerrado       | W      | arena-of-war                               | Cerró en 2014.                                                                                                                                                                                                                                        |
| 40  | Warriors of Waterdeep                            | 2019 | Android, iOS                          | —                         | cerrado       | W      | warriors-of-waterdeep                      | Cerró en 2022.                                                                                                                                                                                                                                        |

### Dragonlance

| #   | Juego                   | Año  | Plataformas originales                     | Venta hoy                 | Estado        | Fuente | Ficha                   | Nota                                             |
| --- | ----------------------- | ---- | ------------------------------------------ | ------------------------- | ------------- | ------ | ----------------------- | ------------------------------------------------ |
| 41  | Heroes of the Lance     | 1988 | Ordenadores domésticos, NES, Master System | Steam                     | a la venta    | W S    | heroes-of-the-lance     |                                                  |
| 42  | Dragons of Flame        | 1989 | Ordenadores domésticos, NES                | Steam                     | a la venta    | W S    | dragons-of-flame        |                                                  |
| 43  | War of the Lance        | 1989 | Ordenadores domésticos                     | Steam                     | a la venta    | W S    | war-of-the-lance        |                                                  |
| 44  | DragonStrike            | 1990 | Ordenadores domésticos                     | Steam                     | a la venta    | W S    | dragonstrike            | Simulador de vuelo en dragón.                    |
| 45  | DragonStrike (NES)      | 1992 | NES                                        | No                        | no a la venta | W      | dragonstrike-nes        | Juego distinto del de PC.                        |
| 46  | Champions of Krynn      | 1990 | Ordenadores domésticos                     | GOG, Steam (recopilación) | a la venta    | W G S  | champions-of-krynn      | Gold Box. En _Dungeons & Dragons: Krynn Series_. |
| 47  | Death Knights of Krynn  | 1991 | Ordenadores domésticos                     | GOG, Steam (recopilación) | a la venta    | W G S  | death-knights-of-krynn  | Gold Box. En _Dungeons & Dragons: Krynn Series_. |
| 48  | Shadow Sorcerer         | 1991 | Ordenadores domésticos                     | Steam                     | a la venta    | W S    | shadow-sorcerer         |                                                  |
| 49  | The Dark Queen of Krynn | 1992 | Ordenadores domésticos                     | GOG, Steam (recopilación) | a la venta    | W G S  | the-dark-queen-of-krynn | Gold Box. En _Dungeons & Dragons: Krynn Series_. |

### Mystara

| #   | Juego                                           | Año  | Plataformas originales | Venta hoy | Estado        | Fuente | Ficha                       | Nota                                                                                            |
| --- | ----------------------------------------------- | ---- | ---------------------- | --------- | ------------- | ------ | --------------------------- | ----------------------------------------------------------------------------------------------- |
| 50  | Dungeons & Dragons: Order of the Griffon        | 1992 | TurboGrafx-16          | No        | no a la venta | W      | order-of-the-griffon        |                                                                                                 |
| 51  | Dungeons & Dragons: Warriors of the Eternal Sun | 1992 | Mega Drive             | No        | no a la venta | W      | warriors-of-the-eternal-sun |                                                                                                 |
| 52  | Fantasy Empires                                 | 1993 | MS-DOS                 | Steam     | a la venta    | W S    | fantasy-empires             |                                                                                                 |
| 53  | Dungeons & Dragons: Tower of Doom               | 1994 | Recreativa, Saturn     | Steam     | a la venta    | W S    | tower-of-doom               | Edición en _Chronicles of Mystara_ (2013, PC y consolas), que Steam da con voces en castellano. |
| 54  | Dungeons & Dragons: Shadow over Mystara         | 1996 | Recreativa, Saturn     | Steam     | a la venta    | W S    | shadow-over-mystara         | Edición en _Chronicles of Mystara_ (2013).                                                      |

### Sol Oscuro

| #   | Juego                          | Año  | Plataformas originales | Venta hoy                 | Estado     | Fuente | Ficha                        | Nota                                      |
| --- | ------------------------------ | ---- | ---------------------- | ------------------------- | ---------- | ------ | ---------------------------- | ----------------------------------------- |
| 55  | Dark Sun: Shattered Lands      | 1993 | MS-DOS                 | GOG, Steam (recopilación) | a la venta | W G S  | dark-sun-shattered-lands     | En _Dungeons & Dragons: Dark Sun Series_. |
| 56  | Dark Sun: Wake of the Ravager  | 1994 | MS-DOS                 | GOG, Steam (recopilación) | a la venta | W G S  | dark-sun-wake-of-the-ravager | En _Dungeons & Dragons: Dark Sun Series_. |
| 57  | Dark Sun Online: Crimson Sands | 1996 | Windows                | —                         | cerrado    | W      | dark-sun-online              | MMO.                                      |

### Ravenloft

| #   | Juego                               | Año  | Plataformas originales    | Venta hoy                 | Estado        | Fuente | Ficha                        | Nota                                                    |
| --- | ----------------------------------- | ---- | ------------------------- | ------------------------- | ------------- | ------ | ---------------------------- | ------------------------------------------------------- |
| 58  | Ravenloft: Strahd's Possession      | 1994 | MS-DOS                    | GOG, Steam (recopilación) | a la venta    | W G S  | ravenloft-strahds-possession | En _Dungeons & Dragons: Ravenloft Series_.              |
| 59  | Ravenloft: Stone Prophet            | 1995 | MS-DOS                    | GOG, Steam (recopilación) | a la venta    | W G S  | ravenloft-stone-prophet      | En _Dungeons & Dragons: Ravenloft Series_.              |
| 60  | Iron & Blood: Warriors of Ravenloft | 1996 | MS-DOS, PlayStation       | No                        | no a la venta | W      | iron-and-blood               |                                                         |
| 61  | Warlock: Dungeons & Dragons         | 2027 | Windows, PS5, Xbox Series | —                         | anunciado     | W S    | warlock-dungeons-and-dragons | Editora: Wizards of the Coast. Steam indica castellano. |

### Planescape, Greyhawk y Eberron

| #   | Juego                           | Año  | Plataformas originales | Venta hoy  | Estado        | Fuente | Ficha                        | Nota                                           |
| --- | ------------------------------- | ---- | ---------------------- | ---------- | ------------- | ------ | ---------------------------- | ---------------------------------------------- |
| 62  | Planescape: Torment             | 1999 | Windows                | GOG, Steam | a la venta    | W G S  | planescape-torment           | Planescape. Edición _Enhanced Edition_ (2017). |
| 63  | Dungeons & Dragons: Heroes      | 2003 | Xbox                   | No         | no a la venta | W      | dungeons-and-dragons-heroes  | Greyhawk.                                      |
| 64  | The Temple of Elemental Evil    | 2003 | Windows                | GOG, Steam | a la venta    | W G S  | the-temple-of-elemental-evil | Greyhawk.                                      |
| 65  | Dungeons & Dragons: Dragonshard | 2005 | Windows                | GOG, Steam | a la venta    | W G S  | dragonshard                  | Eberron. Steam indica castellano.              |
| 66  | Dungeons & Dragons Online       | 2006 | Windows                | Steam      | a la venta    | W S    | dungeons-and-dragons-online  | Eberron (y Reinos Olvidados). MMO gratuito.    |

### Otros mundos y sin mundo

| #   | Juego                                           | Año  | Plataformas originales | Venta hoy  | Estado        | Fuente | Ficha                        | Nota                                                                                                |
| --- | ----------------------------------------------- | ---- | ---------------------- | ---------- | ------------- | ------ | ---------------------------- | --------------------------------------------------------------------------------------------------- |
| 67  | Advanced Dungeons & Dragons: Cloudy Mountain    | 1982 | Intellivision          | No         | no a la venta | W      | cloudy-mountain              |                                                                                                     |
| 68  | Advanced Dungeons & Dragons: Treasure of Tarmin | 1982 | Intellivision          | No         | no a la venta | W      | treasure-of-tarmin           |                                                                                                     |
| 69  | Spelljammer: Pirates of Realmspace              | 1992 | MS-DOS                 | GOG, Steam | a la venta    | W G S  | spelljammer                  | Spelljammer.                                                                                        |
| 70  | Stronghold                                      | 1993 | MS-DOS                 | GOG        | a la venta    | W G    | stronghold                   | En GOG como _D&D Stronghold: Kingdom Simulator_ (no confundir con la saga _Stronghold_ de Firefly). |
| 71  | Al-Qadim: The Genie's Curse                     | 1994 | MS-DOS                 | GOG, Steam | a la venta    | W G S  | al-qadim                     | Al-Qadim. Steam indica castellano.                                                                  |
| 72  | Slayer                                          | 1994 | 3DO                    | No         | no a la venta | W      | slayer                       |                                                                                                     |
| 73  | DeathKeep                                       | 1996 | Windows, 3DO           | Steam      | a la venta    | W S    | deathkeep                    |                                                                                                     |
| 74  | Birthright: The Gorgon's Alliance               | 1996 | MS-DOS                 | No         | no a la venta | W      | birthright                   | Birthright. Los «Birthright» de Steam son otros juegos.                                             |
| 75  | Dungeons & Dragons Tactics                      | 2007 | PSP                    | No         | no a la venta | W      | dungeons-and-dragons-tactics |                                                                                                     |
| 76  | Demeo x Dungeons & Dragons: Battlemarked        | 2025 | Windows, PS5, Switch 2 | Steam      | a la venta    | S N    | demeo-battlemarked           | No está en Wikipedia. Steam indica castellano.                                                      |
| 77  | Dungeons & Dragons: Long Rest Tavern            | 2027 | Windows                | —          | anunciado     | S      | long-rest-tavern             | Gestión de taberna (Homo Ludens / Dotemu). No está en Wikipedia. Steam indica castellano.           |

Total: **77 juegos**: 68 publicados (uno con la venta por verificar),
7 cerrados y 2 anunciados.

## Dentro de otra ficha (no tienen ficha propia)

Expansiones, DLC, ediciones y relanzamientos que van en la ficha del
juego base:

- _Baldur's Gate_: _Tales of the Sword Coast_, _Enhanced Edition_,
  _Siege of Dragonspear_, _Faces of Good and Evil_, _Reflections of Myth
  & Valor_.
- _Baldur's Gate II_: _Throne of Bhaal_, _Enhanced Edition_,
  _Reflections of Myth & Valor_.
- _Icewind Dale_: _Heart of Winter_, _Trials of the Luremaster_,
  _Enhanced Edition_.
- _Neverwinter Nights_: _Shadows of Undrentide_, _Hordes of the
  Underdark_, módulos premium (_Shadowguard_, _Witch's Wake_,
  _Kingmaker_, _Pirates of the Sword Coast_, _Infinite Dungeons_,
  _Wyvern Crown of Cormyr_), _Enhanced Edition_ y sus DLC.
- _Neverwinter Nights 2_: _Mask of the Betrayer_, _Storm of Zehir_,
  _Mysteries of Westgate_, _Enhanced Edition_.
- _Planescape: Torment_: _Enhanced Edition_.
- _Tower of Doom_ y _Shadow over Mystara_: _Chronicles of Mystara_.
- _D&D Lords of Waterdeep_: _Undermountain_ y _Skullport_.

## Recopilaciones (sin ficha propia)

Se usan solo como enlace de compra de los juegos que contienen:

- A la venta: _Forgotten Realms: The Archives_ (Collection One, Two y
  Three), _Dungeons & Dragons: Krynn Series_, _Dark Sun Series_ y
  _Ravenloft Series_ (GOG y Steam); _Neverwinter Nights 1 + 2 Enhanced
  Collection_ (GOG).
- Históricas, según Wikipedia: _AD&D Limited Edition Collector's Set_
  (1990), _AD&D Collector's Edition_ (1994), _AD&D Collector's Edition
  Vol. 3_ (1994), _Fantasy Fest!_ (1994), _AD&D Eye of the Beholder
  Trilogy_ (1995), _AD&D Ultimate Fantasy_ (1995), _AD&D Masterpiece
  Collection_ (1996), _The Forgotten Realms Archives_ (1997), _Dungeons &
  Dragons Collection_ (Saturn, 1999), _Gamefest: Forgotten Realms
  Classics_ (2001), _Neverwinter Nights Gold_ (2003), _Platinum_ (2004)
  y _Diamond_ (2005), _Atari Collection: Rollenspiele_ (2005), _Ultimate
  Dungeons & Dragons_ (2005), _The Forgotten Realms Deluxe Edition_
  (2006), _Dungeons & Dragons Anthology: The Master Collection_ (2011) y
  _Dungeons & Dragons: Neverwinter Nights Complete_ (2011).

## Fuera del alcance

- _Dungeons & Dragons Computer Fantasy Game_ (Mattel, 1981): juego
  electrónico portátil de pantalla LCD; fuera por la misma decisión que
  los juegos electrónicos de mesa.
- Islas de Fortnite con temática de D&D (2026): las crean creadores de
  Fortnite, no son un juego oficial.
- _Magic: The Gathering_ (expansión _Adventures in the Forgotten
  Realms_): es un juego de cartas de otra marca.
- Juegos con las reglas del SRD sin licencia de la marca (por ejemplo,
  _Solasta_).
- Colaboraciones oficiales de D&D dentro de juegos de otras marcas: el
  DLC _Dungeons & Dragons_ de _Minecraft_ (2023) y el capítulo _Dungeons
  & Dragons_ de _Dead by Daylight_ (2024). No son juegos de D&D; se
  pueden mencionar en una guía.

## Revisión

- 2026-11-12: cotejado con la lista de Wikipedia. De sus 98 juegos (sin
  contar recopilaciones), 75 tienen ficha, 22 van dentro de otra ficha
  (15 expansiones y 7 ediciones mejoradas) y 1 queda fuera del alcance.
  En recreativa solo hay dos juegos de D&D, los de Capcom (_Tower of
  Doom_ y _Shadow over Mystara_), y los dos están. Aprobado por el
  usuario.
