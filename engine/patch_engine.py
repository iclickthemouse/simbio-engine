#!/usr/bin/env python3
"""Turn classic SimBio (game/simbio.html) into the pack-aware SimBio Engine.

Outputs
  dist/engine.css      styles
  dist/engine.js       markup + game; reads <script id="simbio-pack" type="application/json">
  test/engine-inline.html  single file with a __PACK__ slot, for the Playwright harness
With no pack the engine behaves exactly like classic SimBio.
"""
import json, re, pathlib
ROOT = pathlib.Path(__file__).resolve().parent
src = (ROOT.parent / 'game' / 'simbio.html').read_text()
ENGINE_VERSION = '1.0.0'

def rep(old, new, count=1):
    global src
    n = src.count(old)
    if n != count:
        raise SystemExit(f'expected {count} match(es), found {n}:\n{old[:160]}')
    src = src.replace(old, new)

# ---------------------------------------------------------------- pack parse
rep(r'''const esc=t=>String(t).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));''',
r'''const esc=t=>String(t).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));

/* =================== CONTENT PACK =================== */
// A company edition embeds a JSON pack in <script id="simbio-pack" type="application/json">.
// With no pack this is classic SimBio. Pack text is plain text: angle brackets are neutralized.
const PACK=(()=>{const el=document.getElementById('simbio-pack'),t=el&&el.textContent.trim();if(!t||t==='__PACK__')return null;
  const clean=v=>typeof v==='string'?v.replace(/</g,'&lt;').replace(/>/g,'&gt;'):Array.isArray(v)?v.map(clean):v&&typeof v==='object'?Object.fromEntries(Object.entries(v).map(([k,x])=>[k,clean(x)])):v;
  try{const p=JSON.parse(t);if(!p||typeof p!=='object'||Array.isArray(p))throw new Error('the pack must be a JSON object');return clean(p)}
  catch(e){window.__simbioPackError=String(e.message||e);console.error('SimBio content pack could not be read:',e);return null}})();
const P=PACK||{},PC=P.company||{},PG=P.program||{},CO=PC.shortName||PC.name||'the company';
const poss=n=>n+(/s$/i.test(n)?"'":"'s");
const TRACK={immunology:'eczema',chronic:'eczema',oncology:'nsclc',rare:'mg',eczema:'eczema',nsclc:'nsclc',mg:'mg'};
window.simbioEngine={version:'__VER__',pack:PACK};
(function brand(){if(!PACK)return;const ok=x=>/^#[0-9a-f]{6}$/i.test(x||'');if(!ok(PC.accent))return;
  const h=x=>[1,3,5].map(i=>parseInt(x.slice(i,i+2),16)),hx=a=>'#'+a.map(v=>Math.round(Math.max(0,Math.min(255,v))).toString(16).padStart(2,'0')).join(''),mix=(a,b,t)=>a.map((v,i)=>v+(b[i]-v)*t);
  const lum=a=>{const c=a.map(v=>{v/=255;return v<=.03928?v/12.92:Math.pow((v+.055)/1.055,2.4)});return .2126*c[0]+.7152*c[1]+.0722*c[2]};
  const ink=a=>{const l=lum(a);return (1.05/(l+.05))>=((l+.05)/(lum([11,18,32])+.05))?'#FFFFFF':'#0B1220'};
  const L=h(PC.accent),D=ok(PC.accentDark)?h(PC.accentDark):mix(L,[255,255,255],.45),dk=[21,30,29];
  const LV={'--accent':hx(L),'--accent-ink':ink(L),'--accent-soft':hx(mix(L,[255,255,255],.88))},DV={'--accent':hx(D),'--accent-ink':ink(D),'--accent-soft':hx(mix(D,dk,.8))};
  const decl=v=>Object.entries(v).map(([k,x])=>k+':'+x).join(';'),root=document.documentElement;
  // Doubled :root outranks engine.css wherever the host puts the stylesheet link.
  const st=document.createElement('style');st.id='simbio-brand';
  st.textContent=':root:root{'+decl(LV)+'}@media (prefers-color-scheme: dark){:root:root:not([data-theme="light"]){'+decl(DV)+'}}:root:root[data-theme="dark"]{'+decl(DV)+'}';
  (document.body||document.head).appendChild(st);
  const isDark=()=>root.dataset.theme==='dark'||(root.dataset.theme!=='light'&&matchMedia('(prefers-color-scheme: dark)').matches);
  if(getComputedStyle(root).getPropertyValue('--accent').trim().toLowerCase()!==(isDark()?DV:LV)['--accent']){
    // A blocked style tag: set the colors on the root element instead, and follow theme changes.
    const set=()=>{const v=isDark()?DV:LV;for(const k in v)root.style.setProperty(k,v[k])};set();
    try{matchMedia('(prefers-color-scheme: dark)').addEventListener('change',set)}catch(e){}
    new MutationObserver(set).observe(root,{attributes:true,attributeFilter:['data-theme']})}})();
// Recolor the Storyset art to the brand accent. Images stay hidden until tinted; any failure falls back to the original art.
(function tintArt(){if(!PACK||!/^#[0-9a-f]{6}$/i.test(PC.accent||'')||/^#003fcc$/i.test(PC.accent))return;const A=PC.accent,cache={},root=document.documentElement;
  root.classList.add('tint');const giveUp=()=>root.classList.remove('tint');
  function go(img){const m=(img.getAttribute('src')||'').match(/^art\/([\w-]+)\.svg$/);if(!m)return;const k=m[1];img.dataset.art=k;
    if(cache[k]&&cache[k]!=='wait'){img.src=cache[k];return}if(cache[k]==='wait')return;cache[k]='wait';
    fetch('art/'+k+'.svg').then(r=>r.ok?r.text():Promise.reject(r.status)).then(t=>{cache[k]='data:image/svg+xml;charset=utf-8,'+encodeURIComponent(t.replace(/#003FCC/gi,A));
      document.querySelectorAll('img[data-art="'+k+'"]').forEach(i=>{if(/^art\//.test(i.getAttribute('src')||''))i.src=cache[k]})}).catch(giveUp)}
  new MutationObserver(ms=>ms.forEach(m=>{if(m.type==='attributes'){if(m.target.tagName==='IMG')go(m.target)}else m.addedNodes.forEach(n=>{if(n.nodeType!==1)return;if(n.tagName==='IMG')go(n);else n.querySelectorAll('img[src^="art/"]').forEach(go)})}))
    .observe(document.body,{subtree:true,childList:true,attributes:true,attributeFilter:['src']});
  setTimeout(()=>{if(!Object.values(cache).some(v=>v&&v!=='wait'))giveUp()},4000)})();
function fill(s){if(typeof s!=='string')return s;
  return s.replace(/\{(co|code|name|dis|target)\}/g,(_,k)=>{let dc=false;try{dc=!!(S&&S.flags.dc)}catch(e){}
    if(k==='co')return PACK?CO:'';if(k==='code')return PG.code||'';if(k==='name')return dc&&PG.drug?PG.drug:(PG.code||'');
    if(k==='dis')return AREAS.pack?AREAS.pack.dis:'';return PG.targetShort||''})}
function isOrphan(){return PACK?(P.disease&&typeof P.disease.orphan==='boolean'?P.disease.orphan:AREAS.pack.base==='mg'):S.cfg.area==='mg'}
function isBTD(){return PACK?(P.disease&&typeof P.disease.breakthrough==='boolean'?P.disease.breakthrough:AREAS.pack.base==='nsclc'):S.cfg.area==='nsclc'}
function packMod(){return P.modality?(P.modality.plain||'a '+String(P.modality.label||'medicine').toLowerCase()):PG.modality==='small'?'a small-molecule pill':'an antibody'}
function safeUrl(u){return typeof u==='string'&&/^https?:\/\/[^\s"']+$/i.test(u)?u:''}
function storyHTML(s,lbl){return '<div class="story"><b>'+(lbl||'Our story')+(s.when?' · '+s.when:'')+'</b><p>'+fill(s.text)+'</p>'+(s.quote&&s.quote.text?'<blockquote><p>“'+fill(s.quote.text)+'”</p>'+(s.quote.who?'<cite>'+s.quote.who+'</cite>':'')+'</blockquote>':'')+'</div>'}
function extrasHTML(n){return (n.story?storyHTML(n.story):'')+(n.vals||[]).map(v=>'<div class="story val"><b>Our values · '+v.name+'</b><p>'+fill(v.example)+'</p></div>').join('')+
  (n.ahead?'<div class="ahead"><b>The road ahead</b><p>'+CO+' has not reached this step yet. This is how the process usually continues.</p></div>':'')}''')

