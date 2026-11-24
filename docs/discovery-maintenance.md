# Discovery and migration maintenance

**Prepared:** 24 noiembrie 2026

**Scope:** reviewed legacy URLs, current supplied locality context, and the optional `llms.txt` summary.

This document records local implementation and maintenance decisions. It does not prove public deployment, crawler access, indexing, ranking, citations, or AI recommendations.

## Legacy URL decisions

Each mapping below uses only the first-party historical material recorded in `docs/content-audit.md`. The old catalog and unrelated machinery content remain deliberately removed.

| Legacy path | Current destination | Decision |
| --- | --- | --- |
| `/pages/sisteme-irigatii` | `/sisteme-irigatii/` | Retains the relevant irrigation systems, installation, and selection content. |
| `/pages/contact` | `/contact/` | Retains the company contact and enquiry journey. |
| `/policies/privacy-policy` | `/politica-confidentialitate/` | Retains the privacy-information journey; the new page describes current behavior rather than recreating old text. |
| `/pages/despre-noi` | `/sisteme-irigatii/` | The documented irrigation positioning, selection factors, technical support, and off-grid power context live on this route. |
| `/products/sisteme-irigatii-zimmatic` | `/sisteme-irigatii/` | Retains the relevant Zimmatic/equipment context without a dealer-certification claim. |
| `/products/sisteme-idrofoglia` | `/sisteme-irigatii/` | Retains the relevant irrigation/pumping context; Idrofoglia's experience is not attributed to Sagro. |
| `/products/generatoare-green-power` | `/sisteme-irigatii/` | Retains generator support only as part of irrigation/off-grid power, not as a recreated generator catalog. |

### Routes deliberately not mapped

- **`/pages/service`** documented tractors, combines, and farm machinery, including old warranties and specializations that do not apply to irrigation-only service. Its static fallback and declarative redirect are removed; the path uses ordinary 404 recovery in local static preview. Do not turn it into an irrigation-service redirect without a separately reviewed migration decision.
- **`/pages/irigatii`** appeared in a sampled search result but lacks equivalent first-party source detail in the inspected documentation. No destination is inferred; it uses ordinary 404 recovery in local static preview.
- **Other removed catalog/article URLs** remain excluded. Do not add wildcard redirects or recreate unrelated pages merely to avoid a 404.

`public/_redirects` is a declarative inventory for a compatible host/CDN. **GitHub Pages does not execute these rules.** The `public/**/index.html` documents generate HTTP 200 browser fallbacks with noindex metadata, a canonical link, meta refresh, a visible destination link, and query/fragment-preserving JavaScript navigation. They are not direct destination 301/308 responses.

For a real site migration, configure server-side 301/308 redirects at the host or CDN, retain them as long as possible—normally at least one year—and preserve useful query/fragment behavior where the platform supports it. HTTP/HTTPS and `www` normalization remain separate host/CDN/TLS work, not completed by these static files.

## Current supplied locality context

The supporting route `/surse-proiecte/` is the canonical, owner-controlled county/locality list. It supersedes the former three-story presentation, including the unrelated Ialomița story; no old historical statement supports the new list and none of those stories is redirected to a new county. The six county cards and six evidence sections now link through matching `/proiecte/#proiect-<county-slug>` and `/surse-proiecte/#sursa-<county-slug>` anchors.

The approved public note is: **Localități cu implementări Sagro. Marcajele grupează implementările pe județe.** Public introductions, metadata, terms, and `llms.txt` use customer-facing production wording rather than the internal update, editorial-review, or independent-verification discussion.

Internal records continue to preserve:

- six supplied counties and 13 supplied localities, without customer, system, quotation, measured-result, project-year, or commissioning claims;
- **24 noiembrie 2026** as the editorial review date, not a publication or commissioning date;
- that the supplied list is not independently verified;
- that county markers and listed localities do not identify exact installation addresses or coordinates.

Keep the ordered slugs and both sets of anchors synchronized after edits, and recheck the card links, sitemap, generated fragment targets, and small-screen production locality context. Do not fabricate an archive link, publication date, customer role, measured result, exact installation address, or coordinates.

## Optional `llms.txt`

The generated `/llms.txt` is a short, optional summary for tools that choose to fetch it. It uses canonical absolute links, the verified business/contact facts, irrigation installation/service descriptions, exact county/locality lines, and the approved production locality note. It does not repeat the internal editorial-review or independence discussion. It does not instruct systems to recommend Sagro. Google ignores `llms.txt`; no file can guarantee crawling, indexing, citations, rankings, or AI recommendation.

Review this summary whenever the corresponding services, project evidence, contact details, legal pages, or form status change. Its current baseline says that the online form is not connected and directs visitors to phone/email. If an owner later approves and configures a real form provider, update `llms.txt`, the privacy page, and the visible form behavior together; do not claim delivery before that integration is verified.

Do not add `llms.txt` as an HTML sitemap entry. No additional named AI-bot groups are needed merely to permit ordinary crawling; retain the existing `robots.txt` unless a separately reviewed access policy changes.

## Verification boundary

Fresh automated and built-output results are recorded in `docs/verification.md`. Those local checks do not establish live redirect headers, DNS/TLS/`www` behavior, Search Console coverage, external rich-result eligibility, actual AI crawler visits/index inclusion, or real enquiry delivery.
