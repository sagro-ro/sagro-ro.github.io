import { expect, test } from '@playwright/test';

const legacyRedirects = [
  ['/pages/sisteme-irigatii/', '/sisteme-irigatii/'],
  ['/pages/service/', '/service-mentenanta/'],
  ['/pages/contact/', '/contact/'],
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
