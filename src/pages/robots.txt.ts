import type { APIRoute } from 'astro';

export function createRobotsTxt(site: URL): string {
  const sitemapUrl = new URL('/sitemap.xml', site).href;
  return `User-agent: *\nAllow: /\n\nSitemap: ${sitemapUrl}\n`;
}

export const GET: APIRoute = ({ site }) => {
  if (!site) {
    return new Response('Configure SITE_URL or Astro site to generate robots.txt.', { status: 500 });
  }

  return new Response(createRobotsTxt(site), {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
};
