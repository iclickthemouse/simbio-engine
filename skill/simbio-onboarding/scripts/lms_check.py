#!/usr/bin/env python3
"""Test a SimBio LMS package the way an LMS would run it, with no LMS needed.
usage: python3 lms_check.py PACKAGE.zip
SCORM 1.2 / 2004: loads the package under a strict mock SCORM API. xAPI: launches it against a mock LRS.
Session 1 plays partway and exits; session 2 must resume, finish, pass the final check and exit.
Prints PASS or FAIL with what the LMS would record."""
import asyncio, json, pathlib, re, shutil, sys, tempfile, threading, functools, http.server, zipfile, urllib.parse
from playwright.async_api import async_playwright

pkg = pathlib.Path(sys.argv[1]).resolve()
work = pathlib.Path(tempfile.mkdtemp(prefix='simbio-lms-'))
with zipfile.ZipFile(pkg) as z: z.extractall(work / 'pkg')
P = work / 'pkg'
problems, notes = [], []
if (P / 'imsmanifest.xml').exists():
    man = (P / 'imsmanifest.xml').read_text()
    kind = 'scorm2004' if '2004' in re.search(r'<schemaversion>(.*?)</schemaversion>', man).group(1) else 'scorm12'
    listed = set(re.findall(r'<file href="([^"]+)"', man))
    for f in P.rglob('*'):
        rel = f.relative_to(P).as_posix()
        if f.is_file() and rel != 'imsmanifest.xml' and rel not in listed: problems.append(f'{rel} is in the zip but not in imsmanifest.xml')
    for rel in listed:
        if not (P / rel).is_file(): problems.append(f'imsmanifest.xml lists {rel} but the zip has no such file')
    mastery = re.search(r'<adlcp:masteryscore>(\d+)</adlcp:masteryscore>', man)
    mastery = re.search(r'<imsss:minNormalizedMeasure>([\d.]+)<', man).group(1) if kind == 'scorm2004' else mastery.group(1)
elif (P / 'tincan.xml').exists():
    kind = 'xapi'; tc = (P / 'tincan.xml').read_text()
    aid = re.search(r'<activity id="([^"]+)"', tc).group(1)
    if '<launch lang="en-US">index.html</launch>' not in tc: problems.append('tincan.xml does not launch index.html')
else:
    sys.exit('not a SimBio LMS package: no imsmanifest.xml or tincan.xml')

HOOK = ("window.__t=tick;window.__S=()=>S;window.__go=startMilestone;window.__close=closeModal;window.__ups=buyUp;"
        "window.__rerun=rerun;window.__G=GATES;window.__cm=currentMilestone;window.__ctx=ctx;")
js = (P / 'engine.js').read_text()
if 'setInterval(tick,100);' not in js: sys.exit('engine.js is not a SimBio engine build')
(P / 'engine.js').write_text(js.replace('setInterval(tick,100);', HOOK))
idx = (P / 'index.html').read_text()
(P / 'index.html').write_text(idx.replace('<head>', '<head><script>let __f=0;const __pn=performance.now.bind(performance);performance.now=()=>__pn()+__f;window.__adv=ms=>{__f+=ms}</script>', 1))

