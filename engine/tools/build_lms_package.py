#!/usr/bin/env python3
"""Package a SimBio company edition (or classic SimBio) for an LMS.
usage:
  python3 build_lms_package.py EDITION_DIR ENGINE_DIR OUT_DIR [--format all|scorm12|scorm2004|xapi] [--mastery 80] [--activity-id IRI]
  python3 build_lms_package.py --classic ENGINE_DIR OUT_DIR [...]
EDITION_DIR has index.html + pack.json (from build_edition.py). ENGINE_DIR has engine.js, engine.css and art/ (all 20 SVGs).
Writes OUT_DIR/<slug>-scorm12.zip, <slug>-scorm2004.zip and <slug>-xapi.zip (or just the --format asked for).
Completion = the learner reaches the ending. Score = the final check. Passing = --mastery percent (default 80)."""
import argparse, json, pathlib, re, sys, zipfile, html
from xml.sax.saxutils import escape, quoteattr
from xml.dom import minidom

ART = ['accept-terms', 'business-decisions', 'business-growth', 'chemist', 'chemistry-lab', 'choose', 'data-analysis', 'dna',
       'doctors', 'documents', 'factory', 'hospital-patient', 'investing', 'laboratory', 'launching', 'medical-care', 'meeting',
       'partnership', 'team-spirit', 'winners']
FONTS = ('<link rel="preconnect" href="https://fonts.googleapis.com">\n'
         '<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>\n'
         '<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@600&text=COKEDBYMIKLAR.SGN&display=swap">\n'
         '<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Atkinson+Hyperlegible:ital,wght@0,400;0,700;1,400&family=Bricolage+Grotesque:opsz,wght@12..96,500;12..96,700;12..96,800&family=IBM+Plex+Mono:wght@400;500;600&display=swap">\n')

ap = argparse.ArgumentParser()
ap.add_argument('paths', nargs='+')
ap.add_argument('--classic', action='store_true')
ap.add_argument('--format', default='all', choices=['all', 'scorm12', 'scorm2004', 'xapi'])
ap.add_argument('--mastery', type=float, default=80, help='passing score on the final check, in percent')
ap.add_argument('--activity-id', default='', help='xAPI activity IRI (default https://simbio.mikeclark.design/xapi/<slug>)')
a = ap.parse_args()
if a.classic:
    if len(a.paths) != 2: sys.exit('usage: build_lms_package.py --classic ENGINE_DIR OUT_DIR')
    ed, eng, out = None, *map(pathlib.Path, a.paths)
else:
    if len(a.paths) != 3: sys.exit('usage: build_lms_package.py EDITION_DIR ENGINE_DIR OUT_DIR')
    ed, eng, out = map(pathlib.Path, a.paths)
if not 1 <= a.mastery <= 100: sys.exit('--mastery must be between 1 and 100')

problems = [f'{eng / f} is missing' for f in ('engine.js', 'engine.css') if not (eng / f).is_file()]
problems += [f'{eng}/art/{n}.svg is missing' for n in ART if not (eng / 'art' / f'{n}.svg').is_file()]
if problems: sys.exit('cannot package:\n  ' + '\n  '.join(problems))
js = (eng / 'engine.js').read_text(encoding='utf-8')
m = re.search(r'SimBio engine (\d+\.\d+\.\d+)', js)
if not m or tuple(map(int, m.group(1).split('.'))) < (1, 1, 0):
    sys.exit('engine.js is older than 1.1.0 and has no LMS support; fetch the current engine first')

# ---- page: a complete document (an LMS serves the file as-is)
if ed:
    page = (ed / 'index.html').read_text(encoding='utf-8')
    pack = json.loads((ed / 'pack.json').read_text(encoding='utf-8'))
    co = pack.get('company', {})
    name = co.get('shortName') or co.get('name') or 'Company'
    title, desc = f'{name} onboarding', f"Retrace {name}'s path from the lab to patients, one step at a time."
    head, sep, body = page.partition('<script id="simbio-pack"')
    if not sep: sys.exit(f'{ed / "index.html"} has no content pack; rebuild it with build_edition.py')
    head = re.sub(r'<!DOCTYPE html>\s*', '', head, flags=re.I)
    head = re.sub(r'<meta charset="utf-8">\s*', '', head)
    body = sep + body
else:
    name, title, desc = 'SimBio', 'SimBio', 'Build a biotech from a hunch to a medicine: a sim of how drug development works.'
    head = f'<title>SimBio</title>\n' + FONTS + '<link rel="stylesheet" href="engine.css">\n'
    body = '<script src="engine.js"></script>\n'
slug = re.sub(r'[^a-z0-9]+', '-', name.lower()).strip('-') or 'simbio'
if not ed: slug = 'simbio'
aid = a.activity_id or f'https://simbio.mikeclark.design/xapi/{slug}'
cfg = json.dumps({'mastery': round(a.mastery / 100, 4), 'title': title, 'activityId': aid}, ensure_ascii=True)
body = body.replace('<script src="engine.js"></script>', f'<script id="simbio-lms" type="application/json">{cfg}</script>\n<script src="engine.js"></script>', 1)
doc = ('<!doctype html>\n<html lang="en">\n<head>\n<meta charset="utf-8">\n'
       '<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">\n'
       + head.strip() + '\n<style>body{margin:0}</style>\n</head>\n<body>\n' + body.strip() + '\n</body>\n</html>\n')
