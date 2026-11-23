import { expect, test } from '@playwright/test';

const forbiddenMachineryClaims = /9 ani|6–12 luni garanție|\bCase\b|New Holland|Steyr/i;

test('systems route describes four irrigation approaches and selection factors', async ({ page }) => {
  const response = await page.goto('/sisteme-irigatii/');
  expect(response?.status()).toBe(200);
  await expect(page.locator('main h1')).toHaveCount(1);
  await expect(page.locator('main h1')).toContainText(/irigare|irigații/i);
  const content = page.getByRole('main');
  for (const text of [
    'Pivoți centrali',
    'Sisteme liniare',
    'Sisteme cu tambur',
    'Pompare și alimentare',
    'grup electrogen',
    'suprafața',
    'forma parcelei',
    'cultura',
    'sursa de apă',
    'condițiile de teren',
    'energia electrică',
  ]) {
    await expect(content).toContainText(new RegExp(text, 'i'));
  }
  await expect(page.locator('[data-offering-key]')).toHaveCount(4);
  await expect(page.locator('[data-offer-cta="instalare"] a').first()).toHaveAttribute('href', '/contact/?tip=instalare#formular');
  await expect(page.locator('[data-service-link]')).toHaveAttribute('href', '/service-mentenanta/');
  await expect(content).not.toContainText(forbiddenMachineryClaims);
});

test('service route has a distinct irrigation-maintenance workflow', async ({ page }) => {
  const response = await page.goto('/service-mentenanta/');
  expect(response?.status()).toBe(200);
  await expect(page.locator('main h1')).toContainText(/Service.*iriga/i);
  const content = page.getByRole('main');
  for (const text of [
    'service',
    'mentenanță',
    'verificări periodice',
    'intervenții tehnice',
    'suport specializat',
    'diagnostic',
    'pregătirea sezonului',
    'evaluare',
  ]) {
    await expect(content).toContainText(new RegExp(text, 'i'));
  }
  await expect(page.locator('[data-service-step]')).toHaveCount(4);
  await expect(page.locator('[data-offer-cta="service"] a').first()).toHaveAttribute('href', '/contact/?tip=service#formular');
  await expect(page.locator('[data-systems-link]')).toHaveAttribute('href', '/sisteme-irigatii/');
  await expect(content).not.toContainText(forbiddenMachineryClaims);
});

test('offering routes have unique titles and descriptions', async ({ page }) => {
  const metadata: Array<{ title: string; description: string }> = [];
  for (const route of ['/sisteme-irigatii/', '/service-mentenanta/']) {
    await page.goto(route);
    await expect(page).toHaveTitle(/Sagro/i);
    const description = page.locator('meta[name="description"]');
    await expect(description).toHaveAttribute('content', /.{40,}/);
    metadata.push({ title: await page.title(), description: await description.getAttribute('content') ?? '' });
  }
  expect(new Set(metadata.map((item) => item.title)).size).toBe(2);
  expect(new Set(metadata.map((item) => item.description)).size).toBe(2);
});
