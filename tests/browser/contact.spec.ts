import { expect, test, type Page } from '@playwright/test';

const configuredUrl = 'http://127.0.0.1:4322/contact/';
const endpoint = 'https://forms.example.test/solicitari';

async function fillValidEnquiry(page: Page, type: 'instalare' | 'service' = 'instalare') {
  await page.locator(`input[name="tip"][value="${type}"]`).check();
  await page.getByLabel('Nume și prenume *').fill('  Ioana Popescu  ');
  await page.getByLabel('Telefon *').fill('  +40 762 910 030  ');
  await page.getByLabel('Adresă de e-mail').fill('ioana@example.ro');
  await page.getByLabel('Județ').fill('Călărași');
  await page.getByLabel('Mesaj *').fill('  Doresc o evaluare pentru irigarea unei parcele de porumb.  ');
  await page.getByLabel(/Sunt de acord cu prelucrarea/).check();
}

test('contact page uses only exact query values and keeps invalid selections neutral', async ({ page }) => {
  for (const query of ['', '?tip=instalare', '?tip=', '?tip=SERVICE', '?tip=%3Cscript%3E', '?tip=service&tip=instalare', '?subiect=service']) {
    await page.goto(`/contact/${query}`);
    await expect(page.locator('input[name="tip"][value="instalare"]')).toBeChecked();
  }
  await page.goto('/contact/?tip=service');
  await expect(page.locator('input[name="tip"][value="service"]')).toBeChecked();
  await expect(page.locator('main h1')).toContainText(/discutăm/i);
  await expect(page.locator('main')).toContainText('Special AgroService S.R.L.');
  await expect(page.locator('main')).toContainText(/suprafața și forma parcelei/i);
  await expect(page.locator('main')).toContainText('sursa de apă');
});

test('unconfigured form is explicitly disabled and offers direct contact without submission', async ({ page }) => {
  const posts: string[] = [];
  page.on('request', (request) => { if (request.method() === 'POST') posts.push(request.url()); });
  await page.goto('/contact/');
  await expect(page.locator('form#formular fieldset')).toHaveAttribute('disabled', '');
  await expect(page.getByLabel('Nume și prenume *')).toBeDisabled();
  await expect(page.getByRole('button', { name: 'Trimite solicitarea' })).toBeDisabled();
  await expect(page.locator('[data-configuration-notice]')).toContainText(/nu este conectat/i);
  await expect(page.locator('main').getByRole('link', { name: '+40 762 910 030', exact: true }).first()).toHaveAttribute('href', 'tel:+40762910030');
  await expect(page.locator('main').getByRole('link', { name: 'contact@sagro.ro', exact: true }).first()).toHaveAttribute('href', 'mailto:contact@sagro.ro');
  await expect(page.locator('[data-form-status]')).not.toContainText(/trimisă cu succes|a fost trimisă/i);
  expect(posts).toEqual([]);
});

test('configured form has associated labels and allows manual type changes', async ({ page }) => {
  await page.goto(`${configuredUrl}?tip=service`);
  await expect(page.locator('form#formular fieldset')).toBeEnabled();
  await expect(page.locator('input[name="tip"][value="service"]')).toBeChecked();
  await page.locator('input[name="tip"][value="instalare"]').check();
  await expect(page.locator('input[name="tip"][value="instalare"]')).toBeChecked();
  await expect(page.getByLabel('Nume și prenume *')).toHaveAttribute('name', 'nume');
  await expect(page.getByLabel('Telefon *')).toHaveAttribute('type', 'tel');
  await expect(page.getByLabel('Adresă de e-mail')).not.toHaveAttribute('required', '');
  await expect(page.getByLabel('Mesaj *')).toHaveAttribute('maxlength', '3000');
  await expect(page.getByRole('link', { name: 'politica de confidențialitate', exact: true })).toHaveAttribute('href', '/politica-confidentialitate/');
});

test('client validation focuses its summary and preserves entered values', async ({ page }) => {
  let postCount = 0;
  await page.route(endpoint, async (route) => { postCount += 1; await route.fulfill({ status: 204 }); });
  await page.goto(configuredUrl);
  await page.getByRole('button', { name: 'Trimite solicitarea' }).click();
  await expect(page.locator('[data-error-summary]')).toBeFocused();
  await expect(page.locator('[data-error-summary]')).toContainText(/Verifică/i);
  await expect(page.getByLabel('Nume și prenume *')).toHaveAttribute('aria-invalid', 'true');
  await expect(page.getByLabel('Nume și prenume *')).toHaveAttribute('aria-describedby', /eroare-nume/);
  await expect(page.getByLabel(/Sunt de acord cu prelucrarea/)).toHaveAttribute('aria-invalid', 'true');

  await page.getByLabel('Nume și prenume *').fill('Ioana Popescu');
  await page.getByLabel('Telefon *').fill('număr necunoscut');
  await page.getByLabel('Mesaj *').fill('Prea scurt.');
  await expect(page.locator('#eroare-nume')).toBeEmpty();
  await expect(page.locator('#eroare-telefon')).not.toBeEmpty();
  await expect(page.locator('#eroare-mesaj')).not.toBeEmpty();
  await page.getByRole('button', { name: 'Trimite solicitarea' }).click();
  await expect(page.getByLabel('Nume și prenume *')).toHaveValue('Ioana Popescu');
  await expect(page.getByLabel('Telefon *')).toHaveValue('număr necunoscut');
  expect(postCount).toBe(0);
});

