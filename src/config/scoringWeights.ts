import type { ScoringWeights } from '../types/scoring';

export const defaultScoringWeights: ScoringWeights = {
  sectorRisk: 0.35,
  siteSize: 0.2,
  potentialEmissions: 0.2,
  missingAbatement: 0.15,
  strategicDensity: 0.1,
};