# strict mock SCORM API in a parent page; values live in the parent's sessionStorage across "launches"
MOCK = r'''<!doctype html><meta charset="utf-8"><title>mock LMS</title><body style="margin:0">
<script>
const V4=__V4__;const store=()=>JSON.parse(sessionStorage.cmi||'{}');const put=c=>sessionStorage.cmi=JSON.stringify(c);
window.__log=JSON.parse(sessionStorage.log||'[]');const log=(...a)=>{__log.push(a);sessionStorage.log=JSON.stringify(__log)};
let open=false,err='0';
const ok12=/^cmi\.(core\.(lesson_status|lesson_location|score\.(raw|min|max)|session_time|exit)|suspend_data|interactions\.\d+\.(id|type|student_response|result|correct_responses\.0\.pattern))$/;
const ok04=/^cmi\.(completion_status|success_status|location|progress_measure|score\.(raw|min|max|scaled)|session_time|exit|suspend_data|interactions\.\d+\.(id|type|timestamp|description|learner_response|result|correct_responses\.0\.pattern))$/;
function getv(k){const c=store();if(k==='cmi.interactions._count')return String(Object.keys(c).filter(x=>/^cmi\.interactions\.\d+\.id$/.test(x)).length);
  if(k==='cmi.core.entry'||k==='cmi.entry')return c['cmi.suspend_data']?'resume':'ab-initio';return k in c?c[k]:''}
function setv(k,v){if(!open){err='132';log('SET-AFTER-CLOSE',k);return 'false'}if(!(V4?ok04:ok12).test(k)){err='401';log('BAD-KEY',k);return 'false'}
  const c=store();c[k]=String(v);put(c);log('set',k,String(v).slice(0,80));return 'true'}
const api={};
if(V4){Object.assign(api,{Initialize(){if(open){log('DOUBLE-INIT');return 'false'}open=true;log('Initialize');return 'true'},Terminate(){if(!open){log('DOUBLE-TERM');return 'false'}open=false;log('Terminate');return 'true'},
  GetValue:k=>getv(k),SetValue:setv,Commit(){log('Commit');return 'true'},GetLastError:()=>err,GetErrorString:()=>'',GetDiagnostic:()=>''});window.API_1484_11=api}
else{Object.assign(api,{LMSInitialize(){if(open){log('DOUBLE-INIT');return 'false'}open=true;log('LMSInitialize');return 'true'},LMSFinish(){if(!open){log('DOUBLE-TERM');return 'false'}open=false;log('LMSFinish');return 'true'},
  LMSGetValue:k=>getv(k),LMSSetValue:setv,LMSCommit(){log('LMSCommit');return 'true'},LMSGetLastError:()=>err,LMSGetErrorString:()=>'',LMSGetDiagnostic:()=>''});window.API=api}
const c=store();if(!Object.keys(c).length){if(V4){c['cmi.completion_status']='unknown';c['cmi.scaled_passing_score']='__MASTERY__'}else{c['cmi.core.lesson_status']='not attempted';c['cmi.student_data.mastery_score']='__MASTERY__'}put(c)}
window.launch=()=>{const f=document.createElement('iframe');f.name='sco';f.src='index.html';f.style.cssText='width:1280px;height:860px;border:0';document.body.appendChild(f)};
window.closeSco=()=>{const f=document.querySelector('iframe');if(f)f.remove()};
</script>'''
statements, xstate = [], {}
class H(http.server.SimpleHTTPRequestHandler):
    def log_message(self, *a): pass
    def _cors(self):
        self.send_header('Access-Control-Allow-Origin', '*'); self.send_header('Access-Control-Allow-Headers', '*'); self.send_header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS')
    def do_OPTIONS(self): self.send_response(204); self._cors(); self.end_headers()
    def _body(self): n = int(self.headers.get('Content-Length') or 0); return self.rfile.read(n) if n else b''
    def do_POST(self):
        if self.path.startswith('/xapi/statements?method=POST'):  # xAPI alternate request syntax (beacon at exit)
            form = urllib.parse.parse_qs(self._body().decode())
            if form.get('X-Experience-API-Version') != ['1.0.3'] or form.get('Authorization') != ['Basic dGVzdDp0ZXN0']: problems.append('exit beacon missing version or auth field')
            statements.append(json.loads(form['content'][0])); self.send_response(200); self._cors(); self.end_headers(); return
        if self.path.startswith('/xapi/statements'):
            if self.headers.get('X-Experience-API-Version') != '1.0.3' or self.headers.get('Authorization') != 'Basic dGVzdDp0ZXN0': problems.append('xAPI request missing version or auth header')
            statements.append(json.loads(self._body())); self.send_response(200); self._cors(); self.send_header('Content-Type', 'application/json'); self.end_headers(); self.wfile.write(b'["ok"]')
        else: self.send_response(404); self.end_headers()
    def do_PUT(self):
        if self.path.startswith('/xapi/activities/state'):
            q = urllib.parse.parse_qs(urllib.parse.urlparse(self.path).query); xstate[q['stateId'][0]] = self._body(); self.send_response(204); self._cors(); self.end_headers()
        else: self.send_response(404); self.end_headers()
    def do_DELETE(self): xstate.clear(); self.send_response(204); self._cors(); self.end_headers()
    def do_GET(self):
        if self.path.startswith('/xapi/activities/state'):
            q = urllib.parse.parse_qs(urllib.parse.urlparse(self.path).query); s = xstate.get(q['stateId'][0])
            if s is None: self.send_response(404); self._cors(); self.end_headers(); return
            self.send_response(200); self._cors(); self.send_header('Content-Type', 'application/json'); self.end_headers(); self.wfile.write(s); return
        super().do_GET()

