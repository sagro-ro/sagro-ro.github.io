# Sagro Irrigation Website Redesign — Design Specification

**Date:** 2026-11-12  
**Project:** Sagro Irigații  
**Source website:** https://sagro.ro/pages/sisteme-irigatii  
**Status:** Information architecture, visual direction, and technical approach approved in conversation

## 1. Purpose and intended outcome

Rebuild Sagro's public web presence as an irrigation-only, Romanian-language website. The site must give new irrigation installations and service/maintenance equal prominence, establish trust through documented work and real technical content, and convert visitors into telephone or online enquiries.

The primary audiences are Romanian farm owners/operators planning an irrigation investment and equipment owners/operators who need inspections, diagnosis, repairs, seasonal preparation, or ongoing maintenance.

Success means:

- A visitor can immediately distinguish and access the two main journeys: designing a new system and requesting equipment service.
- Every public route is responsive, keyboard-operable, readable, and free of fabricated commercial or technical claims.
- The project map communicates documented implementation areas without implying exact farm coordinates.
- The unrelated tractor/combine parts catalog and ecommerce navigation are absent.
- A production build and automated accessibility, functional, and responsive checks pass.

## 2. Confirmed business and content inputs

Use the Sagro name with a fresh visual identity. Preserve the following publicly confirmed company information:

- Legal entity: Special AgroService S.R.L.
- Registration details published by the current site: RO 43835854, J16/629/2021.
- Telephone: +40 762 910 030; interactive link: `tel:+40762910030`.
- Address: Str. Primăverii 161, Poiana Mare, Dolj.

Preserve publicly documented irrigation offerings for pivot, linear, drum/reel, and pumping systems; technical consultation, custom project configuration, installation, and after-installation service/maintenance. Partner imagery or naming must come from the existing Sagro website and must not be expanded into unsupported certifications or exclusivity claims.

The initial project set contains only the three public project areas on the current irrigation page:

1. Călărași — vegetable farm; Zimmatic pivot for a large corn area.
2. Ialomița — Ferma Baciu; two seasons of Zimmatic use reported in the existing testimonial.
3. Constanța — Patino Robot; testimonial concerning the Sagro team's working method.

All three map positions are **approximate county-level locations**, not precise premises. Additional projects, service areas, response times, performance numbers, certifications, warranties, client logos, and equipment specifications must not be invented. They can be added later when supplied and verified.

## 3. Scope and routes

| Route | Purpose and primary content |
| --- | --- |
| `/` | Dual installation/service introduction; system types; consultation-to-maintenance process; documented projects; Romania map; partner evidence; FAQs; contact CTA. |
| `/sisteme-irigatii/` | Pivot, linear, drum/reel, and pumping systems; technical consultation; configuration; installation; partner brands; new-project CTA. |
| `/service-mentenanta/` | Preventive inspections, diagnostics, repairs, seasonal preparation, after-installation support; maintenance workflow; service-request CTA. |
| `/proiecte/` | Three documented project accounts, original available testimonial wording, map, and links to make an enquiry. |
| `/contact/` | Confirmed phone/address, new-project and service enquiry selection, accessible form states, and direct-contact fallback. |
| `/politica-confidentialitate/` | Plain-language privacy information for the actual implemented behavior: no analytics or tracking, direct telephone links, and form behavior only when an endpoint is configured. |
| `/termeni-conditii/` | General website-use information based on confirmed company details, without unsupported legal guarantees. |
| `/404.html` | Helpful recovery navigation to the homepage, systems, service, and contact routes. |

Common navigation: **Acasă · Sisteme de irigații · Service și mentenanță · Proiecte · Contact**, plus **Cere o evaluare**. The active route is indicated visually and programmatically. The header becomes an accessible disclosure menu on small screens.

Footer: concise irrigation positioning, core page links, confirmed contact information, legal links, company registration details, and a visible telephone action. No obsolete parts-store or shopping links.

Where deployment supports redirects, `/pages/sisteme-irigatii` redirects to `/sisteme-irigatii/`, `/pages/service` redirects to `/service-mentenanta/`, and `/pages/contact` redirects to `/contact/`.

## 4. Experience and interaction design

### Installation and service parity

The hero introduces both capabilities, followed by two equally prominent route cards:

