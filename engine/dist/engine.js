/* SimBio engine 1.1.0 \u00b7 educational biotech sim \u00b7 https://simbio.mikeclark.design \u00b7 illustrations by Storyset */
(function(boot){if(document.body)boot();else document.addEventListener('DOMContentLoaded',boot)})(function(){
if(!document.getElementById('setup'))document.body.insertAdjacentHTML('afterbegin',"<!-- ================= SETUP ================= -->\n<section id=\"setup\" hidden>\n  <div class=\"ob-head\">\n    <div class=\"wordmark\"><svg class=\"mark\" viewBox=\"0 0 64 64\" aria-hidden=\"true\"><rect width=\"64\" height=\"64\" rx=\"14\" style=\"fill:var(--accent)\"/><path d=\"M26 14h12M28 14v14L17 47a4 4 0 0 0 3.5 6h23a4 4 0 0 0 3.5-6L36 28V14\" style=\"fill:none;stroke:var(--accent-ink)\" stroke-width=\"4\" stroke-linejoin=\"round\" stroke-linecap=\"round\"/><path d=\"M22 42h20\" style=\"stroke:var(--accent-ink)\" stroke-width=\"4\" stroke-linecap=\"round\"/></svg><span>Sim<b>Bio</b></span></div>\n    <div class=\"ob-prog\" id=\"obProg\" aria-hidden=\"true\"></div>\n  </div>\n  <div class=\"ob-card\">\n    <div class=\"ob-copy\" id=\"obCopy\" aria-live=\"polite\"></div>\n    <figure class=\"ob-art\"><img id=\"obArt\" alt=\"\" width=\"500\" height=\"500\"></figure>\n  </div>\n  <div class=\"ob-nav\"><button id=\"obBack\">Back</button><button class=\"primary\" id=\"obNext\">Next</button></div>\n</section>\n\n<!-- ================= GAME ================= -->\n<div class=\"wrap\" id=\"game\" hidden>\n<header>\n  <div class=\"top\">\n    <div class=\"brand\"><div class=\"wordmark sm\"><svg class=\"mark\" viewBox=\"0 0 64 64\" aria-hidden=\"true\"><rect width=\"64\" height=\"64\" rx=\"14\" style=\"fill:var(--accent)\"/><path d=\"M26 14h12M28 14v14L17 47a4 4 0 0 0 3.5 6h23a4 4 0 0 0 3.5-6L36 28V14\" style=\"fill:none;stroke:var(--accent-ink)\" stroke-width=\"4\" stroke-linejoin=\"round\" stroke-linecap=\"round\"/><path d=\"M22 42h20\" style=\"stroke:var(--accent-ink)\" stroke-width=\"4\" stroke-linecap=\"round\"/></svg><span>Sim<b>Bio</b></span></div><h1 id=\"coName\">Your company</h1><p id=\"coSub\">Stealth mode</p></div>\n    <div class=\"counter\"><span class=\"lbl\" id=\"counterLbl\">Data points</span><span class=\"val\" id=\"counterVal\">0</span></div>\n  </div>\n  <div class=\"stats\">\n    <div><span class=\"lbl\">Date</span><span class=\"num\" id=\"date\">Year 1 \u00b7 Week 1</span></div>\n    <div><span class=\"lbl\">Cash</span><span class=\"num\" id=\"cash\">$3,000,000</span></div>\n    <div id=\"burnBox\"><span class=\"lbl\">Spending / week</span><span class=\"num\" id=\"burn\">$0</span></div>\n    <div id=\"runBox\"><span class=\"lbl\">Runway</span><span class=\"num\" id=\"runway\">\u2014</span></div>\n    <div><span class=\"lbl\">Insight</span><span class=\"num\" id=\"insightTop\">0 / 100</span></div>\n  </div>\n  <div class=\"coach\" role=\"status\"><p id=\"coach\">Run an experiment.</p></div>\n  <nav class=\"map\" id=\"map\" aria-label=\"Development stages. Select one to learn about it.\"></nav>\n</header>\n\n<main>\n  <section class=\"col\" id=\"colOps\">\n    <div class=\"panel\" id=\"labPanel\">\n      <div class=\"ph\"><h2>The bench</h2><span class=\"stage-tag\" id=\"discStage\">Target biology</span></div>\n      <button class=\"primary big\" id=\"btnAssay\">Run an experiment</button>\n      <p class=\"sub\">Each experiment (an \"assay\") produces one data point. Data unlocks discovery milestones.</p>\n      <div class=\"rows\">\n        <div class=\"row\"><span class=\"k\">Scientists</span><span class=\"v\" id=\"sci\">0</span></div>\n        <div class=\"row\" id=\"rateRow\"><span class=\"k\">Experiments / week</span><span class=\"v\" id=\"assayRate\">0</span></div>\n        <div class=\"btns\"><button id=\"btnHire\" hidden>Hire a scientist \u00b7 $40k</button></div>\n        <p class=\"sub\" id=\"hireHint\" hidden>Scientists run experiments automatically but cost $7,500 a week each.</p>\n        <hr>\n        <div class=\"row\"><span class=\"k\">Insight</span><span class=\"v\" id=\"insight\">0 / 100</span></div>\n        <div class=\"row\"><span class=\"k\">Insight / week</span><span class=\"v\" id=\"insightRate\">0</span></div>\n        <p class=\"sub\">Insight is your team's know-how. It grows on its own and pays for milestones.</p>\n      </div>\n    </div>\n\n    <div class=\"panel\" id=\"clinicPanel\" hidden>\n      <div class=\"ph\"><h2>The clinic</h2><span class=\"stage-tag\">IND active</span></div>\n      <p class=\"sub\">Trial sites are hospitals and clinics that find and treat patients for you. Each enrolled patient costs money.</p>\n      <div class=\"rows\">\n        <div class=\"row\"><span class=\"k\">Trial sites</span><span class=\"v\" id=\"sites\">0</span></div>\n        <div class=\"row\"><span class=\"k\">Patients enrolled / week</span><span class=\"v\" id=\"enrollRate\">0</span></div>\n        <div class=\"btns\"><button id=\"btnSite\">Open a site \u00b7 $150k</button><button id=\"btnScreen\">Screen a patient</button></div>\n      </div>\n      <div id=\"trials\" class=\"rows\"></div>\n    </div>\n\n    <div class=\"panel\" id=\"commPanel\" hidden>\n      <div class=\"ph\"><h2>The market</h2><span class=\"stage-tag\">Approved</span></div>\n      <div class=\"rows\">\n        <div class=\"row\"><span class=\"k\">Patients on treatment</span><span class=\"v\" id=\"onTx\">0</span></div>\n        <div class=\"row\"><span class=\"k\">Eligible and insured</span><span class=\"v\" id=\"addr\">0</span></div>\n        <div class=\"row\"><span class=\"k\">Supply can serve</span><span class=\"v\" id=\"supply\">0</span></div>\n        <div class=\"row\"><span class=\"k\">Insurance coverage</span><span class=\"v\" id=\"access\">30%</span></div>\n        <div class=\"row\"><span class=\"k\" id=\"revLbl\">Revenue / week</span><span class=\"v\" id=\"rev\">$0</span></div>\n        <hr>\n        <div class=\"row\"><span class=\"k\">Field team</span><span class=\"v\" id=\"reps\">0</span></div>\n        <div class=\"btns\"><button id=\"btnReps\">Hire 10 people \u00b7 $1.5M</button></div>\n        <div class=\"row\"><span class=\"k\" id=\"lineLbl\">Manufacturing lines</span><span class=\"v\" id=\"bio\">0</span></div>\n        <div class=\"btns\"><button id=\"btnBio\">Add a line \u00b7 $40M</button></div>\n        <hr>\n        <h2 style=\"font-size:15px\">On the label</h2>\n        <div id=\"labelList\" class=\"rows\"></div>\n      </div>\n    </div>\n  </section>\n\n  <section class=\"col\" id=\"colProj\">\n    <div class=\"panel mile\" id=\"milePanel\"></div>\n    <div class=\"panel\" id=\"upPanel\" hidden>\n      <h2>Optional upgrades</h2>\n      <div id=\"upgrades\"></div>\n    </div>\n  </section>\n\n  <section class=\"col\" id=\"colLog\">\n    <div class=\"panel\">\n      <h2>Lab notebook</h2>\n      <ol id=\"log\"></ol>\n    </div>\n    <div class=\"panel\">\n      <div class=\"ph\"><h2>Field guide</h2><span class=\"sub\" id=\"guideCount\">1 lesson</span></div>\n      <p class=\"sub\">Every lesson you unlock is saved here. Select one to reread it.</p>\n      <div id=\"guide\"></div>\n    </div>\n  </section>\n</main>\n<footer>\n  <span class=\"credit\">An educational sim of how biotech works. Companies and drugs are fictitious and not based on any real company. The process is real but sometimes simplified. Illustrations by <a href=\"https://storyset.com\" target=\"_blank\" rel=\"noopener\">Storyset</a>.</span>\n  <div class=\"btns\">\n    <span class=\"sub\">Speed</span>\n    <button class=\"toggle\" data-speed=\"1\">1\u00d7</button><button class=\"toggle\" data-speed=\"2\">2\u00d7</button><button class=\"toggle\" data-speed=\"4\">4\u00d7</button>\n    <button class=\"toggle\" id=\"btnPauseLessons\">Pause for lessons</button>\n    <button class=\"toggle\" id=\"btnIntro2\">About SimBio</button>\n    <button class=\"toggle\" id=\"btnReset\">Start a new company</button>\n  </div>\n</footer>\n</div>\n\n<div id=\"modal\" hidden><div class=\"card\" id=\"modalCard\" role=\"dialog\" aria-modal=\"true\" aria-labelledby=\"mTitle\"></div></div>\n\n<a class=\"cooked\" href=\"https://mikeclark.design\" target=\"_blank\" rel=\"noopener\" aria-label=\"Cooked by mikeclark.design. Opens Mike Clark's website in a new tab.\"><svg class=\"mc\" viewBox=\"0 0 538 358\" aria-hidden=\"true\"><path transform=\"translate(-58.83 -91.561)\" d=\"M520.497,91.811C595.472,96.721 603.305,167.699 583.7,205.602C582.993,206.969 566.679,246.289 523.516,249.7C493.779,252.05 477.708,220.945 497.994,192.87C498.327,192.409 525.084,162.654 502.471,155.61C497.355,154.016 482.029,156.573 470.798,164.898C428.655,196.133 399.241,308.105 428.99,343.076C448.112,365.555 480.377,360.645 508.221,329.261C514.139,322.59 537.074,290.92 571.521,296.368C589.177,299.161 609.055,323.101 584.171,359.276C550.551,408.151 483.143,452.464 416.514,449.244C397.624,448.331 331.396,437.525 321.526,371.495C311.054,301.431 349.452,250.261 348.085,237.537C346.884,226.353 331.805,223.37 316.835,251.678C313.698,257.611 300.047,283.424 285.454,329.485C273.331,367.751 283.837,381.932 258.259,404.207C228.73,429.923 175.796,405.778 198.949,325.642C208.423,292.851 240.951,241.132 231.755,218.388C230.471,215.212 217.665,202.097 199.925,238.702C146.674,348.58 172.407,373.706 149.14,414.287C132.128,443.957 71.019,449.718 60.077,394.584C49.019,338.862 115.262,263.634 110.027,220.545C108.194,205.451 95.231,206.237 93.49,206.342C88.79,206.627 63.013,211.968 60.564,183.494C58.3,157.18 98.164,145.441 110.262,138.103C131.551,125.19 160.386,95.553 179.008,123.797C186.379,134.976 180.005,159.993 190.469,159.102C199.58,158.327 223.685,87.41 285.479,91.753C315.602,93.869 321.781,120.599 322.673,124.46C325.708,137.59 320.286,160.981 331.471,159.321C340.056,158.048 355.56,115.97 393.531,111.92C413.738,109.765 416.051,127.249 447.575,109.644C462.691,101.201 479.492,96.791 482.384,96.032C502.51,90.749 515.708,91.798 520.497,91.811Z\"/></svg><span>Cooked by <b>mikeclark.design</b></span></a>");
(function(){
const $=id=>document.getElementById(id);
const fmt=n=>Math.floor(n).toLocaleString('en-US');
function money(n){const a=Math.abs(n),s=n<0?'-':'';
  if(a>=1e9)return s+'$'+(a/1e9).toFixed(a>=1e11?0:2)+'B';
  if(a>=1e6)return s+'$'+(a/1e6).toFixed(a>=1e8?0:1)+'M';
  if(a>=1e4)return s+'$'+Math.round(a/1e3)+'k';
  return s+'$'+Math.round(a).toLocaleString('en-US');}
const esc=t=>String(t).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));

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
window.simbioEngine={version:'1.1.0',pack:PACK};
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
function storyHTML(s,lbl){return '<div class="story"><b>'+(lbl||'Our story')+(s.when?' \u00b7 '+s.when:'')+'</b><p>'+fill(s.text)+'</p>'+(s.quote&&s.quote.text?'<blockquote><p>\u201c'+fill(s.quote.text)+'\u201d</p>'+(s.quote.who?'<cite>'+s.quote.who+'</cite>':'')+'</blockquote>':'')+'</div>'}
function extrasHTML(n){return (n.story?storyHTML(n.story):'')+(n.vals||[]).map(v=>'<div class="story val"><b>Our values \u00b7 '+v.name+'</b><p>'+fill(v.example)+'</p></div>').join('')+
  (n.ahead?'<div class="ahead"><b>The road ahead</b><p>'+CO+' has not reached this step yet. This is how the process usually continues.</p></div>':'')}

/* =================== LMS: SCORM 1.2, SCORM 2004, xAPI =================== */
// Active only inside a learning system: a SCORM API in a parent or opener window, or xAPI launch parameters.
// Everywhere else every call does nothing and progress stays in this browser.
const LMSCFG=(()=>{try{const el=document.getElementById('simbio-lms'),t=el&&el.textContent.trim();return t?JSON.parse(t):{}}catch(e){return {}}})();
let lmsStage=-1;
function lmsFrac(){const L=allMain();return L.filter(m=>S.done[m.id]).length/L.length}
function saveNote(){return LMS.on?'Your progress and score are saved to your learning system.':'Progress saves in this browser.'}
function lmsNote(){return LMS.on?'<p class="sub">Connected to your learning system ('+LMS.label+'). Progress and scores are saved there.</p>':''}
const LMS=(function(){
  const off={on:false,label:'',ready:null,load(){return null},save(){},progress(){},answer(){},complete(){},score(){},clear(){},finish(){}};
  const strip=s=>String(s==null?'':s).replace(/<[^>]*>/g,'').replace(/&lt;/g,'<').replace(/&gt;/g,'>').replace(/&quot;/g,'"').replace(/&amp;/g,'&');
  const letter=i=>i>=0&&i<10?'abcdefghij'[i]:'none';
  const t0=Date.now(),masteryDefault=typeof LMSCFG.mastery==='number'?LMSCFG.mastery:.8;
  let best=-1,finished=false;
  function find(name){const up=w=>{for(let n=0;w&&n<12;n++){try{if(w[name])return w[name]}catch(e){return null}try{if(!w.parent||w.parent===w)break;w=w.parent}catch(e){break}}return null};
    let a=up(window);try{if(!a&&window.opener)a=up(window.opener)}catch(e){}try{if(!a&&window.top&&window.top.opener)a=up(window.top.opener)}catch(e){}return a||null}
  function packState(state,limit){let s=JSON.stringify(state);if(s.length<=limit)return s;
    s=JSON.stringify(Object.assign({},state,{log:(state.log||[]).slice(0,8)}));if(s.length<=limit)return s;
    s=JSON.stringify(Object.assign({},state,{log:[]}));return s.length<=limit?s:null}
  const api4=find('API_1484_11'),api12=api4?null:find('API');
  if(api4||api12){
    const v4=!!api4,A=api4||api12;
    const call=(f,a,b)=>{try{return b===undefined?A[f](a):A[f](a,b)}catch(e){return ''}};
    const get=k=>String(call(v4?'GetValue':'LMSGetValue',k)||'');
    const set=(k,v)=>finished?'false':call(v4?'SetValue':'LMSSetValue',k,String(v));
    let lastCommit=0;const commit=force=>{if(finished)return;const n=Date.now();if(force||n-lastCommit>20000){lastCommit=n;call(v4?'Commit':'LMSCommit','')}};
    if(String(call(v4?'Initialize':'LMSInitialize',''))!=='true')return off;
    const K=v4?{status:'cmi.completion_status',loc:'cmi.location',susp:'cmi.suspend_data',exit:'cmi.exit',time:'cmi.session_time'}
              :{status:'cmi.core.lesson_status',loc:'cmi.core.lesson_location',susp:'cmi.suspend_data',exit:'cmi.core.exit',time:'cmi.core.session_time'};
    const st=get(K.status);if(!st||st==='not attempted'||st==='unknown')set(K.status,'incomplete');
    let mastery=masteryDefault;const lm=parseFloat(get(v4?'cmi.scaled_passing_score':'cmi.student_data.mastery_score'));if(!isNaN(lm))mastery=v4?lm:lm/100;
    let nInt=parseInt(get('cmi.interactions._count'),10);if(isNaN(nInt))nInt=0;
    commit(true);
    const span=ms=>{const s=Math.round(ms/1000),h=Math.floor(s/3600),m=Math.floor(s%3600/60),x=s%60,p=v=>String(v).padStart(2,'0');
      return v4?'PT'+h+'H'+m+'M'+x+'S':String(h).padStart(4,'0')+':'+p(m)+':'+p(x)+'.00'};
    return{on:true,label:v4?'SCORM 2004':'SCORM 1.2',ready:null,
      load(){const d=get(K.susp);if(!d)return null;try{const s=JSON.parse(d);return s&&s.cfg?s:null}catch(e){return null}},
      save(state,force,loc){const d=packState(state,v4?64000:4096);if(d!==null)set(K.susp,d);if(loc)set(K.loc,loc);commit(force)},
      progress(frac,loc){if(v4)set('cmi.progress_measure',Math.max(0,Math.min(1,frac)).toFixed(2));if(loc)set(K.loc,loc);commit(true)},
      answer(id,text,choices,resp,correct){if(!(resp>=0))return;const p='cmi.interactions.'+(nInt++)+'.',right=resp===correct;
        set(p+'id',id);set(p+'type','choice');
        if(v4){set(p+'timestamp',new Date().toISOString().slice(0,19));set(p+'description',strip(text).slice(0,250));set(p+'correct_responses.0.pattern',letter(correct));set(p+'learner_response',letter(resp));set(p+'result',right?'correct':'incorrect')}
        else{set(p+'correct_responses.0.pattern',letter(correct));set(p+'student_response',letter(resp));set(p+'result',right?'correct':'wrong')}
        commit(false)},
      complete(){if(v4){set('cmi.completion_status','completed');set('cmi.progress_measure','1')}else if(get('cmi.core.lesson_status')!=='passed')set('cmi.core.lesson_status','completed');commit(true)},
      score(raw,max){const pct=max?raw/max:0;if(pct<best)return;best=pct;
        if(v4){set('cmi.score.min',0);set('cmi.score.max',max);set('cmi.score.raw',raw);set('cmi.score.scaled',pct.toFixed(4));set('cmi.success_status',pct>=mastery?'passed':'failed');set('cmi.completion_status','completed')}
        else{set('cmi.core.score.min',0);set('cmi.core.score.max',100);set('cmi.core.score.raw',Math.round(pct*100));set('cmi.core.lesson_status',pct>=mastery?'passed':'completed')}
        commit(true)},
      clear(){set(K.susp,'');set(K.loc,'');commit(true)},
      finish(ended){if(finished)return;set(K.time,span(Date.now()-t0));set(K.exit,ended?(v4?'normal':''):'suspend');commit(true);finished=true;call(v4?'Terminate':'LMSFinish','')}};
  }
  const q=new URLSearchParams(location.search),ep=q.get('endpoint'),rawActor=q.get('actor');
  if(ep&&rawActor){
    let actor;try{actor=JSON.parse(rawActor)}catch(e){return off}
    const one=v=>Array.isArray(v)?v[0]:v,ag={objectType:'Agent'};   // Tin Can launch may still send the old array form
    ['name','mbox','mbox_sha1sum','openid'].forEach(k=>{if(actor&&actor[k])ag[k]=one(actor[k])});
    const acc=actor&&one(actor.account);if(acc)ag.account={homePage:one(acc.homePage||acc.accountServiceHomePage),name:one(acc.name||acc.accountName)};
    const base=ep.replace(/\/?$/,'/'),auth=q.get('auth')||'',reg=q.get('registration')||'',aid=q.get('activity_id')||LMSCFG.activityId||location.href.split('?')[0];
    const H={'Content-Type':'application/json','X-Experience-API-Version':'1.0.3'};if(auth)H.Authorization=auth;
    const course={objectType:'Activity',id:aid,definition:{type:'http://adlnet.gov/expapi/activities/course',name:{'en-US':LMSCFG.title||document.title||'SimBio'}}};
    const dur=()=>'PT'+Math.round((Date.now()-t0)/1000)+'S';
    // keepalive lets a request outlive the page; some browsers refuse it for a cross-origin LRS, so fall back to a plain request
    const xfer=(url,opt,keep)=>{const go=k=>fetch(url,Object.assign({headers:H},opt,{keepalive:k}));try{(keep?go(true).catch(()=>go(false)):go(false)).catch(()=>{})}catch(e){}};
    const send=(verb,obj,result,child,keep)=>{if(finished)return;const s={actor:ag,verb:{id:'http://adlnet.gov/expapi/verbs/'+verb,display:{'en-US':verb}},object:obj||course,timestamp:new Date().toISOString(),context:{contextActivities:{}}};
      if(reg)s.context.registration=reg;if(child)s.context.contextActivities.parent=[{objectType:'Activity',id:aid}];if(result)s.result=result;
      xfer(base+'statements',{method:'POST',body:JSON.stringify(s)},!!keep)};
    const stateUrl=()=>{const p=new URLSearchParams({activityId:aid,agent:JSON.stringify(ag),stateId:'simbio-state'});if(reg)p.set('registration',reg);return base+'activities/state?'+p};
    let lastPut=0,resumed=false,completed=false;
    const ready=new Promise(res=>{let d=false;const fin=v=>{if(!d){d=true;res(v)}};setTimeout(()=>fin(null),3500);
      try{fetch(stateUrl(),{headers:H}).then(r=>r.ok?r.json():null).then(s=>{const st=s&&s.cfg?s:null;resumed=!!st;fin(st)}).catch(()=>fin(null))}catch(e){fin(null)}});
    ready.then(()=>send(resumed?'resumed':'initialized'));
    const mastery=masteryDefault;
    return{on:true,label:'xAPI',ready,load(){return null},
      save(state,force,loc,keep){if(finished)return;const n=Date.now();if(!force&&n-lastPut<20000)return;lastPut=n;const d=packState(state,60000);if(d===null)return;
        xfer(stateUrl(),{method:'PUT',body:d},!!keep&&d.length<60000)},
      progress(frac){send('progressed',course,{extensions:{'https://w3id.org/xapi/cmi5/result/extensions/progress':Math.round(frac*100)}})},
      answer(id,text,choices,resp,correct){if(!(resp>=0))return;send('answered',{objectType:'Activity',id:aid+'/'+id,definition:{type:'http://adlnet.gov/expapi/activities/cmi.interaction',interactionType:'choice',
        description:{'en-US':strip(text)},choices:choices.map((c,i)=>({id:letter(i),description:{'en-US':strip(c)}})),correctResponsesPattern:[letter(correct)]}},{response:letter(resp),success:resp===correct},true,/^final-/.test(id))},
      complete(){if(completed)return;completed=true;send('completed',course,{completion:true,duration:dur()},false,true)},
      score(raw,max){const pct=max?raw/max:0;if(pct<=best)return;best=pct;send(pct>=mastery?'passed':'failed',course,{score:{raw,min:0,max,scaled:+pct.toFixed(4)},success:pct>=mastery,completion:true,duration:dur()},false,true)},
      clear(){xfer(stateUrl(),{method:'DELETE'},false)},
      finish(ended,state){if(finished)return;finished=true;
        // A closing page reliably gets one keepalive request out: spend it on the progress save.
        const d=state&&packState(state,60000);if(d)try{fetch(stateUrl(),{method:'PUT',headers:H,body:d,keepalive:d.length<60000}).catch(()=>{})}catch(e){}
        // The exit statement goes as a beacon in xAPI's alternate request syntax (form-encoded, so no CORS preflight).
        const st={actor:ag,verb:{id:'http://adlnet.gov/expapi/verbs/'+(ended?'terminated':'suspended'),display:{'en-US':ended?'terminated':'suspended'}},object:course,timestamp:new Date().toISOString(),context:{contextActivities:{}},result:{duration:dur()}};
        if(reg)st.context.registration=reg;
        try{const f=new URLSearchParams({'X-Experience-API-Version':'1.0.3','Content-Type':'application/json',content:JSON.stringify(st)});if(auth)f.set('Authorization',auth);
          navigator.sendBeacon(base+'statements?method=POST',new Blob([f.toString()],{type:'application/x-www-form-urlencoded'}))}catch(e){}}};
  }
  return off;
})();

/* =================== CONTENT =================== */
// Fictional composites of common biotech-world roles. Not based on any real company.
const ORG={vc:'Kettlewind Partners',pharma:'Aldermoor Pharma',cro:'Calderwick Clinical',rival:'Morrowgate Bio'};
const AREAS={
 eczema:{label:'Eczema',sub:'Atopic dermatitis \u00b7 immunology',dis:'atopic dermatitis (eczema)',
  blurb:'A common skin disease with intense itch. Big trials, big market.',
  target:{antibody:'a receptor on immune cells that receives a type 2 inflammation signal (a cytokine)',small:'JAK1, an enzyme inside immune cells that relays inflammatory signals from the cell surface to the nucleus'},
  evidence:{antibody:'people with eczema have high levels of this signal in their skin, and mice that lack the receptor develop much milder disease in eczema models',small:'children born with an overactive JAK1 gene develop severe eczema that calmed down on a JAK inhibitor, and blocking JAK1 mutes itch and inflammation signals in lab models'},
  trials:{p1:{label:'Phase 1 \u00b7 healthy volunteers',n:48,dur:26,cost:40000},p2:{label:'Phase 2 \u00b7 dose-ranging',n:240,dur:40,cost:60000},p3:{label:'Phase 3 \u00b7 two pivotal trials',n:1200,dur:52,cost:45000}},
  odds:{real:[.52,.29,.58],guided:[.92,.8,.85]},screen:.65,
  loa:'Across all diseases, about 8 in 100 drugs that enter human trials are approved.',p2rate:'Across all diseases, only about 3 in 10 drugs pass Phase 2.',p3rate:'Across all diseases, about 6 in 10 drugs that reach Phase 3 succeed.',
  p1Text:'For a lower-risk immunology drug, the first participants are usually healthy adults. Small groups get one dose, then repeated doses, each group higher than the last.',
  p2Text:'The main measure is EASI-75: the share of patients whose Eczema Area and Severity Index score improves by at least 75%.',
  p3Text:'Two pivotal trials of about 600 patients each. Both measure EASI-75 and IGA 0/1 (a doctor rates the skin clear or almost clear) at week 16, then follow patients for a year.',
  review:{dur:52,text:'a standard review: about 12 months (a 60-day filing check, then a 10-month goal date)'},
  pop:600000,price:700,churn:.004,priceText:'about $36,000 a year before discounts',
  exp:{
   antibody:[
    {id:'asthma',name:'Eosinophilic asthma',pop:800000,n:900,dur:52,note:{h:'Asthma: same signal, different organ',b:['Type 2 inflammation drives eczema in the skin and asthma in the lungs. Block the shared signal and both may improve.','Adding a disease to an approved drug needs a supplemental application and new trials in that disease. For asthma the measures are the yearly rate of severe attacks and FEV1, the air you can blow out in one second.'],m:'One pathway can link several diseases.'}},
    {id:'ped',name:'Eczema in children (6 months\u201311 years)',pop:250000,n:400,dur:40,note:{h:'Children are not small adults',b:['Eczema often starts in infancy. US law (the Pediatric Research Equity Act) generally requires companies to study new drugs in children with the same disease.','Children process drugs differently, so doses are based on weight and checked with blood samples.'],m:'Same disease, different bodies, careful dosing.'}},
    {id:'crswnp',name:'Nasal polyps',pop:300000,n:500,dur:52,note:{h:'Nasal polyps',b:['Nasal polyps are soft growths in the sinuses, also driven by type 2 inflammation. Many patients also have asthma.','Trials measure polyp size on a camera exam and how blocked the nose feels. Success can mean fewer repeat surgeries.'],m:'Shared biology often means shared patients.'}}],
   small:[
    {id:'teen',name:'Eczema in adolescents (12\u201317)',pop:200000,n:400,dur:36,note:{h:'Studying teenagers',b:['US law generally requires companies to study new drugs in children with the same disease. Teenagers usually come first because their bodies handle drugs much like adults.','Researchers check growth, development and safety alongside how well the skin clears.'],m:'Pediatric studies are expected, not optional.'}},
    {id:'alopecia',name:'Alopecia areata',pop:300000,n:700,dur:36,note:{h:'Alopecia areata',b:['In alopecia areata the immune system attacks hair follicles. The same JAK signaling that drives eczema is involved.','Trials use the SALT score: the share of scalp still without hair. Success is 20% or less after six months.'],m:'An enzyme inside the cell can sit on many disease pathways.'}},
    {id:'uc',name:'Ulcerative colitis',pop:500000,n:900,dur:52,note:{h:'Ulcerative colitis',b:['Ulcerative colitis is inflammation of the colon. JAK inhibitors calm several immune signals at once, which helps here too.','Trials measure clinical remission using the Mayo score: stool frequency, bleeding and how the colon looks on a scope.'],m:'Broader effect, broader use, broader safety watch.'}}]
  }},
 nsclc:{label:'Lung cancer',sub:'EGFR-mutant non-small cell lung cancer \u00b7 oncology',dis:'EGFR-mutant non-small cell lung cancer',
  blurb:'Some tumors run on a single broken gene. Smaller trials, faster reviews.',
  target:{antibody:'EGFR plus a second growth receptor that tumors use to escape EGFR drugs, both grabbed at once by a two-armed (bispecific) antibody',small:'the mutant EGFR kinase inside tumor cells, an enzyme stuck in the "on" position that tells the cell to keep dividing'},
  evidence:'tumors with this mutation depend on the signal to grow, and blocking it in lab models shrinks them',
  trials:{p1:{label:'Phase 1 \u00b7 dose escalation in patients',n:40,dur:20,cost:60000},p2:{label:'Phase 2 \u00b7 expansion cohort',n:120,dur:30,cost:80000},p3:{label:'Phase 3 \u00b7 randomized vs. standard care',n:600,dur:52,cost:70000}},
  odds:{real:[.49,.25,.48],guided:[.92,.8,.85]},screen:.4,
  loa:'Across all diseases, about 8 in 100 drugs that enter human trials are approved. In cancer it is about 5 in 100.',p2rate:'In cancer, only about 1 in 4 drugs pass Phase 2 (about 3 in 10 across all diseases).',p3rate:'In cancer, only about half of drugs that reach Phase 3 succeed.',
  p1Text:'Cancer drugs are usually first tested in patients with advanced cancer, not healthy volunteers. Doses rise group by group until we find the recommended Phase 2 dose. FDA\'s Project Optimus now asks cancer drug developers to compare doses rather than simply push to the highest one patients can tolerate.',
  p2Text:'A single-arm study: everyone gets the drug. The main measure is objective response rate (ORR), the share of patients whose tumors shrink by at least 30% on scans, judged by RECIST rules.',
  p3Text:'One randomized trial of about 600 patients against today\'s standard treatment. The main measure is progression-free survival: how long patients live without the cancer growing. Overall survival is the key secondary measure.',
  review:{dur:35,text:'a priority review: about 8 months (a 60-day filing check, then a 6-month goal date)'},
  pop:40000,price:5000,churn:.012,priceText:'about $260,000 a year before discounts',
  exp:{all:[
    {id:'firstline',name:'First-line treatment',pop:60000,n:600,dur:52,note:{h:'Moving to earlier lines',b:['Cancer drugs usually start as a later-line option for patients whose cancer grew on other treatments. Moving to first line means the first treatment a newly diagnosed patient gets.','That requires beating the current first-line standard in a new randomized trial.'],m:'Earlier lines mean more patients and higher evidence bars.'}},
    {id:'combo',name:'Combined with chemotherapy',pop:30000,n:500,dur:52,note:{h:'Combination therapy',b:['Tumors evolve to escape a single drug. Pairing a targeted drug with chemotherapy attacks the cancer two ways at once.','The trial must show the combination beats the drug alone, and that the added side effects are worth it.'],m:'Two attacks can delay resistance.'}},
    {id:'adjuvant',name:'After surgery (adjuvant)',pop:25000,n:600,dur:52,note:{h:'Adjuvant treatment',b:['When an early tumor is removed by surgery, hidden cancer cells can remain. Adjuvant treatment aims to stop the cancer from coming back.','The main measure is disease-free survival: how long patients stay cancer-free after surgery.'],m:'Treating earlier can mean curing more.'}}]}},
 mg:{label:'A rare disease',sub:'Generalized myasthenia gravis \u00b7 rare neuromuscular',dis:'generalized myasthenia gravis',
  blurb:'Myasthenia gravis, an autoimmune disease that weakens muscles. Few patients, small trials.',
  target:{antibody:'FcRn, the recycling receptor that keeps antibodies (including the harmful ones in this disease) alive in the blood',small:'an enzyme that acts early in complement, an immune attack system that, in this disease, damages the junction where nerves signal muscles'},
  evidence:{antibody:'patients make antibodies that attack the nerve-muscle junction, and lowering those antibodies (for example by filtering them out of the blood with plasma exchange) improves strength',small:'in patients with antibodies against the acetylcholine receptor, those antibodies switch on complement, which damages the muscle side of the junction, and blocking complement improves strength'},
  trials:{p1:{label:'Phase 1 \u00b7 healthy volunteers',n:32,dur:20,cost:40000},p2:{label:'Phase 2 \u00b7 small proof of concept',n:24,dur:24,cost:90000},p3:{label:'Phase 3 \u00b7 one pivotal trial',n:170,dur:26,cost:90000}},
  odds:{real:[.67,.45,.60],guided:[.92,.8,.85]},screen:.5,
  loa:'Across all diseases, about 8 in 100 drugs that enter human trials are approved. For rare diseases outside cancer it is about 17 in 100, partly because the biology is often clearer.',p2rate:'Rare-disease drugs do better than average here: about 45 in 100 pass Phase 2, versus about 3 in 10 across all diseases.',p3rate:'About 6 in 10 rare-disease drugs that reach Phase 3 succeed.',
  p1Text:'The first participants are usually healthy adults, which lets us learn about safety and dosing quickly. Small groups get one dose, then repeated doses, each group higher than the last.',
  p2Text:'With so few patients worldwide, Phase 2 is small: two dozen people. The main measure is MG-ADL, an 8-question score covering daily activities like chewing, breathing and brushing teeth.',
  p3Text:'One pivotal randomized trial of about 170 patients. For rare diseases, FDA can approve on a single well-controlled trial plus confirmatory evidence.',
  review:{dur:52,text:'a standard review: about 12 months (a 60-day filing check, then a 10-month goal date)'},
  pop:25000,price:8000,churn:.003,priceText:'about $400,000 a year before discounts',
  exp:{
   antibody:[
    {id:'cidp',name:'CIDP (chronic inflammatory demyelinating polyneuropathy)',pop:15000,n:300,dur:40,note:{h:'CIDP',b:['In CIDP the immune system damages the coating around nerves, causing weakness and numbness. Harmful antibodies are suspected to play a role.','Lowering antibody levels with an FcRn blocker may help, so the same drug is tested in a new disease.'],m:'One mechanism can serve several rare diseases.'}},
    {id:'itp',name:'Immune thrombocytopenia',pop:12000,n:200,dur:24,note:{h:'Immune thrombocytopenia',b:['In ITP, antibodies mark blood platelets for destruction, so patients bruise and bleed easily.','Trials measure whether platelet counts rise and stay above a safe level.'],m:'Measure what protects the patient.'}},
    {id:'ted',name:'Thyroid eye disease',pop:10000,n:200,dur:24,note:{h:'Thyroid eye disease',b:['Antibodies attack tissue behind the eyes, making them bulge and causing double vision.','Trials measure how far the eye protrudes (proptosis) and how patients see.'],m:'Same tool, new disease, new endpoint.'}}],
   small:[
    {id:'pnh',name:'PNH (paroxysmal nocturnal hemoglobinuria)',pop:5000,n:100,dur:24,note:{h:'PNH',b:['In PNH, complement destroys red blood cells. Blocking the cascade early can protect red cells from being destroyed both inside blood vessels and in the liver and spleen.','Trials measure hemoglobin levels and whether patients still need transfusions.'],m:'A complement blocker fits complement diseases.'}},
    {id:'ahus',name:'Atypical hemolytic uremic syndrome (aHUS)',pop:3000,n:60,dur:26,note:{h:'aHUS',b:['In aHUS, uncontrolled complement damages the lining of small blood vessels, especially in the kidneys. It is ultra-rare, so trials are small and often have no placebo group.','Trials look for a complete response: platelet counts and a marker of red-cell destruction (LDH) return to normal, and kidney function improves.'],m:'Ultra-rare trials count every patient.'}},
    {id:'igan',name:'IgA nephropathy',pop:40000,n:400,dur:40,note:{h:'IgA nephropathy and accelerated approval',b:['IgA nephropathy slowly damages the kidneys over decades. Waiting for kidney failure would take too long.','FDA can grant accelerated approval based on reduced protein in urine, a surrogate endpoint, with a confirmatory study required afterward.'],m:'Surrogate endpoints speed approval but require confirmation.'}}]
  }}
};
const MODS={
 antibody:{label:'Antibody',sub:'Biologic \u00b7 injection',blurb:'A large protein grown in living cells. Very precise. Given as an injection.',app:'BLA',appLong:'Biologics License Application',line:'2,000 L bioreactor lines',lineOne:'bioreactor line'},
 small:{label:'Small molecule',sub:'Chemical \u00b7 pill',blurb:'A small chemical made in a lab. Usually a daily pill, and it can reach inside cells.',app:'NDA',appLong:'New Drug Application',line:'Tablet production lines',lineOne:'tablet line'}
};
if(PACK){const bk=TRACK[PG.track]||'eczema',bA=AREAS[bk],D=P.disease||{},bm=P.modality?(P.modality.app==='NDA'?'small':'antibody'):(PG.modality==='small'?'small':'antibody');
  const tr={};['p1','p2','p3'].forEach(k=>tr[k]=Object.assign({},bA.trials[k],(D.trials||{})[k]||{}));
  const ill='This is an illustrative example of where the science could lead, not an announced '+CO+' plan.';
  const ex=(D.expansions||[]).filter(e=>e&&e.id&&e.name).map(e=>{const n=e.note||{};return Object.assign({pop:20000,n:400,dur:40},e,{note:{h:n.h||e.name,b:(n.b||[]).concat(e.illustrative?[ill]:[]),m:n.m||''}})});
  AREAS.pack=Object.assign({},bA,{label:'Our disease',dis:'the disease',p2Text:'The main measure is how many patients improve on the standard scoring scale for the disease, compared with a control group.',p3Text:'Large randomized trials compare the drug with placebo or today\'s standard treatment on the main measure agreed with FDA.',priceText:'about what similar medicines cost'},D,
    {base:bk,custom:true,trials:tr,review:D.review?Object.assign({},bA.review,D.review):bA.review,exp:{all:ex}});
  if(P.modality)MODS.pack=Object.assign({},MODS[bm],P.modality,{base:bm,custom:true,app:MODS[bm].app,appLong:MODS[bm].appLong});
}
const MODES={
 guided:{label:'Guided',sub:'Recommended for onboarding',blurb:'Trials usually succeed and investors back you up. Best for a first run.'},
 real:{label:'Realistic',sub:'Industry odds',blurb:'Industry success rates. Most drugs fail, and cash runs out.'}
};

const STAGES=[
 ['Discovery','Find a disease target and a molecule that hits it. Mostly lab work, years long, and cheap compared with what follows.'],
 ['Preclinical','Make the drug to quality standards and test its safety in animals. Ends with the IND, FDA permission to dose humans.'],
 ['Phase 1','The first people get the drug. Main question: is it safe, and how does the body handle it?'],
 ['Phase 2','The first test in patients. Main question: does it work, and at what dose? Most drugs fail here.'],
 ['Phase 3','Large trials that confirm the benefit and build the safety record needed for approval.'],
 ['Review','The company files a BLA or NDA. FDA reviewers check every study, inspect the factory and agree on the label.'],
 ['Launch','The approved medicine reaches patients through doctors, insurers and pharmacies.'],
 ['Growth','New trials add more diseases and patient groups to the label, while safety monitoring continues.']
];

/* ---------- main path milestones ---------- */
const MAIN=[
 {id:'validate',stage:0,t:C=>'Validate the target',d:C=>'Prove that '+C.targetShort+' really drives '+C.dis+'.',need:{data:30},c:{ins:10},
  fx:s=>{s.flags.target=1},
  note:C=>({h:'Target validation',b:[
   'Think of the disease as a factory line making the wrong product. A target is the one machine we can switch off. Our target is '+C.target+'.',
   'We check three kinds of evidence before betting years on it: human genetics, animal models, and patient tissue. Here, '+C.evidence+'.',
   'This matters because lack of efficacy is the most common reason drugs fail in mid- and late-stage trials (more than half of failures in one large study), and a target that does not truly drive the disease is a major cause. Drug targets backed by human genetic evidence are more than twice as likely to succeed in trials.'],
   m:'The target is the lock. Next we look for a key.'})},
 {id:'screen',stage:0,t:C=>C.mc?'Generate candidate designs':C.ab?'Build an antibody library':'Screen a compound library',d:C=>C.mc?'Make and test many versions of the drug against the target.':C.ab?'Create billions of candidate antibodies to test against the target.':'Test a million small chemicals against the target with robots.',need:{data:80},c:{cash:200000,ins:20},
  fx:s=>{s.flags.lib=1},
  note:C=>C.mc?({h:'Finding candidates',b:['Every drug program starts with many possible designs and narrows them down.','Scientists make and test candidates against the target, keeping the ones that act on it in the right way.','Most will not work well enough. A few become hits.'],m:'Many candidates in, a few good ones out.'}):C.ab?({h:'Finding keys: phage display',b:[
   'An antibody is a Y-shaped protein the immune system uses to grab one specific thing.',
   'Phage display uses harmless viruses that infect bacteria. Each virus wears a different antibody fragment on its surface, like a costume. A library holds billions of costumes.',
   'We wash the library over our target, keep the viruses that stick, copy them and repeat. It is like panning for gold. The method won the 2018 Nobel Prize in Chemistry.'],m:'Every experiment now screens more of the library.'})
   :({h:'Finding keys: high-throughput screening',b:[
   'A small molecule is a chemical tiny enough to slip inside cells and fit into a pocket on the target, like a key into a lock.',
   'High-throughput screening uses robots to test hundreds of thousands to millions of compounds, each in a tiny well, to see which ones block the target.',
   'Most will do nothing. A few hundred might show some effect.'],m:'Every experiment now screens more of the library.'})},
 {id:'hits',stage:0,t:C=>'Pick the hits',d:C=>'Keep the candidates that grab the target and actually block it.',need:{data:300},c:{ins:30},
  fx:s=>{s.flags.hits=1},
  note:C=>({h:'Hits',b:[
   'A hit does two things: it binds the target, and binding actually blocks the signal in living cells.',
   C.mc?'We confirm each hit in several independent tests and measure how strongly it acts at different doses.':C.ab?'We measure how tightly each antibody binds using a sensor that tracks how fast it grabs on and lets go. Think of it as the firmness and length of a handshake.':'We confirm each hit by retesting it at many concentrations to draw a dose-response curve. The concentration that blocks half of the target\'s activity, called the IC50, tells us how potent it is. Lower is better.',
   'From a huge library we keep a few dozen promising starting points.'],m:'Binding is necessary. Blocking is what makes it a medicine.'})},
 {id:'seriesA',stage:0,t:C=>'Raise a $45M Series A',d:C=>'Pitch your hits to '+ORG.vc+', a life-science venture fund.',c:{ins:20},
  fx:s=>{s.cash+=45e6;s.raised+=45e6},
  note:C=>({h:'How biotechs are funded',b:[
   'Biotechs spend for years before earning anything. Money comes in rounds (seed, Series A, Series B), each tied to a milestone that lowers the risk.',
   'Each round sells part of the company. Leaders watch runway: how many months until the cash runs out at the current spending rate. You can see yours at the top of the screen.','Your lead investor, '+ORG.vc+', takes a seat on your board. Like most venture funds, it backs many companies knowing most will fail.'],
   m:'Money buys time. Data buys money.'})},
 {id:'lead',stage:0,t:C=>'Optimize the lead',d:C=>C.mc?'Improve the best candidate so it can work as a medicine.':C.ab?'Polish the best antibody: tighter grip, longer life in the body.':'Have chemists tweak the best hit so it works as a pill.',need:{data:1000},c:{cash:1e6,ins:40},
  fx:s=>{s.flags.lead=1},
  note:C=>C.mc?({h:'Lead optimization',b:['Scientists improve the best candidate step by step: a stronger effect on the target, fewer effects elsewhere, and a form that can be made, stored and given to patients.','Each change is tested again, because fixing one property can break another.'],m:'A great candidate in the lab is not yet a medicine.'}):C.ab?({h:'Lead optimization',b:[
   'We tighten the grip (affinity maturation) and check that the antibody ignores look-alike targets, which could cause side effects.',
   'We make it fully human, so the patient\'s immune system is less likely to treat it as foreign and make antibodies against it.',
   C.area==='mg'&&!C.pk?'Our antibody blocks FcRn itself, so instead of tuning its tail we switch the tail off by removing a sugar the immune system uses as a handle. That way it lowers harmful antibodies without triggering attacks on the cells it binds.':'Normal antibodies already last about three weeks in the blood, because a receptor called FcRn acts like a valet, rescuing them before cells break them down. Some companies tune the tail to bind FcRn more tightly, so the antibody lasts longer and patients need fewer injections.'],
   m:'A great binder that clumps in the syringe is not a drug.'})
   :({h:'Lead optimization',b:[
   'Medicinal chemists make hundreds of small variations of the best hit and test each one. This is called structure-activity relationship (SAR) work.',
   'They balance potency, selectivity (hitting only our target) and ADME: how the drug is Absorbed, Distributed, Metabolized and Excreted.',
   'To work as a pill, it must survive the stomach, pass through the gut wall and not be destroyed too fast by liver enzymes.'],
   m:'Potent in a dish is easy. Potent after swallowing is hard.'})},
 {id:'dc',stage:0,gate:'cand',t:C=>'Candidate review',d:C=>'Your board picks the one molecule to take toward humans.',need:{data:2000},c:{ins:50},
  fx:s=>{s.flags.dc=1},
  note:C=>({h:'Meet '+C.name,b:[
   'A development candidate is the single molecule we take toward humans. We choose it against a target product profile: the label we hope to earn, written before we have the data.',
   'It gets a code, '+C.code+', and later an official generic name. '+C.nameText,
   'From here on, everything costs more, takes longer, and is regulated.'],
   m:'Discovery asks "can we?" Development asks "is it safe, and should we?"'})},
 {id:'seriesB',stage:1,t:C=>'Raise a $90M Series B',d:C=>'Fund manufacturing and safety studies.',c:{ins:30},
  fx:s=>{s.cash+=90e6;s.raised+=90e6},
  note:C=>({h:'Series B',b:['A named candidate brings in larger investors, often funds that also buy public stocks. They are already thinking about a future IPO.','This round pays for the work FDA requires before the first human dose.'],m:'Each round funds the next proof point, not the whole journey.'})},
 {id:'cmc',stage:1,t:C=>C.mc?'Develop the manufacturing process':C.ab?'Build a cell line':'Design the chemical synthesis',d:C=>C.mc?'Find a safe, repeatable way to make the drug at scale.':C.ab?'Engineer living cells to produce your antibody.':'Find a safe, repeatable recipe to make the drug in bulk.',c:{cash:3e6,ins:30},dur:15,
  fx:s=>{s.flags.cmc=1},
  note:C=>C.mc?({h:'Chemistry, manufacturing and controls',b:['A process that works at the bench has to work at scale, the same way every time. Manufacturing scientists design and control each step.','Regulators review how a medicine is made as closely as they review the trial data.'],m:'A recipe that works once is not a process.'}):C.ab?({h:'Cells as factories',b:[
   'Antibodies are too large to build with chemistry. We grow them in living cells, usually Chinese hamster ovary (CHO) cells.',
   'We insert the antibody\'s gene, pick the single best-producing cell, and freeze copies of it as a master cell bank. Every future batch starts from those vials.',
   'For biologics, people say "the process is the product". Change how you make it and you may need to prove it is still the same medicine.'],m:'Small molecules are built like Lego. Biologics are grown like sourdough.'})
   :({h:'Chemistry, manufacturing and controls',b:[
   'A lab chemist might make a few grams. Trials need kilograms. Process chemists design a synthesis route: a recipe of chemical steps that is safe, affordable and repeatable at scale.',
   'They also pick the crystal form of the drug. The same molecule can crystallize in different shapes (polymorphs) that dissolve differently in the body.'],m:'A recipe that works once is not a process.'})},
 {id:'tox',stage:1,t:C=>'Run safety studies in animals',d:C=>'Find the dose where problems start, so the first human dose is safe.',c:{cash:5e6,ins:30},dur:20,
  fx:s=>{s.flags.tox=1},
  note:C=>({h:'Safety before humans',b:[
   'Before any person gets '+C.code+', we test safety in animals under Good Laboratory Practice (GLP), a quality system that auditors can verify.',
   C.mc?'The test species must respond to the drug the way people would, so they are chosen carefully.':C.ab?'Antibodies are so specific that the test species must have a target the drug can bind, which often means monkeys.':'Small molecules are usually tested in two species, typically a rodent and a non-rodent such as a dog. We also check whether the drug damages DNA.',
   'We find the highest dose with no harmful effects, then divide by a safety factor to choose a starting dose for humans.',
   C.area==='nsclc'?'For advanced cancer, international rules (ICH S9) allow a shorter animal package so patients can get access sooner.':null],m:'Start low, go slow, know where the edge is.'})},
 {id:'gmp',stage:1,t:C=>'Make the first clinical supply',d:C=>'Produce trial doses under Good Manufacturing Practice.',c:{cash:5e6,ins:30},dur:15,
  fx:s=>{s.flags.gmp=1},
  note:C=>({h:'Good Manufacturing Practice',b:[
   C.mc?'Manufacturing teams make the first clinical batches under tightly controlled, documented conditions.':C.ab?'Cells grow in a steel tank called a bioreactor. Then we purify the antibody away from everything else and clear out any viruses.':'Chemists run the synthesis at scale to make the active ingredient, then formulate it into capsules or tablets.',
   'Every batch is tested for identity, strength, purity and contamination before it is released. All of this follows Good Manufacturing Practice (GMP).'],
   m:'In clinical development, the batch record matters as much as the batch.'})},
 {id:'ind',stage:1,gate:'ind',t:C=>'Submit the IND',d:C=>'Pass the readiness review, then ask FDA for permission to dose humans. FDA has 30 days to respond.',c:{ins:60},dur:4,
  fx:s=>{s.flags.ind=1;logm('Day 30. No clinical hold. '+ctx().code+' may be given to humans.','hl')},
  note:C=>({h:'The IND',b:[
   'An Investigational New Drug application (IND) is the permission slip to test in people. It has three parts: the animal safety data, how the drug is made and controlled, and the plan for the first trial.',
   'The FDA has 30 days to object. If it places no "clinical hold", the trial may begin.'],
   m:'Chapter 2 begins: is it safe in people, and does it work?'})},
 {id:'p1',stage:2,t:C=>'Design and open Phase 1',d:C=>'Write the first-in-human protocol and get ethics approval.',c:{ins:30},
  fx:s=>{startTrial('p1')},
  note:C=>({h:'Phase 1: first in human',b:[
   'Phase 1 asks one main question: is it safe enough to continue? '+C.A.p1Text,
   'We measure pharmacokinetics (PK): the drug\'s commute through the body, from dose to bloodstream to exit. That tells us how often to dose.',
   'Before anyone joins, an independent ethics board (IRB) approves the study, and every participant gives informed consent.'],
   m:'Now open trial sites in the clinic panel so patients can enroll.'})},
 {id:'g_p1',stage:2,gate:'p1',t:C=>'Phase 1 review',d:C=>'Read the Phase 1 results and decide how Phase 2 will test doses.',wait:s=>s.flags.p1ok?null:'Waiting for Phase 1 results.',c:{ins:30},
  fx:s=>{},note:C=>GATES.p1(C).note},
 {id:'ipo',stage:2,t:C=>'Go public: $220M IPO',d:C=>'Good Phase 1 data lets you sell shares on the stock market.',wait:s=>s.flags.p1ok?null:'Waiting for Phase 1 results.',c:{ins:30},
  fx:s=>{s.cash+=220e6;s.raised+=220e6},
  note:C=>({h:'Life as a public company',b:[
   'An initial public offering (IPO) sells shares on a stock exchange. From now on, trial results can move the stock price within minutes.',
   'That makes you an insider. Unannounced trial data is "material non-public information". Do not trade on it, do not tip anyone, and follow the company\'s insider trading policy and blackout windows.',
   'Results are shared with everyone at the same time, through a press release or official filing.'],
   m:'What you know at work stays at work until it is public.'})},
 {id:'p2',stage:3,t:C=>'Design and open Phase 2',d:C=>'Test the drug in patients for the first time.',c:{ins:50},
  fx:s=>{startTrial('p2')},
  note:C=>({h:'Phase 2: does it work?',b:[
   'Phase 2 tests whether the drug helps patients and which dose is best.',
   C.A.p2Text,
   'This is where most drugs stop. '+C.A.p2rate],
   m:'Phase 1 asks "is it safe?" Phase 2 asks "does it work, and at what dose?"'})},
 {id:'g_p2',stage:3,gate:'p2',t:C=>'Phase 3 go/no-go',d:C=>'Review the Phase 2 data and decide how to pay for Phase 3.',wait:s=>s.flags.p2ok?null:'Waiting for Phase 2 results.',c:{ins:50},
  fx:s=>{},note:C=>GATES.p2(C).note},
 {id:'eop2',stage:3,t:C=>'Meet with the FDA',d:C=>'Agree on the Phase 3 plan before spending hundreds of millions.',wait:s=>s.flags.p2ok?null:'Waiting for Phase 2 results.',c:{ins:50},dur:6,
  fx:s=>{s.flags.eop2=1},
  note:C=>({h:'The End-of-Phase 2 meeting',b:[
   'Before Phase 3, companies meet FDA to agree on which patients, which dose, which measures, how long, and how many people.',
   'For a drug taken long-term for a condition that is not life-threatening, international guidelines (ICH E1) expect roughly 1,500 people to have taken it in total, including 300 to 600 for six months and about 100 for a full year, so that rarer side effects can appear.',
   C.area==='nsclc'?'Those numbers do not apply to life-threatening cancers, where FDA accepts smaller safety databases.':C.area==='mg'?'For rare diseases, FDA accepts smaller databases when there simply are not enough patients.':null],
   m:'Agree on the rules before you play the game.'})},
 {id:'p3',stage:4,t:C=>'Launch Phase 3',d:C=>'The pivotal trials your approval will rest on.',c:{ins:60},
  fx:s=>{startTrial('p3')},
  note:C=>({h:'Phase 3: prove it',b:[
   'Phase 3 trials are randomized (a coin flip decides who gets drug or comparison) and usually double-blind (neither patient nor doctor knows which). The coin flip removes selection bias. The blindfold keeps hope out of the scoring.'+(C.area==='nsclc'?' Cancer trials comparing very different treatments are often open-label instead, so an independent panel reads the scans without knowing who got what.':''),
   C.A.p3Text,
   'An independent Data Safety Monitoring Board can see unblinded results during the trial, like a referee who sees both scorecards and can stop the game if someone is getting hurt.'],
   m:C.A.p3rate})},
 {id:'scale',stage:4,t:C=>'Scale up manufacturing',d:C=>'While Phase 3 runs, build and validate full-size production.',c:{cash:30e6,ins:40},dur:15,
  fx:s=>{s.lines=Math.max(s.lines,1)},
  note:C=>({h:'Scale-up',b:[
   'Trial batches were small. Launch needs a full-size process proven to produce the same medicine every time.',
   'Process validation runs several full-scale batches back to back to show the process is under control. Building this during Phase 3 is a financial bet that the trial will succeed.'],
   m:'FDA approves the medicine and the way it is made.'})},
 {id:'file',stage:5,gate:'file',t:C=>'File the '+C.app,d:C=>'Assemble every study, batch and patient record into one application.',wait:s=>s.flags.p3ok?null:'Waiting for Phase 3 results.',c:s=>({cash:s.flags.orphan?0:4e6,ins:80}),dur:6,
  fx:s=>{s.reviews.main={t:0,dur:ctx().A.review.dur};logm(ctx().app+' submitted. The FDA review clock has started.','hl')},
  note:C=>({h:'The '+C.app,b:[
   (C.mc?(C.M.appWhy||(C.ab?'Biologics are licensed through a Biologics License Application (BLA). Chemically made drugs use a New Drug Application (NDA) instead.':'Chemically made drugs are filed as a New Drug Application (NDA). Biologics use a Biologics License Application (BLA) instead.')):C.ab?'Antibodies are biologics, so we file a Biologics License Application (BLA). Small-molecule drugs use a New Drug Application (NDA) instead.':'Small-molecule drugs are filed as a New Drug Application (NDA). Antibodies and other biologics use a Biologics License Application (BLA) instead.'),
   'Both follow the Common Technical Document format: five modules covering regional and label information, summaries, manufacturing quality, animal studies and clinical studies.',
   'Filing also carries a multimillion-dollar FDA user fee'+(S.flags.orphan?', which our orphan designation waives':'')+'. We expect '+C.A.review.text+'. About 9 in 10 applications that reach FDA are eventually approved.'],
   m:'Every claim needs receipts.'})},
 {id:'inspect',stage:5,t:C=>'Host the factory inspection',d:C=>'FDA inspectors visit the manufacturing site before approval.',c:{ins:30},
  fx:s=>{s.flags.inspect=1},
  note:C=>({h:'Inspections',b:[
   'Before approval, FDA inspects the facilities that make the drug and often some trial sites. Inspectors read batch records, deviations and cleaning logs.',
   'Problems are written up on a "Form 483". Serious unresolved findings can delay approval even when the clinical data are strong.'],
   m:'The data gets you here. The factory gets you over the line.'})},
 {id:'label',stage:5,t:C=>'Negotiate the label',d:C=>'Agree with FDA on exactly who the drug is for and how to use it.',c:{ins:40},
  fx:s=>{s.flags.label=1},
  note:C=>({h:'The label',b:[
   'The label (prescribing information) says who the drug is for, how to dose it and what risks to watch for. It is negotiated line by line with FDA.',
   C.pk?(PG.labelRisk?fill(PG.labelRisk):'The most serious risks can appear in a boxed warning at the top of the label.'):C.area==='eczema'&&!C.ab?'JAK inhibitors carry a boxed warning, FDA\'s strongest, about serious infections, death, cancer, major heart events and blood clots. Doctors weigh that risk against the benefit for each patient.':C.area==='mg'&&!C.ab?'Complement inhibitors like ours carry a boxed warning for life-threatening infections from bacteria such as meningococcus. Patients must be vaccinated before starting, and the drug is only available through a restricted safety program (a REMS).':'The most serious risks can appear in a boxed warning at the top of the label.',
   'The label also sets the legal limits for promotion. The company may only promote uses on the label.'],
   m:'The label is the instruction manual and the rulebook.'})},
 {id:'launch',stage:6,gate:'launch',t:C=>'Launch '+C.name,d:C=>'Pass the launch review, set the price and start shipping.',wait:s=>s.approved.main?null:'Waiting for FDA approval. Watch the review clock in the clinic panel.',c:{cash:25e6,ins:30},
  fx:s=>{s.flags.launched=1;s.reps+=40+(s.partner?40:0)},
  note:C=>({h:'Launch',b:[
   'An approval letter is not the finish line. Specialty pharmacies stock the drug, support programs help patients with insurance paperwork, and nurses teach patients how to use it.',
   'Field teams have two separate jobs. Sales representatives talk about approved uses. Medical science liaisons discuss the science with experts and do not sell. The two are kept apart.',
   (S.priceMult>1?'We set the list price 30% above similar medicines, which list at '+C.A.priceText+'.':'We set the list price in line with similar medicines, at '+C.A.priceText+'.')+' Insurers negotiate discounts, so the net price the company receives is lower, and they decide who gets coverage.'],
   m:'Chapter 3: grow coverage, supply and the label. The big counter now tracks patients helped.'})},
];
// expansion milestones appended at runtime (need ctx)

/* ---------- optional upgrades ---------- */
const UPS=[
 {id:'multi',t:'Multichannel pipettes',d:'Each click runs 8 experiments instead of 1.',c:{cash:8000},when:s=>s.data>=8,
  fx:s=>{s.perClick=8},note:{h:'The 96-well plate',b:['Most lab experiments happen in plastic plates shaped like a muffin tin, with 96 or 384 tiny wells. Each well is its own small experiment.','A multichannel pipette fills a whole row at once.'],m:'Small tools decide how fast a lab learns.'}},
 {id:'robot',t:'Pipetting robot',d:'Doubles every scientist\'s output.',c:{cash:120000,ins:15},when:s=>s.sci>=3,
  fx:s=>{s.assayMult*=2},note:{h:'Automation',b:['A liquid-handling robot pipettes faster than a person, but the bigger win is consistency: the same volume, the same timing, every well.','Consistent experiments let you trust smaller differences.'],m:'Speed is nice. Repeatability is the point.'}},
 {id:'eln',t:'Electronic lab notebook',d:'Raises insight capacity to 250.',c:{cash:60000,ins:15},when:s=>s.data>=150,
  fx:s=>{s.insCap=Math.max(s.insCap,250)},note:{h:'Data integrity',b:['Regulators expect data to be ALCOA+: Attributable (who did it), Legible, Contemporaneous (recorded at the time), Original and Accurate, plus complete and lasting.','Years from now an FDA reviewer may ask about an experiment you run this week.'],m:'If it is not written down, it did not happen.'}},
 {id:'hts',t:'Screening automation',d:'Triples every scientist\'s output.',c:{cash:500000,ins:30},when:s=>s.done.robot&&s.data>=600,
  fx:s=>{s.assayMult*=3},note:{h:'High-throughput science',b:['Integrated robots, plate readers and scheduling software let a lab run tens of thousands of tests a day.','Speed only helps if the test is good. Scientists check that the signal clearly stands out from the noise before scaling up.'],m:'Bigger funnel, same filter.'}},
 {id:'comp',t:'Computational biology team',d:'Doubles insight per week. Capacity 500.',c:{cash:800000,ins:40},when:s=>s.flags.lead,
  fx:s=>{s.flags.comp=1;s.insCap=Math.max(s.insCap,500)},note:{h:'Computational biology',b:['Computational biologists mine patient datasets, model molecules and predict which designs will behave well before anyone touches a pipette.','They also ask which other diseases share this biology. That question matters later.'],m:'The wet lab asks questions. The dry lab narrows them.'}},
 {id:'cro',t:'Hire '+ORG.cro,d:'A contract research organization (CRO) with experienced trial teams. Enrollment +50%.',c:{cash:2e6,ins:20},when:s=>s.flags.ind,
  fx:s=>{s.enrollMult*=1.5},note:{h:'Contract research organizations',b:['A CRO runs much of the day-to-day trial work: finding sites, training staff and checking data quality.','Everyone follows Good Clinical Practice, the international standard for ethical, reliable trials. The sponsor stays accountable even when work is outsourced.'],m:'You can outsource the work, not the responsibility.'}},
 {id:'biomarker',t:'Biomarker strategy',d:'Find the patients most likely to respond. Trial odds +8%.',c:{cash:1.5e6,ins:40},when:s=>!!s.trials.p1,
  fx:s=>{s.pBonus+=.08},note:{h:'Biomarkers',b:['A biomarker is a measurable sign of biology, like a warning light on a dashboard: a blood level, a gene mutation, a scan result.','Biomarkers show the drug is hitting its target and help pick patients who are most likely to benefit.'],m:'If the light dims after dosing, the engine is responding.'}},
 {id:'orphan',t:'Orphan drug designation',d:'Rare-disease incentives: fee waiver and 7 years of exclusivity.',c:{ins:30},when:s=>isOrphan()&&s.flags.dc,
  fx:s=>{s.flags.orphan=1},note:{h:'Orphan drugs',b:['In the US, a disease affecting fewer than 200,000 people is "rare". The Orphan Drug Act rewards companies that develop medicines for them.','Benefits include tax credits on trial costs, a waiver of the large FDA application fee, and 7 years of market exclusivity for that use after approval.'],m:'Incentives make small markets worth the effort.'}},
 {id:'btd',t:'Request Breakthrough Therapy designation',d:'More FDA guidance and a rolling submission. Filing takes less time.',c:{ins:40},when:s=>isBTD()&&s.flags.p1ok,
  fx:s=>{s.flags.btd=1},note:{h:'Breakthrough Therapy',b:['If early clinical evidence suggests a substantial improvement over existing treatment for a serious disease, FDA can grant Breakthrough Therapy designation.','It brings more frequent meetings with FDA, senior-level guidance and rolling review, which lets the company send finished sections of its application early. Cancer drugs often qualify.'],m:'Serious disease plus strong early data means more FDA help.'}},
 {id:'advocacy',t:'Partner with patient groups',d:'Design trials patients can join. Enrollment +40%.',c:{cash:500000,ins:30},when:s=>!!s.trials.p2,
  fx:s=>{s.enrollMult*=1.4},note:{h:'Patients as partners',b:['Patient groups tell us what matters most to people with the disease and what makes trials hard to join: too many visits, long travel, stopping current medicines.','Trials should reflect the people who will use the medicine, including age, sex, race and ethnicity.'],m:'A trial nobody can join answers nothing.'}},
 {id:'payers',t:'Win insurance coverage',d:'Coverage 30% \u2192 60%.',c:{cash:10e6,ins:60},when:s=>s.flags.launched,
  fx:s=>{s.access=Math.max(s.access,.6)},note:{h:'Market access',b:['In the US, insurers and pharmacy benefit managers decide whether a drug is covered and under what rules. "Prior authorization" asks the doctor to justify the prescription. "Step therapy" requires trying cheaper drugs first.','Outside the US, government agencies judge value before national health systems pay.'],m:'Approval says a drug works. Coverage decides who gets it.'}},
 {id:'pv',t:'Safety monitoring program',d:'Track side effects in the real world. Coverage +5%.',c:{cash:3e6,ins:40},when:s=>s.flags.launched,
  fx:s=>{s.access=Math.min(.95,s.access+.05)},note:{h:'Safety never stops',b:['Trials see a few thousand patients. The market sees far more. Rare side effects may only appear at that scale.','Pharmacovigilance teams collect and assess side-effect reports and send them to regulators.','Every employee who hears about a possible side effect, even in casual conversation, must report it, usually within one business day.'],m:'If you hear about a side effect, report it.'}},
 {id:'hub',t:'Patient support program',d:'Help with injections, refills and costs. New patients \u00d71.5.',c:{cash:12e6,ins:40},when:s=>s.flags.launched&&s.helped>=goal()*.03,
  fx:s=>{s.repMult*=1.5},note:{h:'Staying on treatment',b:['A medicine only works if people keep taking it. People stop when doses are confusing, refills are a hassle, or costs are high.','Support programs teach patients how to take the drug, help with insurance and affordability, and send reminders.'],m:'The best drug is the one people keep taking.'}},
 {id:'guidelines',t:'Publish and present the data',d:'Earn a place in treatment guidelines. Coverage 85%, new patients \u00d71.3.',c:{cash:5e6,ins:80},when:s=>s.flags.launched&&s.helped>=goal()*.12,
  fx:s=>{s.access=Math.max(s.access,.85);s.repMult*=1.3},note:{h:'From evidence to practice',b:['Doctors follow guidelines written by expert medical societies. Inclusion depends on published evidence, not marketing.','Medical affairs teams publish trial results in journals, present at conferences and answer doctors\' questions with balanced data, including the negative results.'],m:'Publish the good, the bad and the neutral.'}}
];

if(PACK&&P.titles)MAIN.concat(UPS).forEach(m=>{const o=P.titles[m.id];if(!o)return;
  if(o.t)m.t=typeof m.t==='function'?()=>fill(o.t):fill(o.t);if(o.d)m.d=typeof m.d==='function'?()=>fill(o.d):fill(o.d)});

/* =================== STATE =================== */
const KEY=PACK?'simbio-ed-'+String(PC.name||'company').toLowerCase().replace(/[^a-z0-9]+/g,'-')+'-v1':'simbio-v3';
function fresh(cfg){return{cfg,week:0,cash:3e6,raised:3e6,data:0,carry:0,perClick:1,assayMult:1,
  insight:0,insCap:100,sci:0,done:{},running:{},notes:['welcome'],log:[],flags:{},lastRescue:-999,
  sites:0,enrollMult:1,enrolled:0,pBonus:0,trials:{},reviews:{},approved:{},
  reps:0,repMult:1,lines:0,access:.3,onTx:0,helped:0,revTotal:0,ended:false,speed:1,pauseLessons:true,checks:{},gatePaid:{},p2plan:null,partner:0,priceMult:1,expOrder:null}}
let S=null;
if(LMS.on)S=LMS.load();else try{const raw=JSON.parse(localStorage.getItem(KEY));if(raw&&raw.cfg)S=raw}catch(e){}

function prefix(name){let p=(name||'lan').toLowerCase().replace(/[^a-z]/g,'');if(p.length<3)p=(p+'lan').slice(0,3);return p.slice(0,4)}
function makeCfg(name,area,mod,mode){
  if(PACK)return{company:CO,area:'pack',mod:P.modality?'pack':(PG.modality==='small'?'small':'antibody'),mode,code:PG.code||'PRG-101',drug:PG.drug||null,
    nameText:PG.nameText?fill(PG.nameText):PG.drug?'Generic names carry a "stem" that tells doctors what kind of medicine it is.':'Its official generic name has not been assigned yet, so we keep using the code.'};
  name=(name||'').trim()||suggestName();
  const letters=name.replace(/[^A-Za-z ]/g,'').split(/\s+/).filter(Boolean);
  let code=(letters.length>1?letters.map(w=>w[0]).join(''):letters[0]||'LAN').toUpperCase().slice(0,3);
  if(code.length<2)code=(code+'LT').slice(0,3);
  code+='-201';
  const p=prefix(name),v='aeiou'.includes(p[p.length-1])?'':'a';
  let drug,nameText;
  if(mod==='antibody'){
    if(area==='nsclc'){drug=p+v+'mig';nameText='Antibody names used to end in -mab. Under WHO naming rules revised in 2021, new names use endings that describe the structure: -tug for unmodified antibodies, -bart for engineered ones, and -mig for multi-specific ones like ours, which grabs two targets.'}
    else{drug=p+'rebart';nameText='Antibody names used to end in -mab. Under WHO naming rules revised in 2021, new names use endings that describe the structure: -tug for unmodified antibodies and -bart for engineered ones, like ours with its modified tail.'}
  }else{
    if(area==='eczema'){drug=p+v+'citinib';nameText='Generic names carry a "stem" that tells doctors the drug class. JAK inhibitors end in -citinib.'}
    else if(area==='nsclc'){drug=p+v+'tinib';nameText='Generic names carry a "stem" that tells doctors the drug class. Tyrosine kinase inhibitors end in -tinib.'}
    else{drug=null;nameText='Generic names carry a "stem" that tells doctors the drug class, like -tinib for kinase inhibitors. Our official name is still being assigned, so we keep using the code.'}
  }
  return{company:name,area,mod,mode,code,drug,nameText};
}
function ctx(){const c=S.cfg,A=AREAS[c.area],M=MODS[c.mod],ab=(M.base||c.mod)==='antibody',pk=!!PACK;
  const tShort=pk?(PG.targetShort||'our target'):ab?(c.area==='mg'?'FcRn':c.area==='nsclc'?'EGFR and its backup receptor':'our target receptor'):(c.area==='mg'?'an early complement enzyme':c.area==='nsclc'?'mutant EGFR':'JAK1');
  return{co:c.company,code:c.code,name:S.flags.dc&&c.drug?c.drug:c.code,drug:c.drug,A,M,ab,pk,mc:!!M.custom,area:A.base||c.area,app:M.app,dis:A.dis,target:pk?(PG.target||tShort):A.target[c.mod],targetShort:tShort,
    evidence:pk?(PG.evidence||'the early evidence points to it'):typeof A.evidence==='string'?A.evidence:A.evidence[c.mod],plainMod:M.custom?packMod():ab?'an antibody':'a small molecule',
    nameText:(c.drug?'Ours is '+c.drug+'. ':'')+makeCfg(c.company,c.area,c.mod,c.mode).nameText}}
function expsBase(){const A=AREAS[S.cfg.area],mk=MODS[S.cfg.mod].base||S.cfg.mod;if(A.exp.all&&A.exp.all.length)return A.exp.all;const B=AREAS[A.base||S.cfg.area];return B.exp.all||B.exp[mk]}
function exps(){const L=expsBase();if(!S.expOrder)return L;return S.expOrder.map(id=>L.find(e=>e.id===id)).filter(Boolean)}
function unitRev(){return AREAS[S.cfg.area].price*(S.priceMult||1)*(S.partner?.5:1)}
function totalPop(){return AREAS[S.cfg.area].pop+exps().reduce((a,e)=>a+e.pop,0)}
function goal(){const g=totalPop()*.5;const mag=Math.pow(10,Math.floor(Math.log10(g))-1);return Math.round(g/mag)*mag}
function lineCap(){return totalPop()/8}
function repK(){return totalPop()/60000}
function trialCfg(id){const A=AREAS[S.cfg.area];if(A.trials[id]){const t=Object.assign({},A.trials[id]);if(id==='p2'&&S.p2plan==='top'){t.n=Math.round(t.n*.6);t.label+=' \u00b7 top dose only'}if(id==='p3'&&S.partner)t.cost=Math.round(t.cost/2);return t}const e=exps().find(x=>x.id===id);
  return e?{label:e.name+' \u00b7 Phase 3',n:e.n,dur:e.dur,cost:A.trials.p3.cost}:null}
function baseP(id){const o=AREAS[S.cfg.area].odds[S.cfg.mode];return id==='p1'?o[0]:id==='p2'?o[1]+(S.p2plan==='range'?.06:S.p2plan==='top'?-.08:0):o[2]}

function expMilestones(){
  const C=ctx(),E=exps();
  return [{id:'g_life',stage:7,gate:'life',t:()=>'Lifecycle review',d:()=>'Choose which disease to add to the label first.',wait:s=>s.flags.launched?null:'Waiting for launch.',c:{ins:60},fx:s=>{},note:C=>GATES.life(C).note}].concat(E.map((e,i)=>({id:'exp_'+e.id,stage:7,exp:e,t:()=>'Expand into '+e.name,d:()=>'Run a new Phase 3 to add this disease to the label.',
    wait:s=>{if(!s.flags.launched)return 'Waiting for launch.';if(!s.done.g_life)return 'Hold the lifecycle review first.';if(i>0&&!s.approved[E[i-1].id]&&!(s.trials[E[i-1].id]&&s.helped>=goal()*.1))return 'Finish or progress the previous expansion first.';return null},
    c:{cash:15e6+i*5e6,ins:60+i*20},fx:s=>{startTrial(e.id)},note:()=>e.note})))
  .concat([{id:'cliff',stage:7,t:()=>'Plan for life after exclusivity',d:()=>'Reach '+fmt(goal())+' patients helped with every indication approved.',
    wait:s=>{const missing=E.filter(e=>!s.approved[e.id]).length;if(missing)return missing+' expansion'+(missing>1?'s':'')+' still to approve.';if(s.helped<goal())return fmt(goal()-s.helped)+' more patients to reach. Grow your field team, supply and coverage.';return null},
    c:{ins:80},fx:s=>{s.ended=true},
    note:()=>({h:'The cycle starts again',b:[
      C.ab?'New biologics get 12 years of US market exclusivity. After that, biosimilars (highly similar versions made by other companies) can launch at lower prices.':'New small-molecule drugs get 5 years of US data exclusivity, and their patents usually protect them for longer. When protection ends, generic copies launch at much lower prices.',
      S.flags.orphan?'Our orphan designation also gives 7 years of exclusivity for the rare disease.':'Patents, not just exclusivity, often decide the exact date.',
      'That is by design. Prices fall, more patients get access, and companies reinvest in the next discovery program, back at the bench.'],m:'Every company is somewhere on this map. Now you know where.'})}]);
}
function allMain(){return MAIN.concat(expMilestones())}
function currentMilestone(){return allMain().find(m=>!S.done[m.id])}

/* =================== LOG / LESSONS =================== */
const dirty={log:1,mile:1,ups:1,guide:1,trials:1,label:1,map:1};
function logm(msg,cls){S.log.unshift({w:S.week,m:msg,c:cls||''});if(S.log.length>80)S.log.length=80;dirty.log=1}
function dateStr(w){return 'Year '+(Math.floor(w/52)+1)+' \u00b7 Week '+(Math.floor(w%52)+1)}

function noteFor(id){const n=noteBase(id);return n&&PACK?decorate(id,n):n}
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
  if(id==='welcome')return{h:'Welcome to '+C.co,b:[
    'You have four people, a rented lab bench and $3 million from early investors. You are in "stealth mode": no website, no press. You stay quiet until the science is strong enough to defend in public.',
    'Your bet is that blocking '+C.targetShort+' will help people with '+C.dis+'. If you can build a medicine that does that safely, patients get better.',
    'Bringing one medicine to patients usually takes 10 to 15 years and over $1 billion once failures are counted. '+C.A.loa+' Antibodies do somewhat better than small molecules on average (about 12 in 100 versus 7 to 8 in 100). You will see why so many fail.'],
    m:'Start by clicking "Run an experiment". The blue bar at the top always tells you the next step.'};
  const m=allMain().find(x=>x.id===id);if(m)return m.note(C);
  const u=UPS.find(x=>x.id===id);if(u)return u.note;
  return null;
}
const queue=[];let modalOpen=false;
function showLesson(id){queue.push({kind:'lesson',id});pump()}
function pump(){
  if(modalOpen||!queue.length)return;
  const it=queue.shift();modalOpen=true;
  const card=$('modalCard');card.className='card'+(it.kind==='gate'?' wide':'');
  if(it.kind==='lesson'){
    const n=noteFor(it.id);const idx=S.notes.indexOf(it.id)+1;
    const art=artFor(it.id);card.innerHTML=(art?'<img class="art" src="art/'+art+'.svg" alt="">':'')+'<h3 id="mTitle">'+n.h+'</h3><div class="body">'+n.b.filter(Boolean).map(x=>'<p>'+x+'</p>').join('')+'</div>'+(PACK?extrasHTML(n):'')+(n.m?'<div class="meta"><b>Remember</b>'+n.m+'</div>':'')+'<div class="btns"><button class="primary" id="mOk">Got it</button></div>';
  }else if(it.kind==='intro'){
    card.innerHTML=ABOUT();
  }else if(it.kind==='glossary'){
    card.innerHTML='<h3 id="mTitle">Glossary</h3><dl class="gloss">'+(P.glossary||[]).filter(g=>g&&g.term).map(g=>'<div><dt>'+g.term+'</dt><dd>'+fill(g.def||'')+'</dd></div>').join('')+'</dl><div class="btns"><button class="primary" id="mOk">Close</button></div>';
  }else if(it.kind==='gate'){
    renderGate(it.id,card);
  }else if(it.kind==='stage'){
    const st=STAGES[it.i];
    card.innerHTML='<img class="art" src="art/'+STAGE_ART[it.i]+'.svg" alt=""><span class="lbl">Stage '+(it.i+1)+' of 8</span><h3 id="mTitle">'+st[0]+'</h3><div class="body"><p>'+st[1]+'</p></div><div class="btns"><button class="primary" id="mOk">Close</button></div>';
  }else if(it.kind==='check'){
    const qs=CHECKS[it.id]();
    card.innerHTML='<span class="lbl">Quick check \u00b7 optional</span><h3 id="mTitle">'+(it.id==='ch1'?'Chapter 1 complete: discovery to IND':'Chapter 2 complete: trials to approval')+'</h3><p>Two questions to lock in what you just did.</p>'+quizHTML(qs,'c')+'<div class="btns"><button class="primary" id="mCheck">Check answers</button><button id="mOk">Continue</button></div>';
    $('mCheck').onclick=()=>gradeQuiz(qs,'c');
  }
  $('modal').hidden=false;
  const ok=$('mOk');ok.focus({preventScroll:true});card.scrollTop=0;ok.onclick=closeModal;
}
const STAGE_ART=['dna','chemistry-lab','hospital-patient','data-analysis','medical-care','documents','launching','business-growth'];
const ID_ART={today:'launching',welcome:'laboratory',seriesA:'investing',seriesB:'investing',ipo:'investing',gmp:'factory',scale:'factory'};
function artFor(id){if(ID_ART[id])return ID_ART[id];const m=allMain().find(x=>x.id===id);return m?STAGE_ART[m.stage]:null}
const WORDMARK='<div class="wordmark"><svg class="mark" viewBox="0 0 64 64" aria-hidden="true"><rect width="64" height="64" rx="14" style="fill:var(--accent)"/><path d="M26 14h12M28 14v14L17 47a4 4 0 0 0 3.5 6h23a4 4 0 0 0 3.5-6L36 28V14" style="fill:none;stroke:var(--accent-ink)" stroke-width="4" stroke-linejoin="round" stroke-linecap="round"/><path d="M22 42h20" style="stroke:var(--accent-ink)" stroke-width="4" stroke-linecap="round"/></svg><span>Sim<b>Bio</b></span></div>';
const FINE=PACK?finePack():'<div class="fineprint"><p>SimBio is an educational tool that shows how biotech works, from a first idea in the lab to an approved medicine.</p><p>Every company and drug in it is fictitious. The investors, partners and rivals you meet are composites of common patterns in the biotech world, not real companies.</p><p>The science, rules and success rates come from published sources, but some steps are simplified, shortened or combined to keep the game playable.</p><p>Nothing here is medical, regulatory or investment advice. Illustrations by <a href="https://storyset.com" target="_blank" rel="noopener">Storyset</a>.</p></div>';
function finePack(){const full=PC.name||'this company',co=CO,as=P.asOf?' (current as of '+P.asOf+')':'';
  return '<div class="fineprint">'+(P.unofficial?'<p>This is an unofficial edition, made from public information. It is not affiliated with or endorsed by '+full+'.</p>':'')+(P.demo?'<p>'+full+' is a fictitious company, made up to demonstrate company editions of SimBio.</p>':'')+'<p>This is the '+full+' onboarding edition of SimBio, an educational game about how biotech works.</p><p>The company facts, values and "Our story" notes come from '+(P.unofficial?'public sources about '+co:co+' materials')+as+'. Everything else is a simulation: cash, trial sizes, timelines, results and odds are simplified game numbers, not '+co+' data or forecasts. Steps marked "The road ahead" show how the process usually continues, not '+co+' plans.</p><p>Investors, partners and rivals inside the game are fictitious composites, not real companies. Some science and processes are simplified to keep the game playable.</p><p>Nothing here is medical, regulatory or investment advice. Illustrations by <a href="https://storyset.com" target="_blank" rel="noopener">Storyset</a>.</p></div>'}
function aboutPack(){const co=CO,src=(P.sources||[]).filter(s=>s&&(s.title||s.url));
  return WORDMARK+'<h3 id="mTitle">About this edition</h3><p>'+(P.unofficial?'An unofficial '+(PC.name||co)+' edition of SimBio, made from public information.':'The '+(PC.name||co)+' onboarding edition of SimBio.')+' You retrace how '+co+' got where it is, with a short science lesson at every step and a review at every big decision.</p>'+
    (src.length?'<p class="lbl" style="margin-top:12px">Sources</p><ul class="srcs">'+src.map(s=>'<li>'+(safeUrl(s.url)?'<a href="'+safeUrl(s.url)+'" target="_blank" rel="noopener">'+(s.title||s.url)+'</a>':(s.title||''))+(s.note?' \u00b7 '+s.note:'')+'</li>').join('')+'</ul>':'')+
    finePack()+lmsNote()+'<p class="sub">SimBio engine '+window.simbioEngine.version+'.</p><div class="btns"><button class="primary" id="mOk">'+(S?'Back to the game':'Close')+'</button></div>'}
const ABOUT=()=>PACK?aboutPack():WORDMARK+'<h3 id="mTitle">About SimBio</h3><p>SimBio is a management sim about how biotech works. You found a company and take one medicine from a target in the lab to patients, with a short lesson at every step and a review at every big decision.</p>'+FINE+lmsNote()+'<div class="btns"><button class="primary" id="mOk">'+(S?'Back to my company':'Close')+'</button></div>';
function showIntro(){queue.push({kind:'intro'});pump()}
$('btnIntro2').onclick=showIntro;

/* =================== STAGE GATES =================== */
// Each gate is a real decision point. The data are invented but realistic for the chosen disease and drug type.
function evTable(cols,rows){return '<div class="evwrap"><table class="ev"><thead><tr>'+cols.map(c=>'<th scope="col">'+c+'</th>').join('')+'</tr></thead><tbody>'+rows.map(r=>'<tr>'+r.map((c,i)=>i?'<td class="n">'+c+'</td>':'<td>'+c+'</td>').join('')+'</tr>').join('')+'</tbody></table></div>'}
function evList(a){return '<ul class="evlist">'+a.filter(Boolean).map(x=>'<li>'+x+'</li>').join('')+'</ul>'}
const GATES={
 cand:C=>{const spare=C.pk?(PG.selectivity||'related proteins'):{eczema:'JAK2',nsclc:'normal EGFR',mg:'related enzymes'}[C.area];
  return{art:'business-decisions',title:'Candidate review',
   who:'Your board, including '+ORG.vc+', decides which molecule the company bets on.',
   intro:'Two leads made it through optimization. One becomes the development candidate. The other stays in the freezer as a backup.',
   ev:C.mc?evTable(['Test','Lead A','Lead B'],[['Strength of effect in cells','Stronger','Strong'],['Stability and ease of manufacturing','Poor','Good'],['Activity on look-alike targets','Some','None found']]):C.ab?evTable(['Test','Lead A','Lead B'],[['Grip on the target (KD, lower is tighter)','15 pM','60 pM'],['Blocks the signal in cells (IC50)','0.2 nM','0.4 nM'],['Clumping after 4 weeks at high concentration','9%','under 1%'],['Binds look-alike proteins','No','No']])
     :evTable(['Test','Lead A','Lead B'],[['Potency (IC50, lower is stronger)','2 nM','8 nM'],['Selectivity over '+spare,'10\u00d7','200\u00d7'],['Absorbed when swallowed (rats)','15%','60%'],['Half-life (rats)','1 hour','5 hours']]),
   q:{q:'Which lead should become the development candidate?',a:['Lead A, because it is the most potent','Lead B: slightly less potent, but it behaves like a medicine','Neither. Keep screening for another year'],r:1,
     e:C.mc?'Strength is rarely the whole story. Lead B is stable, can be made consistently and leaves look-alike targets alone, which matters more than a small edge in strength.':C.ab?'Both are potent enough. Clumping (aggregation) makes a concentrated injection hard to manufacture and can prompt the immune system to attack the drug. Developability often decides between two good binders.':'Potency is rarely the whole story. Lead B spares '+spare+', which means fewer side effects, and enough of it is absorbed to work as a pill.'}}},
 ind:C=>({art:'documents',title:'IND readiness review',
   who:'Your regulatory, safety and manufacturing leads sign off before anything goes to FDA.',
   intro:'The package for '+C.code+' is almost complete.',
   ev:evList([(C.mc?'GLP toxicology in a relevant animal species: no serious findings at the top dose':C.ab?'GLP toxicology in monkeys, a species where '+C.code+' binds its target: no serious findings at the top dose':'GLP toxicology in rats and dogs: no serious findings at the top dose')+(C.area==='nsclc'?' (a shorter package, as allowed for advanced cancer)':''),
     'First clinical batch made under GMP and released by quality control',
     'Phase 1 protocol, consent form and investigator\'s brochure written',
     'Ethics board (IRB) review scheduled at the first trial site']),
   q:{q:'Which of these does NOT go into an IND?',a:['Animal safety data','How the drug is made and tested','The plan for the first trial in people','Proof that the drug works in patients'],r:3,
     e:'No one has to prove a drug works before testing it in people. The IND shows that it is reasonably safe to try, that it is made consistently, and that the first trial protects the people in it.'}}),
 p1:C=>{const T=C.A.trials.p1,onc=C.area==='nsclc',mg=C.area==='mg',mgx=mg&&!C.pk,inPt=C.pk&&!!C.A.p1InPatients,MD=C.mc&&Array.isArray(C.M.p1Doses)&&C.M.p1Doses.length===4?C.M.p1Doses:null,DN=C.mc?(C.M.doseNote?' ('+C.M.doseNote+')':''):null;let ev,note;
  if(onc){const per=Math.max(2,Math.round(T.n/4)),d=MD||(C.ab?['350 mg','700 mg','1,050 mg','1,400 mg']:['40 mg','80 mg','160 mg','240 mg']);
    ev=evTable(['Dose'+(DN!==null?DN:C.ab?' (IV, every 2 weeks)':' (daily pill)'),'Patients','Side effects that limited dosing','Tumors shrank by 30%+'],d.map((x,i)=>[x,per,[0,0,1,3][i]+' of '+per,[0,2,4,4][i]+' of '+per]));
    note=C.pk?fill(PG.p1Note||'Side effects were mostly mild to moderate, and the team found a dose to carry forward.'):'Main side effects were rash and diarrhea'+(C.ab?', plus reactions during the first infusion':'')+'.';
  }else{const pl=mg?8:12,per=Math.max(2,Math.round((T.n-pl)/4)),d=MD||(C.ab?['75 mg','150 mg','300 mg','600 mg']:['5 mg','15 mg','30 mg','60 mg']);
    const bm=C.pk?(PG.biomarker||'Target engagement'):C.ab?(mg?'Harmful antibodies (IgG) lowered':'Target blocked'):(mg?'Complement activity blocked':'Signal blocked in blood cells');
    const pct=C.ab&&mgx?[25,45,60,65]:C.ab?[40,70,90,92]:[30,55,80,85];
    const ae=C.pk?(mg?[1,1,2,2,3]:[2,2,3,3,4]).map((x,i)=>Math.min(x,i?per:pl)+' of '+(i?per:pl)):mg?['1 of 8','1 of 6','2 of 6','2 of 6','3 of 6']:['2 of 12','2 of 9','3 of 9','3 of 9','4 of 9'];
    ev=evTable(['Dose'+(DN!==null?DN:C.ab?' (single injection)':' (daily for 14 days)'),'People','Mild side effects',bm],[['Placebo',pl,ae[0],'\u2014']].concat(d.map((x,i)=>[x,per,ae[i+1],pct[i]+'%'])));
    note=C.pk&&PG.p1Note?fill(PG.p1Note):C.mc?'Blood levels and target engagement support a practical dosing schedule.':C.ab?(mgx?'Antibody levels drift back up within weeks of a dose, so patients will need regular dosing.':'Half-life is about three weeks, so an injection every few weeks should be enough.'):'Half-life is about 6 hours, which fits a pill taken once or twice a day.'}
  return{art:'meeting',title:'Phase 1 review',who:'Your clinical team and board review the first human data for '+C.code+'.',
   intro:onc?'The first patients with advanced cancer got rising doses, '+(C.pk?Math.max(2,Math.round(T.n/4)):'ten')+' per dose group.':inPt?'The first patients got rising doses. Nobody had a serious side effect.':'The first volunteers got rising doses. Nobody had a serious side effect.',ev,evnote:note,
   q:{q:'What did Phase 1 mainly tell you?',a:['That the drug treats the disease','That it is safe enough to continue, and how the body handles it','That it beats the treatments doctors use today'],r:1,
     e:inPt&&!onc?'Phase 1 groups are small and have no real comparison, so early signs of benefit prove little. Phase 1 shows that the drug is safe enough to continue and how the body handles it.':onc?'Early tumor shrinkage is encouraging, but with ten patients per dose and no comparison group it proves nothing yet. Phase 1 finds a safe dose and shows how the body handles the drug.':'The volunteers were healthy, so Phase 1 cannot show whether the drug treats the disease. It shows that the drug is safe enough to continue, how long it lasts and how much of its target it blocks.'},
   decide:{p:'How should Phase 2 test doses?',o:[
     {t:'Compare several doses',d:onc?'Randomize patients to two doses. Slower and costlier, but you learn which dose balances benefit and side effects.':'Test three doses against placebo. More patients, but you learn which dose works best.',fx:s=>{s.p2plan='range'},log:'Phase 2 will compare several doses.'},
     {t:'Test only the top dose',d:'Smaller and faster. If the top dose is not the best balance of benefit and side effects, you will not find out.',fx:s=>{s.p2plan='top'},log:'Phase 2 will test only the top dose. Cheaper, but riskier.'}]},
   note:{h:'Phase 1 review',b:['Phase 1 answers two questions: is the drug safe enough to keep going, and how does the body handle it? It does not prove the drug works.',onc?'FDA\'s Project Optimus asks cancer drug developers to compare doses instead of defaulting to the highest dose patients can tolerate.':'Testing several doses in Phase 2 is how companies find the dose that balances benefit and side effects.'],m:'Phase 1 is about safety and dose, not proof.'}}},
 p2:C=>{const T=trialCfg('p2'),top=S.p2plan==='top',onc=C.area==='nsclc',mg=C.area==='mg'&&!C.pk,R=C.pk&&C.A.p2Result;let ev;
  if(R&&Array.isArray(R.arms)&&R.arms.length){let arms=R.arms;if(top&&arms.length>2)arms=arms.filter((a,i)=>/placebo|standard|control|comparator/i.test(a[0])||i===arms.length-1);
    ev=evTable(['Group','Patients',R.measure||'Main measure'],arms.map(a=>[a[0],Math.max(1,Math.round(T.n/arms.length)),a[1]]))}
  else if(onc){const arms=top?[['Top dose',T.n,'41%','8.8 months']]:[['Lower dose',T.n/2,'38%','9.5 months'],['Higher dose',T.n/2,'41%','8.8 months']];
    ev=evTable(['Dose','Patients','Tumors shrank by 30%+','Median time responses lasted'],arms.map(a=>[a[0],Math.round(a[1]),a[2],a[3]]))}
  else if(mg){const arms=top?[['Placebo','\u22121.4'],['Top dose','\u22124.3']]:[['Placebo','\u22121.4'],['Low dose','\u22123.1'],['Middle dose','\u22124.0'],['Top dose','\u22124.3']];
    ev=evTable(['Group','Patients','Change in MG-ADL score at week 8 (more negative is better)'],arms.map(a=>[a[0],Math.round(T.n/arms.length),a[1]]))}
  else{const arms=top?[['Placebo','15%'],['Top dose','49%']]:[['Placebo','15%'],['Low dose','34%'],['Middle dose','46%'],['Top dose','49%']];
    ev=evTable(['Group','Patients',C.pk?'Improved on the main measure at week 16':'Reached EASI-75 at week 16'],arms.map(a=>[a[0],Math.round(T.n/arms.length),a[1]]))}
  const safety=C.pk?(C.A.p2Safety||(onc?'Side effects were mostly mild to moderate and manageable.':'Side effects were mostly mild. Serious side effects were about as common as on placebo.')):{eczema:C.ab?'Most common side effect: redness where the injection went in. Serious side effects were as rare as on placebo.':'Most common side effects: nausea and acne. Two patients had shingles, a known risk of JAK inhibitors.',nsclc:'Main side effects: rash and diarrhea, mostly mild'+(C.ab?', plus reactions during the first infusion':'')+'.',mg:C.ab?'Headaches and mild infections were a little more common than on placebo.':'Mild headaches. No serious infections; everyone was vaccinated first.'}[C.area];
  return{art:'partnership',title:'Phase 3 go/no-go',who:'Your board, your lead investors and a business-development team from '+ORG.pharma+' are in the room.',
   intro:'Phase 2 of '+C.code+' has read out. '+ORG.rival+', a rival, started Phase 3 with a similar drug last year.',ev,evnote:safety+(top?' Because only the top dose was tested, FDA may ask you to justify the dose before Phase 3.':''),
   q:onc?{q:'This Phase 2 had no comparison group. What does Phase 3 have to show?',a:['That tumors shrink in more patients than in Phase 2','That patients do better than on today\'s standard treatment, in a randomized trial','Nothing more. Response rate alone always earns full approval'],r:1,e:'Tumor shrinkage in a single-arm study is a strong signal, but only a randomized comparison shows that patients actually do better than on today\'s treatment, for example by living longer without the cancer growing. FDA sometimes grants accelerated approval on response rate, but a confirmatory trial is still required.'}
     :{q:'Some placebo patients improved too. Why does the trial include a placebo group?',a:['To make the trial cheaper','To separate the drug\'s real effect from natural ups and downs and from expectations','Because the law requires half of patients to go untreated'],r:1,e:'Symptoms rise and fall on their own, and people often feel better when they expect to. Only the difference from placebo belongs to the drug.'},
   decide:{p:'Phase 3 will cost more than everything so far. How do you pay for it?',o:[
     {t:'Raise $350M from public investors',d:'You keep all future profits. Existing shareholders own a smaller slice of the company.',fx:s=>{s.cash+=350e6;s.raised+=350e6},log:'Raised $350M in a follow-on stock offering.'},
     {t:'Partner with '+ORG.pharma,d:'$150M upfront. They pay half of Phase 3 and add a sales team at launch. You split profits 50/50.',fx:s=>{s.cash+=150e6;s.raised+=150e6;s.partner=1},log:'Signed a co-development deal with '+ORG.pharma+': $150M upfront, with Phase 3 costs and profits shared.'}]},
   note:{h:'Phase 3 go/no-go',b:['The end of Phase 2 is the biggest decision in a drug\'s life, because Phase 3 usually costs more than everything before it.','Companies either raise money and go alone, or partner with a larger company that shares the cost, the risk and the profits.'],m:'Go alone and keep the upside, or share it to share the risk.'}}},
 file:C=>({art:'documents',title:'Filing review',who:'Your regulatory team walks the board through the application before it goes to FDA.',
   intro:'Every study, batch and patient record for '+C.name+' is in one place.',
   ev:evList([C.pk&&C.A.p3Result?C.A.p3Result:C.area==='nsclc'?'Phase 3: patients lived longer without the cancer growing than on standard treatment':C.area==='eczema'&&!C.pk?'Both Phase 3 trials met their main goals':'The pivotal Phase 3 trial met its main goal',
     'Safety database: '+fmt(S.enrolled)+' people have taken part in trials of '+C.code,
     'Full-scale manufacturing validated, with consistent batches',
     'Draft label and risk management plan written']),
   q:{q:C.name+' is '+C.plainMod+'. Which application does it need?',a:['A New Drug Application (NDA)','A Biologics License Application (BLA)','Another IND'],r:C.ab?1:0,
     e:C.mc?(C.M.appWhy||(C.ab?'It is a biologic, so it is licensed through a BLA. Chemically made drugs use an NDA.':'It is made by chemical synthesis, so it is approved through an NDA. Biologics use a BLA.')):C.ab?'Antibodies are biologics, so they are licensed through a BLA. Chemical drugs use an NDA.':'Chemical drugs are approved through an NDA. Biologics such as antibodies use a BLA instead.'}}),
 launch:C=>({art:'business-decisions',title:'Launch review',who:'Your commercial, medical and market access leads'+(S.partner?', with '+ORG.pharma+',':'')+' present the launch plan.',
   intro:'FDA approved '+C.name+' for '+C.dis+'.',
   ev:evList(['Similar medicines list at '+C.A.priceText+'. '+ORG.rival+'\'s drug launched at about that price.','Insurers say they will cover a new option at a similar price, with prior authorization.','A field team of 40 is hired and trained'+(S.partner?', and '+ORG.pharma+' adds 40 more':'')+'.']),
   q:{q:'A doctor asks your sales rep about using '+C.name+' for a disease that is not on the label. What happens?',a:['The rep shares the data to help the doctor','The rep cannot promote unapproved uses, so the question goes to Medical Affairs','The rep says it probably works for that too'],r:1,
     e:'Promotion has to stay within the label. Unprompted questions about other uses go to Medical Affairs, which answers with balanced science.'},
   decide:{p:'Set the launch price.',o:[
     {t:'In line with similar medicines',d:'Insurers start covering it sooner.',fx:s=>{s.priceMult=1;s.access=.45},log:'Launch price set in line with similar medicines.'},
     {t:'30% above similar medicines',d:'More revenue per patient, but insurers push back and coverage grows slowly.',fx:s=>{s.priceMult=1.3;s.access=.2},log:'Launch price set 30% above similar medicines.'}]}}),
 life:C=>{const L=expsBase();return{art:'meeting',title:'Lifecycle review',who:'Your board reviews where '+C.name+' could help next.',
   intro:'The same biology may matter in other diseases. Each one needs its own trials.',
   ev:evTable(['Disease','Patients in reach','Phase 3 size','Trial length'],L.map(e=>[e.name,fmt(e.pop),fmt(e.n)+' patients',e.dur+' weeks'])),
   q:{q:'What does it take to add a new disease to the label?',a:['Nothing. Doctors can already prescribe it','New well-controlled trials in that disease, then a supplemental application to FDA','A brand-new drug and a new IND from scratch'],r:1,
     e:'A company cannot promote a new use until trials prove it there and FDA approves a supplemental application. Safety data from the first approval carries over, so it rarely starts from scratch.'},
   decide:{p:'Which disease do you pursue first?',o:L.map(e=>({t:e.name,d:fmt(e.pop)+' patients in reach \u00b7 '+fmt(e.n)+'-patient trial',fx:s=>{s.expOrder=[e.id].concat(L.filter(x=>x!==e).map(x=>x.id))},log:'First expansion: '+e.name+'.'}))},
   note:{h:'Lifecycle review',b:['After approval, companies look for other diseases that share the same biology. Each new use needs its own well-controlled trials and a supplemental application (an sBLA or sNDA).','Choosing the order is a strategy call: the biggest market, the fastest trial or the greatest unmet need.'],m:'A medicine grows one indication at a time.'}}}
};
if(PACK&&P.gates)Object.keys(GATES).forEach(k=>{const o=P.gates[k];if(!o||typeof o!=='object')return;const f=GATES[k];
  GATES[k]=C=>{const g=Object.assign({},f(C));['who','intro','evnote','title'].forEach(x=>{if(typeof o[x]==='string'&&o[x])g[x]=fill(o[x])});
    if(o.ev&&Array.isArray(o.ev.rows)&&Array.isArray(o.ev.cols))g.ev=evTable(o.ev.cols.map(fill),o.ev.rows.map(r=>r.map(fill)));else if(o.ev&&Array.isArray(o.ev.list))g.ev=evList(o.ev.list.map(fill));
    if(o.q&&o.q.q&&Array.isArray(o.q.a)&&o.q.r>=0&&o.q.r<o.q.a.length)g.q={q:fill(o.q.q),a:o.q.a.map(fill),r:o.q.r,e:fill(o.q.e||'')};
    if(o.story&&o.story.text)g.story=o.story;return g}});
function openGate(id){queue.push({kind:'gate',id});pump()}
function renderGate(mid,card){
  const m=allMain().find(x=>x.id===mid),G=GATES[m.gate](ctx());
  card.innerHTML='<img class="art" src="art/'+G.art+'.svg" alt=""><span class="lbl">Stage gate \u00b7 '+STAGES[m.stage][0]+'</span><h3 id="mTitle">'+G.title+'</h3><p class="who">'+G.who+'</p>'+(G.intro?'<p>'+G.intro+'</p>':'')+G.ev+(G.evnote?'<p class="evnote">'+G.evnote+'</p>':'')+
   '<div class="q"><p>'+G.q.q+'</p>'+G.q.a.map((a,j)=>'<label><input type="radio" name="gq" id="gq_'+j+'" value="'+j+'"> '+a+'</label>').join('')+'<div class="fb" id="gFb" role="status"></div></div><div class="decide" id="gDecide" hidden></div>'+
   '<div class="btns" id="gBtns"><button class="primary" id="gCheck">Check answer</button><button id="mOk">Not yet</button></div>';
  $('gCheck').onclick=()=>{const v=card.querySelector('input[name="gq"]:checked'),fb=$('gFb');
    if(!v){fb.className='fb no';fb.textContent='Pick an answer first.';return}
    LMS.answer('gate-'+m.gate,G.q.q,G.q.a,+v.value,G.q.r);
    if(+v.value!==G.q.r){fb.className='fb no';fb.textContent='Not quite. Look at the evidence again and try another answer.';return}
    fb.className='fb ok';fb.textContent='Correct. '+G.q.e;
    if(G.story)card.querySelector('.q').insertAdjacentHTML('afterend',storyHTML(G.story,'What '+CO+' did'));
    card.querySelectorAll('input[name="gq"]').forEach(x=>x.disabled=true);
    $('gCheck').remove();
    if(G.decide){const d=$('gDecide');d.hidden=false;
      d.innerHTML='<p>'+G.decide.p+'</p>'+G.decide.o.map((o,j)=>'<button class="opt" data-o="'+j+'"><b>'+o.t+'</b><span>'+o.d+'</span></button>').join('');
      d.querySelectorAll('[data-o]').forEach(b=>b.onclick=()=>{const o=G.decide.o[+b.dataset.o];o.fx(S);if(o.log)logm(o.log,'hl');gatePass(mid)});
      $('mOk').textContent='Decide later';d.querySelector('[data-o]').focus({preventScroll:true})}
    else{const b=document.createElement('button');b.className='primary';b.id='gPass';b.textContent='Pass the review';b.onclick=()=>gatePass(mid);$('gBtns').prepend(b);b.focus({preventScroll:true})}
  };
}
function gatePass(mid){const m=allMain().find(x=>x.id===mid),title=GATES[m.gate](ctx()).title;
  $('modal').hidden=true;modalOpen=false;last=performance.now();
  logm('Passed the '+title+'.','hl');
  if(m.dur){S.running[mid]=0;logm('Started: '+m.t(ctx())+'.');Object.keys(dirty).forEach(k=>dirty[k]=1)}else finish(mid);
  save();pump()}
function closeModal(){$('modal').hidden=true;modalOpen=false;last=performance.now();pump();if(!modalOpen&&S&&S.ended)showEnding()}
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&modalOpen)closeModal()});

