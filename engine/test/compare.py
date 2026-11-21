"""Regression: classic simbio.html vs engine (no pack) with a seeded RNG must produce identical text."""
import asyncio, sys, json, pathlib, re
from playwright.async_api import async_playwright
HERE=pathlib.Path(__file__).resolve().parent
sys.argv=[sys.argv[0],'-','guided','a']
src=(HERE/'run2.py').read_text()
JS=re.search(r'JS = """(.*?)"""',src,re.S).group(1)
HOOK=re.search(r'HOOK = "(.*?)"\n',src).group(1)
PRE='<!doctype html><meta charset=utf-8><body style="margin:0"><script>let __f=0;const __pn=performance.now.bind(performance);performance.now=()=>__pn()+__f;window.__adv=(ms)=>{__f+=ms};let __s=12345;Math.random=()=>{__s|=0;__s=__s+0x6D2B79F5|0;let t=Math.imul(__s^__s>>>15,1|__s);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296}</script>'
async def run(pg,html,area,mod,mode,ch):
    out=HERE/'_cmp.html';out.write_text(PRE+html.replace("setInterval(tick,100);",HOOK))
    await pg.goto(out.as_uri())
    ob=[]
    for _ in range(12):
        if await pg.is_visible('#game'):break
        ob.append(await pg.inner_text('#obCopy'))
        if await pg.query_selector('#inName'):await pg.fill('#inName','Testco Bio')
        for k,v in (('area',area),('mod',mod),('mode',mode)):
            if await pg.query_selector(f'.opt[data-k="{k}"][data-v="{v}"]'):await pg.click(f'.opt[data-k="{k}"][data-v="{v}"]')
        await pg.click('#obNext')
    r=await pg.evaluate(JS.replace('__CH__',ch))
    dom=await pg.evaluate("()=>document.getElementById('game').innerText")
    return ob,r,dom
async def main():
    old=(HERE.parent.parent.parent/'game'/'simbio.html').read_text()
    new=(HERE/'engine-inline.html').read_text().replace('__PACK__','',1)
    async with async_playwright() as p:
        b=await p.chromium.launch()
        allok=True
        for area in ('eczema','nsclc','mg'):
            for mod in ('antibody','small'):
                for mode,ch in (('guided','a'),('real','b')):
                    res=[]
                    for h in (old,new):
                        pg=await b.new_page();errs=[];pg.on('pageerror',lambda e:errs.append(str(e)))
                        await pg.route('**/fonts.*/**',lambda r:r.abort())
                        res.append(await run(pg,h,area,mod,mode,ch)+(errs,));await pg.close()
                    (o1,r1,d1,e1),(o2,r2,d2,e2)=res
                    same=o1==o2 and r1==r2 and d1==d2
                    allok&=same and not e1 and not e2
                    diff=''
                    if not same:
                        L1,L2=o1+r1['L'],o2+r2['L']
                        for i,(x,y) in enumerate(zip(L1,L2)):
                            if x!=y:diff=f'first diff #{i}: {x[:120]!r} || {y[:120]!r}';break
                        else: diff=f'len {len(L1)} vs {len(L2)}; dom same {d1==d2}'
                    print(area,mod,mode,ch,'IDENTICAL' if same else 'DIFF',len(r1['L']),'modals',r1['weeks'],'wks',e1[:1],e2[:1],diff)
        print('ALL IDENTICAL' if allok else 'MISMATCH')
        await b.close()
asyncio.run(main())