- **Proiectează un sistem** → systems/new-project journey.
- **Solicită service** → service/maintenance journey.

Each detail page carries its matching enquiry action into the contact form. The selected enquiry type survives navigation and can be changed manually.

### Project process

Use an editorial, numbered sequence: technical discussion, field/configuration assessment, tailored solution, installation/commissioning, and ongoing support. Keep wording factual and avoid promising availability times or outcomes that have not been confirmed.

### Romania implementation map

The map is a bundled, responsive SVG of Romania with county geometry. It does not require runtime map tiles, an API key, trackers, or an external map provider.

Each initial project maps to its documented county. Markers are calculated from local county geometry rather than presented as surveyed coordinates. The interface includes:

- A visible heading explaining that implementation locations are approximate.
- Buttons/markers with accessible project names and visible focus states.
- Mouse, touch, and keyboard selection.
- An accompanying selected-project panel with county, client/project name, public description, and link to the project content.
- A companion list of all projects conveying the same information when the map cannot be used or JavaScript is unavailable.
- Restrained selected/hover states that do not rely on color alone.
- No auto-pan, autoplay, fake live activity, or artificial counters.

### Contact behavior

Common fields: enquiry type, name, telephone, optional email, county, message, and privacy acknowledgement. Telephone is required; email, when entered, must validate. Each field has a persistent Romanian label, nearby error text, and an accessible error summary that receives focus after invalid submission.

Submission is a JSON `POST` to the endpoint configured by `PUBLIC_FORM_ENDPOINT`. Successful 2xx responses produce a clear success state. Network/server errors preserve entered values, explain that the enquiry was not sent, offer retry and telephone contact, and never display false success. Pending submission shows a disabled button and status feedback. A honeypot is included without trapping assistive-technology users; real spam protection remains the endpoint's responsibility.

When `PUBLIC_FORM_ENDPOINT` is absent, the form remains visibly disabled with a Romanian explanatory notice and the confirmed telephone action. No apparent submission occurs. This is the honest baseline until the owner configures a real submission service. Form transport is covered by tests using a controlled mock endpoint.

The privacy page and consent wording must be updated if production later adds a form processor, analytics, or another external data recipient.

## 5. Visual system

**Direction:** precision engineering in the field. Use a clean Swiss-influenced editorial grid with agricultural photography and technical annotations, not a generic SaaS dashboard or a card-heavy template.

- **Palette:** deep forest green for primary surfaces and actions; warm limestone and crisp off-white for page backgrounds; water blue/aqua for map graphics and irrigation accents. Text and interactive states meet WCAG AA contrast.
- **Typography:** Outfit for display headings; Work Sans for body and UI. Use fluid, bounded heading sizes, comfortable line lengths, and a 16px minimum body size.
- **Imagery:** existing Sagro irrigation and agricultural photographs, reviewed before use and given content-specific Romanian alternative text. Avoid unrelated machinery imagery.
- **Graphic language:** fine technical lines, equipment/field labels, restrained grids, and water-path details. Use simple SVG/Lucide icons, never emoji as interface icons.
- **Composition:** asymmetric hero with prominent pivot photography; editorial process sections; full-width map feature; generously spaced layouts and limited corner-radius variety.
- **Motion:** short, purposeful opacity/transform reveals and map selection feedback. Avoid layout animation, parallax, heavy animation frameworks, and blocking transitions. Under `prefers-reduced-motion: reduce`, remove nonessential motion and show final states immediately.

Core accessibility requirements include a skip link, semantic landmarks and heading order, `lang="ro"`, minimum 44×44px interactive targets, visible focus, accessible menu state, alt text, 4.5:1 normal-text contrast, and no horizontal scrolling at supported widths.

## 6. Technical architecture

### Stack

- Astro with static output and TypeScript in strict mode.
- Standard `.astro` layouts/components and small framework-free browser scripts for the menu, reveals, map interactions, and form behavior.
- Custom CSS using shared design tokens and mobile-first responsive rules; no global CSS/UI framework.
- Astro asset handling for locally stored, optimized responsive images. Self-host fonts where licensing/package distribution permits.
- No client-side application router, CMS, database, ecommerce backend, analytics, or third-party runtime map SDK.