/* =================== QUIZZES =================== */
const CHECKS={
 ch1:()=>[
  {q:'What does an IND allow a company to do?',a:['Sell the drug','Start testing the drug in humans','Patent the molecule'],r:1,e:'The IND is the permission slip for human trials. FDA has 30 days to object.'},
  {q:'Why do we validate the target before searching for a drug?',a:['Because a drug that hits the wrong target cannot help, however well it binds','Because FDA requires it before the Series A','Because it makes manufacturing cheaper'],r:0,e:'Lack of efficacy causes more trial failures than anything else, and a target that does not drive the disease is a major cause.'}],
 ch2:()=>[
  {q:'What is the main question in Phase 2?',a:['Is it safe in healthy people?','Does it work in patients, and at what dose?','Will insurers pay for it?'],r:1,e:'Phase 2 is proof of concept and dose finding. Most drugs stop here.'},
  {q:'Why are pivotal trials randomized and blinded?',a:['To make them shorter','To remove bias in who gets the drug and how results are judged','Because placebo is cheaper'],r:1,e:'The coin flip removes selection bias. The blindfold keeps expectation out of the scoring.'}]
};
function finalQuiz(){const C=ctx();return[
  CHECKS.ch1()[0],
  {q:C.name+' is '+C.plainMod+'. Which application did you file?',a:['NDA','BLA','IND'],r:C.ab?1:0,e:C.mc?(C.ab?'Biologics use a Biologics License Application.':'Chemically made drugs use a New Drug Application.'):C.ab?'Biologics like antibodies use a Biologics License Application.':'Small-molecule drugs use a New Drug Application.'},
  CHECKS.ch2()[0],CHECKS.ch2()[1],
  {q:'You hear a patient describe a possible side effect at a conference. What do you do?',a:['Nothing, it is just one story','Report it to the safety team within the required time','Post about it online'],r:1,e:'Every employee reports possible side effects, usually within one business day.'}]}