PLAY = """(stop)=>{const S=__S;let n=0;
 const halt=()=>stop==='ind'?S().flags.ind:S().ended;
 while(!halt()&&n++<200000){let g=0;
  while(!document.getElementById('modal').hidden&&!S().ended&&g++<20){
   if(document.getElementById('gCheck')){const G=__G[__cm().gate](__ctx());const w=(G.q.r+1)%G.q.a.length;
    document.getElementById('gq_'+w).checked=true;document.getElementById('gCheck').click();
    document.getElementById('gq_'+G.q.r).checked=true;document.getElementById('gCheck').click();
    const os=[...document.querySelectorAll('#gDecide [data-o]')];if(os.length)os[0].click();else document.getElementById('gPass').click()}else __close()}
  const s=S();if(s.sci<20&&s.cash>2e5)document.getElementById('btnHire').click();if(s.flags.ind&&s.sites<40)document.getElementById('btnSite').click();
  if(s.flags.launched){if(s.reps<300)document.getElementById('btnReps').click();if(!document.getElementById('btnBio').disabled&&s.lines<8)document.getElementById('btnBio').click()}
  document.querySelectorAll('#upgrades [data-u]').forEach(b=>{if(!b.disabled)__ups(b.dataset.u)});
  for(const k in s.trials)if(s.trials[k].state==='failed')__rerun(k);__go();__adv(1000);__t()}
 let g=0;if(stop!=='ind')while(!document.getElementById('fCheck')&&g++<10)__close();
 return {week:Math.round(S().week),ind:!!S().flags.ind,ended:!!S().ended}}"""
QUIZ = """()=>{let rounds=0;const qs=[...document.querySelectorAll('#modalCard .q')];
 qs.forEach(q=>{const r=q.querySelector('input');if(r)r.checked=true});document.getElementById('fCheck').click();
 while(rounds++<5){let all=true;qs.forEach(q=>{const fb=q.querySelector('.fb');if(!fb.classList.contains('ok')){all=false;const rs=[...q.querySelectorAll('input')],i=rs.findIndex(x=>x.checked);(rs[i+1]||rs[0]).checked=true}});
  if(all)break;document.getElementById('fCheck').click()}
 return document.getElementById('fScore').textContent}"""

