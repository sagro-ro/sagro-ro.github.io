# Verification — Sagro irrigation website

**Initial verification:** 2026-11-12  
**Previous verification including GitHub Pages preparation:** 2026-11-23
**Latest discovery-readiness verification:** 2026-11-24
**Scope:** the complete standalone Astro implementation in the isolated discovery-readiness worktree, including source, unit/data checks, real Chromium interaction, responsive layouts, production output, content provenance, and visual evidence.

This is a local implementation and verification record. It is not evidence of production deployment, live enquiry delivery, host-level redirects, or accessibility certification. The dated section below is the current result; later sections retain earlier observations and historical counts.

## Discovery-readiness verification — 2026-11-24

### Fresh automated gate

The following commands were run **in this order**, after the final implementation fixes, and each exited with code 0:

| Command | Observed result |
| --- | --- |
| `npm run typecheck` | **76 files checked; 0 errors, 0 warnings, 0 hints**. |
| `npm test` | **12 test files, 97/97 unit/data tests passed**. |
| `npm run build` | **9 Astro pages built**: eight indexed HTML routes plus `404.html`; `llms.txt`, `sitemap.xml`, and `robots.txt` were also generated. |
| `npm run test:browser` | **67/67 browser tests passed**, excluding the separately run `@a11y` cases. Coverage includes the three project fragments, source-link journeys with in-viewport provenance, historical qualifiers on homepage and project cards, settled reduced-motion mobile header clearance, the generated recovery canonical, seven static fallbacks, unique titles, verified structured address data, plain-text `llms.txt`, and the previously existing interactions. |
| `npm run test:a11y` | **17/17 scoped axe cases passed**: eight indexed routes at desktop and mobile sizes, plus open mobile navigation. No serious or critical violations were reported in the tested landmarks. |

The contact transport tests continue to intercept the reserved `https://forms.example.test/solicitari` endpoint locally. It is not a real provider and no customer data was sent to an external form service. The default production form remains disabled.

### Independent review and correction evidence

The independent whole-tree reviewer reported **no Critical findings** and two **Important** provenance findings. Both were reproduced RED and corrected:

- Direct `#sursa-*` links could leave all attribution and historical limitations above the viewport. `direct evidence fragments keep provenance and historical limits in view` initially failed because local evidence context did not exist. Each evidence section now contains its own dated owner-attribution, independence and approximate-location qualifications; the corrected test follows each real project-source link and requires that context to be in the 375px viewport.
- Homepage and project cards could present the historical two-season wording without a local temporal qualifier, and compact homepage cards had no direct source link. `project cards qualify historical duration on homepage and project route` initially failed because the marker did not exist. Every card now carries the centralized historical note next to its story and source relationship.

A first full post-review run stopped at **65 passed / 2 failed of 67** before the axe stage. One failure was an old strict locator that intentionally began matching the new per-section historical links; it was narrowed to the introductory section. The other synthetic test rapidly assigned consecutive same-document source fragments before native smooth scrolling settled and intermittently stayed at the previous target. Real elapsed-time tracing separated this from the actual cross-page user journey. The replacement follows each source link from `/proiecte/` without forcing scrolling, disabling motion, increasing timeouts, or weakening the viewport assertion. The three affected checks passed **15/15 executions across five repeats**, followed by the complete green gate above. The original direct-anchor RED result and its production fix are retained here rather than represented as an initially green test.

The reviewer also identified one **Minor deferred** lifecycle edge: invoking a stale cleanup handle after reinitializing the same map can dismantle the replacement and leave its hash listener active. No current client-navigation path invokes that sequence; it was intentionally not changed in this one-pass Important-fix review.

### Fresh built-output audit

A Node filesystem/URL audit ran against the new `dist/` produced by the gate and reported:

- **66 generated files**, including **16 HTML documents**: nine Astro pages and seven legacy fallback documents.
- **316** same-origin `href` occurrences covering **34 unique targets**; **0 unresolved link or fragment targets**.
- **8 sitemap entries**, all resolving to generated indexed HTML in primary, supporting, then legal route order. `llms.txt`, recovery, and fallback documents are excluded.
- **7 reviewed `_redirects` rules** and **7 corresponding static fallback documents**, with valid local destinations. `/pages/service/` deliberately has **no** mapping or fallback and uses ordinary 404 recovery.
- **3/3** project source anchors and backlinks resolve, **8/8** curated `llms.txt` links use canonical HTTPS destinations, and **0** produced files contain the intercepted test-form endpoint.
- The production contact form has an empty endpoint, no `action`, a disabled fieldset and submit button, and its visible unconfigured notice.

