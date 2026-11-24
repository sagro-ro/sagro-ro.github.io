# Sagro County-Grouped Project Map Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the three unsupported project stories with six interactive county groups containing exactly the 13 supplied localities, while preserving accessible map behavior and removing obsolete claims from every generated public surface.

**Architecture:** Keep a single ordered TypeScript county-group collection and the bundled Romania SVG geometry. Reuse the existing progressive-enhancement map, safe fragment parser, source links, and static cards; replace the rich-story model and historical evidence, not the interaction architecture.

**Tech Stack:** Astro 7.4.7 static output, strict TypeScript, `@svg-maps/romania` 2.0.0, Vitest 5.1.0, Playwright/Chromium, scoped axe checks.

**Spec:** `docs/superpowers/specs/2026-11-24-project-county-map-design.md`

## Global Constraints

- The ordered dataset is exactly: Mehedinți (`ro-mh`, `mehedinti`) — Vânători; Dolj (`ro-dj`, `dolj`) — Băilești, Rojiște, Listeava, Ostroveni, Valea Stanciului; Olt (`ro-ot`, `olt`) — Corabia, Vișina; Teleorman (`ro-tr`, `teleorman`) — Turnu Măgurele, Traian; Călărași (`ro-cl`, `calarasi`) — Borcea, Mănăstirea; Constanța (`ro-ct`, `constanta`) — Horia. Six counties, 13 localities, badges 01–06.
- Do not publish customers, equipment attribution, quotes, outcomes, project years, seasonal wording, warranties, response times, service guarantees, ratings, exact premises, coordinates, or unsupported search/AI claims.
- Current provenance is a supplied locality list reviewed editorially on **24 noiembrie 2026**, not independently verified; it is not historical-project evidence.
- Preserve `/proiecte/#proiect-<county-slug>`, `/surse-proiecte/#sursa-<county-slug>`, all eight indexed routes and their sitemap order, map attribution/licensing, non-JavaScript cards, and honest disabled-form/direct-contact behavior.
- No geocoding, third-party map service, dependency or schema addition, real external form delivery, or unrelated lifecycle refactor.
- Every changed behavior gets a behavioral assertion first; watch it fail for the old content before the minimal production change, then rerun the focused check and project suite.
- Write no commit, push, merge, deployment, DNS/TLS, Search Console, or other external side effect. This no-commit boundary supersedes the plan template's usual commit step. Leave existing plan/history files as dated records; update current maintenance/verification documentation.

## Review Focus

- A centered 44px marker can be geometrically valid but obscured by its neighbor: Task 3 must actual-click each marker at 320px and 375px, not just measure boxes.
- A selected fragment can be off-screen or concealed by the sticky header: Task 3 must assert settled visibility/header clearance and back-to-empty-hash behavior for the new county slugs.
- A direct evidence anchor can leave shared provenance above the viewport: Task 2 must place local current-list context inside every anchored source section and check it at 375px; Task 4 repeats that journey against production output.
- Curated text can retain an obsolete three-project sentence even when the data is correct: Task 1 must assert all county/locality lines and forbidden old claims in `llms.txt`; Task 4 scans built pages and `llms.txt` independently.
- The deferred stale cleanup handle can affect a replacement map instance: do not change it unless implementation exposes a current-user path; Task 3 tests the existing initialized→cleanup behavior and records that boundary without expanding scope.

---

### Task 1: County Data, Current Provenance, Fragment Cases, and Curated Text

**Files:**
- Modify: `src/data/projects.ts`
- Modify: `src/data/project-evidence.ts`
- Modify: `src/data/site.ts`
- Modify: `src/pages/llms.txt.ts`
- Modify: `docs/discovery-maintenance.md`
- Test: `tests/data/projects.test.ts`
- Test: `tests/data/site.test.ts`
- Test: `tests/unit/project-fragment.test.ts`
- Test: `tests/unit/llms.test.ts`

