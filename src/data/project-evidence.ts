export const projectEvidence = {
  route: '/surse-proiecte/',
  reviewedAtLabel: '24 noiembrie 2026',
} as const;

export const projectEvidenceNote = 'Localități cu implementări Sagro. Marcajele grupează implementările pe județe.';

export function getProjectSourceUrl(slug: string): string {
  return `${projectEvidence.route}#sursa-${slug}`;
}
