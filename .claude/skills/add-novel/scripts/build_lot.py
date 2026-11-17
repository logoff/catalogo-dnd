# Genera las fichas de un lote a partir de lo recogido en su directorio:
#   pend.json    inventario (n, series, title, authors, date, kind, isbn)
#   isfdb.txt    título@@id@@núm@@fecha~editorial~isbn~formato~tipo~pl~título_recopilatorio;…
#   tf.json      n -> {ficha, editions, blurb} (tf_lookup.py)
#   amazon.json  isbn13 -> {buy: isbn10} | "kindle:<english|castellano>:<n>" -> {kindle, kindle_isbn?, kindle_date?, kindle_publisher?}
#   desc.json    n -> descripción en dos párrafos
#   series_map.py  SERIES = {id: (título, título_es o None, [n en orden de lectura])}
#   extra.json   n -> ajustes a mano (slug, skip, title_es, kind, setting, source, authors…)
# Escribe las fichas, covers.json, written.json y añade series y recopilatorios a series.json.
#
# Uso: python3 -I build_lot.py <raíz_repo> <setting> <dir_lote>
import json
import os
import re
import sys
import unicodedata

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from novellib import ISFDB, fmt_tf, isbn10, valid13  # noqa: E402

ROOT, SETTING, LOT = sys.argv[1], sys.argv[2], sys.argv[3]


def J(name):
    p = os.path.join(LOT, name)
    return json.load(open(p)) if os.path.exists(p) else {}


def read_isfdb():
    p = os.path.join(LOT, 'isfdb.txt')
    out = {}
    if not os.path.exists(p):
        return out
    for line in open(p).read().strip().split('\n'):
        title, tid, num, pubs = line.split('@@')
        rows = []
        for r in filter(None, pubs.split(';')):
            d, pub, isbn, fmt, typ, pl, ctitle = (r.split('~') + [''] * 7)[:7]
            rows.append([ctitle or title, d, pub.replace('WotC', 'Wizards of the Coast'), isbn, fmt, typ, pl])
        out[title] = {'id': tid if tid not in ('', 'None', 'null') else None, 'num': num, 'pubs': rows}
    return out


pend = J('pend.json')
tf, amazon, desc, extra = J('tf.json'), J('amazon.json'), J('desc.json'), J('extra.json')
isfdb = read_isfdb()
SM = {}
if os.path.exists(os.path.join(LOT, 'series_map.py')):
    exec(open(os.path.join(LOT, 'series_map.py')).read(), SM)
SERIES_OF = {n: (sid, i + 1) for sid, (_, _, ns) in SM.get('SERIES', {}).items() for i, n in enumerate(ns)}

SKIP_PUB = re.compile(r"Devil's Due|IDW|Bt Bound|Turtleback|Tandem|Perfection|Paw Prints|Audible|Brilliance|Recorded|Random House Audio|Books on Tape|Blackstone|Tantor|Graphic Audio|Science Fiction Book Club|SFBC", re.I)
FMT = {'pb': 'mass_market', 'tp': 'paperback', 'hc': 'hardcover', 'ebook': 'ebook'}
UK = re.compile(r'Penguin Books(?! USA)|Del Rey \(UK\)|Cornerstone|Guild|Puffin|Century|Arrow|Titan Books', re.I)
KIND = {'novela': 'novel', 'juvenil': 'young_adult', 'infantil': 'middle_grade', 'novela (solo ebook)': 'novel',
        'novela (solo web)': 'novel', 'novela corta': 'novella', 'relato (solo ebook)': 'short_story', 'guía narrativa': 'fiction_guide'}
MESES = {m: i + 1 for i, m in enumerate('ene feb mar abr may jun jul ago sep oct nov dic'.split())}


def slugify(t):
    t = re.sub(r'\s*\([^)]*\)$', '', t)
    t = unicodedata.normalize('NFKD', t).encode('ascii', 'ignore').decode()
    t = t.replace('&', 'and').replace("'", '').lower()
    return re.sub(r'[^a-z0-9]+', '-', t).strip('-')


def date_tf(s):
    s = s.strip().lower()
    m = re.match(r'(?:(\d{1,2}) )?([a-z]{3}) (\d{4})', s)
    if m:
        d, mon, y = m.groups()
        if d == '31' and mon == 'dic':  # fecha de relleno
            return y
        return f'{y}-{MESES[mon]:02d}' + (f'-{int(d):02d}' if d else '')
    m = re.search(r'\d{4}', s)
    return m.group(0) if m else None


def date_isfdb(s):
    s = re.sub(r'-00', '', s.replace('date unknown', '').replace('unpublished', '').strip())
    return s or None


def links(isbn13):
    a = amazon.get(str(isbn13)) or {}
    return [{'store': 'amazon', 'url': f"https://www.amazon.es/dp/{a['buy']}/"}] if a.get('buy') else []