The seven static fallbacks return **HTTP 200** in the local static preview and then navigate in the browser. They are **not** host/CDN 301 or 308 responses, and GitHub Pages does not execute `_redirects`.

### Actual production-preview journeys

The post-fix production preview on `127.0.0.1:4324` was exercised in Chromium. The audit visited all three desktop project fragment URLs, clicked all three project-source links, visited all three mobile source anchors, checked visible keyboard focus on each source backlink, and completed all three back navigations. It also confirmed all three project stories remain visible without JavaScript, found **0 horizontal-overflow failures**, and captured **0 uncaught page errors**.

Desktop and 375px `/surse-proiecte/` screenshots and a 375px selected-project screenshot were regenerated, opened, and visually inspected. The source copy and backlinks are readable at both sizes. In the final mobile project capture, the Constanța location and complete story heading are visible below the sticky header. A reduced-motion regression had previously reproduced a **9.203125px** settled header overlap; the added story scroll margin passed that regression and the full responsive/browser gates above.

### Remaining external limits

These checks do **not** establish public host/CDN redirect headers, DNS, TLS, HTTPS enforcement or `www` behavior; Search Console ownership, inspection, sitemap processing or coverage; external Google rich-result validation or eligibility; actual AI crawler visits, indexing, citations, rankings or recommendations; or real enquiry delivery. No public deployment or infrastructure change was performed as part of this verification. The scoped axe checks are not WCAG certification; Safari, Firefox, physical devices and assistive-technology sessions were not tested.

## Historical automated verification through 2026-11-23

The historical commands below were run after the implementation fixes current on 2026-11-23 and exited with code 0. They do not replace the fresh 2026-11-24 results above.

| Command | Observed result |
| --- | --- |
| `npm run typecheck` | **70 files checked; 0 errors, 0 warnings, 0 hints**. |
| `npm test` | **10 test files, 71/71 tests passed**. Vitest is scoped to unit/data tests. |
| `npm run build` | **8 Astro pages** generated (seven indexed routes plus `404.html`), with `sitemap.xml`, `robots.txt`, three static legacy fallback documents, `CNAME`, `.nojekyll`, `_redirects`, optimized local images, and static assets. The default build leaves form delivery unconfigured. |
| `npx playwright test --reporter=dot` | **68/68 tests passed** in Chromium, including centered editorial content across all primary/legal/recovery routes at desktop and mobile widths, measured footer and service-workflow introduction alignment, the Sagro favicon, small-screen pointer callouts, 44px standalone shell/menu targets, form transport, keyboard behavior, no-JavaScript content, responsive layouts, metadata, recovery behavior, and both JavaScript/no-JavaScript legacy fallbacks against static preview output. |
| `npm run test:a11y` | **15/15 axe cases passed**: seven indexed routes at desktop and mobile sizes, plus open mobile navigation. No serious or critical violations were reported within the tested application landmarks. |

The browser suite uses three local Astro servers. The normal server on `127.0.0.1:4321` has no form endpoint. The second, on `127.0.0.1:4322`, exposes the reserved URL `https://forms.example.test/solicitari`; Playwright intercepts that request. It is not a real enquiry provider and no customer data is transmitted externally. The third, on `127.0.0.1:4324`, builds and previews the generated static artifact for legacy fallback tests. That local preview does not prove GitHub's public hosting, DNS, TLS or HTTP redirect behavior.

### Built-output audit

A Node filesystem/URL audit of `dist/` checked every same-origin anchor, URL fragment, declared legacy redirect target, generated HTML page, and sitemap entry. Results:

- **11** HTML files (eight Astro pages plus three public legacy fallbacks) and **235** same-origin link occurrences checked.
- **0** missing link targets and **0** missing fragment targets.
- Three project-source links intentionally use the public legacy URL `/pages/sisteme-irigatii`; the generated artifact now resolves that directory to the noindex static fallback for the new local systems page.
- **3/3** declared `_redirects` rules have valid local destinations. This checks file mappings only, not execution by a hosting provider.
- **3/3** static legacy fallbacks are present with canonical/noindex metadata, meta refresh, destination links and query/fragment-preserving JavaScript navigation.
- **7** sitemap entries, each resolving to a generated indexed page; fallback and recovery documents are excluded.
- `CNAME` is exactly `sagro.ro`; `.nojekyll` exists and is empty so underscored Astro assets can be served without Jekyll processing.
- `robots.txt` is generated from the same configured origin as the sitemap; the default output exactly advertises `https://sagro.ro/sitemap.xml`, and the alternate-origin behavior has a unit regression.
- The default production contact output retains its visible unconfigured notice and does **not** contain the reserved intercepted test endpoint.

