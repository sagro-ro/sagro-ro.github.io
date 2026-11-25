# Sagro Irigații

Standalone Romanian-language irrigation website for Sagro, built as static Astro output. It presents two equally important journeys—new irrigation installations and irrigation service/maintenance—plus six grouped county markers covering 13 supplied localities. Public project copy uses customer-facing implementation wording; internal records retain the supplied-list provenance and its lack of independent verification.

## Local setup

Requirements: Node.js 24 LTS and npm. Use the exact dependency versions in `package-lock.json`, whose package resolutions use the public npm registry.

```bash
npm ci
npm run dev
```

Astro serves the development site on `http://localhost:4321` by default. Production files are generated in `dist/`:

```bash
SITE_URL=https://sagro.ro npm run build
npm run preview
```

No Git history or deployment credentials are included in this workspace.

## Environment configuration

Copy `.env.example` to `.env` for local changes. Do not put secrets in public environment variables.

- `SITE_URL` sets Astro's public origin for canonical URLs, Open Graph URLs and sitemap locations. The default is `https://sagro.ro`.
- `PUBLIC_FORM_ENDPOINT` optionally accepts an `http://` or `https://` URL that receives enquiry JSON POST requests. Leave it empty to keep the form fields and submit control visibly disabled.

`robots.txt` is generated from `Astro.site`, so its sitemap directive follows the same `SITE_URL` as the canonical URLs, Open Graph URLs and sitemap entries.

### Form behavior

The browser trims and validates the enquiry before transport, prevents duplicate submissions, aborts after twelve seconds and preserves entered values after an error. JSON success requires an actual HTTP 2xx response; a missing/invalid endpoint, timeout or rejected request is never presented as success.

Payload keys are `type`, `name`, `phone`, `email`, `county`, `message`, `consent`, `website` and `submittedAt`. `type` is exactly `instalare` or `service`, `website` is the honeypot and `submittedAt` is a browser-generated ISO timestamp. The endpoint must perform its own authentication/authorization, server-side validation, abuse protection, processing and persistence as appropriate; browser validation is not a security boundary.

Before activating a provider, review and update the privacy page with its actual data-processing, retention and transfer details. Intercepted local browser tests use a reserved `.test` origin and do not prove delivery to a real enquiry service.

## Content updates

### Company and navigation data

- Verified business/contact facts: `src/data/site.ts`.
- Primary and legal navigation registries: `src/data/routes.ts`. These also determine sitemap membership.
- System and service copy: `src/data/systems.ts` and `src/data/services.ts`.

Do not import old machinery warranties, response-time promises or unrelated product claims into irrigation content.

### Update supplied implementation localities

1. Confirm each requested county and locality spelling before changing `src/data/projects.ts`. Preserve whether the information was supplied or independently verified; never upgrade its provenance without evidence.
2. Each ordered county record contains only `slug`, `countyId`, `countyLabel`, `localities`, `sourceUrl`. Derive `sourceUrl` through `getProjectSourceUrl(slug)` and keep the six county/source anchor pairs synchronized.
3. Use an ID already present in the bundled `@svg-maps/romania` geometry. Runtime checks cover `ro-mh`, `ro-dj`, `ro-ot`, `ro-tr`, `ro-cl`, and `ro-ct`; add explicit checks when supporting a new county.
4. Markers identify county geometry, not installation premises. Do not add customer addresses, geocoding, inferred coordinates, or exact project coordinates.
5. Do not add customer names, equipment attribution, quotations, outcomes, project years, seasonal wording, or unsupported guarantees to the supplied-locality records. Do not attach generic editorial imagery to a locality as installation evidence.
6. Update `src/data/project-evidence.ts` when the approved public note, actual review date, or provenance changes, and keep `docs/discovery-maintenance.md` aligned. The review date is internal provenance, not required public-facing map copy. The supplied list is not independently verified.
7. Add/extend exact data, fragment, browser, built-output, and scoped accessibility checks, then run the complete verification suite.

County records automatically create map/list controls and county cards. The map enhancement leaves every locality card readable if geometry cannot be resolved or JavaScript is unavailable.

### Images and attribution

Review an image visually before assigning an alt description. For media recovered from the former public site, add its local path and exact origin to `src/data/media.ts` and `THIRD_PARTY_NOTICES.md`; keep original query parameters in the source URL. Use `SourceImage.astro` rather than introducing remote runtime image URLs.

Site-owner-supplied county photographs are a separate record type, not additions to `src/data/media.ts` or the five-field locality schema. Place JPEG, PNG, WebP, or AVIF inputs (with case-insensitive extensions) in `src/assets/projects/<county-slug>/`, then add ordered alt/caption records to `src/data/county-media.ts`. `CountyGallery.astro` handles any nonempty photo list and additional counties without a new viewer or locality changes, while Astro supplies optimized WebP output. Record the supplied date and provenance in `THIRD_PARTY_NOTICES.md` and `docs/content-audit.md`; do not fabricate an external source URL, infer copyright ownership, or attribute a county photograph to a particular locality, premises, customer, commissioning date, or result.

Partner imagery is currently limited to Zimmatic, Idrofoglia and Green Power references from Sagro's irrigation page. Inclusion does not establish certification, exclusivity or warranty terms.

