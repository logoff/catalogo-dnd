# Busca recopilatorios en castellano metidos como edición de una novela. Como el
# generador conserva cada ISBN solo en la primera novela en que aparece, se detectan
# por el título: ediciones en castellano cuyo título no coincide con el de las demás
# ediciones de la novela, o que contiene palabras de volumen recopilatorio.
# Uso (desde la raíz del repo): python3 -I shared_spanish.py
import glob
import json
import re
import unicodedata
from collections import Counter


def norm(t):
    t = unicodedata.normalize('NFKD', t or '').encode('ascii', 'ignore').decode().lower()
    return re.sub(r'[^a-z0-9]', '', t)


HINT = re.compile(r'trilog|saga|tetralog|cronicas|volumen|omnibus|edicion coleccionista|integral|estuche', re.I)
for path in sorted(glob.glob('data/novels/*/*.json')):
    novel = json.load(open(path))
    es = [e for e in novel['editions'] if e['language'] == 'castellano']
    if not es:
        continue
    common = Counter(norm(e.get('title')) for e in es).most_common(1)[0][0]
    for e in es:
        t = norm(e.get('title'))
        odd = len(es) > 1 and t != common and common not in t and t not in common
        if odd or HINT.search(unicodedata.normalize('NFKD', e.get('title', '')).encode('ascii', 'ignore').decode()):
            print(novel['slug'], '|', (novel.get('series') or {}).get('id'), '|', e.get('title'), '|', e.get('publisher'), e.get('date'), e.get('isbn13'), e.get('source', ''))
