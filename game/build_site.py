#!/usr/bin/env python3
"""Build the standalone website version of classic SimBio (what simbio.mikeclark.design serves).
usage: python3 game/build_site.py
Reads game/simbio.html, game/create.html and art/*.svg, writes site/ and site.zip:
site/index.html (the game, with a "Create SimBio for your company" link), site/art/*.svg, and
site/create/ (the page that offers the free Claude skill, with simbio-onboarding.zip beside it)."""
import io, os, pathlib, shutil, subprocess, sys, tempfile, zipfile
ROOT = pathlib.Path(__file__).resolve().parent.parent
s = (ROOT / 'game' / 'simbio.html').read_text()
i = s.index('<!-- ================= SETUP')
head = s[:i].replace('body{background:var(--paper)', 'body{margin:0;background:var(--paper)', 1)
assert 'body{margin:0;' in head
fav = ("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64'%3E%3Crect width='64' height='64' rx='14' fill='%23003FCC'/%3E"
       "%3Cpath d='M26 14h12M28 14v14L17 47a4 4 0 0 0 3.5 6h23a4 4 0 0 0 3.5-6L36 28V14' fill='none' stroke='white' stroke-width='4' stroke-linejoin='round' stroke-linecap='round'/%3E"
       "%3Cpath d='M22 42h20' stroke='white' stroke-width='4' stroke-linecap='round'/%3E%3C/svg%3E")
desc = ("SimBio is a biotech-building sim: found a stealth biotech, pick a disease and drug type, and take one medicine "
        "from target biology through stage-gate reviews, trials, FDA review and launch.")
meta = f'''<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<meta name="description" content="{desc}">
<meta name="theme-color" content="#003FCC">
<meta property="og:type" content="website">
<meta property="og:url" content="https://simbio.mikeclark.design/">
<meta property="og:site_name" content="SimBio">
<meta property="og:title" content="SimBio · Build a biotech from nothing">
<meta property="og:description" content="{desc}">
<meta name="twitter:card" content="summary">
<link rel="icon" href="{fav}">
'''
# "Create your own" link: on the welcome screen and in the footer (website only, not in company editions)
CREATE_CSS = ('<style>.ob-right{display:flex;align-items:center;gap:16px;flex-wrap:wrap}'
              '.mk-own{display:inline-flex;align-items:center;gap:6px;min-height:40px;padding:8px 14px;border-radius:999px;'
              'border:1px solid var(--accent);color:var(--accent);font-weight:700;font-size:15px;text-decoration:none;background:var(--panel)}'
              '.mk-own:hover{background:var(--accent);color:#fff}'
              'a.toggle{text-decoration:none;display:inline-flex;align-items:center}</style>\n')
body = s[i:]
prog = '<div class="ob-prog" id="obProg" aria-hidden="true"></div>'
foot = '<button class="toggle" id="btnIntro2">About SimBio</button>'
assert prog in body and foot in body, 'game/simbio.html changed: update the "Create your own" injection in build_site.py'
body = body.replace(prog, '<div class="ob-right">' + prog + '<a class="mk-own" href="/create/">Create one for your company &rarr;</a></div>', 1)
body = body.replace(foot, '<a class="toggle" href="/create/">Create one for your company</a>' + foot, 1)
out = meta + head.rstrip() + '\n' + CREATE_CSS + '</head>\n<body>\n' + body.rstrip() + '\n</body>\n</html>\n'
site = ROOT / 'site'
shutil.rmtree(site, ignore_errors=True)
(site / 'art').mkdir(parents=True)
(site / 'index.html').write_text(out)
art = sorted((ROOT / 'art').glob('*.svg'))
if len(art) < 20:
    print(f'warning: only {len(art)} illustrations in art/ (expected 20); see "Illustrations" in README.md')
for a in art:
    shutil.copy(a, site / 'art' / a.name)
# the "Create one" page and the free skill
(site / 'create').mkdir()
shutil.copy(ROOT / 'game' / 'create.html', site / 'create' / 'index.html')
if (ROOT / 'kit' / 'build_kit.py').exists():   # private repo: build the free skill from the full source
    with tempfile.TemporaryDirectory() as t:
        subprocess.run([sys.executable, str(ROOT / 'kit' / 'build_kit.py'), '--free', t], check=True, stdout=subprocess.DEVNULL)
        shutil.copy(pathlib.Path(t) / 'simbio-onboarding.zip', site / 'create' / 'simbio-onboarding.zip')
else:                                           # public repo: zip the committed skill folder
    shutil.copy(ROOT / 'skill' / 'simbio-onboarding.zip', site / 'create' / 'simbio-onboarding.zip')
with zipfile.ZipFile(ROOT / 'site.zip', 'w', zipfile.ZIP_DEFLATED) as z:
    for f in sorted(site.rglob('*')):
        if f.is_file():
            z.write(f, f.relative_to(site))
print('built site/ and site.zip with', len(art), 'illustrations')