# ---------------------------------------------------------------- pack disease + modality
rep(r'''const MODES={
 guided:''', r'''if(PACK){const bk=TRACK[PG.track]||'eczema',bA=AREAS[bk],D=P.disease||{},bm=P.modality?(P.modality.app==='NDA'?'small':'antibody'):(PG.modality==='small'?'small':'antibody');
  const tr={};['p1','p2','p3'].forEach(k=>tr[k]=Object.assign({},bA.trials[k],(D.trials||{})[k]||{}));
  const ill='This is an illustrative example of where the science could lead, not an announced '+CO+' plan.';
  const ex=(D.expansions||[]).filter(e=>e&&e.id&&e.name).map(e=>{const n=e.note||{};return Object.assign({pop:20000,n:400,dur:40},e,{note:{h:n.h||e.name,b:(n.b||[]).concat(e.illustrative?[ill]:[]),m:n.m||''}})});
  AREAS.pack=Object.assign({},bA,{label:'Our disease',dis:'the disease',p2Text:'The main measure is how many patients improve on the standard scoring scale for the disease, compared with a control group.',p3Text:'Large randomized trials compare the drug with placebo or today\'s standard treatment on the main measure agreed with FDA.',priceText:'about what similar medicines cost'},D,
    {base:bk,custom:true,trials:tr,review:D.review?Object.assign({},bA.review,D.review):bA.review,exp:{all:ex}});
  if(P.modality)MODS.pack=Object.assign({},MODS[bm],P.modality,{base:bm,custom:true,app:MODS[bm].app,appLong:MODS[bm].appLong});
}
const MODES={
 guided:''')

# ---------------------------------------------------------------- milestone text, generalized for pack mode
rep(r'''t:C=>C.ab?'Build an antibody library':'Screen a compound library',d:C=>C.ab?'Create billions''',
    r'''t:C=>C.mc?'Generate candidate designs':C.ab?'Build an antibody library':'Screen a compound library',d:C=>C.mc?'Make and test many versions of the drug against the target.':C.ab?'Create billions''')
rep(r'''note:C=>C.ab?({h:'Finding keys: phage display',''',
    r'''note:C=>C.mc?({h:'Finding candidates',b:['Every drug program starts with many possible designs and narrows them down.','Scientists make and test candidates against the target, keeping the ones that act on it in the right way.','Most will not work well enough. A few become hits.'],m:'Many candidates in, a few good ones out.'}):C.ab?({h:'Finding keys: phage display',''')
rep(r'''   C.ab?'We measure how tightly each antibody binds''',
    r'''   C.mc?'We confirm each hit in several independent tests and measure how strongly it acts at different doses.':C.ab?'We measure how tightly each antibody binds''')
rep(r'''d:C=>C.ab?'Polish the best antibody''', r'''d:C=>C.mc?'Improve the best candidate so it can work as a medicine.':C.ab?'Polish the best antibody''')
rep(r'''fx:s=>{s.flags.lead=1},
  note:C=>C.ab?(''', r'''fx:s=>{s.flags.lead=1},
  note:C=>C.mc?({h:'Lead optimization',b:['Scientists improve the best candidate step by step: a stronger effect on the target, fewer effects elsewhere, and a form that can be made, stored and given to patients.','Each change is tested again, because fixing one property can break another.'],m:'A great candidate in the lab is not yet a medicine.'}):C.ab?(''')
