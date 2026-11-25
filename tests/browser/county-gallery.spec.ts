import { expect, test, type Page } from '@playwright/test';

test.use({ actionTimeout: 7_000 });

function oltGallery(page: Page) {
  return page.locator('[data-county-gallery="olt"]');
}

async function openFirstPhoto(page: Page) {
  await page.goto('/surse-proiecte/#sursa-olt');
  const opener = oltGallery(page).locator('[data-gallery-open]').first();
  await opener.focus();
  await page.keyboard.press('Enter');
  return opener;
}

test('associates only the two uncropped, locally optimized photographs with Olt', async ({ page }) => {
  await page.goto('http://127.0.0.1:4324/surse-proiecte/#sursa-olt');

  await expect(page.locator('[data-county-gallery]')).toHaveCount(1);
  const gallery = oltGallery(page);
  await expect(gallery).toHaveCount(1);
  await expect(page.locator('#sursa-olt [data-county-gallery]')).toHaveCount(1);
  await expect(gallery.getByRole('heading', { name: 'Fotografii din județul Olt' })).toBeVisible();

  const openers = gallery.locator('[data-gallery-open]');
  await expect(openers).toHaveCount(2);
  await expect(gallery.locator('img').first()).toHaveJSProperty('complete', true);
  const expected = [
    { name: 'olt1', width: '1600', height: '1200' },
    { name: 'olt2', width: '1200', height: '1600' },
  ];
  for (const [index, photo] of expected.entries()) {
    const opener = openers.nth(index);
    const thumbnail = opener.locator('img');
    const href = await opener.getAttribute('href');
    expect(href, `optimized public URL for ${photo.name}`).toMatch(new RegExp(`^/_astro/${photo.name}\\..+\\.webp(?:\\?.*)?$`));
    await expect(thumbnail).toHaveAttribute('width', photo.width);
    await expect(thumbnail).toHaveAttribute('height', photo.height);
    await expect.poll(() => thumbnail.evaluate((image: HTMLImageElement) => image.naturalWidth)).toBeGreaterThan(0);
    await expect(thumbnail).toHaveAttribute('alt', /județul Olt/);
  }
  await expect(gallery).not.toContainText(/Corabia|adresa|coordonate|hectare|rezultate măsurate/i);
});

test('opens a labelled dialog from the keyboard with the selected photo and counter', async ({ page }) => {
  const opener = await openFirstPhoto(page);
  const dialog = oltGallery(page).getByRole('dialog', { name: 'Galerie foto din județul Olt' });
  await expect(dialog).toBeVisible();
  await expect(dialog.locator('[data-gallery-counter]')).toHaveText('1 / 2');
  await expect(dialog.locator('[data-gallery-slide]:visible')).toHaveCount(1);
  await expect(dialog.locator('[data-gallery-slide]:visible img')).toHaveAttribute('alt', /Pivot.*județul Olt/);
  await expect(dialog.getByRole('button', { name: 'Închide galeria' })).toBeFocused();
  await expect(opener).not.toBeFocused();
});

test('cycles through each county gallery using its actual photo count', async ({ page }) => {
  await openFirstPhoto(page);
  const gallery = oltGallery(page);
  const dialog = gallery.getByRole('dialog');
  const next = dialog.getByRole('button', { name: 'Fotografia următoare' });
  await next.click();
  await expect(dialog.locator('[data-gallery-counter]')).toHaveText('2 / 2');
  await expect(dialog.locator('[data-gallery-slide]:visible img')).toHaveAttribute('alt', /Conducte.*județul Olt/);
  await next.click();
  await expect(dialog.locator('[data-gallery-counter]')).toHaveText('1 / 2');
  await page.keyboard.press('ArrowLeft');
  await expect(dialog.locator('[data-gallery-counter]')).toHaveText('2 / 2');
  await page.keyboard.press('ArrowRight');
  await expect(dialog.locator('[data-gallery-counter]')).toHaveText('1 / 2');
});

