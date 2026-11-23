# Sagro Irrigation Website Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a polished, fast, Romanian-language Sagro website giving irrigation installations and irrigation equipment service/maintenance equal prominence, with three documented project areas on an accessible Romania map.

**Architecture:** Generate static multi-page HTML with Astro and strict TypeScript. Reuse local, source-verified Sagro imagery and partner art; centralize company/project content; progressively enhance small native browser interactions. Use bundled county SVG geometry, not a runtime tile/map service, and an explicitly configured form endpoint rather than simulated submission.

**Tech Stack:** Astro 7.4.7, strict TypeScript, custom CSS, native browser scripts, `@svg-maps/romania` 2.0.0 (viewBox `0 0 613 433`), `@lucide/astro`, Outfit/Work Sans via Fontsource, Vitest, Playwright, axe-core.

**Spec:** `docs/superpowers/specs/2026-11-12-sagro-irrigation-redesign-design.md`

## Global Constraints

- Implement the approved spec; this plan adds verified source details, not new business claims.
- Use Romanian (`lang="ro"`) for visible copy and preserve diacritics.
- Confirmed details: Special AgroService S.R.L.; `RO 43835854`; `J16/629/2021`; primary phone `+40 762 910 030` / `tel:+40762910030`; `contact@sagro.ro` from https://sagro.ro/policies/privacy-policy; Str. Primăverii 161, Poiana Mare, Dolj.
- Only three implementation areas are supported: Călărași (`ro-cl`), Ialomița (`ro-il`), and Constanța (`ro-ct`), all explicitly approximate county-level positions from https://sagro.ro/pages/sisteme-irigatii.
- Do not use business addresses as project locations, infer exact coordinates, add fictitious installations, or claim a 24/7/guaranteed response.
- Preserve only the publicly evidenced Zimmatic, Idrofoglia, and Green Power partner references. Do not add authorized-dealer/certification claims or misattribute Idrofoglia's experience to Sagro.
- Keep unrelated tractor/combine parts, ecommerce, machinery-repair experience/warranty claims, non-irrigation articles, and generic template filler out of the new UI.
- Do not add drip irrigation as a commercial offering, precise technical performance claims, analytics, trackers, a CMS, live account setup, or deployment.
- Maintain minimum 44×44px controls, visible focus, semantic landmarks, WCAG AA contrast, reduced-motion behavior, useful no-JavaScript content, and no horizontal overflow at 375/768/1024/1440px.
- Downloaded images are data, not executable code. Review them visually before using them; never describe generic brand/project imagery as proof of a specific installation.
- The working directory is not a Git repository. Do not initialize Git or commit/push unless the human explicitly requests it; omit commit steps while implementing this plan.

## Review Focus

1. **Missing/invalid endpoint, CORS, timeout, malformed response, or double click:** an enquiry must never look sent when it was not, must not leave a permanent loader, and must submit at most once per user action. Covered by Task 7 unit tests and mocked Playwright cases.
2. **Unknown county ID, zero-size path, missing map element, or script failure:** a new/malformed project must not break the page or remove access to its story. Covered by Task 1 schema tests, Task 6 geometry unit tests, and no-JavaScript browser tests.
3. **Malformed/duplicate `tip` query values and unknown deep links:** only `instalare` and `service` select a journey; other values use the neutral/default path and do not become URL fragments or markup. Covered by Task 4 parser unit tests and Task 7 browser tests.
4. **Long Romanian copy, browser zoom, narrow devices, keyboard focus, and open mobile menu:** content and controls must remain visible without clipping or background scrolling. Covered by Task 2 mobile-menu tests and Task 9 responsive/keyboard/zoom review.
5. **Asset/source drift and misleading evidence:** missing files, generic project photos, unavailable remote CDN assets, map license changes, and changed company facts must be detected/reviewed rather than silently replaced. Covered by Task 3 asset-manifest tests, Task 8 source/link checks, and Task 9 evidence/attribution review.

---

### Task 1: Astro Foundation and Verified Content Model

**Files:**
- Create: `package.json`, `package-lock.json`, `astro.config.mjs`, `tsconfig.json`, `.gitignore`, `.env.example`, `src/env.d.ts`
- Create: `src/data/site.ts`, `src/data/routes.ts`, `src/data/projects.ts`
- Create: `docs/content-audit.md`
- Test: `tests/data/site.test.ts`, `tests/data/projects.test.ts`