rep(r'''   C.area==='mg'?'Our antibody blocks FcRn itself''', r'''   C.area==='mg'&&!C.pk?'Our antibody blocks FcRn itself''')
rep(r'''t:C=>C.ab?'Build a cell line':'Design the chemical synthesis',d:C=>C.ab?'Engineer''',
    r'''t:C=>C.mc?'Develop the manufacturing process':C.ab?'Build a cell line':'Design the chemical synthesis',d:C=>C.mc?'Find a safe, repeatable way to make the drug at scale.':C.ab?'Engineer''')
rep(r'''fx:s=>{s.flags.cmc=1},
  note:C=>C.ab?(''', r'''fx:s=>{s.flags.cmc=1},
  note:C=>C.mc?({h:'Chemistry, manufacturing and controls',b:['A process that works at the bench has to work at scale, the same way every time. Manufacturing scientists design and control each step.','Regulators review how a medicine is made as closely as they review the trial data.'],m:'A recipe that works once is not a process.'}):C.ab?(''')
rep(r'''   C.ab?'Antibodies are so specific''', r'''   C.mc?'The test species must respond to the drug the way people would, so they are chosen carefully.':C.ab?'Antibodies are so specific''')
rep(r'''   C.ab?'Cells grow in a steel tank''', r'''   C.mc?'Manufacturing teams make the first clinical batches under tightly controlled, documented conditions.':C.ab?'Cells grow in a steel tank''')
rep(r'''   (C.ab?'Antibodies are biologics, so we file a Biologics License Application (BLA).''',
    r'''   (C.mc?(C.M.appWhy||(C.ab?'Biologics are licensed through a Biologics License Application (BLA). Chemically made drugs use a New Drug Application (NDA) instead.':'Chemically made drugs are filed as a New Drug Application (NDA). Biologics use a Biologics License Application (BLA) instead.')):C.ab?'Antibodies are biologics, so we file a Biologics License Application (BLA).''')
rep(r'''   C.area==='eczema'&&!C.ab?'JAK inhibitors''', r'''   C.pk?(PG.labelRisk?fill(PG.labelRisk):'The most serious risks can appear in a boxed warning at the top of the label.'):C.area==='eczema'&&!C.ab?'JAK inhibitors''')

# ---------------------------------------------------------------- upgrades
rep(r'''when:s=>s.cfg.area==='mg'&&s.flags.dc,''', r'''when:s=>isOrphan()&&s.flags.dc,''')
rep(r'''when:s=>s.cfg.area==='nsclc'&&s.flags.p1ok,''', r'''when:s=>isBTD()&&s.flags.p1ok,''')
rep(r'''/* =================== STATE =================== */
const KEY='simbio-v3';''', r'''if(PACK&&P.titles)MAIN.concat(UPS).forEach(m=>{const o=P.titles[m.id];if(!o)return;
  if(o.t)m.t=typeof m.t==='function'?()=>fill(o.t):fill(o.t);if(o.d)m.d=typeof m.d==='function'?()=>fill(o.d):fill(o.d)});

/* =================== STATE =================== */
const KEY=PACK?'simbio-ed-'+String(PC.name||'company').toLowerCase().replace(/[^a-z0-9]+/g,'-')+'-v1':'simbio-v3';''')

# ---------------------------------------------------------------- config + context
rep(r'''function makeCfg(name,area,mod,mode){
''', r'''function makeCfg(name,area,mod,mode){
  if(PACK)return{company:CO,area:'pack',mod:P.modality?'pack':(PG.modality==='small'?'small':'antibody'),mode,code:PG.code||'PRG-101',drug:PG.drug||null,
    nameText:PG.nameText?fill(PG.nameText):PG.drug?'Generic names carry a "stem" that tells doctors what kind of medicine it is.':'Its official generic name has not been assigned yet, so we keep using the code.'};
''')
rep(r'''function ctx(){const c=S.cfg,A=AREAS[c.area],M=MODS[c.mod],ab=c.mod==='antibody';
  const tShort=ab?''', r'''function ctx(){const c=S.cfg,A=AREAS[c.area],M=MODS[c.mod],ab=(M.base||c.mod)==='antibody',pk=!!PACK;
  const tShort=pk?(PG.targetShort||'our target'):ab?''')
rep(r'''drug:c.drug,A,M,ab,area:c.area,app:M.app,dis:A.dis,target:A.target[c.mod],targetShort:tShort,evidence:typeof A.evidence==='string'?A.evidence:A.evidence[c.mod],''',
    r'''drug:c.drug,A,M,ab,pk,mc:!!M.custom,area:A.base||c.area,app:M.app,dis:A.dis,target:pk?(PG.target||tShort):A.target[c.mod],targetShort:tShort,
    evidence:pk?(PG.evidence||'the early evidence points to it'):typeof A.evidence==='string'?A.evidence:A.evidence[c.mod],plainMod:M.custom?packMod():ab?'an antibody':'a small molecule',''')
rep(r'''function expsBase(){const A=AREAS[S.cfg.area];return A.exp.all||A.exp[S.cfg.mod]}''',
    r'''function expsBase(){const A=AREAS[S.cfg.area],mk=MODS[S.cfg.mod].base||S.cfg.mod;if(A.exp.all&&A.exp.all.length)return A.exp.all;const B=AREAS[A.base||S.cfg.area];return B.exp.all||B.exp[mk]}''')
rep(r'''function trialCfg(id){const A=AREAS[S.cfg.area];''', r'''function trialCfg(id){const A=AREAS[S.cfg.area];''')

