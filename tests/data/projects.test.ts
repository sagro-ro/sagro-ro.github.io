import { describe, expect, it } from 'vitest';
import { getProjectSourceUrl, projectEvidence, projectEvidenceNote } from '../../src/data/project-evidence';
import { projects } from '../../src/data/projects';

describe('supplied implementation county groups', () => {
  it('contains exactly the six ordered counties with unique geometry and source anchors', () => {
    expect(projects.map((project) => [project.slug, project.countyId, project.countyLabel, project.localities])).toEqual([
      ['mehedinti', 'ro-mh', 'Mehedinți', ['Vânători']],
      ['dolj', 'ro-dj', 'Dolj', ['Băilești', 'Rojiște', 'Listeava', 'Ostroveni', 'Valea Stanciului']],
      ['olt', 'ro-ot', 'Olt', ['Corabia', 'Vișina']],
      ['teleorman', 'ro-tr', 'Teleorman', ['Turnu Măgurele', 'Traian']],
      ['calarasi', 'ro-cl', 'Călărași', ['Borcea', 'Mănăstirea']],
      ['constanta', 'ro-ct', 'Constanța', ['Horia']],
    ]);
    expect(new Set(projects.map((project) => project.slug)).size).toBe(6);
    expect(new Set(projects.map((project) => project.countyId)).size).toBe(6);
    for (const project of projects) {
      expect(project.sourceUrl).toBe(`/surse-proiecte/#sursa-${project.slug}`);
    }
  });

  it('uses production locality copy while retaining internal provenance', () => {
    expect(projectEvidence).toEqual({
      route: '/surse-proiecte/',
      reviewedAtLabel: '24 noiembrie 2026',
    });
    expect(getProjectSourceUrl('dolj')).toBe('/surse-proiecte/#sursa-dolj');
    expect(projectEvidenceNote).toBe('Localități cu implementări Sagro. Marcajele grupează implementările pe județe.');
  });

  it('excludes former rich-story fields, unpreserved spellings, and exact-premises geolocation', () => {
    for (const project of projects) {
      expect(Object.keys(project).sort()).toEqual(['countyId', 'countyLabel', 'localities', 'slug', 'sourceUrl']);
      expect(JSON.stringify(project)).not.toMatch(/name|clientLabel|systemLabel|summary|quote|latitude|longitude|coordinates|Craiova|Predești|Rojiste|Visina/i);
    }
  });

  it('keeps exactly the 13 supplied localities in order', () => {
    expect(projects.flatMap((project) => project.localities)).toEqual([
      'Vânători',
      'Băilești',
      'Rojiște',
      'Listeava',
      'Ostroveni',
      'Valea Stanciului',
      'Corabia',
      'Vișina',
      'Turnu Măgurele',
      'Traian',
      'Borcea',
      'Mănăstirea',
      'Horia',
    ]);
  });
});