**Interfaces:**
- Produces:
  ```ts
  type EnquiryType = 'instalare' | 'service';
  type CountyId = 'ro-cl' | 'ro-il' | 'ro-ct';
  interface Project {
    slug: string;
    name: string;
    clientLabel: string;
    countyId: CountyId;
    countyLabel: string;
    systemLabel: string;
    summary: string;
    quote: string;
    sourceUrl: 'https://sagro.ro/pages/sisteme-irigatii';
  }
  const projects: readonly Project[];
  const site: {
    name: string; legalName: string; registration: readonly string[];
    phoneDisplay: string; phoneHref: string; email: string; emailHref: string;
    address: string; projectDisclaimer: string;
  };
  const primaryRoutes: readonly { href: string; label: string }[];
  ```
- `projects` initial slugs: `calarasi-ferma-vegetala`, `ialomita-ferma-baciu`, `constanta-patino-robot`; county IDs respectively `ro-cl`, `ro-il`, `ro-ct`; each `sourceUrl` is the exact irrigation-page URL.
- `projectDisclaimer` says the map shows approximate county areas, not exact installation addresses.

- [x] **Step 1: Configure the tooling without generating template content**

Create an npm module with scripts `dev`, `build`, `preview`, `typecheck` (`astro check`), `test` (`vitest run`), `test:browser` (`playwright test --grep-invert @a11y`), and `test:a11y` (`playwright test tests/browser/accessibility.spec.ts --grep @a11y`). Install/pin `astro@7.4.7`, `@svg-maps/romania@2.0.0`, `@lucide/astro@1.70.0`, `@fontsource-variable/outfit@5.3.0`, and `@fontsource-variable/work-sans@5.3.0`; add `@astrojs/check`, `typescript`, `vitest`, `@playwright/test`, and `@axe-core/playwright` as development dependencies. Extend Astro's strict TypeScript config; set static output, `trailingSlash: 'always'`, and production `site` from `SITE_URL`, defaulting to `https://sagro.ro`. Document `SITE_URL` and optional `PUBLIC_FORM_ENDPOINT` in `.env.example`, excluding real secrets.

- [x] **Step 2: Write failing source/content tests**

In `site.test.ts`, assert exact legal/contact values and that `phoneHref` and `emailHref` have no spaces or invalid characters. In `projects.test.ts`, assert exactly three slugs; unique IDs; `ro-cl`/`ro-il`/`ro-ct` mapping; Zimmatic summaries; nonempty source URL, quote, and approximate-location disclaimer; and no street/coordinate fields or `Poiana Mare`, `Predești`, or `Craiova` in implementation locations.

- [x] **Step 3: Run the tests to verify they fail**

Run: `npm test -- tests/data/site.test.ts tests/data/projects.test.ts`  
Expected: FAIL because the data modules do not exist.

- [x] **Step 4: Implement centralized facts and projects**

Create typed exports matching the Interfaces block. Use source-supported Romanian text: the Călărași vegetable-farm pivot for corn; Ferma Baciu's two seasons and configuration/installation support; Patino Robot's assessment of terrain, water source, crop, and commissioning. Preserve testimonial meaning without adding numeric claims. `primaryRoutes` contains exactly `/`, `/sisteme-irigatii/`, `/service-mentenanta/`, `/proiecte/`, and `/contact/` with the approved labels.

Write `docs/content-audit.md` with the audited core routes, source URLs, evidence limitations, removed 8,247 non-irrigation products/64 non-irrigation articles, and the distinction between the machinery-only old service page and irrigation service on the about/irrigation pages. Record `contact@sagro.ro` as sourced from the official privacy page, not the contact-page extraction. Do not reproduce thousands of irrelevant product URLs.

- [x] **Step 5: Verify the content model**

Run: `npm test -- tests/data/site.test.ts tests/data/projects.test.ts && npm run typecheck`  
Expected: data tests PASS and TypeScript reports no errors.

---

### Task 2: Design Tokens, Base Layout, and Accessible Site Navigation

**Files:**
- Create: `src/styles/tokens.css`, `src/styles/global.css`, `src/styles/layout.css`
- Create: `src/layouts/BaseLayout.astro`
- Create: `src/components/site/BrandMark.astro`, `SiteHeader.astro`, `SiteFooter.astro`, `ButtonLink.astro`, `SectionHeading.astro`
- Create: `src/scripts/site-menu.ts`, `src/pages/index.astro`, `public/favicon.svg`
- Test: `tests/browser/navigation.spec.ts`, `playwright.config.ts`

