import { describe, expect, it } from 'vitest';
import { legalRoutes, primaryRoutes, supportingRoutes } from '../../src/data/routes';
import { createSitemapXml, getSitemapUrls } from '../../src/pages/sitemap.xml';

describe('production sitemap', () => {
  it('contains each primary and legal route exactly once and excludes recovery output', () => {
    const expectedPaths = [...primaryRoutes, ...supportingRoutes, ...legalRoutes].map((route) => route.href);
    const urls = getSitemapUrls(new URL('https://sagro.ro'));

    expect(urls.map((url) => new URL(url).pathname)).toEqual(expectedPaths);
    expect(new Set(urls).size).toBe(urls.length);
    expect(urls.some((url) => /404/.test(url))).toBe(false);
  });

  it('uses the configured deployment origin and emits absolute XML locations', () => {
    const urls = getSitemapUrls(new URL('https://staging.example.ro'));
    expect(urls).toContain('https://staging.example.ro/');
    expect(urls).toContain('https://staging.example.ro/termeni-conditii/');
    expect(urls.every((url) => url.startsWith('https://staging.example.ro/'))).toBe(true);

    const xml = createSitemapXml(new URL('https://preview.example.ro'));
    expect(xml).toContain('<?xml version="1.0" encoding="UTF-8"?>');
    expect(xml).toContain('<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">');
    expect(xml).toContain('<loc>https://preview.example.ro/sisteme-irigatii/</loc>');
    expect((xml.match(/<loc>/g) ?? [])).toHaveLength(primaryRoutes.length + supportingRoutes.length + legalRoutes.length);
  });
});