**Interfaces:**
- Produces: `CountyId = 'ro-mh' | 'ro-dj' | 'ro-ot' | 'ro-tr' | 'ro-cl' | 'ro-ct'`; `Project` with exactly `slug: string`, `countyId: CountyId`, `countyLabel: string`, `localities: readonly string[]`, `sourceUrl: string`; ordered `projects: readonly Project[]`.
- Produces: `projectEvidence = { route: '/surse-proiecte/', reviewedAtLabel: '24 noiembrie 2026' } as const`, `projectEvidenceNote: string`, and `getProjectSourceUrl(slug: string): string`.
- Consumes: existing `getProjectSlugFromHash(hash: string, availableSlugs: readonly string[]): string | null` without changing its implementation.

- [ ] **Step 1: Write the failing exact-data and provenance tests**

Replace historical-story assertions with four tests: exact ordered county data; supplied-list provenance; absence of story/coordinate fields; and exact ordered flattened localities. Keep the total unit/data count at 100. For exact data use a literal expected ordered array of `[slug, countyId, countyLabel, localities]` with all values from Global Constraints. Assert six unique slugs, six unique county IDs, the flattened locality list in order with length 13, and every `sourceUrl` equal to `/surse-proiecte/#sursa-${slug}`. Assert `Object.keys(project).sort()` contains only the five `Project` fields, and neither individual objects nor serialized data contain `name`, `clientLabel`, `systemLabel`, `summary`, `quote`, `latitude`, `longitude`, `coordinates`, `Craiova`, `Predești`, `Rojiste`, or `Visina`.

Assert the exact two-field `projectEvidence`, `getProjectSourceUrl('dolj') === '/surse-proiecte/#sursa-dolj'`, and that `projectEvidenceNote` contains the supplied-for-update meaning, review date, `nu este o verificare independentă`, and county/locality rather than exact-premises limits. Change parser fixtures to the six county slugs: all valid slugs accepted; encoded `#proiect-%64olj` → `dolj` and `#proiect-tele%6Frman` → `teleorman`; empty, `#`, `#proiect-`, unrelated, missing-`#`, uppercase-prefix, unknown, and malformed escapes return null without throwing.

- [ ] **Step 2: Write the failing curated-copy tests before changing the generator**

In `tests/unit/llms.test.ts`, require a `## Localități cu implementări` section with one line per county containing `Județul ${countyLabel}: ${localities.join(', ')}`. Require the updated date/context, absence of `historicalUrl`-era copy and `Ferma Baciu|Patino Robot|două sezoane|Ialomița|citat|Zimmatic.*(?:proiect|implement)/i`, and canonical route/form checks retained. Do not add numeric project-count marketing that the existing unsupported-statistics test forbids; tests derive six and 13 from the supplied dataset.

- [ ] **Step 3: Run the unit/data tests and observe RED**

Run: `npm test -- tests/data/projects.test.ts tests/unit/project-fragment.test.ts tests/unit/llms.test.ts`
Expected: failures identify the three old records/historical fields and old historical `llms.txt` copy; no production edit precedes this run.

- [ ] **Step 4: Implement the exact data and current provenance**

Replace `src/data/projects.ts` with the ordered six-record `Project` collection and interface above; derive each `sourceUrl` through `getProjectSourceUrl`. Remove `projectEvidence.historicalUrl` and `projectHistoricalNote`. Export `projectEvidenceNote` with exact public copy:

```text
Localitățile au fost furnizate pentru această actualizare a site-ului și revizuite editorial la 24 noiembrie 2026. Lista nu este o verificare independentă. Marcajele identifică județe, iar localitățile listate sunt singurele locuri furnizate; nu reprezintă adrese exacte ale instalațiilor sau coordonate.
```

Keep `site.projectDisclaimer` concise and map-specific: markers are county references, supplied localities are the only places listed, and neither identifies an exact installation address or coordinates. Preserve all other verified business/contact data unchanged.

