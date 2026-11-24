import { describe, expect, it } from 'vitest';
import { site } from '../../src/data/site';

describe('confirmed Sagro identity', () => {
  it('formats working contact links without changing the published values', () => {
    expect(site.legalName).toBe('Special AgroService S.R.L.');
    expect(site.registration).toEqual(['RO 43835854', 'J16/629/2021']);
    expect(site.phoneDisplay).toBe('+40 762 910 030');
    expect(site.phoneHref).toBe('tel:+40762910030');
    expect(site.email).toBe('contact@sagro.ro');
    expect(site.emailHref).toBe('mailto:contact@sagro.ro');
    expect(site.address).toBe('Str. Primăverii 161, Poiana Mare, Dolj');
    expect(site.projectDisclaimer).toBe('Localități cu implementări Sagro. Marcajele grupează implementările pe județe.');
  });
});
