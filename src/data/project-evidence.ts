export const projectEvidence = {
  route: '/surse-proiecte/',
  historicalUrl: 'https://sagro.ro/pages/sisteme-irigatii',
  reviewedAtLabel: '12 noiembrie 2026',
} as const;

export const projectHistoricalNote = `Relatăre istorică publicată de Sagro, revizuită la ${projectEvidence.reviewedAtLabel}. Formulările temporale redau materialul istoric, nu o actualizare automată.`;

export function getProjectSourceUrl(slug: string): string {
  return `${projectEvidence.route}#sursa-${slug}`;
}
