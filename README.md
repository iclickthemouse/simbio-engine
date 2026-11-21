# SimBio

SimBio is a browser game about how biotech works. You found a small company, pick a disease and a kind of medicine, and take one drug from an idea in the lab to patients. Every step comes with a short lesson in plain English, and every big decision is a stage-gate review you have to pass. It's built for people who work at biotechs but don't have a science background.

Play it at **[simbio.mikeclark.design](https://simbio.mikeclark.design)**.

This repo is the whole thing: the game, the **SimBio Engine** behind it, and the Claude skill that builds company editions. It's **free to use through 2026**, and editions you start before 2027 stay free for good (see [LICENSE.md](LICENSE.md)).

## Create one for your company (free through 2026)

SimBio can be rebuilt around a real biotech: new hires replay the company's actual path from its first idea to today, then keep playing into "the road ahead". A Claude skill does the work in one chat: it researches the company, drafts a fact sheet for you to check, applies your brand colors and logo, builds and tests the edition, and packages it for your LMS (SCORM or xAPI).

1. Download **[simbio-onboarding.zip](https://simbio.mikeclark.design/create/simbio-onboarding.zip)** (also in `skill/` here).
2. In Claude, turn on code execution, then go to Customize > Skills and upload the ZIP.
3. Start a chat: "Make a SimBio onboarding for our company. Here's our website: ..."

More at **[simbio.mikeclark.design/create](https://simbio.mikeclark.design/create/)**. Want it built for you? Email hi@mikeclark.design.

## What's in here

| Folder | What it is |
|---|---|
| `game/` | Classic SimBio: `simbio.html` (the whole game in one file), `create.html` (the "Create one for your company" page) and `build_site.py`, which builds the hosted website. |
| `engine/` | The SimBio Engine. `dist/` holds the built `engine.js` and `engine.css`. `packs/` holds example content packs. `demo/` is the Northbeam demo page. `test/` holds the regression tests. `tools/` holds the pack validator, the edition builder, the smoke test and the LMS packager and checker. `patch_engine.py` builds the engine from `game/simbio.html`. |
| `skill/` | The Claude skill (`simbio-onboarding/`, also zipped) that builds company editions. It carries the engine, the tools and an example pack, so it runs on its own. |
| `art/` | Where the 20 illustrations go. They aren't in the repo (see [Illustrations](#illustrations)). Includes `SOURCES.txt`, `prep_art.py` and `svgo.config.js`. |

## How it's built

- **One file, no framework.** `game/simbio.html` is the entire classic game: plain HTML, CSS and JavaScript, with no build step and no dependencies. Progress saves in the browser.
- **A game loop with lessons.** Time advances in weeks. Experiments produce data, data unlocks milestones, and each milestone opens a short lesson. The seven stage gates (candidate, IND, Phase 1, Phase 2, filing, launch, lifecycle) are review questions you have to answer before the company moves on.
- **Real odds.** Guided mode is forgiving. Realistic mode uses industry success rates for each phase, so most drugs fail, just like in real life.
- **The engine is the game plus content packs.** `engine/patch_engine.py` layers content-pack support on top of `simbio.html`. A content pack is one JSON file that swaps in a company's name, mission, program, disease, timeline ("Our story" notes), values, glossary and quiz. With no pack, the engine plays exactly like classic SimBio. See `engine/packs/northbeam-demo.json`, a complete example for a fictional company.
- **Branding.** A pack can set a brand color. The engine recolors the interface and the illustrations to match, in the browser, with a lighter shade for dark mode.
- **LMS-ready.** The engine reports completion, score and answers to a learning system over SCORM 1.2, SCORM 2004 or xAPI when it runs inside one, and saves locally everywhere else.

## Host classic SimBio

1. Put the 20 illustrations in `art/` (see the next section).
2. Run `python3 game/build_site.py`. This writes `site/` and `site.zip`, including the "Create one for your company" link and the `/create/` page with the skill download.
3. Upload `site.zip` to any static host. simbio.mikeclark.design runs as a Cloudflare Worker with static assets.

## Illustrations

The illustrations are from [Storyset](https://storyset.com), in the "Bro" style. They're free to use with credit ("Illustrations by Storyset"), but the license doesn't allow redistributing them as a collection, so they aren't committed here.

To recreate them:

1. Download each SVG listed in `art/SOURCES.txt` from Storyset into one folder. Keep the file names, such as `laboratory-bro.svg`.
2. Run `python3 art/prep_art.py <that folder>`. It recolors each one to SimBio blue (#003FCC) and saves it in `art/` under the name the game expects. Add a second folder argument to save them somewhere else.
3. Optionally, shrink the files with `npx svgo --config art/svgo.config.js art/*.svg`.

## Developing the engine

- `game/simbio.html` is the single source of truth. `engine/patch_engine.py` layers content-pack support on top of it.
- To build, run `python3 engine/patch_engine.py`. It writes `engine/dist/engine.js`, `engine/dist/engine.css` and `engine/test/engine-inline.html`, the single-file build the tests use. That last file isn't committed, so run the build before any test.
- **Regression test:** `python3 engine/test/compare.py` plays classic SimBio and the engine side by side, with the same random seed, across all 12 combinations of disease, drug type and difficulty. It should print `ALL IDENTICAL`.
- **Pack test:** `python3 engine/test/run2.py engine/packs/northbeam-demo.json guided a` auto-plays an edition and reports any broken text or stage gates.
- **Note:** `engine/dist/` is the current published build, engine 1.1.0, which adds the LMS connection. `patch_engine.py` doesn't include the 1.1.0 changes yet, so running it rebuilds 1.0.0.

## Notes

- SimBio is an educational tool. Companies, drugs, investors, partners and rivals in the classic game are fictitious, and some science and processes are simplified so the game stays playable. Nothing in it is medical, regulatory or investment advice.
- Northbeam Therapeutics, the demo company, is fictional. `engine/packs/test-*.json` are test packs, not real companies.
- License: the [SimBio Free License (2026)](LICENSE.md). Free through 2026; editions first built before 2027 stay free for good; from 2027, building new editions may be paid. Keep the "Cooked by mikeclark.design" and Storyset credits. Illustrations: Storyset's license.

Made by [Mike Clark](https://mikeclark.design).