# ---------------------------------------------------------------- lessons
rep(r'''function noteFor(id){
  const C=ctx();
  if(id==='welcome')return{h:'Welcome to '+C.co,b:[''', r'''function noteFor(id){const n=noteBase(id);return n&&PACK?decorate(id,n):n}
function decorate(id,n){const o=Object.assign({},n),st=P.story&&P.story[id];
  if(st&&st.text)o.story=st;
  o.vals=(P.values||[]).filter(v=>v&&v.at===id&&v.example&&v.name);
  if(!o.story&&P.today&&id!=='today'){const L=allMain(),i=L.findIndex(m=>m.id===id),t=L.findIndex(m=>m.id===P.today.after);if(i>=0&&t>=0&&i>t)o.ahead=1}
  return o}
function noteBase(id){
  const C=ctx();
  if(PACK&&P.lessons&&P.lessons[id]&&P.lessons[id].h){const o=P.lessons[id];return{h:fill(o.h),b:(o.b||[]).map(fill),m:fill(o.m||'')}}
  if(PACK&&id==='today'){const T=P.today||{};return{h:fill(T.title||'You have caught up to today'),b:[fill(T.text||''),'From here on, you are playing the road ahead. The lessons still teach how the process works, but '+C.co+' has not taken these steps yet, and nothing that follows is a prediction.'],m:fill(T.next||'Every step from here is one '+C.co+' is still working toward.')}}
  if(PACK&&id==='welcome')return{h:'Day one at '+C.co,b:[
    'You are about to retrace '+poss(C.co)+' path from the very beginning, when the company was a small team with one idea.',
    'The bet: '+(PG.bet?fill(PG.bet):C.targetShort+' could be the key to treating '+C.dis)+'. If the company can build a medicine that does that safely, patients get better.',
    'Bringing one medicine to patients usually takes 10 to 15 years and over $1 billion once failures are counted. '+C.A.loa+' You will see why so many fail, and what it takes to keep going.'],
    m:'Start by clicking "Run an experiment". The bar at the top always tells you the next step.'};
  if(id==='welcome')return{h:'Welcome to '+C.co,b:[''')
rep(r'''<div class="body">'+n.b.filter(Boolean).map(x=>'<p>'+x+'</p>').join('')+'</div>'+(n.m?''',
    r'''<div class="body">'+n.b.filter(Boolean).map(x=>'<p>'+x+'</p>').join('')+'</div>'+(PACK?extrasHTML(n):'')+(n.m?''')
rep(r'''  }else if(it.kind==='intro'){
    card.innerHTML=ABOUT();''', r'''  }else if(it.kind==='intro'){
    card.innerHTML=ABOUT();
  }else if(it.kind==='glossary'){
    card.innerHTML='<h3 id="mTitle">Glossary</h3><dl class="gloss">'+(P.glossary||[]).filter(g=>g&&g.term).map(g=>'<div><dt>'+g.term+'</dt><dd>'+fill(g.def||'')+'</dd></div>').join('')+'</dl><div class="btns"><button class="primary" id="mOk">Close</button></div>';''')
rep(r'''const ID_ART={welcome:'laboratory',''', r'''const ID_ART={today:'launching',welcome:'laboratory',''')
rep(r'''const FINE='<div class="fineprint">''', r'''const FINE=PACK?finePack():'<div class="fineprint">''')
rep(r'''const ABOUT=()=>WORDMARK+''', r'''function finePack(){const full=PC.name||'this company',co=CO,as=P.asOf?' (current as of '+P.asOf+')':'';
  return '<div class="fineprint">'+(P.unofficial?'<p>This is an unofficial edition, made from public information. It is not affiliated with or endorsed by '+full+'.</p>':'')+(P.demo?'<p>'+full+' is a fictitious company, made up to demonstrate company editions of SimBio.</p>':'')+'<p>This is the '+full+' onboarding edition of SimBio, an educational game about how biotech works.</p><p>The company facts, values and "Our story" notes come from '+(P.unofficial?'public sources about '+co:co+' materials')+as+'. Everything else is a simulation: cash, trial sizes, timelines, results and odds are simplified game numbers, not '+co+' data or forecasts. Steps marked "The road ahead" show how the process usually continues, not '+co+' plans.</p><p>Investors, partners and rivals inside the game are fictitious composites, not real companies. Some science and processes are simplified to keep the game playable.</p><p>Nothing here is medical, regulatory or investment advice. Illustrations by <a href="https://storyset.com" target="_blank" rel="noopener">Storyset</a>.</p></div>'}
function aboutPack(){const co=CO,src=(P.sources||[]).filter(s=>s&&(s.title||s.url));
  return WORDMARK+'<h3 id="mTitle">About this edition</h3><p>'+(P.unofficial?'An unofficial '+(PC.name||co)+' edition of SimBio, made from public information.':'The '+(PC.name||co)+' onboarding edition of SimBio.')+' You retrace how '+co+' got where it is, with a short science lesson at every step and a review at every big decision.</p>'+
    (src.length?'<p class="lbl" style="margin-top:12px">Sources</p><ul class="srcs">'+src.map(s=>'<li>'+(safeUrl(s.url)?'<a href="'+safeUrl(s.url)+'" target="_blank" rel="noopener">'+(s.title||s.url)+'</a>':(s.title||''))+(s.note?' · '+s.note:'')+'</li>').join('')+'</ul>':'')+
    finePack()+'<p class="sub">SimBio engine '+window.simbioEngine.version+'.</p><div class="btns"><button class="primary" id="mOk">'+(S?'Back to the game':'Close')+'</button></div>'}
const ABOUT=()=>PACK?aboutPack():WORDMARK+''')

# ---------------------------------------------------------------- gates
rep(r'''cand:C=>{const spare={eczema:'JAK2',nsclc:'normal EGFR',mg:'related enzymes'}[C.area];''',
    r'''cand:C=>{const spare=C.pk?(PG.selectivity||'related proteins'):{eczema:'JAK2',nsclc:'normal EGFR',mg:'related enzymes'}[C.area];''')
rep(r'''   ev:C.ab?evTable(['Test','Lead A','Lead B'],[['Grip on the target''',
    r'''   ev:C.mc?evTable(['Test','Lead A','Lead B'],[['Strength of effect in cells','Stronger','Strong'],['Stability and ease of manufacturing','Poor','Good'],['Activity on look-alike targets','Some','None found']]):C.ab?evTable(['Test','Lead A','Lead B'],[['Grip on the target''')
