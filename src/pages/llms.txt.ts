import type { APIRoute } from 'astro';
import { projectEvidence, projectEvidenceNote } from '../data/project-evidence';
import { projects } from '../data/projects';
import { site as businessSite } from '../data/site';

export function createLlmsTxt(site: URL): string {
  const absoluteUrl = (path: string) => new URL(path, site).href;
  const projectAreas = projects.map((project) => `- Județul ${project.countyLabel}: ${project.localities.join(', ')}`).join('\n');

  return `# Sagro Irigații

Sagro prezintă sisteme de irigații, instalare, service și mentenanță pentru echipamente de irigații.

## Servicii

- [Sisteme de irigații și instalare](${absoluteUrl('/sisteme-irigatii/')}): proiectare, configurare, instalare și punere în funcțiune, adaptate terenului, culturii și sursei de apă.
- [Service și mentenanță pentru irigații](${absoluteUrl('/service-mentenanta/')}): evaluare, diagnostic, verificări periodice și intervenții tehnice, stabilite în funcție de echipament și solicitare.

## Localități cu implementări

[Localități cu implementări de irigații](${absoluteUrl('/proiecte/')}):
${projectAreas}
${projectEvidenceNote} Consultă [contextul localităților](${absoluteUrl(projectEvidence.route)}).

## Contact

[Contact Sagro](${absoluteUrl('/contact/')})
- Denumire legală: ${businessSite.legalName}
- Adresă: ${businessSite.address}
- Telefon: ${businessSite.phoneDisplay}
- E-mail: ${businessSite.email}

Formularul online nu este conectat. Pentru contact direct, folosește telefonul sau adresa de e-mail de mai sus.

## Informații

- [Pagina principală](${absoluteUrl('/')})
- [Politica de confidențialitate](${absoluteUrl('/politica-confidentialitate/')})
- [Termeni și condiții](${absoluteUrl('/termeni-conditii/')})
`;
}

export const GET: APIRoute = ({ site }) => {
  if (!site) {
    return new Response('Configure SITE_URL or Astro site to generate llms.txt.', { status: 500 });
  }

  return new Response(createLlmsTxt(site), {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
};
