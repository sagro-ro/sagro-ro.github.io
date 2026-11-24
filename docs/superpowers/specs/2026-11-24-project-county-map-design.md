# Sagro County-Grouped Project Map Design

**Date:** 24 noiembrie 2026
**Status:** written specification reviewed and approved; implementation planning in progress

## Goal

Remove the three unsupported project stories and markers from the Sagro website and replace them with an interactive, county-grouped map containing exactly the 13 localities supplied for this update. Publish no customer, equipment, quotation, outcome, warranty, response-time, or exact-premises claims.

## Supplied implementation locations

The user supplied these locations, displayed here with standard Romanian diacritics:

| County | County geometry ID | Public slug | Localities |
| --- | --- | --- | --- |
| Mehedinți | `ro-mh` | `mehedinti` | Vânători |
| Dolj | `ro-dj` | `dolj` | Băilești, Rojiște, Listeava, Ostroveni, Valea Stanciului |
| Olt | `ro-ot` | `olt` | Corabia, Vișina |
| Teleorman | `ro-tr` | `teleorman` | Turnu Măgurele, Traian |
| Călărași | `ro-cl` | `calarasi` | Borcea, Mănăstirea |
| Constanța | `ro-ct` | `constanta` | Horia |

There are six counties and 13 localities. All six requested county IDs were verified to exist in the installed `@svg-maps/romania` 2.0.0 geometry. `OT` in the request is rendered as Olt.

## Chosen approach

Retain the existing progressive-enhancement architecture:

- six geometry-centered county markers;
- six matching county-list buttons;
- six county detail cards;
- keyboard selection with Enter and Space;
- synchronized `aria-pressed` state and an accessible status message;
- supported direct fragments using `/proiecte/#proiect-<county-slug>`;
- all six county cards visible without JavaScript.

The rejected static-map alternative would remove useful selection and deep-link behavior without improving content accuracy.

## Data model and provenance

Replace the rich story fields with a county-group model. The public data must contain only county identity, geometry ID, slug, localities, and the internal evidence URL. Remove `clientLabel`, `systemLabel`, `summary`, `quote`, and historical-story headings. There must be no latitude, longitude, installation address, or precise project coordinates.

Retain the `projects` export as the county-group collection to limit unrelated changes, but update its TypeScript interface and every consumer to the new model. Preserve the supplied county order shown above so slugs, numbering, fragments, and tests are deterministic.

Retain `projectEvidence.route` as `/surse-proiecte/` and `getProjectSourceUrl(slug)` for internal links. Replace the historical URL, old review date, and historical-story note with transparent current-list context:

- the list was supplied for this website update;
- the editorial review date is **24 noiembrie 2026**;
- the information is not independently verified;
- markers identify counties and localities, not exact project premises.

Do not claim that the supplied list contains measured outcomes, named customers, specific irrigation systems, project years, or commissioning dates.

## User interface and content

### Homepage and projects page

- Replace every three-project description and client-experience claim with the six-county/13-locality presentation.
- Number the marker badges 01–06.
- Use accessible names containing the county and its locality information.
- Show each selected county's complete locality list in its detail card.
- Give each card a link to its corresponding `/surse-proiecte/#sursa-<county-slug>` anchor, including compact homepage cards.
- Keep the current map attribution and license links.
- Explain that map markers are county references, while the listed localities are the only supplied places; neither identifies an exact installation address.
- Remove the old Călărași-specific mobile CSS offset and connector. If geometry-centered 44px targets overlap at any tested viewport, adjust only the visual callout while retaining a visible connection to the actual county anchor.

### Evidence page

Retain `/surse-proiecte/` so its existing route, sitemap entry, and supporting navigation do not become dead links. Replace all historical stories, quotations, named clients, systems, and external historical-source claims.

The page must explain the supplied-list provenance and review date, then provide one county section per supplied county with its localities, current context, and a backlink to `/proiecte/#proiect-<county-slug>`. Do not redirect an unrelated old Ialomița story to a new county.

### Discovery and metadata

- Update `/llms.txt` to describe the six counties and 13 supplied localities without customer stories, equipment attribution, quotations, or unsupported discovery claims.
- Update project/homepage/source-page titles, descriptions, headings, and explanatory copy to match the new list.
- Keep the eight indexed HTML routes and their sitemap ordering; no route migration is required for this design.
- Do not add coordinates, service-area guarantees, ratings, response times, or structured-data claims for the implementation locations.

### Removal of unsupported public content

Generated public pages must no longer present Ferma Baciu, Patino Robot, the old Ialomița project, the two-season duration, or the old three project quotations and system descriptions. Existing unrelated product/system pages and verified company information remain unchanged.

Historical plan and verification records may remain as dated records of prior work, but current maintenance documentation must clearly supersede the outdated three-project content. No old historical statement is evidence for the new locality list.

## Interaction lifecycle

Retain the existing safe fragment parser and ordinary map initialization/selection/hash-change behavior:

- initialization without a fragment selects Mehedinți;
- initial unknown, unrelated, or malformed fragments retain the default without enabling a nonexistent selection;
- later valid fragments select and align their county card;
- an explicitly emptied hash restores Mehedinți;
- cleanup restores all six static cards and removes listeners and queued alignment work.

The previously deferred stale-cleanup edge is outside this content change unless implementation work exposes it as a current-user path.

## Verification requirements

Write behavioral tests before implementation and watch each new or updated assertion fail for the expected outdated content before making the minimal production change.

### Unit and data checks

- Assert the exact six-county ordered dataset and flattened 13-locality list.
- Assert unique county slugs/IDs, valid source anchors, and absence of coordinate and unsupported-story fields.
- Retain valid, unknown, empty, encoded, and malformed project-fragment parser cases using the new slugs.
- Assert current `llms.txt` counties, localities, evidence date/context, canonical links, and forbidden unsupported claims.

### Browser checks

- Verify six markers, six list controls, six cards, exact localized labels, and synchronized selection.
- Exercise Enter/Space keyboard selection and actual pointer activation for every marker.
- Confirm every marker remains at least 44px and independently reachable at 320px and 375px; include neighboring-layout checks as needed.
- Exercise direct fragments for each county, empty/unknown hashes, status updates, scrolling beneath the sticky header, back navigation, and cleanup.
- Verify all six cards without JavaScript.
- Follow all six source links and backlinks, including visible local provenance at mobile widths and visible keyboard focus.
- Confirm homepage and projects-page descriptions contain only the new locality presentation and none of the removed stories.
- Retain the complete existing contact, responsive, metadata, legacy-fallback, and accessibility coverage.

### Built output and visual checks

- Update local audit utilities from three to six source/backlink pairs and refresh generated-reference totals from actual output.
- Assert zero unresolved same-origin links/fragments and assert that removed public story content is absent from generated HTML and `llms.txt`.
- Run typecheck, unit/data tests, production build, complete browser suite, and scoped axe suite in order.
- Inspect regenerated desktop/mobile project-map screenshots and mobile source context, including selected Dolj, Olt, and Teleorman cards and small-screen marker reachability.

## Boundaries

No address geocoding, exact project coordinates, invented project details, new third-party map service, customer-data transmission, form-provider configuration, deployment, DNS/TLS changes, or AI/search outcome promises are included. No commit, push, merge, or publication is authorized by this specification; those remain separate user decisions.
