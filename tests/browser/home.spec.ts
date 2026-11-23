import { expect, test } from '@playwright/test';

test('homepage presents equal irrigation journeys and the four primary systems', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('main h1')).toHaveCount(1);
  await expect(page.locator('main h1')).toHaveText('Apă acolo unde contează.');
  await expect(page.locator('main')).toContainText(/Proiectăm și instalăm sisteme de irigații/i);
  await expect(page.locator('main')).toContainText(/service și mentenanță/i);

  const systems = page.locator('[data-system-item]');
  await expect(systems).toHaveCount(4);
  await expect(systems.locator('h3')).toHaveText([
    'Pivoți centrali',
    'Sisteme liniare',
    'Sisteme cu tambur',
    'Pompare și alimentare',
  ]);

  const journeys = page.locator('[data-section="journeys"]');
  await expect(journeys.getByRole('link', { name: /Proiectează un sistem/ })).toHaveAttribute('href', '/contact/?tip=instalare#formular');
  await expect(journeys.getByRole('link', { name: /Solicită service/ })).toHaveAttribute('href', '/contact/?tip=service#formular');
  await expect(page.locator('.process__steps > li')).toHaveCount(4);
  await expect(page.locator('[data-partners] img')).toHaveCount(3);
});

test('homepage previews only documented work and answers practical enquiry questions', async ({ page }) => {
  await page.goto('/');
  const preview = page.locator('[data-home-projects]');
  await expect(preview).toBeVisible();
  await expect(preview.locator('[data-project-preview]')).toHaveCount(3);
  await expect(preview).toContainText('Județul Călărași');
  await expect(preview).toContainText('Județul Ialomița');
  await expect(preview).toContainText('Județul Constanța');
  await expect(preview.getByRole('link', { name: /Vezi proiectele/i })).toHaveAttribute('href', '/proiecte/');

  const faq = page.locator('[data-faq]');
  await expect(faq.locator('details').count()).resolves.toBeGreaterThanOrEqual(3);
  await expect(faq).toContainText(/forma parcelei/i);
  await expect(faq).toContainText(/cultur/i);
  await expect(faq).toContainText(/sursa de apă/i);
  await expect(faq).toContainText(/electric|energie/i);
  await expect(faq).toContainText(/după instalare/i);
  await expect(page.locator('main')).not.toContainText(/ani de experiență|clienți mulțumiți|recenzii stele|\d+% economie/i);
});
