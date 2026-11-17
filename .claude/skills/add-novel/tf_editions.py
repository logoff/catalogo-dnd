# Lista las ediciones de una obra en Tercera Fundación a partir del HTML de su ficha
# (https://tercerafundacion.net/biblioteca/ver/ficha/<id>), descargado con curl:
#
#   curl -sL -A "Mozilla/5.0" https://tercerafundacion.net/biblioteca/ver/ficha/<id> -o ficha.html
#   python3 -I .claude/skills/add-novel/tf_editions.py ficha.html
#
# Una línea por edición: año | título | editorial | país | colección | ISBN | formato | portada | ficha
import html
import re
import sys


def field(pattern, block):
    match = re.search(pattern, block, re.S)
    return html.unescape(re.sub(r'<[^>]+>', '', match.group(1))).strip() if match else ''


text = open(sys.argv[1], encoding='utf-8').read()
for block in text.split('<div class="tf-libro-en-ficha">')[1:]:
    cover = re.search(r'src="(https://tercerafundacion.net/imagenes/portada/[^"?]+)', block)
    book = re.search(r'https://tercerafundacion.net/biblioteca/ver/libro/\d+', block)
    print(' | '.join([
        field(r'tf-titulo-anio">\((.*?)\)', block),
        field(r'tf-titulo-libro-edicion"><a [^>]*>(.*?)</a>', block),
        field(r'Editorial:</span>\s*<a[^>]*>(.*?)</a>', block),
        field(r'tf-editorial-pais">\((.*?)\)', block),
        field(r'Colección:</span>\s*<a[^>]*>(.*?)</a>', block),
        field(r'ISBN:</span>(.*?)</div>', block),
        field(r'tf-formato">(.*?)</div>', block),
        cover.group(1) if cover else '',
        book.group(0) if book else '',
    ]))
