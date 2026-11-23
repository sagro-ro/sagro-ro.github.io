import { expect, test } from '@playwright/test';

test('dual journeys and native FAQs are operable', async ({ page }) => {
  await page.goto('/');
  const journeys = page.locator('[data-section="journeys"]');
  await expect(journeys.getByRole('link', { name: /Proiectează un sistem/ })).toHaveAttribute('href', '/contact/?tip=instalare#formular');
  await expect(journeys.getByRole('link', { name: /Solicită service/ })).toHaveAttribute('href', '/contact/?tip=service#formular');

  const firstFaq = page.locator('[data-faq] details').first();
  const summary = firstFaq.locator('summary');
  await summary.focus();
  await page.keyboard.press('Enter');
  await expect(firstFaq).toHaveAttribute('open', '');
  await expect(firstFaq.locator('.faq-answer')).toBeVisible();
  await page.keyboard.press('Enter');
  await expect(firstFaq).not.toHaveAttribute('open', '');
});

test('partner images retain provenance alternatives and four system art cards appear', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('[data-partners] img')).toHaveCount(3);
  const alternatives = await page.locator('[data-partners] img').evaluateAll((images) => images.map((image) => image.getAttribute('alt')));
  expect(alternatives).toEqual(['Zimmatic', 'Idrofoglia', 'Green Power']);
  await expect(page.locator('[data-system-item]')).toHaveCount(4);
  await expect(page.locator('[data-hero] img')).toBeVisible();
  expect(await page.locator('[data-hero] img').evaluate((image) => image.getAttribute('loading'))).toBe('eager');
});

test('reveal and FAQ content remains visible with reduced motion', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');
  for (const item of await page.locator('[data-reveal]').all()) {
    await expect(item).toHaveCSS('opacity', '1');
    await expect(item).toHaveCSS('transform', 'none');
  }
});

test('sections do not depend on JavaScript to render', async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  await page.goto('/');
  await expect(page.locator('[data-section="journeys"]')).toBeVisible();
  await expect(page.locator('[data-partners] img')).toHaveCount(3);
  expect(await page.locator('[data-reveal]').count()).toBeGreaterThan(0);
  await expect(page.locator('[data-reveal]').first()).toHaveCSS('opacity', '1');
  await context.close();
});
