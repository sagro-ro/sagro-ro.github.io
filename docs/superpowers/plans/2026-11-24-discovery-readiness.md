# Sagro Discovery Readiness Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Improve legacy-URL handling, historical project provenance, structured business facts, metadata, project deep links, and optional machine-oriented site summaries without implying indexing, citation, recommendation, or successful enquiry delivery.

**Architecture:** Keep the static Astro site and its verified centralized content. Add explicit per-legacy-URL decisions and GitHub Pages-compatible fallback documents, one canonical supporting page for project-source context, and a small generated text endpoint for the optional `llms.txt`. Progressively enhance project fragments through a tested hash parser while retaining all stories without JavaScript.

**Tech Stack:** Astro 7.4.7, strict TypeScript, native browser APIs, Vitest, Playwright/Chromium, axe-core; no new dependencies.

**Spec:** `docs/superpowers/specs/2026-11-12-sagro-irrigation-redesign-design.md`, supplemented by `docs/content-audit.md` and the user-approved 2026-11-24 AI-discovery follow-up scope (audit items 2–5 plus optional `llms.txt`). This plan implements only that follow-up scope.

## Global Constraints

- Keep visible content Romanian, responsive, keyboard accessible, evidence-bounded, and functional without client-side rendering.
- Preserve exactly three documented project areas: Călărași, Ialomița, and Constanța; retain approximate county-level locations only. Never infer exact premises or coordinates.
- Do not invent response times, service coverage/guarantees, statistics, ratings, dealer authorization, warranties, project dates, project scale, measured outcomes, or successful enquiry delivery.
- The project review date established by the content audit is **12 noiembrie 2026**. Do not present that review date as an original publication or commissioning date. Historical statements published by Sagro are not independent verification.
- `/pages/service` documented machinery service, not the current irrigation-only service. Exclude that route's old experience, warranties, geography, and machinery specializations; do not redirect it as though the scopes were equivalent.
- The legacy catalog is deliberately removed. Do not recreate it or add blanket redirects from arbitrary product/article URLs.
- GitHub Pages does not execute `public/_redirects`, and its static fallbacks are HTTP 200 documents—not genuine destination 301/308 responses. Keep real redirects and HTTP/HTTPS/`www` normalization as host/CDN follow-up.
- Do not modify DNS, TLS, GitHub Pages HTTPS settings, hosting configuration, `robots.txt`, or Search Console. Do not configure a form provider or send customer data externally. Preserve the honestly disabled default form.
- Treat `llms.txt` as a concise optional community convention, not a requirement or a promise of crawler use, indexing, citations, rankings, or AI recommendation. Keep it out of the HTML sitemap.
- Run strict test-first red/green cycles for each behavioral change. Use only existing dependencies and the existing local `.test` interception for unrelated regression tests.
- Do not commit, push, deploy, or publish this work. Omit commit steps; checkpoint each completed task through its fresh focused tests and reviewable working-tree diff.

## Review Focus

1. **Non-equivalent or unknown legacy paths:** an old machinery-service or undocumented URL must not acquire a misleading destination. Covered by Task 1's absent-service-fallback assertion, exact rule inventory, and static-preview 404 checks.
2. **Unavailable or time-sensitive historical evidence:** source links must retain accessible context without pretending the old publication still exposes its quotations or that “două sezoane” is current today. Covered by Task 2's source-page attribution/date/disclaimer tests and durable internal anchors.
3. **Malformed, unknown, cleared, or repeated project fragments:** these must not throw, hide the requested valid story, or leave duplicate hash listeners after cleanup/reinitialization. Covered by Task 5's parser unit cases and direct-load/hash-change/cleanup browser cases.
4. **Structured address and public copy drift:** Google-compatible markup must contain only verified address fields and no fabricated postcode/geo/hours; titles and Romanian copy must not regress. Covered by Tasks 3 and 4's explicit metadata/copy assertions and all-route checks.
5. **Ancillary discovery file overclaiming:** `llms.txt` must use verified canonical links, describe unavailable form delivery honestly, and never imply recommendation or guarantees. Covered by Task 6's content-unit test, browser response/link checks, and built-output audit.