function quizHTML(qs,p){return qs.map((q,i)=>'<div class="q"><p>'+(i+1)+'. '+q.q+'</p>'+q.a.map((a,j)=>'<label><input type="radio" name="'+p+i+'" id="'+p+i+'_'+j+'" value="'+j+'"> '+a+'</label>').join('')+'<div class="fb" id="'+p+'fb'+i+'"></div></div>').join('')}
function gradeQuiz(qs,p){let sc=0;qs.forEach((q,i)=>{const v=document.querySelector('input[name="'+p+i+'"]:checked'),fb=$(p+'fb'+i);
  if(v&&+v.value===q.r){sc++;fb.className='fb ok';fb.textContent='Correct. '+q.e}else{fb.className='fb no';fb.textContent=(v?'Not quite. ':'No answer yet. ')+q.e}});return sc}

/* =================== ONBOARDING =================== */
// One question per screen. Next stays disabled until the step is complete.
const NAME_A=['Tessel','Quillfern','Amberwick','Corvane','Halvery','Ostrin','Marrowind','Lumivale','Brightmoor','Cindral','Verrow','Solvane','Ferncastle','Wrenhollow'];
const NAME_B=['Bio','Therapeutics','Biosciences','Medicines'];
function suggestName(){return NAME_A[Math.random()*NAME_A.length|0]+' '+NAME_B[Math.random()*NAME_B.length|0]}
const pick={name:'',area:'eczema',mod:'antibody',mode:'guided'};
const namePh=suggestName();
let obStep=0;
function optsHTML(key,obj){return '<div class="opts" role="radiogroup" aria-labelledby="obTitle">'+Object.entries(obj).map(([k,v])=>'<button class="opt" role="radio" data-k="'+key+'" data-v="'+k+'" aria-checked="'+(pick[key]===k)+'"><b>'+v.label+'</b><span>'+v.blurb+'</span></button>').join('')+'</div>'}
function obPack(){const co=CO,A=AREAS.pack,W=P.welcome||{},facts=(PC.facts||[]).filter(f=>f&&f.label&&f.value).slice(0,6),ppl=(P.people||[]).filter(x=>x&&x.name).slice(0,6),vals=(P.values||[]).filter(v=>v&&v.name).slice(0,6);
  const st=[{art:'laboratory',next:'Start',html:()=>'<p class="lbl">'+(PC.name||co)+(P.unofficial?' \u00b7 unofficial edition':' \u00b7 onboarding edition')+'</p><h1 id="obTitle" tabindex="-1">'+fill(W.title||'Welcome to '+co+'.')+'</h1><p class="lead">'+fill(W.text||PC.mission||'')+'</p>'+
    (W.quote&&W.quote.text?'<blockquote class="obq"><p>\u201c'+fill(W.quote.text)+'\u201d</p>'+(W.quote.who?'<cite>'+W.quote.who+'</cite>':'')+'</blockquote>':'')+'<p class="sub">About 30 to 45 minutes. '+saveNote()+'</p>'}];
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
 {art:'laboratory',next:'Start',html:()=>'<h1 id="obTitle" tabindex="-1">Build a biotech from a hunch to a medicine.</h1><p class="lead">You will found a small biotech and take one drug from the lab bench to patients. Every step comes with a short lesson in plain English.</p><p class="sub">About 30 to 45 minutes. '+saveNote()+'</p>'},
 {art:'team-spirit',ok:()=>pick.name.trim().length>=2,html:()=>'<h2 id="obTitle" tabindex="-1">Name your company.</h2><div class="namebox"><input id="inName" maxlength="32" autocomplete="off" aria-labelledby="obTitle" placeholder="'+esc(namePh)+'" value="'+esc(pick.name)+'"><button class="linkish" id="btnSuggest">Suggest one</button></div><p class="lead">You start with four people, a rented lab bench and $3 million from early investors.</p>'},
 {art:'doctors',html:()=>'<h2 id="obTitle" tabindex="-1">Pick a disease to take on.</h2>'+optsHTML('area',AREAS)},
 {art:'chemist',html:()=>'<h2 id="obTitle" tabindex="-1">Pick the kind of medicine.</h2>'+optsHTML('mod',MODS)},
 {art:'choose',html:()=>'<h2 id="obTitle" tabindex="-1">How forgiving should the world be?</h2>'+optsHTML('mode',MODES)},
 {art:'accept-terms',next:'Found the company',html:()=>'<h2 id="obTitle" tabindex="-1">Before you start.</h2><p class="lead">You are founding <b>'+esc(pick.name.trim())+'</b> to take on '+AREAS[pick.area].dis+' with '+(pick.mod==='antibody'?'an antibody':'a small-molecule pill')+', in '+MODES[pick.mode].label+' mode.</p>'+FINE}
];
function obOk(){const f=OB[obStep].ok;return !f||f()}
function obValidate(){$('obNext').disabled=!obOk()}
function obGo(i){obStep=i;const st=OB[i],box=$('obCopy');
  box.innerHTML=st.html();$('obArt').src='art/'+st.art+'.svg';
  if(OB[i+1]){const im=new Image();im.src='art/'+OB[i+1].art+'.svg'}
  $('obProg').innerHTML=OB.map((_,j)=>'<i class="'+(j<=i?'on':'')+'"></i>').join('');
  $('obBack').hidden=i===0;$('obNext').textContent=st.next||'Next';obValidate();
  box.querySelectorAll('.opt').forEach(b=>b.onclick=()=>{pick[b.dataset.k]=b.dataset.v;box.querySelectorAll('.opt[data-k="'+b.dataset.k+'"]').forEach(x=>x.setAttribute('aria-checked',x===b))});
  const inp=$('inName');
  if(inp){inp.oninput=()=>{pick.name=inp.value;obValidate()};
    inp.onkeydown=e=>{if(e.key==='Enter'&&obOk())obNextStep()};
    $('btnSuggest').onclick=()=>{pick.name=suggestName();inp.value=pick.name;obValidate();inp.focus()};
    inp.focus({preventScroll:true})}
  else $('obTitle').focus({preventScroll:true});
}
function obNextStep(){if(!obOk())return;if(obStep<OB.length-1){obGo(obStep+1);window.scrollTo(0,0);return}foundCompany()}
$('obNext').onclick=obNextStep;$('obBack').onclick=()=>{if(obStep>0)obGo(obStep-1)};
function foundCompany(){
  S=fresh(makeCfg(pick.name,pick.area,pick.mod,pick.mode));
  if(PACK){logm('Week 1. Day one at '+S.cfg.company+'. A small team, one idea and $3M of seed money (game numbers).');logm('The plan: '+(PG.bet?fill(PG.bet):ctx().targetShort+' could be the key to treating '+ctx().dis)+'.')}
  else{logm('Week 1. '+S.cfg.company+' is founded. Four people, one rented bench, $3M of seed money.');
  logm('The plan: block '+ctx().targetShort+' to treat '+ctx().dis+'.')}
  save();startGame();showLesson('welcome');
}

