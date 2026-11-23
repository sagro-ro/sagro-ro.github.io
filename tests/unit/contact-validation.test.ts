import { describe, expect, it } from 'vitest';
import { normalizeFormEndpoint, validateEnquiry, type EnquiryInput } from '../../src/lib/contact-validation';

const validInput: EnquiryInput = {
  type: 'instalare',
  name: 'Ioana Popescu',
  phone: '+40 762 910 030',
  email: 'ioana@example.ro',
  county: 'Călărași',
  message: 'Doresc o evaluare pentru irigarea unei parcele de porumb.',
  consent: true,
  website: '',
};

describe('enquiry validation', () => {
  it('accepts either enquiry type and Romanian diacritics', () => {
    expect(validateEnquiry(validInput)).toEqual({});
    expect(validateEnquiry({ ...validInput, type: 'service', name: 'Ștefan Țăranu', county: 'Constanța' })).toEqual({});
  });

  it('accepts surrounding whitespace and optional blank email/county', () => {
    expect(validateEnquiry({
      ...validInput,
      name: '  Ioana Popescu  ',
      phone: '  +40 762 910 030  ',
      email: '   ',
      county: '   ',
      message: `   ${validInput.message}   `,
    })).toEqual({});
  });

  it.each([
    ['name', { name: '   ' }],
    ['phone', { phone: ' ' }],
    ['message', { message: ' ' }],
    ['consent', { consent: false }],
    ['website', { website: 'spam.example' }],
  ])('rejects blank, missing consent, or honeypot value for %s', (field, value) => {
    expect(validateEnquiry({ ...validInput, ...value })[field as keyof EnquiryInput]).toBeTruthy();
  });

  it.each([
    'telefon',
    '+40',
    '0762-call-me',
    '1234567890123456789012345678901',
  ])('rejects invalid telephone input: %s', (phone) => {
    expect(validateEnquiry({ ...validInput, phone }).phone).toBeTruthy();
  });

  it.each(['a@b', 'invalid', 'test @example.ro', '@example.ro'])('rejects an invalid optional email: %s', (email) => {
    expect(validateEnquiry({ ...validInput, email }).email).toBeTruthy();
  });

  it('enforces reasonable length limits', () => {
    expect(validateEnquiry({ ...validInput, name: 'A'.repeat(101) }).name).toBeTruthy();
    expect(validateEnquiry({ ...validInput, email: `${'a'.repeat(250)}@example.ro` }).email).toBeTruthy();
    expect(validateEnquiry({ ...validInput, county: 'A'.repeat(101) }).county).toBeTruthy();
    expect(validateEnquiry({ ...validInput, message: 'Prea scurt.' }).message).toBeTruthy();
    expect(validateEnquiry({ ...validInput, message: 'A'.repeat(3001) }).message).toBeTruthy();
  });

  it('rejects a runtime value outside the controlled enquiry type union', () => {
    expect(validateEnquiry({ ...validInput, type: 'altceva' as EnquiryInput['type'] }).type).toBeTruthy();
  });
});

describe('form endpoint normalization', () => {
  it.each(['http://localhost:9000/hooks/enquiries', ' https://forms.example.ro/enquiries  '])(
    'accepts and trims HTTP(S): %s',
    (endpoint) => expect(normalizeFormEndpoint(endpoint)).toBe(endpoint.trim()),
  );

  it.each([undefined, '', '    ', 'forms.example.ro', 'javascript:alert(1)', 'ftp://example.ro/enquiries', 'https:///broken']) (
    'treats missing, whitespace, and unsafe endpoints as unconfigured: %s',
    (endpoint) => expect(normalizeFormEndpoint(endpoint)).toBeNull(),
  );
});