### Suggested boundaries

- `src/layouts/BaseLayout.astro` — metadata, common document structure, skip link, header/footer slots.
- `src/components/site/` — header, footer, shared CTA, breadcrumbs where useful.
- `src/components/sections/` — hero, dual journey, process, partner strip, FAQ, and other reusable page sections.
- `src/components/projects/ProjectMap.astro` — SVG/map structure, project selector, and no-JS project list.
- `src/components/contact/ContactForm.astro` — form structure and small submission script.
- `src/data/projects.ts` — typed single source of truth for all map and project-page project entries.
- `src/data/site.ts` — company and navigation source of truth.
- `src/content/faqs.ts` or equivalent data module — reviewed Romanian FAQ copy.
- `src/styles/` — tokens, global foundations, and focused component styles.
- `public/` — sitemap support, static redirects, and assets not processed by Astro.

Keep units independently understandable and tested through their public content/behavior. Do not abstract a wrapper around every small HTML element. Grow shared components only when the same behavior appears more than once.

### Metadata and discoverability

Give every route a unique Romanian title/description, canonical URL derived from the configured production site URL, Open Graph defaults due to actual available imagery, semantic heading structure, and stable shareable links. Generate a sitemap. Add Organization/LocalBusiness structured data using only confirmed company information. Do not publish place coordinates for farms.

### Performance

Ship static HTML by default. Lazy-load below-the-fold imagery and reserve media dimensions to prevent layout shifts. Use modern responsive image formats, defer small interaction scripts, self-host critical assets when practical, and avoid global animation dependencies. The map SVG is bundled and lightweight; scripts provide progressive enhancement rather than blocking project content.

## 7. Content and error handling

- Reuse current irrigation material only after confirming it on the source site; edit grammar/spacing for professional Romanian without changing factual meaning.
- Preserve the exact meaning of existing testimonials and attribute only to the publicly named client/project.
- Do not fabricate missing project images: use a clearly relevant general Sagro irrigation image as editorial imagery, without presenting it as a specific documented installation unless the source confirms that relationship.
- Broken/noncritical images retain dimensions and useful alternative text; navigation and content remain usable.
- Unsupported routes show the 404 experience rather than a blank application shell.
- Form failures are explicit and recoverable. No loading indicator can remain stuck after a settled request.
- Empty/failed map enhancement leaves the complete project list visible.

## 8. Verification

### Automated

- Astro/TypeScript production build and route rendering.
- Unit tests for project-data completeness/unique slugs/known county references, telephone-link formatting, enquiry-type parsing, and field validation.
- Playwright browser tests for all navigation routes, old-route redirect behavior where supported, mobile-menu keyboard/dismiss behavior, installation and service CTA preselection, map marker and project-list synchronization, missing-endpoint behavior, invalid form submission, mocked success, and mocked server/network failure.
- Automated accessibility scans on the five primary routes plus keyboard checks for the menu, map, and form.
- Responsive assertions at 375, 768, 1024, and 1440px, including no horizontal overflow.
- Internal-link and generated-sitemap checks.

### Manual review

- Inspect desktop and mobile screenshots for visual hierarchy, Romanian diacritics, overflow, wrapping, and content accuracy.
- Test keyboard-only navigation, visible focus, reduced motion, and the no-JavaScript project/contact fallbacks.
- Compare all company facts, project names/areas, partner references, and testimonials against their original public source URLs.
- Confirm that every actionable control performs a real action and no content is presented as successfully sent without a confirmed server response.

## 9. Out of scope

- Ecommerce, tractor/combine parts, filters, agricultural tracks, or unrelated catalog content.
- New customer accounts, maintenance dashboards, live GPS telemetry, or precise farm geolocation.
- CMS integration, analytics, automated deployment, live form-provider account setup, and rebranding away from Sagro.
- Invented service guarantees, business statistics, review ratings, or coverage claims.

These can become separate design/planning efforts if requested later.

## 10. Acceptance criteria

The implementation is complete when the agreed routes are present, both business journeys are equally discoverable, all three documented projects appear on the map and in accessible text, confirmed Sagro contact details work, no unrelated catalog content remains, form behavior is honest in configured and unconfigured states, and the production build plus the specified automated and manual checks pass.
