# Third-party notices

## Sagro source media

The local images in `src/assets/` were copied from Sagro's existing public website and its Shopify CDN. Their visual content was reviewed before use. Editorial photographs and equipment illustrations are not evidence that a particular documented project used the pictured equipment or location.

Rights remain with their respective holders. These local copies preserve the source-origin records below so future maintainers can verify replacement or reuse requirements.

| Local file | Original source |
| --- | --- |
| `brand/sagro-logo.png` | https://sagro.ro/cdn/shop/files/Asset_4.png?v=1721913272 |
| `irrigation/hero-field.png` | https://sagro.ro/cdn/shop/files/porumb_ad84fb33-874c-48f3-b5cd-81013f6f0b82.png?v=1769428935 |
| `irrigation/hero-pivot.jpg` | https://cdn.shopify.com/s/files/1/0889/2724/0499/files/lindsay_111218_05.jpg?v=1769432714 |
| `irrigation/pivot.png` | https://cdn.shopify.com/s/files/1/0889/2724/0499/files/Untitled_design_11.png?v=1769417544 |
| `irrigation/linear.png` | https://cdn.shopify.com/s/files/1/0889/2724/0499/files/Untitled_design_13.png?v=1769419429 |
| `irrigation/drum.png` | https://cdn.shopify.com/s/files/1/0889/2724/0499/files/Untitled_design_15.png?v=1769420041 |
| `irrigation/pump.png` | https://cdn.shopify.com/s/files/1/0889/2724/0499/files/all.png?v=1769420268 |
| `partners/zimmatic.png` | https://sagro.ro/cdn/shop/files/1.png?v=1769429932 |
| `partners/idrofoglia.png` | https://sagro.ro/cdn/shop/files/2.png?v=1769429917 |
| `partners/green-power.png` | https://sagro.ro/cdn/shop/files/3.png?v=1769429899 |

Zimmatic, Idrofoglia and Green Power names and marks belong to their respective owners. Their inclusion reflects the references published on Sagro's irrigation website; this site does not assert certification, exclusive distribution or warranty terms.

## Romania county geometry

The map uses bundled county paths from `@svg-maps/romania` 2.0.0, with viewBox `0 0 613 433`.

- Original work: [MapSVG Romania map](https://mapsvg.com/maps/romania).
- License: [Creative Commons Attribution 4.0 International](https://creativecommons.org/licenses/by/4.0/).
- Distribution package: https://www.npmjs.com/package/@svg-maps/romania.
- The package README documents the package author's changes to the original work: adding a viewBox and English county names.

The site adds county selection styling and county-level project buttons. These do not add or imply exact installation coordinates. The geometry is bundled at build time; browsing the map does not contact MapSVG or a tile service. The attribution links open their external destinations only when selected.

## Bundled packages

- Outfit and Work Sans are served locally through Fontsource packages, under the SIL Open Font License 1.1.
- Icons are supplied by Lucide (`@lucide/astro`), under the ISC license.