covers, written, seen_isbn, collections = {}, [], set(), {}
for p in pend:
    n = p['n']
    ex = extra.get(n) or {}
    if ex.get('skip'):
        continue
    title = re.sub(r'\s*\([^)]*\)$', '', p['title'])
    slug = ex.get('slug') or slugify(title)
    info = isfdb.get(p['title']) or isfdb.get(title) or {}
    eds, ed_keys = [], set()
    # --- inglés ---
    for ptitle, pdate, pub, pisbn, pfmt, ptype, pl in info.get('pubs', []):
        if SKIP_PUB.search(pub) or 'audio' in pfmt.lower() or 'unpublished' in pdate:
            continue
        isbn = valid13(pisbn) if re.search(r'\d{9}', pisbn.replace('-', '')) else None
        if ptype in ('omni', 'omnibus', 'anth', 'coll'):
            if isbn and ptype in ('omni', 'omnibus'):
                collections.setdefault(isbn, {'title': ptitle, 'date': date_isfdb(pdate), 'publisher': pub, 'fmt': FMT.get(pfmt), 'pl': pl, 'members': set()})['members'].add(slug)
            continue
        if ptype not in ('n', 'novel', 'chapbook', 'chap'):
            continue
        key = isbn or (pub, pfmt, (pdate or '')[:4])
        if key in ed_keys:
            continue
        ed_keys.add(key)
        e = {'language': 'english', 'country': 'uk' if UK.search(pub) else 'us'}
        if ptitle and ptitle.lower() != title.lower() and not ptitle.lower().startswith(title.lower()) and not title.lower().endswith(ptitle.lower()):
            e['title'] = ptitle
        e['publisher'] = re.sub(r'\s*\(.*\)$', '', pub) if pub.startswith(('TSR (', 'HarperCollins (')) else pub
        d = date_isfdb(pdate)
        if d:
            e['date'] = d
        if FMT.get(pfmt):
            e['format'] = FMT[pfmt]
        if isbn:
            e['isbn13'] = isbn
            seen_isbn.add(isbn)
            i10 = isbn10(isbn)
            if i10 and FMT.get(pfmt) != 'ebook':
                covers.setdefault(slug, {})[str(isbn)] = f'https://m.media-amazon.com/images/P/{i10}.jpg'
        e['source'] = ISFDB + pl if pl else f"https://www.isfdb.org/cgi-bin/title.cgi?{info.get('id')}"
        lk = links(isbn) if isbn else []
        if lk:
            e['purchase_links'] = lk
        eds.append(e)
    # --- castellano ---
    for t in (tf.get(n) or {}).get('editions', []):
        isbn = valid13(t['isbn']) if t.get('isbn') and re.search(r'\d{9}', t['isbn'].replace('-', '')) else None
        if isbn and isbn in seen_isbn:
            continue
        key = isbn or (t['publisher'], t['format'], t['year'])
        if key in ed_keys:
            continue
        ed_keys.add(key)
        e = {'language': 'castellano', 'spain': t.get('country', 'España') in ('España', ''), 'title': t['title'] or title, 'publisher': t['publisher'] or 'Desconocida'}
        d = date_tf(t['year'])
        if d:
            e['date'] = d
        f = fmt_tf(t['format'])
        if f:
            e['format'] = f
        if isbn:
            e['isbn13'] = isbn
            seen_isbn.add(isbn)
            if t.get('cover'):
                covers.setdefault(slug, {})[str(isbn)] = t['cover']
        e['source'] = t['url']
        lk = links(isbn) if isbn else []
        if lk:
            e['purchase_links'] = lk
        eds.append(e)
    # --- Kindle ---
    for lang in ('english', 'castellano'):
        k = amazon.get(f'kindle:{lang}:{n}') or {}
        if not k.get('kindle'):
            continue
        kisbn = valid13(k['kindle_isbn']) if k.get('kindle_isbn') else None
        target = next((e for e in eds if kisbn and e.get('isbn13') == kisbn), None)
        if target is None:
            target = next((e for e in sorted(eds, key=lambda e: e.get('date', ''), reverse=True) if e['language'] == lang and e.get('format') == 'ebook' and not kisbn), None)
        if target is None:
            target = {'language': lang}
            if lang == 'english':
                target['country'] = 'us'
            else:
                target.update(spain=True, title=next((e['title'] for e in eds if e['language'] == 'castellano'), title))
            target['publisher'] = k.get('kindle_publisher') or ('Wizards of the Coast' if lang == 'english' else 'Minotauro')
            if k.get('kindle_date'):
                target['date'] = k['kindle_date']
            target['format'] = 'ebook'
            if kisbn and kisbn not in seen_isbn:
                target['isbn13'] = kisbn
                seen_isbn.add(kisbn)
            target['source'] = f"https://www.amazon.es/dp/{k['kindle']}/"
            eds.append(target)
        target['purchase_links'] = [{'store': 'amazon', 'url': f"https://www.amazon.es/dp/{k['kindle']}/"}]
    # La primera edición del inventario siempre consta, aunque ISFDB no la tenga
    first = valid13(p['isbn']) if p.get('isbn') else None
    if first and first not in seen_isbn:
        seen_isbn.add(first)
        e = {'language': 'english', 'country': 'us', 'publisher': 'TSR' if p['date'] < '1997' else 'Wizards of the Coast'}
        if p['date']:
            e['date'] = p['date']
        e['isbn13'] = first
        e['source'] = f'https://www.isfdb.org/cgi-bin/se.cgi?arg={first}&type=ISBN'
        lk = links(first)
        if lk:
            e['purchase_links'] = lk
        i10 = isbn10(first)
        if i10:
            covers.setdefault(slug, {})[str(first)] = f'https://m.media-amazon.com/images/P/{i10}.jpg'
        eds.insert(0, e)
    if not any(e['language'] == 'english' for e in eds):
        eds.insert(0, {'language': 'english', 'country': 'us', 'publisher': 'TSR' if p['date'] < '1997' else 'Wizards of the Coast', **({'date': p['date']} if p['date'] else {}), 'source': f"https://www.isfdb.org/cgi-bin/title.cgi?{info['id']}" if info.get('id') else 'https://en.wikipedia.org/wiki/List_of_Dungeons_%26_Dragons_fiction'})
    novel = {'slug': slug, 'title': title}
    novel['authors'] = [a.strip() for a in re.split(r',\s*(?:&\s*)?|\s+&\s+|\s+and\s+', p['authors']) if a.strip()]
    novel['setting'] = SETTING
    novel['kind'] = KIND.get(p['kind'], 'novel')
    if n in SERIES_OF:
        novel['series'] = {'id': SERIES_OF[n][0], 'number': SERIES_OF[n][1]}
    if n in SM.get('YOUNG_ADULT', []):
        novel['kind'] = 'young_adult'
    if p['date']:
        novel['date'] = p['date']
    novel['description'] = desc.get(n, 'PENDIENTE\n\nPENDIENTE')
    novel['source'] = f"https://www.isfdb.org/cgi-bin/title.cgi?{info['id']}" if info.get('id') else 'https://en.wikipedia.org/wiki/List_of_Dungeons_%26_Dragons_fiction'
    novel['editions'] = eds
    novel.update({k: v for k, v in ex.items() if k in ('title_es', 'related_videogames', 'related_products', 'kind', 'setting', 'source', 'authors', 'title')})
    path = f"{ROOT}/data/novels/{novel['setting']}/{slug}.json"
    os.makedirs(os.path.dirname(path), exist_ok=True)
    json.dump(novel, open(path, 'w'), ensure_ascii=False, indent=2)
    written.append((n, slug))

