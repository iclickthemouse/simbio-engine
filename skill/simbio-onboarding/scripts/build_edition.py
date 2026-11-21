#!/usr/bin/env python3
"""Build a company edition page from a pack. usage: python3 build_edition.py pack.json out_dir
Writes out_dir/index.html (the page) and out_dir/pack.json (kept for later updates).
If company.logo (and optionally company.logoDark) name image files next to pack.json, they are copied
into out_dir and shown in the header and on the welcome screen (branded editions only)."""
import json, sys, pathlib, html, shutil
FONTS = ('<link rel="preconnect" href="https://fonts.googleapis.com">\n'
         '<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>\n'
         '<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@600&text=COKEDBYMIKLAR.SGN&display=swap">\n'
         '<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Atkinson+Hyperlegible:ital,wght@0,400;0,700;1,400&family=Bricolage+Grotesque:opsz,wght@12..96,500;12..96,700;12..96,800&family=IBM+Plex+Mono:wght@400;500;600&display=swap">\n')
# Puts the company logo in the header wordmark (in place of the name tag) and above the welcome title.
# logoDark, when given, is swapped in for dark mode. Runs after the engine; if anything fails, the name tag stays.
BRAND_CSS = ('<style>.edtag.co-logo{display:inline-flex;align-items:center;padding-left:10px}'
             '.edtag.co-logo img{height:22px;width:auto;max-width:160px;display:block}'
             '.co-logo-hero{display:block;height:48px;width:auto;max-width:260px;margin:0 0 18px}'
             '.co-logo-d{display:none!important}'
             '@media(prefers-color-scheme:dark){:root:not([data-theme=light]) .has-dark .co-logo-l{display:none!important}:root:not([data-theme=light]) .has-dark .co-logo-d{display:block!important}}'
             ':root[data-theme=dark] .has-dark .co-logo-l{display:none!important}:root[data-theme=dark] .has-dark .co-logo-d{display:block!important}'
             '</style>\n')
BRAND_JS = r'''<script>(function(){try{
var P=JSON.parse(document.getElementById('simbio-pack').textContent),C=P.company||{};if(!C.logo||P.unofficial)return;
var name=C.shortName||C.name||'',esc=function(s){return String(s).replace(/[&"<>]/g,function(c){return'&#'+c.charCodeAt(0)+';'})};
function imgs(cls){var a='<img class="co-logo-l '+cls+'" src="'+esc(C.logo)+'" alt="'+esc(name)+'">';
 if(C.logoDark)a+='<img class="co-logo-d '+cls+'" src="'+esc(C.logoDark)+'" alt="'+esc(name)+'">';return a}
function apply(){
 document.querySelectorAll('.wordmark .edtag:not(.co-logo)').forEach(function(t){t.classList.add('co-logo');if(C.logoDark)t.classList.add('has-dark');t.innerHTML=imgs('')});
 var ob=document.getElementById('obCopy');
 if(ob&&ob.querySelector('#obTitle')&&!ob.querySelector('.co-logo-hero')&&ob.querySelector('.lbl')){var w=document.createElement('div');if(C.logoDark)w.className='has-dark';w.innerHTML=imgs('co-logo-hero');ob.insertBefore(w,ob.firstChild)}
}
apply();new MutationObserver(apply).observe(document.documentElement,{childList:true,subtree:true});
}catch(e){}})();</script>
'''
pack_path, out = pathlib.Path(sys.argv[1]), pathlib.Path(sys.argv[2])
pack = json.loads(pack_path.read_text(encoding='utf-8'))
out.mkdir(parents=True, exist_ok=True)
co = pack.get('company', {})
name = co.get('shortName') or co.get('name') or 'Company'
brand = ''
if co.get('logo') and not pack.get('unofficial'):
    for k in ('logo', 'logoDark'):
        if co.get(k):
            src = pack_path.parent / co[k]
            if not src.is_file(): sys.exit(f'company.{k}: {src} not found next to pack.json')
            shutil.copy(src, out / pathlib.Path(co[k]).name)
            co[k] = pathlib.Path(co[k]).name
    brand = BRAND_CSS + BRAND_JS
body = json.dumps(pack, ensure_ascii=True, indent=1).replace('</', '<\\/')  # ASCII-only, so page encoding never matters
page = ('<!DOCTYPE html>\n<meta charset="utf-8">\n' + f'<title>{html.escape(name)} {"SimBio (unofficial)" if pack.get("unofficial") else "onboarding"}</title>\n'
        f'<meta name="description" content="{html.escape(name)} onboarding: retrace the company\'s path from the lab to patients.">\n'
        + FONTS + '<link rel="stylesheet" href="engine.css">\n'
        '<script id="simbio-pack" type="application/json">\n' + body + '\n</script>\n'
        '<script src="engine.js"></script>\n' + brand)
page = page.encode('ascii', 'xmlcharrefreplace').decode('ascii')
(out / 'index.html').write_text(page, encoding='utf-8')
(out / 'pack.json').write_text(json.dumps(pack, ensure_ascii=False, indent=1), encoding='utf-8')
print('wrote', out / 'index.html', len(page), 'bytes' + (' with logo' if brand else ''))
