export const primaryRoutes = [
  { href: '/', label: 'Acasă' },
  { href: '/sisteme-irigatii/', label: 'Sisteme de irigații' },
  { href: '/service-mentenanta/', label: 'Service și mentenanță' },
  { href: '/proiecte/', label: 'Proiecte' },
  { href: '/contact/', label: 'Contact' },
] as const satisfies readonly { href: string; label: string }[];

export const supportingRoutes = [
  { href: '/surse-proiecte/', label: 'Surse proiecte' },
] as const satisfies readonly { href: string; label: string }[];

export const legalRoutes = [
  { href: '/politica-confidentialitate/', label: 'Confidențialitate' },
  { href: '/termeni-conditii/', label: 'Termeni și condiții' },
] as const satisfies readonly { href: string; label: string }[];
