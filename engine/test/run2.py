"""Drive SimBio end to end with simulated time.
usage: python3 run2.py <pack.json|-> <guided|real> <a|b> [area mod]   (area/mod only for classic)
"""
import asyncio, sys, json, pathlib
from playwright.async_api import async_playwright
HERE = pathlib.Path(__file__).resolve().parent
pack, mode, ch = sys.argv[1:4]
area, mod = (sys.argv[4:6] + [None, None])[:2]
JS = """()=>{
  const CH='__CH__';const S=__S;let steps=0;const L=[],gates=[];
  while(!S().ended&&steps<200000){steps++;
    let guard=0;
    while(!document.getElementById('modal').hidden&&!S().ended&&guard++<20){
      const card=document.getElementById('modalCard');L.push(card.innerText);
      if(document.getElementById('gCheck')){
        const m=__cm(),G=__G[m.gate](__ctx());
        const wrong=(G.q.r+1)%G.q.a.length;document.getElementById('gq_'+wrong).checked=true;document.getElementById('gCheck').click();
        const fbWrong=document.getElementById('gFb').textContent;
        document.getElementById('gq_'+G.q.r).checked=true;document.getElementById('gCheck').click();
        L.push('[GATE '+m.id+' after correct] '+card.innerText);
        gates.push(m.id+':'+(fbWrong.startsWith('Not quite')?'gated':'NOT-GATED'));
        const os=[...document.querySelectorAll('#gDecide [data-o]')];
        if(os.length){(CH==='b'?(os[1]||os[0]):os[0]).click()} else document.getElementById('gPass').click();
      } else __close();
    }
    const s=S();
    if(s.sci<20&&s.cash>200000)document.getElementById('btnHire').click();
    if(s.flags.ind&&s.sites<40)document.getElementById('btnSite').click();
    if(s.flags.launched){if(s.reps<300)document.getElementById('btnReps').click();
      if(!document.getElementById('btnBio').disabled&&s.lines<8)document.getElementById('btnBio').click();}
    document.querySelectorAll('#upgrades [data-u]').forEach(b=>{if(!b.disabled)__ups(b.dataset.u)});
    for(const k in s.trials)if(s.trials[k].state==='failed')__rerun(k);
    __go();__adv(1000);__t();
  }
  let g2=0;while(!document.getElementById('fCheck')&&g2++<10){L.push(document.getElementById('modalCard').innerText);__close()}const card=document.getElementById('modalCard');L.push('[ENDING] '+card.innerText);
  const s=S();return {steps,weeks:Math.round(s.week),helped:Math.round(s.helped),ended:s.ended,approved:Object.keys(s.approved),notes:s.notes.length,partner:s.partner,p2plan:s.p2plan,price:s.priceMult,expOrder:s.expOrder,L,gates}}"""
HOOK = "window.__t=tick;window.__S=()=>S;window.__go=startMilestone;window.__close=closeModal;window.__ups=buyUp;window.__rerun=rerun;window.__G=GATES;window.__cm=currentMilestone;window.__ctx=ctx;"

async def main():
    html = (HERE/'engine-inline.html').read_text()
    body = '__PACK__' if pack == '-' else json.dumps(json.load(open(pack)), ensure_ascii=False).replace('</', '<\\/')
    html = html.replace('__PACK__', body, 1).replace("setInterval(tick,100);", HOOK)
    out = HERE/'_run.html'
    out.write_text('<!doctype html><meta charset=utf-8><body style="margin:0"><script>let __f=0;const __pn=performance.now.bind(performance);performance.now=()=>__pn()+__f;window.__adv=(ms)=>{__f+=ms}</script>' + html)
    async with async_playwright() as p:
        b = await p.chromium.launch(); pg = await b.new_page()
        errs = []; pg.on('pageerror', lambda e: errs.append(str(e)))
        await pg.route('**/fonts.*/**', lambda r: r.abort())
        await pg.goto(out.as_uri())
        chk = await pg.evaluate("()=>window.simbioPackCheck&&window.simbioPackCheck()")
        ob = []
        for _ in range(12):
            if await pg.is_visible('#game'): break
            ob.append(await pg.inner_text('#obCopy'))
            if await pg.query_selector('#inName'): await pg.fill('#inName', 'Testco Bio')
            for key, val in (('area', area), ('mod', mod), ('mode', mode)):
                if val and await pg.query_selector(f'.opt[data-k="{key}"][data-v="{val}"]'):
                    await pg.click(f'.opt[data-k="{key}"][data-v="{val}"]')
            await pg.click('#obNext')
        res = await pg.evaluate(JS.replace('__CH__', ch))
        L = res.pop('L'); g = res.pop('gates')
        tag = pathlib.Path(pack).stem if pack != '-' else f'classic_{area}_{mod}'
        (HERE/f'lessons_{tag}_{mode}_{ch}.txt').write_text('\n\n=====\n'.join(ob + L))
        bad = [l[:100] for l in ob + L if any(x in l for x in ('undefined', 'null', 'NaN', '[object', '{co}', '{name}', '{code}', '{dis}', '{target}'))]
        print(tag, mode, ch, json.dumps(res), '| gated:', all(x.endswith(':gated') for x in g), len(g), '| modals', len(L), '| bad', bad[:4], '| errors', errs[:3], '| check', None if not chk else {k: chk[k] for k in ('errors', 'warnings')})
        await b.close()
asyncio.run(main())