**Interfaces:**
- Consumes `site` and `primaryRoutes` from Task 1.
- Produces:
  ```astro
  <BaseLayout title="…" description="…">…</BaseLayout>
  <ButtonLink href="…" variant="primary|secondary|text">…</ButtonLink>
  <SectionHeading eyebrow="…" title="…" intro="…" />
  ```
- `BaseLayout` optional props: `image?: string`, `noindex?: boolean`; every page gets one `<main id="continut">` through its slot and one `<h1>` supplied by the page.
- `initSiteMenu(root: ParentNode = document): () => void` controls `[data-menu-toggle]` and `[data-mobile-menu]`, returning a cleanup function.

- [x] **Step 1: Write failing browser tests for the shell**

Configure Playwright to start `npm run dev -- --host 127.0.0.1` with a reusable `baseURL` and trace on failure. Test the Romanian document language, skip link, visible header logo/link, five expected navigation items, telephone and email links, and a main landmark. At 375px, open the menu, assert `aria-expanded="true"`, navigate with Escape and restored focus, reopen and select a link, and verify focus remains available. Test that desktop navigation is visible without relying on the mobile toggle.

- [x] **Step 2: Verify navigation tests fail**

Run: `npx playwright test tests/browser/navigation.spec.ts`  
Expected: FAIL because the shared shell is not implemented.

- [x] **Step 3: Implement the visual foundation**

Define semantic CSS tokens for deep forest (`#153F35` baseline, contrast-adjust if needed), warm limestone/off-white surfaces, water-blue/aqua accents, body/foreground/muted/highlight, 4/8px-based spacing, bounded content width, fluid typography, and focus rings. Keep hex values in token files; component rules refer to semantic variables. Use Outfit display and Work Sans body with local Fontsource imports and appropriate system fallbacks.

Build an asymmetric editorial foundation rather than a template/card grid: fine field/technical rules, restrained small radii, generous vertical rhythm, full-width dark sections, and responsive utility classes with narrow, clear purposes. Disable nonessential animation/transitions under reduced motion.

- [x] **Step 4: Implement layout and navigation behavior**

Render header/footer from the central route/site data. Preserve the recognizable Sagro logo using a locally optimized version added in Task 3; until then use an accessible text `SAGRO` brand lockup marked `IRIGAȚII`, not an invented certification badge. Add skip link, active route/`aria-current`, and CTA `Cere o evaluare`.

For the mobile disclosure, set `aria-controls`/`aria-expanded`, close on Escape/link activation, restore focus, lock body scrolling only while open, and reset stale state on desktop resize. Prevent duplicate initialization. Include footer contact/legal links and no obsolete catalog/cart/social links. A temporary minimal home `<h1>` is acceptable only until Task 4.

- [x] **Step 5: Verify shell tests and types**

Run: `npx playwright test tests/browser/navigation.spec.ts && npm run typecheck`  
Expected: navigation tests PASS; no new accessibility/type errors.

---

### Task 3: Verified Local Media and Reusable Editorial Sections

**Files:**
- Create: `src/assets/brand/`, `src/assets/irrigation/`, `src/assets/partners/`
- Create: `src/data/media.ts`, `src/components/media/SourceImage.astro`
- Create: `src/components/sections/Hero.astro`, `JourneyCards.astro`, `ProcessSteps.astro`, `SystemGrid.astro`, `PartnerStrip.astro`, `FaqList.astro`, `ContactCta.astro`
- Create: `src/scripts/reveal.ts`
- Create: `THIRD_PARTY_NOTICES.md`
- Test: `tests/data/media.test.ts`, `tests/browser/sections.spec.ts`

**Interfaces:**
- Produces typed `media` records with `src`, `alt`, `sourceUrl`, and `role: 'brand' | 'editorial' | 'partner'`; no record assigns generic imagery to one of the three documented installations.
- `JourneyCards` produces two links: `/contact/?tip=instalare#formular` and `/contact/?tip=service#formular`.
- `initReveals(root: ParentNode = document): () => void` observes `[data-reveal]`, defaults all content visible, and only adds pending transitions when JavaScript and non-reduced motion are available.
- `FaqList` uses native `<details>/<summary>` and preserves readable answers without JavaScript.

