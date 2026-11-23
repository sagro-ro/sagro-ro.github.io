import { describe, expect, it } from 'vitest';
import { createRobotsTxt } from '../../src/pages/robots.txt';

describe('robots.txt', () => {
  it('derives its sitemap URL from the configured public origin', () => {
    expect(createRobotsTxt(new URL('https://preview.example.test/'))).toBe(
      'User-agent: *\nAllow: /\n\nSitemap: https://preview.example.test/sitemap.xml\n',
    );
  });
});
