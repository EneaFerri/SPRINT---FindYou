import type { Hotspot } from './hotspot';

export interface ScoringWeights {
  sectorRisk: number;
  siteSize: number;
  potentialEmissions: number;
  missingAbatement: number;
  strategicDensity: number;
}

export interface ScoreBreakdown {
  total: number;
  sectorRisk: number;
  siteSize: number;
  potentialEmissions: number;
  missingAbatement: number;
  strategicDensity: number;
}

export type ScoreInput = Pick<
  Hotspot,
  | 'sectorRisk'
  | 'estimatedSizeSqm'
  | 'potentialEmissions'
  | 'knownAbatementPlant'
  | 'strategicDensity'
>;
