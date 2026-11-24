import { expect, test } from '@playwright/test';
import { legalRoutes, primaryRoutes, supportingRoutes } from '../../src/data/routes';
import { site } from '../../src/data/site';

const indexedRoutes = [...primaryRoutes, ...supportingRoutes, ...legalRoutes];

test('indexed content and legal pages have unique Romanian metadata and valid shell contacts', async ({ page }) => {
  const titles = new Set<string>();
  const descriptions = new Set<string>();

  for (const route of indexedRoutes) {
    const response = await page.goto(route.href);
    expect(response?.status(), route.href).toBe(200);
    await expect(page.locator('html')).toHaveAttribute('lang', 'ro');
    await expect(page.locator('main h1')).toHaveText(/\S/);

    const title = await page.title();
    const description = await page.locator('meta[name="description"]').getAttribute('content') ?? '';
    expect(title.length, route.href).toBeGreaterThan(12);
    expect(description.length, route.href).toBeGreaterThan(40);
    expect(titles.has(title), `duplicate title: ${title}`).toBe(false);
    expect(descriptions.has(description), `duplicate description on ${route.href}`).toBe(false);
    titles.add(title);
    descriptions.add(description);

    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', `https://sagro.ro${route.href}`);
    await expect(page.locator('meta[property="og:url"]')).toHaveAttribute('content', `https://sagro.ro${route.href}`);
    await expect(page.locator('meta[property="og:title"]')).toHaveAttribute('content', title);
    await expect(page.locator('header a[href="/"]').first()).toBeVisible();
    await expect(page.locator('footer').getByRole('link', { name: site.phoneDisplay, exact: true })).toHaveAttribute('href', site.phoneHref);
    await expect(page.locator('footer').getByRole('link', { name: site.email, exact: true })).toHaveAttribute('href', site.emailHref);
  }
});

test('four routes have exact unique titles without a duplicate Sagro suffix', async ({ page }) => {
  const expectedTitles = {
    '/sisteme-irigatii/': 'Sisteme de irigații proiectate pentru terenul fermei | Sagro Irigații',
    '/service-mentenanta/': 'Service și mentenanță pentru echipamente de irigații | Sagro Irigații',
    '/proiecte/': 'Localități cu implementări de irigații în România | Sagro Irigații',
    '/contact/': 'Contact pentru sisteme de irigații și service | Sagro Irigații',
  } as const;
  const titles: string[] = [];

  for (const [route, expectedTitle] of Object.entries(expectedTitles)) {
    await page.goto(route);
    const title = await page.title();
    titles.push(title);
    expect.soft(title, `${route} must not duplicate the brand suffix`).not.toContain('| Sagro |');
    expect.soft(title, route).toBe(expectedTitle);
  }
  expect(new Set(titles).size).toBe(titles.length);
});

test('LocalBusiness JSON-LD uses verified facts without unsupported business claims', async ({ page }) => {
  await page.goto('/');
  const scripts = page.locator('script[type="application/ld+json"]');
  await expect(scripts).toHaveCount(1);
  const schema = JSON.parse(await scripts.textContent() ?? 'null');

  expect(schema).toMatchObject({
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: site.name,
    legalName: site.legalName,
    telephone: site.phoneDisplay,
    email: site.email,
    url: 'https://sagro.ro/',
  });
  expect(schema.address).toEqual({
    '@type': 'PostalAddress',
    streetAddress: 'Str. Primăverii 161',
    addressLocality: 'Poiana Mare',
    addressRegion: 'Dolj',
    addressCountry: 'RO',
  });
  expect(schema.address).not.toHaveProperty('postalCode');
  expect(schema.address).not.toHaveProperty('geo');
  expect(schema).not.toHaveProperty('aggregateRating');
  expect(schema).not.toHaveProperty('review');
  expect(schema).not.toHaveProperty('geo');
  expect(schema).not.toHaveProperty('sameAs');
  expect(schema).not.toHaveProperty('openingHours');
});