- [x] **Step 1: Write failing asset and interaction tests**

For every `media` record, test that its local file exists, is nonempty, has meaningful Romanian alt text, and includes its exact original Sagro/Shopify URL. Test partner records contain only Zimmatic, Idrofoglia, and Green Power. In Playwright, verify native FAQs open via keyboard, journey links carry exact enquiry parameters, partner logos retain alt text, and reveal content is fully visible with reduced motion and JavaScript disabled.

- [x] **Step 2: Run tests before importing assets**

Run: `npm test -- tests/data/media.test.ts && npx playwright test tests/browser/sections.spec.ts`  
Expected: asset tests FAIL because media files/registry are absent; section tests FAIL because components are not present.

- [x] **Step 3: Import and visually review approved source assets**

Download only the selected original Sagro logo and irrigation images from `sagro.ro`/`cdn.shopify.com`. Preferred sources: logo `https://sagro.ro/cdn/shop/files/Asset_4.png?v=1721913272`; homepage field `https://sagro.ro/cdn/shop/files/porumb_ad84fb33-874c-48f3-b5cd-81013f6f0b82.png?v=1769428935`; equipment art `Untitled_design_11.png`, `Untitled_design_13.png`, `Untitled_design_15.png`, and `all.png` under `https://cdn.shopify.com/s/files/1/0889/2724/0499/files/`; partner art `1.png?v=1769429932`, `2.png?v=1769429917`, and `3.png?v=1769429899` under `https://sagro.ro/cdn/shop/files/`.

Inspect each image before assigning alt text; do not execute downloaded files or install scripts from them. Store exact origins in the media registry. Use `<Image>` with explicit width/height, modern formats, responsive `sizes`, eager/fetchpriority-high only for the above-fold hero, and lazy loading below the fold. Replace the temporary text header mark with the reviewed Sagro logo.

- [x] **Step 4: Implement reusable sections and restrained motion**

Create an asymmetric photo-led hero; two equally weighted journey panels labeled `Proiectează un sistem` and `Solicită service`; numbered process steps covering consultation, analysis/configuration, installation/commissioning, and support; four system types plus generator support where needed; static partner strip; native FAQ list; and shared contact CTA. No carousels, animated counters, or auto-rotating testimonials.

Implement IntersectionObserver reveals using opacity/transform only, immediately clean up on function cleanup, and leave final content visible under reduced motion or unsupported observers.

- [x] **Step 5: Verify assets and components**

Run: `npm test -- tests/data/media.test.ts && npx playwright test tests/browser/sections.spec.ts && npm run typecheck`  
Expected: all referenced assets exist; FAQ, journey, and reduced-motion tests PASS.

---

### Task 4: Complete Homepage and Enquiry URL Contract

**Files:**
- Modify: `src/pages/index.astro`
- Create: `src/lib/enquiry.ts`
- Create: `src/content/faqs.ts`
- Modify where appropriate: components from Task 3
- Test: `tests/unit/enquiry.test.ts`, `tests/browser/home.spec.ts`

**Interfaces:**
- Produces:
  ```ts
  function isEnquiryType(value: string | null): value is EnquiryType;
  function getEnquiryType(params: URLSearchParams, fallback: EnquiryType = 'instalare'): EnquiryType;
  function enquiryHref(type: EnquiryType): string;
  ```
- `enquiryHref('instalare')` returns `/contact/?tip=instalare#formular`; `service` returns the matching service URL. Unknown/repeated/blank query values never enter markup.
- Later pages consume the same helper for installation/service CTAs; Task 6 inserts the completed map into the homepage.

- [x] **Step 1: Write failing URL and homepage tests**

Unit-test all accepted values plus `?tip=`, `?tip=SERVICE`, `?tip=<script>`, duplicate parameters, and unrelated parameters. Browser-test one homepage H1 with installation/service messaging, four system categories in the expected order (pivoți etc., liniare etc., tambur etc., pompare etc.), both process directions, three partners, FAQs, no fabricated counters/ratings, and both precise CTA URLs.

- [x] **Step 2: Run tests to verify they fail**

Run: `npm test -- tests/unit/enquiry.test.ts && npx playwright test tests/browser/home.spec.ts`  
Expected: parser module and completed homepage are absent, so tests FAIL.

- [x] **Step 3: Implement the enquiry helper and final homepage**