rep(r'''     e:C.ab?'Both are potent enough. Clumping''',
    r'''     e:C.mc?'Strength is rarely the whole story. Lead B is stable, can be made consistently and leaves look-alike targets alone, which matters more than a small edge in strength.':C.ab?'Both are potent enough. Clumping''')
rep(r'''   ev:evList([(C.ab?'GLP toxicology in monkeys''', r'''   ev:evList([(C.mc?'GLP toxicology in a relevant animal species: no serious findings at the top dose':C.ab?'GLP toxicology in monkeys''')
rep(r'''p1:C=>{const T=AREAS[C.area].trials.p1,onc=C.area==='nsclc',mg=C.area==='mg';let ev,note;''',
    r'''p1:C=>{const T=C.A.trials.p1,onc=C.area==='nsclc',mg=C.area==='mg',mgx=mg&&!C.pk,inPt=C.pk&&!!C.A.p1InPatients,MD=C.mc&&Array.isArray(C.M.p1Doses)&&C.M.p1Doses.length===4?C.M.p1Doses:null,DN=C.mc?(C.M.doseNote?' ('+C.M.doseNote+')':''):null;let ev,note;''')
rep(r'''const per=Math.round(T.n/4),d=C.ab?['350 mg','700 mg','1,050 mg','1,400 mg']:['40 mg','80 mg','160 mg','240 mg'];''',
    r'''const per=Math.max(2,Math.round(T.n/4)),d=MD||(C.ab?['350 mg','700 mg','1,050 mg','1,400 mg']:['40 mg','80 mg','160 mg','240 mg']);''')
rep(r'''ev=evTable(['Dose'+(C.ab?' (IV, every 2 weeks)':' (daily pill)'),''', r'''ev=evTable(['Dose'+(DN!==null?DN:C.ab?' (IV, every 2 weeks)':' (daily pill)'),''')
rep(r'''    note='Main side effects were rash and diarrhea'+(C.ab?', plus reactions during the first infusion':'')+'.';''',
    r'''    note=C.pk?fill(PG.p1Note||'Side effects were mostly mild to moderate, and the team found a dose to carry forward.'):'Main side effects were rash and diarrhea'+(C.ab?', plus reactions during the first infusion':'')+'.';''')
rep(r'''}else{const pl=mg?8:12,per=Math.round((T.n-pl)/4),d=C.ab?['75 mg','150 mg','300 mg','600 mg']:['5 mg','15 mg','30 mg','60 mg'];''',
    r'''}else{const pl=mg?8:12,per=Math.max(2,Math.round((T.n-pl)/4)),d=MD||(C.ab?['75 mg','150 mg','300 mg','600 mg']:['5 mg','15 mg','30 mg','60 mg']);''')
rep(r'''const bm=C.ab?(mg?''', r'''const bm=C.pk?(PG.biomarker||'Target engagement'):C.ab?(mg?''')
rep(r'''const ae=mg?['1 of 8','1 of 6','2 of 6','2 of 6','3 of 6']:['2 of 12','2 of 9','3 of 9','3 of 9','4 of 9'];''',
    r'''const ae=C.pk?(mg?[1,1,2,2,3]:[2,2,3,3,4]).map((x,i)=>Math.min(x,i?per:pl)+' of '+(i?per:pl)):mg?['1 of 8','1 of 6','2 of 6','2 of 6','3 of 6']:['2 of 12','2 of 9','3 of 9','3 of 9','4 of 9'];''')
rep(r'''const pct=C.ab&&mg?''', r'''const pct=C.ab&&mgx?''')
rep(r'''ev=evTable(['Dose'+(C.ab?' (single injection)':' (daily for 14 days)'),''', r'''ev=evTable(['Dose'+(DN!==null?DN:C.ab?' (single injection)':' (daily for 14 days)'),''')
rep(r'''    note=C.ab?(mg?'Antibody levels drift back up''', r'''    note=C.pk&&PG.p1Note?fill(PG.p1Note):C.mc?'Blood levels and target engagement support a practical dosing schedule.':C.ab?(mgx?'Antibody levels drift back up''')
rep(r'''intro:onc?'The first patients with advanced cancer got rising doses, ten per dose group.':'The first volunteers got rising doses. Nobody had a serious side effect.',ev,evnote:note,''',
    r'''intro:onc?'The first patients with advanced cancer got rising doses, '+(C.pk?Math.max(2,Math.round(T.n/4)):'ten')+' per dose group.':inPt?'The first patients got rising doses. Nobody had a serious side effect.':'The first volunteers got rising doses. Nobody had a serious side effect.',ev,evnote:note,''')
rep(r'''     e:onc?'Early tumor shrinkage is encouraging''', r'''     e:inPt&&!onc?'Phase 1 groups are small and have no real comparison, so early signs of benefit prove little. Phase 1 shows that the drug is safe enough to continue and how the body handles it.':onc?'Early tumor shrinkage is encouraging''')
rep(r'''p2:C=>{const T=trialCfg('p2'),top=S.p2plan==='top',onc=C.area==='nsclc',mg=C.area==='mg';let ev;
  if(onc){''', r'''p2:C=>{const T=trialCfg('p2'),top=S.p2plan==='top',onc=C.area==='nsclc',mg=C.area==='mg'&&!C.pk,R=C.pk&&C.A.p2Result;let ev;
  if(R&&Array.isArray(R.arms)&&R.arms.length){let arms=R.arms;if(top&&arms.length>2)arms=arms.filter((a,i)=>/placebo|standard|control|comparator/i.test(a[0])||i===arms.length-1);
    ev=evTable(['Group','Patients',R.measure||'Main measure'],arms.map(a=>[a[0],Math.max(1,Math.round(T.n/arms.length)),a[1]]))}
  else if(onc){''')
