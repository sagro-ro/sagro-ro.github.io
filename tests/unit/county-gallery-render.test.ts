import { experimental_AstroContainer as AstroContainer } from 'astro/container';
import { describe, expect, it } from 'vitest';
import CountyGallery from '../../src/components/projects/CountyGallery.astro';
import type { CountyPhoto } from '../../src/data/county-media';

const localPhotos = [
  '../assets/projects/olt/olt1.jpeg',
  '../assets/projects/olt/olt2.jpeg',
] as const;

function photoFixtures(count: number, countyLabel: string): CountyPhoto[] {
  return Array.from({ length: count }, (_, index) => ({
    src: localPhotos[index % localPhotos.length],
    alt: `Fixtură ${countyLabel}: fotografie ${index + 1} cu echipamente de irigații.`,
    caption: `Fixtură ${countyLabel} ${index + 1}`,
  }));
}

describe('generic county gallery rendering', () => {
  it('renders different photo counts for independent counties with unique ARIA IDs', async () => {
    const container = await AstroContainer.create();
    const first = await container.renderToString(CountyGallery, {
      props: { countySlug: 'dolj', countyLabel: 'Dolj', photos: photoFixtures(3, 'Dolj') },
    });
    const second = await container.renderToString(CountyGallery, {
      props: { countySlug: 'olt', countyLabel: 'Olt', photos: photoFixtures(4, 'Olt') },
    });

    expect(first.match(/data-gallery-open=/g)).toHaveLength(3);
    expect(second.match(/data-gallery-open=/g)).toHaveLength(4);
    expect(first).toContain('1 / 3');
    expect(second).toContain('1 / 4');
    expect(first).toContain('Fotografii din județul Dolj');
    expect(second).toContain('Fotografii din județul Olt');
    const hrefsFor = (html: string) => Array.from(html.matchAll(/href="([^"]+)"/g),
      (match) => match[1].replaceAll('&amp;', '&'));
    const firstHrefs = hrefsFor(first);
    const secondHrefs = hrefsFor(second);
    expect(firstHrefs.map((href) => decodeURIComponent(href).match(/olt\d+/)?.[0])).toEqual([
      'olt1', 'olt2', 'olt1',
    ]);
    expect(secondHrefs.map((href) => decodeURIComponent(href).match(/olt\d+/)?.[0])).toEqual([
      'olt1', 'olt2', 'olt1', 'olt2',
    ]);
    expect([...firstHrefs, ...secondHrefs].every((href) => href.startsWith('/_image/') || href.startsWith('/_astro/'))).toBe(true);

    const ids = Array.from(`${first}${second}`.matchAll(/\sid="([^"]+)"/g), (match) => match[1]);
    expect(ids.length).toBeGreaterThan(0);
    expect(new Set(ids).size).toBe(ids.length);
    expect(first).toContain('aria-labelledby="galerie-dolj-titlu"');
    expect(second).toContain('aria-labelledby="galerie-olt-titlu"');
    expect(`${first}${second}`).not.toMatch(/(?:src|href|srcset)="[^"]*https?:\/\//);
  });

  it.each([0, 1])('handles a collection of %i photograph(s)', async (count) => {
    const container = await AstroContainer.create();
    const rendered = await container.renderToString(CountyGallery, {
      props: { countySlug: 'olt', countyLabel: 'Olt', photos: photoFixtures(count, 'Olt') },
    });
    expect(rendered.match(/data-gallery-open=/g) ?? []).toHaveLength(count);
    if (count === 0) {
      expect(rendered).not.toContain('<dialog');
    } else {
      expect(rendered).toContain('1 / 1');
    }
  });
});