- [ ] **Step 5: Generate honest current-list `llms.txt` and supersede current maintenance guidance**

Keep `createLlmsTxt(site: URL): string`, canonical link order, verified identity/contact, and unconfigured-form notice unchanged. Replace only project prose with the `## Localități cu implementări` heading, `/proiecte/` county/locality list, `/surse-proiecte/` context link, supplied-update/review/independence statement, and exact-premises limitation. Do not add structured location data or crawler instructions.

In `docs/discovery-maintenance.md`, change the scope and replace **Historical project provenance** with **Current supplied locality context**. Explain that the obsolete Ialomița and three-story material is superseded rather than redirected, the six current source/backlink anchors must remain synchronized, no historical statement supports the new list, and `llms.txt` describes supplied—not independently verified—localities. Keep unrelated reviewed legacy mappings unchanged.

- [ ] **Step 6: Verify the unit/data slice**

Run: `npm test`
Expected: **12 test files, 100/100 tests pass**. Typecheck and browser verification are deferred until every consumer is updated in Tasks 2–3; do not claim those pass here. Add a ledger completion entry with actual results; make no Git commit.

### Task 2: Server-Rendered County Cards, Evidence, and Public Metadata

**Files:**
- Modify: `src/components/projects/ProjectCard.astro`
- Modify: `src/components/projects/ProjectMap.astro`
- Modify: `src/pages/surse-proiecte.astro`
- Modify: `src/pages/index.astro`
- Modify: `src/pages/proiecte.astro`
- Modify: `src/scripts/project-map.ts`
- Test: `tests/browser/projects.spec.ts`
- Test: `tests/browser/home.spec.ts`
- Test: `tests/browser/finishing.spec.ts` only if its route fixtures retain old project/source metadata

**Interfaces:**
- Consumes: Task 1 `Project`, `projectEvidence`, `projectEvidenceNote`, and `site.projectDisclaimer` unchanged.
- Produces: for each county, `#proiect-<slug>`, `[data-project-localities]`, a `.project-source` link including compact cards, `#sursa-<slug>`, `[data-project-evidence-context]`, and a `.project-evidence__back` backlink.
- Produces: marker/list accessible names containing the county and complete locality information; retain `data-project-map`, `data-map-controls`, `data-project-list-controls`, `data-project-story`, `data-map-status`, and `data-project-preview` selectors.

- [ ] **Step 1: Replace static/historical browser expectations before component changes**

Require six cards, controls and markers on `/proiecte/`; all six `ro-mh`, `ro-dj`, `ro-ot`, `ro-tr`, `ro-cl`, `ro-ct` paths; badges `01`–`06`; both attribution links; and every card's complete localized `<li>` list plus exact internal source href without `target="_blank"`. Require all six source sections with the county/localities, `projectEvidence.reviewedAtLabel`, supplied-update wording, non-independence and exact-premises limitation; every backlink has `/proiecte/#proiect-<slug>` and HTTP 200 destination. Explicitly forbid the old client names, story slugs, Ialomița area, quotes, two-season wording and project-specific equipment copy in `/`, `/proiecte/`, `/surse-proiecte/`, while retaining unrelated systems content.

For the mobile source-link test, follow each actual `.project-source` from `/proiecte/#proiect-<slug>` to `#sursa-<slug>` at 375px and require its local `[data-project-evidence-context]` to be visible in the viewport and contain `projectEvidenceNote`. In a compact/homepage test require six `[data-project-preview]` cards and six source links, not three previews. Test new titles/descriptions consistently in existing metadata/finishing tests if their central route arrays still contain old copy.

- [ ] **Step 2: Run the focused browser tests and observe RED**

Run: `npx playwright test tests/browser/projects.spec.ts tests/browser/home.spec.ts --grep "project route|project provenance|source links|homepage|without JavaScript"`
Expected: failures on absent Mehedinți/Dolj/Olt/Teleorman content and six-card/source requirements, not an import/compile typo.