Use `params.getAll('tip')`; accept exactly one exact valid value, otherwise return the supplied fallback. Build URLs only from the closed `EnquiryType` union. Use the approved hero direction `Apă acolo unde contează.` and a factual subheading spanning design/installation/service/maintenance. Compose the Task 3 sections, a preview of documented work linking to `/proiecte/`, and source-reviewed FAQ copy about area/plot shape, crop, water source, electricity availability, and service after installation. Do not carry over a blanket 24-hour promise.

- [x] **Step 4: Verify the homepage and URL contract**

Run: `npm test -- tests/unit/enquiry.test.ts && npx playwright test tests/browser/home.spec.ts && npm run typecheck`  
Expected: all URL/parser cases and homepage assertions PASS.

---

### Task 5: Systems and Irrigation Service Pages

**Files:**
- Create: `src/data/systems.ts`, `src/data/services.ts`, `src/components/sections/PageHero.astro`
- Create: `src/pages/sisteme-irigatii.astro`, `src/pages/service-mentenanta.astro`
- Test: `tests/browser/offerings.spec.ts`

**Interfaces:**
- Consumes `enquiryHref`, `media`, shared section/layout components from earlier tasks.
- Produces canonical routes `/sisteme-irigatii/` and `/service-mentenanta/`.
- `systems` has four primary offerings keyed `pivot`, `liniar`, `tambur`, `pompare`; generator/off-grid support is a separate supporting item, not a fifth primary system or an unverified service claim.

- [x] **Step 1: Write failing offering-page tests**

Assert each route returns 200, one relevant H1, and unique title/description. Systems tests cover center pivots, linear systems, drum/reel systems, pumping, and grid-independent generator support, with selection factors surface/shape, crop, water source, field conditions, and electricity availability. Service tests cover post-installation service/maintenance, periodic checks, technical interventions/specialist support, diagnostics, and seasonal preparation. Both service and installation CTAs retain the correct enquiry type. Assert no machinery-specific `9 ani`, `6–12 luni garanție`, `Case`, `New Holland`, or `Steyr` specialization migrated from the old service page.

- [x] **Step 2: Verify offering tests fail**

Run: `npx playwright test tests/browser/offerings.spec.ts`  
Expected: both routes currently return 404.

- [x] **Step 3: Implement both complete detail pages**

Create shared page-hero treatment with irrigation photography and technical details. Write fact-based Romanian system descriptions from the approved site evidence. Explain consultation/configuration/montaj/punere în funcțiune without unsupported savings percentages or acreage claims. Give service a distinct workflow—request/details, assessment/diagnosis, agreed intervention, checks/support—without promising response time, nationwide emergency coverage, or free maintenance. Include clear cross-links so installation and service remain equal paths.

- [x] **Step 4: Verify complete offering content**

Run: `npx playwright test tests/browser/offerings.spec.ts && npm run typecheck`  
Expected: both pages and all content/CTA assertions PASS.

---

### Task 6: Documented Projects and Accessible Romania Map

**Files:**
- Create: `src/lib/map-geometry.ts`, `src/components/projects/ProjectMap.astro`, `ProjectCard.astro`
- Create: `src/scripts/project-map.ts`, `src/styles/project-map.css`
- Create: `src/pages/proiecte.astro`
- Modify: `src/pages/index.astro`, `THIRD_PARTY_NOTICES.md`
- Test: `tests/unit/map-geometry.test.ts`, `tests/browser/projects.spec.ts`

**Interfaces:**
- Consumes `Project`, `projects`, `site.projectDisclaimer`, and `CountyId` from Task 1.
- Produces:
  ```ts
  interface Box { x: number; y: number; width: number; height: number }
  interface MarkerPosition { leftPercent: number; topPercent: number }
  function getMarkerPosition(box: Box, viewBoxWidth: 613, viewBoxHeight: 433): MarkerPosition | null;
  function initProjectMap(root: HTMLElement): () => void;
  ```
- County path selectors use `data-county-id="ro-cl|ro-il|ro-ct"`. Buttons use `data-project-slug` and `aria-pressed`; project detail blocks use IDs derived only from the controlled project slug.
- Each project record appears in static project cards/list and, after valid geometry initialization, in the map.

- [x] **Step 1: Write failing geometry and accessible-map tests**