---

### Task 1: Deliberate Legacy URL Decisions and Static Fallbacks

**Files:**
- Modify: `public/_redirects`
- Modify: `public/pages/sisteme-irigatii/index.html`, `public/pages/contact/index.html` only if shared copy needs clarification; do not rewrite working documents gratuitously.
- Create: `public/pages/despre-noi/index.html`, `public/policies/privacy-policy/index.html`, `public/products/sisteme-irigatii-zimmatic/index.html`, `public/products/sisteme-idrofoglia/index.html`, `public/products/generatoare-green-power/index.html`
- Delete after inspecting (already inspected): `public/pages/service/index.html`
- Modify: `docs/content-audit.md`
- Create: `docs/discovery-maintenance.md`
- Test: `tests/unit/deployment.test.ts`, `tests/browser/legacy-redirects.spec.ts`, `tests/browser/finishing.spec.ts:80-90`

**Interfaces:**
- Produces this exact redirect inventory, in this order, for hosts that support `_redirects`:
  1. `/pages/sisteme-irigatii` → `/sisteme-irigatii/`
  2. `/pages/contact` → `/contact/`
  3. `/policies/privacy-policy` → `/politica-confidentialitate/`
  4. `/pages/despre-noi` → `/sisteme-irigatii/`
  5. `/products/sisteme-irigatii-zimmatic` → `/sisteme-irigatii/`
  6. `/products/sisteme-idrofoglia` → `/sisteme-irigatii/`
  7. `/products/generatoare-green-power` → `/sisteme-irigatii/`
- Each of those seven legacy directories produces a committed static `index.html` fallback with `lang="ro"`, `noindex, nofollow`, absolute HTTPS canonical, meta refresh, visible destination link, and `window.location.replace` preserving `window.location.search` and `window.location.hash`.
- `/pages/service/` has no redirect rule/fallback and returns the site's ordinary 404 in static preview. Add no mapping for `/pages/irigatii`; its source evidence is insufficient.

- [ ] **Step 1: Write the failing migration tests**

Replace the three-entry test inventory with the seven mappings above. Assert every fallback meets the existing metadata/navigation contract. Separately assert no `/pages/service` rule or public service fallback exists, retain no blanket product rule, and make Playwright check all seven trailing-slash paths preserve `?sursa=legacy#detalii` and reach the intended main heading. Add static-preview assertions that `/pages/service/` and `/pages/irigatii/` return 404 with the existing recovery heading, not a redirect to irrigation service.

- [ ] **Step 2: Run tests and verify expected RED**

Run: `npm test -- tests/unit/deployment.test.ts` and `npx playwright test tests/browser/legacy-redirects.spec.ts tests/browser/finishing.spec.ts --grep "static-host redirects"`.
Expected: failures for the five missing fallbacks/rules and the still-present machinery-service mapping. If the tests do not fail for those reasons, fix the test rather than weakening assertions.

- [ ] **Step 3: Implement only the explicit mappings**

Create the five fallback documents from the established minimal static template, substituting only the destination/title/link copy. Remove the service fallback and its declarative rule. Add a short `_redirects` comment stating that these rules require a compatible host/CDN and are not executed by GitHub Pages. Do not add wildcards, a catch-all redirect, or an unreviewed `/pages/irigatii` fallback.

- [ ] **Step 4: Record the migration boundary**

Append a dated follow-up note to `docs/content-audit.md` without rewriting its historical observations. Create `docs/discovery-maintenance.md` containing the exact seven-row decision table, the reason each destination is relevant, and the hold/no-equivalent decisions for `/pages/service` and `/pages/irigatii`. State that static documents are accessibility/browser fallbacks only; genuine server-side 301/308 replies and retention (normally at least one year during a site move) remain external deployment work.

- [ ] **Step 5: Verify GREEN and review the task diff**

Run the two commands from Step 2.
Expected: focused unit and browser tests PASS; no unrelated claims or routes appear in the diff. Leave changes uncommitted.

---

### Task 2: Durable, Transparent Historical Project Provenance

