import type { APIRoute } from 'astro';
import { legalRoutes, primaryRoutes, supportingRoutes } from '../data/routes';

export function getSitemapUrls(site: URL): string[] {
  return [...primaryRoutes, ...supportingRoutes, ...legalRoutes].map((route) => new URL(route.href, site).href);
}

export function createSitemapXml(site: URL): string {
  const entries = getSitemapUrls(site).map((url) => `  <url><loc>${url}</loc></url>`).join('\n');
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${entries}\n</urlset>\n`;
}

export const GET: APIRoute = ({ site }) => {
  if (!site) {
    return new Response('Configure SITE_URL or Astro site to generate the sitemap.', { status: 500 });
  }

  return new Response(createSitemapXml(site), {
    headers: { 'Content-Type': 'application/xml; charset=utf-8' },
  });
};
