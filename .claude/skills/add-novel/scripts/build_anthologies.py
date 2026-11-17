# Escribe data/novels/anthologies.json a partir de un lote de antologías:
#   meta.py         META = {título: (id, mundos, series, descripción)}
#   isfdb.txt       título@@id ISFDB@@fecha~editorial~isbn~formato~portada;...   (ediciones en inglés)
#   tf_anth.json    {título: {ficha, editions, originals} | null}       (Tercera Fundación)
#   amazon.json     {isbn13: asin} y cdl.json {isbn13: url}              (opcionales)
# Deja en covers.json los pares <clave>=<url> de cada antología para `just novel-covers --anthology`.
# Uso: python3 -I build_anthologies.py <dir_lote>
import json
import os
import sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from novellib import fmt_tf, valid13  # noqa: E402

lot = sys.argv[1]
sys.path.insert(0, lot)
from meta import META  # noqa: E402

FMT = {'pb': 'mass_market', 'tp': 'paperback', 'hc': 'hardcover', 'ebook': 'ebook'}
PUB = {'WotC': 'Wizards of the Coast', 'New Infinities Productions / Ace': 'Ace Books'}
tf = json.load(open(f'{lot}/tf_anth.json'))
load = lambda n: json.load(open(f'{lot}/{n}')) if os.path.exists(f'{lot}/{n}') else {}  # noqa: E731
amazon, cdl = load('amazon.json'), load('cdl.json')
skip = set(load('skip.json') or [])  # ISBN de packs o ediciones descartadas
isfdb, isfdb_id = {}, {}
for line in open(f'{lot}/isfdb.txt'):
    if '@@' in line:
        title, tid, pubs = line.rstrip('\n').split('@@', 2)
        isfdb_id[title] = tid
        isfdb[title] = [p.split('~') for p in pubs.split(';') if p]


MONTHS = 'ene feb mar abr may jun jul ago sep oct nov dic'.split()


def tf_date(text):
    # Tercera Fundación da «1992», «jun 2025» o «11 jun 2025»
    parts = text.lower().replace('.', '').split()
    if len(parts) == 1:
        return parts[0]
    month = f'{MONTHS.index(parts[-2][:3]) + 1:02d}'
    return f'{parts[-1]}-{month}' + (f'-{int(parts[0]):02d}' if len(parts) == 3 else '')


def key(e):
    return str(e['isbn13']) if e.get('isbn13') else f"{e['language']}-{e.get('date', 'sin-fecha')[:4]}-{e.get('format', 'sin-formato')}"


def links(isbn):
    out = []
    if str(isbn) in amazon:
        out.append({'store': 'amazon', 'url': f"https://www.amazon.es/dp/{amazon[str(isbn)]}/"})
    if str(isbn) in cdl:
        out.append({'store': 'casa_del_libro', 'url': cdl[str(isbn)]})
    return out


result, covers, seen = [], {}, set()
for title, (aid, settings, series, description) in META.items():
    editions, pairs = [], []
    for date, pub, isbn, fmt, img in isfdb.get(title, []):
        i = valid13(isbn) if isbn else None
        if i in skip or (i and i in seen):
            continue
        e = {'language': 'english', 'country': 'uk' if pub == 'Penguin Books' else 'us',
             'publisher': PUB.get(pub, pub), 'date': date if date[5:7] != '00' else date[:4]}
        if FMT.get(fmt):
            e['format'] = FMT[fmt]
        if i:
            e['isbn13'] = i
            seen.add(i)
        editions.append(e)
        if img:
            pairs.append((key(e), img))
    title_es = None
    for t in (tf.get(title) or {}).get('editions', []):
        i = valid13(t['isbn']) if t.get('isbn') else None
        if i in skip or (i and i in seen):
            continue
        e = {'language': 'castellano', 'spain': t.get('country') == 'España', 'title': t['title'],
             'publisher': t['publisher'], 'date': tf_date(t['year'])}
        if fmt_tf(t.get('format', '')):
            e['format'] = fmt_tf(t['format'])
        if i:
            e['isbn13'] = i
            seen.add(i)
        e['source'] = t['url']
        editions.append(e)
        title_es = t['title']
        if t.get('cover'):
            pairs.append((key(e), t['cover']))
    for e in editions:
        if e.get('isbn13') and links(e['isbn13']):
            e['purchase_links'] = links(e['isbn13'])
    a = {'id': aid, 'title': title}
    if title_es:
        a['title_es'] = title_es
    a.update({'settings': settings, 'description': description,
              'source': f'https://www.isfdb.org/cgi-bin/title.cgi?{isfdb_id[title]}',
              'series': series, 'editions': editions})
    result.append(a)
    covers[aid] = [f'{k}={u}' for k, u in dict(pairs).items()]
json.dump(result, open('data/novels/anthologies.json', 'w'), ensure_ascii=False, indent=2)
json.dump(covers, open(f'{lot}/covers.json', 'w'), ensure_ascii=False, indent=1)
print(len(result), 'antologías,', sum(len(a['editions']) for a in result), 'ediciones,', sum(map(len, covers.values())), 'portadas')
