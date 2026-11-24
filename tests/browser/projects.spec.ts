import { expect, test } from '@playwright/test';
import { projectEvidence } from '../../src/data/project-evidence';
import { projects } from '../../src/data/projects';

const historicalNote = 'Relatăre istorică publicată de Sagro, revizuită la 12 noiembrie 2026. Formulările temporale redau materialul istoric, nu o actualizare automată.';

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
    await expect(page.locator(`#proiect-${project.slug} .project-source`)).not.toHaveAttribute('target', '_blank');
  }
});

test('project provenance presents dated owner-published evidence and links back to each story', async ({ page }) => {
  const response = await page.goto('/surse-proiecte/');
  expect(response?.status()).toBe(200);
  const content = page.locator('main');
  await expect(content).toContainText(projectEvidence.reviewedAtLabel);
  await expect(content).toContainText(/publicate? de Sagro/);
  await expect(content).toContainText('nu este o verificare independentă');
  await expect(content).toContainText(/două sezoane.*material(?:ul|ului) istoric|material(?:ul|ului) istoric.*două sezoane/is);
  await expect(content).not.toContainText(/Poiana Mare|Predești|Craiova|coordonate GPS|latitude|longitude|hectare instalate|\d+% economii/i);

  const historicalLink = content.locator('section').first().getByRole('link', { name: 'fosta pagină Sagro despre irigații', exact: true });
  await expect(historicalLink).toHaveAttribute('href', projectEvidence.historicalUrl);
  await expect(content.locator('[data-project-evidence]')).toHaveCount(3);

  for (const project of projects) {
    const evidence = content.locator(`#sursa-${project.slug}`);
    await expect(evidence).toHaveAttribute('data-project-evidence', '');
    await expect(evidence).toContainText(project.countyLabel);
    await expect(evidence).toContainText(project.clientLabel);
    await expect(evidence).toContainText(project.systemLabel);
    await expect(evidence).toContainText(project.name);
    await expect(evidence).toContainText(project.summary);
    await expect(evidence).toContainText(project.quote);
    const backlink = evidence.getByRole('link', { name: 'Vezi proiectul în hartă', exact: true });
    await expect(backlink).toHaveAttribute('href', `/proiecte/#proiect-${project.slug}`);
    const target = await page.request.get('/proiecte/');
    expect(target.status()).toBe(200);
  }
});

test('project source links keep provenance and historical limits in view', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 812 });
  for (const project of projects) {
    await page.goto(`/proiecte/#proiect-${project.slug}`);
    await expect(page.locator('[data-project-map]')).toHaveAttribute('data-map-ready', 'true');
    await page.locator(`#proiect-${project.slug} .project-source`).click();
    await expect(page).toHaveURL(`/surse-proiecte/#sursa-${project.slug}`);
    const context = page.locator(`#sursa-${project.slug} [data-project-evidence-context]`);
    await expect(context).toBeInViewport();
    await expect(context).toContainText(historicalNote);
    await expect(context).toContainText('nu este o verificare independentă');
    await expect(context).toContainText('la nivel de județ');
    await expect(context.getByRole('link', { name: 'fosta pagină Sagro despre irigații', exact: true })).toHaveAttribute('href', projectEvidence.historicalUrl);
  }
});

