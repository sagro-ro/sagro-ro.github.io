import { describe, expect, it } from 'vitest';
import { projects } from '../../src/data/projects';
import { site } from '../../src/data/site';
import { createLlmsTxt, GET } from '../../src/pages/llms.txt';

const canonicalPaths = [
  '/',
  '/sisteme-irigatii/',
  '/service-mentenanta/',
  '/proiecte/',
  '/surse-proiecte/',
  '/contact/',
  '/politica-confidentialitate/',
  '/termeni-conditii/',
] as const;

describe('curated llms.txt', () => {
  it('contains canonical irrigation, evidence, contact, and legal links without legacy destinations', () => {
    const content = createLlmsTxt(new URL('https://sagro.ro'));

    expect(content.startsWith('# Sagro Irigații\n')).toBe(true);
    for (const path of canonicalPaths) {
      expect(content).toContain(`](https://sagro.ro${path})`);
    }
    expect(content).not.toContain('llms.txt');
    expect(content).not.toMatch(/\/pages\/|\/products\/|\/policies\//);
  });

  it('summarizes installation, service, verified identity, and direct contact honestly', () => {
    const content = createLlmsTxt(new URL('https://sagro.ro'));

    expect(content).toContain('## Servicii');
    expect(content).toContain('proiectare, configurare, instalare și punere în funcțiune');
    expect(content).toContain('evaluare, diagnostic, verificări periodice și intervenții tehnice');
    expect(content).toContain('## Contact');
    expect(content).toContain(site.legalName);
    expect(content).toContain('Str. Primăverii 161, Poiana Mare, Dolj');
    expect(content).toContain(site.phoneDisplay);
    expect(content).toContain(site.email);
    expect(content).toContain('Formularul online nu este conectat');
    expect(content).toMatch(/telefon.*e-mail|e-mail.*telefon/i);
  });

  it('lists the six county groups with production locality copy and no editorial boilerplate', () => {
    const content = createLlmsTxt(new URL('https://sagro.ro'));

    expect(content).toContain('## Localități cu implementări');
    expect(content.match(/Județul /g)).toHaveLength(6);
    for (const project of projects) {
      expect(content).toContain(`Județul ${project.countyLabel}: ${project.localities.join(', ')}`);
    }
    expect(projects).toHaveLength(6);
    expect(projects.flatMap((project) => project.localities)).toHaveLength(13);
    expect(content).toContain('Localități cu implementări Sagro. Marcajele grupează implementările pe județe.');
    expect(content).not.toMatch(/furnizate pentru această actualizare|revizuit\w* editorial|nu este o verificare independentă|singurele locuri furnizate/i);
    expect(content).not.toMatch(/Ferma Baciu|Patino Robot|două sezoane|Ialomița|citat|povești|material istoric|Zimmatic.*(?:proiect|implement)/i);
  });

  it('uses an alternate deployment origin without duplicating paths', () => {
    const content = createLlmsTxt(new URL('https://preview.example.ro'));

    for (const path of canonicalPaths) {
      expect(content).toContain(`](https://preview.example.ro${path})`);
    }
    expect(content).not.toContain('https://sagro.ro');
    expect(content).not.toContain('https://preview.example.ro/https://');
    expect(content).not.toMatch(/sisteme-irigatii\/sisteme-irigatii|contact\/contact/);
  });

  it('does not promise discovery outcomes, business credentials, coverage, or delivery', () => {
    const content = createLlmsTxt(new URL('https://sagro.ro'));

    expect(content).not.toMatch(/indexa|indexing|clasament|ranking|recomand|\bcitare\b|\bcitări\b|citation/i);
    expect(content).not.toMatch(/dealer autorizat|partener autorizat|certificat|acreditat|garan[țt]ie|garan[țt]ii|warrant/i);
    expect(content).not.toMatch(/timp de răspuns|răspuns garantat|răspuns în \d+|acoperire națională|acoperire garantată/i);
    expect(content).not.toMatch(/mesaj (?:trimis|transmis)|solicitare (?:trimisă|transmisă)|confirmare de (?:primire|trimitere)/i);
    expect(content).not.toMatch(/\b\d+%|\b\d+\+?\s+(?:proiecte|clienți|ani|instalații)/i);
  });

  it('returns plain text and an explicit error when the deployment site is missing', async () => {
    const response = await GET({ site: new URL('https://sagro.ro') } as Parameters<typeof GET>[0]);
    expect(response.status).toBe(200);
    expect(response.headers.get('Content-Type')).toBe('text/plain; charset=utf-8');
    expect(await response.text()).toBe(createLlmsTxt(new URL('https://sagro.ro')));

    const missingSite = await GET({ site: undefined } as Parameters<typeof GET>[0]);
    expect(missingSite.status).toBe(500);
    expect(await missingSite.text()).toContain('Configure SITE_URL or Astro site');
  });
});