rep(r'''ev=evTable(['Group','Patients','Reached EASI-75 at week 16']''', r'''ev=evTable(['Group','Patients',C.pk?'Improved on the main measure at week 16':'Reached EASI-75 at week 16']''')
rep(r'''const safety={eczema:''', r'''const safety=C.pk?(C.A.p2Safety||(onc?'Side effects were mostly mild to moderate and manageable.':'Side effects were mostly mild. Serious side effects were about as common as on placebo.')):{eczema:''')
rep(r'''ev:evList([C.area==='nsclc'?'Phase 3: patients lived longer''', r'''ev:evList([C.pk&&C.A.p3Result?C.A.p3Result:C.area==='nsclc'?'Phase 3: patients lived longer''')
rep(r''':C.area==='eczema'?'Both Phase 3 trials met their main goals''', r''':C.area==='eczema'&&!C.pk?'Both Phase 3 trials met their main goals''')
rep(r'''q:{q:C.name+' is '+(C.ab?'an antibody':'a small molecule')+'. Which application does it need?',''', r'''q:{q:C.name+' is '+C.plainMod+'. Which application does it need?',''')
rep(r'''     e:C.ab?'Antibodies are biologics, so they are licensed through a BLA.''', r'''     e:C.mc?(C.M.appWhy||(C.ab?'It is a biologic, so it is licensed through a BLA. Chemically made drugs use an NDA.':'It is made by chemical synthesis, so it is approved through an NDA. Biologics use a BLA.')):C.ab?'Antibodies are biologics, so they are licensed through a BLA.''')
rep(r'''};
function openGate(id){''', r'''};
if(PACK&&P.gates)Object.keys(GATES).forEach(k=>{const o=P.gates[k];if(!o||typeof o!=='object')return;const f=GATES[k];
  GATES[k]=C=>{const g=Object.assign({},f(C));['who','intro','evnote','title'].forEach(x=>{if(typeof o[x]==='string'&&o[x])g[x]=fill(o[x])});
    if(o.ev&&Array.isArray(o.ev.rows)&&Array.isArray(o.ev.cols))g.ev=evTable(o.ev.cols.map(fill),o.ev.rows.map(r=>r.map(fill)));else if(o.ev&&Array.isArray(o.ev.list))g.ev=evList(o.ev.list.map(fill));
    if(o.q&&o.q.q&&Array.isArray(o.q.a)&&o.q.r>=0&&o.q.r<o.q.a.length)g.q={q:fill(o.q.q),a:o.q.a.map(fill),r:o.q.r,e:fill(o.q.e||'')};
    if(o.story&&o.story.text)g.story=o.story;return g}});
function openGate(id){''')
rep(r'''    fb.className='fb ok';fb.textContent='Correct. '+G.q.e;''', r'''    fb.className='fb ok';fb.textContent='Correct. '+G.q.e;
    if(G.story)card.querySelector('.q').insertAdjacentHTML('afterend',storyHTML(G.story,'What '+CO+' did'));''')

# ---------------------------------------------------------------- quizzes
rep(r'''{q:C.name+' is '+(C.ab?'an antibody':'a small molecule')+'. Which application did you file?',a:['NDA','BLA','IND'],r:C.ab?1:0,e:C.ab?''',
    r'''{q:C.name+' is '+C.plainMod+'. Which application did you file?',a:['NDA','BLA','IND'],r:C.ab?1:0,e:C.mc?(C.ab?'Biologics use a Biologics License Application.':'Chemically made drugs use a New Drug Application.'):C.ab?''')

# ---------------------------------------------------------------- onboarding
rep(r'''const OB=[
 {art:'laboratory',next:'Start',''', r'''function obPack(){const co=CO,A=AREAS.pack,W=P.welcome||{},facts=(PC.facts||[]).filter(f=>f&&f.label&&f.value).slice(0,6),ppl=(P.people||[]).filter(x=>x&&x.name).slice(0,6),vals=(P.values||[]).filter(v=>v&&v.name).slice(0,6);
  const st=[{art:'laboratory',next:'Start',html:()=>'<p class="lbl">'+(PC.name||co)+(P.unofficial?' · unofficial edition':' · onboarding edition')+'</p><h1 id="obTitle" tabindex="-1">'+fill(W.title||'Welcome to '+co+'.')+'</h1><p class="lead">'+fill(W.text||PC.mission||'')+'</p>'+
    (W.quote&&W.quote.text?'<blockquote class="obq"><p>“'+fill(W.quote.text)+'”</p>'+(W.quote.who?'<cite>'+W.quote.who+'</cite>':'')+'</blockquote>':'')+'<p class="sub">About 30 to 45 minutes. Progress saves in this browser.</p>'}];
  if(PC.what||PC.mission||facts.length||ppl.length)st.push({art:'meeting',html:()=>'<h2 id="obTitle" tabindex="-1">Who we are.</h2><p class="lead">'+fill(PC.what||PC.mission||'')+'</p>'+
    (facts.length?'<dl class="facts">'+facts.map(f=>'<div><dt>'+f.label+'</dt><dd>'+fill(String(f.value))+'</dd></div>').join('')+'</dl>':'')+
    (ppl.length?'<p class="lbl" style="margin-top:16px">People you will hear from</p><ul class="ppl">'+ppl.map(x=>'<li><b>'+x.name+'</b>'+(x.role?'<span>'+x.role+'</span>':'')+'</li>').join('')+'</ul>':'')});
  if(vals.length)st.push({art:'team-spirit',html:()=>'<h2 id="obTitle" tabindex="-1">What we value.</h2><div class="vals">'+vals.map(v=>'<div><b>'+v.name+'</b><span>'+fill(v.means||'')+'</span></div>').join('')+'</div><p class="sub" style="margin-top:12px">You will see these come up as you play.</p>'});
  st.push({art:'dna',html:()=>'<h2 id="obTitle" tabindex="-1">Retrace our steps.</h2><p class="lead">You will run '+co+' from its first day and take '+(PG.code||'our first program')+' from an idea in the lab toward patients with '+A.dis+'.</p><ul class="evlist"><li>A short lesson in plain English explains each step of making a medicine.</li><li>"Our story" notes show what '+co+' actually did at that step.</li>'+
    (P.today?'<li>When you catch up to where '+co+' is today, the game keeps going so you can see the road ahead.</li>':'')+'<li>At big decisions, a review checks what you have learned before you move on.</li></ul>'});
  st.push({art:'choose',html:()=>'<h2 id="obTitle" tabindex="-1">How forgiving should the world be?</h2>'+optsHTML('mode',MODES)});
  st.push({art:'accept-terms',next:'Start at day one',html:()=>'<h2 id="obTitle" tabindex="-1">Before you start.</h2><p class="lead">You are running <b>'+co+'</b>, working on '+A.dis+' with '+packMod()+', in '+MODES[pick.mode].label+' mode.</p>'+FINE});
  return st}
const OB=PACK?obPack():[
 {art:'laboratory',next:'Start',''')
