#!/usr/bin/env python3
"""Turn Storyset "Bro" downloads into SimBio's illustrations.
usage: python3 art/prep_art.py <folder of downloaded *-bro.svg files> [output folder, default art/]
For each file named in art/SOURCES.txt: swap Storyset's accent color for SimBio blue (#003FCC),
drop the "-bro" suffix and save it in art/. Then optionally shrink them:
  npx svgo --config art/svgo.config.js art/*.svg"""
import collections, pathlib, re, sys
HERE = pathlib.Path(__file__).resolve().parent
SIMBIO_BLUE = '#003FCC'
KEEP = {'#263238', '#FFFFFF', '#FFF', '#000000', '#000'}  # outlines, white and black stay as they are
src = pathlib.Path(sys.argv[1]).expanduser()
OUT = pathlib.Path(sys.argv[2]).expanduser() if len(sys.argv) > 2 else HERE
OUT.mkdir(parents=True, exist_ok=True)
names = [l.split()[0] for l in (HERE / 'SOURCES.txt').read_text().splitlines()[1:] if l.strip()]
done = 0
for name in names:
    f = src / name
    if not f.exists():
        print('missing', name); continue
    svg = f.read_text()
    colors = collections.Counter(c.upper() for c in re.findall(r'#[0-9a-fA-F]{6}\b', svg))
    grays = {c for c in colors if c[1:3] == c[3:5] == c[5:7]}
    accent = next((c for c, _ in colors.most_common() if c not in KEEP and c not in grays), None)
    if accent:
        svg = re.sub(re.escape(accent), SIMBIO_BLUE, svg, flags=re.I)
    (OUT / name.replace('-bro.svg', '.svg')).write_text(svg)
    done += 1
    print(f'{name} -> {name.replace("-bro.svg", ".svg")} (accent {accent} -> {SIMBIO_BLUE})')
print(f'{done} of {len(names)} illustrations ready in {OUT}')