- [ ] **Step 3: Replace the rich card and map presentation with county groups**

`ProjectCard.astro` keeps its `project: Project` and `compact?: boolean` props. Render county identity as the `.project-story__location`, a county/locality heading, the full ordered locality list in `<ul data-project-localities>`, concise `[data-project-evidence-context]` using `projectEvidenceNote`, and `Vezi contextul localităților` as the `.project-source` link on every card. Use `h3` only for compact cards and `h2` otherwise; remove history/blockquote/client/system rendering.

`ProjectMap.astro` labels the legend `Județ cu localități furnizate`, list group `Selectează un județ cu localități`, and both marker/list accessible text with `Județul ${countyLabel}: ${localities.join(', ')}` rather than story/system names. Keep the MapSVG/CC BY attribution and geometry-derived button layout unchanged. In `project-map.ts`, retain all lifecycle logic and geometry positioning; change announcement copy to `Localități selectate: ${project.countyLabel} — ${project.localities.join(', ')}.` so no removed field remains.

- [ ] **Step 4: Rebuild `/surse-proiecte/` and align page metadata/copy**

Retain `/surse-proiecte/` as current supplied-list context, not old historical stories. Remove the external historical Sagro-page link and rich-story sections. Give each county an `<section id="sursa-${slug}" data-project-evidence>` with county heading, full locality list, local `projectEvidenceNote`, and `Vezi județul în hartă` backlink with class `project-evidence__back`. Explain the supplied-update provenance and review date in the introduction and do not redirect the unrelated Ialomița story.

Update titles, descriptions, headings and introductory copy on `/surse-proiecte/`, `/proiecte/`, and `/` to the six-county/13-supplied-locality presentation, without calling the list independently verified, recounting customer experiences, or naming systems/customers. Keep `ProjectMap compact`, section/route order, eight sitemap routes, all contact/form behavior, and unrelated offerings unchanged.

- [ ] **Step 5: Run focused checks and typecheck**

Run: `npx playwright test tests/browser/projects.spec.ts tests/browser/home.spec.ts --grep "project route|project provenance|source links|homepage|without JavaScript"`
Expected: all selected checks pass, including compact source links, mobile local provenance, and no-JavaScript cards (after its updated six-card assertion is run).
Run: `npm run typecheck`
Expected: Astro diagnostics report zero errors/warnings/hints with the checked-file count recorded as observed, not assumed from the old 76-file baseline. Run `npm test` again and require 100/100. Ledger actual results; no Git commit.

### Task 3: Six-County Interaction Lifecycle and Small-Screen Reachability

**Files:**
- Modify: `tests/browser/projects.spec.ts`
- Modify: `src/styles/project-map.css` only as required by the RED mobile layout assertion
- Modify: `src/scripts/project-map.ts` only for a regression demonstrated by the new tests
- Test: `tests/browser/accessibility.spec.ts` and `tests/browser/responsive.spec.ts` only if county-specific stale fixtures require correction

**Interfaces:**
- Consumes: Task 2 selectors, accessible names, slugs and announcement format; existing `initProjectMap(root: HTMLElement): () => void` unchanged unless a proven regression requires otherwise.

- [ ] **Step 1: Update and add the failing interaction assertions before CSS/script adjustments**

Cover initialization selecting Mehedinți, six synchronized marker/list `aria-pressed` states with exactly one visible card, and status containing county plus complete locality information. In the keyboard loop alternate Enter/Space over all six markers; assert every marker/list accessible name includes the full locality list and controls do not navigate. Separately actual-click all six map markers and all six list controls.

Retain direct-fragment generation with `for (const project of projects.slice(1))`, yielding five non-default cases, and assert one visible in-viewport card with synchronized state. Exercise valid later hash changes, initial unknown/unrelated/malformed hashes without nonexistent selection, explicit empty-hash/back navigation restoring Mehedinți, settled 375px story-heading clearance beneath the sticky header, and cleanup hiding controls/removing `data-map-ready`/selection while restoring all six static cards and ignoring subsequent hash changes.