rep(r'''  logm('Week 1. '+S.cfg.company+' is founded. Four people, one rented bench, $3M of seed money.');
  logm('The plan: block '+ctx().targetShort+' to treat '+ctx().dis+'.');''', r'''  if(PACK){logm('Week 1. Day one at '+S.cfg.company+'. A small team, one idea and $3M of seed money (game numbers).');logm('The plan: '+(PG.bet?fill(PG.bet):ctx().targetShort+' could be the key to treating '+ctx().dis)+'.')}
  else{logm('Week 1. '+S.cfg.company+' is founded. Four people, one rented bench, $3M of seed money.');
  logm('The plan: block '+ctx().targetShort+' to treat '+ctx().dis+'.')}''')

# ---------------------------------------------------------------- finish: today checkpoint
rep(r'''  if(S.pauseLessons||m)showLesson(id);
}''', r'''  if(S.pauseLessons||m)showLesson(id);
  if(PACK&&P.today&&P.today.after===id&&!S.notes.includes('today')){S.notes.push('today');dirty.guide=1;logm('You have caught up to where '+S.cfg.company+' is today. The rest is the road ahead.','hl');showLesson('today')}
}''')
rep(r'''else{const rd=S.cfg.area==='nsclc'?26:43;''', r'''else{const rd=ctx().area==='nsclc'?26:43;''')

# ---------------------------------------------------------------- footer labels
rep(r'''$('btnReset').textContent='Click again to erase this company';''', r'''$('btnReset').textContent=PACK?'Click again to erase your progress':'Click again to erase this company';''')
rep(r'''if(!resetArmed)$('btnReset').textContent='Start a new company';''', r'''if(!resetArmed)$('btnReset').textContent=PACK?'Restart from day one':'Start a new company';''')

# ---------------------------------------------------------------- ending
rep(r'''  save();const C=ctx(),qs=finalQuiz();''', r'''  save();const C=ctx(),qs=(PACK?(P.quiz||[]).filter(q=>q&&q.q&&Array.isArray(q.a)&&q.r>=0&&q.r<q.a.length).slice(0,5).map(q=>({q:fill(q.q),a:q.a.map(fill),r:q.r,e:fill(q.e||'')})):[]).concat(finalQuiz()),E=P.ending||{};''')
rep(r'''<h3 id="mTitle">Welcome to the team.</h3>''', r'''<h3 id="mTitle">'+(PACK&&E.title?fill(E.title):'Welcome to the team.')+'</h3>''')
rep(r'''   '<p>You took a hunch about '+C.targetShort+''', r'''   (PACK?'<p>You retraced '+poss(C.co)+' path from day one'+(P.today?' and played out the road ahead':'')+'.</p>':'')+'<p>You took a hunch about '+C.targetShort+''')
rep(r'''   '<p><b>Final check.</b> Five questions from across the journey.</p>'+''', r'''   (PACK&&E.text?'<p>'+fill(E.text)+'</p>':'')+'<p><b>Final check.</b> '+(qs.length===5?'Five questions from across the journey.':qs.length+' questions about '+C.co+' and the journey.')+'</p>'+''')
rep(r'''<button id="fNew">Try another disease or drug type</button>''', r'''<button id="fNew">'+(PACK?'Play again from day one':'Try another disease or drug type')+'</button>''')
rep(r'''$('fScore').textContent=gradeQuiz(qs,'f')+' of 5 correct'}''', r'''$('fScore').textContent=gradeQuiz(qs,'f')+' of '+qs.length+' correct'}''')

# ---------------------------------------------------------------- boot: edition chrome, errors, self-check
rep(r'''if(S){startGame();if(S.ended)showEnding()}else{$('setup').hidden=false;obGo(0)}''', r'''if(PACK){const co=CO;
  document.querySelectorAll('#setup .wordmark,#game .wordmark').forEach(w=>w.insertAdjacentHTML('beforeend','<span class="edtag">'+co+'</span>'));
  const cr=document.querySelector('footer .credit');if(cr)cr.innerHTML=(P.unofficial?'An unofficial '+(PC.name||co)+' edition of SimBio, made from public information and not affiliated with the company. ':'The '+(PC.name||co)+' onboarding edition of SimBio. The company story comes from '+co+' materials. ')+'Game numbers are simplified and are not company data. Illustrations by <a href="https://storyset.com" target="_blank" rel="noopener">Storyset</a>.';
  $('btnIntro2').textContent='About this edition';
  if((P.glossary||[]).some(g=>g&&g.term)){const g=document.createElement('button');g.className='toggle';g.id='btnGloss';g.textContent='Glossary';$('btnIntro2').before(g);g.onclick=()=>{queue.push({kind:'glossary'});pump()}}
  if(P.showBadge===false){const b=document.querySelector('.cooked');if(b)b.remove()}}
if(window.__simbioPackError)document.body.insertAdjacentHTML('afterbegin','<div class="packerr" role="alert"><b>This company edition could not load its content,</b> so classic SimBio is showing instead. Ask whoever built it to check the content pack. ('+esc(window.__simbioPackError)+')</div>');
window.simbioPackCheck=()=>{if(!PACK)return{pack:false,error:window.__simbioPackError||null};const err=[],warn=[];
  const ids=new Set(MAIN.map(m=>m.id).concat(UPS.map(u=>u.id),['welcome','g_life','cliff','today'],AREAS.pack.exp.all.map(e=>'exp_'+e.id)));
  ['story','lessons','titles'].forEach(k=>Object.keys(P[k]||{}).forEach(id=>{if(!ids.has(id))err.push(k+'.'+id+' is not a step id')}));
  Object.keys(P.gates||{}).forEach(k=>{if(!GATES[k])err.push('gates.'+k+' is not a gate id')});
  (P.values||[]).forEach(v=>{if(v.at&&!ids.has(v.at))err.push('values "'+v.name+'" has an unknown at: '+v.at)});
  if(P.today&&!ids.has(P.today.after))err.push('today.after is not a step id: '+P.today.after);
  if(!AREAS.pack.exp.all.length)err.push('disease.expansions is empty');
  (P.quiz||[]).forEach((q,i)=>{if(!(q&&Array.isArray(q.a)&&q.r>=0&&q.r<q.a.length))err.push('quiz['+i+'] has a bad answer index')});
  ['name'].forEach(k=>{if(!PC[k])err.push('company.'+k+' is missing')});['code','targetShort','target','evidence','track'].forEach(k=>{if(!PG[k])err.push('program.'+k+' is missing')});
  if(!TRACK[PG.track])err.push('program.track must be immunology, chronic, oncology or rare');
  return{pack:true,errors:err,warnings:warn,steps:[...ids]}};
if(S){startGame();if(S.ended)showEnding()}else{$('setup').hidden=false;obGo(0)}''')

