# Sagro source/content audit

Audit read on 2026-11-12 against public sagro.ro pages and XML sitemaps. Statements below are source-site claims, not independent certifications or new performance guarantees.

## Irrigation material retained

| Public source | Input used in this design |
| --- | --- |
| https://sagro.ro/ and https://sagro.ro/pages/sisteme-irigatii | Pivot, linear, drum/reel and pumping offerings; consultation, configuration, installation/commissioning, service and maintenance; Zimmatic, Idrofoglia and Green Power references; three documented testimonials. |
| https://sagro.ro/pages/despre-noi | Irrigation company positioning and selection factors: surface, crop, water source, field conditions and electricity availability. Technical support before/after installation. Generator support where grid electricity is unavailable. |
| https://sagro.ro/products/sisteme-irigatii-zimmatic | Zimmatic equipment reference. No dealer certification is inferred. |
| https://sagro.ro/products/sisteme-idrofoglia | Idrofoglia irrigation/pumping reference. Its 30+ years belongs to Idrofoglia, not Sagro. |
| https://sagro.ro/products/generatoare-green-power | Generator power as a supporting off-grid offering. |
| https://sagro.ro/pages/contact | Primary phone, registered company/address and enquiry field needs. |
| https://sagro.ro/policies/privacy-policy | Official published `contact@sagro.ro` address and legal/company details. The contact-page extractor did not visibly expose an email address; the privacy page explicitly publishes it. |

## Map evidence and limits

The single evidence source for all three projects is https://sagro.ro/pages/sisteme-irigatii:

- Fermă vegetală — explicitly documented only in județul Călărași; Zimmatic pivot for corn.
- Ferma Baciu — explicitly documented as Ialomita; two seasons of Zimmatic use and reported configuration/installation support.
- Patino Robot — explicitly documented as Constanta; reported analysis and working method, with Zimmatic proposed through commissioning.

Only bundled IDs `ro-cl`, `ro-il`, and `ro-ct` are used. These are approximate county areas, never exact farms. Poiana Mare, Predești, and Craiova are business/contact addresses, not installation evidence. Generic project gallery photographs have no reliable location captions and cannot be geolocated or assigned one-to-one to testimonials.

## Material deliberately removed

The sitemap audit found 78 collections, 65 articles and 8,250 product URLs. Only three product URLs were irrigation offerings, leaving **8,247 non-irrigation product listings** excluded. **64 non-irrigation blog articles** are excluded along with the generic blog index.

Removed content includes tractor/combine parts, filters, agricultural tracks, second-hand parts and machines, soil-tillage/workshop goods, oils, bearings, generic ecommerce/cart/account/search/shipping/refund UI, and unrelated categories. These are intentionally not reproduced as thousands of low-value URLs in this audit.

The only irrigation-specific article compares drip, pivot and mobile-sprinkler systems. Drip does **not** become a commercial Sagro offering merely because it is covered educationally. Unverified numeric claims such as hectares per pivot are not carried over.

## Service evidence boundary

The old https://sagro.ro/pages/service page concerns tractors, combines and farm machinery. Its `9 ani experiență`, `6–12 luni garanție`, Oltenia-only machinery callouts and Case/New Holland/Steyr specialization do not establish irrigation service guarantees and are not migrated. Its workshop/secondary phone are not needed for the irrigation-focused contact route.

Irrigation after-installation service, periodic checks, technical interventions and specialist support are supported by the irrigation/about pages. The new service copy adds a clear enquiry/diagnostic workflow and seasonal maintenance language without response-time, emergency-coverage, free-service or warranty promises. No 24-hour blanket response commitment is used.

## Asset provenance

Only public Sagro/Shopify logo, irrigation, equipment and partner assets selected for local use are imported. Original URLs and reviewed alt text are stored in `src/data/media.ts`. Brand art is never described as a particular customer's installation unless the source page explicitly establishes that relationship.

The bundled Romania map is from `@svg-maps/romania` 2.0.0, viewBox `0 0 613 433`. Its README identifies the source as MapSVG's Romania map, https://mapsvg.com/maps/romania, under CC BY 4.0; attribution is preserved in `THIRD_PARTY_NOTICES.md` and the project-map UI.

## Legacy migration and project-source follow-up — 24 noiembrie 2026

The historical source observations above remain unchanged. The implementation prepared on 24 noiembrie 2026 adds explicit handling only for legacy URLs whose relevant material is represented in this audit: the irrigation page, contact, privacy policy, about page, Zimmatic, Idrofoglia, and Green Power. See `docs/discovery-maintenance.md` for the exact destinations.

The old machinery-service URL is deliberately not redirected to `/service-mentenanta/`: the scopes are not equivalent. The undocumented `/pages/irigatii` search sample is not enough evidence for another mapping. Neither decision adds back the removed catalog or transfers old machinery claims to irrigation service.

Project cards now point to an owner-controlled source-context page rather than implying that the former `/pages/sisteme-irigatii` URL still exposes the recorded stories in their old form. The 12 noiembrie 2026 date is the date of this content review, not an inferred original publication or commissioning date. Sagro-published project material is not independent verification; seasonal wording remains historical and does not update automatically.

**Superseded on 24 noiembrie 2026:** the project-source follow-up above is replaced by the current six-county/13-locality supplied-list model documented in `docs/discovery-maintenance.md`. Current cards and evidence sections no longer retain the three historical stories, seasonal wording, or former source relationship. No old statement in this audit supports or independently verifies the supplied localities.