json.dump(covers, open(os.path.join(LOT, 'covers.json'), 'w'), indent=1)
json.dump(written, open(os.path.join(LOT, 'written.json'), 'w'))
# Series nuevas y recopilatorios (los de dos o más novelas del lote, en la serie de la primera)
sp = f'{ROOT}/data/novels/series.json'
allseries = json.load(open(sp))
known = {x['id'] for x in allseries}
slug_of = dict(written)
series_of_slug = {slug_of[n]: sid for n, (sid, _) in SERIES_OF.items() if n in slug_of}
for sid, (stitle, stitle_es, ns) in SM.get('SERIES', {}).items():
    if sid in known:
        continue
    entry = {'id': sid, 'title': stitle}
    if stitle_es:
        entry['title_es'] = stitle_es
    entry['setting'] = SETTING
    allseries.append(entry)
by_id = {x['id']: x for x in allseries}
added = 0
for isbn, c in collections.items():
    members = [m for m in sorted(c['members']) if m in series_of_slug]
    if len(members) < 2:
        continue
    target = by_id[series_of_slug[members[0]]]
    cols = target.setdefault('collections', [])
    if any(x.get('isbn13') == isbn for x in cols):
        continue
    col = {'language': 'english', 'country': 'uk' if UK.search(c['publisher']) else 'us', 'title': c['title'], 'publisher': c['publisher']}
    if c['fmt']:
        col['format'] = c['fmt']
    if c['date']:
        col['date'] = c['date']
    col['isbn13'] = isbn
    col['source'] = ISFDB + c['pl']
    col['novels'] = members
    cols.append(col)
    added += 1
json.dump(allseries, open(sp, 'w'), ensure_ascii=False, indent=2)
print('series:', len(allseries), 'recopilatorios añadidos:', added)
print(len(written), 'fichas;', sum(len(v) for v in covers.values()), 'portadas')
