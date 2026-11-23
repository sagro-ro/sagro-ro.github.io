import type { MediaKey } from './media';

export type SystemKey = 'pivot' | 'liniar' | 'tambur' | 'pompare';

export interface IrrigationSystem {
  readonly key: SystemKey;
  readonly title: string;
  readonly summary: string;
  readonly detail: string;
  readonly mediaKey: MediaKey;
  readonly photographic?: boolean;
}

export const systems: readonly IrrigationSystem[] = [
  {
    key: 'pivot',
    title: 'Pivoți centrali',
    summary: 'Irigare prin aspersie pentru suprafețe întinse, configurată în funcție de parcelă, cultură și resursa de apă.',
    detail: 'Configurarea pornește de la geometria terenului și de la sursa de apă. Se analizează raza de acoperire, punctele de sprijin și modul în care instalația se integrează în lucrările fermei.',
    mediaKey: 'pivotArt',
  },
  {
    key: 'liniar',
    title: 'Sisteme liniare',
    summary: 'Deplasare liniară pentru parcelele la care traseul și geometria terenului cer acest tip de soluție.',
    detail: 'Traseul de deplasare, forma parcelei și alimentarea cu apă trebuie analizate împreună. Soluția este evaluată în contextul fiecărui teren, nu după o schemă universală.',
    mediaKey: 'heroPivot',
    photographic: true,
  },
  {
    key: 'tambur',
    title: 'Sisteme cu tambur',
    summary: 'Mașini mobile de irigat cu furtun, evaluate după condițiile de lucru și modul de utilizare din fermă.',
    detail: 'Lungimea traseului, furtunul, aspersia și posibilitățile de manevrare sunt puse în legătură cu terenul și sursa de apă disponibilă.',
    mediaKey: 'reelArt',
  },
  {
    key: 'pompare',
    title: 'Pompare și alimentare',
    summary: 'Componentele de pompare se aleg în corelație cu sursa de apă și cerințele întregii instalații.',
    detail: 'Sursa de apă, traseul conductelor, necesarul instalației și disponibilitatea energiei sunt analizate ca un singur sistem.',
    mediaKey: 'pumpArt',
  },
];

export const selectionFactors = [
  { title: 'Suprafața și forma parcelei', description: 'Dimensiunile, limitele și traseele de acces influențează configurația.' },
  { title: 'Cultura', description: 'Necesarul de apă și calendarul lucrărilor depind de cultura din fermă.' },
  { title: 'Sursa de apă', description: 'Punctul de alimentare și traseul apei sunt premise ale proiectării.' },
  { title: 'Condițiile de teren', description: 'Relieful, solul și posibilitățile de manevrare intră în evaluarea soluției.' },
  { title: 'Energia electrică', description: 'Disponibilitatea rețelei sau necesarul unei surse alternative influențează alimentarea instalației.' },
] as const;

export const energySupport = {
  title: 'Grup electrogen pentru alimentare independentă',
  description: 'Acolo unde energia electrică din rețea nu este disponibilă, analizăm opțiunea unui grup electrogen în corelație cu necesarul de alimentare al instalației.',
} as const;
