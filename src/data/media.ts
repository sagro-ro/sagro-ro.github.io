export interface MediaRecord {
  /** Path relative to this module; SourceImage resolves it through Astro. */
  readonly src: `../assets/${string}`;
  readonly alt: string;
  readonly sourceUrl: `https://${string}`;
  readonly role: 'brand' | 'editorial' | 'partner';
}

export const media = {
  logo: {
    src: '../assets/brand/sagro-logo.png',
    alt: 'Sigla Sagro',
    sourceUrl: 'https://sagro.ro/cdn/shop/files/Asset_4.png?v=1721913272',
    role: 'brand',
  },
  heroField: {
    src: '../assets/irrigation/hero-field.png',
    alt: 'Pivot de irigare care pulverizează apă peste o cultură verde',
    sourceUrl: 'https://sagro.ro/cdn/shop/files/porumb_ad84fb33-874c-48f3-b5cd-81013f6f0b82.png?v=1769428935',
    role: 'editorial',
  },
  heroPivot: {
    src: '../assets/irrigation/hero-pivot.jpg',
    alt: 'Utilaj Zimmatic cu braț de irigare lângă un canal, la marginea unei culturi',
    sourceUrl: 'https://cdn.shopify.com/s/files/1/0889/2724/0499/files/lindsay_111218_05.jpg?v=1769432714',
    role: 'editorial',
  },
  pivotArt: {
    src: '../assets/irrigation/pivot.png',
    alt: 'Desen tehnic al unui pivot central cu trei turnuri mobile',
    sourceUrl: 'https://cdn.shopify.com/s/files/1/0889/2724/0499/files/Untitled_design_11.png?v=1769417544',
    role: 'editorial',
  },
  reelArt: {
    src: '../assets/irrigation/linear.png',
    alt: 'Desen tehnic al unei mașini de irigat cu tambur și furtun',
    sourceUrl: 'https://cdn.shopify.com/s/files/1/0889/2724/0499/files/Untitled_design_13.png?v=1769419429',
    role: 'editorial',
  },
  pumpArt: {
    src: '../assets/irrigation/drum.png',
    alt: 'Desen tehnic al unei pompe de irigat cu racord și picături de apă',
    sourceUrl: 'https://cdn.shopify.com/s/files/1/0889/2724/0499/files/Untitled_design_15.png?v=1769420041',
    role: 'editorial',
  },
  irrigationEquipment: {
    src: '../assets/irrigation/pump.png',
    alt: 'Utilaj cu tambur și furtun alături de o stație de pompare și un pivot în câmp',
    sourceUrl: 'https://cdn.shopify.com/s/files/1/0889/2724/0499/files/all.png?v=1769420268',
    role: 'editorial',
  },
  zimmatic: {
    src: '../assets/partners/zimmatic.png',
    alt: 'Zimmatic',
    sourceUrl: 'https://sagro.ro/cdn/shop/files/1.png?v=1769429932',
    role: 'partner',
  },
  idrofoglia: {
    src: '../assets/partners/idrofoglia.png',
    alt: 'Idrofoglia',
    sourceUrl: 'https://sagro.ro/cdn/shop/files/2.png?v=1769429917',
    role: 'partner',
  },
  greenPower: {
    src: '../assets/partners/green-power.png',
    alt: 'Green Power',
    sourceUrl: 'https://sagro.ro/cdn/shop/files/3.png?v=1769429899',
    role: 'partner',
  },
} as const satisfies Record<string, MediaRecord>;

export type MediaKey = keyof typeof media;
