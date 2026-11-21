---
name: "simbio-onboarding"
description: "Build a SimBio company edition, a browser game that onboards new hires to a biotech company's culture and science by having them retrace the company's real path from first idea to today. Use when someone wants biotech onboarding, a company version of SimBio, or science-101 training built from a company website, a leader interview, or uploaded documents."
---

# SimBio company editions

A company edition is SimBio (the biotech management game at simbio.mikeclark.design) rebuilt around one real company. The learner runs the company from day one. Every step teaches the science and the process in plain English. "Our story" notes show what the company actually did at that step, and its values show up where they were lived. When the learner catches up to where the company is today, the game keeps going as "the road ahead". It ends with a quiz on the company and the science.

You build an edition by writing one JSON **content pack**. The shared **SimBio Engine** does everything else. The person asking needs no technical skill: they give you a link, documents or a conversation, check one fact sheet, and get back a private link they can share.

**ENGINE (free edition).** This copy of the skill carries the SimBio Engine with it, so nothing is read from Mike Clark's private engine page. SKILL_DIR below means the folder this SKILL.md is in.

- `SKILL_DIR/engine/engine.js` and `SKILL_DIR/engine/engine.css`: the engine (1.1.0).
- `SKILL_DIR/engine/example-pack.json`: a complete example pack for Northbeam, a fictional demo company. Read it before writing your first pack in a session.
- `SKILL_DIR/scripts/`: `validate_pack.py`, `build_edition.py`, `smoke_test.py`, `build_lms_package.py`, `lms_check.py`. Copy them to `<scratchpad>/simbio-tools/` once per session instead of writing them out.
- `SKILL_DIR/art/`: `SOURCES.txt` and `prep_art.py` for the 20 illustrations (see "Illustrations" below).

Wherever the steps below say to read from ENGINE, use these local files instead: copy `engine.js`, `engine.css` and the prepared `art/` folder into `<scratchpad>/simbio-engine/`, and use that folder as the engine folder for the smoke test and the LMS packager. When publishing (step 6), publish every file from the edition folder plus `engine.js`, `engine.css` and the 20 `art/*.svg` files as local files; ignore the files map that points at the engine page.

**Illustrations.** The illustrations are from Storyset (storyset.com, "Bro" style). Their license allows use in each edition with credit, which the engine shows, but not passing them around as a collection, so they are not included here. The first time, ask the person to download the 20 SVGs listed in `SKILL_DIR/art/SOURCES.txt` from Storyset (free; each line has the page link) and attach them. Then run `python3 SKILL_DIR/art/prep_art.py <folder with the downloads> <scratchpad>/simbio-engine/art`, which recolors them and saves them there (the skill folder itself may be read-only). Offer to send the prepared set back as a ZIP so they can attach it next time instead of downloading again. When they attach a prepared set (files named like `laboratory.svg`, without "-bro"), copy those straight into `<scratchpad>/simbio-engine/art/`. If they want to skip the illustrations, build anyway and say the pictures will show as empty frames. The LMS packager (step 9) needs all 20, so get them before packaging.

