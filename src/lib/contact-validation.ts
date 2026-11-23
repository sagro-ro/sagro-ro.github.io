import { isEnquiryType } from './enquiry';
import type { EnquiryType } from '../data/site';

export interface EnquiryInput {
  type: EnquiryType;
  name: string;
  phone: string;
  email: string;
  county: string;
  message: string;
  consent: boolean;
  website: string;
}

export type EnquiryErrors = Partial<Record<keyof EnquiryInput, string>>;

export function validateEnquiry(input: EnquiryInput): EnquiryErrors {
  const errors: EnquiryErrors = {};
  const name = input.name.trim();
  const phone = input.phone.trim();
  const email = input.email.trim();
  const county = input.county.trim();
  const message = input.message.trim();
  const phoneDigits = phone.replace(/\D/g, '');

  if (!isEnquiryType(input.type)) errors.type = 'Alege tipul solicitării.';
  if (name.length < 2) errors.name = 'Introdu numele complet.';
  else if (name.length > 100) errors.name = 'Numele poate avea cel mult 100 de caractere.';
  if (!/^[+0-9][0-9\s()./-]+$/.test(phone) || phoneDigits.length < 7 || phoneDigits.length > 15 || phone.length > 30) {
    errors.phone = 'Introdu un număr de telefon valid.';
  }
  if (email && (email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email))) {
    errors.email = 'Introdu o adresă de e-mail validă.';
  }
  if (county.length > 100) errors.county = 'Județul poate avea cel mult 100 de caractere.';
  if (message.length < 20) errors.message = 'Descrie solicitarea în cel puțin 20 de caractere.';
  else if (message.length > 3000) errors.message = 'Mesajul poate avea cel mult 3000 de caractere.';
  if (!input.consent) errors.consent = 'Este necesar acordul pentru prelucrarea datelor.';
  if (input.website.length > 0) errors.website = 'Solicitarea nu a putut fi trimisă.';
  return errors;
}

export function normalizeFormEndpoint(value: unknown): string | null {
  if (typeof value !== 'string' || value.trim() === '') return null;
  const trimmed = value.trim();
  if (!/^https?:\/\/[^/\s]/i.test(trimmed)) return null;
  try {
    const url = new URL(trimmed);
    return url.protocol === 'http:' || url.protocol === 'https:' ? url.href : null;
  } catch {
    return null;
  }
}