src = src.replace('__VER__', ENGINE_VERSION)

# ---------------------------------------------------------------- CSS additions
EXTRA_CSS = r'''
/* ---- company editions ---- */
.card .story{margin-top:12px;border:1px solid var(--line);border-left:4px solid var(--accent);border-radius:4px;padding:10px 12px;font-size:15px}
.card .story>b{font-family:var(--mono);font-size:11px;letter-spacing:.06em;text-transform:uppercase;display:block;color:var(--accent);margin-bottom:4px}
.card .story blockquote{margin-top:8px}
.card .story.val{border-left-color:var(--good)}.card .story.val>b{color:var(--good)}
blockquote{margin:0;padding-left:12px;border-left:2px solid var(--line)}
blockquote p{font-style:italic}
blockquote cite{display:block;font-style:normal;font-family:var(--mono);font-size:12px;color:var(--muted);margin-top:4px}
.obq{margin-top:18px}
.card .ahead{margin-top:12px;border:1px dashed var(--line);border-radius:4px;padding:10px 12px;font-size:14px;color:var(--muted)}
.card .ahead>b{font-family:var(--mono);font-size:11px;letter-spacing:.06em;text-transform:uppercase;display:block;margin-bottom:2px}
.edtag{font-family:var(--mono);font-size:11px;font-weight:500;letter-spacing:.06em;text-transform:uppercase;color:var(--muted);border-left:1px solid var(--line);padding-left:10px;margin-left:10px;align-self:center;max-width:22ch;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.facts{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:8px;margin:18px 0 0}
.facts div{border:1px solid var(--line);border-radius:4px;padding:8px 10px;background:var(--panel)}
.facts dt{font-family:var(--mono);font-size:11px;letter-spacing:.06em;text-transform:uppercase;color:var(--muted)}
.facts dd{margin:2px 0 0;font-weight:700}
.ppl{list-style:none;padding:0;margin:6px 0 0;display:grid;gap:4px}
.ppl span{color:var(--muted);margin-left:8px}
.vals{display:grid;gap:8px;margin-top:18px}
.vals div{border:1px solid var(--line);border-left:4px solid var(--good);border-radius:4px;padding:10px 12px;background:var(--panel)}
.vals b{display:block;font-family:var(--display);font-size:17px}
.vals span{color:var(--muted)}
.gloss{display:grid;gap:12px;margin:14px 0 0}.gloss dt{font-weight:700}.gloss dd{margin:2px 0 0;color:var(--muted)}
.srcs{margin:4px 0 12px;padding-left:18px;font-size:14px}
.packerr{background:var(--warn);color:#fff;padding:10px 16px;margin:0 -16px 12px;font-size:14px}
html.tint img[src^="art/"]{visibility:hidden}
'''

head_end = src.index('<style>')
style_end = src.index('</style>')
css = src[head_end+len('<style>'):style_end] + EXTRA_CSS
script_start = src.index('<script>\n(function(){')
markup = src[style_end+len('</style>'):script_start].strip('\n')
js = src[script_start+len('<script>'):src.rindex('</script>')].strip('\n')
head_links = src[:head_end]

banner = '/* SimBio engine ' + ENGINE_VERSION + ' · educational biotech sim · https://simbio.mikeclark.design · illustrations by Storyset */\n'
engine_js = (banner + "(function(boot){if(document.body)boot();else document.addEventListener('DOMContentLoaded',boot)})(function(){\n"
             + "if(!document.getElementById('setup'))document.body.insertAdjacentHTML('afterbegin'," + json.dumps(markup) + ");\n" + js + '\n});\n')
def ascii_js(t):
    out=[]
    for ch in t:
        o=ord(ch)
        if o<128: out.append(ch)
        elif o<=0xFFFF: out.append('\\u%04x'%o)
        else:
            o-=0x10000; out.append('\\u%04x\\u%04x'%(0xD800+(o>>10),0xDC00+(o&0x3FF)))
    return ''.join(out)
engine_js=ascii_js(engine_js)
assert all(ord(c)<128 for c in engine_js)
(ROOT/'dist'/'engine.js').write_text(engine_js)
(ROOT/'dist'/'engine.css').write_text('@charset "utf-8";\n' + banner + css.strip('\n') + '\n')
# single-file build for the test harness (pack slot before the engine)
inline = head_links + '<style>' + css + '</style>\n' + markup + '\n<script id="simbio-pack" type="application/json">__PACK__</script>\n<script>\n' + js + '\n</script>\n'
(ROOT/'test'/'engine-inline.html').write_text(inline)
print('engine.js', len(engine_js), 'engine.css', len(css), 'inline', len(inline))