## Accessibility, keyboard, and responsive coverage

Automated checks cover:

- WCAG 2/2.1 A and AA axe rules on `/`, `/sisteme-irigatii/`, `/service-mentenanta/`, `/proiecte/`, `/surse-proiecte/`, `/contact/`, `/politica-confidentialitate/`, and `/termeni-conditii/` at **1440×900** and **375×812**.
- Axe on the **open** mobile menu, not only the default closed state.
- First-tab skip link, visible focus outline, focus movement to the main landmark, explicit image alternatives, error-summary focus, and the next keyboard stop within the form.
- Mobile menu activation, `aria-expanded`, Escape, focus restoration, repeated open/close behavior, and navigation.
- Map selection using Enter and Space, synchronized pin/list `aria-pressed` state, selected-story status, 44px pointer targets, and actual pointer clicks through all three markers.
- Form labels, validation values, honeypot behavior, exactly-once submission, non-JSON 2xx success, HTTP/fetch failures, explicit successful retry, and the real AbortController timeout path.
- Native FAQs and essential sections without JavaScript; all three project stories remain readable without JavaScript and the interactive controls are hidden in that mode.
- Reduced-motion content and CTA navigation.
- No horizontal document overflow at **320, 375, 768, 1024, and 1440px**, including open navigation and selected project details. This is measured with `scrollWidth`, not concealed with blanket `overflow-x: hidden`.
- **200% root text sizing at 1280px** on all eight indexed routes, including long Romanian words and the wrapping header/navigation. This is text scaling coverage, not a claim that every browser zoom mode has been tested.

An axe scan is not a manual WCAG audit, and a zero-violation result is not proof of complete accessibility conformance. Testing used Chromium and emulated viewports; Safari, Firefox, physical mobile devices, and assistive-technology sessions were not performed.

## Actual app and visual review

The running app was operated in Chromium at desktop/mobile sizes using production preview where possible. Map pins and list buttons were clicked, the mobile menu was opened and closed, the form was validated, and an intercepted successful submission was completed. Screenshots were opened and visually inspected; they are not merely generated DOM assertions.

Evidence in [`verification/screenshots/`](verification/screenshots/) includes:

- `desktop-home.png`, `desktop-systems.png`, `desktop-service.png`, and `desktop-contact-disabled.png` — primary journeys, editorial hierarchy, irrigation imagery, systems, service information, and honestly disabled default form.
- `desktop-projects.png`, `desktop-map-selected.png`, `mobile-projects.png`, and `mobile-map-selected.png` — the same documented-project map and synchronized selected details.
- `mobile-home.png` and `mobile-menu.png` — responsive content and the corrected open menu, including its readable contact CTA.
- `mobile-form-errors.png` — configured-form validation summary and marked fields.
- `mobile-form-success-intercepted.png` — success produced only by the intercepted HTTP 202 test response; not evidence of real delivery.
- `desktop-privacy.png` — informational privacy route.
- `text-200-service.png` — enlarged Romanian text, reflowed service cards, and wrapped desktop navigation.

Full-page screenshots were reset to the top before final selected-state captures so a sticky header was not inserted at the prior click position. Development tooling was excluded from configured-form screenshots. Those captures use the explicitly configured test server; the default production preview remains unconfigured.

After the final target/footer fixes, **11 production screenshots and 2 configured-form screenshots were refreshed**. The final production capture script also clicked all three mobile map markers and recorded no console, page, or asset errors. `mobile-home.png`, `mobile-menu.png`, `mobile-map-selected.png`, `text-200-service.png`, `mobile-form-errors.png`, and `mobile-form-success-intercepted.png` were reopened and visually reinspected after regeneration: the 44px menu/footer areas are legible, the small-screen markers are independently reachable, enlarged Romanian text wraps, and the form states are visually distinct. The success capture still represents only the intercepted local HTTP 202 response.

