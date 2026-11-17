# Monta amazon.json de un lote a partir de lo leído en Amazon:
#   az_en.txt     n:kindle:oferta            (con el ISBN del inventario)
#   az_es.txt     n:isbn10:kindle:oferta     (edición en castellano)
#   az_extra.txt  n:lengua:isbn10|ASIN:kindle:oferta (otros ISBN o ASIN; '#' para comentarios)
# Uso: python3 -I make_amazon.py <dir_lote>
import json
import os
import sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from novellib import isbn10, to13, valid13  # noqa: E402

lot = sys.argv[1]
pend = {p['n']: p for p in json.load(open(f'{lot}/pend.json'))}
az = {}


def read(name):
    p = f'{lot}/{name}'
    if not os.path.exists(p):
        return []
    return [t for t in open(p).read().split() if not t.startswith('#')] if name != 'az_extra.txt' else \
        [l.strip() for l in open(p) if l.strip() and not l.startswith('#')]


def put(n, lang, key, kindle, offer):
    if offer == '1' and key and key != '-':
        isbn13 = valid13(key) if len(key) in (10, 13) and key[:1].isdigit() else None
        if isbn13:
            az[str(isbn13)] = {'buy': isbn10(isbn13) or key}
        elif lang == 'english' and n in pend and pend[n]['isbn']:  # ASIN de la primera edición (p. ej. ISBN 979)
            az[str(valid13(pend[n]['isbn']))] = {'buy': key}
    if kindle and kindle != '-':
        az.setdefault(f'kindle:{lang}:{n}', {'kindle': kindle})


for t in read('az_en.txt'):
    n, kindle, offer = t.split(':')
    isbn = valid13(pend[n]['isbn']) if n in pend and pend[n]['isbn'] else None
    put(n, 'english', isbn10(isbn) if isbn else None, kindle, offer)
for t in read('az_es.txt'):
    n, i10, kindle, offer = t.split(':')
    put(n, 'castellano', i10, kindle, offer)
for t in read('az_extra.txt'):
    n, lang, key, kindle, offer = t.split(':')
    put(n, lang, key, kindle, offer)
json.dump(az, open(f'{lot}/amazon.json', 'w'), indent=0)
kind = [v['kindle'] for k, v in az.items() if k.startswith('kindle:')]
print(len(az), 'entradas;', len(kind), 'Kindle;', 'repetidos:', sorted({k for k in kind if kind.count(k) > 1}))
