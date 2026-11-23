import { expect, test } from '@playwright/test';

test('desktop shell exposes Romanian landmarks, navigation, and real contacts', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('html')).toHaveAttribute('lang', 'ro');
  await expect(page.getByRole('link', { name: 'Sari la conținut' })).toHaveAttribute('href', '#continut');
  await expect(page.locator('main h1')).toHaveCount(1);
  await expect(page.getByRole('main')).toHaveAttribute('id', 'continut');

  const navigation = page.getByRole('navigation', { name: 'Navigație principală' });
  await expect(navigation.getByRole('link')).toHaveText([
    'Acasă',
    'Sisteme de irigații',
    'Service și mentenanță',
    'Proiecte',
    'Contact',
  ]);
  await expect(navigation.getByRole('link', { name: 'Acasă' })).toHaveAttribute('aria-current', 'page');
  await expect(page.locator('[data-brand]').first()).toBeVisible();
  const footer = page.getByRole('contentinfo');
  await expect(footer.getByRole('link', { name: '+40 762 910 030', exact: true })).toHaveAttribute('href', 'tel:+40762910030');
  await expect(footer.getByRole('link', { name: 'contact@sagro.ro', exact: true })).toHaveAttribute('href', 'mailto:contact@sagro.ro');
  await expect(page.getByRole('button', { name: 'Deschide meniul' })).toBeHidden();
});

test('mobile menu opens, closes with Escape, restores focus, and navigates', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto('/');
  const toggle = page.locator('[data-menu-toggle]');
  await expect(toggle).toHaveAccessibleName('Deschide meniul');
  await expect(toggle).toBeVisible();
  await toggle.focus();
  await page.keyboard.press('Enter');
  await expect(toggle).toHaveAttribute('aria-expanded', 'true');
  await expect(page.locator('body')).toHaveCSS('overflow', 'hidden');
  await expect(page.locator('[data-mobile-menu]')).toBeVisible();

  await page.keyboard.press('Escape');
  await expect(toggle).toHaveAttribute('aria-expanded', 'false');
  await expect(toggle).toBeFocused();
  await expect(page.locator('[data-mobile-menu]')).toBeHidden();
  expect(await page.locator('body').evaluate((body) => body.style.overflow)).toBe('');

  await toggle.click();
  const mobileMenu = page.locator('[data-mobile-menu]');
  await mobileMenu.getByRole('link', { name: 'Sisteme de irigații', exact: true }).click();
  await expect(page).toHaveURL(/\/sisteme-irigatii\/$/);
  // Detail routes arrive in Task 5; return to the real shell to verify reset after navigation.
  await page.goto('/');
  await expect(page.locator('[data-menu-toggle]')).toHaveAttribute('aria-expanded', 'false');
  await page.keyboard.press('Tab');
  await expect(page.getByRole('link', { name: 'Sari la conținut' })).toBeFocused();
});

test('opening the mobile menu twice does not leave duplicate state', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto('/');
  const toggle = page.locator('[data-menu-toggle]');
  for (let index = 0; index < 2; index += 1) {
    await toggle.click();
    await expect(toggle).toHaveAttribute('aria-expanded', 'true');
    await page.keyboard.press('Escape');
    await expect(toggle).toHaveAttribute('aria-expanded', 'false');
  }
});
