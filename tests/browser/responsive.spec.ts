import { expect, test, type Page } from '@playwright/test';
import { legalRoutes, primaryRoutes, supportingRoutes } from '../../src/data/routes';

const routes = [...primaryRoutes, ...supportingRoutes, ...legalRoutes];

async function expectNoHorizontalOverflow(page: Page, context: string) {
  const dimensions = await page.evaluate(() => ({
    content: document.documentElement.scrollWidth,
    viewport: window.innerWidth,
  }));
  expect(dimensions.content, `${context}: ${dimensions.content}px content / ${dimensions.viewport}px viewport`).toBeLessThanOrEqual(dimensions.viewport);
}

for (const width of [375, 768, 1024, 1440]) {
  test(`all routes fit the ${width}px viewport`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    for (const route of routes) {
      await page.goto(route.href);
      await expect(page.locator('main h1')).toBeVisible();
      await expectNoHorizontalOverflow(page, `${route.href} at ${width}px`);
    }
  });
}

test('320px supports every route, open navigation and selected project details', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 740 });
  for (const route of routes) {
    await page.goto(route.href);
    await expect(page.locator('main h1')).toBeVisible();
    await expectNoHorizontalOverflow(page, `${route.href} at 320px`);
  }

  await page.goto('/');
  await page.locator('[data-menu-toggle]').click();
  await expect(page.locator('[data-menu-toggle]')).toHaveAttribute('aria-expanded', 'true');
  await expect(page.locator('[data-mobile-menu]')).toBeVisible();
  await expectNoHorizontalOverflow(page, 'open mobile navigation');
  await page.keyboard.press('Escape');

  await page.goto('/proiecte/');
  const firstProject = page.locator('[data-project-list-controls] button').first();
  await firstProject.click();
  await expect(firstProject).toHaveAttribute('aria-pressed', 'true');
  await expect(page.locator('[data-project-story]:visible')).toHaveCount(1);
  await expectNoHorizontalOverflow(page, 'selected project on 320px');
});

test('200 percent text sizing preserves navigation, long headings and readable content', async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 900 });
  for (const route of routes) {
    await page.goto(route.href);
    await page.evaluate(() => {
      document.documentElement.style.fontSize = '200%';
    });
    await expect(page.locator('main h1')).toBeVisible();
    await expectNoHorizontalOverflow(page, `${route.href} at 200% text size`);
  }
});

test('small-screen validation errors, reduced motion and enquiry CTAs do not introduce overflow', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 812 });
  await page.emulateMedia({ reducedMotion: 'reduce' });

  await page.goto('http://127.0.0.1:4322/contact/?tip=service');
  await expect(page.locator('input[name="tip"][value="service"]')).toBeChecked();
  await page.getByRole('button', { name: 'Trimite solicitarea' }).click();
  await expect(page.locator('[data-error-summary]')).toBeVisible();
  await expectNoHorizontalOverflow(page, 'contact validation errors');
  await expect(page.locator('[data-reveal-pending]')).toHaveCount(0);

  await page.goto('/');
  await expect(page.locator('[data-reveal-pending]')).toHaveCount(0);
  await page.getByRole('link', { name: 'Proiectează un sistem', exact: true }).first().click();
  await expect(page).toHaveURL(/\/contact\/\?tip=instalare#formular$/);
  await expectNoHorizontalOverflow(page, 'installation enquiry after reduced-motion navigation');
});