### Requested editorial alignment refinement

Following a user review on 2026-11-12, all editorial headings and descriptive text now use centered alignment, including section introductions, system/service cards, project stories, CTA content, and footer descriptions. Related eyebrow labels and action groups are centered with their content. Navigation, form labels/validation content, and project-list map controls retain left alignment; native numeric map badges keep their normal centered control presentation.

`tests/browser/alignment.spec.ts` was written first and failed on the existing left-aligned homepage content. Its navigation/control exclusions were then clarified to match the approved scope, not to conceal remaining left-aligned editorial content. The final test covers all seven indexed routes plus the recovery route at 1440px and 375px. That refinement passed the full gate on 2026-11-12. The latest complete verification appears above and in the GitHub Pages section below.

The following captures were generated from the running app after this change, with only Astro's development toolbar excluded, then opened and visually inspected:

- `centered-desktop-home.png`, `centered-desktop-service.png`, `centered-desktop-projects.png`, and `centered-desktop-contact.png`.
- `centered-mobile-home.png` and `centered-mobile-service.png`.

These show centered content within the existing columns and cards, readable footer and contact details, left-aligned form controls and project-list controls, and no new wrapping or overflow problem. The full responsive suite, including 200% text sizing and 320–1440px overflow checks, passed after the change.

### Requested alignment and favicon refinements

On 2026-11-23, the generic SVG droplet was replaced by a transparent **192×192 PNG** cropped from the supplied Sagro logo's gear/drop symbol. The favicon link and test-server readiness paths now use `/favicon.png`; the source wordmark remains unchanged.

Two new browser checks were RED before the correction: the favicon link still pointed to `/favicon.svg`, and the footer logo sat **135.3px left** of its desktop column center. Stretched grid containers and left-justified brand contents—not the existing `text-align` declaration—caused that visual offset. The correction centers the footer-only brand and contact groups and the contact-link contents, while preserving navigation alignment and all minimum target sizes. Measured checks pass at **1440, 768, and 375px**.

The focused run passed **3/3**, and the final complete **70-file typecheck, 71/71 unit/data tests, 68/68 browser tests, 15/15 axe cases, and successful 8-page build** are recorded above. The generated `refined-footer-desktop.png` and `refined-footer-mobile.png` captures were opened and visually inspected. Fixed-page header/skip-link overlays are hidden only for the isolated footer screenshots; normal page behavior is unchanged. The new favicon PNG was also inspected and contains the actual Sagro logo symbol with its transparent background retained.

A later scoped refinement centers the **“Cum decurge solicitarea”** introduction block itself, rather than only the text inside its left-anchored, width-capped container. Its measured desktop center was initially **176px left** of the section center; the new workflow-specific container class and `margin-inline: auto` fix that without changing the process steps. The measured check passes at **1440, 768, and 375px**. `centered-service-workflow-desktop.png` and `centered-service-workflow-mobile.png` were captured from the built site with fixed-page overlays hidden only for the isolated screenshots, then visually inspected. The final complete browser gate after this addition was **68/68**.

### GitHub Pages preparation and legacy-link verification

On 2026-11-23, the static-site preparation added `.github/workflows/deploy.yml`, `public/CNAME`, an empty `public/.nojekyll`, and noindex HTML fallbacks under `public/pages/{sisteme-irigatii,service,contact}/index.html`. The workflow is configured for the official Pages actions, Node 24, public-registry `npm ci`, `SITE_URL=https://sagro.ro`, and a `dist/` artifact. It has **not** been executed in GitHub Actions.

Five configuration tests initially failed with missing files. After implementation, `npm test -- tests/unit/deployment.test.ts` passed **5/5**. The separate browser check initially stayed at `/pages/sisteme-irigatii/` with an 8-second timeout, including an initial assertion susceptible to matching the new path inside the old string. Exact pathname polling exposed the failure reliably.

Response instrumentation then showed that Astro's development server returned Sagro's **404** document, not the public fallback HTML, so no fallback script or meta refresh existed in the response. By contrast, the generated artifact served through `astro preview` on port 4324 returned **HTTP 200** with the expected fallback. The root cause was the development-server directory-index behavior used by the test, not a redirect-document defect. The test was moved to a Playwright-managed build-and-preview server on 4324. All three JavaScript navigation checks then passed with exact destination pathnames and preserved query/fragment values.

