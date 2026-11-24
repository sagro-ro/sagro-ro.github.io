import { expect, test } from '@playwright/test';

const legacyRedirects = [
  ['/pages/sisteme-irigatii/', '/sisteme-irigatii/'],
  ['/pages/contact/', '/contact/'],
  ['/policies/privacy-policy/', '/politica-confidentialitate/'],
  ['/pages/despre-noi/', '/sisteme-irigatii/'],
  ['/products/sisteme-irigatii-zimmatic/', '/sisteme-irigatii/'],
  ['/products/sisteme-idrofoglia/', '/sisteme-irigatii/'],
  ['/products/generatoare-green-power/', '/sisteme-irigatii/'],
] as const;

test.use({ baseURL: 'http://127.0.0.1:4324' });

test.describe('static GitHub Pages legacy fallbacks', () => {
  test('reach the actual irrigation journeys with query and fragment intact', async ({ page }) => {
    for (const [legacyPath, targetPath] of legacyRedirects) {
      await page.goto(`${legacyPath}?sursa=legacy#detalii`);
      await expect.poll(() => new URL(page.url()).pathname).toBe(targetPath);
      await expect(page).toHaveURL(/\?sursa=legacy#detalii$/);
      await expect(page.locator('main h1')).toBeVisible();
      await expect(page.locator('html')).toHaveAttribute('lang', 'ro');
    }
  });

  test('does not redirect non-equivalent or undocumented routes to irrigation service', async ({ page }) => {
    for (const path of ['/pages/service/', '/pages/irigatii/']) {
      const response = await page.goto(path);
      expect(response?.status()).toBe(404);
      await expect(page.locator('main h1')).toContainText(/nu a fost găsită/i);
      expect(new URL(page.url()).pathname).toBe(path);
    }
  });

  test('recovery metadata points to its generated noindex document', async ({ page }) => {
    const response = await page.goto('/pages/service/');
    expect(response?.status()).toBe(404);
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', 'https://sagro.ro/404.html');
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', 'noindex, nofollow');
    const canonicalDocument = await page.request.get('/404.html');
    expect(canonicalDocument.status()).toBe(200);
  });

  test('meta refresh retains access when JavaScript is disabled', async ({ browser }) => {
    const context = await browser.newContext({ javaScriptEnabled: false });
    const page = await context.newPage();
    try {
      await page.goto('/pages/sisteme-irigatii/');
      await expect(page).toHaveURL(/\/sisteme-irigatii\/$/);
      await expect(page.locator('main h1')).toBeVisible();
      await expect(page.getByRole('navigation', { name: 'Navigație principală' })).toBeVisible();
    } finally {
      await context.close();
    }
  });
});
