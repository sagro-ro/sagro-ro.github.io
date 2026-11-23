import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';
import { legalRoutes, primaryRoutes } from '../../src/data/routes';

const routes = [...primaryRoutes, ...legalRoutes];

for (const viewport of [
  { name: 'desktop', width: 1440, height: 900 },
  { name: 'mobile', width: 375, height: 812 },
]) {
  for (const route of routes) {
    test(`@a11y ${viewport.name} ${route.href} has no serious or critical axe violations`, async ({ page }) => {
      await page.setViewportSize(viewport);
      await page.goto(route.href);
      const results = await new AxeBuilder({ page })
        .include('header')
        .include('main')
        .include('footer')
        .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
        .analyze();
      const violations = results.violations
        .filter((violation) => violation.impact === 'serious' || violation.impact === 'critical')
        .map((violation) => ({
          id: violation.id,
          impact: violation.impact,
          description: violation.help,
          targets: violation.nodes.map((node) => node.target),
        }));

      expect(violations).toEqual([]);
    });
  }
}

test('@a11y open mobile navigation has no serious or critical axe violations', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto('/');
  await page.locator('[data-menu-toggle]').click();
  await expect(page.locator('[data-mobile-menu]')).toBeVisible();
  const results = await new AxeBuilder({ page })
    .include('header')
    .include('[data-mobile-menu]')
    .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
    .analyze();
  const violations = results.violations
    .filter((violation) => violation.impact === 'serious' || violation.impact === 'critical')
    .map((violation) => ({ id: violation.id, targets: violation.nodes.map((node) => node.target) }));

  expect(violations).toEqual([]);
});

test('skip link is the first keyboard stop and has a visible focus indicator', async ({ page }) => {
  await page.goto('/');
  await page.keyboard.press('Tab');
  const skipLink = page.getByRole('link', { name: 'Sari la conținut', exact: true });
  await expect(skipLink).toBeFocused();
  await expect(skipLink).toBeInViewport();
  const outlineWidth = await skipLink.evaluate((link) => getComputedStyle(link).outlineWidth);
  expect(Number.parseFloat(outlineWidth)).toBeGreaterThanOrEqual(2);

  await page.keyboard.press('Enter');
  await expect(page.locator('main#continut')).toBeFocused();
});

test('content images retain explicit meaningful alternatives', async ({ page }) => {
  for (const route of routes) {
    await page.goto(route.href);
    const alternatives = await page.locator('main img, header img, footer img').evaluateAll((images) =>
      images.map((image) => image.getAttribute('alt')),
    );
    expect(alternatives.every((alt) => alt !== null && alt.trim().length > 0), route.href).toBe(true);
  }
});

test('standalone shell and menu links retain 44px touch targets', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto('/');
  const shellLinks = page.locator('.footer-links a, .footer-contact a, .footer-legal__links a');
  expect(await shellLinks.count()).toBeGreaterThan(0);
  const shellSizes = await shellLinks.evaluateAll((links) => links.map((link) => {
    const bounds = link.getBoundingClientRect();
    return { text: link.textContent?.trim(), width: bounds.width, height: bounds.height };
  }));
  expect(shellSizes.filter(({ width, height }) => width < 44 || height < 44)).toEqual([]);

  await page.locator('[data-menu-toggle]').click();
  const menuLinks = page.locator('.mobile-menu__contact a');
  expect(await menuLinks.count()).toBeGreaterThan(0);
  const menuSizes = await menuLinks.evaluateAll((links) => links.map((link) => {
    const bounds = link.getBoundingClientRect();
    return { text: link.textContent?.trim(), width: bounds.width, height: bounds.height };
  }));
  expect(menuSizes.filter(({ width, height }) => width < 44 || height < 44)).toEqual([]);
});

test('form error summary and map selection remain keyboard accessible', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 740 });
  await page.goto('/proiecte/');
  const projectButton = page.locator('[data-project-list-controls] button').first();
  await projectButton.focus();
  await expect(projectButton).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(projectButton).toHaveAttribute('aria-pressed', 'true');
  await expect(page.locator('[data-project-story]:visible')).toHaveCount(1);

  await page.goto('http://127.0.0.1:4322/contact/');
  await page.getByRole('button', { name: 'Trimite solicitarea' }).focus();
  await page.keyboard.press('Enter');
  await expect(page.locator('[data-error-summary]')).toBeFocused();
  await expect(page.locator('[data-error-summary]')).toContainText(/Nume și prenume/i);
  await page.keyboard.press('Tab');
  await expect(page.locator('input[name="tip"]:checked')).toBeFocused();
});
