import { describe, expect, it } from 'vitest';
import { projects } from '../../src/data/projects';
import { getProjectSlugFromHash } from '../../src/scripts/project-fragment';

const availableSlugs = projects.map((project) => project.slug);

describe('project fragment parsing', () => {
  it.each(projects.map((project) => project.slug))('accepts the documented project slug %s', (slug) => {
    expect(getProjectSlugFromHash(`#proiect-${slug}`, availableSlugs)).toBe(slug);
  });

  it('decodes encoded project slugs before matching them', () => {
    expect(getProjectSlugFromHash('#proiect-calarasi%2Dferma%2Dvegetala', availableSlugs)).toBe('calarasi-ferma-vegetala');
    expect(getProjectSlugFromHash('#proiect-%69alomita-ferma-baciu', availableSlugs)).toBe('ialomita-ferma-baciu');
  });

  it.each([
    '',
    '#',
    '#proiect-',
    '#continut',
    'proiect-calarasi-ferma-vegetala',
    '#proiect-necunoscut',
    '#PROIECT-calarasi-ferma-vegetala',
  ])('rejects an empty, unrelated, or unknown hash: %s', (hash) => {
    expect(getProjectSlugFromHash(hash, availableSlugs)).toBeNull();
  });

  it.each(['#proiect-%', '#proiect-%ZZ', '#proiect-%E0%A4%A'])('rejects malformed escapes without throwing: %s', (hash) => {
    expect(() => getProjectSlugFromHash(hash, availableSlugs)).not.toThrow();
    expect(getProjectSlugFromHash(hash, availableSlugs)).toBeNull();
  });
});