The Romania geometry comes from `@svg-maps/romania` 2.0.0, based on MapSVG Romania map under CC BY 4.0. Preserve visible attribution beside both map instances and the notices file. Fonts and icons are served/bundled locally through Fontsource and Lucide.

## GitHub Pages deployment

`.github/workflows/deploy.yml` builds the site on pushes to `main` and on manual workflow runs. It uses Node.js 24, installs exact dependencies from the public npm lockfile, builds with `SITE_URL=https://sagro.ro`, and publishes `dist/` through GitHub's official Pages actions. Do not upload or maintain a separate generated `dist/` branch for this workflow.

`public/CNAME` configures the custom domain `sagro.ro`, and `public/.nojekyll` disables Jekyll processing so underscored Astro assets are served normally. Both files are copied into `dist/` during the build.

The `public/**/index.html` documents provide GitHub Pages-compatible fallbacks for the reviewed legacy URLs. JavaScript navigation preserves query strings and fragments; a meta refresh and a visible link retain access without JavaScript. These are HTML client-side fallbacks, **not HTTP 301 redirects**. They are excluded from indexing and point search engines to the canonical destination. The separate `public/_redirects` file remains available for Netlify-compatible hosts that support server redirects.

### First-time repository and domain setup

1. Create a GitHub repository and push this project to its `main` branch, including `.github/workflows/deploy.yml`. The current workspace is not a Git repository; creating or pushing that repository requires an explicit action outside this local preparation.
2. In **Settings → Pages → Build and deployment**, select **GitHub Actions** as the source. Do not select **Deploy from a branch**.
3. Run the **Deploy to GitHub Pages** workflow if it does not start automatically after the first push. The workflow summary links to the published deployment.
4. At the DNS provider for `sagro.ro`, point the apex domain to GitHub Pages using these A records:
   - `185.199.108.153`
   - `185.199.109.153`
   - `185.199.110.153`
   - `185.199.111.153`
   If `www.sagro.ro` is also wanted, add a `www` CNAME pointing to `<github-username>.github.io` and configure `www.sagro.ro` separately in GitHub Pages. The `CNAME` file in this project is for GitHub Pages and does not modify the DNS provider.
5. In **Settings → Pages → Custom domain**, enter `sagro.ro`, wait for the DNS check, and enable **Enforce HTTPS** after GitHub provisions the certificate. Keep the generated `CNAME` file in the repository; otherwise a later deployment can remove the custom-domain setting.
6. Verify all primary routes, the reviewed legacy fallback links, canonical URLs, and the direct telephone/email actions on the published domain. Verify actual form delivery only after supplying and reviewing a real endpoint provider.

The workflow does not create DNS records, issue certificates, configure a form provider, or prove that the public GitHub Pages deployment has occurred. Consult [GitHub's custom-domain documentation](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/managing-a-custom-domain-for-your-github-pages-site) if the domain registrar or DNS provider uses different record-management labels.

## Tests and checks

```bash
npm run typecheck
npm test
npm run build
npx playwright test
npm run test:a11y
```

Vitest owns data/unit tests, including generic Astro county-gallery rendering. Playwright owns browser tests and starts three local servers: the main unconfigured development site on port 4321, an intercepted transport-test instance on port 4322, and a statically built preview on port 4324 for legacy fallback documents and optimized county-photo URLs. The second instance is not a live form provider. The static preview approximates local file delivery; it does not prove GitHub's public hosting, DNS, TLS or HTTP redirect behavior. Axe accessibility cases are tagged `@a11y`.

Redirect behavior depends on the host:

| Mechanism | Host capability | Behavior |
| --- | --- | --- |
| `public/**/index.html` | Static hosts such as GitHub Pages | Noindex HTML fallback with meta refresh, a visible destination link, and JavaScript navigation that preserves query strings and fragments. |
| `public/_redirects` | Netlify-compatible platforms | Executes the configured HTTP 301 rules below when the platform supports this file. |

```text
/pages/sisteme-irigatii /sisteme-irigatii/ 301
/pages/contact /contact/ 301
/policies/privacy-policy /politica-confidentialitate/ 301
/pages/despre-noi /sisteme-irigatii/ 301
/products/sisteme-irigatii-zimmatic /sisteme-irigatii/ 301
/products/sisteme-idrofoglia /sisteme-irigatii/ 301
/products/generatoare-green-power /sisteme-irigatii/ 301
/pages/irigatii /sisteme-irigatii/ 301
/collections/all /sisteme-irigatii/ 301
/collections/piese-tractoare /sisteme-irigatii/ 301
```

Netlify-compatible hosts can consume `_redirects` directly. Other hosts need equivalent server/platform rules; its presence in `dist/` alone does not prove that a host executes redirects. Verify redirects, the real form provider and production deployment separately after choosing and configuring the host.

The generated site includes content/legal pages, `sitemap.xml`, `robots.txt` and `404.html`. No production deployment or live enquiry delivery is implied by a successful local build.

See `docs/content-audit.md` for source boundaries, `THIRD_PARTY_NOTICES.md` for asset/licensing records and `docs/verification.md` for final verification evidence when present.