/* =================== ACTIONS =================== */
function sciCost(){return 40000*Math.pow(1.07,S.sci)}
function siteCost(){return 150000*Math.pow(1.04,S.sites)}
function repCost(){return 1.5e6*Math.pow(1.03,S.reps/10)}
function lineCost(){return 40e6*Math.pow(1.18,Math.max(0,S.lines-1))}
$('btnAssay').onclick=()=>{S.data+=S.perClick};
$('btnHire').onclick=()=>{const c=sciCost();if(S.cash<c)return;S.cash-=c;S.sci++;if(S.sci===1)logm('First scientist hired. Salaries now cost money every week.')};
$('btnSite').onclick=()=>{const c=siteCost();if(S.cash<c)return;S.cash-=c;S.sites++;if(S.sites===1)logm('First trial site opened. A hospital team is now finding patients for you.')};
$('btnScreen').onclick=()=>{
  const tr=Object.values(S.trials).find(t=>t.state==='enrolling');if(!tr)return;
  const cfg=trialCfg(tr.id);
  if(Math.random()<AREAS[S.cfg.area].screen){if(S.cash<cfg.cost)return;S.cash-=cfg.cost;tr.enrolled++;S.enrolled++;checkEnrolled(tr)}
  else{S.fails=(S.fails||0)+1;if(S.fails===1)logm('Screen failure: that patient did not meet the entry criteria. Rates vary by disease; it is common for a third to half of screened patients not to qualify, and more in cancer trials.')}
};
$('btnReps').onclick=()=>{const c=repCost();if(S.cash<c)return;S.cash-=c;S.reps+=10};
$('btnBio').onclick=()=>{const c=lineCost();if(S.cash<c)return;S.cash-=c;S.lines++;logm('New '+ctx().M.lineOne+' qualified.')};
document.querySelectorAll('[data-speed]').forEach(b=>b.onclick=()=>{S.speed=+b.dataset.speed;renderFooter()});
$('btnPauseLessons').onclick=()=>{S.pauseLessons=!S.pauseLessons;renderFooter()};
let resetArmed=0;
$('btnReset').onclick=()=>{
  if(!resetArmed){resetArmed=1;$('btnReset').textContent=PACK?'Click again to erase your progress':'Click again to erase this company';setTimeout(()=>{resetArmed=0;renderFooter()},3000);return}
  resetArmed=0;LMS.clear();try{localStorage.removeItem(KEY)}catch(e){}S=null;$('game').hidden=true;$('setup').hidden=false;$('modal').hidden=true;modalOpen=false;queue.length=0;pick.name='';obGo(0);window.scrollTo(0,0);
};
function renderFooter(){
  document.querySelectorAll('[data-speed]').forEach(b=>b.setAttribute('aria-pressed',S&&S.speed===+b.dataset.speed));
  $('btnPauseLessons').setAttribute('aria-pressed',S&&S.pauseLessons);
  $('btnPauseLessons').textContent='Upgrade lessons: '+(S&&S.pauseLessons?'on':'off');
  if(!resetArmed)$('btnReset').textContent=PACK?'Restart from day one':'Start a new company';
}

