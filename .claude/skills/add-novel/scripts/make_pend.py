# Saca del inventario las novelas pendientes de un mundo (o de una lista de números).
# Uso: python3 -I make_pend.py <inventario.md> "<Mundo>" <dir_lote> [n1,n2,...]
import json
import os
import re
import sys

inv, world, lot = sys.argv[1], sys.argv[2], sys.argv[3]
only = set(sys.argv[4].split(',')) if len(sys.argv) > 4 else None
sec, out = None, []
for line in open(inv).read().split('\n'):
    if line.startswith('## '):
        sec = line[3:]
    if sec != world:
        continue
    c = [x.strip() for x in line.split('|')]
    if len(c) > 9 and c[1].isdigit() and c[9] == 'pendiente' and (not only or c[1] in only):
        first = re.split(r'\s*(?:&|,| and )\s*', c[4])[0]
        out.append({'n': c[1], 'series': c[2], 'title': c[3], 'authors': c[4], 'date': c[5], 'kind': c[6], 'isbn': c[7], 'surname': first.split()[-1]})
os.makedirs(lot, exist_ok=True)
json.dump(out, open(f'{lot}/pend.json', 'w'), ensure_ascii=False, indent=0)
print(len(out), 'pendientes')
