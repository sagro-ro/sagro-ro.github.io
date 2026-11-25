import type { projects } from './projects';

export interface CountyPhoto {
  readonly src: `../assets/${string}`;
  readonly alt: string;
  readonly caption: string;
}

type CountySlug = (typeof projects)[number]['slug'];

/** Ordered county-level photos. Never attach these records to a locality. */
export const countyMedia: Readonly<Partial<Record<CountySlug, readonly CountyPhoto[]>>> = {
  olt: [
    {
      src: '../assets/projects/olt/olt1.jpeg',
      alt: 'Pivot Sagro care udă un teren agricol în județul Olt.',
      caption: 'Pivot de irigații în funcțiune în județul Olt.',
    },
    {
      src: '../assets/projects/olt/olt2.jpeg',
      alt: 'Conducte și structuri de irigații în câmp, în județul Olt.',
      caption: 'Structură de pivot și conducte în câmp, în județul Olt.',
    },
  ],
} as const satisfies Partial<Record<CountySlug, readonly CountyPhoto[]>>;