**Files:**
- Create: `src/data/project-evidence.ts`
- Modify: `src/data/projects.ts`, `src/data/routes.ts`, `src/pages/sitemap.xml.ts`
- Modify: `src/components/projects/ProjectCard.astro`
- Create: `src/pages/surse-proiecte.astro`
- Modify: `docs/discovery-maintenance.md`
- Test: `tests/data/projects.test.ts`, `tests/unit/sitemap.test.ts`, `tests/browser/projects.spec.ts`, `tests/browser/finishing.spec.ts`, `tests/browser/accessibility.spec.ts`, `tests/browser/responsive.spec.ts`

**Interfaces:**
- Produces:
  ```ts
  export const projectEvidence = {
    route: '/surse-proiecte/',
    historicalUrl: 'https://sagro.ro/pages/sisteme-irigatii',
    reviewedAtLabel: '12 noiembrie 2026',
  } as const;
  export function getProjectSourceUrl(slug: string): string;
  export const supportingRoutes: readonly { href: string; label: string }[];
  ```
- `getProjectSourceUrl(slug)` returns `/surse-proiecte/#sursa-${slug}`. Each `Project.sourceUrl` becomes that unique internal evidence anchor; no project card links directly to the obsolete live page as if it still supplied evidence.
- The sitemap combines `primaryRoutes`, `supportingRoutes`, then `legalRoutes`: eight URLs total, with `/surse-proiecte/` included exactly once. All other tests that enumerate indexed routes must include `supportingRoutes` consistently.

- [ ] **Step 1: Write failing provenance, source-link, and sitemap tests**

Assert the evidence constants and generated anchors above; all three cards point to their respective internal anchors and no longer use `target="_blank"`. Add a browser test named `project provenance presents dated owner-published evidence and links back to each story`: request `/surse-proiecte/`, assert three unique source articles with the existing project names/summaries/quotes, working back-links to `/proiecte/#proiect-${slug}`, the exact historical URL, `12 noiembrie 2026`, “publicat de Sagro”, an explicit statement that this is not independent verification, and a note that seasonal wording reflects the reviewed historical material. Assert no exact addresses/coordinates, commissioning dates, capacities, or measured results are added. Extend sitemap, metadata, responsive-layout, and axe route inventories to eight indexed routes.

- [ ] **Step 2: Run tests and verify expected RED**

Run: `npm test -- tests/data/projects.test.ts tests/unit/sitemap.test.ts` and `npx playwright test tests/browser/projects.spec.ts tests/browser/finishing.spec.ts --grep "documented stories|project provenance|production sitemap|unique Romanian metadata"`.
Expected: failure because the centralized evidence module/route/page and sitemap entry do not exist, while project links still use the historical legacy URL.

- [ ] **Step 3: Implement the evidence model and canonical supporting page**

Use the interface above without duplicating project story text into a second data source. In `ProjectCard.astro`, link noncompact cards to `project.sourceUrl` with the visible label “Vezi sursa și contextul publicării”; remove obsolete new-window attributes. In `surse-proiecte.astro`, reuse `BaseLayout` and the existing legal/editorial CSS for a Romanian, centered editorial page with one H1, a linked historical-source context section, and three anchored `<section>` elements generated from `projects`. Re-render each existing summary and quote; identify the county/customer label and system. Provide a back-link to each project story.

Use copy that says the stories and quotations were published by Sagro on the former historical URL and recorded in the content review on 12 noiembrie 2026. Explain that the former URL no longer supplies the recorded stories in their old form and that owner attribution is not independent verification. State that seasonal wording is historical, not a live update. Do not assign an original publication date or claim an archived snapshot that does not exist.

- [ ] **Step 4: Include the supporting route without overpromoting it**

Add `supportingRoutes` with only `/surse-proiecte/` and include it in sitemap generation after `primaryRoutes`. Do not add a sixth primary navigation item and do not add `llms.txt` to this route collection. Update the maintenance document with how to revise the evidence route when better first-party records become available.

- [ ] **Step 5: Verify GREEN and accessibility coverage**

Run the commands from Step 2 plus `npm run test:a11y -- --grep "surse-proiecte"`.
Expected: all focused tests PASS, including desktop/mobile axe checks for the new route. Leave changes uncommitted.