test('Escape restores focus to the originating thumbnail', async ({ page }) => {
  await page.goto('/surse-proiecte/#sursa-olt');
  const opener = oltGallery(page).locator('[data-gallery-open]').nth(1);
  await opener.focus();
  await page.keyboard.press('Enter');
  const dialog = oltGallery(page).getByRole('dialog');
  await expect(dialog.locator('[data-gallery-counter]')).toHaveText('2 / 2');
  await page.keyboard.press('Escape');
  await expect(dialog).not.toBeVisible();
  await expect(opener).toBeFocused();
  await expect(page).toHaveURL(/\/surse-proiecte\/#sursa-olt$/);
});

test('close button and backdrop both dismiss the viewer', async ({ page }) => {
  await openFirstPhoto(page);
  const dialog = oltGallery(page).getByRole('dialog');
  await dialog.getByRole('button', { name: 'Închide galeria' }).click();
  await expect(dialog).not.toBeVisible();
  await expect(oltGallery(page).locator('[data-gallery-open]').first()).toBeFocused();

  await oltGallery(page).locator('[data-gallery-open]').first().click();
  await expect(dialog).toBeVisible();
  await page.mouse.click(1, 1);
  await expect(dialog).not.toBeVisible();
  await expect(oltGallery(page).locator('[data-gallery-open]').first()).toBeFocused();

  await oltGallery(page).locator('[data-gallery-open]').first().click();
  await expect(dialog).toBeVisible();
  await dialog.click({ position: { x: 2, y: 2 } });
  await expect(dialog).toBeVisible();
  await page.keyboard.press('Escape');
});

test('keeps closed and enlarged natural-ratio photos usable on small screens', async ({ page }) => {
  for (const width of [320, 375, 768, 1440]) {
    await page.setViewportSize({ width, height: 800 });
    await page.goto('/surse-proiecte/#sursa-olt');
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);

    const thumbnails = oltGallery(page).locator('[data-gallery-open] img');
    for (const [index, ratio] of [4 / 3, 3 / 4].entries()) {
      const box = await thumbnails.nth(index).boundingBox();
      expect(box, `thumbnail ${index + 1} at ${width}px`).not.toBeNull();
      expect(box!.width / box!.height).toBeCloseTo(ratio, 1);
    }

    await oltGallery(page).locator('[data-gallery-open]').first().click();
    const dialog = oltGallery(page).getByRole('dialog');
    for (const [index, ratio] of [4 / 3, 3 / 4].entries()) {
      if (index > 0) await dialog.getByRole('button', { name: 'Fotografia următoare' }).click();
      const enlarged = dialog.locator('[data-gallery-slide]:visible img');
      await enlarged.evaluate(async (image: HTMLImageElement) => { await image.decode(); });
      const box = await enlarged.boundingBox();
      expect(box, `enlarged photo ${index + 1} at ${width}px`).not.toBeNull();
      expect(box!.width).toBeGreaterThan(0);
      expect(box!.height).toBeGreaterThan(0);
      expect(box!.x).toBeGreaterThanOrEqual(0);
      expect(box!.x + box!.width).toBeLessThanOrEqual(width + 1);
      expect(box!.width / box!.height).toBeCloseTo(ratio, 1);
      await expect.poll(() => page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
      for (const name of ['Fotografia anterioară', 'Fotografia următoare', 'Închide galeria']) {
        await expect(dialog.getByRole('button', { name })).toBeInViewport();
      }
    }
    await page.keyboard.press('Escape');
  }
});

test('keeps independent gallery state and removes navigation on cleanup', async ({ page }) => {
  await page.goto('/surse-proiecte/#sursa-olt');
  await page.evaluate(async (modulePath) => {
    const root = document.querySelector<HTMLElement>('[data-county-gallery]')!;
    const clone = root.cloneNode(true) as HTMLElement;
    clone.dataset.countyGallery = 'fixture-dolj';
    for (const element of clone.querySelectorAll<HTMLElement>('[id]')) {
      element.id = element.id.replace('galerie-olt', 'galerie-fixture-dolj');
    }
    clone.querySelector('[aria-labelledby]')?.setAttribute('aria-labelledby', 'galerie-fixture-dolj-titlu');
    const { initCountyGallery } = await import(/* @vite-ignore */ modulePath) as typeof import('../../src/scripts/county-gallery');
    initCountyGallery(root);
    const cleanup = initCountyGallery(clone);
    (clone as HTMLElement & { galleryCleanup?: () => void }).galleryCleanup = cleanup;
    root.after(clone);
  }, '/src/scripts/county-gallery.ts');

  const galleries = page.locator('[data-county-gallery]');
  await expect(galleries).toHaveCount(2);
  const firstOpener = galleries.nth(0).locator('[data-gallery-open]').first();
  await firstOpener.click();
  const firstDialog = galleries.nth(0).getByRole('dialog');
  await firstDialog.getByRole('button', { name: 'Fotografia următoare' }).click();
  await expect(firstDialog.locator('[data-gallery-counter]')).toHaveText('2 / 2');
  await expect(galleries.nth(1).locator('[data-gallery-counter]')).toHaveText('1 / 2');
  await expect(galleries.nth(1).getByRole('dialog')).not.toBeVisible();
  await page.keyboard.press('Escape');
  await expect(firstOpener).toBeFocused();

  const secondOpener = galleries.nth(1).locator('[data-gallery-open]').first();
  await secondOpener.click();
  await expect(galleries.nth(1).getByRole('dialog')).toBeVisible();
  await expect.poll(() => page.evaluate(() => document.body.style.overflow)).toBe('hidden');
  await page.evaluate(() => {
    const second = document.querySelectorAll<HTMLElement>('[data-county-gallery]')[1] as HTMLElement & { galleryCleanup?: () => void };
    second.galleryCleanup?.();
  });
  await expect(galleries.nth(1).getByRole('dialog')).not.toBeVisible();
  await expect(secondOpener).toBeFocused();
  await expect.poll(() => page.evaluate(() => document.body.style.overflow)).toBe('');

  await galleries.nth(1).locator('[data-gallery-dialog]').evaluate((element: HTMLDialogElement) => element.showModal());
  await galleries.nth(1).getByRole('button', { name: 'Fotografia următoare', includeHidden: true }).click();
  await expect(galleries.nth(1).locator('[data-gallery-counter]')).toHaveText('1 / 2');
});

test('reduced-motion navigation remains immediate and does not autoplay', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await openFirstPhoto(page);
  const dialog = oltGallery(page).getByRole('dialog');
  expect(await dialog.evaluate((element) => element.getAnimations().length)).toBe(0);
  await dialog.getByRole('button', { name: 'Fotografia următoare' }).click();
  await expect(dialog.locator('[data-gallery-counter]')).toHaveText('2 / 2');
  await expect(page).toHaveURL(/\/surse-proiecte\/#sursa-olt$/);
});

test.describe('without JavaScript', () => {
  test.use({ javaScriptEnabled: false });

  test('thumbnail links open their actual public optimized image', async ({ page }) => {
    await page.goto('http://127.0.0.1:4324/surse-proiecte/#sursa-olt');
    const opener = oltGallery(page).locator('[data-gallery-open]').first();
    const href = await opener.getAttribute('href');
    expect(href).toMatch(/^\/_astro\/olt1\..+\.webp$/);
    const [response] = await Promise.all([
      page.waitForResponse((candidate) => new URL(candidate.url()).href === new URL(href!, page.url()).href),
      opener.click(),
    ]);
    expect(response.status()).toBe(200);
    expect(response.headers()['content-type']).toContain('image/webp');
    await expect.poll(() => page.url()).toBe(new URL(href!, response.url()).href);
  });
});
