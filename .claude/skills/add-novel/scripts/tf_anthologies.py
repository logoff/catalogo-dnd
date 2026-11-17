# Busca en Tercera Fundación las ediciones en castellano de las antologías de la sección
# «Antologías» del inventario, casando el título original de cada ficha.
# Uso (desde la raíz del repo): python3 -I tf_anthologies.py <salida.json>
import json
import os
import re
import sys
import time
import unicodedata
import urllib.parse

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from novellib import ficha, get  # noqa: E402


def norm(t):
    t = unicodedata.normalize('NFKD', t).encode('ascii', 'ignore').decode().lower().strip()
    t = re.sub(r'^(the|a|an)\s+', '', t)
    return re.sub(r'[^a-z0-9]', '', t)


inv = open('data/novels/inventory.md').read().split('## Antologías')[1].split('\n## ')[0]
titles = [line.split('|')[3].strip() for line in inv.split('\n') if line.startswith('| ') and not line.startswith(('| Mundo', '| -'))]
out = {}
for title in titles:
    keys = {norm(title), norm(title.split(':')[0])}
    search = get('https://tercerafundacion.net/biblioteca/buscar/?q=' + urllib.parse.quote_plus(title.split(':')[0]))
    out[title] = None
    for fid in list(dict.fromkeys(re.findall(r'ver/ficha/(\d+)', search)))[:8]:
        f = ficha(fid)
        if any(norm(o) in keys for o in f['originals']):
            out[title] = {k: f[k] for k in ('ficha', 'editions', 'originals')}
            break
        time.sleep(0.2)
    print(title, '->', out[title]['editions'][0]['title'] if out[title] and out[title]['editions'] else None, flush=True)
    json.dump(out, open(sys.argv[1], 'w'), ensure_ascii=False, indent=1)