test('honeypot input prevents network submission', async ({ page }) => {
  let postCount = 0;
  await page.route(endpoint, async (route) => { postCount += 1; await route.fulfill({ status: 204 }); });
  await page.goto(configuredUrl);
  await fillValidEnquiry(page);
  await page.locator('input[name="website"]').evaluate((input: HTMLInputElement) => { input.value = 'bot.example'; });
  await page.getByRole('button', { name: 'Trimite solicitarea' }).click();
  await expect(page.locator('[data-error-summary]')).toBeVisible();
  await expect(page.locator('[data-form-status]')).not.toContainText(/a fost trimisă/i);
  expect(postCount).toBe(0);
});

test('double submission sends once; non-JSON 2xx succeeds and resets values', async ({ page }) => {
  const payloads: Array<Record<string, unknown>> = [];
  await page.route(endpoint, async (route) => {
    payloads.push(route.request().postDataJSON());
    await route.fulfill({ status: 202, contentType: 'text/plain', body: 'not-json' });
  });
  await page.goto(`${configuredUrl}?tip=service`);
  await fillValidEnquiry(page, 'service');
  await page.getByRole('button', { name: 'Trimite solicitarea' }).evaluate((button: HTMLButtonElement) => {
    button.form?.requestSubmit();
    button.form?.requestSubmit();
  });
  await expect(page.locator('[data-form-status]')).toContainText(/a fost trimisă/i);
  expect(payloads).toHaveLength(1);
  expect(payloads[0]).toMatchObject({
    type: 'service',
    name: 'Ioana Popescu',
    phone: '+40 762 910 030',
    email: 'ioana@example.ro',
    county: 'Călărași',
    consent: true,
    website: '',
  });
  expect(Date.parse(String(payloads[0].submittedAt))).not.toBeNaN();
  await expect(page.getByRole('button', { name: 'Trimite solicitarea' })).toBeEnabled();
  await expect(page.getByLabel('Nume și prenume *')).toHaveValue('');
});

test('HTTP failure preserves values and allows an explicit successful retry', async ({ page }) => {
  let attempts = 0;
  await page.route(endpoint, async (route) => {
    attempts += 1;
    await route.fulfill(attempts === 1 ? { status: 503, body: '{}' } : { status: 200, contentType: 'text/plain', body: 'ok' });
  });
  await page.goto(configuredUrl);
  await fillValidEnquiry(page);
  await page.getByRole('button', { name: 'Trimite solicitarea' }).click();
  await expect(page.locator('[data-form-status]')).toContainText(/nu am putut trimite/i);
  await expect(page.getByLabel('Nume și prenume *')).toHaveValue('  Ioana Popescu  ');
  await expect(page.getByRole('button', { name: 'Trimite solicitarea' })).toBeEnabled();
  await page.getByRole('button', { name: 'Trimite solicitarea' }).click();
  await expect(page.locator('[data-form-status]')).toContainText(/a fost trimisă/i);
  expect(attempts).toBe(2);
});

test('rejected fetch reports a failure without claiming success or losing values', async ({ page }) => {
  await page.route(endpoint, (route) => route.abort('failed'));
  await page.goto(configuredUrl);
  await fillValidEnquiry(page);
  await page.getByRole('button', { name: 'Trimite solicitarea' }).click();
  await expect(page.locator('[data-form-status]')).toContainText(/nu am putut trimite/i);
  await expect(page.locator('[data-form-status]')).not.toContainText(/a fost trimisă/i);
  await expect(page.getByLabel('Mesaj *')).toHaveValue(/parcele de porumb/);
  await expect(page.getByRole('button', { name: 'Trimite solicitarea' })).toBeEnabled();
});

test('request timeout aborts and offers a retryable error', async ({ page }) => {
  await page.route(endpoint, async (route) => {
    await new Promise((resolve) => setTimeout(resolve, 600));
    try { await route.fulfill({ status: 200 }); } catch { /* Request was intentionally aborted. */ }
  });
  await page.goto(configuredUrl);
  await page.locator('form#formular').evaluate((form: HTMLFormElement) => { form.dataset.timeoutMs = '100'; });
  await fillValidEnquiry(page);
  await page.getByRole('button', { name: 'Trimite solicitarea' }).click();
  await expect(page.locator('[data-form-status]')).toContainText(/durat prea mult/i);
  await expect(page.locator('[data-form-status]')).not.toContainText(/a fost trimisă/i);
  await expect(page.getByRole('button', { name: 'Trimite solicitarea' })).toBeEnabled();
  await expect(page.getByLabel('Nume și prenume *')).toHaveValue('  Ioana Popescu  ');
});