At **both 320px and 375px**, independent of geometry percentages, require each bounding box at least 44×44px, `click({ trial: true })`, then actual click and selected card. Check neighboring markers independently rather than excluding visually close ones. Without JavaScript require all six locality cards/lists/source links and hidden controls; homepage must use the same six-card map.

- [ ] **Step 2: Run the entire project browser file and observe RED**

Run: `npx playwright test tests/browser/projects.spec.ts`
Expected: new suite contains **19 tests** because direct fragments expand from two to five while prior historical-only cases are replaced. At minimum obsolete three-count/story assertions and the expected obsolete Călărași-offset-dependent marker reachability fail; record actual failing names before editing CSS.

- [ ] **Step 3: Remove the obsolete offset and fix only demonstrated layout defects**

Delete the `@media (max-width: 30rem)` rules keyed to `calarasi-ferma-vegetala`, including its connector/anchor overrides. Preserve geometry-centered anchors and `.map-marker` minimum 44px target. If an actual new pair overlaps, move only a visual callout for that local case; retain a visible connector to the genuine geometry-centered county anchor, keep the 44px target independently clickable, and test both mobile widths again. Do not add stored coordinates, change map geometry, disable scrolling/motion, increase timeouts, or hide a marker to make a check pass.

No stale-cleanup refactor is part of this task unless a current-user path is demonstrated. A discovered regression instead gets a failing behavioral test and a minimal ownership-aware change, recorded as a ledger ruling.

- [ ] **Step 4: Verify interaction, whole browser suite, and scoped accessibility**

Run: `npx playwright test tests/browser/projects.spec.ts`
Expected: **19/19 pass**, with explicit Enter/Space, six-marker pointer and both-width reachability evidence.
Run: `npm run test:browser`
Expected: **70/70 pass** if no unrelated test count changes arise; otherwise inspect the test list, explain the difference, and never fit a test to make the count appear right.
Run: `npm run test:a11y`
Expected: **17/17 scoped axe cases pass**, recorded as local checks rather than WCAG certification. Run `npm test` and retain **100/100**. Ledger actual results; no Git commit.

### Task 4: Built-Output, Visual, Independent Review, and Handoff

**Files:**
- Copy and adapt: `.superpowers/sdd/2026-11-24-discovery-readiness/audit-dist.mjs` → `.superpowers/sdd/2026-11-24-project-county-map/audit-dist.mjs`
- Copy and adapt: `.superpowers/sdd/2026-11-24-discovery-readiness/visual-audit.mjs` → `.superpowers/sdd/2026-11-24-project-county-map/visual-audit.mjs`
- Create: `.superpowers/sdd/2026-11-24-project-county-map/verify-gate.sh`
- Create: `.superpowers/sdd/2026-11-24-project-county-map/final-gate.log`
- Create: `.superpowers/sdd/2026-11-24-project-county-map/final-review.diff`
- Modify: `docs/verification.md`
- Create/refresh: selected screenshots in `docs/verification/screenshots/`

**Interfaces:**
- Consumes: final six-county public output in `dist/`, production preview at `http://127.0.0.1:4324`, and approved spec/plan.
- Produces: measured build/link/visual evidence and a complete review package including untracked files; no commit or release artifact.

- [ ] **Step 1: Copy both audit utilities into the new plan workspace and update only their fixtures/coverage**

Use the new plan's own git-ignored SDD workspace; leave the old plan's scripts and logs untouched. Change the ordered `projectSlugs` to the six Task 1 slugs, which yields six source/backlink pairs and six no-JavaScript cards without relaxing any existing sitemap, canonical-link, form, redirect, or unresolved-fragment assertions. Add built-output assertions that `/`, `/proiecte/`, `/surse-proiecte/`, and `dist/llms.txt` contain every county/locality and none of the removed clients/story slugs/Ialomița/two-season/history/quote/system claims. Do not reject general product equipment copy on `/sisteme-irigatii/`.

