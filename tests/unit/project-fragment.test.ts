import { describe, expect, it } from 'vitest';
import { projects } from '../../src/data/projects';
import { getProjectSlugFromHash } from '../../src/scripts/project-fragment';

const availableSlugs = projects.map((project) => project.slug);

describe('project fragment parsing', () => {
  it.each(projects.map((project) => project.slug))('accepts the county slug %s', (slug) => {
    expect(getProjectSlugFromHash(`#proiect-${slug}`, availableSlugs)).toBe(slug);
  });

  it('decodes encoded county slugs before matching them', () => {
    expect(getProjectSlugFromHash('#proiect-%64olj', availableSlugs)).toBe('dolj');
    expect(getProjectSlugFromHash('#proiect-tele%6Frman', availableSlugs)).toBe('teleorman');
  });

  it.each([
    '',
    '#',
    '#proiect-',
    '#continut',
    'proiect-mehedinti',
    '#proiect-necunoscut',
    '#PROIECT-mehedinti',
  ])('rejects an empty, unrelated, or unknown hash: %s', (hash) => {
    expect(getProjectSlugFromHash(hash, availableSlugs)).toBeNull();
  });

  it.each(['#proiect-%', '#proiect-%ZZ', '#proiect-%E0%A4%A'])('rejects malformed escapes without throwing: %s', (hash) => {
    expect(() => getProjectSlugFromHash(hash, availableSlugs)).not.toThrow();
    expect(getProjectSlugFromHash(hash, availableSlugs)).toBeNull();
  });
});
