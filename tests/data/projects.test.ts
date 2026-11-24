import { describe, expect, it } from 'vitest';
import { projectEvidence, getProjectSourceUrl } from '../../src/data/project-evidence';
import { projects } from '../../src/data/projects';

describe('documented implementation projects', () => {
  it('contains only the three unique documented county areas', () => {
    expect(projects.map((project) => [project.slug, project.countyId])).toEqual([
      ['calarasi-ferma-vegetala', 'ro-cl'],
      ['ialomita-ferma-baciu', 'ro-il'],
      ['constanta-patino-robot', 'ro-ct'],
    ]);
    expect(new Set(projects.map((project) => project.slug)).size).toBe(3);
  });

  it('links to durable, dated and owner-attributed historical evidence', () => {
    expect(projectEvidence).toEqual({
      route: '/surse-proiecte/',
      historicalUrl: 'https://sagro.ro/pages/sisteme-irigatii',
      reviewedAtLabel: '12 noiembrie 2026',
    });
    expect(getProjectSourceUrl('ialomita-ferma-baciu')).toBe('/surse-proiecte/#sursa-ialomita-ferma-baciu');
    expect(projects.map((project) => project.sourceUrl)).toEqual([
      '/surse-proiecte/#sursa-calarasi-ferma-vegetala',
      '/surse-proiecte/#sursa-ialomita-ferma-baciu',
      '/surse-proiecte/#sursa-constanta-patino-robot',
    ]);
  });

  it('retains evidence and avoids exact-premises geolocation', () => {
    for (const project of projects) {
      expect(project.quote.trim().length).toBeGreaterThan(20);
      expect(project.summary).toMatch(/Zimmatic/i);
      expect(project).not.toHaveProperty('coordinates');
      expect(project).not.toHaveProperty('latitude');
      expect(project).not.toHaveProperty('longitude');
      expect(JSON.stringify(project)).not.toMatch(/Poiana Mare|Predești|Craiova|Strada|Str\./i);
    }
  });

  it('keeps the documented customer context', () => {
    expect(projects[0]?.summary).toMatch(/porumb/i);
    expect(projects[1]?.summary).toMatch(/două sezoane/i);
    expect(projects[2]?.summary).toMatch(/sursa de apă/i);
  });
});
