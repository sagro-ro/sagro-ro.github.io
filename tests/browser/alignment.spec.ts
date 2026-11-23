import { expect, test } from '@playwright/test';

const routes = [
  '/',
  '/sisteme-irigatii/',
  '/service-mentenanta/',
  '/proiecte/',
  '/contact/',
  '/politica-confidentialitate/',
  '/termeni-conditii/',
  '/pagina-inexistenta/',
];

test('editorial headings and descriptive copy are centered while operational labels stay left-aligned', async ({ page }) => {
  for (const width of [1440, 375]) {
    await page.setViewportSize({ width, height: 900 });

    for (const route of routes) {
      await page.goto(route);
      const result = await page.evaluate(() => {
        const visible = (element: Element) => element.getClientRects().length > 0;
        const editorial = [...document.querySelectorAll('main h1, main h2, main h3, main h4, main p, main blockquote, .site-footer p')]
          .filter((element) => visible(element) && !element.closest('nav') && !element.closest('form') && !element.closest('[data-map-controls]'));
        const eyebrow = [...document.querySelectorAll('main .eyebrow')].filter(visible);

        return {
          editorialCount: editorial.length + eyebrow.length,
          misalignedEditorial: [...editorial, ...eyebrow]
            .filter((element) => getComputedStyle(element).textAlign !== 'center')
            .map((element) => `${element.tagName.toLowerCase()}.${element.className}: ${element.textContent?.trim().slice(0, 70)}`),
          misalignedLabels: [...document.querySelectorAll('form label')]
            .filter(visible)
            .filter((element) => getComputedStyle(element).textAlign !== 'left' && getComputedStyle(element).textAlign !== 'start')
            .map((element) => element.textContent?.trim()),
          misalignedMapControls: [...document.querySelectorAll('[data-project-list-controls] button')]
            .filter(visible)
            .filter((element) => getComputedStyle(element).textAlign !== 'left' && getComputedStyle(element).textAlign !== 'start')
            .map((element) => element.textContent?.trim()),
        };
      });

      expect(result.editorialCount, `${route} at ${width}px has editorial content`).toBeGreaterThan(0);
      expect(result.misalignedEditorial, `${route} at ${width}px editorial alignment`).toEqual([]);
      expect(result.misalignedLabels, `${route} at ${width}px form label alignment`).toEqual([]);
      expect(result.misalignedMapControls, `${route} at ${width}px map control alignment`).toEqual([]);
    }
  }
});

test('uses the Sagro logo as the browser favicon', async ({ page, request }) => {
  await page.goto('/');
  const icon = page.locator('link[rel~="icon"]');
  await expect(icon).toHaveAttribute('href', '/favicon.png');
  await expect(icon).toHaveAttribute('type', 'image/png');
  const response = await request.get('/favicon.png');
  expect(response.ok()).toBe(true);
  expect(response.headers()['content-type']).toContain('image/png');
});

test('footer branding and contact links are centered within their columns', async ({ page }) => {
  for (const width of [1440, 768, 375]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto('/');
    const positions = await page.evaluate(() => {
      const center = (selector: string) => {
        const element = document.querySelector<HTMLElement>(selector);
        if (!element) throw new Error(`Missing element: ${selector}`);
        const bounds = element.getBoundingClientRect();
        return bounds.x + bounds.width / 2;
      };
      return {
        intro: center('.footer-intro'),
        brand: center('.footer-intro [data-brand]'),
        image: center('.footer-intro .brand-image'),
        descriptor: center('.footer-intro .brand-descriptor'),
        contact: center('.footer-contact'),
        phone: center('.footer-contact [href^="tel:"]'),
        email: center('.footer-contact [href^="mailto:"]'),
        address: center('.footer-contact > p:last-child'),
        navigationAlignment: getComputedStyle(document.querySelector('.site-footer nav')!).textAlign,
      };
    });
    const tolerance = 1;
    expect(Math.abs(positions.brand - positions.intro), `brand alignment at ${width}px`).toBeLessThanOrEqual(tolerance);
    expect(Math.abs(positions.image - positions.intro), `logo alignment at ${width}px`).toBeLessThanOrEqual(tolerance);
    expect(Math.abs(positions.descriptor - positions.image), `descriptor alignment at ${width}px`).toBeLessThanOrEqual(tolerance);
    for (const [name, position] of [['phone', positions.phone], ['email', positions.email], ['address', positions.address]] as const) {
      expect(Math.abs(position - positions.contact), `${name} alignment at ${width}px`).toBeLessThanOrEqual(tolerance);
    }
    expect(positions.navigationAlignment).toBe('left');
  }
});

test('service workflow introduction is centered within its section', async ({ page }) => {
  for (const width of [1440, 768, 375]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto('/service-mentenanta/');
    const positions = await page.evaluate(() => {
      const heading = document.querySelector<HTMLElement>('section[aria-labelledby="service-workflow-title"] .section-heading');
      if (!heading) throw new Error('Missing service workflow introduction');
      const container = heading.parentElement!;
      const center = (element: HTMLElement) => {
        const bounds = element.getBoundingClientRect();
        return bounds.x + bounds.width / 2;
      };
      return { heading: center(heading), container: center(container) };
    });
    expect(Math.abs(positions.heading - positions.container), `workflow introduction at ${width}px`).toBeLessThanOrEqual(1);
  }
});