test('production sitemap and robots refer to the same canonical origin', async ({ request }) => {
  const sitemap = await request.get('/sitemap.xml');
  expect(sitemap.status()).toBe(200);
  expect(sitemap.headers()['content-type']).toContain('xml');
  const xml = await sitemap.text();
  const locations = [...xml.matchAll(/<loc>(.*?)<\/loc>/g)].map((match) => match[1]);

  expect(locations).toHaveLength(indexedRoutes.length);
  expect(new Set(locations).size).toBe(locations.length);
  for (const route of indexedRoutes) {
    expect(locations).toContain(`https://sagro.ro${route.href}`);
  }
  expect(locations.some((url) => url.includes('404'))).toBe(false);
  expect(locations.some((url) => url.endsWith('/llms.txt'))).toBe(false);

  const robots = await request.get('/robots.txt');
  expect(robots.status()).toBe(200);
  const robotsText = await robots.text();
  expect(robotsText).toMatch(/User-agent:\s*\*/i);
  expect(robotsText).toMatch(/Allow:\s*\//i);
  expect(robotsText).toContain('Sitemap: https://sagro.ro/sitemap.xml');
});

test('curated llms text uses plain-text responses without unsupported claims or statistics', async ({ request }) => {
  const response = await request.get('/llms.txt');
  expect(response.status()).toBe(200);
  expect(response.headers()['content-type']).toBe('text/plain; charset=utf-8');
  const content = await response.text();

  expect(content).toContain('# Sagro Irigații');
  expect(content).toContain('Formularul online nu este conectat');
  expect(content).not.toMatch(/\b\d+%|\b\d+\+?\s+(?:proiecte|clienți|ani|instalații)/i);
  expect(content).not.toMatch(/dealer autorizat|partener autorizat|certificat|acreditat|garan[țt]ie|recomand|indexare garantată|răspuns garantat|acoperire națională|mesaj trimis/i);
});

test('static-host rules list only seven reviewed relevant legacy mappings', async ({ request }) => {
  const response = await request.get('/_redirects');
  expect(response.status()).toBe(200);
  const rules = (await response.text()).split('\n').map((line) => line.trim()).filter((line) => line && !line.startsWith('#'));

  expect(rules).toEqual([
    '/pages/sisteme-irigatii /sisteme-irigatii/ 301',
    '/pages/contact /contact/ 301',
    '/policies/privacy-policy /politica-confidentialitate/ 301',
    '/pages/despre-noi /sisteme-irigatii/ 301',
    '/products/sisteme-irigatii-zimmatic /sisteme-irigatii/ 301',
    '/products/sisteme-idrofoglia /sisteme-irigatii/ 301',
    '/products/generatoare-green-power /sisteme-irigatii/ 301',
  ]);
});

test('privacy text describes local media, bundled maps, direct contact and honest form delivery', async ({ page }) => {
  await page.goto('/politica-confidentialitate/');
  const content = page.locator('main');
  await expect(content).toContainText(/nu folosim instrumente de analiză/i);
  await expect(content).toContainText(/stocate local|servite local/i);
  await expect(content).toContainText(/geometria hărții|geometrie.*local/i);
  await expect(content).toContainText(/aplicația de telefon|aplicația de e-mail/i);
  await expect(content).toContainText(/nu este conectat/i);
  await expect(content).toContainText(/nume/i);
  await expect(content).toContainText(/telefon/i);
  await expect(content).toContainText(/mesaj/i);
  await expect(content).toContainText(/doar dacă|numai dacă/i);
  await expect(content.getByRole('link', { name: site.email, exact: true })).toHaveAttribute('href', site.emailHref);
});

test('terms stay informational rather than promising service or sales terms', async ({ page }) => {
  await page.goto('/termeni-conditii/');
  const content = page.locator('main');
  await expect(content).toContainText(/informații generale/i);
  await expect(content).toContainText(/ofertă|configurație/i);
  await expect(content).not.toContainText(/6–12 luni garanție|livrare gratuită|returnare în \d+ zile/i);
  await expect(content).toContainText('Localități cu implementări Sagro. Marcajele grupează implementările pe județe.');
  await expect(content).not.toContainText(/furnizate pentru această actualizare|revizuit\w* editorial|nu este o verificare independentă|singurele locuri furnizate/i);
  await expect(content).toContainText('24 noiembrie 2026');
  await expect(content).not.toContainText(/Cele trei exemple publicate|proiectele documentate de/i);
});

test('unknown routes return a noindex Romanian recovery page with useful navigation', async ({ page }) => {
  const response = await page.goto('/pagina-care-nu-exista/');
  expect(response?.status()).toBe(404);
  await expect(page.locator('main h1')).toContainText(/nu a fost găsită/i);
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', 'noindex, nofollow');
  await expect(page.locator('main a[href="/"]')).toBeVisible();
  await expect(page.locator('main a[href="/sisteme-irigatii/"]')).toBeVisible();
  await expect(page.locator('main a[href="/service-mentenanta/"]')).toBeVisible();
  await expect(page.locator('main a[href="/contact/"]')).toBeVisible();
});

test('footer workflow link reaches its real section', async ({ page }) => {
  await page.goto('/sisteme-irigatii/');
  await page.locator('footer').getByRole('link', { name: 'Cum lucrăm', exact: true }).click();
  await expect(page).toHaveURL(/\/sisteme-irigatii\/#proces$/);
  await expect(page.locator('#proces')).toBeInViewport();
});

test('project map retains exact source and Creative Commons attribution', async ({ page }) => {
  await page.goto('/proiecte/');
  const attribution = page.locator('.project-map__notes');
  await expect(attribution).toContainText('MapSVG');
  await expect(attribution).toContainText('CC BY 4.0');
  await expect(attribution.getByRole('link', { name: 'MapSVG Romania map', exact: true })).toHaveAttribute('href', 'https://mapsvg.com/maps/romania');
  await expect(attribution.getByRole('link', { name: 'CC BY 4.0', exact: true })).toHaveAttribute('href', 'https://creativecommons.org/licenses/by/4.0/');
});
