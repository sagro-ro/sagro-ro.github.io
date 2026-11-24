import { getProjectSourceUrl } from './project-evidence';

export type CountyId = 'ro-mh' | 'ro-dj' | 'ro-ot' | 'ro-tr' | 'ro-cl' | 'ro-ct';

export interface Project {
  slug: string;
  countyId: CountyId;
  countyLabel: string;
  localities: readonly string[];
  sourceUrl: string;
}

export const projects = [
  {
    slug: 'mehedinti',
    countyId: 'ro-mh',
    countyLabel: 'Mehedinți',
    localities: ['Vânători'],
    sourceUrl: getProjectSourceUrl('mehedinti'),
  },
  {
    slug: 'dolj',
    countyId: 'ro-dj',
    countyLabel: 'Dolj',
    localities: ['Băilești', 'Rojiște', 'Listeava', 'Ostroveni', 'Valea Stanciului'],
    sourceUrl: getProjectSourceUrl('dolj'),
  },
  {
    slug: 'olt',
    countyId: 'ro-ot',
    countyLabel: 'Olt',
    localities: ['Corabia', 'Vișina'],
    sourceUrl: getProjectSourceUrl('olt'),
  },
  {
    slug: 'teleorman',
    countyId: 'ro-tr',
    countyLabel: 'Teleorman',
    localities: ['Turnu Măgurele', 'Traian'],
    sourceUrl: getProjectSourceUrl('teleorman'),
  },
  {
    slug: 'calarasi',
    countyId: 'ro-cl',
    countyLabel: 'Călărași',
    localities: ['Borcea', 'Mănăstirea'],
    sourceUrl: getProjectSourceUrl('calarasi'),
  },
  {
    slug: 'constanta',
    countyId: 'ro-ct',
    countyLabel: 'Constanța',
    localities: ['Horia'],
    sourceUrl: getProjectSourceUrl('constanta'),
  },
] as const satisfies readonly Project[];