function costOf(m){return typeof m.c==='function'?m.c(S):m.c}
function durOf(m){return m.id==='file'&&S.flags.btd?2:m.dur}
function canAfford(c){return (c.cash||0)<=S.cash&&(c.ins||0)<=S.insight}
function costStr(c,dur){const a=[];if(c.ins)a.push('\u25c6 '+c.ins+' insight');if(c.cash)a.push(money(c.cash));if(dur)a.push(dur+' weeks');return a.join(' \u00b7 ')||'Free'}
function startMilestone(){
  const m=currentMilestone();if(!m||S.running[m.id]!==undefined)return;
  if(m.need&&S.data<m.need.data)return;if(m.wait&&m.wait(S))return;
  if(m.gate&&S.gatePaid[m.id]){openGate(m.id);return}
  const mc=costOf(m);if(!canAfford(mc))return;
  S.cash-=(mc.cash||0);S.insight-=(mc.ins||0);
  if(m.gate){S.gatePaid[m.id]=1;dirty.mile=1;openGate(m.id);return}
  if(m.dur){S.running[m.id]=0;logm('Started: '+m.t(ctx())+'.')}else finish(m.id);
  dirty.mile=1;
}
function buyUp(id){const u=UPS.find(x=>x.id===id);if(!u||S.done[id]||!canAfford(u.c))return;S.cash-=(u.c.cash||0);S.insight-=(u.c.ins||0);finish(id)}
function finish(id){
  const m=allMain().find(x=>x.id===id),u=UPS.find(x=>x.id===id),it=m||u;
  delete S.running[id];S.done[id]=1;it.fx(S);
  logm('Done: '+(m?m.t(ctx()):u.t)+'.','hl');
  if(!S.notes.includes(id))S.notes.push(id);
  Object.keys(dirty).forEach(k=>dirty[k]=1);
  if(S.pauseLessons||m)showLesson(id);
  if(PACK&&P.today&&P.today.after===id&&!S.notes.includes('today')){S.notes.push('today');dirty.guide=1;logm('You have caught up to where '+S.cfg.company+' is today. The rest is the road ahead.','hl');showLesson('today')}
}

