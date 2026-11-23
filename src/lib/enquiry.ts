import type { EnquiryType } from '../data/site';

export function isEnquiryType(value: string | null): value is EnquiryType {
  return value === 'instalare' || value === 'service';
}

export function getEnquiryType(
  params: URLSearchParams,
  fallback: EnquiryType = 'instalare',
): EnquiryType {
  const values = params.getAll('tip');
  return values.length === 1 && isEnquiryType(values[0]) ? values[0] : fallback;
}

export function enquiryHref(type: EnquiryType): string {
  return `/contact/?tip=${type}#formular`;
}
