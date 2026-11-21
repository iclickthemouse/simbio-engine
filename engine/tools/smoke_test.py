#!/usr/bin/env python3
"""Play a company edition end to end in a headless browser.
usage: python3 smoke_test.py edition_dir engine_dir
edition_dir has index.html + pack.json (from build_edition.py); engine_dir has engine.js and engine.css (art/ optional).
Prints a report and saves screenshots into edition_dir/shots/."""
import asyncio, json, sys, pathlib, shutil, threading, functools, http.server
from playwright.async_api import async_playwright
ed, eng = pathlib.Path(sys.argv[1]).resolve(), pathlib.Path(sys.argv[2]).resolve()
HOOK = ("window.__t=tick;window.__S=()=>S;window.__go=startMilestone;window.__close=closeModal;window.__ups=buyUp;"
        "window.__rerun=rerun;window.__G=GATES;window.__cm=currentMilestone;window.__ctx=ctx;")
PLAY = """()=>{const S=__S;const L=[];let n=0;
 while(!S().ended&&n++<200000){let g=0;
  while(!document.getElementById('modal').hidden&&!S().ended&&g++<20){const c=document.getElementById('modalCard');L.push(c.innerText);
   if(document.getElementById('gCheck')){const G=__G[__cm().gate](__ctx());document.getElementById('gq_'+G.q.r).checked=true;document.getElementById('gCheck').click();L.push(c.innerText);
    const os=[...document.querySelectorAll('#gDecide [data-o]')];if(os.length)os[0].click();else document.getElementById('gPass').click()}else __close()}
  const s=S();if(s.sci<20&&s.cash>2e5)document.getElementById('btnHire').click();if(s.flags.ind&&s.sites<40)document.getElementById('btnSite').click();
  if(s.flags.launched){if(s.reps<300)document.getElementById('btnReps').click();if(!document.getElementById('btnBio').disabled&&s.lines<8)document.getElementById('btnBio').click()}
  document.querySelectorAll('#upgrades [data-u]').forEach(b=>{if(!b.disabled)__ups(b.dataset.u)});
  for(const k in s.trials)if(s.trials[k].state==='failed')__rerun(k);__go();__adv(1000);__t()}
 let g=0;while(!document.getElementById('fCheck')&&g++<10){L.push(document.getElementById('modalCard').innerText);__close()}
 L.push(document.getElementById('modalCard').innerText);return{L,ended:S().ended,years:(S().week/52).toFixed(1)}}"""

async def main():
    work = ed / '_smoke'; shutil.rmtree(work, ignore_errors=True); work.mkdir()
    if (eng / 'art').is_dir(): shutil.copytree(eng / 'art', work / 'art')  # art is optional for the check
    else: (work / 'art').mkdir()
    shutil.copy(eng / 'engine.css', work)
    for f in ed.iterdir():  # the edition's own images, such as the company logo
        if f.is_file() and f.suffix.lower() in ('.svg', '.png', '.webp', '.jpg', '.jpeg'): shutil.copy(f, work)
    (work / 'engine.js').write_text((eng / 'engine.js').read_text().replace('setInterval(tick,100);', HOOK))
    page = (ed / 'index.html').read_text()
    pre = ('<script>let __f=0;const __pn=performance.now.bind(performance);performance.now=()=>__pn()+__f;'
           'window.__adv=ms=>{__f+=ms}</script>\n')
    (work / 'index.html').write_text('<!doctype html><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">' + pre + page)
    pack = json.loads((ed / 'pack.json').read_text())
    shots = ed / 'shots'; shots.mkdir(exist_ok=True)
    problems = []
    class Quiet(http.server.SimpleHTTPRequestHandler):
        def log_message(self, *a): pass
    srv = http.server.ThreadingHTTPServer(('127.0.0.1', 0), functools.partial(Quiet, directory=str(work)))
    threading.Thread(target=srv.serve_forever, daemon=True).start()
    url = f'http://127.0.0.1:{srv.server_address[1]}/index.html'
    async with async_playwright() as p:
        b = await p.chromium.launch()
        for label, vp in (('desktop', {'width': 1280, 'height': 860}), ('phone', {'width': 390, 'height': 844})):
            pg = await b.new_page(viewport=vp); errs = []
            pg.on('pageerror', lambda e: errs.append(str(e)))
            await pg.route('**/fonts.*/**', lambda r: r.abort())
            await pg.goto(url); await pg.wait_for_timeout(600)
            chk = await pg.evaluate('()=>window.simbioPackCheck?window.simbioPackCheck():null')
            if not chk or not chk.get('pack'): problems.append(f'{label}: the page did not load the pack ({chk})')
            elif chk['errors']: problems += [f'{label}: {e}' for e in chk['errors']]
            await pg.screenshot(path=str(shots / f'{label}-1-welcome.png'))
            ob = []
            for i in range(10):
                if await pg.is_visible('#game'): break
                ob.append(await pg.inner_text('#obCopy'))
                if i == 2: await pg.screenshot(path=str(shots / f'{label}-2-onboarding.png'))
                await pg.click('#obNext')
            await pg.wait_for_timeout(200)
            await pg.screenshot(path=str(shots / f'{label}-3-first-lesson.png'))
            if label == 'desktop':
                r = await pg.evaluate(PLAY)
                text = '\n'.join(ob + r['L'])
                (ed / 'transcript.txt').write_text('\n\n=====\n'.join(ob + r['L']))
                await pg.wait_for_timeout(700); await pg.screenshot(path=str(shots / 'desktop-4-ending.png'), full_page=False)
                if not r['ended']: problems.append('the game did not reach the ending')
                for bad in ('undefined', 'NaN', '[object', '{co}', '{name}', '{code}', '{dis}', '{target}'):
                    if bad in text: problems.append(f'"{bad}" appears in the game text')
                for k, s in (pack.get('story') or {}).items():
                    if s.get('text', '').split('{')[0][:40].replace('<', '').replace('>', '') not in text.replace('\u2019', "'"):
                        problems.append(f'story.{k} never appeared (is the step reached in a normal run?)')
                if pack.get('today') and 'From here on, you are playing the road ahead' not in text: problems.append('the "today" checkpoint never appeared')
                print(f'played to the end in {r["years"]} game years, {len(r["L"])} cards')
            problems += [f'{label}: page error {e}' for e in errs]
            await pg.close()
        await b.close()
    srv.shutdown(); shutil.rmtree(work, ignore_errors=True)
    print('PASS' if not problems else 'FAIL'); [print(' -', x) for x in problems]
    print('screenshots:', ', '.join(sorted(x.name for x in shots.iterdir())))
    return 1 if problems else 0
sys.exit(asyncio.run(main()))
