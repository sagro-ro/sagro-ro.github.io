export type CountyId = 'ro-cl' | 'ro-il' | 'ro-ct';

export interface Project {
  slug: string;
  name: string;
  clientLabel: string;
  countyId: CountyId;
  countyLabel: string;
  systemLabel: string;
  summary: string;
  quote: string;
  sourceUrl: 'https://sagro.ro/pages/sisteme-irigatii';
}

export const projects = [
  {
    slug: 'calarasi-ferma-vegetala',
    name: 'Irigare uniformă pentru cultura de porumb',
    clientLabel: 'Fermă vegetală',
    countyId: 'ro-cl',
    countyLabel: 'Județul Călărași',
    systemLabel: 'Pivot Zimmatic',
    summary:
      'Un pivot Zimmatic ales prin Sagro pentru irigarea unei suprafețe mari de porumb, cu accent pe distribuția uniformă a apei.',
    quote: 'Am ales un pivot Zimmatic prin Sagro pentru o suprafață mare de porumb.',
    sourceUrl: 'https://sagro.ro/pages/sisteme-irigatii',
  },
  {
    slug: 'ialomita-ferma-baciu',
    name: 'Un sistem folosit de două sezoane',
    clientLabel: 'Ferma Baciu',
    countyId: 'ro-il',
    countyLabel: 'Județul Ialomița',
    systemLabel: 'Sistem de irigații Zimmatic',
    summary:
      'Ferma Baciu folosește sistemul Zimmatic de două sezoane, după sprijinul primit de la Sagro pentru configurare și instalare.',
    quote: 'Folosim sistemul de irigații Zimmatic de două sezoane și suntem foarte mulțumiți.',
    sourceUrl: 'https://sagro.ro/pages/sisteme-irigatii',
  },
  {
    slug: 'constanta-patino-robot',
    name: 'De la analiza terenului la punerea în funcțiune',
    clientLabel: 'Patino Robot',
    countyId: 'ro-ct',
    countyLabel: 'Județul Constanța',
    systemLabel: 'Soluție Zimmatic',
    summary:
      'Pentru soluția Zimmatic propusă de Sagro, echipa a analizat terenul, cultura și sursa de apă, până la punerea în funcțiune.',
    quote: 'Am apreciat foarte mult modul de lucru al echipei Sagro.',
    sourceUrl: 'https://sagro.ro/pages/sisteme-irigatii',
  },
] as const satisfies readonly Project[];
