#!/usr/bin/env python3
"""Check a SimBio content pack before publishing. usage: python3 validate_pack.py pack.json
Exit code 1 if there are errors. Warnings are advice."""
import json, re, sys

MAIN = ['validate','screen','hits','seriesA','lead','dc','seriesB','cmc','tox','gmp','ind','p1','g_p1','ipo',
        'p2','g_p2','eop2','p3','scale','file','inspect','label','launch']
LATE = ['g_life','cliff']
UPS = ['multi','robot','eln','hts','comp','cro','biomarker','orphan','btd','advocacy','payers','pv','hub','guidelines']
GATES = ['cand','ind','p1','p2','file','launch','life']
TOKENS = {'co','code','name','dis','target'}
PANEL, DARK_PANEL = (250,252,251), (21,30,29)

def lum(rgb):
    c = [v/255 for v in rgb]
    c = [v/12.92 if v <= .03928 else ((v+.055)/1.055)**2.4 for v in c]
    return .2126*c[0]+.7152*c[1]+.0722*c[2]
def contrast(a, b):
    la, lb = sorted((lum(a), lum(b)), reverse=True)
    return (la+.05)/(lb+.05)
def hexrgb(h): return tuple(int(h[i:i+2], 16) for i in (1, 3, 5))

def main(path):
    E, W = [], []
    raw = open(path, encoding='utf-8').read()
    try: p = json.loads(raw)
    except json.JSONDecodeError as e: print('ERROR  not valid JSON:', e); return 1
    if not isinstance(p, dict): print('ERROR  the pack must be a JSON object'); return 1
    if len(raw) > 200_000: E.append('pack is over 200 KB; trim it')

    def walk(v, where):
        if isinstance(v, str):
            if '<' in v or '>' in v: E.append(f'{where}: no < or > characters (write "under" / "over")')
            for t in re.findall(r'\{([^{}]*)\}', v):
                if t not in TOKENS: E.append(f'{where}: unknown placeholder {{{t}}} (allowed: {", ".join(sorted(TOKENS))})')
        elif isinstance(v, list): [walk(x, f'{where}[{i}]') for i, x in enumerate(v)]
        elif isinstance(v, dict): [walk(x, f'{where}.{k}') for k, x in v.items()]
    walk(p, 'pack')

    def need(obj, keys, where):
        for k in keys:
            if not (isinstance(obj, dict) and obj.get(k) not in (None, '', [])): E.append(f'{where}.{k} is required')

    co, pg, d = p.get('company') or {}, p.get('program') or {}, p.get('disease') or {}
    need(co, ['name'], 'company')
    if not (co.get('mission') or (p.get('welcome') or {}).get('text')): E.append('company.mission or welcome.text is required')
    need(pg, ['code', 'track', 'targetShort', 'target', 'evidence', 'bet'], 'program')
    if pg.get('track') not in ('immunology', 'chronic', 'oncology', 'rare'): E.append('program.track must be immunology, chronic, oncology or rare')
    if pg.get('track') == 'chronic' and not d.get('p1Text'): W.append('chronic track: write disease.p1Text (the built-in text calls it an immunology drug)')
    mod = p.get('modality')
    if mod:
        need(mod, ['label', 'plain', 'app'], 'modality')
        if mod.get('app') not in ('BLA', 'NDA'): E.append('modality.app must be BLA or NDA')
        if not (isinstance(mod.get('p1Doses'), list) and len(mod['p1Doses']) == 4): W.append('modality.p1Doses: give 4 dose labels for the Phase 1 table')
        for k in ['screen', 'hits', 'lead', 'cmc', 'tox', 'gmp']:
            if k not in (p.get('lessons') or {}): W.append(f'custom modality: write lessons.{k} so the {k} lesson explains how {mod.get("label","this modality")} works')
        if not ((p.get('gates') or {}).get('cand') or {}).get('ev'): W.append('custom modality: write gates.cand.ev and gates.cand.q (candidate comparison table)')
    elif pg.get('modality') not in ('antibody', 'small'): E.append('program.modality must be "antibody" or "small", or add a modality object')
    if pg.get('drug') and not pg.get('nameText'): W.append('program.nameText: explain the generic-name stem (for example "-mab", "-siran")')

    need(d, ['label', 'dis', 'p2Text', 'p3Text', 'priceText', 'expansions'], 'disease')
    for k in ('pop', 'price'):
        if k in d and not (isinstance(d[k], (int, float)) and d[k] > 0): E.append(f'disease.{k} must be a positive number')
    for t, lo in (('p1', 16), ('p2', 12), ('p3', 40)):
        tr = (d.get('trials') or {}).get(t)
        if tr:
            if 'n' in tr and not (isinstance(tr['n'], int) and tr['n'] >= lo): E.append(f'disease.trials.{t}.n must be a whole number of at least {lo}')
            for k in ('dur', 'cost'):
                if k in tr and not (isinstance(tr[k], (int, float)) and tr[k] > 0): E.append(f'disease.trials.{t}.{k} must be positive')
    exps = d.get('expansions') or []
    if not (1 <= len(exps) <= 3): E.append('disease.expansions needs 1 to 3 entries')
    seen = set()
    for i, e in enumerate(exps):
        w = f'disease.expansions[{i}]'
        need(e, ['id', 'name'], w)
        if not re.fullmatch(r'[a-z][a-z0-9]{1,15}', str(e.get('id', ''))): E.append(f'{w}.id must be short lowercase letters/digits')
        if e.get('id') in seen: E.append(f'{w}.id is duplicated')
        seen.add(e.get('id'))
        for k, lo, hi in (('pop', 1, 10**8), ('n', 20, 5000), ('dur', 8, 104)):
            if not (isinstance(e.get(k), int) and lo <= e[k] <= hi): E.append(f'{w}.{k} must be a whole number from {lo} to {hi}')
        n = e.get('note') or {}
        if not (n.get('h') and isinstance(n.get('b'), list) and n['b'] and n.get('m')): E.append(f'{w}.note needs h, b (list) and m')
    p2r = d.get('p2Result')
    if p2r and not (isinstance(p2r.get('arms'), list) and all(isinstance(a, list) and len(a) == 2 for a in p2r['arms']) and 2 <= len(p2r['arms']) <= 5):
        E.append('disease.p2Result.arms must be 2 to 5 [group, result] pairs')

    steps = set(['welcome'] + MAIN + LATE + UPS + ['exp_' + str(e.get('id')) for e in exps])
    for sec in ('story', 'lessons', 'titles'):
        for k, v in (p.get(sec) or {}).items():
            ok = steps | {'today'} if sec == 'lessons' else (set(MAIN + UPS) if sec == 'titles' else steps)
            if k not in ok: E.append(f'{sec}.{k} is not a step id')
            if sec == 'story' and not (isinstance(v, dict) and v.get('text')): E.append(f'story.{k} needs text')
            if sec == 'lessons' and not (isinstance(v, dict) and v.get('h') and isinstance(v.get('b'), list) and v['b']): E.append(f'lessons.{k} needs h and b (list)')
            if sec == 'titles' and k in ('seriesA', 'seriesB', 'ipo') and '$' in json.dumps(v): W.append(f'titles.{k}: the game pays its own amount; put real amounts in story.{k}')
    for k, g in (p.get('gates') or {}).items():
        if k not in GATES: E.append(f'gates.{k} is not a gate id ({", ".join(GATES)})'); continue
        q, ev = g.get('q'), g.get('ev')
        if q and not (q.get('q') and isinstance(q.get('a'), list) and 2 <= len(q['a']) <= 4 and isinstance(q.get('r'), int) and 0 <= q['r'] < len(q['a']) and q.get('e')):
            E.append(f'gates.{k}.q needs q, 2 to 4 answers in a, a valid r (0-based) and e')
        if ev and not ((isinstance(ev.get('list'), list) and ev['list']) or (isinstance(ev.get('cols'), list) and isinstance(ev.get('rows'), list) and all(len(r) == len(ev['cols']) for r in ev['rows']))):
            E.append(f'gates.{k}.ev must be {{"list": [...]}} or {{"cols": [...], "rows": [[...]]}} with rows as long as cols')
        if g.get('story') and not g['story'].get('text'): E.append(f'gates.{k}.story needs text')
    for i, v in enumerate(p.get('values') or []):
        if not (v.get('name') and v.get('means')): E.append(f'values[{i}] needs name and means')
        if v.get('at') and v['at'] not in steps: E.append(f'values[{i}].at is not a step id')
        if v.get('at') and not v.get('example'): W.append(f'values[{i}]: add an example so the value appears in the {v["at"]} lesson')
    if len(p.get('values') or []) > 6: W.append('only the first 6 values are shown')
    t = p.get('today')
    order = ['welcome'] + MAIN + LATE
    if t:
        if t.get('after') not in set(MAIN + LATE) | {'exp_' + str(e.get('id')) for e in exps}: E.append('today.after must be a main step id (for example "p2")')
        if not t.get('text'): E.append('today.text is required')
        elif t.get('after') in order:
            ahead = order[order.index(t['after']) + 1:]
            late = [k for k in (p.get('story') or {}) if k in ahead]
            if late: W.append(f'story entries after today ({", ".join(late)}) will show as history; move them or move today.after')
    else: W.append('no "today": learners will not see where the company is now')
    for i, q in enumerate(p.get('quiz') or []):
        if not (q.get('q') and isinstance(q.get('a'), list) and 2 <= len(q['a']) <= 4 and isinstance(q.get('r'), int) and 0 <= q['r'] < len(q['a']) and q.get('e')):
            E.append(f'quiz[{i}] needs q, 2 to 4 answers in a, a valid r (0-based) and e')
    if not p.get('quiz'): W.append('no company quiz questions; the ending will only quiz the science')
    if len(p.get('quiz') or []) > 5: W.append('only the first 5 quiz questions are used')
    for i, g in enumerate(p.get('glossary') or []):
        if not (g.get('term') and g.get('def')): E.append(f'glossary[{i}] needs term and def')
    src = p.get('sources') or []
    if not src: E.append('sources: list at least one source (a URL, document name or "Interview with <name>, <date>")')
    for i, s in enumerate(src):
        if s.get('url') and not re.fullmatch(r'https?://[^\s"\']+', s['url']): E.append(f'sources[{i}].url must start with http:// or https://')
    if len(p.get('story') or {}) < 4: W.append('fewer than 4 story notes; aim for 6 to 12 across the stages the company has reached')
    for sec in ('story',):
        for k, v in (p.get(sec) or {}).items():
            if len(str(v.get('text', ''))) > 420: W.append(f'{sec}.{k}.text is long; keep notes under about 60 words')
    for k, v in (p.get('lessons') or {}).items():
        for j, para in enumerate(v.get('b') or []):
            if len(para) > 480: W.append(f'lessons.{k}.b[{j}] is long; split it or trim it')

    for k in ('logo', 'logoDark'):
        if co.get(k) and not re.fullmatch(r'[\w.-]+\.(svg|png|webp|jpg|jpeg)', str(co[k]), re.I): E.append(f'company.{k} must be an image file name next to pack.json, such as logo.svg')
    if co.get('logoDark') and not co.get('logo'): E.append('company.logoDark needs company.logo')
    if not p.get('unofficial') and co.get('accent') and not co.get('logo'): W.append('branded edition without company.logo: add the logo so it is clear which company this is for')
    if p.get('unofficial'):
        if co.get('accent'): E.append('unofficial edition: leave out company.accent (no company branding)')
        if co.get('logo'): E.append('unofficial edition: leave out company.logo (no company branding)')
        if (p.get('welcome') or {}).get('quote'): W.append('unofficial edition: use a welcome quote only if it is published, and cite it in sources')
    acc = co.get('accent')
    if acc is not None:
        if not re.fullmatch(r'#[0-9a-fA-F]{6}', str(acc)): E.append('company.accent must look like #1A2B3C')
        else:
            L = hexrgb(acc)
            if contrast(L, PANEL) < 4.5: E.append(f'company.accent {acc} is too light for text on white ({contrast(L, PANEL):.1f}:1, need 4.5); use a darker shade')
            D = hexrgb(co['accentDark']) if re.fullmatch(r'#[0-9a-fA-F]{6}', str(co.get('accentDark', ''))) else tuple(round(v + (255 - v) * .45) for v in L)
            if contrast(D, DARK_PANEL) < 4.5: E.append(f'dark-mode accent is too dark ({contrast(D, DARK_PANEL):.1f}:1); set company.accentDark to a lighter shade')

    for x in E: print('ERROR  ', x)
    for x in W: print('WARNING', x)
    print(f'{len(E)} error(s), {len(W)} warning(s)' + ('' if E else ' · pack is ready to publish'))
    return 1 if E else 0

if __name__ == '__main__':
    sys.exit(main(sys.argv[1]))
