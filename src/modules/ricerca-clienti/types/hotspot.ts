export type PriorityLevel = 'high' | 'medium' | 'low';

export type AbatementStatus = 'si' | 'no' | 'non verificato';

export type CompanyMatchStatus =
  | 'demo'
  | 'da verificare'
  | 'simulato'
  | 'futuro Registro Imprese';

export interface Hotspot {
  id: string;
  name: string;
  municipality: string;
  latitude: number;
  longitude: number;
  areaType:
    | 'industrial area'
    | 'production cluster'
    | 'large warehouse'
    | 'metal treatment'
    | 'chemical/plastic'
    | 'food processing'
    | 'coating/painting'
    | 'logistics hub'
    | 'mechanical manufacturing'
    | 'waste treatment';
  mockCompany: string;
  atecoCode: string;
  atecoDescription: string;
  sectorRisk: number;
  score: number;
  priority: PriorityLevel;
  estimatedSizeSqm: number;
  potentialEmissions: string[];
  knownAbatementPlant: AbatementStatus;
  companyMatchStatus: CompanyMatchStatus;
  scoreReason: string;
  suggestedSalesAction: string;
  technicalNotes: string;
  internalCollaborationValue: string;
  strategicDensity: number;
}

export interface HotspotFilters {
  municipality: string;
  priority: PriorityLevel | 'all';
  minScore: number;
  emission: string;
  ateco: string;
  abatementStatus: AbatementStatus | 'all';
}
