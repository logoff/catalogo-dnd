# Utilidades comunes de los scripts de carga de novelas: ISBN, formatos y Tercera Fundación.
import html
import re
import time
import urllib.request

ISFDB = 'https://www.isfdb.org/cgi-bin/pl.cgi?'
UA = {'User-Agent': 'Mozilla/5.0'}


def to13(isbn):
    """ISBN-10 o ISBN-13 (con o sin guiones) a ISBN-13 entero."""
    s = re.sub(r'[^\dXx]', '', str(isbn)).upper()
    if len(s) == 13:
        return int(s)
    if len(s) != 10:
        raise ValueError(isbn)
    core = '978' + s[:9]
    total = sum(int(d) * (1 if i % 2 == 0 else 3) for i, d in enumerate(core))
    return int(core + str((10 - total % 10) % 10))


def valid13(isbn):
    try:
        v = str(to13(isbn))
    except Exception:
        return None
    total = sum(int(d) * (1 if i % 2 == 0 else 3) for i, d in enumerate(v[:12]))
    return int(v) if (10 - total % 10) % 10 == int(v[12]) else None


def isbn10(isbn13):
    """ISBN-13 (978) a ISBN-10, o None si empieza por 979."""
    s = str(isbn13)
    if not s.startswith('978'):
        return None
    core = s[3:12]
    check = (11 - sum(int(d) * (10 - i) for i, d in enumerate(core)) % 11) % 11
    return core + ('X' if check == 10 else str(check))


def fmt_tf(text):
    """Formato de Tercera Fundación ('Rústica - 12×20 cm', 'Edición digital'…) al del esquema."""
    t = text.lower()
    if 'digital' in t:
        return 'ebook'
    if 'tapa dura' in t or 'cartoné' in t:
        return 'hardcover'
    if 'bolsillo' in t:
        return 'mass_market'
    if 'rústica' in t:
        m = re.search(r'(\d+(?:,\d+)?)\s*×', t)
        if m and float(m.group(1).replace(',', '.')) < 12.5:
            return 'mass_market'
        return 'paperback'
    return None


# --- Tercera Fundación ---

def get(url):
    for _ in range(3):
        try:
            return urllib.request.urlopen(urllib.request.Request(url, headers=UA), timeout=30).read().decode('utf-8', 'replace')
        except Exception:
            time.sleep(2)
    return ''


def clean(s):
    return html.unescape(re.sub(r'<[^>]+>', '', s)).strip()


def field(pattern, block):
    m = re.search(pattern, block, re.S)
    return clean(m.group(1)) if m else ''


def editions(page):
    out = []
    for block in page.split('<div class="tf-libro-en-ficha">')[1:]:
        cover = re.search(r'src="(https://tercerafundacion.net/imagenes/portada/[^"?]+)', block)
        book = re.search(r'https://tercerafundacion.net/biblioteca/ver/libro/\d+', block)
        out.append({
            'year': field(r'tf-titulo-anio">\((.*?)\)', block),
            'title': field(r'tf-titulo-libro-edicion"><a [^>]*>(.*?)</a>', block),
            'publisher': field(r'Editorial:</span>\s*<a[^>]*>(.*?)</a>', block),
            'country': field(r'tf-editorial-pais">\((.*?)\)', block),
            'isbn': field(r'ISBN:</span>(.*?)</div>', block),
            'format': field(r'tf-formato">(.*?)</div>', block),
            'cover': cover.group(1) if cover else '',
            'url': book.group(0) if book else '',
        })
    return out


def ficha(fid):
    """Ediciones, títulos originales, autores y contraportada de una ficha."""
    page = get(f'https://tercerafundacion.net/biblioteca/ver/ficha/{fid}')
    head = page.split('Ediciones&nbsp;')[0]
    return {
        'ficha': fid,
        'editions': editions(page),
        'originals': [clean(o) for o in re.findall(r'tf-fuente-item"><a [^>]*>(.*?)</a>', page)],
        'authors': [html.unescape(a) for a in re.findall(r'class="tf-autor">([^<]+)<', head)],
        'blurb': field(r'Texto de contraportada/solapas:</span>(.*?)</div>', page),
    }
