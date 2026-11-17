# Busca en Tercera Fundación los recopilatorios en castellano: fichas cuyo contenido
# (o cuyos títulos originales) corresponde a dos o más novelas con ficha. Recorre las obras de los
# autores de las novelas traducidas y escribe los candidatos en <salida>.
# Uso (desde la raíz del repo): python3 -I tf_collections.py <salida.json>
import glob
import json
import os
import re
import sys
import time
import unicodedata
import urllib.parse

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from novellib import clean, ficha, get  # noqa: E402


def strip(s):
    return unicodedata.normalize('NFKD', s).encode('ascii', 'ignore').decode().lower().strip()


def norm(t):
    t = re.sub(r'\s*\([^)]*\)$', '', t)
    t = re.sub(r'^(the|a|an)\s+', '', strip(t))
    return re.sub(r'[^a-z0-9]', '', t)


novels, by_title, authors = {}, {}, set()
for path in glob.glob('data/novels/*/*.json'):
    n = json.load(open(path))
    novels[n['slug']] = n
    for k in {norm(n['title']), norm(n['title'].split(':')[-1])}:
        by_title.setdefault(k, set()).add(n['slug'])
    if any(e['language'] == 'castellano' for e in n['editions']):
        authors.update(n['authors'])

out, seen = [], set()
for a in sorted(authors):
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
        # El contenido alterna el título en castellano y el original
        html = get(f'https://tercerafundacion.net/biblioteca/ver/ficha/{fid}')
        contents = [clean(m) for m in re.findall(r'ver/contenido/\d+"[^>]*>(.*?)</a>', html, re.S)]
        slugs = sorted({s for o in f['originals'] + contents for s in by_title.get(norm(o), set())})
        if len(slugs) >= 2:
            out.append({'ficha': fid, 'originals': f['originals'], 'novels': slugs, 'editions': f['editions']})
            print(fid, f['editions'][0]['title'] if f['editions'] else '?', slugs, flush=True)
        time.sleep(0.2)
    json.dump(out, open(sys.argv[1], 'w'), ensure_ascii=False, indent=1)
print('candidatos:', len(out))