---

### Task 3: Google-Compatible `PostalAddress` Using Verified Facts

**Files:**
- Modify: `src/components/site/SeoMeta.astro:18-27`
- Test: `tests/browser/finishing.spec.ts:35-56`

**Interfaces:**
- The sole LocalBusiness JSON-LD block retains existing verified identity/contact fields, but `address` becomes a `PostalAddress` object with exactly:
  - `streetAddress: 'Str. Primăverii 161'`
  - `addressLocality: 'Poiana Mare'`
  - `addressRegion: 'Dolj'`
  - `addressCountry: 'RO'`

- [ ] **Step 1: Write the failing structured-data test**

Replace the flat-address assertion with the exact nested object above. Explicitly assert that `schema.address` has no `postalCode`, `geo`, or fabricated extras, and retain existing exclusions for ratings, reviews, geolocation, `sameAs`, and opening hours.

- [ ] **Step 2: Run and verify RED, then implement the minimal schema change**

Run: `npx playwright test tests/browser/finishing.spec.ts --grep "LocalBusiness"`.
Expected: FAIL because `address` is currently a string. Then replace only the `address` value in `SeoMeta.astro` with the typed object and rerun the same command until PASS.

- [ ] **Step 3: Check the complete focused metadata suite**

Run: `npx playwright test tests/browser/finishing.spec.ts`.
Expected: all focused tests PASS. Do not claim Google eligibility, rich-result display, or external validation merely because JSON-LD parses. Leave changes uncommitted.

---

### Task 4: Remove Duplicate Titles and Correct Romanian Copy

**Files:**
- Modify: `src/pages/sisteme-irigatii.astro:15-18`, `src/pages/service-mentenanta.astro:12-15`, `src/pages/proiecte.astro:7-10`, `src/pages/contact.astro:13-16`
- Modify: `src/data/services.ts:20-25`
- Test: `tests/browser/finishing.spec.ts`, `tests/browser/offerings.spec.ts`

**Interfaces:**
- Preserve every descriptive leading page title; remove only its trailing literal ` | Sagro`. `SeoMeta.astro` remains the only place that appends ` | Sagro Irigații`.
- Replace only `evaluarea tehnica` with `evaluarea tehnică` in the second service step. Do not revise the service scope, guarantees, or form configuration.

- [ ] **Step 1: Add exact title and copy regression assertions**

For the four paths, assert titles do not contain `| Sagro |` and exactly equal these values:
- `/sisteme-irigatii/`: `Sisteme de irigații proiectate pentru terenul fermei | Sagro Irigații`
- `/service-mentenanta/`: `Service și mentenanță pentru echipamente de irigații | Sagro Irigații`
- `/proiecte/`: `Proiecte de irigații documentate în România | Sagro Irigații`
- `/contact/`: `Contact pentru sisteme de irigații și service | Sagro Irigații`

Assert the service page contains `evaluarea tehnică` and not `evaluarea tehnica`. Retain existing title uniqueness and all other metadata checks.

- [ ] **Step 2: Verify RED, change only the specified strings, and verify GREEN**

Run: `npx playwright test tests/browser/finishing.spec.ts tests/browser/offerings.spec.ts --grep "unique Romanian metadata|distinct irrigation-maintenance|unique titles"`.
Expected: initial failures identify four duplicate suffixes and the missing diacritic. After the specified string edits, rerun the same command; expected PASS. Then run both complete browser files and confirm no unrelated content regression. Leave changes uncommitted.

---

### Task 5: Honor Project Fragments and Clean Up Hash Listeners

**Files:**
- Create: `src/scripts/project-fragment.ts`
- Modify: `src/scripts/project-map.ts:27-87`
- Test: create `tests/unit/project-fragment.test.ts`; modify `tests/browser/projects.spec.ts`

**Interfaces:**
- Produces:
  ```ts
  export function getProjectSlugFromHash(hash: string, availableSlugs: readonly string[]): string | null;
  ```