/* =================== TRIALS =================== */
function startTrial(id){if(S.trials[id])return;S.trials[id]={id,state:'enrolling',enrolled:0,acc:0,t:0,att:0};
  logm(trialCfg(id).label+' is open. Target: '+fmt(trialCfg(id).n)+' patients.');dirty.trials=1;if(id!=='p1'&&id!=='p2'&&id!=='p3')dirty.label=1}
function checkEnrolled(tr){const cfg=trialCfg(tr.id);if(tr.enrolled>=cfg.n){tr.enrolled=cfg.n;tr.state='treating';tr.t=0;logm(cfg.label+': enrollment complete. Patients are now on treatment.');dirty.trials=1}}
function readout(tr){
  const cfg=trialCfg(tr.id),C=ctx();
  const p=Math.min(.97,baseP(tr.id)+S.pBonus+tr.att*.2);
  if(Math.random()<p){
    tr.state='success';
    if(tr.id==='p1'){S.flags.p1ok=1;logm('Phase 1 results: '+C.code+' was well tolerated, and blood levels support a practical dosing schedule.','hl')}
    else if(tr.id==='p2'){S.flags.p2ok=1;logm('Phase 2 results: the drug clearly beat the comparison. We have a dose for Phase 3.','hl')}
    else if(tr.id==='p3'){S.flags.p3ok=1;logm('Phase 3 results: the pivotal data met the main goal. No new safety concerns.','hl')}
    else{const rd=ctx().area==='nsclc'?26:43;S.reviews[tr.id]={t:0,dur:rd};logm(cfg.label+' succeeded. A supplemental application went to FDA.','hl');dirty.label=1}
  }else{
    tr.state='failed';
    const why={p1:'A safety signal appeared at the highest dose. We will rerun with a lower top dose and stricter stopping rules.',
      p2:'The drug helped, but not enough to be sure it was not chance. Industry-wide, about 7 in 10 drugs stop at Phase 2. We will rerun with a better-chosen patient group.',
      p3:'The comparison group did better than expected, which blurred the difference. We will add a trial with stricter entry criteria.'}[tr.id]||'The trial missed its main goal. We will tighten who enrolls and rerun it.';
    logm(cfg.label+' did not succeed. '+why,'bad');
  }
  dirty.trials=dirty.mile=1;
}
function rerun(id){const tr=S.trials[id];if(!tr||tr.state!=='failed')return;tr.att++;tr.state='enrolling';tr.enrolled=0;tr.acc=0;tr.t=0;
  logm(trialCfg(id).label+': redesigned and enrolling again. Each failure teaches us who responds.');dirty.trials=1}