doc = doc.encode('ascii', 'xmlcharrefreplace').decode('ascii')
files = {'index.html': doc.encode(), 'engine.js': js.encode('utf-8'), 'engine.css': (eng / 'engine.css').read_bytes()}
for n in ART: files[f'art/{n}.svg'] = (eng / 'art' / f'{n}.svg').read_bytes()
if ed:
    files['pack.json'] = (ed / 'pack.json').read_bytes()
    for f in ed.iterdir():  # the edition's own images, such as the company logo
        if f.is_file() and f.suffix.lower() in ('.svg', '.png', '.webp', '.jpg', '.jpeg'): files[f.name] = f.read_bytes()

ident = 'simbio-' + slug
T, D = escape(title), escape(desc)
file_list = '\n'.join(f'      <file href={quoteattr(f)}/>' for f in sorted(files))

def scorm12():
    return f'''<?xml version="1.0" encoding="UTF-8"?>
<manifest identifier="{ident}" version="1.0"
  xmlns="http://www.imsproject.org/xsd/imscp_rootv1p1p2"
  xmlns:adlcp="http://www.adlnet.org/xsd/adlcp_rootv1p2"
  xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
  xsi:schemaLocation="http://www.imsproject.org/xsd/imscp_rootv1p1p2 imscp_rootv1p1p2.xsd http://www.imsglobal.org/xsd/imsmd_rootv1p2p1 imsmd_rootv1p2p1.xsd http://www.adlnet.org/xsd/adlcp_rootv1p2 adlcp_rootv1p2.xsd">
  <metadata>
    <schema>ADL SCORM</schema>
    <schemaversion>1.2</schemaversion>
  </metadata>
  <organizations default="{ident}-org">
    <organization identifier="{ident}-org">
      <title>{T}</title>
      <item identifier="{ident}-item" identifierref="{ident}-res" isvisible="true">
        <title>{T}</title>
        <adlcp:masteryscore>{round(a.mastery)}</adlcp:masteryscore>
      </item>
    </organization>
  </organizations>
  <resources>
    <resource identifier="{ident}-res" type="webcontent" adlcp:scormtype="sco" href="index.html">
{file_list}
    </resource>
  </resources>
</manifest>
'''

def scorm2004():
    return f'''<?xml version="1.0" encoding="UTF-8"?>
<manifest identifier="{ident}" version="1"
  xmlns="http://www.imsglobal.org/xsd/imscp_v1p1"
  xmlns:adlcp="http://www.adlnet.org/xsd/adlcp_v1p3"
  xmlns:adlseq="http://www.adlnet.org/xsd/adlseq_v1p3"
  xmlns:adlnav="http://www.adlnet.org/xsd/adlnav_v1p3"
  xmlns:imsss="http://www.imsglobal.org/xsd/imsss"
  xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
  xsi:schemaLocation="http://www.imsglobal.org/xsd/imscp_v1p1 imscp_v1p1.xsd http://www.adlnet.org/xsd/adlcp_v1p3 adlcp_v1p3.xsd http://www.adlnet.org/xsd/adlseq_v1p3 adlseq_v1p3.xsd http://www.adlnet.org/xsd/adlnav_v1p3 adlnav_v1p3.xsd http://www.imsglobal.org/xsd/imsss imsss_v1p0.xsd">
  <metadata>
    <schema>ADL SCORM</schema>
    <schemaversion>2004 4th Edition</schemaversion>
  </metadata>
  <organizations default="{ident}-org">
    <organization identifier="{ident}-org">
      <title>{T}</title>
      <item identifier="{ident}-item" identifierref="{ident}-res">
        <title>{T}</title>
        <imsss:sequencing>
          <imsss:objectives>
            <imsss:primaryObjective objectiveID="{ident}-final-check" satisfiedByMeasure="true">
              <imsss:minNormalizedMeasure>{a.mastery / 100:.2f}</imsss:minNormalizedMeasure>
            </imsss:primaryObjective>
          </imsss:objectives>
        </imsss:sequencing>
      </item>
    </organization>
  </organizations>
  <resources>
    <resource identifier="{ident}-res" type="webcontent" adlcp:scormType="sco" href="index.html">
{file_list}
    </resource>
  </resources>
</manifest>
'''

def tincan():
    return f'''<?xml version="1.0" encoding="utf-8"?>
<tincan xmlns="http://projecttincan.com/tincan.xsd">
  <activities>
    <activity id={quoteattr(aid)} type="http://adlnet.gov/expapi/activities/course">
      <name>{T}</name>
      <description lang="en-US">{D}</description>
      <launch lang="en-US">index.html</launch>
    </activity>
  </activities>
</tincan>
'''

out.mkdir(parents=True, exist_ok=True)
fmts = ['scorm12', 'scorm2004', 'xapi'] if a.format == 'all' else [a.format]
for f in fmts:
    meta_name, meta = ('tincan.xml', tincan()) if f == 'xapi' else ('imsmanifest.xml', scorm12() if f == 'scorm12' else scorm2004())
    minidom.parseString(meta.encode())  # must be well-formed XML
    z = out / f'{slug}-{f}.zip'
    with zipfile.ZipFile(z, 'w', zipfile.ZIP_DEFLATED) as zf:
        zf.writestr(meta_name, meta)
        for path, data in sorted(files.items()):
            zf.writestr(path, data)
    print(f'wrote {z} ({z.stat().st_size // 1024} KB, {len(files) + 1} files)')
print(f'title "{title}" · passing score {a.mastery:g}% · xAPI activity id {aid}')
