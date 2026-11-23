import { describe, expect, it } from 'vitest';
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

  it('retains evidence and avoids exact-premises geolocation', () => {
    for (const project of projects) {
      expect(project.sourceUrl).toBe('https://sagro.ro/pages/sisteme-irigatii');
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