- Parse only hashes beginning `#proiect-`; safely decode the remainder, return it only when nonempty and present in `availableSlugs`, and return `null` for malformed percent escapes, unrelated fragments, or unknown slugs.
- `initProjectMap(root: HTMLElement): () => void` keeps its existing API and separate control-click behavior. Initial valid fragments select that story; no/unknown fragments select the first available project. A later valid `hashchange` updates selection and aligns the selected story into view; clearing the hash restores the first available project. Cleanup removes `hashchange` and cancels any queued alignment callback.

- [ ] **Step 1: Test and implement the pure fragment parser**

Create unit cases for all three valid slugs, empty/general/unknown hashes, encoded values, and malformed `%` sequences. Run `npm test -- tests/unit/project-fragment.test.ts`; verify initial missing-module/function failure. Implement only `getProjectSlugFromHash`, then rerun and expect PASS without throwing on malformed input.

- [ ] **Step 2: Write failing real-browser deep-link tests**

Cover direct navigation to the second and third `/proiecte/#proiect-…` stories, asserting only that story is visible and it is in the viewport after initialization. Change `window.location.hash` from one project to another and assert synchronized `aria-pressed`, status, visibility, and viewport behavior. Test an unknown hash safely retains the default, control clicks still do not modify the URL, and back to an empty hash selects the first story. Preserve the existing no-JavaScript test showing all stories and hidden controls.

Add a lifecycle case using the actual browser module on the development server: initialize the same root again, invoke the returned cleanup, and assert all stories return visible, controls/`data-map-ready` are removed, and a later valid hash change no longer selects/hides a story.

- [ ] **Step 3: Run browser tests and verify RED**

Run: `npx playwright test tests/browser/projects.spec.ts`.
Expected: failures show direct links/hash changes retaining the first story or the requested story outside the viewport. The lifecycle assertions guard the existing restoration behavior and must catch any newly added `hashchange` listener that survives cleanup.

- [ ] **Step 4: Integrate hash selection without changing the static HTML contract**

In `project-map.ts`, derive available slugs from `availableProjects`, install one named `hashchange` listener, and initialize from `getProjectSlugFromHash(window.location.hash, availableSlugs) ?? firstSlug`. On recognized changes, call the existing `select` helper and schedule `scrollIntoView({ block: 'start' })` for that selected story in `requestAnimationFrame`, after hidden states have updated. Store the frame ID and cancel it in cleanup. Empty-hash handling restores the first selection; unrelated hashes do not throw or create selections. Register/remove the listener and frame alongside the existing button/control cleanup.

- [ ] **Step 5: Verify GREEN and run the complete neighboring suites**

Run: `npm test -- tests/unit/project-fragment.test.ts` and `npx playwright test tests/browser/projects.spec.ts tests/browser/navigation.spec.ts`.
Expected: PASS, including mobile map controls, no-JavaScript stories, fragment behavior, and keyboard navigation. Leave changes uncommitted.

---

### Task 6: Curated Honest `llms.txt`

**Files:**
- Create: `src/pages/llms.txt.ts`
- Create: `tests/unit/llms.test.ts`
- Modify: `tests/browser/finishing.spec.ts`
- Modify: `docs/discovery-maintenance.md`

**Interfaces:**
- Produces:
  ```ts
  export function createLlmsTxt(site: URL): string;
  export const GET: APIRoute;
  ```
- The endpoint returns `text/plain; charset=utf-8`; follow `sitemap.xml.ts`'s explicit missing-site 500 behavior. Generate canonical absolute links from the supplied `site` URL. Keep `robots.txt` and sitemap unchanged for this feature.

- [ ] **Step 1: Write the failing generated-content unit and response tests**

Assert the production output contains canonical absolute HTTPS links for `/`, systems, service, projects, `/surse-proiecte/`, contact, and both legal pages, but not `llms.txt` itself or any legacy URL as a destination. Include the verified legal name, `Str. Primăverii 161, Poiana Mare, Dolj`, `+40 762 910 030`, and `contact@sagro.ro`. Require curated irrigation-installation and irrigation-service summary text, exactly the three project county labels, project owner/history attribution, and approximate county-only location wording. Require a visible statement that the online form is not connected and direct phone/email should be used. Assert an alternate `https://preview.example.ro` base changes generated internal URLs without path duplication.