/* =================== TICK =================== */
let last=performance.now(),saveT=0;
function tick(){
  if(!S||$('game').hidden){last=performance.now();return}
  const now=performance.now();let rdt=Math.min(1,(now-last)/1000);last=now;
  if(S.ended||modalOpen){render();return}
  const dt=rdt*S.speed;
  S.week+=dt;
  const burn=S.sci*7500+S.sites*4000+S.reps*5000;
  const paid=S.cash>0;S.cash-=burn*dt;if(S.cash<0)S.cash=0;
  if(S.cash<25000&&S.week-S.lastRescue>(S.cfg.mode==='guided'?10:40)&&!S.flags.launched){
    const amt=S.flags.ind?25e6:750000;S.cash+=amt;S.lastRescue=S.week;S.raised+=amt;
    logm(S.cfg.mode==='guided'?'Cash ran out. Your investors stepped in with '+money(amt)+'. (In Realistic mode this would be much harder.)':'Cash ran out. Investors agreed to a '+money(amt)+' bridge, but on tough terms that shrink everyone\'s share.','bad');
  }
  if(paid&&S.sci>0){const want=S.sci*S.assayMult*dt+S.carry,w=Math.floor(want);S.carry=want-w;S.data+=w}
  S.insight=Math.min(S.insCap,S.insight+insRate()*dt);
  for(const id in S.running){S.running[id]+=dt;const m=allMain().find(x=>x.id===id);if(S.running[id]>=durOf(m))finish(id)}
  // enrollment
  const en=Object.values(S.trials).filter(t=>t.state==='enrolling');
  if(en.length&&S.sites>0){const per=S.sites*.35*S.enrollMult*dt/en.length;
    for(const tr of en){const cfg=trialCfg(tr.id);tr.acc+=per;let w=Math.floor(tr.acc);
      w=Math.min(w,Math.floor(S.cash/cfg.cost),cfg.n-tr.enrolled);
      if(w>0){tr.acc-=w;tr.enrolled+=w;S.enrolled+=w;S.cash-=w*cfg.cost;checkEnrolled(tr)}
      if(tr.acc>5)tr.acc=5}}
  for(const tr of Object.values(S.trials)){const cfg=trialCfg(tr.id);
    if(tr.state==='treating'){tr.t+=dt;if(tr.t>=cfg.dur){tr.state='readout';tr.t=0;logm(cfg.label+': last patient visit done. Locking the data and unblinding.');dirty.trials=1}}
    else if(tr.state==='readout'){tr.t+=dt;if(tr.t>=3)readout(tr)}}
  // reviews
  for(const k in S.reviews){const r=S.reviews[k];if(S.approved[k])continue;
    r.t=Math.min(r.dur,r.t+dt);
    if(r.t>=r.dur){
      if(k==='main'){if(S.flags.inspect&&S.flags.label){S.approved.main=1;logm('Approval day. FDA approves '+ctx().name+' for '+ctx().dis+'.','hl');Object.keys(dirty).forEach(x=>dirty[x]=1)}
        else if(!r.warned){r.warned=1;logm('The review clock is done, but FDA cannot approve until the inspection and label are finished.','bad')}}
      else{S.approved[k]=1;const e=exps().find(x=>x.id===k);logm('Approved: '+e.name+' added to the label.','hl');dirty.label=dirty.mile=1}}}
  // market
  if(S.flags.launched){
    let pop=AREAS[S.cfg.area].pop;for(const e of exps())if(S.approved[e.id])pop+=e.pop;
    const cap=pop*S.access,sup=S.lines*lineCap(),lim=Math.min(cap,sup);
    const room=lim>0?Math.max(0,1-S.onTx/lim):0;
    const starts=S.reps*repK()*S.repMult*room*dt;
    S.onTx+=starts-S.onTx*AREAS[S.cfg.area].churn*dt;S.helped+=starts;
    const rev=S.onTx*unitRev()*dt;S.cash+=rev;S.revTotal+=rev;
    if(sup<cap&&S.onTx>sup*.97&&!S.supWarn){S.supWarn=1;logm('Supply is the bottleneck: more patients want the drug than you can make. Add a manufacturing line.','bad')}
    if(S.onTx<sup*.9)S.supWarn=0;
  }
  saveT+=rdt;if(saveT>5){saveT=0;save()}
  render();
}
function insRate(){return(0.4+0.15*S.sci+(S.flags.ind?1:0)+(S.flags.launched?2:0))*(S.flags.comp?2:1)}
function save(force,unload){if(!S)return;if(LMS.on){LMS.save(S,force===true,'stage-'+(stageIdx()+1),unload===true);return}try{localStorage.setItem(KEY,JSON.stringify(S))}catch(e){}}

