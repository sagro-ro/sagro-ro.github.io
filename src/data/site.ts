export type EnquiryType = 'instalare' | 'service';

export const site = {
  name: 'Sagro',
  legalName: 'Special AgroService S.R.L.',
  registration: ['RO 43835854', 'J16/629/2021'] as const,
  phoneDisplay: '+40 762 910 030',
  phoneHref: 'tel:+40762910030',
  email: 'contact@sagro.ro',
  emailHref: 'mailto:contact@sagro.ro',
  address: 'Str. Primăverii 161, Poiana Mare, Dolj',
  projectDisclaimer:
    'Locațiile de pe hartă sunt aproximative, la nivel de județ. Nu reprezintă adresele exacte ale instalațiilor.',
} as const;