Assert the content does not promise indexing, ranking, citation, recommendation, authorization/certification, guaranteed response/coverage, warranties, or successful form delivery. Add a browser response test for HTTP 200, plain-text MIME, and absence of fabricated statistics or unsupported claims.

- [ ] **Step 2: Run and verify RED**

Run: `npm test -- tests/unit/llms.test.ts`.
Expected: FAIL because `src/pages/llms.txt.ts` and its generator do not exist.

- [ ] **Step 3: Implement a short readable Markdown summary**

Create a concise `# Sagro Irigații` document with “Servicii”, “Proiecte documentate”, “Contact”, and “Informații” sections. Link to the existing canonical pages; do not reproduce long page bodies or turn this into a keyword list. State that project stories are Sagro-published historical material, with context at `/surse-proiecte/` and approximate county locations only. Do not describe the file as a standard or as a recommendation mechanism.

- [ ] **Step 4: Document maintenance and verify GREEN**

In `docs/discovery-maintenance.md`, record that this file is optional, that Google ignores it, and that no configuration guarantees AI citation/recommendation. Require its summaries/contact/form state to be reviewed whenever the corresponding pages change. Run `npm test -- tests/unit/llms.test.ts` and the focused browser test; expect PASS. Confirm the sitemap still has eight HTML URLs and no `llms.txt` entry. Leave changes uncommitted.

---

### Task 7: Fresh Full Verification and Evidence-Bounded Handoff

**Files:**
- Modify: `docs/verification.md`, `docs/discovery-maintenance.md` (only to record actual verified results or remaining external work)
- Generated locally: `dist/`; retain the repository's existing ignore policy
- Review: all changed source, public, test, and documentation files

- [ ] **Step 1: Run the full automated gate**

Run, in order, after all implementation tasks are green:
```bash
npm run typecheck
npm test
npm run build
npm run test:browser
npm run test:a11y
```
Expected: each command exits 0. Record exact current file/test/page counts and any failures accurately; do not paste historical counts as new evidence. Browser tests use the existing build/preview server and never a real form provider.

- [ ] **Step 2: Audit the fresh built output for internal links and destinations**

Use an execution-only temporary Node script outside downloaded/untrusted-data directories (with `node --input-type=module`) or existing project verification utilities. Parse `dist/` HTML `href`/`id` values and check every same-origin path plus fragment resolves to a generated file, every eight sitemap entries resolves to indexed HTML, all seven declared legacy targets and seven fallbacks exist, and no service fallback exists. Confirm project-source links reach their own source anchors, `dist/llms.txt` contains canonical links only, `dist/` contains no `.test` form endpoint, and the production form remains disabled with its visible unconfigured notice. Explicitly distinguish static-fallback execution from real HTTP redirects.

- [ ] **Step 3: Inspect the actual changed journeys**

Using the running production preview where practical, inspect desktop and 375px source-page rendering, visit all three source-anchor links and all three project fragment URLs with JavaScript, and verify no-JavaScript project content remains readable. Check no horizontal overflow, visible focus, and usable back navigation. Capture/read screenshots if rendering changes are visible; do not claim visual review without opening them.

- [ ] **Step 4: Update documentation with actual evidence only**

Update `docs/verification.md` with a dated 2026-11-24 section containing the fresh gate results, built-link totals, routes exercised, and any untested limits. Retain historical observations as such. Reiterate that host-level redirects, DNS/TLS/`www`, Search Console coverage, external rich-result validation, actual AI crawler visits/indexing/citations, and real enquiry delivery were not established. Do not state or imply deployment happened.

- [ ] **Step 5: Review the final working tree and report**

Run `git diff --check`, `git diff --stat`, and `git status --short`; inspect the complete diff for prohibited claims, accidental hosting changes, credentials, unrelated modifications, and the exact service-route decision. Report changed behavior, verified commands/results, remaining external follow-up, and that nothing was committed/pushed/deployed. Ask separately before any commit, push, or deployment; do not perform those actions in this plan.