/* =================== RENDER =================== */
function stageIdx(){
  if(exps().some(e=>S.trials[e.id]))return 7;if(S.approved.main)return 6;if(S.reviews.main||S.flags.p3ok)return 5;
  if(S.trials.p3)return 4;if(S.trials.p2)return 3;if(S.flags.ind)return 2;if(S.flags.dc)return 1;return 0}
function setBtn(el,txt,ok){if(el.textContent!==txt)el.textContent=txt;el.disabled=!ok}

function coachText(){
  const C=ctx(),m=currentMilestone();
  if(modalOpen)return 'Finish the card on screen to continue.';
  if(S.data<5&&!S.sci)return 'Click "Run an experiment" a few times. Each click adds one data point.';
  if(!S.sci&&S.data>=20)return 'Hire your first scientist. Scientists run experiments for you every week.';
  const enrolling=Object.values(S.trials).some(t=>t.state==='enrolling');
  if(enrolling&&S.sites===0)return 'Open a trial site in the clinic panel. Without sites, no patients can enroll.';
  const failed=Object.values(S.trials).find(t=>t.state==='failed');
  if(failed)return 'A trial missed. Select "Redesign and rerun" in the clinic panel. Failure is normal in this industry.';
  if(m){
    if(S.running[m.id]!==undefined)return m.t(C)+' is underway. Explore the upgrades or reread a lesson while you wait.';
    if(m.need&&S.data<m.need.data)return 'Collect '+fmt(m.need.data-S.data)+' more data points to unlock "'+m.t(C)+'". More scientists means faster data.';
    const w=m.wait&&m.wait(S);if(w){
      if(enrolling)return w+' Open more sites to enroll faster.';
      if(S.flags.launched)return w+' Meanwhile, hire field staff and add supply in the market panel.';
      return w}
    const mc=costOf(m);if(!canAfford(mc)){if((mc.ins||0)>S.insight)return 'Wait for insight to reach '+mc.ins+' to start "'+m.t(C)+'". It refills on its own.';return 'You need '+money(mc.cash)+' for "'+m.t(C)+'".'}
    if(m.gate)return S.gatePaid[m.id]?'The '+GATES[m.gate](C).title+' is waiting. Open it from the milestone card.':'Ready: open the '+GATES[m.gate](C).title+' from the milestone card.';
    return 'Ready: start "'+m.t(C)+'" in the milestone card.';
  }
  return 'Keep going.';
}

function render(){
  if(!S)return;const C=ctx();
  const act=S.flags.launched?3:S.flags.ind?2:1;
  $('coName').textContent=C.co;
  $('coSub').textContent=['','Chapter 1 \u00b7 Stealth discovery','Chapter 2 \u00b7 The clinic','Chapter 3 \u00b7 Patients'][act]+' \u00b7 '+AREAS[S.cfg.area].label+' \u00b7 '+MODS[S.cfg.mod].label+' \u00b7 '+MODES[S.cfg.mode].label;
  $('counterLbl').textContent=['','Data points','Patients enrolled in trials','Patients helped'][act];
  $('counterVal').textContent=fmt(act===1?S.data:act===2?S.enrolled:S.helped);
  $('date').textContent=dateStr(S.week);$('cash').textContent=money(S.cash);
  const burn=S.sci*7500+S.sites*4000+S.reps*5000,inc=S.flags.launched?S.onTx*unitRev():0;
  $('burnBox').hidden=$('runBox').hidden=burn===0;
  $('burn').textContent=money(burn);
  const net=burn-inc,rw=$('runway');
  if(net<=0){rw.textContent='Profitable';rw.classList.remove('low')}else{const w=S.cash/net;rw.textContent=w>520?'10+ years':Math.floor(w/4.33)+' months';rw.classList.toggle('low',w<26)}
  $('insightTop').textContent=fmt(S.insight)+' / '+fmt(S.insCap);
  $('coach').textContent=coachText();

  const si=stageIdx();
  if(LMS.on&&si!==lmsStage){lmsStage=si;LMS.progress(lmsFrac(),'stage-'+(si+1))}
  if(dirty.map||$('map').dataset.si!=si){dirty.map=0;$('map').dataset.si=si;
    $('map').innerHTML=STAGES.map((s,i)=>'<button data-st="'+i+'" class="'+(i<si?'past':i===si?'now':'')+'">'+(i+1)+' \u00b7 '+s[0]+'</button>').join('');
    $('map').querySelectorAll('[data-st]').forEach(b=>b.onclick=()=>{queue.push({kind:'stage',i:+b.dataset.st});pump()})}

  // lab
  $('discStage').textContent=S.flags.dc?'Candidate: '+C.name:S.flags.lead?'Lead optimization':S.flags.hits?'Hits in hand':S.flags.lib?'Screening':S.flags.target?'Target validated':'Target biology';
  $('btnAssay').textContent=S.perClick>1?'Run '+S.perClick+' experiments':'Run an experiment';
  $('sci').textContent=fmt(S.sci);$('assayRate').textContent=fmt(S.sci*S.assayMult);
  const hb=$('btnHire');hb.hidden=S.data<15&&!S.sci;$('hireHint').hidden=hb.hidden||S.sci>2;
  setBtn(hb,'Hire a scientist \u00b7 '+money(sciCost()),S.cash>=sciCost());
  $('insight').textContent=fmt(S.insight)+' / '+fmt(S.insCap);$('insightRate').textContent=insRate().toFixed(1);

  $('clinicPanel').hidden=!S.flags.ind;
  if(S.flags.ind){$('sites').textContent=fmt(S.sites);$('enrollRate').textContent=(S.sites*.35*S.enrollMult).toFixed(1);
    setBtn($('btnSite'),'Open a site \u00b7 '+money(siteCost()),S.cash>=siteCost());
    $('btnScreen').disabled=!Object.values(S.trials).some(t=>t.state==='enrolling');renderTrials()}

  $('commPanel').hidden=!S.flags.launched;
  if(S.flags.launched){
    let pop=AREAS[S.cfg.area].pop;for(const e of exps())if(S.approved[e.id])pop+=e.pop;
    $('onTx').textContent=fmt(S.onTx);$('addr').textContent=fmt(pop*S.access);$('supply').textContent=fmt(S.lines*lineCap());
    $('access').textContent=Math.round(S.access*100)+'%';$('rev').textContent=money(S.onTx*unitRev());$('revLbl').textContent=S.partner?'Your profit share / week':'Revenue / week';
    $('reps').textContent=fmt(S.reps);$('bio').textContent=fmt(S.lines);$('lineLbl').textContent=C.M.line;
    setBtn($('btnReps'),'Hire 10 people \u00b7 '+money(repCost()),S.cash>=repCost());
    setBtn($('btnBio'),'Add a line \u00b7 '+money(lineCost()),S.cash>=lineCost());
    if(dirty.label){dirty.label=0;
      const rows=[{name:AREAS[S.cfg.area].dis.replace(/^./,c=>c.toUpperCase()),st:'<span class="pill ok">Approved</span>'}].concat(exps().map(e=>({name:e.name,st:S.approved[e.id]?'<span class="pill ok">Approved</span>':S.reviews[e.id]?'<span class="pill live">FDA review</span>':S.trials[e.id]?'<span class="pill live">In trials</span>':'<span class="pill">Not yet</span>'})));
      $('labelList').innerHTML=rows.map(r=>'<div class="row"><span class="k">'+esc(r.name)+'</span>'+r.st+'</div>').join('')}
  }
  renderMilestone();renderUps();renderLog();renderGuide();
}

function renderMilestone(){
  const C=ctx(),m=currentMilestone(),el=$('milePanel');
  if(!m){el.innerHTML='<span class="lbl">All milestones complete</span>';return}
  const running=S.running[m.id]!==undefined,needOk=!m.need||S.data>=m.need.data,w=m.wait&&m.wait(S),aff=canAfford(costOf(m));
  const paid=!!(m.gate&&S.gatePaid[m.id]);const sig=[m.id,running,needOk,!!w,aff,paid].join('|');
  if(dirty.mile||el.dataset.sig!==sig){dirty.mile=0;el.dataset.sig=sig;
    let h='<span class="lbl">'+STAGES[m.stage][0]+(m.gate?' \u00b7 Stage gate':'')+'</span><h3>'+m.t(C)+'</h3><p class="d">'+m.d(C)+'</p>';
    if(running)h+='<div class="need"><div class="row"><span class="k">In progress</span><span class="v" id="mRunT"></span></div><div class="bar"><i id="mRunB"></i></div></div>';
    else{
      if(m.need)h+='<div class="need"><div class="row"><span class="k">Data needed</span><span class="v" id="mNeedT"></span></div><div class="bar'+(needOk?' good':'')+'"><i id="mNeedB"></i></div></div>';
      if(w)h+='<p class="wait" id="mWait"></p>';
      h+=(paid?'':'<p class="cost">Cost: '+costStr(costOf(m),durOf(m))+'</p>')+'<button class="primary big" id="mGo"'+(needOk&&!w&&(aff||paid)?'':' disabled')+'>'+(m.gate?(paid?'Return to the review':'Open the review'):(m.dur?'Start':'Do it'))+'</button>';
    }
    el.innerHTML=h;const g=$('mGo');if(g)g.onclick=startMilestone;
  }
  if(running){$('mRunB').style.width=(S.running[m.id]/durOf(m)*100)+'%';$('mRunT').textContent=Math.ceil(durOf(m)-S.running[m.id])+' weeks left'}
  if(m.need&&$('mNeedT')){$('mNeedT').textContent=fmt(Math.min(S.data,m.need.data))+' / '+fmt(m.need.data);$('mNeedB').style.width=Math.min(100,S.data/m.need.data*100)+'%'}
  if($('mWait'))$('mWait').textContent=w;
}
function renderUps(){
  const av=UPS.filter(u=>!S.done[u.id]&&u.when(S));
  const sig=av.map(u=>u.id+(canAfford(u.c)?1:0)).join(',');
  $('upPanel').hidden=!av.length;
  if(dirty.ups||$('upgrades').dataset.sig!==sig){dirty.ups=0;$('upgrades').dataset.sig=sig;
    $('upgrades').innerHTML=av.map(u=>'<button class="proj" data-u="'+u.id+'"'+(canAfford(u.c)?'':' disabled')+'><span class="t">'+u.t+'</span><span class="d">'+u.d+'</span><span class="c">'+costStr(u.c)+'</span></button>').join('');
    $('upgrades').querySelectorAll('[data-u]').forEach(b=>b.onclick=()=>buyUp(b.dataset.u))}
}
function renderTrials(){
  const box=$('trials'),sig=JSON.stringify(Object.values(S.trials).map(t=>[t.id,t.state]))+Object.keys(S.reviews).join()+(S.approved.main?1:0);
  if(dirty.trials||box.dataset.sig!==sig){dirty.trials=0;box.dataset.sig=sig;let h='';
    for(const tr of Object.values(S.trials)){const cfg=trialCfg(tr.id);
      const pill={enrolling:'<span class="pill live">Enrolling</span>',treating:'<span class="pill live">Treating</span>',readout:'<span class="pill live">Unblinding</span>',success:'<span class="pill ok">Succeeded</span>',failed:'<span class="pill bad">Missed</span>'}[tr.state];
      const odds=Math.round(Math.min(.97,baseP(tr.id)+S.pBonus+tr.att*.2)*100);
      h+='<div class="trial"><div class="tt"><b>'+esc(cfg.label)+'</b>'+pill+'</div><div class="row"><span class="k" id="tl-'+tr.id+'"></span><span class="v lbl">'+money(cfg.cost)+' / patient</span></div><div class="bar'+(tr.state==='success'?' good':'')+'"><i id="tb-'+tr.id+'"></i></div>'+
        (tr.state==='enrolling'||tr.state==='treating'?'<p class="sub">Chance of success: about '+odds+'%</p>':'')+
        (tr.state==='failed'?'<div class="btns"><button data-rerun="'+tr.id+'">Redesign and rerun</button></div>':'')+'</div>'}
    if(S.reviews.main&&!S.approved.main)h+='<div class="trial"><div class="tt"><b>'+ctx().app+' \u00b7 FDA review</b><span class="pill live">Under review</span></div><div class="row"><span class="k" id="tl-rev"></span></div><div class="bar"><i id="tb-rev"></i></div></div>';
    if(!h)h='<p class="empty">No trials yet. Start the Phase 1 milestone to open one.</p>';
    box.innerHTML=h;box.querySelectorAll('[data-rerun]').forEach(b=>b.onclick=()=>rerun(b.dataset.rerun))}
  for(const tr of Object.values(S.trials)){const cfg=trialCfg(tr.id),l=$('tl-'+tr.id),b=$('tb-'+tr.id);if(!l)continue;let t,p;
    if(tr.state==='enrolling'){t=fmt(tr.enrolled)+' of '+fmt(cfg.n)+' patients enrolled';p=tr.enrolled/cfg.n}
    else if(tr.state==='treating'){t='Week '+Math.floor(tr.t)+' of '+cfg.dur+' on treatment';p=tr.t/cfg.dur}
    else if(tr.state==='readout'){t='Locking data and unblinding\u2026';p=1}
    else if(tr.state==='success'){t='Main goal met';p=1}else{t='Main goal missed';p=1}
    l.textContent=t;b.style.width=(p*100).toFixed(1)+'%'}
  const r=S.reviews.main,l=$('tl-rev');
  if(r&&l){const months=Math.round(r.dur/4.33);l.textContent='Month '+Math.min(months,Math.floor(r.t/4.33))+' of '+months+(r.t>=r.dur?' \u00b7 waiting on inspection and label':'');$('tb-rev').style.width=(r.t/r.dur*100)+'%'}
}
function renderLog(){if(!dirty.log)return;dirty.log=0;
  $('log').innerHTML=S.log.map(e=>'<li class="'+e.c+'"><span class="w">Y'+(Math.floor(e.w/52)+1)+' W'+(Math.floor(e.w%52)+1)+'</span><span>'+esc(e.m)+'</span></li>').join('')}
function renderGuide(){if(!dirty.guide)return;dirty.guide=0;
  $('guideCount').textContent=S.notes.length+(S.notes.length===1?' lesson':' lessons');
  $('guide').innerHTML=S.notes.map((id,i)=>{const n=noteFor(id);return n?'<button data-n="'+id+'"><span>'+String(i+1).padStart(2,'0')+'</span>'+n.h+'</button>':''}).join('');
  $('guide').querySelectorAll('[data-n]').forEach(b=>b.onclick=()=>{queue.push({kind:'lesson',id:b.dataset.n,reread:1});pump()})}

/* =================== ENDING =================== */
function showEnding(){
  if(LMS.on&&!S.lmsDone){S.lmsDone=1;LMS.complete()}
  save(true);const C=ctx(),qs=(PACK?(P.quiz||[]).filter(q=>q&&q.q&&Array.isArray(q.a)&&q.r>=0&&q.r<q.a.length).slice(0,5).map(q=>({q:fill(q.q),a:q.a.map(fill),r:q.r,e:fill(q.e||'')})):[]).concat(finalQuiz()),E=P.ending||{};
  queue.length=0;modalOpen=true;
  $('modalCard').className='card wide';$('modalCard').innerHTML='<img class="art" src="art/winners.svg" alt=""><h3 id="mTitle">'+(PACK&&E.title?fill(E.title):'Welcome to the team.')+'</h3><p class="sub">Finished in '+dateStr(S.week)+'.</p>'+
   (PACK?'<p>You retraced '+poss(C.co)+' path from day one'+(P.today?' and played out the road ahead':'')+'.</p>':'')+'<p>You took a hunch about '+C.targetShort+' and turned it into '+C.name+', a medicine on '+(exps().length+1)+' labels. Along the way you saw why it takes so long, costs so much, and fails so often.</p>'+
   '<div class="recap"><div><span class="lbl">Patients helped</span><span class="num">'+fmt(S.helped)+'</span></div><div><span class="lbl">Patients in trials</span><span class="num">'+fmt(S.enrolled)+'</span></div><div><span class="lbl">Capital raised</span><span class="num">'+money(S.raised)+'</span></div><div><span class="lbl">Revenue</span><span class="num">'+money(S.revTotal)+'</span></div><div><span class="lbl">Years</span><span class="num">'+(S.week/52).toFixed(1)+'</span></div><div><span class="lbl">Lessons</span><span class="num">'+S.notes.length+'</span></div></div>'+
   (PACK&&E.text?'<p>'+fill(E.text)+'</p>':'')+'<p><b>Final check.</b> '+(qs.length===5?'Five questions from across the journey.':qs.length+' questions about '+C.co+' and the journey.')+'</p>'+quizHTML(qs,'f')+
   '<div class="btns"><button class="primary" id="fCheck">Check my answers</button><button id="fNew">'+(PACK?'Play again from day one':'Try another disease or drug type')+'</button></div><p class="lbl" id="fScore"></p>';
  $('modal').hidden=false;
  $('fCheck').onclick=()=>{const sc=gradeQuiz(qs,'f');$('fScore').textContent=sc+' of '+qs.length+' correct';
    if(LMS.on){if(!S.lmsQuiz){S.lmsQuiz=1;qs.forEach((q,i)=>{const v=document.querySelector('input[name="f'+i+'"]:checked');LMS.answer('final-q'+(i+1),q.q,q.a,v?+v.value:-1,q.r)})}LMS.score(sc,qs.length);save(true)}};
  $('fNew').onclick=()=>{resetArmed=1;$('btnReset').click()};
}

/* =================== BOOT =================== */
function startGame(){$('setup').hidden=true;$('game').hidden=false;Object.keys(dirty).forEach(k=>dirty[k]=1);renderFooter();render();window.scrollTo(0,0)}
if(PACK){const co=CO;
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
function boot(){if(S){startGame();if(S.ended)showEnding()}else{$('setup').hidden=false;obGo(0)}}
if(LMS.ready)LMS.ready.then(st=>{if(st)S=st;boot()});else boot();
setInterval(tick,100);
const bye=()=>{if(LMS.label==='xAPI'){LMS.finish(!!(S&&S.ended),S);return}save(true,true);LMS.finish(!!(S&&S.ended))};window.addEventListener('beforeunload',bye);window.addEventListener('pagehide',bye);
document.addEventListener('visibilitychange',()=>{if(document.hidden)save(true,true)});
})();
});