Unit-test center-percentage conversion, edge positions at 0/100%, zero/negative/NaN dimensions returning `null`, and exact known county IDs from `@svg-maps/romania`. Browser tests assert all three project stories and approximate-location disclaimer; clicking/tapping/focusing and activating each map control selects the matching detail; county `ro-cl`, `ro-il`, and `ro-ct` positions stay within the map; other nonselected controls remain usable. With JavaScript disabled, all three stories are still visible. Selecting one project must not alter source URLs or add coordinates.

- [x] **Step 2: Run map tests before implementation**

Run: `npm test -- tests/unit/map-geometry.test.ts && npx playwright test tests/browser/projects.spec.ts`  
Expected: tests FAIL because project route/map geometry is absent.

- [x] **Step 3: Implement bundled SVG geometry and map selection**

Render `map.viewBox` (`0 0 613 433`) and local county paths from `@svg-maps/romania`. Decorative county outlines do not compete for keyboard focus; text/list and positioned HTML buttons provide the accessible interface. For each known county, compute path `getBBox()` center and position a native HTML `<button type="button">` using percentages, with a 44px touch target even when the visible dot is smaller. Never render a pin if `getMarkerPosition` returns null or its county is missing.

On selection, use `aria-pressed`, an `aria-live="polite"` concise project heading, `hidden` detail states, and synchronized project-list selection. Do not auto-pan, unexpected-focus, or overwrite URL history. Make initialization idempotent, remove listeners on cleanup, and default all detail blocks visible before enhancement. Keep the project list and disclaimer visible regardless of map status.

Record attribution in UI notices and `THIRD_PARTY_NOTICES.md`: map based on MapSVG's Romania map, via `@svg-maps/romania` 2.0.0, CC BY 4.0; source https://mapsvg.com/maps/romania and license https://creativecommons.org/licenses/by/4.0/; package modifications documented by its author include viewBox/English names.

- [x] **Step 4: Build project stories and insert homepage map**

Create `/proiecte/` with one factual account per project, testimonial, county/system labels, and contact CTA. Distinguish editorial project/brand images from proof of each installation; do not geolocate `Proiecte Implementate` image-gallery photos. Insert a compact dark map section into the homepage with the same data source and no duplicate county geometry logic.

- [x] **Step 5: Verify map, keyboard, no-JS, and types**

Run: `npm test -- tests/unit/map-geometry.test.ts && npx playwright test tests/browser/projects.spec.ts && npm run typecheck`  
Expected: all three accessible projects work in enhanced and no-JS modes; geometry edge cases PASS.

---

### Task 7: Validated Contact Page and Honest Submission States

**Files:**
- Create: `src/lib/contact-validation.ts`, `src/components/contact/ContactForm.astro`, `src/scripts/contact-form.ts`
- Create: `src/pages/contact.astro`, `src/styles/contact.css`
- Test: `tests/unit/contact-validation.test.ts`, `tests/browser/contact.spec.ts`

**Interfaces:**
- Consumes `EnquiryType`, `getEnquiryType`, and confirmed contact/site data.
- Produces:
  ```ts
  interface EnquiryInput {
    type: EnquiryType; name: string; phone: string; email: string;
    county: string; message: string; consent: boolean; website: string;
  }
  type EnquiryErrors = Partial<Record<keyof EnquiryInput, string>>;
  function validateEnquiry(input: EnquiryInput): EnquiryErrors;
  function initContactForm(form: HTMLFormElement): () => void;
  ```
- `website` is an offscreen honeypot and is never required. The payload preserves user input plus a timestamp generated at submission; it contains no fake customer identifier.

- [x] **Step 1: Write failing validation and form-state tests**

Unit-test trimming; blank name/phone/message/missing consent; invalid phone and optional email; reasonable length limits; both enquiry types; honeypot content rejected without an API call; and valid Romanian diacritics. Browser tests cover direct `tip=instalare`, `tip=service`, neutral invalid/repeated query fallback, changing type manually, associated labels/descriptions, error summary focus and inline `aria-describedby`, and preserved values.

Mock the configured endpoint to test one POST for a double-click, then re-enabled retry, 2xx success with a clear Romanian confirmation, non-2xx server error, CORS-like rejected fetch, timeout/abort behavior, malformed non-JSON responses, and value preservation on failure. Test absent/whitespace endpoint disables the form with visible direct telephone/email actions; test no request occurs and no success text is shown. Test a 2xx non-JSON response still counts as success but never requires response JSON.

