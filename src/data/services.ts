export const serviceScopes = [
  {
    title: 'Service și mentenanță după instalare',
    description: 'Solicitările privind funcționarea echipamentelor de irigații sunt evaluate pornind de la tipul instalației și de la descrierea problemei.',
  },
  {
    title: 'Verificări periodice',
    description: 'Verificările pot fi planificate pentru evaluarea stării echipamentului și identificarea lucrărilor de mentenanță potrivite contextului de utilizare.',
  },
  {
    title: 'Diagnostic și intervenții tehnice',
    description: 'Informațiile despre simptome și condițiile de funcționare contribuie la diagnosticarea problemei și la stabilirea intervenției tehnice necesare.',
  },
  {
    title: 'Suport specializat și pregătirea sezonului',
    description: 'Pregătirea sezonului poate include verificarea instalației și a operațiunilor necesare înainte de reluarea irigării.',
  },
] as const;

export const serviceSteps = [
  { title: 'Solicitare și detalii', description: 'Ne spui ce echipament folosești, unde se află și ce simptome ai observat.' },
  { title: 'Evaluare și diagnostic', description: 'Analizăm informațiile și stabilim verificările necesare pentru evaluarea tehnica și diagnostic.' },
  { title: 'Intervenție agreată', description: 'În funcție de evaluare, stabilim lucrările propuse și modul în care va fi realizată intervenția.' },
  { title: 'Verificare și suport', description: 'După lucrările agreate, funcționarea este verificată și discutăm recomandările relevante pentru utilizare.' },
] as const;