**License.** SimBio and this skill are free under the SimBio Free License (2026) (https://github.com/iclickthemouse/simbio-engine/blob/main/LICENSE.md): free to use through 2026, and editions first built before January 1, 2027 stay free for good, updates included. From 2027, building a new edition may need a license from simbio.mikeclark.design; if today is in 2027 or later and this is a new edition, say so in one line before building. Every edition keeps the "Cooked by mikeclark.design" badge and the Storyset credit, which the license requires.

## Ground rules

These hold even if the person asks otherwise.

1. **Only information that is public or approved for internal training.** Ask who will see the edition (step 1).
   - *Anyone*: use only public sources, such as the website, press releases, SEC filings, published papers and posters, and public interviews.
   - *Employees only*: internal documents and the interview may also be used. Even then, never include unannounced clinical data or readout timing, non-public financials, fundraising or deal talks, anything marked confidential, draft or privileged, any patient information, or personal details about employees beyond name and job title.
   - For a public company, treat anything not yet announced as possible inside information and leave it out. If a document looks like it holds unannounced results or deals, stop and ask before using any of it.
2. **Every company fact has a source, and nothing is invented.** No made-up history, dates, people, quotes, numbers, values or examples. Quote only exact words from a source or from the interviewee, and only once the person confirms the quote may be attributed. A missing fact stays missing: skip that story note rather than filling it.
3. **Medicines are described the way the company describes them in public.** Never call an investigational drug "safe", "effective" or "works". Say what was studied and what the company reported ("met its primary endpoint", with the date and the source). For approved drugs, stay within the label. Nothing in the pack promotes a use that is not approved.
4. **The game parts stay fictional.** In-game investors, partners and rivals (Kettlewind Partners, Aldermoor Pharma, Calderwick Clinical, Morrowgate Bio), cash and trial results are game fiction, and the engine says so in its fine print. Real investor and partner names go only in story notes, and only when public. Never name or characterize a competitor.
5. **Who it is for decides how it is labeled.**
   - If the person works for the company or was asked by it to build this, make a branded edition: the company name, its brand palette, its logo and a leader welcome are all fine, and it should look and feel like the company's own (step 2, Brand).
   - Otherwise set `"unofficial": true`. Use public information only, no brand color, no logo, and no welcome quote unless it was published. Skip the Brand step even if asked: a logo and palette on a page the company never approved reads as the company's own. The engine then labels the edition "unofficial, made from public information, not affiliated with or endorsed by" the company.
   - Never make an edition that pretends to come from a company the person has no connection to.
6. **The science must be right.** Check target, mechanism, modality and regulatory route against the sources and the modality table below. When a built-in lesson is already accurate for the company, keep it instead of rewriting it.

## How to run it

Make a task list with these steps. Keep the conversation plain: never show the person JSON, scripts or step ids unless they ask.

### 1. Ask three things, then start

Make one AskUserQuestion call, leaving out any question the request already answers:

1. "What should I build it from?" (multiSelect): The company website · Documents I'll attach (pitch deck, handbook, PDFs) · An interview with a leader · Notes I'll paste
2. "Who will see it?": Only employees · Anyone (public information only)
3. "What's your connection to the company?": I work there or they asked me to build it · None (make an unofficial edition from public information)

Then ask in plain text for anything still missing: the website link (a company name is enough, since you can find the official site), the files, or who the leader is. If the person is unsure what to provide, suggest the website plus a 15-minute leader interview, because that combination makes the best edition.

If the person is not there to answer (a scheduled or unattended run), assume public information only and an unofficial edition unless the request says otherwise, and say so at the top of your final message.

### 2. Gather the material

Keep a numbered source list as you go (S1, S2, …) and tag every fact in your notes with its source.

- **Website.** WebFetch the home page, then the About or Company, Mission or Values or Culture, Careers, Leadership or Team, Pipeline or Science or Platform, and News or Press pages. Also fetch Investors if the company is public. Then use WebSearch ("<company> press release", "<company> Series A", "<company> IND", "<company> Phase 2") to date the timeline: founding, financings, candidate nomination, IND clearance, first patient dosed, trial starts and readouts, partnerships, approvals.
- **Documents.** Read them with the file-reading or pdf-reading skill, and note the document name and page for each fact. Watch for "confidential" or "draft" markings (rule 1).
- **Brand (branded editions only).** Get the palette and the logo so it is obvious which company the edition is for.
  - *Palette*: if Claude in Chrome is available, open the home page in a new tab and run a script with javascript_tool that returns the `:root` CSS custom properties (names like `--color-primary`, `--brand`, `--secondary`) and the most-used background, button and link colors. Otherwise WebFetch the home page and ask for theme-color and any hex codes. Choose the main brand color as `company.accent` (darken it until the validator's contrast check passes) and a lighter brand color, often the secondary, as `company.accentDark`. Keep the full set in `company.palette` as hex strings so the fact sheet can show it.
  - *Logo*: WebFetch the home page and ask for the header logo's URL, plus a white or reversed version for dark mode. The workspace and the browser tools usually cannot download the file itself, so ask the person to attach it (SVG if the site has one, otherwise a PNG with a transparent background) and give them the link. Save it as `<scratchpad>/<slug>/logo.svg` (and `logo-dark.svg`) next to pack.json. Use only a logo the company publishes on its own site or one the person provides.
  - If no logo arrives, build with the palette and the company name, and say in the hand-over that the logo is missing.
- **Interview.** Offer two ways:
  - *Live*: if the leader is the one chatting, interview them here, one question at a time, with short follow-ups (about 15 minutes).
  - *Later*: put the guide below in your reply so they can copy it, and ask for the transcript or notes (exports from Zoom, Teams or Otter work).

  Interview guide:
  1. In one sentence, what does the company do, and for whom?
  2. How did it start? Who, when, and what was the founding insight?
  3. What do you want to change in patients' lives?
  4. Tell me about the lead program: the target, the kind of medicine, the disease. What made you believe in the target?
  5. What 3 to 5 moments defined the company (first data, a financing, a setback, a breakthrough)?
  6. Tell me about one hard decision and why you made it.
  7. What are the company's values, and what is a real example of each one in action?
  8. Where is the company today, and what next milestone can be talked about publicly?
  9. Which words and acronyms do new hires hear in their first week?
  10. What should every new hire, including non-scientists, understand by the end of week one?
  11. What must NOT appear in onboarding material?
  12. May we quote you, and how should your name and title appear?

### 3. Confirm a one-page fact sheet

Send it with SendUserMessage in plain language, with these sections:

- **Company**: name, one-line description, founding year and place
- **Brand**: the palette (hex codes, with which one becomes the accent) and whether the logo is in hand, or "unofficial: no branding"
- **Lead program**: code, generic name, kind of medicine, target, disease, stage
- **Timeline**: date · what happened · source, as one line per event
- **Values**: each value with its real example
- **People named**
- **Where the company is today**
- **Glossary terms**
- **Left out**: each item and why (rule 1)
- **Open questions**: three at most

Then ask: "Anything wrong or missing? Reply 'looks good' and I'll build it." If nobody is there to answer, build from the sourced facts only and list the gaps at the top of your final message.

### 4. Write the pack

Follow the pack reference below. Map each timeline event to a step id, write the story notes, pick the track and the modality, and set `today`. Save the result as `<scratchpad>/<company-slug>/pack.json`.

### 5. Validate

Copy the scripts from `SKILL_DIR/scripts/` into `<scratchpad>/simbio-tools/` (once per session). Then run:

```
python3 <scratchpad>/simbio-tools/validate_pack.py <scratchpad>/<slug>/pack.json
```

Fix every ERROR. Fix every WARNING too, unless you have a reason to leave it (for example, the company has fewer than 4 public milestones).

### 6. Build and publish

```
python3 <scratchpad>/simbio-tools/build_edition.py <scratchpad>/<slug>/pack.json <scratchpad>/<slug>/edition
```

Publish with the Artifact tool:

- `file_path`: `<scratchpad>/<slug>/edition/index.html`
- `icon`: "flask"
- `description`: "<Company> onboarding: retrace the company's path from the lab to patients."
- `files`: every file in `<scratchpad>/<slug>/edition/` (index.html, pack.json and any logo files) plus `engine.js`, `engine.css` and the 20 `art/*.svg` files from `<scratchpad>/simbio-engine/`, as local files, each served at its own name (art under `art/`).

If this session's Artifact tool publishes a single page only, read `SKILL_DIR/engine/engine.js` and `engine.css` and inline them into the page instead, and leave out the illustrations.

### 7. Check it

1. Make sure `<scratchpad>/simbio-engine/` holds `engine.js`, `engine.css` and the prepared `art/` folder (see ENGINE above).
2. Run the smoke test:

   ```
   python3 <scratchpad>/simbio-tools/smoke_test.py <scratchpad>/<slug>/edition <scratchpad>/simbio-engine
   ```

   It plays the whole game headless. It fails on load errors, missing story notes, leftover placeholders, or a missing "today" checkpoint.
3. Read `shots/desktop-1-welcome.png`, `shots/desktop-3-first-lesson.png` and `shots/phone-2-onboarding.png`, and skim `transcript.txt` for story notes that read oddly in context.
4. Fix anything that fails and republish to the same artifact (same `file_path`). If the engine files cannot be fetched, skip the smoke test and say so in one line.

### 8. Hand it over

Keep it short:

- one sentence on what the edition is (the card already carries the link)
- who can open it: it is private until shared, through the page's Share menu
- one next step: before it goes to every employee, have communications, legal or compliance (MLR) read the fact sheet
- how to change it later: "tell me what changed"

End with one line offering an LMS package ("Want it as a SCORM or xAPI file for your LMS?") unless they already asked, in which case go straight to step 9. For an intranet or any static web host instead, read every engine file plus `pack.json` and `index.html` into one folder, zip it, and send it with SendUserFile. Any static web host can serve the folder as it is.

### 9. Package it for an LMS (when asked)

The engine has a built-in LMS connection. Inside an LMS it reports to the LMS; anywhere else it saves in the browser as usual.

What the LMS records:
- **Completion**: when the learner reaches the ending.
- **Score**: from the final check (company quiz plus science questions).
- **Pass**: when the score meets the passing score (80% unless the person says otherwise). In SCORM 1.2, a score below the pass mark shows "completed" rather than "failed", so learners can retry.
- **Answers**: each stage-gate answer and each final-check answer.
- **Progress and resume**: saved so learners can pick up on any device.

1. If the person hasn't said which format their LMS takes, make one AskUserQuestion call: "Which format does your LMS take?" with the options SCORM 1.2 (works in almost every LMS) · SCORM 2004 · xAPI (Tin Can) · Not sure (I'll make all three). Ask the passing score in the same call only if they mentioned scoring.
2. Make sure `<scratchpad>/simbio-engine/` holds the engine and the prepared art (see ENGINE above).
3. Build:

   ```
   python3 <scratchpad>/simbio-tools/build_lms_package.py <scratchpad>/<slug>/edition <scratchpad>/simbio-engine <scratchpad>/<slug>/lms --format all --mastery 80
   ```

   Use `--format scorm12`, `scorm2004` or `xapi` for just one. Use `--classic` in place of the edition folder to package plain SimBio.
4. Check each package. Fix any FAIL before sending:

   ```
   python3 <scratchpad>/simbio-tools/lms_check.py <scratchpad>/<slug>/lms/<slug>-scorm12.zip
   ```

   It runs the package the way an LMS would, against a strict mock SCORM API or a mock xAPI server. It leaves partway, relaunches, checks that progress resumed, finishes, and passes the final check.
5. Send the ZIPs with SendUserFile (`display` "attach"). Then tell the person, in a few lines:
   - Upload the ZIP as a new SCORM or xAPI course. Try it in the LMS's preview first, or in a free SCORM Cloud trial, before assigning it.
   - What gets recorded (the list above).
   - The ZIP is a snapshot. After updating the edition, rebuild the package and replace the old one in the LMS.
   - Anyone with the file can open it, so share it only where the edition's audience allows (rule 1).

Limits worth knowing: the package loads its fonts from Google Fonts and falls back to system fonts if the LMS blocks that. cmi5 is not included. xAPI sends completion and score the moment they happen; the final "exit" statement is sent while the page closes, so browsers deliver it on a best-effort basis.

### Updating an edition

When the person says something changed (for example "our Phase 2 read out" or "new values"):

1. Artifact `read` the edition with `path` "pack.json".
2. Edit the pack, then validate and rebuild.
3. Publish with the edition's `url`, sending only the new `index.html` and `pack.json`, plus any logo file that changed. The engine and art files stay as they are.
4. Usually move `today.after` forward and add story notes for the new events.

To move an edition to a newer engine, republish it with the engine files from a newer copy of this kit. If the edition is also in an LMS, rebuild its package (step 9) so the LMS copy matches.

## Pack reference

The JSON must be plain (no comments). Fields marked * are required. Text never contains `<` or `>` (write "under" or "over"). The placeholders `{co}`, `{code}`, `{name}` (the generic name once chosen, otherwise the code), `{dis}` and `{target}` work in any text field.

| Field | What it holds |
|---|---|
| `pack` | Always `1`. |
| `asOf` | When the facts were current, such as "March 2027". Shown in the fine print. |
| `unofficial` | `true` for editions by people with no connection to the company (rule 5). |
| `showBadge` | Leave it out. The SimBio license requires the "Cooked by mikeclark.design" credit, so never set it to `false`. |
| `company` | `name`*. `shortName` (used in running text, such as "Northbeam"). `mission`* (or `welcome.text`). `what`, one sentence on what the company does. `facts`, up to 6 `{label, value}` pairs, shown in two columns, so use an even number. `accent`, the brand color as "#RRGGBB", which must be dark enough for text on white (the validator checks it); it recolors buttons, labels and the illustrations. `accentDark`, an optional lighter shade for dark mode. `logo`, the file name of the company logo saved next to pack.json (such as "logo.svg"); it replaces the name tag in the header and sits above the welcome title. `logoDark`, an optional white or reversed logo for dark mode. `palette`, the brand hex codes found on the site, kept for reference. Branded editions only: the validator rejects `accent` and `logo` when `unofficial` is true. |
| `welcome` | `title` (default "Welcome to {co}."), `text`, `quote {text, who}`. |
| `people` | Up to 6 `{name, role}`: public leadership, or people who agreed to be named. |
| `values` | Up to 6 `{name*, means*, at, example}`. Use the company's exact value names. `at` is the step where the real `example` appears as an "Our values" note. Leave out `at` and `example` when no real example exists. |
| `program` | `code`*. `drug`, the generic name or `null`. `nameText`, explaining the name's stem (such as "-mab" or "-siran"). `track`*, see below. `modality`, either "antibody" or "small" (otherwise add a top-level `modality` object). `targetShort`*, a 1 to 4 word name for the target. `target`*, one plain-English clause on what the target is and does. `evidence`*, a clause on why we believe it drives the disease, as in "Here, {evidence}." `bet`*, a clause that follows "The bet: ". `selectivity`, which look-alike it must avoid. `biomarker`, the Phase 1 table's last column. `p1Note`, one sentence on half-life and dosing. `labelRisk`, one sentence on the main label risk for this drug class. |
| `modality` | Only for medicines that are not an antibody or small molecule. `label`* (such as "siRNA"). `plain`* (such as "an siRNA medicine"). `app`*, "BLA" or "NDA" (see the table). `appWhy`, one sentence on why. `line` and `lineOne`, the manufacturing line names. `p1Doses`, 4 dose labels. `doseNote`, such as "single IV infusion". |
| `disease` | `label`*, the short name. `dis`*, the full name in lowercase. `p2Text`* (the Phase 2 main measure), `p3Text`* (the Phase 3 design) and `priceText`* (such as "tens of thousands of dollars a year before discounts"). `p1Text` to override the Phase 1 description. `pop`, game patients in reach. `price`, game revenue per patient per week (built-in values are about 700 for common diseases, 5,000 for cancer and 8,000 for rare diseases). `orphan` and `breakthrough` (true or false, to unlock those upgrades). `p1InPatients`, true when first-in-human is in patients. `trials {p1, p2, p3: {label, n, dur, cost}}`. `review {dur, text}`. `p2Result {measure, arms: [[group, result], …]}`, the illustrative Phase 2 table. `p2Safety`. `p3Result`. `expansions`*, 1 to 3 items of `{id, name, pop, n, dur, illustrative, note {h, b[], m}}`. Set `illustrative: true` unless the company has announced that indication. |
| `story` | `{stepId: {when, text*, quote {text, who}}}`. Aim for 6 to 12 notes, each 1 to 3 sentences in past tense, dated and sourced. |
| `gates` | `{gateId: {who, intro, ev, evnote, q, story}}`. Leave the review questions alone unless they are wrong for this company. `ev` is either `{"list": […]}` or `{"cols": […], "rows": [[…]]}`. `q` is `{q, a[2-4], r (0-based), e}`. `story` is shown after the right answer, as "What {co} did". |
| `lessons` | `{stepId: {h*, b*[], m}}`. Replaces a built-in lesson completely. Use it for custom modalities, or when the built-in lesson is wrong for this company. |
| `titles` | `{stepId: {t, d}}`. Renames a milestone card. Never put dollar amounts in seriesA, seriesB or ipo, because the game pays its own amounts. |
| `today` | `after`*, the last step the company has completed. `text`*. `title`. `next`, its next public milestone. |
| `quiz` | Up to 5 `{q, a[2-4], r, e}` about the company. These are added to the 5 science questions at the end. |
| `glossary` | 5 to 15 `{term, def}`, shown behind a Glossary button. |
| `ending` | `{title, text}`, such as what happens next in their onboarding. |
| `sources`* | `[{title, url, note}]`, such as "Interview with Jane Doe, CEO, 12 March 2027". Shown in About. |

### Steps, in play order

| Stage | Step ids | What happens (use for mapping) |
|---|---|---|
| 1 Discovery | `welcome`, `validate`, `screen`, `hits`, `seriesA`, `lead`, `dc` (gate `cand`) | founding or licensing, target biology, the platform or library, first hits, Series A, optimization, candidate chosen |
| 2 Preclinical | `seriesB`, `cmc`, `tox`, `gmp`, `ind` (gate `ind`) | Series B, manufacturing process and partner, animal safety, first clinical batch, IND cleared |
| 3 Phase 1 | `p1`, `g_p1` (gate `p1`), `ipo` | first person dosed, Phase 1 data, IPO |
| 4 Phase 2 | `p2`, `g_p2` (gate `p2`), `eop2` | Phase 2 start, Phase 2 data and how Phase 3 is funded (partner or raise), end-of-Phase 2 meeting with FDA |
| 5 Phase 3 | `p3`, `scale` | Phase 3 start, commercial-scale manufacturing |
| 6 Review | `file` (gate `file`), `inspect`, `label` | BLA or NDA submitted, inspection, label agreed and approval |
| 7 Launch | `launch` (gate `launch`) | launch and pricing |
| 8 Growth | `g_life` (gate `life`), `exp_<id>`, `cliff` | choosing new indications, each expansion, life after exclusivity |
| Upgrades (optional, shown when relevant) | `multi`, `robot`, `eln`, `hts`, `comp`, `cro`, `biomarker`, `orphan`, `btd`, `advocacy`, `payers`, `pv`, `hub`, `guidelines` | lab tools, computational team, CRO partner, biomarker strategy, orphan designation, Breakthrough Therapy, patient groups, coverage, safety monitoring, patient support, publications |

Gate ids for `gates`: `cand`, `ind`, `p1`, `p2`, `file`, `launch`, `life`.

`today.after` by stage:

| Where the company is | `today.after` |
|---|---|
| Candidate chosen, preclinical work under way | `dc` |
| IND cleared | `ind` |
| In Phase 1 | `p1` |
| Phase 2 enrolling | `p2` |
| Phase 2 done | `g_p2` |
| In Phase 3 | `p3` |
| Filed | `file` |
| Approved | `label` |
| Launched | `launch` |
| Expanding | `g_life` |

Story notes on steps after `today` would read as history, so do not add them.

### Track

`track` sets the built-in trial sizes, odds and category-level lessons:

- `immunology`: a common chronic immune disease. Phase 1 in healthy volunteers, a dose-ranging Phase 2 of about 240 patients, two Phase 3 trials of about 600 each, and a standard 12-month review.
- `chronic`: the same numbers, for other common chronic diseases (cardiometabolic, neurology, respiratory). Always write `disease.p1Text`.
- `oncology`: Phase 1 dose escalation in patients, a single-arm Phase 2 measured by response rate, a randomized Phase 3 against standard care, priority review, and the Breakthrough Therapy upgrade.
- `rare`: a small Phase 2 (about 24 patients), one pivotal trial of about 170, and the orphan drug upgrade.

### Modality

| Medicine | `program.modality` or `modality.app` | Notes |
|---|---|---|
| Monoclonal or bispecific antibody | "antibody" (built-in) | The built-in lessons cover phage display, CHO cells and monkey toxicology. |
| Small molecule (pill or IV) | "small" (built-in) | |
| Antibody-drug conjugate, fusion protein, enzyme, other therapeutic protein | custom, app "BLA" | Write lessons for `screen`, `hits`, `lead`, `cmc`, `tox`, `gmp`. |
| siRNA, antisense oligonucleotide | custom, app "NDA" | Made by chemical synthesis. |
| Peptide of 40 amino acids or fewer | custom, app "NDA" | Longer chains are proteins, which use a BLA. |
| Radiopharmaceutical (small-molecule based) | custom, app "NDA" | |
| mRNA medicine, vaccine | custom, app "BLA" | |
| Gene therapy, cell therapy (such as CAR-T), gene editing | custom, app "BLA" | Reviewed by FDA's CBER. Phase 1 is usually in patients: set `disease.p1InPatients`, `trials.p1.label` and `p1Text`, and write `gates.p1`. |

For a custom modality, also write `gates.cand` (`ev` and `q`) and `modality.p1Doses`. The engine has neutral fallbacks, but specific lessons teach far better.

### Writing rules

- Write for a smart non-scientist. Use short sentences and one idea per sentence, and spell out every acronym the first time it appears. The house style uses everyday metaphors ("the target is the lock, the drug is the key").
- In story notes, say what happened, when, and in the company's own words where possible. Use "we" only for an official edition.
- Use real numbers only in story notes, with a source. All game numbers stay game numbers.
- Do not repeat a built-in lesson inside a story note. The note adds what this company did at that step.
- Match the company's spelling of its own names, codes and values exactly.

## Scripts

The scripts are in `SKILL_DIR/scripts/`. Copy them to `<scratchpad>/simbio-tools/` once per session.