- [x] **Step 2: Run validation/form tests to verify failure**

Run: `npm test -- tests/unit/contact-validation.test.ts && npx playwright test tests/browser/contact.spec.ts`  
Expected: validation and contact route are absent; tests FAIL.

- [x] **Step 3: Implement validation, progressive form markup, and transport**

Use native controls with Romanian visible labels; a controlled type select/radio group; name, telephone, optional email, county, detailed message, privacy link/consent, and honeypot. Validate on submit and clear/update errors accessibly without deleting entered values. Server-side limits remain the eventual provider's responsibility.

Read the trimmed `PUBLIC_FORM_ENDPOINT` exposed by Astro; allow only HTTP(S) endpoint URLs and treat invalid/missing values as unconfigured with an explanatory notice. Use fetch JSON `POST`, disable only during pending submission, show `aria-live` status, support an explicit retry after settled failure, and clean listeners/timers on component cleanup. Abort stale submissions if reinitialization occurs. Do not reset values on failure; do clear/edit-confirm state on success. Direct `tel:` and `mailto:` links remain available in every state.

- [x] **Step 4: Complete the contact page**

Present two enquiry paths at the top, confirmed business identity/contact/address, the form, and privacy link. Do not invent opening hours, WhatsApp availability, social profiles, or workshop coverage. Explain requested information useful for a new assessment (surface/shape, crop, water, electricity) without adding extra required fields.

- [x] **Step 5: Verify all honest submission states**

Run: `npm test -- tests/unit/contact-validation.test.ts && npx playwright test tests/browser/contact.spec.ts && npm run typecheck`  
Expected: validation, disabled configuration, exactly-once submission, success, failures, retry, and fallback cases PASS.

---

### Task 8: Legal/Recovery Pages, Metadata, Sitemap, and Legacy Links

**Files:**
- Create: `src/pages/politica-confidentialitate.astro`, `src/pages/termeni-conditii.astro`, `src/pages/404.astro`
- Create: `src/pages/sitemap.xml.ts`, `src/components/site/SeoMeta.astro`, `public/robots.txt`, `public/_redirects`
- Modify: `src/layouts/BaseLayout.astro`, `src/data/routes.ts`, `THIRD_PARTY_NOTICES.md`, `README.md`
- Test: `tests/browser/finishing.spec.ts`, `tests/unit/sitemap.test.ts`

**Interfaces:**
- Produces legal routes, `/404.html`, production sitemap XML, robots directives, and static-host redirects:
  `/pages/sisteme-irigatii /sisteme-irigatii/ 301`
  `/pages/service /service-mentenanta/ 301`
  `/pages/contact /contact/ 301`
- `SeoMeta` returns canonical URL from `Astro.site + Astro.url.pathname`, title/description/OG metadata, and Organization/LocalBusiness JSON-LD built only from `site`.
- Every indexed content route appears once in sitemap; 404 and unconfigured/staging pages are not promoted.

- [x] **Step 1: Write failing metadata and recovery tests**

Test every primary/legal route has unique title/description, canonical URL, Romanian H1, and no broken header/footer contact links. Test Organization JSON-LD parses and has exact company/phone/email/address data but no fake ratings/coordinates/social profiles. Test sitemap contains all primary and legal routes exactly once, excludes 404, and uses the configured `SITE_URL`. Test robots/sitemap references, redirect rules, useful 404 recovery links, actual privacy behavior, and map source/CC-BY attribution.

- [x] **Step 2: Run finishing tests to verify failure**

Run: `npm test -- tests/unit/sitemap.test.ts && npx playwright test tests/browser/finishing.spec.ts`  
Expected: tests FAIL because legal/SEO/sitemap/recovery routes are absent.

- [x] **Step 3: Implement final routes and discoverability**

Plain-language privacy copy describes this implementation: local assets, no analytics, map uses bundled geometry, direct tel/email actions, and form data sent only when a real endpoint is configured. Include form fields and endpoint-processing caveat without claiming a named processor. Terms remain general site-use information, not a service contract or warranty. 404 provides recovery navigation and no metadata indexing.

Implement sitemap from the central route registry, absolute production canonical/OG URLs, robots, and host-agnostic Netlify-style `_redirects` documentation (make clear other hosts need equivalent configuration). Keep legal/consumer links from the original only when applicable to a lead-generation website; omit shipping/refund/cart links.

