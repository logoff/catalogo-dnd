# Descarga las portadas de un lote (covers.json de build_lot.py), una por una, y anota las que fallan.
# Uso (desde la raíz del repo): python3 -I dl_covers.py <dir_lote>
import json
import subprocess
import sys

lot = sys.argv[1]
covers = json.load(open(f'{lot}/covers.json'))
fails = []
for slug, m in covers.items():
    for k, v in m.items():
        r = subprocess.run(['node', 'scripts/download-novel-covers.mjs', slug, f'{k}={v}'], capture_output=True, text=True)
        if r.returncode:
            fails.append((slug, k, v))
    print(slug, flush=True)
json.dump(fails, open(f'{lot}/cover_fails.json', 'w'), indent=0)
print('fallos:', len(fails))