An added no-JavaScript case reached the irrigation destination through meta refresh but initially failed because its generic `nav` locator matched three landmarks. Scoping it to `Navigație principală` resolved that test-harness ambiguity; it did not require product changes. The focused fallback run finished **2/2 passed**, followed by the full results in the table above.

The static fallbacks are not HTTP 301 responses. `public/_redirects` remains a separate optional configuration for Netlify-compatible hosts. Local preview navigation does not prove public GitHub Pages behavior, custom-domain DNS, certificate issuance, or hosting availability.

## Defects reproduced and fixed

Focused review initially produced route-level axe failures and a 200%-text overflow failure. Each production fix below was traced to a cause and verified with focused, then full, checks.

| Defect | Root cause and observed evidence | Resolution |
| --- | --- | --- |
| Broad contrast failures on unrevealed sections | Pre-observer reveal styling left readable content at zero opacity, which axe evaluated against its background. | Reveal animation now varies only transform; content is never transparent before observer activation. |
| Map accessible names omitted visible numbers | Buttons displayed `01`–`03`, but their labels did not contain those strings, triggering `label-content-name-mismatch`. | Included each number and county/project identity in the accessible name. |
| Invalid contact definition lists | SVG and generic wrappers interrupted required `dl`/`dt`/`dd` relationships, triggering `definition-list` and `dlitem`. | Restored direct term/definition grouping and placed decorative icons inside `dt`. |
| Home overflow at 200% text | Header/nav tracks could not wrap; measured content exceeded the 1280px viewport by 72px before repair. | Enabled header and desktop-navigation wrapping and constrained flexible tracks. |
| Project CTA contrast | The projects page did not import the shared CTA stylesheet; axe measured approximately 1.1:1 because the forest background was absent behind light text. | Made `ContactCta` own its stylesheet import. |
| Service content overflow at large text | Fixed four-column tracks were narrower than long Romanian words; internal grid children could also refuse to shrink. | Added `minmax(0, 1fr)` internally and intrinsic `auto-fit` columns with a bounded minimum. |
| Adjacent map badge intercepted a pin click | Actual pointer interaction and a new regression test showed Ialomița's visible `02` badge intercepting Călărași's target; the test timed out before repair. | Set `pointer-events: none` on the noninteractive number badge. The regression test now trial-clicks and actually clicks all three markers. |
| Small-screen map controls overlapped | A later production interaction at 375px found Ialomița's **button**, rather than only its badge, covering Călărași's center. Bounds showed approximately 14px vertical separation between 44px targets. The original pointer regression used the desktop viewport and could not catch this. | Added a new RED regression at both 320 and 375px. Kept Călărași's geometry-derived anchor, offset only its small-screen visual callout, and drew a connector back to that anchor; all targets remain at least 44px. The test now clicks every marker independently, and production mobile interaction was rerun successfully. |
| Standalone shell/menu links were undersized | The independent reviewer found 36px footer links and smaller contact/menu/legal targets. A new 375px regression reproduced 36px, 26px, and 20px boxes. | Added centered inline-flex target boxes with at least 44px width and height; the focused regression passes. |
| Enlarged contact email overflowed its new target | The first post-review full run passed 61/62 browser tests but measured the homepage at 1295px in a 1280px viewport at 200% text. Element measurements traced it to the unbroken email inside its new flex target. | Allowed the footer contact action to wrap anywhere when required. Both the complete 200%-text case and the 44px-target case then passed; no blanket overflow suppression was used. |
| Robots origin could diverge from `SITE_URL` | `public/robots.txt` hardcoded the production sitemap even for alternate configured origins. The alternate-origin unit test failed because the generator did not exist. | Added `src/pages/robots.txt.ts`, deriving its sitemap URL from `Astro.site`, and removed the static duplicate. Updated the README; the default-origin browser contract also passes. |
| Lockfile required an internal registry | The registry unit test found 382 internal `npm-registry.nimbus-internal.nmbapp.net` resolutions. Separate public-registry queries proved the reviewer's additional claim about `typescript@6.0.3` and `@types/node@26.6.6` being unavailable false, so no unjustified downgrade was made. | Regenerated the lockfile against `https://registry.npmjs.org`. The registry test passes; `npm ci --ignore-scripts --registry=https://registry.npmjs.org` installed 291 packages and reported 0 vulnerabilities. |
| Open mobile-menu CTA contrast | The general `.mobile-menu__contact a` selector overrode the light button's dark foreground. A dedicated open-menu axe case reproduced the failure. | Added a specific dark-foreground override and retained the open-menu axe gate. |