- [x] **Step 4: Verify metadata and production route output**

Run: `npm test -- tests/unit/sitemap.test.ts && npx playwright test tests/browser/finishing.spec.ts && npm run build && npm run typecheck`  
Expected: all metadata/route checks PASS and production output includes all agreed pages, sitemap, robots, and 404.

---

### Task 9: Full Accessibility, Responsive, Visual, and Evidence Review

**Files:**
- Create: `tests/browser/accessibility.spec.ts`, `tests/browser/responsive.spec.ts`
- Modify only to correct demonstrated defects: prior source/style/test/documentation files
- Create: `docs/verification.md`

**Interfaces:**
- Consumes all implemented routes and behaviors; no new feature components.
- Produces reproducible verification commands/results, screenshots, resolved review findings, and setup/deployment notes.

- [x] **Step 1: Add comprehensive accessibility and responsive tests**

Run axe on `/`, `/sisteme-irigatii/`, `/service-mentenanta/`, `/proiecte/`, `/contact/`, and legal pages in default desktop and mobile states. Assert no serious/critical violations, keyboard-visible focus, heading/landmark structure, alt text, valid `aria-expanded`/`aria-pressed`, and accessible names for icons. At 375, 768, 1024, and 1440px, assert `document.documentElement.scrollWidth <= window.innerWidth`; test 320px and 200% text/zoom as robustness cases. Include open mobile navigation, long Romanian labels, map/list details, form errors, and reduced-motion states.

- [x] **Step 2: Run the new review tests and fix only reproducible failures**

Run: `npx playwright test tests/browser/accessibility.spec.ts tests/browser/responsive.spec.ts`  
Expected for success: PASS. For each failure, record route, viewport/input, expected result, actual result, and root cause before a minimal fix; rerun the focused test and then the full suite.

- [x] **Step 3: Run the project app and perform visual/keyboard review**

Use the `run` skill, if applicable, to launch the Astro preview and inspect desktop/mobile screenshots. Invoke relevant UI/UX review/search guidance before styling changes and follow its pre-delivery checklist. Review asymmetric hierarchy, equal service/installation prominence, typography with diacritics, image crops, color contrast, footer/legal links, map markers and selected details, error/success states, 200% zoom, keyboard order, Escape/focus return, and no-JS content. No visual issue should be hidden with blanket `overflow-x: hidden`.

- [x] **Step 4: Verify source evidence and third-party requirements**

Compare company data and all project quotes/counties against the source URLs; confirm exact-project imagery is not falsely inferred. Confirm map CC-BY attribution is retained, partner marks/names remain limited to sourced references, all image source URLs and asset-origin records exist, and no catalog/ecommerce/social/claims drift appeared. If source content changed, report it rather than silently inventing replacement facts.

- [x] **Step 5: Run clean final verification and document results**

Run:
```bash
npm run typecheck
npm test
npm run build
npx playwright test
npm run test:a11y
```
Expected: every command exits 0. Install no production dependencies merely to make output look richer. Perform an internal-link/sitemap check against the built site and note that static redirect execution requires the chosen host's support. Record commands, date, tested sizes, manual checks, and any unperformed external integration/deployment tests in `docs/verification.md`.

`README.md` documents local setup, `SITE_URL`, optional `PUBLIC_FORM_ENDPOINT`, how to add a project/county, original asset/source conventions, attribution, testing, and that forms are intentionally disabled until a real endpoint is supplied. Do not claim production launch, live enquiry delivery, or deployment unless it was actually performed.

## Final whole-tree review and closeout

- [x] One fresh-context reviewer assessed the complete non-Git tree; no Critical findings were reported.
- [x] The three accepted Important findings received RED→GREEN fixes: standalone 44px targets, public npm lockfile portability, and configurable-origin robots generation.
- [x] The separately discovered small-screen marker collision and the subsequent 200%-text email-wrap regression were reproduced, corrected, and retested.
- [x] Final verification passed: 67 files with zero diagnostics, 66/66 unit/data tests in 9 files, an 8-page production build, 62/62 browser tests, and 15/15 axe tests.
- [x] Final built-output and visual audits passed; all deferred minors and declined-to-judge rulings are recorded in the non-Git SDD ledger and `final-review.md`.
- [x] Task 9 is complete. Deployment, real enquiry delivery, host redirect execution, and other external checks remain explicitly unperformed.