Adapt the visual utility to all six desktop direct fragments, source clicks, visible focused backlinks and back navigations; all six 375px source anchors with local current-list context; and all six no-JavaScript cards. Add actual pointer trials/clicks and 44px measurement at both mobile widths, and save fresh Dolj desktop, Olt mobile, Teleorman mobile, and mobile Dolj source-context captures. Keep overflow and uncaught-page-error checks.

- [ ] **Step 2: Run the complete ordered gate and preserve real output**

`verify-gate.sh` executes `npm run typecheck`, `npm test`, `npm run build`, `npm run test:browser`, `npm run test:a11y` in that order, each logged and exit-checked. Run `bash .superpowers/sdd/2026-11-24-project-county-map/verify-gate.sh > .superpowers/sdd/2026-11-24-project-county-map/final-gate.log 2>&1` and read the output file.
Expected: zero type diagnostics, **100/100** unit/data, nine Astro pages, **70/70** browser and **17/17** axe, subject only to explained actual-count changes. A failure stops the ordered gate and is reported/fixed test-first; baseline numbers from discovery readiness are not evidence for this work.

- [ ] **Step 3: Run independent built-output checks and inspect images**

Run: `node .superpowers/sdd/2026-11-24-project-county-map/audit-dist.mjs dist`
Expected: zero unresolved same-origin links/fragments, eight sitemap paths, six source/backlink pairs, every exact locality in required output, and zero forbidden old-story matches. Record the newly measured generated-file, HTML-document, reference and unique-target totals rather than copying old 66/16/316/34 values.

With the existing static production preview serving the current `dist/`, run: `node .superpowers/sdd/2026-11-24-project-county-map/visual-audit.mjs http://127.0.0.1:4324 docs/verification/screenshots`.
Expected: all six journeys/focus/back-navigation/source/no-JavaScript checks pass, both-width markers pass, no horizontal overflow/page errors, and images are written. Open and visually inspect the four named images for clipping, genuine markers, complete locality lists, source context, selected Dolj/Olt/Teleorman cards and mobile reachability; generation alone is not visual review.

- [ ] **Step 4: Record current results without rewriting historical evidence**

Add a current **County-grouped locality map verification — 2026-11-24** section to `docs/verification.md` above older historical results. Include actual fresh command outcomes/counts, built-output totals, six-pair/link findings, visual journeys/screenshots, Chromium/axe limitations, and the unchanged boundaries: no real form delivery, deployment, external redirect/DNS/TLS/Search Console or AI/search outcomes. Explicitly label earlier three-story counts as historical and not evidence for the supplied list.

- [ ] **Step 5: Perform a complete fresh independent review**

Create a review diff from base `cd3caf5bb49bc890e1ff2db4da6a12ce719dac2d` plus every untracked file, and instruct the reviewer to run `git status` and inspect the working tree as well—no empty `HEAD` package may conceal uncommitted work. Use the fresh reviewer on the most capable available model with the spec, plan, Global Constraints, Review Focus, actual verification outputs, and ledger `Ruling:` lines. Require it to inspect every producer/consumer, all exact values, built content claims, real user paths, and no-commit/external-service boundaries; do not replace this with the implementer's self-review.

Re-grade findings by user effect. Fix Critical/Important findings in one test-first pass with fresh full-gate evidence; ledger deferred Minor findings. Record reviewed/declined external concerns as rulings rather than implying they were tested. There is no second fix pass or repeated reviewer loop.

- [ ] **Step 6: Hand off without integration**

Report actual green evidence or remaining failures, independent-review results, complete rulings/deferred minors, and the retained uncommitted worktree. Do not invoke branch-finishing integration, commit, push, merge, create a PR, deploy, or clean up this plan's evidence workspace unless the user separately authorizes that action. Leave unrelated historical records and the previous plan workspace intact.
