import { describe, expect, it } from 'vitest';
import { enquiryHref, getEnquiryType, isEnquiryType } from '../../src/lib/enquiry';

describe('enquiry type parser', () => {
  it.each([
    [null, false],
    ['instalare', true],
    ['service', true],
    ['', false],
    ['SERVICE', false],
    ['Instalare', false],
    [' instalare', false],
    ['instalare,service', false],
    ['<script>alert(1)</script>', false],
  ])('accepts only the closed enquiry-type union: %s', (value, expected) => {
    expect(isEnquiryType(value)).toBe(expected);
  });

  it.each([
    ['', 'instalare', 'instalare'],
    ['?tip=service', 'instalare', 'service'],
    ['?tip=instalare', 'service', 'instalare'],
    ['?tip=', 'service', 'service'],
    ['?tip=SERVICE', 'instalare', 'instalare'],
    ['?tip=%3Cscript%3E', 'service', 'service'],
    ['?tip=service&tip=instalare', 'instalare', 'instalare'],
    ['?tip=service&tip=', 'instalare', 'instalare'],
    ['?subiect=service', 'instalare', 'instalare'],
  ])('uses one exact valid parameter or the supplied fallback: %s', (query, fallback, expected) => {
    expect(getEnquiryType(new URLSearchParams(query), fallback as 'instalare' | 'service')).toBe(expected);
  });

  it('builds only the two exact enquiry destinations', () => {
    expect(enquiryHref('instalare')).toBe('/contact/?tip=instalare#formular');
    expect(enquiryHref('service')).toBe('/contact/?tip=service#formular');
  });
});