Additional test/diagnostic setup corrections were necessary and are not represented as successful product behavior: an initial axe diagnostic used `browser.newPage`, which AxeBuilder rejects, and was changed to an explicit context/page; nullable Playwright metadata was normalized before TypeScript assertions; a configured screenshot run initially hit a stopped `4322` server (`ERR_CONNECTION_REFUSED`) and was rerun after starting the separate configured test server; one final capture attempted the mobile toggle at desktop width and was discarded and repeated at 375px. The small-screen pointer regression also suppresses only Astro's development toolbar before its trial clicks, since that tooling can overlay the scrolled target and is absent from the shipped production page. One later browser-driver script forgot to return to `/proiecte/` after checking the other routes and timed out waiting for a map control; correcting the navigation, not the app, produced a clean production run.

## Source and third-party review

The following public sources were re-read on 2026-11-12 as untrusted evidence:

- `https://sagro.ro/pages/sisteme-irigatii`
- `https://sagro.ro/pages/contact`
- `https://sagro.ro/policies/privacy-policy`

The current source still documents exactly the three implementation locations and no additional installation counties:

1. **Călărași / fermă vegetală / porumb** — source quotation retained in `projects.ts`: „Am ales un pivot Zimmatic prin Sagro pentru o suprafață mare de porumb.”
2. **Ialomița / Ferma Baciu / două sezoane** — „Folosim sistemul de irigații Zimmatic de două sezoane și suntem foarte mulțumiți.”
3. **Constanța / Patino Robot** — „Am apreciat foarte mult modul de lucru al echipei Sagro.” The analysis of terrain, crop, and water source remains source-supported.

The published service stages (technical consultation, project configuration, installation, and post-installation service/maintenance) remain consistent with the implementation. Zimmatic, Idrofoglia, and Green Power remain the only named partner references. Their presentation does not imply certification, exclusive distribution, guarantees, or warranty terms.

Company data still matches: **Special AgroService S.R.L.**, **RO 43835854**, **J16/629/2021**, **Str. Primăverii 161, Poiana Mare, Dolj**, **+40 762 910 030**, and **contact@sagro.ro**. No opening hours, response time, geographic service guarantee, statistics, ratings, or precise installation coordinates were added.

All **10/10** source URLs in `src/data/media.ts` returned HTTP 200 with an image content type during the final review. Their local origins are also enumerated in `THIRD_PARTY_NOTICES.md`. All ten images were previously visually inspected. They are editorial/equipment/partner media, not evidence that a pictured item belongs to a particular documented project; `MediaRecord` has no project association field.

The map continues to bundle `@svg-maps/romania` 2.0.0 geometry, preserves visible links to MapSVG Romania and CC BY 4.0, and retains package changes/provenance in `THIRD_PARTY_NOTICES.md`. Browsing it makes no map/tile request and does not request device geolocation. County pins are explicitly approximate.

## Boundaries and unperformed external checks

- **Not deployed:** no DNS, host, CDN, production analytics, or live infrastructure changes were made.
- **Redirect execution not verified on a public host:** `_redirects` syntax and target mappings are tested, but a Netlify-compatible host must actually apply them. Static Pages fallback navigation is verified against local built output only; actual GitHub Pages, DNS and HTTPS behavior still require public verification after user setup.
- **No real form delivery:** no endpoint credentials/provider were supplied, no external processing/retention agreement was verified, and no real success/delivery claim is made. Before enabling a provider, endpoint abuse controls, server-side validation, provider-specific privacy/retention text, and a real delivery test remain necessary.
- **No legal review:** privacy and terms text describes this implementation; it is general site information, not a service contract, warranty, or legal certification.
- **No CMS, ecommerce, CRM, analytics, or catalog integration** was implemented.
- **Git/release boundary:** earlier website work was committed before this plan. The discovery-readiness changes remain uncommitted in the isolated implementation worktree; no commits, pushes, merges, or deployments were performed for this plan.

## Reproduction notes

See `README.md` for installation, configuration, testing, project/county updates, and media provenance conventions. A build or local preview is only a static deployment candidate. Re-run the full commands above after changes, including the visual/error states whenever shared styles or interaction code change.