async def main():
    class Srv(http.server.ThreadingHTTPServer):
        def handle_error(self, *a): pass  # a launch closing mid-download is normal
    srv = Srv(('127.0.0.1', 0), functools.partial(H, directory=str(P)))
    threading.Thread(target=srv.serve_forever, daemon=True).start()
    base = f'http://127.0.0.1:{srv.server_address[1]}'
    async with async_playwright() as pw:
        b = await pw.chromium.launch(); ctx = await b.new_context(); pg = await ctx.new_page(); errs = []
        pg.on('pageerror', lambda e: errs.append(str(e)))
        await pg.route('**/fonts.*/**', lambda r: r.abort())
        if kind != 'xapi':
            (P / 'mock-lms.html').write_text(MOCK.replace('__V4__', 'true' if kind == 'scorm2004' else 'false').replace('__MASTERY__', mastery))
            await pg.goto(base + '/mock-lms.html')
            async def frame():
                await pg.evaluate('launch()'); await pg.wait_for_timeout(900)
                return pg.frame(name='sco')
            async def close(): await pg.evaluate('closeSco()'); await pg.wait_for_timeout(300)
        else:
            actor = json.dumps({'name': ['Test Learner'], 'mbox': ['mailto:learner@example.com']})  # old Tin Can array form on purpose
            q = urllib.parse.urlencode({'endpoint': base + '/xapi/', 'auth': 'Basic dGVzdDp0ZXN0', 'actor': actor, 'registration': '0b8a4c7e-1d5f-4b8e-9a51-2f6a1c3d4e5f', 'activity_id': aid})
            # launch in a frame, the way most LMSs do, and close by removing it
            (P / 'mock-lms.html').write_text('<!doctype html><meta charset="utf-8"><body style="margin:0"><script>window.launch=u=>{const f=document.createElement("iframe");f.name="sco";f.src=u;f.style.cssText="width:1280px;height:860px;border:0";document.body.appendChild(f)};window.closeSco=()=>{const f=document.querySelector("iframe");if(f)f.remove()}</script>')
            await pg.goto(base + '/mock-lms.html')
            async def frame():
                await pg.evaluate('u=>launch(u)', 'index.html?' + q); await pg.wait_for_timeout(1500); return pg.frame(name='sco')
            async def close(): await pg.evaluate('closeSco()'); await pg.wait_for_timeout(1500)
        # session 1: onboarding, play to the IND, leave
        f = await frame()
        for _ in range(10):
            if await f.is_visible('#game'): break
            if await f.query_selector('#inName'): await f.fill('#inName', 'Testco Bio')
            await f.click('#obNext')
        r1 = await f.evaluate(PLAY, 'ind'); await f.evaluate('()=>__t()'); await f.wait_for_timeout(1500)  # a person pauses before closing
        await close()
        # session 2: must resume where it left off, then finish
        f = await frame()
        resumed = await f.evaluate('()=>({game:!document.getElementById("game").hidden,ind:!!(window.__S()&&__S().flags.ind),week:window.__S()?Math.round(__S().week):0})')
        if not (resumed['game'] and resumed['ind']): problems.append(f'session 2 did not resume (saw {resumed}); progress would be lost between LMS launches')
        r2 = await f.evaluate(PLAY, 'end')
        if not r2['ended']: problems.append('the game did not reach the ending')
        score = await f.evaluate(QUIZ); await f.wait_for_timeout(1500)
        await close()
        if kind != 'xapi':
            await pg.goto(base + '/mock-lms.html')
            cmi, log = await pg.evaluate('[JSON.parse(sessionStorage.cmi||"{}"),JSON.parse(sessionStorage.log||"[]")]')
        await b.close()
    srv.shutdown()
    problems.extend(f'page error: {e}' for e in errs)
    print(f'{pkg.name}: {kind}')
    if kind != 'xapi':
        v4 = kind == 'scorm2004'
        for bad in ('BAD-KEY', 'SET-AFTER-CLOSE', 'DOUBLE-INIT', 'DOUBLE-TERM'):
            for e in log:
                if e[0] == bad: problems.append(f'{bad}: {e[1:]}')
        inits = sum(1 for e in log if e[0] in ('Initialize', 'LMSInitialize')); terms = sum(1 for e in log if e[0] in ('Terminate', 'LMSFinish'))
        if inits != 2 or terms != 2: problems.append(f'expected 2 initialize and 2 terminate calls (one per session), saw {inits} and {terms}')
        g = lambda k: cmi.get(k, '')
        susp = g('cmi.suspend_data'); n_int = len([k for k in cmi if re.fullmatch(r'cmi\.interactions\.\d+\.id', k)])
        if v4:
            want = {'cmi.completion_status': 'completed', 'cmi.success_status': 'passed', 'cmi.exit': 'normal'}
            for k, v in want.items():
                if g(k) != v: problems.append(f'{k} is "{g(k)}", expected "{v}"')
            if not re.fullmatch(r'PT\d+H\d+M\d+S', g('cmi.session_time')): problems.append(f'bad cmi.session_time {g("cmi.session_time")!r}')
            if float(g('cmi.score.scaled') or -1) < float(mastery): problems.append('score.scaled is below the passing score')
            if not g('cmi.progress_measure'): problems.append('cmi.progress_measure was never set')
            bad_res = [k for k in cmi if k.endswith('.result') and cmi[k] not in ('correct', 'incorrect')]
            print(f'  completion {g("cmi.completion_status")} · success {g("cmi.success_status")} · score {g("cmi.score.raw")}/{g("cmi.score.max")} (scaled {g("cmi.score.scaled")}) · progress {g("cmi.progress_measure")}')
        else:
            if g('cmi.core.lesson_status') != 'passed': problems.append(f'cmi.core.lesson_status is "{g("cmi.core.lesson_status")}", expected "passed"')
            if g('cmi.core.exit') != '': problems.append(f'cmi.core.exit is "{g("cmi.core.exit")}" after finishing, expected ""')
            if not re.fullmatch(r'\d{2,4}:\d{2}:\d{2}(\.\d{1,2})?', g('cmi.core.session_time')): problems.append(f'bad cmi.core.session_time {g("cmi.core.session_time")!r}')
            if int(g('cmi.core.score.raw') or 0) < int(mastery): problems.append('score.raw is below the mastery score')
            if len(susp) > 4096: problems.append(f'suspend_data is {len(susp)} characters; SCORM 1.2 allows 4096')
            bad_res = [k for k in cmi if k.endswith('.result') and cmi[k] not in ('correct', 'wrong')]
            print(f'  lesson_status {g("cmi.core.lesson_status")} · score {g("cmi.core.score.raw")}/100 (mastery {mastery})')
        if bad_res: problems.append(f'invalid interaction results: {bad_res[:3]}')
        try: json.loads(susp)
        except Exception: problems.append('suspend_data is not readable')
        if n_int < 10: problems.append(f'only {n_int} interactions recorded')
        print(f'  {n_int} interactions · suspend_data {len(susp)} chars · location {g("cmi.location") or g("cmi.core.lesson_location")}')
    else:
        verbs = [s['verb']['id'].rsplit('/', 1)[1] for s in statements]
        for v in ('initialized', 'progressed', 'answered', 'resumed', 'completed', 'passed'):
            if v not in verbs: problems.append(f'no "{v}" statement was sent')
        for v in ('suspended', 'terminated'):  # sent while the page closes, which browsers only do on a best-effort basis
            if v not in verbs: notes.append(f'the "{v}" exit statement did not arrive this run (best effort; completion and score never depend on it)')
        if any(s['actor'].get('mbox') != 'mailto:learner@example.com' for s in statements): problems.append('actor was not normalized from the launch parameters')
        if any(s.get('context', {}).get('registration') != '0b8a4c7e-1d5f-4b8e-9a51-2f6a1c3d4e5f' for s in statements): problems.append('statements are missing the launch registration')
        if any(s['object']['id'].split('/')[0:5] != aid.split('/')[0:5] for s in statements): problems.append('statement objects do not use the package activity id')
        passed = [s for s in statements if s['verb']['id'].endswith('/passed')]
        if passed and not passed[-1]['result'].get('success'): problems.append('passed statement has success false')
        if 'simbio-state' not in xstate: problems.append('progress was never saved to the LRS state API')
        from collections import Counter
        print('  statements: ' + ', '.join(f'{v} {n}' for v, n in Counter(verbs).items()))
        if passed: sc = passed[-1]['result']['score']; print(f'  score {sc["raw"]}/{sc["max"]} (scaled {sc["scaled"]})')
    print(f'  session 1 left at week {r1["week"]} · session 2 resumed at week {resumed["week"]} and finished at week {r2["week"]} · final check: {score}')
    shutil.rmtree(work, ignore_errors=True)
    [print('  note:', n) for n in notes]
    print('PASS' if not problems else 'FAIL'); [print('  -', p) for p in problems]
    return 1 if problems else 0
sys.exit(asyncio.run(main()))
