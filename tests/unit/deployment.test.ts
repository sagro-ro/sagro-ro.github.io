import { readFile } from 'node:fs/promises';
import { describe, expect, it } from 'vitest';

const root = new URL('../../', import.meta.url);
const readWorkspaceFile = (path: string) => readFile(new URL(path, root), 'utf8');

const legacyRedirects = [
  ['/pages/sisteme-irigatii', '/sisteme-irigatii/'],
  ['/pages/service', '/service-mentenanta/'],
  ['/pages/contact', '/contact/'],
] as const;

describe('GitHub Pages deployment', () => {
  it('declares the custom domain and disables Jekyll processing', async () => {
    expect((await readWorkspaceFile('public/CNAME')).trim()).toBe('sagro.ro');
    expect(await readWorkspaceFile('public/.nojekyll')).toBe('');
  });

  it('builds the public site and publishes dist through the official Pages actions', async () => {
    const workflow = await readWorkspaceFile('.github/workflows/deploy.yml');

    expect(workflow).toContain('actions/checkout@v4');
    expect(workflow).toContain('actions/setup-node@v4');
    expect(workflow).toContain('node-version: 24');
    expect(workflow).toContain('npm ci');
    expect(workflow).toContain('SITE_URL: https://sagro.ro');
    expect(workflow).toContain('npm run build');
    expect(workflow).toContain('actions/configure-pages@v5');
    expect(workflow).toContain('actions/upload-pages-artifact@v3');
    expect(workflow).toContain('path: dist');
    expect(workflow).toContain('actions/deploy-pages@v4');
    expect(workflow).toMatch(/permissions:\s+contents: read\s+pages: write\s+id-token: write/);
  });

  it.each(legacyRedirects)('provides an honest noindex fallback for %s', async (legacyPath, targetPath) => {
    const html = await readWorkspaceFile(`public${legacyPath}/index.html`);

    expect(html).toContain('<html lang="ro">');
    expect(html).toContain('<meta name="robots" content="noindex, nofollow">');
    expect(html).toContain(`<link rel="canonical" href="https://sagro.ro${targetPath}">`);
    expect(html).toContain(`<meta http-equiv="refresh" content="0; url=${targetPath}">`);
    expect(html).toContain(`<a href="${targetPath}">`);
    expect(html).toContain('window.location.search');
    expect(html).toContain('window.location.hash');
  });
});