test('project cards qualify historical duration on homepage and project route', async ({ page }) => {
  for (const route of ['/', '/proiecte/']) {
    await page.goto(route);
    const map = page.locator('[data-project-map]');
    await expect(map).toHaveAttribute('data-map-ready', 'true');
    for (const project of projects) {
      await map.locator(`[data-project-list-controls] [data-project-slug="${project.slug}"]`).click();
      const history = page.locator(`#proiect-${project.slug} [data-project-history]`);
      await expect(history).toHaveText(historicalNote);
      await history.scrollIntoViewIfNeeded();
      await expect(history).toBeInViewport();
    }
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

for (const project of projects.slice(1)) {
  test(`direct project fragment selects ${project.slug} and brings it into view`, async ({ page }) => {
    await page.goto(`/proiecte/#proiect-${project.slug}`);
    const map = page.locator('[data-project-map]');
    const story = page.locator(`#proiect-${project.slug}`);
    await expect(map).toHaveAttribute('data-map-ready', 'true');
    await expect(story).toBeVisible();
    await expect(map.locator('[data-project-story]:visible')).toHaveCount(1);
    await expect(story).toBeInViewport();
    await expect(map.locator(`[data-map-controls] [data-project-slug="${project.slug}"]`)).toHaveAttribute('aria-pressed', 'true');
    await expect(map.locator(`[data-project-list-controls] [data-project-slug="${project.slug}"]`)).toHaveAttribute('aria-pressed', 'true');
  });
}

test('mobile project fragments keep story locations below the sticky header', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.setViewportSize({ width: 375, height: 812 });
  for (const project of projects.slice(1)) {
    await page.goto(`/proiecte/#proiect-${project.slug}`);
    const story = page.locator(`#proiect-${project.slug}`);
    await expect(story).toBeVisible();
    await expect.poll(() => story.locator('.project-story__location').evaluate((location) => {
      const header = document.querySelector<HTMLElement>('.site-header');
      if (!header) throw new Error('Sticky site header is missing');
      return location.getBoundingClientRect().top - header.getBoundingClientRect().bottom;
    })).toBeGreaterThanOrEqual(0);
  }
});

test('project hash changes synchronize selection, status, visibility, and scrolling', async ({ page }) => {
  const [first, second, third] = projects;
  await page.goto(`/proiecte/#proiect-${second.slug}`);
  const map = page.locator('[data-project-map]');
  await expect(map).toHaveAttribute('data-map-ready', 'true');

  await page.evaluate((slug) => {
    window.location.hash = `proiect-${slug}`;
  }, third.slug);

  const story = page.locator(`#proiect-${third.slug}`);
  await expect(story).toBeVisible();
  await expect(map.locator('[data-project-story]:visible')).toHaveCount(1);
  await expect(story).toBeInViewport();
  await expect(map.locator('[data-map-status]')).toContainText(third.name);
  await expect(map.locator(`[data-map-controls] [data-project-slug="${third.slug}"]`)).toHaveAttribute('aria-pressed', 'true');
  await expect(map.locator(`[data-project-list-controls] [data-project-slug="${third.slug}"]`)).toHaveAttribute('aria-pressed', 'true');
  await expect(map.locator(`[data-map-controls] [data-project-slug="${first.slug}"]`)).toHaveAttribute('aria-pressed', 'false');
});

test('an unknown project fragment keeps the default without turning control clicks into navigation', async ({ page }) => {
  await page.goto('/proiecte/#proiect-necunoscut');
  const map = page.locator('[data-project-map]');
  const [first, , third] = projects;
  await expect(map).toHaveAttribute('data-map-ready', 'true');
  await expect(page.locator(`#proiect-${first.slug}`)).toBeVisible();
  await expect(map.locator('[data-project-story]:visible')).toHaveCount(1);
  const initialUrl = page.url();

  const control = map.locator(`[data-project-list-controls] [data-project-slug="${third.slug}"]`);
  await control.click();
  await expect(control).toHaveAttribute('aria-pressed', 'true');
  await expect(page.locator(`#proiect-${third.slug}`)).toBeVisible();
  expect(page.url()).toBe(initialUrl);
});

test('returning to an empty hash restores the first project story', async ({ page }) => {
  const [first, second] = projects;
  await page.goto('/proiecte/');
  const map = page.locator('[data-project-map]');
  await expect(map).toHaveAttribute('data-map-ready', 'true');

  await page.evaluate((slug) => {
    window.location.hash = `proiect-${slug}`;
  }, second.slug);
  await expect(page.locator(`#proiect-${second.slug}`)).toBeVisible();
  await expect(map.locator('[data-project-story]:visible')).toHaveCount(1);

  await page.goBack();
  await expect(page).toHaveURL(/\/proiecte\/$/);
  await expect(page.locator(`#proiect-${first.slug}`)).toBeVisible();
  await expect(map.locator('[data-project-story]:visible')).toHaveCount(1);
  await expect(map.locator(`[data-map-controls] [data-project-slug="${first.slug}"]`)).toHaveAttribute('aria-pressed', 'true');
  await expect(map.locator(`[data-project-list-controls] [data-project-slug="${first.slug}"]`)).toHaveAttribute('aria-pressed', 'true');
});

test('map cleanup removes fragment listeners and restores static content', async ({ page }) => {
  await page.goto('/proiecte/');
  const map = page.locator('[data-project-map]');
  await expect(map).toHaveAttribute('data-map-ready', 'true');

  await page.evaluate(async (modulePath) => {
    const { initProjectMap } = await import(modulePath) as typeof import('../../src/scripts/project-map');
    const root = document.querySelector<HTMLElement>('[data-project-map]');
    if (!root) throw new Error('Project map root is missing');
    const cleanup = initProjectMap(root);
    cleanup();
  }, '/src/scripts/project-map.ts');

  await expect(map.locator('[data-map-controls]')).toBeHidden();
  await expect(map.locator('[data-project-list-controls]')).toBeHidden();
  expect(await map.getAttribute('data-map-ready')).toBeNull();
  for (const project of projects) await expect(page.locator(`#proiect-${project.slug}`)).toBeVisible();

  await page.evaluate(async (slug) => {
    await new Promise<void>((resolve) => {
      const finishAfterHashChange = () => {
        window.removeEventListener('hashchange', finishAfterHashChange);
        requestAnimationFrame(() => requestAnimationFrame(() => resolve()));
      };
      window.addEventListener('hashchange', finishAfterHashChange);
      window.location.hash = `proiect-${slug}`;
    });
  }, projects[1].slug);

  for (const project of projects) await expect(page.locator(`#proiect-${project.slug}`)).toBeVisible();
  await expect(map.locator('button[data-project-slug][aria-pressed="true"]')).toHaveCount(0);
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
