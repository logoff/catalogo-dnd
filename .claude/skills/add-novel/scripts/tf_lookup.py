# Busca en Tercera Fundación las ediciones en castellano de cada novela de un lote.
# Primero por el título original y luego, para las que falten, recorriendo las obras de
# cada autor y casando el título original de cada ficha. Descarta las fichas cuyo autor
# no coincide. Escribe tf.json (n -> {ficha, editions, blurb} o null).
#
# Uso: python3 -I tf_lookup.py <dir_lote>      (lee pend.json del lote)
import json
import os
import re
import sys
import time
import unicodedata
import urllib.parse

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from novellib import clean, ficha, get  # noqa: E402

LOT = sys.argv[1]


def strip(s):
    return unicodedata.normalize('NFKD', s).encode('ascii', 'ignore').decode().lower().strip()


def norm(t):
    t = re.sub(r'\s*\([^)]*\)$', '', t)
    t = re.sub(r'^(the|a|an)\s+', '', strip(t))
    return re.sub(r'[^a-z0-9]', '', t)


def keys(title):
    return {norm(title), norm(title.split(':')[-1]), norm(title.split(':')[0])} - {''}


def authors_of(p):
    return [a.strip() for a in re.split(r'\s*(?:&|,| and )\s*', p['authors']) if a.strip()]


def author_ok(p, found):
    surnames = [strip(a.split()[-1]) for a in authors_of(p)]
    return any(s in strip(a) for s in surnames for a in found)


pend = json.load(open(f'{LOT}/pend.json'))
path = f'{LOT}/tf.json'
tf = json.load(open(path)) if os.path.exists(path) else {}

# 1. Por título
for p in pend:
    if p['n'] in tf:
        continue
    title = re.sub(r'\s*\([^)]*\)$', '', p['title'])
    search = get('https://tercerafundacion.net/biblioteca/buscar/?q=' + urllib.parse.quote_plus(title))
    tf[p['n']] = None
    for fid in dict.fromkeys(re.findall(r'ver/ficha/(\d+)', search)):
        f = ficha(fid)
        if any(norm(o) in keys(title) for o in f['originals']) and author_ok(p, f['authors']):
            tf[p['n']] = {k: f[k] for k in ('ficha', 'editions', 'blurb')}
            break
    print(p['n'], title, '->', tf[p['n']]['editions'][0]['title'] if tf[p['n']] and tf[p['n']]['editions'] else None, flush=True)
    json.dump(tf, open(path, 'w'), ensure_ascii=False, indent=1)

# 2. Por autor, para las que falten
todo = [p for p in pend if not tf.get(p['n'])]
wanted = {}
for p in todo:
    for k in keys(p['title']):
        wanted.setdefault(k, []).append(p)
seen = set()
for a in sorted({a for p in todo for a in authors_of(p)}):
    s = get('https://tercerafundacion.net/biblioteca/buscar/?q=' + urllib.parse.quote_plus(a))
    pid = None
    for m in re.finditer(r'ver/persona/(\d+)/?"[^>]*>(.*?)</a>', s, re.S):
        name = strip(clean(m.group(2)))
        if name == strip(a) or (strip(a.split()[-1]) in name and strip(a.split()[0][:3]) in name):
            pid = m.group(1)
            break
    if not pid:
        continue
    page = get(f'https://tercerafundacion.net/biblioteca/ver/persona/{pid}/?p=propios')
    for fid in dict.fromkeys(re.findall(r'ver/ficha/(\d+)', page)):
        if fid in seen:
            continue
        seen.add(fid)
        f = ficha(fid)
        for o in f['originals']:
            for p in wanted.get(norm(o), []):
                if tf.get(p['n']) or not author_ok(p, f['authors']):
                    continue
                tf[p['n']] = {k: f[k] for k in ('ficha', 'editions', 'blurb')}
                print(p['n'], p['title'], '-> (autor)', f['editions'][0]['title'] if f['editions'] else '?', flush=True)
        time.sleep(0.3)
    json.dump(tf, open(path, 'w'), ensure_ascii=False, indent=1)
print('con castellano:', sum(1 for v in tf.values() if v), 'de', len(pend))
