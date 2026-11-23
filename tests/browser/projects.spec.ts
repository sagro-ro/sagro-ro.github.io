import { expect, test } from '@playwright/test';
import { projects } from '../../src/data/projects';

test('project route presents documented stories, approximate locations, and map attribution', async ({ page }) => {
  const response = await page.goto('/proiecte/');
  expect(response?.status()).toBe(200);
  await expect(page.locator('main h1')).toHaveCount(1);
  const map = page.locator('[data-project-map]');
  await expect(map).toHaveAttribute('data-map-ready', 'true');
  await expect(map.locator('[data-project-story]')).toHaveCount(3);
  await expect(page.getByText(/Locațiile de pe hartă sunt aproximative, la nivel de județ/)).toBeVisible();
  await expect(page.getByRole('link', { name: /MapSVG.*Romania/i })).toHaveAttribute('href', 'https://mapsvg.com/maps/romania');
  await expect(page.getByRole('link', { name: /CC BY 4\.0/ })).toHaveAttribute('href', 'https://creativecommons.org/licenses/by/4.0/');
  for (const id of ['ro-cl', 'ro-il', 'ro-ct']) await expect(map.locator(`[data-county-id="${id}"]`)).toHaveCount(1);
  await expect(map.locator('.project-map__canvas > svg')).toHaveAttribute('aria-hidden', 'true');
  await expect(page.locator('html')).not.toContainText(/coordonate GPS|latitude|longitude/i);
  for (const project of projects) {
    await expect(page.locator(`#proiect-${project.slug}`)).toContainText(project.quote);
    await expect(page.locator(`#proiect-${project.slug} .project-source`)).toHaveAttribute('href', project.sourceUrl);
  }
});

test('map pins and project list synchronize keyboard selection without navigation', async ({ page }) => {
  await page.goto('/proiecte/');
  const map = page.locator('[data-project-map]');
  await expect(map).toHaveAttribute('data-map-ready', 'true');
  const initialUrl = page.url();
  for (const [index, project] of projects.entries()) {
    const pin = map.locator(`[data-map-controls] [data-project-slug="${project.slug}"]`);
    await pin.focus();
    await page.keyboard.press(index % 2 === 0 ? 'Enter' : 'Space');
    await expect(pin).toHaveAttribute('aria-pressed', 'true');
    await expect(map.locator(`[data-project-list-controls] [data-project-slug="${project.slug}"]`)).toHaveAttribute('aria-pressed', 'true');
    await expect(page.locator(`#proiect-${project.slug}`)).toBeVisible();
    await expect(map.locator('[data-project-story]:visible')).toHaveCount(1);
    await expect(map.locator('[data-map-status]')).toContainText(project.name);
    for (const other of projects.filter((candidate) => candidate.slug !== project.slug)) {
      await expect(map.locator(`[data-map-controls] [data-project-slug="${other.slug}"]`)).toHaveAttribute('aria-pressed', 'false');
    }
    const bounds = await pin.boundingBox();
    expect(bounds?.width).toBeGreaterThanOrEqual(44);
    expect(bounds?.height).toBeGreaterThanOrEqual(44);
    const style = await pin.getAttribute('style');
    const left = Number(/left:\s*([\d.]+)%/.exec(style ?? '')?.[1]);
    const top = Number(/top:\s*([\d.]+)%/.exec(style ?? '')?.[1]);
    expect(left).toBeGreaterThanOrEqual(0);
    expect(left).toBeLessThanOrEqual(100);
    expect(top).toBeGreaterThanOrEqual(0);
    expect(top).toBeLessThanOrEqual(100);
    expect(page.url()).toBe(initialUrl);
  }
  const last = projects.at(-1)!;
  await map.locator(`[data-project-list-controls] [data-project-slug="${last.slug}"]`).click();
  await expect(map.locator(`[data-map-controls] [data-project-slug="${last.slug}"]`)).toHaveAttribute('aria-pressed', 'true');
});

test('map badges never obstruct another marker pointer target', async ({ page }) => {
  await page.goto('/proiecte/');
  const map = page.locator('[data-project-map]');
  await expect(map).toHaveAttribute('data-map-ready', 'true');

  for (const project of projects) {
    const pin = map.locator(`[data-map-controls] [data-project-slug="${project.slug}"]`);
    await pin.click({ trial: true });
    await pin.click();
    await expect(pin).toHaveAttribute('aria-pressed', 'true');
    await expect(page.locator(`#proiect-${project.slug}`)).toBeVisible();
  }
});

test('small-screen map callouts keep every pointer target independently reachable', async ({ page }) => {
  for (const width of [320, 375]) {
    await page.setViewportSize({ width, height: 812 });
    await page.goto('/proiecte/');
    const map = page.locator('[data-project-map]');
    await expect(map).toHaveAttribute('data-map-ready', 'true');
    await page.addStyleTag({ content: 'astro-dev-toolbar { display: none !important; }' });

    for (const project of projects) {
      const pin = map.locator(`[data-map-controls] [data-project-slug="${project.slug}"]`);
      const bounds = await pin.boundingBox();
      expect(bounds?.width).toBeGreaterThanOrEqual(44);
      expect(bounds?.height).toBeGreaterThanOrEqual(44);
      await pin.click({ trial: true, timeout: 1_000 });
      await pin.click();
      await expect(pin).toHaveAttribute('aria-pressed', 'true');
      await expect(page.locator(`#proiect-${project.slug}`)).toBeVisible();
    }
  }
});

test('project stories remain readable without JavaScript', async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  await page.goto('/proiecte/');
  for (const project of projects) await expect(page.locator(`#proiect-${project.slug}`)).toBeVisible();
  await expect(page.locator('[data-map-controls]')).toBeHidden();
  await expect(page.locator('[data-project-list-controls]')).toBeHidden();
  await expect(page.getByText(/Nu reprezintă adresele exacte/)).toBeVisible();
  await context.close();
});

test('homepage uses the same accessible project map', async ({ page }) => {
  await page.goto('/');
  const preview = page.locator('[data-home-projects]');
  const map = preview.locator('[data-project-map]');
  await expect(map).toHaveAttribute('data-map-ready', 'true');
  await expect(map.locator('[data-project-story]')).toHaveCount(3);
  await expect(preview.locator('[data-project-preview]')).toHaveCount(3);
  await expect(preview.getByRole('link', { name: /Vezi proiectele/i })).toHaveAttribute('href', '/proiecte/');
});
